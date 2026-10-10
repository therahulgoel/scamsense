import test from 'node:test';
import assert from 'node:assert/strict';
import { scenarios, challenges, visibleScenario, getScenario, scoreAnswers, practiceScenario, VERDICTS } from '../lib/scenarios.mjs';
import { decisionRequest, evaluate, parseDecision } from '../lib/decisions.mjs';
import { signSession, readSession, newSession } from '../lib/session.mjs';
test('All 15 training cases have consistent clues, verdicts and independent grading',()=>{
 assert.equal(scenarios.length,15);assert.equal(new Set(scenarios.map(s=>s.id)).size,15);
 for(const s of scenarios){assert.ok(VERDICTS.includes(s.verdict));assert.ok(s.context);for(const clue of s.evidence)assert.ok(s.message.includes(clue));}
 for(const c of Object.values(challenges)){assert.equal(c.ids.length,5);assert.equal(new Set(c.ids).size,5);assert.ok(c.ids.every(getScenario));}
});
test('Display payload and AI evidence exclude answer key and hidden tactics',()=>{
 const s=scenarios[0],display=visibleScenario(s),input=decisionRequest(s);
 for(const field of ['verdict','evidence','tactics','lesson','action'])assert.equal(display[field],undefined);
 assert.ok(input.input.includes(s.message));assert.ok(input.input.includes(s.context));assert.ok(!input.input.includes(s.lesson));assert.ok(!input.input.includes(s.action));
 assert.equal(input.model,'gpt-6-luna');assert.equal(input.questions[0].type,'choice');
});
test('Streak bonus resets on misses and AI score excludes unavailable cases',()=>{
 const result=scoreAnswers([{correct:true,ai:{status:'live',correct:true}},{correct:true},{correct:true,ai:{status:'unavailable'}},{correct:false},{correct:true,ai:{status:'live',correct:false}}]);
 assert.equal(result.xp,425);assert.equal(result.bestStreak,3);assert.equal(result.streak,1);assert.equal(result.correct,4);assert.equal(result.aiTotal,2);assert.equal(result.aiCorrect,1);
});
test('Practice selects an unseen case matching a missed tactic',()=>{
 const history=challenges.starter.ids.map(id=>({id,correct:id!=='kyc-1'}));const {scenario,focus}=practiceScenario(history);
 assert.ok(!history.some(a=>a.id===scenario.id));assert.ok(scenario.tactics.includes(focus));assert.ok(['urgency','impersonation'].includes(focus));
});
test('Signed sessions reject tampering, expired rounds and out-of-range IDs',()=>{
 const s=newSession(challenges.starter),token=signSession(s);assert.deepEqual(readSession(token),s);
 assert.throws(()=>readSession(token.replace(/^./,token[0]==='a'?'b':'a')));
 assert.throws(()=>readSession(signSession({...s,expires:Date.now()-1})));
 assert.throws(()=>readSession(signSession({...s,ids:['fake']})));
});
test('Refusal, malformed and unavailable responses never invent AI answers',async()=>{
 assert.equal(parseDecision({answers:[{name:'verdict',type:'refusal'}]}).status,'unavailable');
 assert.equal(parseDecision({answers:[{name:'verdict',type:'choice',choice:'something'}]}).status,'unavailable');
 assert.equal((await evaluate(scenarios[0],{apiKey:''})).status,'unavailable');
 const data={answers:[{type:'choice',name:'verdict',choice:'scam'},{type:'predicate',name:'urgency',probability:.9},{type:'predicate',name:'payment',probability:4}]};
 assert.equal(parseDecision(data).tactics.length,1);
});
test('Live request uses the private key, fixed endpoint and visible evidence',async()=>{
 const ai=await evaluate(scenarios[0],{apiKey:'test-key',fetcher:async(url,options)=>{assert.equal(url,'https://api.openai.com/v1/decisions');assert.equal(options.headers.Authorization,'Bearer test-key');assert.equal(JSON.parse(options.body).model,'gpt-6-luna');return {ok:true,json:async()=>({answers:[{type:'choice',name:'verdict',choice:'scam'}]})};}});
 assert.equal(ai.status,'live');assert.equal(ai.verdict,'scam');assert.ok(Number.isFinite(ai.elapsedMs)&&ai.elapsedMs>=0);
});
test('HTTP errors and connection failures preserve training mode',async()=>{
 for(const fetcher of [async()=>({ok:false,status:429}),async()=>{throw new Error('network');}])assert.equal((await evaluate(scenarios[0],{apiKey:'test-key',fetcher})).status,'unavailable');
});
