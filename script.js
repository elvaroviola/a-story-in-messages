const screen = document.getElementById('screen');
const state = { playerName:'', affection:0, trust:0, compatibility:0, episode:1, locked:false };

const profiles = {
  Keonho:'assets/keonho.png',
  Martin:'assets/martin.jpeg',
  Elvaro:'assets/elvaro.png',
  Sanghyeon:'assets/seonghyeon.jpeg',
  Silvia:'assets/silvia.jpeg'
};
const group = { name:'Fresher Group 7 🎓', sub:'UMN · Communication Science · 2020' };

const sleep = ms => new Promise(r=>setTimeout(r,ms));
const esc = s => String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[c]));

function startScreen(){
  screen.innerHTML=`<div class="screen center fade">
    <div class="status">9:41</div>
    <div class="eyebrow">A little chat story · UMN · 2020</div>
    <h1>A Story<br><span class="script">in Messages</span></h1>
    <p class="subtitle">Same university. Different screens. Same feelings.<br><br>A tiny interactive story about meeting the right people at the most unexpected time.</p>
    <button class="primary" id="start">START YOUR STORY →</button>
    <div class="small-note">made for one very specific group of friends ♡</div>
  </div>`;
  document.getElementById('start').onclick=nameScreen;
}
function nameScreen(){
  screen.innerHTML=`<div class="screen center fade">
    <div class="eyebrow">Before we begin</div><h1>What's your<br><span class="script">name?</span></h1>
    <p class="subtitle">This story will be yours. Your name will appear naturally inside the conversations.</p>
    <div class="name-wrap"><input id="name" class="name-input" maxlength="24" placeholder="Enter your name..." autocomplete="off"><button class="primary" id="continue">CONTINUE →</button></div>
  </div>`;
  const go=()=>{const n=document.getElementById('name').value.trim();if(!n)return;state.playerName=n;intro();};
  document.getElementById('continue').onclick=go; document.getElementById('name').addEventListener('keydown',e=>e.key==='Enter'&&go());
}
function intro(){
  screen.innerHTML=`<div class="screen center fade"><div class="eyebrow">Nice to meet you,</div><h1>${esc(state.playerName)}.</h1><p class="subtitle">Your story begins with a group chat, a university orientation, and five people who definitely did not expect to end up in the same room.</p><button class="primary" id="begin">TAP TO CONTINUE</button></div>`;
  document.getElementById('begin').onclick=()=>episodeBanner(1,runEpisode1);
}

function episodeBanner(n,next){
  screen.innerHTML=`<div class="screen episode-card fade"><div><div class="eyebrow">September 2020 · UMN</div><h2>Episode ${n}</h2><div class="conclusion">Conclusion</div><p class="subtitle" style="margin:20px auto 0">${n===1?'Nice to Meet You':n===2?'Are You Still Awake?':'The Group Chat'}</p><button class="primary" id="openEpisode">OPEN EPISODE ${n} →</button></div></div>`;
  document.getElementById('openEpisode').onclick=next;
}

function chatShell({type='group',name,status='online',avatar=null,sub=group.sub}){
  const isGroup=type==='group';
  screen.innerHTML=`<div class="chat-page fade"><header class="chat-header">${isGroup?'<div class="group-icon">G7</div>':`<img class="avatar" src="${avatar}" alt="">`}<div class="header-copy"><div class="header-name">${esc(name)}</div><div class="header-status">${esc(status)}</div></div><div class="header-meta">${isGroup?'•••':'⋯'}</div></header><div id="chat" class="chat-scroll"><div class="date-divider">${esc(sub)}</div></div><div id="choices" class="choice-wrap" style="display:none"></div></div>`;
}
function appendTyping(chat, profile){
  const row=document.createElement('div');row.className='msg-row fade';row.innerHTML=`<img class="msg-avatar" src="${profile}" alt=""><div class="typing"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>`;chat.appendChild(row);chat.scrollTop=chat.scrollHeight;return row;
}
async function message(chat, who, text, time, opts={}){
  const me=who==='Player';
  if(!me && opts.typing!==false){const t=appendTyping(chat,profiles[who]);await sleep(opts.delay ?? 1200);t.remove();}
  const row=document.createElement('div');row.className=`msg-row ${me?'me':''} fade`;
  row.innerHTML=me?`<div class="msg-stack"><div class="bubble">${esc(text)}</div><div class="time">${esc(time||'now')} ✓✓</div></div>`:`<img class="msg-avatar" src="${profiles[who]}" alt=""><div class="msg-stack"><div class="sender">${esc(who)}</div><div class="bubble">${esc(text)}</div><div class="time">${esc(time||'now')}</div></div>`;
  chat.appendChild(row);chat.scrollTop=chat.scrollHeight;await sleep(opts.after ?? (me?850:950));
}
function showChoices(items,onPick){
  const box=document.getElementById('choices');box.style.display='block';box.innerHTML=`<div class="choice-title">How do you want to respond?</div>`+items.map((x,i)=>`<button class="choice" data-i="${i}">${esc(x.text)}</button>`).join('');
  [...box.querySelectorAll('.choice')].forEach(b=>b.onclick=()=>{box.style.display='none';onPick(items[Number(b.dataset.i)]);});
}
async function finishEpisode(n,next){
  await sleep(700);screen.innerHTML=`<div class="screen episode-card fade"><div><div class="eyebrow">A chapter has ended</div><h2>End of Episode ${n}</h2><div class="conclusion">Conclusion</div><p class="subtitle" style="margin:20px auto 0">Your choices have been saved. The story continues from here.</p><button class="primary" id="next">CONTINUE TO EPISODE ${n+1} →</button></div></div>`;
  document.getElementById('next').onclick=next;
}

async function runEpisode1(){
  state.episode=1;chatShell({name:group.name,status:'6 online',sub:'SEPTEMBER 2020 · FIRST NIGHT'});const chat=document.getElementById('chat');
  await sleep(600);
  await message(chat,'Silvia','hi guys — is this the right group?','9:12 PM');
  await message(chat,'Keonho',"if this isn't the right group i'm leaving",'9:12 PM');
  await message(chat,'Elvaro','another victim has arrived.','9:13 PM');
  await message(chat,'Sanghyeon','Orientation starts at 6 tomorrow.','9:13 PM');
  await message(chat,'Martin','wait, 6 AM?','9:14 PM');
  await message(chat,'Keonho','yes bro. morning exists.','9:14 PM');
  await message(chat,'Player','hi... sorry, am I late?','9:15 PM');
  await message(chat,'Silvia','nooo you’re good! welcome!','9:15 PM');
  await message(chat,'Martin','welcome lol','9:15 PM');
  await message(chat,'Martin',`hey, sorry to bother you. did you understand what we're supposed to submit tomorrow?`,'9:16 PM');
  showChoices([
    {text:'I think so. Want me to send you what I have?',effect:()=>state.compatibility++},
    {text:"Honestly no — I'm confused too.",effect:()=>state.compatibility++},
    {text:"I'm just going to figure it out tomorrow.",effect:()=>{}}
  ],async choice=>{choice.effect();await message(chat,'Player',choice.text,'9:16 PM');await message(chat,'Martin','guess we’re figuring this out together then.','9:17 PM');await finishEpisode(1,()=>episodeBanner(2,runEpisode2));});
}

async function runEpisode2(){
  state.episode=2;chatShell({type:'dm',name:'Martin',status:'online',avatar:profiles.Martin,sub:'ORIENTATION DAY · 06:00 AM — 06:00 PM'});const chat=document.getElementById('chat');
  await sleep(900);
  await message(chat,'Martin','hey, are you still awake?','11:47 PM');
  await message(chat,'Player','yeah. unfortunately.','11:48 PM');
  await message(chat,'Martin','same. did you finish the assignment?','11:48 PM');
  showChoices([
    {text:"Almost. I'm procrastinating.",effect:()=>state.affection++},
    {text:'Yeah, finished it earlier.',effect:()=>state.affection++},
    {text:'I forgot about it completely 😭',effect:()=>state.compatibility++}
  ],async choice=>{choice.effect();await message(chat,'Player',choice.text,'11:49 PM');await message(chat,'Martin','btw, where are you from?','11:50 PM');await message(chat,'Martin','what made you choose this university?','11:50 PM');showChoices([
    {text:'I actually wanted to be here.',effect:()=>state.affection++},
    {text:'It was the practical choice.',effect:()=>state.compatibility++},
    {text:'Long story.',effect:()=>{}}
  ],async c2=>{c2.effect();await message(chat,'Player',c2.text,'11:51 PM');await message(chat,'Martin',"you're actually pretty easy to talk to.",'11:52 PM');await message(chat,'Martin','good night. see you tomorrow.','11:53 PM');await finishEpisode(2,()=>episodeBanner(3,runEpisode3));});});
}

async function runEpisode3(){
  state.episode=3;chatShell({name:group.name,status:'6 online',sub:'ORIENTATION DAY · 06:00 AM — 06:00 PM'});const chat=document.getElementById('chat');
  await sleep(700);
  await message(chat,'Silvia','morning everyone. please tell me you’re awake.','6:02 AM');
  await message(chat,'Keonho','physically? yes. spiritually? no.','6:03 AM');
  await message(chat,'Elvaro','skill issue.','6:03 AM');
  await message(chat,'Sanghyeon','let’s survive until 6 PM first.','6:04 AM');
  await message(chat,'Martin',`hey ${state.playerName}, did you get the orientation instructions?`,'6:05 AM');
  await message(chat,'Player','I don’t understand question 4.','10:21 AM');
  await message(chat,'Martin','what part don’t you understand? I’ll explain.','10:22 AM');
  showChoices([
    {text:"Thank you, you're saving my life.",effect:()=>state.affection++},
    {text:'I owe you one.',effect:()=>state.trust++},
    {text:'Never mind, I figured it out.',effect:()=>{}}
  ],async choice=>{choice.effect();await message(chat,'Player',choice.text,'10:22 AM');await message(chat,'Keonho','why does Martin answer every time they ask something?','10:23 AM');await message(chat,'Martin','because unlike you, I know how to read.','10:23 AM');await message(chat,'Silvia','PLEASE focus 😭','10:24 AM');await message(chat,'Sanghyeon','orientation ends at 6. don’t die before then.','5:58 PM');await message(chat,'Elvaro','group chat survived day one.','6:01 PM');await finishEpisode(3,()=>startLockedNotice());});
}
function startLockedNotice(){
  screen.innerHTML=`<div class="screen center fade"><div class="eyebrow">Prototype milestone</div><h1>Episodes 1–3<br><span class="script">are live.</span></h1><p class="subtitle">The branching data is already wired into the same hidden stats system. Episodes 4–10 can be added without changing the chat engine.</p><div class="timeline"><b>Current stats are hidden</b><br>Martin Affection · Trust · Compatibility<br><br>Happy Ending threshold remains: Affection ≥ 11 + Trust ≥ 6.</div><button class="primary" onclick="location.reload()">REPLAY FROM START</button></div>`;
}

startScreen();
