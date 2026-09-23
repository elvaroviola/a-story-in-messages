const screens = {
  welcome: document.getElementById("welcome-screen"),
  name: document.getElementById("name-screen"),
  chat: document.getElementById("chat-screen"),
  end: document.getElementById("end-screen")
};

const startBtn = document.getElementById("start-btn");
const nameBtn = document.getElementById("name-btn");
const nameInput = document.getElementById("name-input");
const nameError = document.getElementById("name-error");
const replayBtn = document.getElementById("replay-btn");
const backBtn = document.getElementById("back-btn");
const chatMessages = document.getElementById("chat-messages");
const choiceArea = document.getElementById("choice-area");
const choices = document.getElementById("choices");
const statusText = document.getElementById("status-text");

let playerName = "";
let martinAffection = 0;

const groupIntro = [
  { sender:"Silvia", text:"hey everyone!! good morninggg 🥹", delay:650 },
  { sender:"Keonho", text:"morning", delay:650 },
  { sender:"Elvaro", text:"is it really morning if i haven't had coffee", delay:850 },
  { sender:"Seonghyeon", text:"it's 8 AM", delay:650 },
  { sender:"Elvaro", text:"exactly. too early.", delay:700 },
  { sender:"Keonho", text:"who made this group anyway", delay:700 },
  { sender:"Silvia", text:"the orientation committee 😭", delay:650 },
  { sender:"Silvia", text:"they said we should introduce ourselves before tomorrow", delay:850 },
  { sender:"Keonho", text:"tomorrow already???", delay:650 },
  { sender:"Elvaro", text:"i chose not to acknowledge it.", delay:750 },
  { sender:"Keonho", text:"respect.", delay:550 }
];

const intros = [
  { sender:"Silvia", text:"okay let's make this easy.", delay:650 },
  { sender:"Silvia", text:"name + major + one random fact about yourself!", delay:800 },
  { sender:"Elvaro", text:"that's not easy", delay:650 },
  { sender:"Silvia", text:"how is that not easy", delay:650 },
  { sender:"Elvaro", text:"what if i don't have a random fact", delay:750 },
  { sender:"Seonghyeon", text:"then you're boring.", delay:650 },
  { sender:"Elvaro", text:"blocked.", delay:550 },
  { sender:"Silvia", text:"okayyy, let's start.", delay:650 },
  { sender:"Silvia", text:"Keonho first.", delay:550 },
  { sender:"Keonho", text:"why me", delay:600 },
  { sender:"Silvia", text:"because i said so.", delay:550 },
  { sender:"Keonho", text:"fine.", delay:500 },
  { sender:"Keonho", text:"I'm Keonho, Visual Communication Design.", delay:800 },
  { sender:"Keonho", text:"random fact: I sleep a lot.", delay:700 },
  { sender:"Elvaro", text:"that's not a fact. that's a warning.", delay:700 },
  { sender:"Keonho", text:"shut up.", delay:500 },
  { sender:"Silvia", text:"Elvaro!", delay:600 },
  { sender:"Elvaro", text:"Elvaro, Film.", delay:600 },
  { sender:"Elvaro", text:"random fact: I judge people based on their playlists.", delay:850 },
  { sender:"Keonho", text:"that's concerning.", delay:600 },
  { sender:"Elvaro", text:"your playlist would concern me too.", delay:700 },
  { sender:"Seonghyeon", text:"Seonghyeon, Information Systems.", delay:700 },
  { sender:"Seonghyeon", text:"I don't have a random fact.", delay:650 },
  { sender:"Silvia", text:"boring.", delay:500 },
  { sender:"Seonghyeon", text:"I knew someone would say that.", delay:650 },
  { sender:"Silvia", text:"okay my turn!", delay:600 },
  { sender:"Silvia", text:"Silvia, Communication.", delay:650 },
  { sender:"Silvia", text:"random fact: I talk too much when I'm nervous.", delay:800 },
  { sender:"Keonho", text:"we noticed.", delay:600 },
  { sender:"Silvia", text:"KEONHO 😭", delay:500 }
];

const choice1 = {
  label: "Introduce yourself",
  options: [
    {
      text: "I'm [NAME], Communication. I like reading and watching movies.",
      points: 2,
      messages: [
        {sender:"Player", text:"I'm [NAME], Communication. I like reading and watching movies.", you:true},
        {sender:"Silvia", text:"ooo communication gang!!", delay:700},
        {sender:"Silvia", text:"and reading?? what kind of books?", delay:800},
        {sender:"Player", text:"mostly novels.", you:true},
        {sender:"Elvaro", text:"okay that's actually a good answer.", delay:700},
        {sender:"Martin", text:"yeah, that's a pretty safe answer.", delay:950},
        {sender:"Player", text:"what's that supposed to mean 😭", you:true},
        {sender:"Martin", text:"nothing.", delay:650},
        {sender:"Martin", text:"just saying.", delay:700}
      ]
    },
    {
      text: "Do I really have to introduce myself? 😭",
      points: 1,
      messages: [
        {sender:"Player", text:"Do I really have to introduce myself? 😭", you:true},
        {sender:"Silvia", text:"YES 😭", delay:700},
        {sender:"Silvia", text:"you have to.", delay:650},
        {sender:"Keonho", text:"finally someone asked the important question.", delay:750},
        {sender:"Seonghyeon", text:"you two are going to be a problem.", delay:700},
        {sender:"Player", text:"fine.", you:true},
        {sender:"Player", text:"I'm [NAME], Communication.", you:true},
        {sender:"Martin", text:"short and efficient.", delay:900},
        {sender:"Player", text:"exactly.", you:true},
        {sender:"Martin", text:"I respect that.", delay:800}
      ]
    },
    {
      text: "I'm [NAME]. That's basically it.",
      points: -1,
      messages: [
        {sender:"Player", text:"I'm [NAME]. That's basically it.", you:true},
        {sender:"Silvia", text:"that's it??? 😭", delay:700},
        {sender:"Player", text:"yep.", you:true},
        {sender:"Keonho", text:"honestly fair.", delay:650},
        {sender:"Elvaro", text:"mysterious.", delay:650},
        {sender:"Martin", text:"I think that's enough information for day one.", delay:900},
        {sender:"Player", text:"thank you.", you:true},
        {sender:"Martin", text:"you're welcome.", delay:700}
      ]
    }
  ]
};

const scheduleIntro = [
  { sender:"Silvia", text:"WAIT.", delay:700 },
  { sender:"Silvia", text:"did everyone get the orientation schedule?", delay:850 },
  { sender:"Keonho", text:"no", delay:600 },
  { sender:"Elvaro", text:"yes", delay:550 },
  { sender:"Seonghyeon", text:"yes.", delay:550 },
  { sender:"Keonho", text:"why does everyone have it except me", delay:750 },
  { sender:"Elvaro", text:"maybe check your email.", delay:650 },
  { sender:"Keonho", text:"I DID.", delay:650 },
  { sender:"Seonghyeon", text:"check again.", delay:600 },
  { sender:"Keonho", text:"I hate this group.", delay:650 },
  { sender:"Silvia", text:"HAHAHAHAHA", delay:650 },
  { sender:"Martin", text:"it's in the attachment from yesterday.", delay:900 },
  { sender:"Keonho", text:"there was an attachment?", delay:700 },
  { sender:"Elvaro", text:"I'm begging you to read your emails.", delay:750 },
  { sender:"Keonho", text:"oh.", delay:500 },
  { sender:"Keonho", text:"found it.", delay:550 },
  { sender:"Seonghyeon", text:"incredible.", delay:650 },
  { sender:"Martin", text:"btw, what time does your orientation start tomorrow?", delay:950 },
  { sender:"Silvia", text:"8 AM I think?", delay:700 },
  { sender:"Keonho", text:"8???", delay:600 },
  { sender:"Elvaro", text:"welcome to university.", delay:700 },
  { sender:"Keonho", text:"I haven't even started and I already hate it.", delay:750 }
];

const choice2 = [
  {
    text:"I think so. I'll send you the schedule.",
    points:2,
    messages:[
      {sender:"Player",text:"I think so. I'll send you the schedule.",you:true},
      {sender:"Martin",text:"oh, thanks.",delay:700},
      {sender:"Martin",text:"I was looking at the wrong file apparently.",delay:800},
      {sender:"Player",text:"you and Keonho should start a support group.",you:true},
      {sender:"Martin",text:"honestly, maybe.",delay:750},
      {sender:"Keonho",text:"why am I involved",delay:600},
      {sender:"Elvaro",text:"because you're incompetent.",delay:650},
      {sender:"Keonho",text:"blocked.",delay:550}
    ]
  },
  {
    text:"No idea. I thought you knew 😭",
    points:1,
    messages:[
      {sender:"Player",text:"No idea. I thought you knew 😭",you:true},
      {sender:"Martin",text:"wow.",delay:650},
      {sender:"Martin",text:"I thought you looked like you knew what you were doing.",delay:850},
      {sender:"Player",text:"that's a dangerous assumption.",you:true},
      {sender:"Martin",text:"noted.",delay:650},
      {sender:"Martin",text:"I'll figure it out myself then.",delay:750},
      {sender:"Player",text:"good luck soldier 🫡",you:true},
      {sender:"Martin",text:"I'll need it.",delay:700}
    ]
  },
  {
    text:"Why? Are you already lost?",
    points:1,
    messages:[
      {sender:"Player",text:"Why? Are you already lost?",you:true},
      {sender:"Martin",text:"maybe.",delay:750},
      {sender:"Player",text:"it's literally orientation.",you:true},
      {sender:"Martin",text:"exactly.",delay:650},
      {sender:"Player",text:"😭",you:true},
      {sender:"Martin",text:"glad you're enjoying my suffering.",delay:800}
    ]
  }
];

const nightOpen = [
  {sender:"Martin",text:"hey.",delay:900},
  {sender:"Martin",text:"[NAME]?",delay:850},
  {sender:"Martin",text:"are you still awake?",delay:1100}
];

const choice3 = [
  {
    text:"Yeah. What's up?",
    points:1,
    messages:[
      {sender:"Player",text:"Yeah. What's up?",you:true},
      {sender:"Martin",text:"nothing serious.",delay:700},
      {sender:"Martin",text:"I just wanted to ask something.",delay:850},
      {sender:"Player",text:"what?",you:true},
      {sender:"Martin",text:"do you think tomorrow is going to be awkward?",delay:950},
      {sender:"Player",text:"the orientation?",you:true},
      {sender:"Martin",text:"yeah.",delay:600},
      {sender:"Martin",text:"I mean... we're all meeting for the first time.",delay:900},
      {sender:"Player",text:"technically we've already met.",you:true},
      {sender:"Martin",text:"online doesn't count.",delay:850},
      {sender:"Player",text:"why not?",you:true},
      {sender:"Martin",text:"I don't know.",delay:700},
      {sender:"Martin",text:"it just feels different.",delay:800}
    ]
  },
  {
    text:"Why are you awake?",
    points:2,
    messages:[
      {sender:"Player",text:"Why are you awake?",you:true},
      {sender:"Martin",text:"fair question.",delay:700},
      {sender:"Martin",text:"I could ask you the same thing.",delay:800},
      {sender:"Player",text:"I asked first.",you:true},
      {sender:"Martin",text:"can't sleep.",delay:700},
      {sender:"Player",text:"nervous about tomorrow?",you:true},
      {sender:"Martin",text:"maybe.",delay:700},
      {sender:"Martin",text:"yeah.",delay:500},
      {sender:"Martin",text:"a little.",delay:700}
    ]
  },
  {
    text:"I'm about to sleep.",
    points:0,
    messages:[
      {sender:"Player",text:"I'm about to sleep.",you:true},
      {sender:"Martin",text:"oh.",delay:650},
      {sender:"Martin",text:"sorry 😭",delay:550},
      {sender:"Player",text:"it's okay. what's up?",you:true},
      {sender:"Martin",text:"I just wanted to ask something.",delay:800},
      {sender:"Player",text:"go ahead.",you:true},
      {sender:"Martin",text:"do you think tomorrow is going to be awkward?",delay:950}
    ]
  }
];

const nightClose = [
  {sender:"Martin",text:"I know it's stupid.",delay:750},
  {sender:"Martin",text:"we've only talked for one day.",delay:800},
  {sender:"Martin",text:"but somehow I feel like I've known everyone for longer.",delay:950},
  {sender:"Player",text:"maybe that's because we've been talking all day.",you:true},
  {sender:"Martin",text:"true.",delay:600},
  {sender:"Martin",text:"especially this group.",delay:700},
  {sender:"Player",text:"they're chaotic.",you:true},
  {sender:"Martin",text:"very.",delay:600},
  {sender:"Player",text:"especially Keonho.",you:true},
  {sender:"Martin",text:"especially Keonho.",delay:650},
  {sender:"Keonho",text:"why do I feel like someone's talking about me",delay:900},
  {sender:"Player",text:"how are you still awake???",you:true},
  {sender:"Keonho",text:"I have insomnia and excellent intuition.",delay:750},
  {sender:"Martin",text:"go to sleep.",delay:650},
  {sender:"Keonho",text:"make me.",delay:650},
  {sender:"Elvaro",text:"this group needs supervision.",delay:700},
  {sender:"Silvia",text:"GOOD NIGHT EVERYONE 😭",delay:750},
  {sender:"Seonghyeon",text:"good night.",delay:550},
  {sender:"Martin",text:"well.",delay:800},
  {sender:"Martin",text:"I guess I'll see you tomorrow.",delay:750},
  {sender:"Player",text:"see you tomorrow.",you:true},
  {sender:"Martin",text:"good night, [NAME].",delay:850},
  {sender:"Player",text:"good night.",you:true},
  {sender:"Martin",text:"and don't oversleep.",delay:800},
  {sender:"Player",text:"no promises.",you:true},
  {sender:"Martin",text:"I had a feeling you'd say that.",delay:900}
];

function showScreen(screen){
  Object.values(screens).forEach(s=>s.classList.remove("active"));
  screen.classList.add("active");
}
function wait(ms){return new Promise(r=>setTimeout(r,ms))}
function scrollBottom(){requestAnimationFrame(()=>chatMessages.scrollTop=chatMessages.scrollHeight)}
function escapeHtml(v){return v.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;")}
function personalize(text){return text.replaceAll("[NAME]",escapeHtml(playerName))}
function addDate(text){const d=document.createElement("div");d.className="date-divider";d.textContent=text;chatMessages.appendChild(d);scrollBottom()}
function addBubble(sender,text,you=false){
  const row=document.createElement("div");row.className=`message-row ${you?"you":"them"}`;
  const b=document.createElement("div");b.className="bubble";
  const name=`<div class="sender-name">${escapeHtml(you ? playerName : personalize(sender))}</div>`;
  b.innerHTML=`${name}${personalize(text)}<span class="message-time">now</span>`;
  row.appendChild(b);chatMessages.appendChild(row);scrollBottom();
}
function addTyping(){
  const row=document.createElement("div");row.className="typing-row";row.id="typing-indicator";
  row.innerHTML=`<div class="typing-bubble"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>`;
  chatMessages.appendChild(row);scrollBottom();
}
function removeTyping(){document.getElementById("typing-indicator")?.remove()}

function typingDuration(text, customDelay){
  if(customDelay != null) return customDelay;
  const clean = text.replace(/\\[NAME\\]/g, playerName).trim();
  const length = clean.length;
  // Short replies feel immediate; longer/thoughtful messages take longer.
  if(length <= 14) return 900;
  if(length <= 30) return 1200;
  if(length <= 55) return 1550;
  if(length <= 85) return 1900;
  return 2250;
}

async function sendMessage(m){
  const isTuple = Array.isArray(m);
  const sender = isTuple ? m[0] : m.sender;
  const text = isTuple ? m[1] : m.text;
  const you = isTuple ? m[2] === true : m.you === true;
  const delay = isTuple && typeof m[2] === "number" ? m[2] : (m.delay ?? null);

  if(you){
    await wait(350);
    addBubble(playerName,text,true);
    await wait(350);
    return;
  }

  addTyping();
  await wait(typingDuration(text, delay));
  removeTyping();
  addBubble(sender,text,false);
  await wait(450);
}
async function playMessages(list){
  for(const m of list) await sendMessage(m);
}
function showChoices(data, callback){
  choices.innerHTML="";
  data.forEach((item,i)=>{
    const btn=document.createElement("button");
    btn.className="choice";
    btn.textContent=personalize(item.text);
    btn.onclick=()=>callback(item,i);
    choices.appendChild(btn);
  });
  choiceArea.classList.remove("hidden");
  scrollBottom();
}
function hideChoices(){choiceArea.classList.add("hidden")}


const ep2Morning = [
  ["Silvia","GOOD MORNING EVERYONEEEE ☀️",900],
  ["Keonho","why are you awake this early",1100],
  ["Silvia","because today's orientation???",1000],
  ["Keonho","exactly why I'm not emotionally prepared",1300],
  ["Elvaro","it's 7:41",900],
  ["Elvaro","orientation starts in 19 minutes",1200],
  ["Keonho","that's not helping",1000],
  ["Seonghyeon","did everyone already join the Zoom?",1200],
  ["Silvia","WAIT",800],
  ["Silvia","WHAT",700],
  ["Silvia","WE HAVE TO JOIN NOW???",1200],
  ["Keonho","I'M STILL IN BED",1000],
  ["Elvaro","congratulations.",1000]
];

const ep2Choice1 = [
  {text:"Yeah, I'm already ready.",points:2,msg:[
    ["[NAME]","Yeah, I'm already ready.",true],["Martin","impressive.",1200],
    ["[NAME]","why?",true],["Martin","you sounded like someone who would oversleep.",1500],
    ["[NAME]","wow.",true],["Martin","I said sounded.",1100],["[NAME]","sure.",true],["Martin","fair enough.",1000]
  ]},
  {text:"No 😭 I'm still getting ready.",points:2,msg:[
    ["[NAME]","No 😭 I'm still getting ready.",true],["Martin","I knew it.",1100],
    ["[NAME]","how???",true],["Martin","you literally said \"no promises\" last night.",1600],
    ["[NAME]","you remembered that?",true],["Martin","unfortunately.",1200],
    ["[NAME]","rude.",true],["Martin","just hurry up.",1100]
  ]},
  {text:"I was about to ask you the same thing.",points:1,msg:[
    ["[NAME]","I was about to ask you the same thing.",true],["Martin","I'm ready.",1000],
    ["[NAME]","really?",true],["Martin","yes.",800],["[NAME]","prove it.",true],
    ["Martin","what kind of proof do you want 😭",1500],["[NAME]","I don't know.",true],
    ["Martin","then I'll assume I passed.",1300]
  ]}
];

const ep2After1 = [
  ["Silvia","GUYS",850],["Silvia","THE LINK IS IN THE EMAIL",1300],["Keonho","we know",900],
  ["Silvia","I'M JUST MAKING SURE",1200],["Elvaro","thank you for your service.",1200],
  ["Seonghyeon","I'm joining.",950],["Keonho","wait for me",900],["Elvaro","no.",700],
  ["Keonho","why",800],["Elvaro","because you said you were still in bed.",1500],
  ["Martin","I'm joining too.",1100],["Martin","see you there.",1000]
];

const ep2PrivateIntro = [["Martin","hey.",1100],["Martin","are you actually paying attention?",1700]];

const ep2Choice2 = [
  {text:"Of course I am.",points:1,msg:[
    ["[NAME]","Of course I am.",true],["Martin","good.",900],
    ["Martin","because I have no idea what's happening.",1500],["[NAME]","😭",true],
    ["Martin","I thought you knew.",1200],["[NAME]","I was just pretending.",true],
    ["Martin","so we're both pretending.",1300],["[NAME]","apparently.",true],["Martin","nice.",900]
  ]},
  {text:"Not really 😭",points:2,msg:[
    ["[NAME]","Not really 😭",true],["Martin","thank god.",1100],["[NAME]","why?",true],
    ["Martin","I thought I was the only one.",1400],["[NAME]","what are you doing then?",true],
    ["Martin","looking at the screen and hoping something makes sense.",1900],
    ["[NAME]","same.",true],["Martin","good.",900],["Martin","we're doing great.",1300]
  ]},
  {text:"Why? Are you?",points:2,msg:[
    ["[NAME]","Why? Are you?",true],["Martin","...",900],["Martin","no.",800],
    ["[NAME]","HAHAHAHA",true],["Martin","don't expose me.",1200],
    ["[NAME]","I won't.",true],["Martin","thank you.",1000],["[NAME]","you're welcome.",true]
  ]}
];

const ep2Choice3 = [
  {text:"Maybe something creative.",points:2,msg:[
    ["[NAME]","Maybe something creative.",true],["Martin","makes sense.",1100],
    ["[NAME]","why?",true],["Martin","I don't know.",900],
    ["Martin","you just seem like that kind of person.",1600],["[NAME]","what kind?",true],
    ["Martin","I'll tell you when I figure it out.",1500],["[NAME]","that's suspicious.",true],["Martin","maybe.",1000]
  ]},
  {text:"Probably nothing. I just want to survive university.",points:1,msg:[
    ["[NAME]","Probably nothing. I just want to survive university.",true],
    ["Martin","that's actually a good goal.",1400],["[NAME]","thank you.",true],
    ["Martin","we can survive together.",1400],["[NAME]","\"we\"?",true],
    ["Martin","as classmates.",1200],["[NAME]","sure.",true],["Martin","don't make it weird 😭",1400]
  ]},
  {text:"I haven't decided. Maybe I'll figure it out later.",points:1,msg:[
    ["[NAME]","I haven't decided. Maybe I'll figure it out later.",true],["Martin","same.",900],
    ["[NAME]","at least I'm not the only one.",true],["Martin","nope.",850],
    ["Martin","we can figure it out eventually.",1400]
  ]}
];

const ep2GroupEnd = [
  ["Silvia","WE SURVIVED!!!!",1000],["Keonho","barely",850],["Elvaro","speak for yourself",1100],
  ["Seonghyeon","we still have another session later.",1500],["Keonho","...",900],
  ["Keonho","I take it back.",1000],["Silvia","HAHAHAHA",900],
  ["Martin","I'll probably disappear for a bit.",1400],["Silvia","where are you going?",1000],
  ["Martin","lunch.",850],["Keonho","without us???",1200],["Martin","yes.",800],["Elvaro","cruel.",900]
];

const ep2Choice4 = [
  {text:"Yeah, I'm hungry.",points:2,msg:[
    ["[NAME]","Yeah, I'm hungry.",true],["Martin","good.",900],["Martin","go eat.",950],
    ["[NAME]","you too.",true],["Martin","I will.",850],["[NAME]","promise?",true],["Martin","promise.",1000]
  ]},
  {text:"Not yet.",points:1,msg:[
    ["[NAME]","Not yet.",true],["Martin","you should eat.",1100],["[NAME]","I'll eat later.",true],
    ["Martin","don't forget.",1050],["[NAME]","I won't.",true],["Martin","good.",850]
  ]},
  {text:"Are you inviting me? 👀",points:3,msg:[
    ["[NAME]","Are you inviting me? 👀",true],["Martin","maybe.",1500],["[NAME]","maybe???",true],
    ["Martin","I was just asking.",1400],["[NAME]","sure.",true],["Martin","don't make this difficult 😭",1500],
    ["[NAME]","I'm not.",true],["Martin","you are.",1100]
  ]}
];

const ep2Final = [
  ["Martin","anyway.",950],["Martin","I'll see you later.",1200],["[NAME]","see you.",true],
  ["Martin","and [NAME]?",1400],["[NAME]","yeah?",true],["Martin","glad you joined the group.",1600],
  ["[NAME]","why?",true],["Martin","I don't know.",1000],
  ["Martin","the group would've been more boring without you.",1900],
  ["Martin","don't let that get to your head.",1500],["[NAME]","too late.",true],["Martin","😭",900]
];

async function episode2(){
  await transitionTo("UMN Freshman Orientation","online","U","SEPTEMBER 2020 · 7:41 AM");
  await playMessages(ep2Morning);
  await sendMessage(["Martin","[NAME], are you joining already?",1100]);
  showChoices(ep2Choice1,async c1=>{
    hideChoices();martinAffection+=c1.points;await playMessages(c1.msg);await playMessages(ep2After1);

    await transitionTo("Martin","online","M","PRIVATE CHAT · 8:03 AM");
    await playMessages(ep2PrivateIntro);
    showChoices(ep2Choice2,async c2=>{
      hideChoices();martinAffection+=c2.points;
      await playMessages(c2.msg);await wait(650);
      await playMessages([
        ["Martin","they're talking about campus organizations now.",1400],
        ["[NAME]","already?",true],["Martin","apparently.",900],
        ["[NAME]","have you thought about joining one?",true],
        ["Martin","maybe.",900],["[NAME]","which one?",true],
        ["Martin","not sure yet.",1000],["Martin","you?",1100]
      ]);
      showChoices(ep2Choice3,async c3=>{
        hideChoices();martinAffection+=c3.points;await playMessages(c3.msg);

        await transitionTo("UMN Freshman Orientation","online","U","SEPTEMBER 2020 · 10:16 AM");
        await playMessages(ep2GroupEnd);
        await sendMessage(["Martin","[NAME], you eating too?",1300]);
        showChoices(ep2Choice4,async c4=>{
          hideChoices();martinAffection+=c4.points;await playMessages(c4.msg);

          await transitionTo("Martin","online","M","PRIVATE CHAT · 10:29 AM");
          await playMessages(ep2Final);
          await wait(1800);
          statusText.textContent="last seen just now";
          await wait(700);
          showScreen(screens.end);
        });
      });
    });
  });
}



async function transitionTo(title,status,letter,date){
  await wait(1200);
  chatMessages.innerHTML="";
  document.getElementById("chat-title").textContent=title;
  statusText.textContent=status;
  if(avatar) avatar.textContent=letter;
  addDate(date);
  await wait(750);
}


async function beginStory(){
  const value=nameInput.value.trim();
  if(!value){nameError.textContent="Tell me your name first.";nameInput.focus();return}
  playerName=value;martinAffection=0;nameError.textContent="";
  showScreen(screens.chat);
  chatMessages.innerHTML="";
  document.getElementById("chat-title").textContent="UMN Freshman Orientation";
  statusText.textContent="online";
  if(avatar) avatar.textContent="M";
  await wait(650);
  addDate("SEPTEMBER 2020 · 8:12 AM");
  await playMessages(groupIntro);
  await playMessages(intros);
  showChoices(choice1.options, async (selected)=>{
    hideChoices();martinAffection+=selected.points;await playMessages(selected.messages);
    await playMessages(scheduleIntro);
    await sendMessage({sender:"Martin",text:"[NAME], do you know if we're supposed to join the Zoom call individually?",delay:1000});
    showChoices(choice2, async (selected2)=>{
      hideChoices();martinAffection+=selected2.points;await playMessages(selected2.messages);
      await wait(800);
      addDate("SEPTEMBER 2020 · 11:47 PM");
      await playMessages(nightOpen);
      showChoices(choice3, async (selected3)=>{
        hideChoices();martinAffection+=selected3.points;await playMessages(selected3.messages);
        await playMessages(nightClose);
        await wait(1300);
        statusText.textContent="last seen just now";
        await wait(900);
        await episode2();
      });
    });
  });
}

startBtn.onclick=()=>{showScreen(screens.name);setTimeout(()=>nameInput.focus(),250)}
nameBtn.onclick=beginStory;
nameInput.onkeydown=e=>{if(e.key==="Enter")beginStory()}
replayBtn.onclick=()=>{nameInput.value="";nameError.textContent="";showScreen(screens.welcome)}
backBtn.onclick=()=>showScreen(screens.name);
