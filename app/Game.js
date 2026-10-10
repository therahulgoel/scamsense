'use client';
import { useEffect, useRef, useState } from 'react';
const labels = { legitimate: 'Likely legitimate', suspicious: 'Suspicious · verify', scam: 'Clear scam' };
const tactics = { urgency: 'Pressure & urgency', impersonation: 'Impersonation', payment: 'Upfront payment', credentials: 'Sensitive information', context: 'Missing context' };
const packs = [ { id:'starter', name:'First instincts', tag:'Rookie', text:'Spot the loud traps.', icon:'✦' }, { id:'tricky', name:'Look a little closer', tag:'Detective', text:'Read between the lines.', icon:'◎' }, { id:'expert', name:'Trust, then verify', tag:'Expert', text:'Don’t distrust everything.', icon:'◇' } ];
const icons = { KYC:'🏦', UPI:'💸', Parcel:'📦', Jobs:'💼', Electricity:'⚡' };
const blankScore = { xp:0, streak:0, bestStreak:0, correct:0, total:0, aiCorrect:0, aiTotal:0 };
function Mascot({ small = false, mood = 'happy' }) { return <div className={`mascot ${small?'small':''} ${mood}`} aria-hidden="true"><div className="antenna"/><div className="face"><span className="eye"/><span className="eye"/></div><div className="smile"/><span className="cheek left"/><span className="cheek right"/></div>; }
function SmsThread({ sender, message, clues, verdict, preview = false }) {
 return <article className={`sms-thread ${preview?'sms-preview':''}`} aria-label={preview?'Fictional SMS preview':'Simulated SMS conversation'}>
  <div className="phone-status" aria-hidden="true"><strong>9:41</strong><span className="phone-island"/><span>▥ ◒ ▰</span></div>
  <div className="messages-toolbar"><span className="messages-back" aria-hidden="true">‹</span><span>Messages</span><span className="simulation-chip">SIMULATION</span></div>
  <div className="contact-header"><span className="contact-avatar" aria-hidden="true">{sender.slice(0,2)}</span><strong>{sender}</strong><span>Sender name is not proof of identity</span></div>
  <div className="message-timeline"><span>Text Message · SMS</span><span>Today, 9:41 AM</span></div>
  <div className="incoming-message"><div className="sms-body"><Highlight text={message} clues={clues}/></div></div>
  {verdict&&<div className="outgoing-verdict"><span>Your verdict · not a reply</span><div>{labels[verdict]} <span aria-hidden="true">✓</span></div></div>}
  <div className="thread-safety">Fictional training SMS · Links are disabled</div><div className="phone-home" aria-hidden="true"/>
 </article>;
}
function DecisionFlow({ busy = false, ai, verdict }) {
 const live=ai?.status==='live';
 return <div className={`decision-flow ${busy?'deciding':''} ${live?'decision-complete':''}`} role="status" aria-live="polite">
  <div className="decision-flow-title"><span className="decision-glyph" aria-hidden="true">✳</span><div><span>POWERED BY OPENAI</span><strong>Decisions API</strong></div><span className="decision-state">{busy?'REQUESTING':live?'RESPONSE RECEIVED':ai?'UNAVAILABLE':'YOUR MOVE'}</span></div>
  <div className="decision-path" aria-hidden="true"><span className={busy||ai?'path-done':''}>Your call</span><i/><span className={busy?'path-active':live?'path-done':''}>AI decision</span><i/><span className={ai?'path-done':''}>The reveal</span></div>
  <p>{busy?<>Your <strong>{labels[verdict]?.toLowerCase()}</strong> verdict is locked. OpenAI is evaluating the same SMS and context.<span className="thinking-dots" aria-hidden="true"><i/><i/><i/></span></>:live?<>Real response{Number.isFinite(ai.elapsedMs)?` · ${(ai.elapsedMs/1000).toFixed(2)}s`:''}. Independent prediction. Now compare your instincts.</>:ai?'AI is unavailable for this case. Your reviewed lesson and score still count.':'Lock in your answer to challenge OpenAI’s Decisions API. No prerecorded AI verdicts.'}</p>
 </div>;
}
function CaseReveal({ current, reveal, score, practice, next, index, headingRef }) {
 const live = reveal.ai.status === 'live';
 const headline = { scam: 'This one is a scam.', suspicious: 'This one needs a check.', legitimate: 'This one checks out.' }[reveal.groundTruth];
 const result = !live ? (reveal.correct?'You got it.':'A useful one to learn.') : reveal.correct ? (reveal.ai.correct?'You and AI got it.':'You caught what AI missed.') : (reveal.ai.correct?'AI spotted this one.':'This one fooled you both.');
 const habit = reveal.groundTruth==='legitimate'?'Trust independent confirmation, not a sender name.':reveal.groundTruth==='suspicious'?'Missing details? Verify before you act.':reveal.tactics.includes('credentials')?'Keep passwords, PINs and OTPs to yourself.':reveal.tactics.includes('urgency')?'Urgency is your cue to slow down.':'Pause before paying to unlock a promise.';
 return <div className="learning-reveal"><div className="result-overview">
  <div className={`outcome-heading ${reveal.correct?'outcome-correct':'outcome-learn'}`}>
   <div className="outcome-kicker"><span>{reveal.correct?'✓ CORRECT':'↗ LEARNING MOMENT'}</span>{reveal.correct&&!practice&&<strong>+{score.streak>=3?125:100} XP</strong>}</div>
   <h2 ref={headingRef} tabIndex={-1}>{headline}</h2><p>{result} {reveal.correct?'Keep this clue for the next message.':'Here’s the clue to take into the next case.'}</p>
  </div>
  <section className="decision-match" aria-label="Your answer versus OpenAI Decisions API">
   <div className="decision-match-top"><span>YOU vs <strong>OPENAI DECISIONS API</strong></span><span className={`api-status-chip ${live?'':'api-offline'}`}>{live?'● LIVE RESPONSE':'AI UNAVAILABLE'}</span></div>
   <div className="answer-comparison"><div><span className="comparison-label">Your answer</span><strong>{labels[reveal.verdict]}</strong><span className={reveal.correct?'answer-right':'answer-missed'}>{reveal.correct?'✓ Correct':'↗ Missed this one'}</span></div><div><span className="comparison-label">AI’s answer</span><strong>{live?labels[reveal.ai.verdict]:'Unavailable'}</strong><span className={live&&reveal.ai.correct?'answer-right':'answer-missed'}>{live?(reveal.ai.correct?'✓ Correct':'↗ Missed this one'):'Excluded from AI score'}</span></div></div>
   <p className="match-proof">{live?<>Real API prediction{Number.isFinite(reveal.ai.elapsedMs)?` · ${(reveal.ai.elapsedMs/1000).toFixed(2)}s`:''}. Same evidence. Both scored against the authored answer key.</>:reveal.ai.reason}</p>
  </section>
  </div><div className="result-learning"><section className="learning-clue" aria-labelledby="clue-heading"><span className="lesson-step">01 · NOTICE THE CLUE</span><h3 id="clue-heading">{reveal.groundTruth==='legitimate'?'What makes the difference':'The clue to remember'}</h3><div className="evidence-quotes">{reveal.evidence.map(clue=><blockquote key={clue}>“{clue}”</blockquote>)}</div><p>{reveal.lesson}</p>
   <details className="original-message"><summary>Revisit the message and context <span aria-hidden="true">↗</span></summary><SmsThread sender={current.sender} message={current.message} clues={reveal.evidence}/><div className="context-note"><div><strong>Context provided to you and AI</strong><p>{current.context}</p></div></div></details>
  </section>
  <section className="learning-action"><span className="lesson-step">02 · CHOOSE THE SAFER MOVE</span><p>{reveal.action}</p><div className="memory-rule"><span aria-hidden="true">✦</span><div><strong>Take this habit with you</strong><span>{habit}</span></div></div></section>
  </div><div className="reveal-navigation"><button className="primary next-button" onClick={next}>{practice?'Back to my result':index===4?'Open my results':'Next case'}<span aria-hidden="true">→</span></button><p className="next-encouragement">{practice?'Your original round score stays the same.':index===4?'See your score and choose what to practise next.':'A fresh message. Put that instinct to work.'}</p>
  </div><details className="ai-details judge-details"><summary>Explore the real Decisions response <span aria-hidden="true">↗</span></summary>{live?<><div className="api-receipt"><span className="receipt-badge">ACTUAL API RESPONSE</span><p><strong>One request, two useful outputs.</strong> A <code>choice</code> selects the verdict. Four <code>predicate</code> questions estimate the tactics present.</p><dl><div><dt>Provider / model</dt><dd>OpenAI / {reveal.ai.model}</dd></div><div><dt>Endpoint</dt><dd>POST /v1/decisions</dd></div>{Number.isFinite(reveal.ai.elapsedMs)&&<div><dt>Response time</dt><dd>{(reveal.ai.elapsedMs/1000).toFixed(2)} seconds</dd></div>}</dl><p>The API received the sender, SMS and visible context. It did not receive your answer or the training label. This is the saved response for this case, not a new request.</p></div><h3>What the AI detected</h3><p>These are model estimates of tactic presence, not proof of fraud. The learning explanation above comes from authored training content.</p>{reveal.ai.tactics.map(t=><div className="signal-row" key={t.name}><span>{tactics[t.name]}</span><strong>{Math.round(t.probability*100)}%</strong><div className="signal-track"><span style={{width:`${t.probability*100}%`}}/></div></div>)}</>:<p className="offline-explanation">No verified API response was available. No AI verdict was invented. The authored answer key still grades your choice and provides the lesson.</p>}</details>
 </div>;
}
function Arrow() { return <span aria-hidden="true">↗</span>; }
function Highlight({ text, clues }) {
 if (!clues?.length) return text;
 const parts = text.split(new RegExp(`(${clues.map(c => c.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|')})`,'g'));
 return parts.map((part,i)=>clues.includes(part)?<mark key={i}>{part}</mark>:part);
}
async function request(url, options = {}) {
 const response = await fetch(url, { ...options, signal: AbortSignal.timeout(17000) });
 const result = await response.json();
 if (!response.ok) throw new Error(result.error || 'Something went wrong. Try again.');
 return result;
}
const post = (url, body) => request(url,{ method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body) });
export default function Game() {
 const [screen,setScreen] = useState('home');
 const [selected,setSelected] = useState('starter');
 const [game,setGame] = useState(null);
 const [practice,setPractice] = useState(null);
 const [busy,setBusy] = useState(false);
 const [pendingVerdict,setPendingVerdict] = useState(null);
 const [error,setError] = useState('');
 const [notice,setNotice] = useState('');
 const [shareLink,setShareLink] = useState('');
 const [friend,setFriend] = useState(null);
 const [about,setAbout] = useState(false);
 const headingRef = useRef(null);
 const modalRef = useRef(null);
 const aboutTriggerRef = useRef(null);
 const [ready,setReady] = useState(false);
 useEffect(()=>{
 const params=new URLSearchParams(window.location.search);
 const id=params.get('challenge');
 if(packs.some(p=>p.id===id)) { setSelected(id); const score=Number(params.get('score')); if(params.has('score')&&Number.isInteger(score)&&score>=0&&score<=5)setFriend({score}); }
 try { const saved=JSON.parse(localStorage.getItem('scamsense-v1')); if(saved?.version===1&&saved.game?.scenarios?.length===5&&saved.game.results?.length<=5&&Number.isInteger(saved.game.index)&&saved.game.index>=0&&saved.game.index<5&&typeof saved.game.token==='string'&&['home','play','reveal','results'].includes(saved.screen)&&(!id||id===saved.game.challenge.id)){setGame(saved.game);setScreen(saved.screen);setSelected(saved.game.challenge.id);} } catch {}
 setReady(true);
 },[]);
 useEffect(()=>{if(!ready)return; try{ if(game)localStorage.setItem('scamsense-v1',JSON.stringify({version:1,game,screen:practice?'results':screen})); else localStorage.removeItem('scamsense-v1'); }catch{}},[game,screen,practice,ready]);
 useEffect(()=>{if(screen!=='home')headingRef.current?.focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant'});},[screen,practice?.scenario?.id]);
 useEffect(()=>{if(!notice)return;const id=setTimeout(()=>setNotice(''),4500);return()=>clearTimeout(id);},[notice]);
 useEffect(()=>{if(about)modalRef.current?.showModal();else if(modalRef.current?.open)modalRef.current.close();},[about]);
 async function start(id=selected){setBusy(true);setError('');setNotice('');try{const data=await request(`/api/challenges?id=${encodeURIComponent(id)}`);setGame({...data,index:0,results:[],score:blankScore});setPractice(null);setScreen('play');setSelected(id);}catch(e){setError(e.name==='TimeoutError'?'The server took too long. Try again.':e.message);}finally{setBusy(false);}}
 async function answer(verdict){if(busy)return;setPendingVerdict(verdict);setBusy(true);setError('');const current=practice?practice.scenario:game.scenarios[game.index];try{const data=await post('/api/answers',{token:practice?practice.token:game.token,scenarioId:current.id,verdict});if(practice)setPractice({...practice,...data});else setGame({...game,token:data.token,results:[...game.results,data.answer],score:data.score});setScreen('reveal');}catch(e){setError(e.name==='TimeoutError'?'The connection took too long. Retry your answer; your progress is safe.':e.message);}finally{setBusy(false);}}
 function next(){setError('');if(practice){setPractice(null);setScreen('results');}else if(game.index===4)setScreen('results');else{setGame({...game,index:game.index+1});setScreen('play');}}
 async function train(){setBusy(true);setError('');try{const data=await post('/api/practice',{token:game.token});setPractice(data);setScreen('play');}catch(e){setError(e.message);}finally{setBusy(false);}}
 function challengeURL(){const url=new URL(window.location.origin);url.searchParams.set('challenge',game.challenge.id);url.searchParams.set('score',String(game.score.correct));return url.toString();}
 async function share(){const url=challengeURL();setShareLink(url);const aiLine=game.score.aiTotal===5?` AI got ${game.score.aiCorrect}/5.`:'';const text=`I scored ${game.score.correct}/5 on ScamSense.${aiLine} Five texts. One scam showdown. Can you beat me?`;try{if(navigator.share){await navigator.share({title:'ScamSense — challenge accepted?',text,url});setNotice('Challenge shared.');}else{await navigator.clipboard.writeText(`${text}\n${url}`);setNotice('Challenge copied. Send it to a friend.');}}catch(e){if(e.name!=='AbortError')setNotice('Copy the challenge link below to share.');}}
 function downloadCard(){const canvas=document.createElement('canvas');canvas.width=1080;canvas.height=1350;const ctx=canvas.getContext('2d');ctx.fillStyle='#f6f2ff';ctx.fillRect(0,0,1080,1350);ctx.fillStyle='#e8daff';ctx.beginPath();ctx.roundRect(65,190,950,940,65);ctx.fill();ctx.textAlign='center';ctx.fillStyle='#6e4bd5';ctx.font='bold 46px system-ui';ctx.fillText('SCAMSENSE',540,120);ctx.font='bold 86px system-ui';ctx.fillText('Nice try, scammer.',540,345);ctx.font='bold 210px system-ui';ctx.fillText(`${game.score.correct}/5`,540,675);ctx.fillStyle='#34204d';ctx.font='36px system-ui';ctx.fillText('SMS messages judged correctly',540,750);ctx.font='bold 48px system-ui';ctx.fillText('Can you beat me?',540,930);ctx.font='28px system-ui';ctx.fillText(game.score.aiTotal===5?`Real AI scored ${game.score.aiCorrect}/5. Your move.`:'Five texts. One scam showdown.',540,1000);ctx.fillText(window.location.host,540,1175);ctx.font='25px system-ui';ctx.fillText('Built by @therahulgoel',540,1250);canvas.toBlob(blob=>{if(!blob)return;const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download='scamsense-challenge.png';link.click();setTimeout(()=>URL.revokeObjectURL(url),10000);});}
 function home(){setScreen('home');setPractice(null);setError('');setShareLink('');setNotice('');}
 const score=game?.score || blankScore;
 const current=practice?.scenario || game?.scenarios[game.index];
 const reveal=practice?.answer || game?.results[game?.index];
 const misses=game?.results.filter(a=>!a.correct)||[];
 const focus=misses.flatMap(a=>a.tactics)[0];
 const perfect=score.correct===5;
 const fullAI=score.aiTotal===5;
 const battle=fullAI?(score.correct>score.aiCorrect?'You beat the AI.':score.correct===score.aiCorrect?'You and AI tied.':'AI takes this round.'):'Your instincts, sharpened.';
 return <div className={`app screen-${screen}`}>
 <a className="skip-link" href="#main-content">Skip to game</a>
 <div className="background-orb orb-one" aria-hidden="true"/><div className="background-orb orb-two" aria-hidden="true"/>
 <div className="launch-strip"><span className="launch-pill">BUILT FOR DEVDAY COMMUNITY EVENT BENGALURU 2026</span><span>Play against OpenAI’s new <strong>Decisions API</strong></span><a href="https://developers.openai.com/api/docs/changelog" target="_blank" rel="noreferrer">Beta released Oct 6 ↗</a></div>
 <header className="topbar"><button className="wordmark" onClick={home} disabled={busy} aria-label="ScamSense home"><span className="logo">s<span>✦</span></span>scamsense<span className="brand-dot">.</span></button><nav aria-label="Main navigation"><span className="built-badge">Five texts. One scam showdown.</span><button ref={aboutTriggerRef} className="about-button" onClick={()=>setAbout(true)}>How to play <span aria-hidden="true">?</span></button></nav></header>
 <main id="main-content" tabIndex={-1}>
 {screen==='home'&&<section className="home-layout">
 <div className="hero-copy">
 <span className="eyebrow"><span className="live-dot"/> THE TWO-MINUTE SCAM SHOWDOWN</span>
 <h1>Think you’re<br/><span className="purple-word">unscammable?</span></h1>
 <p className="hero-sub">Practise spotting SMS scams in five texts.<br/>Make your call. Compare with live AI.</p>
 <div className="hero-pills"><span>5 cases</span><span>2 minutes</span><span>No signup</span></div>
 {friend&&<div className="friend-callout"><span aria-hidden="true">🎯</span><div><strong>Your friend scored {friend.score}/5. Your move.</strong><small>Same cases. Shared scores are self-reported.</small></div></div>}
 <button className="primary hero-cta" onClick={()=>start()} disabled={busy}>{busy?'Opening your case file…':friend?'Accept the challenge':'Take on the AI'}<Arrow/></button>
 {game&&<button className="resume-button" onClick={()=>{setPractice(null);setError('');setScreen(game.results.length===5?'results':game.results[game.index]?'reveal':'play');}} disabled={busy}>{game.results.length===5?'View your last result':`Resume your round · ${game.results.length}/5 answered`} <span aria-hidden="true">→</span></button>}
 <p className="hero-fine">Fictional SMS. Real AI decisions. Useful instincts.</p>
 <a className="powered-link" href="#real-ai">Powered by OpenAI Decisions API <span aria-hidden="true">↘</span></a>
 </div>
 <div className="hero-art" aria-label="Preview of the SMS challenge; no AI prediction is shown">
 <div className="arena-heading"><span>THE MATCHUP</span><span className="arena-count">YOU × AI</span></div>
 <div className="arena-players"><div><span className="player-avatar human-avatar" aria-hidden="true">✌</span><strong>Your instincts</strong><span>Street-smart. Hopefully.</span></div><span className="arena-vs">VS</span><div><span className="player-avatar bot-avatar"><Mascot small/></span><strong>OpenAI Decisions</strong><span>Same texts. Same evidence.</span></div></div>
 <SmsThread preview sender="VM-WINNER" message="You won ₹50,000! Pay a small fee to claim it."/>
 <div className="arena-note"><span aria-hidden="true">✦</span> You lock in first. Then the AI reveals its call.</div>
 </div>
 <div className="pack-row"><div className="pack-heading"><span className="eyebrow">CHOOSE YOUR CHALLENGE</span><span className="mini-note">15 fictional messages. Three levels of doubt.</span></div><div className="pack-grid">{packs.map((p,i)=><button key={p.id} className={`pack ${selected===p.id?'selected':''}`} onClick={()=>{setSelected(p.id);setFriend(null);}} aria-pressed={selected===p.id} disabled={busy}><span className={`pack-icon pack-icon-${i}`}>{p.icon}</span><span className="pack-copy"><span className="pack-tag">{p.tag}</span><strong>{p.name}</strong><small>{p.text}</small></span><span className="pack-check" aria-hidden="true">{selected===p.id?'✓':'↗'}</span></button>)}</div></div>
 <section className="integration-section" id="real-ai" aria-labelledby="integration-title">
 <div className="integration-heading"><span className="eyebrow">OPENAI DECISIONS API · PUBLIC BETA</span><h2 id="integration-title">A new API.<br/>A real showdown.</h2><p>Released by OpenAI on October 6, 2026. Put the new Decisions API to the test: you choose first, it makes an independent call, and you both face the same answer key.</p><a href="https://developers.openai.com/api/docs/guides/decisions" target="_blank" rel="noreferrer">Explore the Decisions API ↗</a></div>
 <div className="integration-steps"><div><span>01</span><div><h3>You make the call</h3><p>Read the SMS and its context. Trust, verify, or spot the scam.</p></div></div><div><span>02</span><div><h3>Decisions makes its call</h3><p>A live request chooses a verdict and estimates the scam tactics present.</p></div></div><div><span>03</span><div><h3>Both face the answer key</h3><p>Authored training labels score you both fairly. The AI can be wrong, too.</p></div></div></div>
 <div className="honesty-note"><strong>Real predictions. Fictional situations.</strong><span>15 authored training cases. No canned AI verdicts. If the API is unavailable, we say so.</span></div>
 </section>
 <section className="purpose-summary" aria-labelledby="purpose-title"><div><span className="eyebrow">PRACTICE FOR REAL-LIFE MESSAGES</span><h2 id="purpose-title">Learn when to trust. When to check. When to stop.</h2><p>An urgent KYC alert. A parcel update. A payment request. Practise with fictional Indian SMS scenarios, learn the evidence behind each answer, and take a safer habit into your next real conversation.</p></div><a href="/about">Why ScamSense? Problem, usage &amp; how it works →</a></section>
 <section className="family-pitch"><span aria-hidden="true">↗</span><div><h2>Win the round. Pass on the instinct.</h2><p>Challenge the family group. Start a conversation before the next suspicious message arrives.</p></div><button className="secondary" onClick={()=>start()} disabled={busy}>Play, then challenge a friend →</button></section>
 </section>}
 {game&&(screen==='play'||screen==='reveal')&&<section className="play-layout" key={`${current.id}-${screen}`}>
 <aside className="session-bar" aria-label="Round progress"><button className="text-button" onClick={home} disabled={busy}>← Case files</button><span className="session-name">{practice?`Practice · ${practice.focus}`:game.challenge.name}</span><div className="session-scores"><span>You <strong>{score.correct}/{score.total}</strong></span><span>AI <strong>{score.aiTotal?`${score.aiCorrect}/${score.aiTotal}`:'—'}</strong></span></div></aside>
 <div className="game-panel"><div className="round-ai-status"><span className={game.aiConfigured?"status-dot":"status-dot offline"}/>{game.aiConfigured?"Opponent: OpenAI Decisions API":"AI unavailable · training mode"}</div><div className="game-hud"><span className="level-pill">🔎 {practice?'Practice':game.challenge.level}</span><span className="streak-pill">{score.streak>=2?'🔥':'✦'} {score.streak>=2?`${score.streak} streak`:`${score.xp} XP`}</span></div><div className="progress-row" aria-label={practice?'Practice case':`Case ${game.index+1} of 5`}>{(practice?[0]:[0,1,2,3,4]).map(i=><span key={i} className={practice||i<=game.index?'filled':''}/>)}</div>
 <div className="case-title"><span className="eyebrow">{practice?'BONUS CASE':`CASE 0${game.index+1} / 05`} · {current.category.toUpperCase()}{screen==='reveal'?` · ${current.title}`:''}</span>{screen==='play'&&<h2 ref={headingRef} tabIndex={-1}>{current.title}</h2>}</div>
 {screen==='play'?<>
 <div className="question-layout"><div className="reading-column"><SmsThread key={current.id} sender={current.sender} message={current.message} verdict={busy?pendingVerdict:null}/>
 <div className="context-note"><span aria-hidden="true">◎</span><div><strong>Before you decide</strong><p>{current.context}</p></div></div>
 </div><div className="answer-column"><h3 className="your-call">Would you trust this message?</h3><p className="answer-instruction">Use the message and context. Choose one answer.</p><div className="choices">{[['legitimate','✓','Likely legitimate','The context supports it'],['suspicious','?','Suspicious','Verify before you act'],['scam','!','Clear scam','A clear attempt to trick you']].map(([value,symbol,name,description])=><button key={value} className={`choice choice-${value}`} onClick={()=>answer(value)} disabled={busy}><span className="choice-symbol">{symbol}</span><span><strong>{name}</strong><small>{description}</small></span><span className="choice-arrow">→</span></button>)}</div><DecisionFlow busy={busy} verdict={pendingVerdict}/></div></div>
 </>:reveal&&<CaseReveal current={current} reveal={reveal} score={score} practice={practice} next={next} index={game.index} headingRef={headingRef}/>}

 </div></section>}
 {game&&screen==='results'&&<section className="result-layout"><div className="result-intro"><span className="eyebrow">CASE FILE CLOSED · {game.challenge.level.toUpperCase()}</span><h1 ref={headingRef} tabIndex={-1}>{perfect?<>Sharp eyes.<br/><span className="purple-word">Nice instincts.</span></>:<>A little wiser.<br/><span className="purple-word">A lot sharper.</span></>}</h1><p>{battle} {fullAI?'Both judged the same five messages against the reviewed answers.':'Keep playing to build your scam-spotting instincts.'}</p><div className="result-coach"><span className="coach-icon">{perfect?'✦':'◎'}</span><div><strong>{perfect?'Perfect round. Keep your guard up.':focus?`Next skill: ${tactics[focus].toLowerCase()}.`:'Next skill: independent verification.'}</strong><p>{perfect?'Try a fresh case. New stories can hide familiar traps.':'One round is a starting point. Practice a clue you missed.'}</p></div></div><button className="primary" disabled={busy} onClick={train}>{busy?'Finding your practice case…':perfect?'Try a fresh case':'Practice a missed clue'}<span aria-hidden="true">→</span></button><button className="text-button result-home" disabled={busy} onClick={home}>← Explore another case file</button></div>
 <div className="result-ticket"><div className="ticket-top"><span className="tiny-label">SCAMSENSE FIELD REPORT</span><span className="ticket-star">✦</span></div><div className="trophy" aria-hidden="true">{perfect?'🏆':'🔎'}</div><span className="ticket-rank">{perfect?'ALL FIVE, WELL SPOTTED':'SMS DETECTIVE'}</span><div className="ticket-score">{score.correct}<span>/ 5</span></div><p className="ticket-caption">messages judged correctly</p><div className="ticket-metrics"><div><strong>{score.xp}</strong><span>XP earned</span></div><div><strong>{score.bestStreak}</strong><span>Best streak</span></div><div><strong>{score.aiTotal?`${score.aiCorrect}/${score.aiTotal}`:'—'}</strong><span>AI correct{score.aiTotal<5?' · available cases':''}</span></div></div><div className="ticket-divider"/><button className="primary share-button" onClick={share}>Challenge a friend<Arrow/></button><button className="secondary" onClick={downloadCard}>Save my score card ↓</button>{shareLink&&<label className="share-url">Your challenge link<input readOnly value={shareLink} onFocus={e=>e.target.select()}/></label>}<a className="ticket-credit creator-follow" href="https://x.com/therahulgoel" target="_blank" rel="noopener noreferrer">Follow @therahulgoel on X ↗</a><span className="ticket-fine">Built by @therahulgoel</span><span className="ticket-fine">Practice results don’t establish real-world safety.</span></div></section>}
 {error&&<div className="error-banner" role="alert"><span>{error}</span>{screen!=='home'&&<button disabled={busy} onClick={()=>start()}>Start a fresh round</button>}</div>}
 {notice&&<div className="toast" role="status">✓ {notice}</div>}
 </main>
 <footer className="footer"><span>Built by <a href="https://x.com/therahulgoel" target="_blank" rel="noopener noreferrer"><strong>@therahulgoel</strong></a></span><a className="creator-follow" href="https://x.com/therahulgoel" target="_blank" rel="noopener noreferrer">Follow on X ↗</a><a href="/about">Why ScamSense? How it works →</a><a href="https://developers.openai.com/api/docs/guides/decisions" target="_blank" rel="noreferrer">Built with Codex · OpenAI Decisions API ↗</a></footer>
 <dialog ref={modalRef} className="how-modal" onCancel={()=>setAbout(false)} onClose={()=>{setAbout(false);aboutTriggerRef.current?.focus();}}><button className="modal-close" onClick={()=>setAbout(false)} aria-label="Close how to play">×</button><span className="eyebrow">WELCOME, DETECTIVE</span><h2>Spot the trap.<br/>Learn the clue.</h2><ol><li>Read the SMS and the visible context.</li><li>Choose likely legitimate, suspicious, or clear scam.</li><li>Compare your verdict with AI and the reviewed answer.</li><li>Practice a missed tactic and challenge a friend.</li></ol><p>100 XP per correct answer. From your third consecutive correct answer, earn 25 bonus XP per catch. An incorrect answer resets the streak.</p><p>AI sees the same evidence as you. It never determines the answer key. Unavailable AI responses are excluded from AI accuracy.</p><button className="primary" onClick={()=>setAbout(false)}>Got it. Let’s play.<span>→</span></button></dialog>
 </div>;
}
