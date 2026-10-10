// Exercise real local Next.js routes without a credential or paid inference.
import assert from 'node:assert/strict';
const base=process.env.TEST_URL || 'http://127.0.0.1:3000';
const start=await fetch(base+'/api/challenges?id=starter').then(r=>r.json());
assert.ok(start.token);assert.ok(!start.scenarios.some(s=>s.verdict||s.lesson));
let token=start.token,result;
for(const [i,verdict] of ['scam','legitimate','suspicious','scam','suspicious'].entries()){
 const r=await fetch(base+'/api/answers',{method:'POST',headers:{'Content-Type':'application/json',Origin:base},body:JSON.stringify({token,scenarioId:start.scenarios[i].id,verdict})});result=await r.json();
 assert.equal(r.status,200,JSON.stringify(result));token=result.token;
}
assert.equal(result.score.correct,5);assert.equal(result.score.xp,575);
if(!start.aiConfigured)assert.equal(result.score.aiTotal,0);
const practice=await fetch(base+'/api/practice',{method:'POST',headers:{'Content-Type':'application/json',Origin:base},body:JSON.stringify({token})}).then(r=>r.json());
assert.ok(practice.scenario);assert.ok(!start.scenarios.some(s=>s.id===practice.scenario.id));
const bad=await fetch(base+'/api/answers',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token,scenarioId:'kyc-1',verdict:'scam'})});assert.equal(bad.status,400);
const crossOrigin=await fetch(base+'/api/answers',{method:'POST',headers:{'Content-Type':'application/json',Origin:'https://unrelated.example'},body:JSON.stringify({token,scenarioId:'kyc-1',verdict:'scam'})});assert.equal(crossOrigin.status,403);
console.log('HTTP flow passed: five answers, 575 XP, honest AI status, unseen practice, replay and foreign origins rejected.');
