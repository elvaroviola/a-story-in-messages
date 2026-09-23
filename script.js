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
const choiceLabel = document.getElementById("choice-label");
const chatTitle = document.getElementById("chat-title");
const statusText = document.getElementById("status-text");
const avatar = document.querySelector(".martin-avatar");

let playerName = "";
let martinAffection = 0;

function wait(ms){return new Promise(r=>setTimeout(r,ms))}
function personalize(text){return text.replaceAll("[NAME]",playerName)}
function showScreen(screen){Object.values(screens).forEach(s=>s.classList.remove("active"));screen.classList.add("active")}
function scrollBottom(){requestAnimationFrame(()=>chatMessages.scrollTop=chatMessages.scrollHeight)}
function addDate(text){const d=document.createElement("div");d.className="date-divider";d.textContent=text;chatMessages.appendChild(d);scrollBottom()}
function addBubble(sender,text,you=false){
  const row=document.createElement("div");row.className=`message-row ${you?"you":"them"}`;
  const b=document.createElement("div");b.className="bubble";
  b.innerHTML=`${you?"":`<div class="sender-name">${personalize(sender)}</div>`}${personalize(text)}<span class="message-time">now</span>`;
  row.appendChild(b);chatMessages.appendChild(row);scrollBottom();
}
function addTyping(){
  const row=document.createElement("div");row.className="typing-row";row.id="typing-indicator";
  row.innerHTML=`<div class="typing-bubble"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>`;
  chatMessages.appendChild(row);scrollBottom();
}
function removeTyping(){document.getElementById("typing-indicator")?.remove()}
function setChatMode(title,status,letter){chatTitle.textContent=title;statusText.textContent=status;avatar.textContent=letter}
async function sendMessage(m){
  const [sender,text,third]=m, you=third===true, delay=typeof third==="number"?third:null;
  if(you){await wait(350);addBubble(sender,text,true);await wait(350);return}
  addTyping();await wait(delay??Math.min(2600,Math.max(850,650+text.length*24)));removeTyping();
  addBubble(sender,text,false);await wait(500);
}
async function playMessages(list){for(const m of list)await sendMessage(m)}
function showChoices(data,callback,label="How do you respond?"){
  choiceLabel.textContent=label;choices.innerHTML="";
  data.forEach(item=>{const btn=document.createElement("button");btn.className="choice";btn.textContent=personalize(item.text);btn.onclick=()=>callback(item);choices.appendChild(btn)});
  choiceArea.classList.remove("hidden");scrollBottom();
}
function hideChoices(){choiceArea.classList.add("hidden")}
async function transitionTo(title,status,letter,date){
  chatMessages.innerHTML="";
  setChatMode(title,status,letter);
  addDate(date);
  addTyping();
  await wait(1100);
  removeTyping();
}

/* =========================
   EPISODE 1
   ========================= */
const ep1Group = [
  ["Silvia","hey everyone!!",900],
  ["Keonho","is this the freshman orientation group?",1100],
  ["Seonghyeon","yes.",850],
  ["Elvaro","finally.",850],
  ["Silvia","we're actually classmates 😭",1200],
  ["Keonho","this is going to be interesting.",1300],
  ["Martin","morning.",900],
  ["Silvia","MARTINNN",950],
  ["Keonho","you actually showed up.",1000],
  ["Martin","I was here the whole time.",1200],
  ["Elvaro","sure.",850],
  ["Seonghyeon","has everyone introduced themselves?",1200],
  ["Silvia","wait that's a good idea.",1000],
  ["Silvia","let's do introductions.",1000]
];

const ep1Choice1 = [
  {text:"Hi, I'm [NAME]. Nice to meet you!",points:2,msg:[
    ["[NAME]","Hi, I'm [NAME]. Nice to meet you!",true],
    ["Silvia","nice to meet you!!",1000],
    ["Keonho","welcome to the chaos.",1100],
    ["Elvaro","accurate.",800],
    ["Martin","nice to meet you, [NAME].",1300]
  ]},
  {text:"I'm [NAME]. I don't know what else to say 😭",points:2,msg:[
    ["[NAME]","I'm [NAME]. I don't know what else to say 😭",true],
    ["Keonho","honest. I like it.",1100],
    ["Silvia","HAHAHAHA same.",900],
    ["Martin","that's enough of an introduction.",1300]
  ]},
  {text:"[NAME]. That's it.",points:1,msg:[
    ["[NAME]","[NAME]. That's it.",true],
    ["Keonho","wow.",850],
    ["Silvia","mysterious.",1000],
    ["Elvaro","efficient.",950],
    ["Martin","noted.",1000]
  ]}
];

const ep1After1 = [
  ["Silvia","okay now I feel like we're actually a group.",1200],
  ["Keonho","don't get too comfortable.",900],
  ["Elvaro","too late.",800],
  ["Seonghyeon","what time does orientation start?",1200],
  ["Martin","eight, I think.",1000],
  ["Silvia","that's soon.",900]
];

const ep1Choice2 = [
  {text:"I'm excited, honestly.",points:2,msg:[
    ["[NAME]","I'm excited, honestly.",true],
    ["Martin","really?",1000],
    ["[NAME]","yeah.",true],
    ["Martin","that's nice.",1100],
    ["Martin","I'm a little nervous.",1300],
    ["[NAME]","you?",true],
    ["Martin","a little.",1000]
  ]},
  {text:"I'm nervous.",points:2,msg:[
    ["[NAME]","I'm nervous.",true],
    ["Martin","same.",950],
    ["[NAME]","really?",true],
    ["Martin","a little.",1000],
    ["Martin","guess we're in the same boat.",1400]
  ]},
  {text:"I just want the day to be over.",points:1,msg:[
    ["[NAME]","I just want the day to be over.",true],
    ["Martin","it's not even started yet 😭",1400],
    ["[NAME]","exactly.",true],
    ["Martin","fair.",850]
  ]}
];

const ep1Choice3 = [
  {text:"Stay and keep talking.",points:2,msg:[
    ["[NAME]","I'm not sleepy yet.",true],
    ["Martin","good.",900],
    ["Martin","I was hoping you'd stay.",1500],
    ["[NAME]","why?",true],
    ["Martin","I don't know.",1000],
    ["Martin","you're easy to talk to.",1500]
  ]},
  {text:"Tell him you're tired.",points:1,msg:[
    ["[NAME]","I'm getting sleepy.",true],
    ["Martin","then you should sleep.",1000],
    ["[NAME]","you too.",true],
    ["Martin","probably.",900],
    ["Martin","goodnight, [NAME].",1400]
  ]},
  {text:"Tease him about being awake.",points:2,msg:[
    ["[NAME]","weren't you the one who said you were tired?",true],
    ["Martin","I am.",1000],
    ["[NAME]","doesn't look like it.",true],
    ["Martin","maybe you're keeping me awake.",1500],
    ["[NAME]","me?",true],
    ["Martin","maybe.",1100]
  ]}
];

async function episode1(){
  chatMessages.innerHTML="";setChatMode("UMN Freshman Orientation","online","U");
  addDate("SEPTEMBER 2020 · 8:32 AM");
  await wait(700);await playMessages(ep1Group);
  showChoices(ep1Choice1,async c1=>{
    hideChoices();martinAffection+=c1.points;await playMessages(c1.msg);await playMessages(ep1After1);
    showChoices(ep1Choice2,async c2=>{
      hideChoices();martinAffection+=c2.points;await playMessages(c2.msg);
      await transitionTo("Martin","online","M","PRIVATE CHAT · 11:48 PM");
      await sendMessage(["Martin","you still awake, [NAME]?",1500]);
      showChoices(ep1Choice3,async c3=>{
        hideChoices();martinAffection+=c3.points;await playMessages(c3.msg);
        await wait(1500);
        await sendMessage(["Martin","see you tomorrow.",1500]);
        await sendMessage(["[NAME]","see you.",true]);
        await sendMessage(["Martin","good night [NAME]",1500]);
        await sendMessage(["[NAME]","good night, Martin",true]);
        await sendMessage(["Martin","and don't oversleep",1500]);
        await sendMessage(["[NAME]","no promises",true]);
        await sendMessage(["Martin","I had a feeling you'd say that",1500]);
        await wait(1500);
        addDate("EPISODE 1 · END");
        await wait(1000);
        await episode2();
      });
    });
  });
}

/* =========================
   EPISODE 2
   ========================= */
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

startBtn.onclick=()=>{showScreen(screens.name);setTimeout(()=>nameInput.focus(),250)}
nameBtn.onclick=()=>{const n=nameInput.value.trim();if(!n){nameError.textContent="Tell me your name first.";nameInput.focus();return}playerName=n;nameError.textContent="";martinAffection=0;showScreen(screens.chat);episode1()}
nameInput.onkeydown=e=>{if(e.key==="Enter")nameBtn.click()}
replayBtn.onclick=()=>{nameInput.value="";nameError.textContent="";showScreen(screens.welcome)}
backBtn.onclick=()=>showScreen(screens.name)
