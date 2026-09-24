const screen = document.getElementById('screen');

const state = {
  playerName: '',
  affection: 0,
  trust: 0,
  compatibility: 0,
  episode: 1,
  favoriteThing: ''
};

const profiles = {
  Keonho: 'assets/keonho.png',
  Martin: 'assets/martin.jpeg',
  Elvaro: 'assets/elvaro.png',
  Seonghyeon: 'assets/seonghyeon.jpeg',
  Silvia: 'assets/silvia.jpeg'
};

const group = {
  name: 'UMN Freshman Orientation — Group Chat',
  status: '6 online'
};

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

function esc(value) {
  return String(value).replace(/[&<>'"]/g, char => ({
    '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#039;', '"':'&quot;'
  }[char]));
}

function playerText(text) {
  return text.replaceAll('[NAME]', state.playerName);
}

function startScreen() {
  screen.innerHTML = `
    <div class="screen center fade">
      <div class="eyebrow">A little chat story · UMN · 2020</div>
      <h1>A Story<br><span class="script">in Messages</span></h1>
      <p class="subtitle">Same university. Different screens. Same feelings.<br><br>A tiny interactive story about meeting the right people at the most unexpected time.</p>
      <button class="primary" id="start">START YOUR STORY →</button>
      <div class="small-note">made for one very specific group of friends ♡</div>
    </div>`;
  document.getElementById('start').onclick = nameScreen;
}

function nameScreen() {
  screen.innerHTML = `
    <div class="screen center fade">
      <div class="eyebrow">Before we begin</div>
      <h1>What's your<br><span class="script">name?</span></h1>
      <p class="subtitle">This story will be yours. Your name will appear naturally inside the conversations.</p>
      <div class="name-wrap">
        <input id="name" class="name-input" maxlength="24" placeholder="Enter your name..." autocomplete="off">
        <button class="primary" id="continue">CONTINUE →</button>
      </div>
    </div>`;
  const go = () => {
    const name = document.getElementById('name').value.trim();
    if (!name) return;
    state.playerName = name;
    intro();
  };
  document.getElementById('continue').onclick = go;
  document.getElementById('name').addEventListener('keydown', event => {
    if (event.key === 'Enter') go();
  });
}

function intro() {
  screen.innerHTML = `
    <div class="screen center fade">
      <div class="eyebrow">Nice to meet you,</div>
      <h1>${esc(state.playerName)}.</h1>
      <p class="subtitle">Your story begins with a group chat, a university orientation, and five people who definitely did not expect to end up in the same room.</p>
      <button class="primary" id="begin">TAP TO CONTINUE</button>
    </div>`;
  document.getElementById('begin').onclick = () => runEpisode1();
}

function endEpisode(number, title, conclusion, nextLabel, next) {
  screen.innerHTML = `
    <div class="screen episode-card fade">
      <div>
        <div class="eyebrow">✦ END OF EPISODE ${number}</div>
        <h2>${esc(title)}</h2>
        <div class="conclusion">CONCLUSION</div>
        <p class="subtitle" style="margin:20px auto 0">${esc(conclusion)}</p>
        <button class="primary" id="next">${esc(nextLabel)} →</button>
      </div>
    </div>`;
  document.getElementById('next').onclick = next;
}

function chatShell({type='group', name, status='online', avatar=null, subtitle=''}) {
  const isGroup = type === 'group';
  screen.innerHTML = `
    <div class="chat-page fade">
      <header class="chat-header">
        ${isGroup
          ? `<div class="group-icon"><img src="assets/group-profile.png" alt="Group"></div>`
          : `<img class="avatar" src="${avatar}" alt="${esc(name)}">`}
        <div class="header-copy">
          <div class="header-name">${esc(name)}</div>
          <div class="header-status">${esc(status)}</div>
        </div>
        <div class="header-meta">•••</div>
      </header>
      <div id="chat" class="chat-scroll">
        ${subtitle ? `<div class="date-divider">${esc(subtitle)}</div>` : ''}
      </div>
      <div id="choices" class="choice-wrap" style="display:none"></div>
    </div>`;
}

function appendTyping(chat, who) {
  const row = document.createElement('div');
  row.className = 'msg-row fade';
  row.innerHTML = `
    <img class="msg-avatar" src="${profiles[who]}" alt="">
    <div class="typing"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>`;
  chat.appendChild(row);
  chat.scrollTop = chat.scrollHeight;
  return row;
}

async function message(chat, who, text, time, {typing=true, delay=2200, after=900}={}) {
  const rendered = playerText(text);
  const me = who === 'Player';

  if (!me && typing) {
    const typingRow = appendTyping(chat, who);
    await sleep(delay);
    typingRow.remove();
  }

  const row = document.createElement('div');
  row.className = `msg-row ${me ? 'me' : ''} fade`;

  if (me) {
    row.innerHTML = `
      <div class="msg-stack">
        <div class="bubble">${esc(rendered)}</div>
        <div class="time">${esc(time || '')} ✓✓</div>
      </div>`;
  } else {
    row.innerHTML = `
      <img class="msg-avatar" src="${profiles[who]}" alt="${esc(who)}">
      <div class="msg-stack">
        <div class="sender">${esc(who)}</div>
        <div class="bubble">${esc(rendered)}</div>
        <div class="time">${esc(time || '')}</div>
      </div>`;
  }

  chat.appendChild(row);
  chat.scrollTop = chat.scrollHeight;
  await sleep(after);
}

async function systemMessage(chat, time, text) {
  const card = document.createElement('div');
  card.className = 'system-card fade';
  card.innerHTML = `<div class="system-time">${esc(time)}</div><div>${esc(playerText(text))}</div>`;
  chat.appendChild(card);
  chat.scrollTop = chat.scrollHeight;
  await sleep(900);
}

function showChoices(items, onPick) {
  const box = document.getElementById('choices');
  box.style.display = 'block';
  box.innerHTML = `<div class="choice-title">Choose your response</div>` +
    items.map((item, index) =>
      `<button class="choice" data-index="${index}">${esc(playerText(item.text))}</button>`
    ).join('');

  [...box.querySelectorAll('.choice')].forEach(button => {
    button.onclick = async () => {
      box.style.display = 'none';
      await onPick(items[Number(button.dataset.index)]);
    };
  });
}

async function runEpisode1() {
  state.episode = 1;

  chatShell({
    type: 'group',
    name: group.name,
    status: group.status,
    subtitle: 'SEPTEMBER 2020 · 8:32 PM'
  });

  const chat = document.getElementById('chat');
  
  await message(chat,'Silvia','wait.','8:32 PM');
  await message(chat,'Keonho','what?','8:32 PM');
  await message(chat,'Silvia','Martin???','8:32 PM');
  await message(chat,'Martin','what','8:32 PM');
  await message(chat,'Silvia',"you're in this group too??",'8:32 PM');
  await message(chat,'Keonho','NO WAY 😭','8:32 PM');
  await message(chat,'Elvaro',"you're kidding.",'8:32 PM');
  await message(chat,'Seonghyeon','Looks like all five of us are here.','8:32 PM');
  await message(chat,'Martin','Apparently.','8:32 PM');
  await message(chat,'Keonho','We literally survived high school together and somehow ended up in the same orientation group.','8:32 PM');
  await message(chat,'Silvia','HAHAHAHA','8:32 PM');
  await message(chat,'Elvaro','At least we know someone.','8:32 PM');
  await message(chat,'Keonho','"someone"','8:32 PM');
  await message(chat,'Keonho','there are literally four people we already know.','8:32 PM');
  await message(chat,'Elvaro','Exactly.','8:32 PM');
  await message(chat,'Silvia','Wait.','8:32 PM');
  await message(chat,'Silvia',"Who's the sixth person?",'8:32 PM');
  await message(chat,'Seonghyeon','There is another member.','8:32 PM');
  await message(chat,'Keonho','Oh.','8:32 PM');
  await message(chat,'Keonho','[NAME]?','8:32 PM');
  await message(chat,'Silvia','I think so.','8:32 PM');
  await message(chat,'Elvaro','Probably another freshman.','8:32 PM');
  await message(chat,'Keonho','Should we say hi?','8:32 PM');
  await message(chat,'Elvaro',"Please don't make it awkward.",'8:32 PM');
  await message(chat,'Keonho','Too late.','8:32 PM');
  await message(chat,'Keonho','Hi, [NAME] 👋','8:32 PM');

  showChoices([
    {text:'Hi! I\'m [NAME]. Nice to meet you guys!', effect:()=>state.affection += 2},
    {text:'Hello 😭 I was wondering if I was the only one here.', effect:()=>state.affection += 1},
    {text:'Hi. I guess we\'re classmates now.', effect:()=>state.affection += 1}
  ], async choice => {
    choice.effect();
    await message(chat,'Player',choice.text,'8:32 PM');

    await message(chat,'Silvia','HAHAHA okay, now that we know you\'re alive—','8:32 PM');
    await message(chat,'Silvia','Hi, [NAME]!!','8:32 PM');
    await message(chat,'Seonghyeon','Nice to meet you, [NAME].','8:32 PM');
    await message(chat,'Elvaro','Welcome to the group.','8:32 PM');
    await message(chat,'Martin','Hey.','8:32 PM');
    await message(chat,'Player','Nice to meet you too.','8:32 PM');

    await message(chat,'Keonho','Okay, introductions.','8:32 PM');
    await message(chat,'Silvia','YES.','8:32 PM');
    await message(chat,'Keonho','I\'ll go first.','8:32 PM');
    await message(chat,'Keonho','I\'m Keonho.','8:32 PM');
    await message(chat,'Keonho','Communication Science.','8:32 PM');
    await message(chat,'Keonho','And apparently I\'m the one who\'s going to keep this group alive.','8:32 PM');
    await message(chat,'Elvaro',"That's optimistic.",'8:32 PM');
    await message(chat,'Keonho','Shut up.','8:32 PM');
    await message(chat,'Elvaro','I\'m Elvaro.','8:32 PM');
    await message(chat,'Elvaro','Communication Science too.','8:32 PM');
    await message(chat,'Silvia','I\'m Silvia!','8:32 PM');
    await message(chat,'Silvia','Also Communication Science.','8:32 PM');
    await message(chat,'Seonghyeon','Seonghyeon.','8:32 PM');
    await message(chat,'Seonghyeon','Same major.','8:32 PM');
    await message(chat,'Martin','Martin.','8:32 PM');
    await message(chat,'Martin','Communication Science.','8:32 PM');
    await message(chat,'Keonho','See?','8:32 PM');
    await message(chat,'Keonho','We\'re all in the same major.','8:32 PM');
    await message(chat,'Player','Wait, really?','8:32 PM');
    await message(chat,'Silvia','Yep!','8:32 PM');
    await message(chat,'Silvia','All five of us.','8:32 PM');
    await message(chat,'Player',"That's actually kind of nice.",'8:32 PM');
    await message(chat,'Keonho','And you\'re the only new person.','8:32 PM');
    await message(chat,'Elvaro',"Don't scare them.",'8:32 PM');
    await message(chat,'Keonho',"I'm just stating facts.",'8:32 PM');
    await message(chat,'Martin',"You'll get used to them.",'8:32 PM');
    await message(chat,'Player',"That sounds concerning.",'8:32 PM');
    await message(chat,'Martin','It is.','8:32 PM');

    await message(chat,'Silvia','GUYS.','9:05 PM');
    await message(chat,'Keonho','what now','9:05 PM');
    await message(chat,'Silvia','The committee sent the schedule.','9:05 PM');
    await message(chat,'Seonghyeon','Already?','9:05 PM');
    await message(chat,'Silvia','Yeah.','9:05 PM');
    await message(chat,'Silvia','Tomorrow starts at 6 AM.','9:05 PM');
    await message(chat,'Keonho','...','9:05 PM');
    await message(chat,'Keonho','No.','9:05 PM');
    await message(chat,'Elvaro','Yes.','9:05 PM');
    await message(chat,'Keonho','Six in the morning???','9:05 PM');
    await message(chat,'Silvia','06:00–18:00.','9:05 PM');
    await message(chat,'Keonho','TWELVE HOURS???','9:05 PM');
    await message(chat,'Seonghyeon',"It's online.",'9:05 PM');
    await message(chat,'Keonho',"That doesn't make it better.",'9:05 PM');
    await message(chat,'Elvaro','You can complain tomorrow.','9:05 PM');
    await message(chat,'Keonho','I will.','9:05 PM');
    await message(chat,'Martin','Everyone should probably sleep early.','9:05 PM');
    await message(chat,'Keonho',"Look who's suddenly responsible.",'9:05 PM');
    await message(chat,'Martin','Someone has to be.','9:05 PM');
    await message(chat,'Silvia','HAHAHAHA','9:05 PM');
    await message(chat,'Player','What time do we have to wake up?','9:05 PM');
    await message(chat,'Seonghyeon','I\'d say around 5:30.','9:05 PM');
    await message(chat,'Keonho','5:30???','9:05 PM');
    await message(chat,'Elvaro','You just complained about 6.','9:05 PM');
    await message(chat,'Keonho','Exactly.','9:05 PM');

    await message(chat,'Silvia','Okay, random question.','9:30 PM');
    await message(chat,'Keonho','Here we go.','9:30 PM');
    await message(chat,'Silvia','Why did everyone choose Communication Science?','9:30 PM');
    await message(chat,'Elvaro',"That's not random.",'9:30 PM');
    await message(chat,'Silvia','Let me have this.','9:30 PM');
    await message(chat,'Seonghyeon','You first.','9:30 PM');
    await message(chat,'Silvia','Because I like media.','9:30 PM');
    await message(chat,'Keonho',"That's your entire explanation?",'9:30 PM');
    await message(chat,'Silvia','Yes.','9:30 PM');
    await message(chat,'Keonho','Fair.','9:30 PM');
    await message(chat,'Elvaro',"I chose it because I didn't know what else to choose.",'9:30 PM');
    await message(chat,'Keonho',"That's worse.",'9:30 PM');
    await message(chat,'Elvaro','And yet I\'m here.','9:30 PM');
    await message(chat,'Seonghyeon','I like understanding people.','9:30 PM');
    await message(chat,'Silvia','Aww.','9:30 PM');
    await message(chat,'Seonghyeon',"Don't.",'9:30 PM');
    await message(chat,'Keonho','HAHAHAHA','9:30 PM');
    await message(chat,'Martin','I just liked the field.','9:30 PM');
    await message(chat,'Silvia','Very Martin answer.','9:30 PM');
    await message(chat,'Keonho','What does that even mean?','9:30 PM');
    await message(chat,'Silvia','You know what I mean.','9:30 PM');
    await message(chat,'Player','I chose it because—','9:30 PM');

    showChoices([
      {text:'I like writing and creating things.', effect:()=>state.affection += 2},
      {text:'I like talking to people.', effect:()=>state.affection += 1},
      {text:'Honestly? I just thought it sounded interesting.', effect:()=>state.affection += 2}
    ], async choice2 => {
      choice2.effect();
      await message(chat,'Player',choice2.text,'9:30 PM');
      await message(chat,'Keonho',"Okay, that's actually a good reason.",'9:30 PM');
      await message(chat,'Silvia',"I think we're going to get along.",'9:30 PM');
      await message(chat,'Martin','Probably.','9:30 PM');
      await message(chat,'Player','Probably?','9:30 PM');
      await message(chat,'Martin',"We haven't met yet.",'9:30 PM');
      await message(chat,'Player','Fair.','9:30 PM');
      await message(chat,'Martin',"But I'm looking forward to tomorrow.",'9:30 PM');

      await message(chat,'Silvia','I should probably sleep.','10:45 PM');
      await message(chat,'Seonghyeon','You said that twenty minutes ago.','10:45 PM');
      await message(chat,'Silvia','I was emotionally preparing.','10:45 PM');
      await message(chat,'Keonho','I\'m still awake.','10:45 PM');
      await message(chat,'Elvaro','Go to sleep.','10:45 PM');
      await message(chat,'Keonho','No.','10:45 PM');
      await message(chat,'Elvaro','Keonho.','10:45 PM');
      await message(chat,'Keonho','Okay.','10:45 PM');
      await message(chat,'Keonho','Goodnight.','10:45 PM');
      await message(chat,'Silvia','HAHAHAHA.','10:45 PM');
      await message(chat,'Seonghyeon','Goodnight everyone.','10:45 PM');
      await message(chat,'Elvaro','Goodnight.','10:45 PM');
      await message(chat,'Martin','Goodnight.','10:45 PM');
      await message(chat,'Player','Goodnight, everyone.','10:45 PM');
      await message(chat,'Martin','See you tomorrow.','10:45 PM');
      await message(chat,'Player','See you.','10:45 PM');

      endEpisode(
        1,
        'THE NEW GROUP',
        'Tomorrow would be their first day at UMN.',
        'CONTINUE',
        () => runEpisode2()
      );
    });
  });
}

async function runEpisode2() {
  state.episode = 2;

  chatShell({
    type: 'group',
    name: group.name,
    status: group.status,
    subtitle: 'DAY 1 · UMN FRESHMAN ORIENTATION'
  });

  const chat = document.getElementById('chat');

  await message(chat,'Keonho','I\'m awake.','05:28 AM');
  await message(chat,'Elvaro','Impossible.','05:28 AM');
  await message(chat,'Keonho','Unfortunately.','05:28 AM');
  await message(chat,'Silvia','GOOD MORNINGGGG ☀️','05:28 AM');
  await message(chat,'Seonghyeon','Morning.','05:28 AM');
  await message(chat,'Martin','Morning.','05:28 AM');
  await message(chat,'Silvia','[NAME]???','05:28 AM');
  await message(chat,'Silvia','Are you awake?','05:28 AM');

  showChoices([
    {text:"I'm awake 😭", effect:()=>state.affection += 1},
    {text:'Barely.', effect:()=>state.affection += 2},
    {text:"I haven't slept.", effect:()=>state.affection += 1}
  ], async choice1 => {
    choice1.effect();
    await message(chat,'Player',choice1.text,'05:28 AM');
    await message(chat,'Keonho','I respect everyone who managed to wake up.','05:28 AM');
    await message(chat,'Elvaro',"You said you weren't going to.",'05:28 AM');
    await message(chat,'Keonho','People change.','05:28 AM');
    await message(chat,'Silvia','The Zoom link should be sent soon.','05:28 AM');
    await message(chat,'Seonghyeon','Make sure your cameras work.','05:28 AM');
    await message(chat,'Keonho','My camera works.','05:28 AM');
    await message(chat,'Elvaro','Your hair doesn\'t.','05:28 AM');
    await message(chat,'Keonho','Blocked.','05:28 AM');

    await systemMessage(chat,'05:52 AM','UMN Freshman Orientation — The session will begin in 8 minutes.');
    await message(chat,'Martin','Everyone ready?','05:52 AM');
    await message(chat,'Silvia','No.','05:52 AM');
    await message(chat,'Keonho','No.','05:52 AM');
    await message(chat,'Elvaro','Yes.','05:52 AM');
    await message(chat,'Seonghyeon','Ready.','05:52 AM');
    await message(chat,'Player','I think so.','05:52 AM');
    await message(chat,'Martin','Good enough.','05:52 AM');

    await systemMessage(chat,'06:00 AM','06:00 — OPENING CEREMONY\nWelcome, new students of Universitas Multimedia Nusantara.');
    await message(chat,'Keonho','why is everyone so quiet','06:00 AM');
    await message(chat,'Silvia',"because we're supposed to listen 😭",'06:00 AM');
    await message(chat,'Keonho','right.','06:00 AM');
    await message(chat,'Elvaro','You lasted five minutes.','06:00 AM');
    await message(chat,'Keonho','I\'m trying.','06:00 AM');

    await systemMessage(chat,'07:15 AM','07:15 — UNIVERSITY INTRODUCTION');
    await message(chat,'Silvia','Okay, this part is actually interesting.','07:15 AM');
    await message(chat,'Keonho','I stopped listening.','07:15 AM');
    await message(chat,'Seonghyeon',"It's been ten minutes.",'07:15 AM');
    await message(chat,'Keonho','Exactly.','07:15 AM');
    await message(chat,'Martin','[NAME], how are you doing?','07:15 AM');
    await message(chat,'Player','Still alive.','07:15 AM');
    await message(chat,'Martin','Good.','07:15 AM');
    await message(chat,'Martin','Same.','07:15 AM');

    await systemMessage(chat,'08:30 AM','08:30 — ACADEMIC LIFE & FACULTY INTRODUCTION');
    await message(chat,'Seonghyeon','Looks like we have another session.','08:30 AM');
    await message(chat,'Keonho','I thought we were done.','08:30 AM');
    await message(chat,'Elvaro',"It's 8:30.",'08:30 AM');
    await message(chat,'Keonho','Exactly.','08:30 AM');
    await message(chat,'Silvia','We still have ten hours.','08:30 AM');
    await message(chat,'Keonho',"Please don't say that.",'08:30 AM');

    await systemMessage(chat,'10:00 AM','10:00 — BREAK');
    await message(chat,'Silvia','FINALLY.','10:00 AM');
    await message(chat,'Keonho','I\'m getting food.','10:00 AM');
    await message(chat,'Elvaro','You just woke up.','10:00 AM');
    await message(chat,'Keonho','And?','10:00 AM');
    await message(chat,'Elvaro','Nothing.','10:00 AM');
    await message(chat,'Martin','[NAME], are you taking a break?','10:00 AM');
    await message(chat,'Player','Yeah.','10:00 AM');
    await message(chat,'Martin',"Good.",'10:00 AM');
    await message(chat,'Martin',"Don't spend the whole break staring at the screen.",'10:00 AM');
    await message(chat,'Player','Are you my mom?','10:00 AM');
    await message(chat,'Martin','Apparently.','10:00 AM');
    await message(chat,'Player','😭','10:00 AM');
    await message(chat,'Martin','Go eat.','10:00 AM');

    await systemMessage(chat,'10:30 AM','10:30 — COMMUNICATION SCIENCE SESSION');
    await message(chat,'Silvia','Okay.','10:30 AM');
    await message(chat,'Silvia',"Now I'm actually interested.",'10:30 AM');
    await message(chat,'Keonho','Same.','10:30 AM');
    await message(chat,'Elvaro','Finally.','10:30 AM');
    await message(chat,'Seonghyeon','This is probably the most relevant session for us.','10:30 AM');
    await message(chat,'Martin','Definitely.','10:30 AM');
    await message(chat,'Player',"I'm glad we chose the same major.",'10:30 AM');
    await message(chat,'Silvia','ME TOO.','10:30 AM');

    await systemMessage(chat,'12:00 PM','12:00 — LUNCH BREAK');
    await message(chat,'Keonho','LUNCH.','12:00 PM');
    await message(chat,'Elvaro','You were waiting for this.','12:00 PM');
    await message(chat,'Keonho','Yes.','12:00 PM');
    await message(chat,'Silvia','Everyone eat properly.','12:00 PM');
    await message(chat,'Seonghyeon','You too.','12:00 PM');
    await message(chat,'Silvia','I will ❤️','12:00 PM');
    await message(chat,'Keonho','Disgusting.','12:00 PM');
    await message(chat,'Elvaro','You have a girlfriend too.','12:00 PM');
    await message(chat,'Keonho','I know.','12:00 PM');
    await message(chat,'Keonho',"I'm still allowed to complain.",'12:00 PM');

    // Private chat — Martin
    chatShell({
      type: 'dm',
      name: 'Martin',
      status: 'online',
      avatar: profiles.Martin,
      subtitle: 'PRIVATE CHAT — MARTIN'
    });
    const dm = document.getElementById('chat');

    await message(dm,'Martin','hey.','12:00 PM');
    await message(dm,'Player','hey?','12:00 PM');
    await message(dm,'Martin','have you eaten?','12:00 PM');

    showChoices([
      {text:'Not yet.', effect:()=>state.affection += 1},
      {text:'Yeah. You?', effect:()=>state.affection += 2},
      {text:'Why do you keep asking? 😭', effect:()=>state.affection += 2}
    ], async choice2 => {
      choice2.effect();
      await message(dm,'Player',choice2.text,'12:00 PM');
      await message(dm,'Martin','I was just asking.','12:00 PM');
      await message(dm,'Player','Sure.','12:00 PM');
      await message(dm,'Martin',"I haven't eaten either.",'12:00 PM');
      await message(dm,'Player','Then go eat.','12:00 PM');
      await message(dm,'Martin','You first.','12:00 PM');
      await message(dm,'Player','Why?','12:00 PM');
      await message(dm,'Martin','Because I asked first.','12:00 PM');
      await message(dm,'Player',"That's not how it works.",'12:00 PM');
      await message(dm,'Martin','It does now.','12:00 PM');

      // Return to group chat
      chatShell({
        type: 'group',
        name: group.name,
        status: group.status,
        subtitle: 'DAY 1 · CONTINUING ORIENTATION'
      });
      const groupChat = document.getElementById('chat');

      await systemMessage(groupChat,'01:00 PM','13:00 — STUDENT ACTIVITIES & ORGANIZATIONS');
      await message(groupChat,'Silvia','There are so many organizations.','01:00 PM');
      await message(groupChat,'Keonho',"I'm joining none.",'01:00 PM');
      await message(groupChat,'Elvaro','You said that yesterday.','01:00 PM');
      await message(groupChat,'Keonho',"I'm consistent.",'01:00 PM');
      await message(groupChat,'Seonghyeon',"I'm thinking about joining one.",'01:00 PM');
      await message(groupChat,'Silvia','Which one?','01:00 PM');
      await message(groupChat,'Seonghyeon','Not sure yet.','01:00 PM');
      await message(groupChat,'Martin','Same.','01:00 PM');
      await message(groupChat,'Player','Maybe I\'ll decide later.','01:00 PM');
      await message(groupChat,'Martin',"That's probably what I'll do too.",'01:00 PM');

      await systemMessage(groupChat,'03:00 PM','15:00 — GROUP CHALLENGE');
      await message(groupChat,'Silvia','WAIT.','03:00 PM');
      await message(groupChat,'Silvia','OUR GROUP HAS A CHALLENGE.','03:00 PM');
      await message(groupChat,'Keonho','finally something fun.','03:00 PM');
      await message(groupChat,'Elvaro',"That's optimistic.",'03:00 PM');
      await message(groupChat,'Seonghyeon','What do we have to do?','03:00 PM');
      await message(groupChat,'Silvia','Create a short presentation together.','03:00 PM');
      await message(groupChat,'Keonho','Oh.','03:00 PM');
      await message(groupChat,'Keonho','So not fun.','03:00 PM');
      await message(groupChat,'Martin','We can do it.','03:00 PM');
      await message(groupChat,'Player',"I'm in.",'03:00 PM');
      await message(groupChat,'Martin','Good.','03:00 PM');

      showChoices([
        {text:"Let's actually try to make it good.", effect:()=>state.affection += 2},
        {text:"Let's just survive this 😭", effect:()=>state.affection += 1},
        {text:"I'll follow whatever you guys decide.", effect:()=>{}}
      ], async choice3 => {
        choice3.effect();
        await message(groupChat,'Player',choice3.text,'03:00 PM');
        await message(groupChat,'Martin','I like A.','03:00 PM');
        await message(groupChat,'Keonho','Of course you do.','03:00 PM');
        await message(groupChat,'Silvia',"Okay, let's actually work.",'03:00 PM');

        await systemMessage(groupChat,'04:30 PM','16:30 — REFLECTION SESSION');
        await message(groupChat,'Keonho',"I'm tired.",'04:30 PM');
        await message(groupChat,'Elvaro',"We've been here for ten hours.",'04:30 PM');
        await message(groupChat,'Keonho','Exactly.','04:30 PM');
        await message(groupChat,'Silvia','Almost done.','04:30 PM');
        await message(groupChat,'Seonghyeon','One more session.','04:30 PM');
        await message(groupChat,'Martin','We made it.','04:30 PM');
        await message(groupChat,'Player','Barely.','04:30 PM');
        await message(groupChat,'Martin','Still counts.','04:30 PM');

        await systemMessage(groupChat,'05:30 PM','17:30 — CLOSING SESSION');
        await message(groupChat,'Silvia','ONE MORE HOUR.','05:30 PM');
        await message(groupChat,'Keonho',"I'm going to sleep immediately after this.",'05:30 PM');
        await message(groupChat,'Elvaro','You say that every day.','05:30 PM');
        await message(groupChat,'Keonho','Today I mean it.','05:30 PM');
        await message(groupChat,'Martin',"We'll see.",'05:30 PM');

        await systemMessage(groupChat,'06:00 PM','18:00 — ORIENTATION COMPLETE');
        await message(groupChat,'Silvia','WE SURVIVED.','06:00 PM');
        await message(groupChat,'Keonho','Barely.','06:00 PM');
        await message(groupChat,'Seonghyeon','Good job, everyone.','06:00 PM');
        await message(groupChat,'Elvaro',"That was longer than I expected.",'06:00 PM');
        await message(groupChat,'Martin','Yeah.','06:00 PM');
        await message(groupChat,'Player',"I'm glad it's over.",'06:00 PM');
        await message(groupChat,'Martin','Same.','06:00 PM');

        // Private chat — Martin
        chatShell({
          type: 'dm',
          name: 'Martin',
          status: 'online',
          avatar: profiles.Martin,
          subtitle: 'PRIVATE CHAT — MARTIN'
        });
        const endDm = document.getElementById('chat');

        await message(endDm,'Martin','You survived.','06:00 PM');
        await message(endDm,'Player','Barely.','06:00 PM');
        await message(endDm,'Martin','Still counts.','06:00 PM');
        await message(endDm,'Player','You said that earlier.','06:00 PM');
        await message(endDm,'Martin','Did I?','06:00 PM');
        await message(endDm,'Player','Yeah.','06:00 PM');
        await message(endDm,'Martin',"Guess we're thinking alike.",'06:00 PM');
        await message(endDm,'Player','Maybe.','06:00 PM');
        await message(endDm,'Martin','Anyway.','06:00 PM');
        await message(endDm,'Martin','Good job today.','06:00 PM');
        await message(endDm,'Player','You too.','06:00 PM');
        await message(endDm,'Martin','Get some rest.','06:00 PM');
        await message(endDm,'Player','You too.','06:00 PM');
        await message(endDm,'Martin',"I'll see you tomorrow.",'06:00 PM');
        await message(endDm,'Player','See you.','06:00 PM');

        endEpisode(
          2,
          'THE FIRST DAY',
          'Sometimes, getting to know someone starts with something as simple as asking if they\'ve eaten.',
          'CONTINUE',
          () => runEpisode3()
        );
      });
    });
  });
}

async function runEpisode3() {
  state.episode = 3;

  chatShell({
    type: 'group',
    name: group.name,
    status: group.status,
    subtitle: 'DAY 2 · UMN FRESHMAN ORIENTATION'
  });

  const chat = document.getElementById('chat');

  await message(chat,'Silvia','GUYS.','08:10 AM');
  await message(chat,'Keonho','what','08:10 AM');
  await message(chat,'Silvia','I HAVE NEWS.','08:10 AM');
  await message(chat,'Elvaro','That sounds dangerous.','08:10 AM');
  await message(chat,'Silvia','We have our first assignment.','08:10 AM');
  await message(chat,'Keonho','Already???','08:10 AM');
  await message(chat,'Seonghyeon','What is it?','08:10 AM');
  await message(chat,'Silvia','Group presentation.','08:10 AM');
  await message(chat,'Keonho','Oh no.','08:10 AM');
  await message(chat,'Elvaro',"What's the topic?",'08:10 AM');
  await message(chat,'Silvia','Communication during the pandemic.','08:10 AM');
  await message(chat,'Keonho',"That's actually perfect.",'08:10 AM');
  await message(chat,'Elvaro','Why?','08:10 AM');
  await message(chat,'Keonho',"Because we're communicating during a pandemic.",'08:10 AM');
  await message(chat,'Elvaro','Brilliant.','08:10 AM');
  await message(chat,'Martin','How many people?','08:10 AM');
  await message(chat,'Silvia','Six.','08:10 AM');
  await message(chat,'Keonho','Oh.','08:10 AM');
  await message(chat,'Keonho','Wait.','08:10 AM');
  await message(chat,'Keonho',"We're Six.",'08:10 AM');
  await message(chat,'Seonghyeon','Looks like it.','08:10 AM');
  await message(chat,'Silvia',"So we're basically a group now.",'08:10 AM');
  await message(chat,'Player','I guess I got lucky.','08:10 AM');
  await message(chat,'Keonho','You definitely did.','08:10 AM');
  await message(chat,'Elvaro',"Don't listen to him.",'08:10 AM');

  await message(chat,'Seonghyeon','We should divide the work.','08:25 AM');
  await message(chat,'Silvia',"I'll do the introduction.",'08:25 AM');
  await message(chat,'Keonho',"I'll research.",'08:25 AM');
  await message(chat,'Elvaro',"I'll check everything.",'08:25 AM');
  await message(chat,'Martin',"I'll work on the slides.",'08:25 AM');
  await message(chat,'Seonghyeon','Then [NAME] can—','08:25 AM');
  await message(chat,'Martin','Wait.','08:25 AM');
  await message(chat,'Martin','Maybe [NAME] can work with me on the slides?','08:25 AM');
  await message(chat,'Keonho','👀','08:25 AM');
  await message(chat,'Silvia','OOOOOO.','08:25 AM');
  await message(chat,'Martin','What?','08:25 AM');
  await message(chat,'Elvaro','Nothing.','08:25 AM');
  await message(chat,'Martin','I literally just asked.','08:25 AM');
  await message(chat,'Keonho','Sure.','08:25 AM');
  await message(chat,'Martin','😭','08:25 AM');
  await message(chat,'Player','I can help.','08:25 AM');
  await message(chat,'Martin','Thanks.','08:25 AM');
  await message(chat,'Martin',"I'll send you the notes later.",'08:25 AM');

  // Private chat — Martin
  chatShell({
    type: 'dm',
    name: 'Martin',
    status: 'online',
    avatar: profiles.Martin,
    subtitle: '08:40 AM — PRIVATE CHAT'
  });
  const dm = document.getElementById('chat');

  await message(dm,'Martin','hey.','08:40 AM');
  await message(dm,'Player','hey.','08:40 AM');
  await message(dm,'Martin','Sorry for volunteering you without asking.','08:40 AM');
  await message(dm,'Player',"It's okay.",'08:40 AM');
  await message(dm,'Martin',"I just thought it'd be easier if we worked together.",'08:40 AM');
  await message(dm,'Player','Why me?','08:40 AM');
  await message(dm,'Martin','...','08:40 AM');
  await message(dm,'Martin',"You seem like you'd actually reply.",'08:40 AM');
  await message(dm,'Player',"That's your reason?",'08:40 AM');
  await message(dm,'Martin','Yes.','08:40 AM');
  await message(dm,'Player',"That's kind of insulting.",'08:40 AM');
  await message(dm,'Martin','No 😭','08:40 AM');
  await message(dm,'Martin','I mean—','08:40 AM');
  await message(dm,'Martin','You just seem easy to work with.','08:40 AM');
  await message(dm,'Player',"I'll take that as a compliment.",'08:40 AM');
  await message(dm,'Martin','Please do.','08:40 AM');

  showChoices([
    {text:"You're actually pretty easy to work with too.", effect:()=>state.affection += 2},
    {text:"I guess we'll find out.", effect:()=>state.affection += 1},
    {text:"Don't disappoint me then.", effect:()=>state.affection += 2}
  ], async choice1 => {
    choice1.effect();
    await message(dm,'Player',choice1.text,'08:40 AM');
    await message(dm,'Martin','Fair.','08:40 AM');
    await message(dm,'Martin',"I'll try.",'08:40 AM');
    await message(dm,'Player',"That's all I ask.",'08:40 AM');
    await message(dm,'Martin','Anyway.','08:40 AM');
    await message(dm,'Martin','I wanted to ask you something.','08:40 AM');

    showChoices([
      {text:'What?', effect:()=>state.affection += 1},
      {text:'This sounds suspicious.', effect:()=>state.affection += 2},
      {text:'Go ahead.', effect:()=>state.affection += 1}
    ], async choice2 => {
      choice2.effect();
      await message(dm,'Player',choice2.text,'08:40 AM');
      await message(dm,'Martin','Do you like UMN so far?','08:40 AM');
      await message(dm,'Player',"That's what you wanted to ask?",'08:40 AM');
      await message(dm,'Martin','Yeah 😭','08:40 AM');
      await message(dm,'Player','I thought it was going to be something serious.','08:40 AM');
      await message(dm,'Martin','Why would I ask something serious at 9 in the morning?','08:40 AM');
      await message(dm,'Player','Fair.','08:40 AM');
      await message(dm,'Martin','So?','08:40 AM');
      await message(dm,'Player',"I think it's okay.",'08:40 AM');
      await message(dm,'Martin','Just okay?','08:40 AM');
      await message(dm,'Player','I barely know anyone.','08:40 AM');
      await message(dm,'Martin','You know us.','08:40 AM');
      await message(dm,'Player','Unfortunately.','08:40 AM');
      await message(dm,'Martin','Wow.','08:40 AM');
      await message(dm,'Martin',"I'm hurt.",'08:40 AM');
      await message(dm,'Player','HAHAHAHA.','08:40 AM');
      await message(dm,'Martin','But seriously.','08:40 AM');
      await message(dm,'Martin',"I think it'll get better.",'08:40 AM');
      await message(dm,'Player','You think so?','08:40 AM');
      await message(dm,'Martin','Yeah.','08:40 AM');
      await message(dm,'Martin',"We've only known each other for a few days.",'08:40 AM');
      await message(dm,'Martin',"There's still a lot of time.",'08:40 AM');
      await message(dm,'Player',"That's true.",'08:40 AM');
      await message(dm,'Martin','And I think having people around makes it easier.','08:40 AM');
      await message(dm,'Player','People like you?','08:40 AM');
      await message(dm,'Martin','Maybe.','08:40 AM');
      await message(dm,'Martin',"Don't make me say it twice.",'08:40 AM');

      // Back to group chat
      chatShell({
        type: 'group',
        name: group.name,
        status: group.status,
        subtitle: '12:30 PM — GROUP CHAT'
      });
      const groupChat = document.getElementById('chat');

      await message(groupChat,'Silvia',"Guys, how's everyone's part going?",'12:30 PM');
      await message(groupChat,'Keonho','I found a bunch of sources.','12:30 PM');
      await message(groupChat,'Elvaro','Send them.','12:30 PM');
      await message(groupChat,'Seonghyeon',"I'll organize them.",'12:30 PM');
      await message(groupChat,'Martin','[NAME] and I are working on the slides.','12:30 PM');
      await message(groupChat,'Keonho','"we"','12:30 PM');
      await message(groupChat,'Silvia','👀','12:30 PM');
      await message(groupChat,'Martin','Oh my god.','12:30 PM');
      await message(groupChat,"Elvaro","They're never going to let you live this down.",'12:30 PM');
      await message(groupChat,'Martin','I know.','12:30 PM');
      await message(groupChat,'Player',"This is your fault.",'12:30 PM');
      await message(groupChat,'Martin','How is this my fault?','12:30 PM');
      await message(groupChat,'Player','You volunteered me.','12:30 PM');
      await message(groupChat,'Martin','Fair.','12:30 PM');

      // 03:30 PM private chat
      chatShell({
        type: 'dm',
        name: 'Martin',
        status: 'online',
        avatar: profiles.Martin,
        subtitle: '03:30 PM — PRIVATE CHAT'
      });
      const dm2 = document.getElementById('chat');

      await message(dm2,'Martin','I finished the first part.','03:30 PM');
      await message(dm2,'Player','Already?','03:30 PM');
      await message(dm2,'Martin','Yeah.','03:30 PM');
      await message(dm2,'Martin','Want to check it?','03:30 PM');
      await message(dm2,'Player','Sure.','03:30 PM');
      await message(dm2,'Martin','Sending it now.','03:30 PM');
      await message(dm2,'Martin','*file sent*','03:30 PM');
      await message(dm2,'Martin','What do you think?','03:30 PM');
      await message(dm2,'Player','It looks good.','03:30 PM');
      await message(dm2,'Martin','Really?','03:30 PM');
      await message(dm2,'Player','Yeah.','03:30 PM');
      await message(dm2,'Martin','Okay.','03:30 PM');
      await message(dm2,'Martin','I trust you.','03:30 PM');
      await message(dm2,'Player',"That's a lot of trust for someone you met three days ago.",'03:30 PM');
      await message(dm2,'Martin','True.','03:30 PM');
      await message(dm2,'Martin',"But I think you're reliable.",'03:30 PM');
      await message(dm2,'Player','You keep saying things like that.','03:30 PM');
      await message(dm2,'Martin','What things?','03:30 PM');
      await message(dm2,'Player','Nice things.','03:30 PM');
      await message(dm2,'Martin','Maybe I mean them.','03:30 PM');

      showChoices([
        {text:'Maybe you do.', effect:()=>state.affection += 3},
        {text:"You're surprisingly nice.", effect:()=>state.affection += 2},
        {text:"Don't get too comfortable.", effect:()=>state.affection += 1}
      ], async choice3 => {
        choice3.effect();
        await message(dm2,'Player',choice3.text,'03:30 PM');
        await message(dm2,'Martin',"I'll take that as a compliment.",'03:30 PM');
        await message(dm2,'Player','You should.','03:30 PM');
        await message(dm2,'Martin','Thanks.','03:30 PM');

        // 07:45 PM group chat
        chatShell({
          type: 'group',
          name: group.name,
          status: group.status,
          subtitle: '07:45 PM — GROUP CHAT'
        });
        const groupChat2 = document.getElementById('chat');

        await message(groupChat2,'Silvia','Okay, everyone.','07:45 PM');
        await message(groupChat2,'Silvia','Are we done?','07:45 PM');
        await message(groupChat2,'Seonghyeon','Almost.','07:45 PM');
        await message(groupChat2,'Keonho','I sent everything.','07:45 PM');
        await message(groupChat2,'Elvaro',"I'll check it.",'07:45 PM');
        await message(groupChat2,'Martin','Slides are done.','07:45 PM');
        await message(groupChat2,'Player','Yep.','07:45 PM');
        await message(groupChat2,'Silvia','WE DID IT.','07:45 PM');
        await message(groupChat2,'Keonho','We survived our first assignment.','07:45 PM');
        await message(groupChat2,'Elvaro','Barely.','07:45 PM');
        await message(groupChat2,'Seonghyeon','We should be okay tomorrow.','07:45 PM');
        await message(groupChat2,'Martin','Yeah.','07:45 PM');
        await message(groupChat2,'Silvia','Everyone rest.','07:45 PM');
        await message(groupChat2,'Keonho','Finally.','07:45 PM');

        // 10:32 PM private chat
        chatShell({
          type: 'dm',
          name: 'Martin',
          status: 'online',
          avatar: profiles.Martin,
          subtitle: '10:32 PM — PRIVATE CHAT'
        });
        const late = document.getElementById('chat');

        await message(late,'Martin','You still awake?','10:32 PM');
        await message(late,'Player','Yeah.','10:32 PM');
        await message(late,'Martin','Good.','10:32 PM');
        await message(late,'Player','Why?','10:32 PM');
        await message(late,'Martin',"I don't know.",'10:32 PM');
        await message(late,'Player',"That's suspicious.",'10:32 PM');
        await message(late,'Martin','Maybe.','10:32 PM');
        await message(late,'Player','What?','10:32 PM');
        await message(late,'Martin','I just wanted to talk.','10:32 PM');
        await message(late,'Player','About?','10:32 PM');
        await message(late,'Martin','Anything.','10:32 PM');
        await message(late,'Player',"You don't usually do this?",'10:32 PM');
        await message(late,'Martin','Do what?','10:32 PM');
        await message(late,'Player','Randomly text people.','10:32 PM');
        await message(late,'Martin','Not really.','10:32 PM');
        await message(late,'Player','Then why me?','10:32 PM');
        await message(late,'Martin','...','10:32 PM');
        await message(late,'Martin',"You're easy to talk to.",'10:32 PM');
        await message(late,'Player','You said that already.','10:32 PM');
        await message(late,'Martin',"Then I guess it's still true.",'10:32 PM');
        await message(late,'Player','Fair enough.','10:32 PM');
        await message(late,'Martin','So.','10:32 PM');
        await message(late,'Martin','How was your day?','10:32 PM');
        await message(late,'Player','Long.','10:32 PM');
        await message(late,'Martin','Same.','10:32 PM');
        await message(late,'Player','But?','10:32 PM');
        await message(late,'Martin','But it was okay.','10:32 PM');
        await message(late,'Player','Why?','10:32 PM');
        await message(late,'Martin',"I think I'm getting used to this.",'10:32 PM');
        await message(late,'Player','University?','10:32 PM');
        await message(late,'Martin','That too.','10:32 PM');
        await message(late,'Martin','Having you around, I guess.','10:32 PM');
        await message(late,'Player','...','10:32 PM');
        await message(late,'Martin','That sounded weird.','10:32 PM');
        await message(late,'Player','A little.','10:32 PM');
        await message(late,'Martin','Forget I said that.','10:32 PM');
        await message(late,'Player','Too late.','10:32 PM');
        await message(late,'Martin','😭','10:32 PM');
        await message(late,'Player','Goodnight, Martin.','10:32 PM');
        await message(late,'Martin','Goodnight, [NAME].','10:32 PM');
        await message(late,'Martin','Sleep well.','10:32 PM');
        await message(late,'Player','You too.','10:32 PM');

        endEpisode(
          3,
          'THE FIRST ASSIGNMENT',
          'Maybe some people become familiar before you realize you\'ve started looking for them.',
          'CONTINUE',
          () => runEpisode4()
        );
      });
    });
  });
}

async function runEpisode4() {
  state.episode = 4;

  // A few weeks have passed. Orientation is over, and everyone is now busy with their own class schedules.
  chatShell({
    type: 'dm',
    name: 'Martin',
    status: 'online',
    avatar: profiles.Martin,
    subtitle: 'WEEK 4 · 08:07 AM — PRIVATE CHAT'
  });
  const morning = document.getElementById('chat');

  await message(morning,'Martin','good morning.','08:07 AM');
  await message(morning,'Player','morning.','08:08 AM');
  await message(morning,'Martin','did I wake you?','08:08 AM');
  await message(morning,'Player','a little.','08:08 AM');
  await message(morning,'Martin','sorry.','08:08 AM');
  await message(morning,'Player','you texted me before 8. you knew what you were doing.','08:09 AM');
  await message(morning,'Martin','fair.','08:09 AM');
  await message(morning,'Martin',"how's your first class today?",'08:09 AM');
  await message(morning,'Player','8 AM class. i might not survive.','08:10 AM');
  await message(morning,'Martin','same.','08:10 AM');
  await message(morning,'Player','what class do you have?','08:10 AM');
  await message(morning,'Martin','media psychology.','08:10 AM');
  await message(morning,'Player','that sounds painful.','08:11 AM');
  await message(morning,'Martin','it probably is.','08:11 AM');
  await message(morning,'Martin','what about you?','08:11 AM');
  await message(morning,'Player','introduction to communication.','08:11 AM');
  await message(morning,'Martin',"so we're both suffering.",'08:12 AM');
  await message(morning,'Player','together, apparently.','08:12 AM');
  await message(morning,'Martin','apparently.','08:12 AM');

  await message(morning,'Martin',"it's weird that orientation is already over.",'08:13 AM');
  await message(morning,'Player','right? it feels like we just met.','08:13 AM');
  await message(morning,'Martin','and now everyone disappeared into their own schedules.','08:14 AM');
  await message(morning,'Player','silvia has classes all day.','08:14 AM');
  await message(morning,'Martin','keonho too. he complained about it for twenty minutes.','08:14 AM');
  await message(morning,'Player','that sounds like him.','08:15 AM');
  await message(morning,'Martin',"elvaro's busy too.",'08:15 AM');
  await message(morning,'Player','and seonghyeon?','08:15 AM');
  await message(morning,'Martin','probably studying already.','08:15 AM');
  await message(morning,'Player','responsible people are scary.','08:16 AM');
  await message(morning,'Martin',"good thing i'm not one of them.",'08:16 AM');
  await message(morning,'Player','debatable.','08:16 AM');
  await message(morning,'Martin','ouch.','08:17 AM');
  await message(morning,'Martin',"anyway, don't forget to eat before your next class.",'08:17 AM');
  await message(morning,'Player','there it is.','08:17 AM');
  await message(morning,'Martin','what?','08:17 AM');
  await message(morning,'Player','the mom behavior.','08:18 AM');
  await message(morning,'Martin',"i'm consistent.",'08:18 AM');
  await message(morning,'Player','apparently.','08:18 AM');
  await message(morning,'Martin','have a good class.','08:18 AM');
  await message(morning,'Player','you too.','08:18 AM');

  chatShell({
    type: 'group',
    name: group.name,
    status: group.status,
    subtitle: '12:41 PM — BETWEEN CLASSES'
  });
  const groupChat = document.getElementById('chat');

  await message(groupChat,'Silvia','how is everyone alive?','12:41 PM');
  await message(groupChat,'Keonho','barely.','12:41 PM');
  await message(groupChat,'Elvaro','same.','12:41 PM');
  await message(groupChat,'Seonghyeon','i have another class in twenty minutes.','12:42 PM');
  await message(groupChat,'Silvia','same 😭','12:42 PM');
  await message(groupChat,'Martin','[NAME], are you free for lunch?','12:42 PM');
  await message(groupChat,'Player','for a little bit.','12:42 PM');
  await message(groupChat,'Martin','good.','12:42 PM');
  await message(groupChat,'Keonho','why does that sound suspicious?','12:43 PM');
  await message(groupChat,'Martin',"it isn't.",'12:43 PM');
  await message(groupChat,'Silvia',"that's exactly what a suspicious person would say.",'12:43 PM');
  await message(groupChat,'Martin','i hate this group.','12:43 PM');
  await message(groupChat,'Keonho',"no you don't.",'12:43 PM');

  chatShell({
    type: 'dm',
    name: 'Martin',
    status: 'online',
    avatar: profiles.Martin,
    subtitle: '01:15 PM — PRIVATE CHAT'
  });
  const lunch = document.getElementById('chat');

  await message(lunch,'Martin','you made it to lunch.','01:15 PM');
  await message(lunch,'Player','barely.','01:15 PM');
  await message(lunch,'Martin','same.','01:15 PM');
  await message(lunch,'Player','what are you eating?','01:16 PM');
  await message(lunch,'Martin',"haven't decided.",'01:16 PM');
  await message(lunch,'Martin','what do you usually get when you want something you actually like?','01:16 PM');
  await message(lunch,'Player','why?','01:17 PM');
  await message(lunch,'Martin','random question.','01:17 PM');
  await message(lunch,'Player','suspicious.','01:17 PM');
  await message(lunch,'Martin','maybe.','01:17 PM');
  await message(lunch,'Martin','just tell me.','01:18 PM');

  showChoices([
    {text:'Iced coffee. Always.', effect:()=>{state.favoriteThing='iced coffee';state.affection+=1;}},
    {text:'Chocolate. It fixes everything.', effect:()=>{state.favoriteThing='chocolate';state.affection+=2;}},
    {text:'Fries. I could eat them anytime.', effect:()=>{state.favoriteThing='fries';state.trust+=1;}}
  ], async favoriteChoice => {
    favoriteChoice.effect();
    await message(lunch,'Player',favoriteChoice.text,'01:18 PM');
    await message(lunch,'Martin','noted.','01:18 PM');
    await message(lunch,'Player','why did you say it like that?','01:19 PM');
    await message(lunch,'Martin','like what?','01:19 PM');
    await message(lunch,'Player',"like you're collecting evidence.",'01:19 PM');
    await message(lunch,'Martin','maybe i am.','01:19 PM');
    await message(lunch,'Player',"that's concerning.",'01:20 PM');
    await message(lunch,'Martin',"you'll survive.",'01:20 PM');
    await message(lunch,'Player','hopefully.','01:20 PM');

    chatShell({
      type: 'group',
      name: group.name,
      status: group.status,
      subtitle: '04:26 PM — AFTER CLASSES'
    });
    const afternoon = document.getElementById('chat');

    await systemMessage(afternoon,'04:26 PM','Classes are ending at different times today.');
    await message(afternoon,'Silvia',"i'm finally done.",'04:26 PM');
    await message(afternoon,'Keonho','i have one more class.','04:26 PM');
    await message(afternoon,'Elvaro','same.','04:27 PM');
    await message(afternoon,'Seonghyeon',"i'm going to the library after this.",'04:27 PM');
    await message(afternoon,'Martin',"i'm heading to the canteen first.",'04:27 PM');
    await message(afternoon,'Player','i still have one class.','04:27 PM');
    await message(afternoon,'Martin','good luck.','04:28 PM');
    await message(afternoon,'Player','you too.','04:28 PM');
    await message(afternoon,'Keonho','look at us. actual university students.','04:28 PM');
    await message(afternoon,'Elvaro','unfortunately.','04:28 PM');

    chatShell({
      type: 'dm',
      name: 'Martin',
      status: 'online',
      avatar: profiles.Martin,
      subtitle: '08:03 PM — PRIVATE CHAT'
    });
    const evening = document.getElementById('chat');

    await message(evening,'Martin','hey.','08:03 PM');
    await message(evening,'Player','hey.','08:03 PM');
    await message(evening,'Martin','what are you doing?','08:04 PM');
    await message(evening,'Player','finally resting. you?','08:04 PM');
    await message(evening,'Martin','just got back.','08:04 PM');
    await message(evening,'Player','long day?','08:05 PM');
    await message(evening,'Martin','yeah.','08:05 PM');
    await message(evening,'Martin','i was in the canteen earlier.','08:05 PM');
    await message(evening,'Player','okay?','08:06 PM');
    await message(evening,'Martin','and i saw something that reminded me of you.','08:06 PM');
    await message(evening,'Player','me? why?','08:06 PM');
    await message(evening,'Martin',`you said you liked ${state.favoriteThing}.`,'08:07 PM');
    await message(evening,'Martin','i found something that reminded me of it.','08:08 PM');
    await message(evening,'Player','you actually remembered?','08:08 PM');
    await message(evening,'Martin','i told you.','08:08 PM');
    await message(evening,'Martin','i remember things.','08:09 PM');

    showChoices([
      {text:"That's actually really sweet.", effect:()=>state.affection+=2},
      {text:'You pay too much attention.', effect:()=>state.affection+=1},
      {text:"You didn't have to do that.", effect:()=>state.trust+=1}
    ], async choice => {
      choice.effect();
      await message(evening,'Player',choice.text,'08:09 PM');
      await message(evening,'Martin','maybe.','08:10 PM');
      await message(evening,'Player','then why did you?','08:10 PM');
      await message(evening,'Martin','because i saw it and thought of you.','08:11 PM');
      await message(evening,'Player',"that's it?",'08:11 PM');
      await message(evening,'Martin','what else would it be?','08:11 PM');
      await message(evening,'Player',"i don't know.",'08:12 PM');
      await message(evening,'Martin','you overthink.','08:12 PM');
      await message(evening,'Player',"and you don't?",'08:12 PM');
      await message(evening,'Martin','not when it comes to this.','08:13 PM');
      await message(evening,'Player','this?','08:13 PM');
      await message(evening,'Martin','talking to you.','08:13 PM');
      await message(evening,'Player','oh.','08:14 PM');
      await message(evening,'Martin','yeah.','08:14 PM');

      await message(evening,'Martin','how was your day, really?','10:03 PM');
      await message(evening,'Player','tiring. but okay.','10:04 PM');
      await message(evening,'Martin','same.','10:04 PM');
      await message(evening,'Player',"at least we're getting used to the schedules.",'10:05 PM');
      await message(evening,'Martin','a little.','10:05 PM');
      await message(evening,'Martin',"and i guess i'm getting used to texting you too.",'10:06 PM');
      await message(evening,'Player','is that a bad thing?','10:06 PM');
      await message(evening,'Martin','no.','10:07 PM');
      await message(evening,'Player','good.','10:07 PM');
      await message(evening,'Martin',"i think it's becoming a habit.",'10:08 PM');
      await message(evening,'Player','a little habit?','10:08 PM');
      await message(evening,'Martin','maybe.','10:09 PM');
      await message(evening,'Player',"and you're okay with that?",'10:09 PM');
      await message(evening,'Martin','I know. I wanted to.','10:10 PM');

      endEpisode(
        4,
        'A LITTLE HABIT',
        'Somewhere between busy schedules and ordinary days, talking to each other started to feel less like a coincidence.',
        'CONTINUE',
        () => replayPrompt()
      );
    });
  });
}

function replayPrompt() {
  screen.innerHTML = `
    <div class="screen center fade">
      <div class="eyebrow">✦ END OF EPISODE 04</div>
      <h1>Episode 4<br><span class="script">complete.</span></h1>
      <p class="subtitle">The story will continue from here.</p>
      <button class="primary" id="replay">REPLAY FROM START</button>
    </div>`;
  document.getElementById('replay').onclick = () => location.reload();
}
startScreen();
