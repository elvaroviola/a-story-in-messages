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

const groupMorning = [
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
  ["Elvaro","congratulations.",1000],
];

const choice1 = [
  {
    text:"Yeah, I'm already ready.",
    points:2,
    messages:[
      ["Player","Yeah, I'm already ready.",true],
      ["Martin","impressive.",1200],
      ["Player","why?",true],
      ["Martin","you sounded like someone who would oversleep.",1500],
      ["Player","wow.",true],
      ["Martin","I said sounded.",1100],
      ["Player","sure.",true],
      ["Martin","fair enough.",1000]
    ]
  },
  {
    text:"No 😭 I'm still getting ready.",
    points:2,
    messages:[
      ["Player","No 😭 I'm still getting ready.",true],
      ["Martin","I knew it.",1100],
      ["Player","how???",true],
      ["Martin","you literally said \"no promises\" last night.",1600],
      ["Player","you remembered that?",true],
      ["Martin","unfortunately.",1200],
      ["Player","rude.",true],
      ["Martin","just hurry up.",1100]
    ]
  },
  {
    text:"I was about to ask you the same thing.",
    points:1,
    messages:[
      ["Player","I was about to ask you the same thing.",true],
      ["Martin","I'm ready.",1000],
      ["Player","really?",true],
      ["Martin","yes.",800],
      ["Player","prove it.",true],
      ["Martin","what kind of proof do you want 😭",1500],
      ["Player","I don't know.",true],
      ["Martin","then I'll assume I passed.",1300]
    ]
  }
];

const afterChoice1 = [
  ["Silvia","GUYS",850],
  ["Silvia","THE LINK IS IN THE EMAIL",1300],
  ["Keonho","we know",900],
  ["Silvia","I'M JUST MAKING SURE",1200],
  ["Elvaro","thank you for your service.",1200],
  ["Seonghyeon","I'm joining.",950],
  ["Keonho","wait for me",900],
  ["Elvaro","no.",700],
  ["Keonho","why",800],
  ["Elvaro","because you said you were still in bed.",1500],
  ["Martin","I'm joining too.",1100],
  ["Martin","see you there.",1000]
];

const privateIntro = [
  ["Martin","hey.",1100],
  ["Martin","are you actually paying attention?",1700]
];

const choice2 = [
  {
    text:"Of course I am.",
    points:1,
    messages:[
      ["Player","Of course I am.",true],
      ["Martin","good.",900],
      ["Martin","because I have no idea what's happening.",1500],
      ["Player","😭",true],
      ["Martin","I thought you knew.",1200],
      ["Player","I was just pretending.",true],
      ["Martin","so we're both pretending.",1300],
      ["Player","apparently.",true],
      ["Martin","nice.",900]
    ]
  },
  {
    text:"Not really 😭",
    points:2,
    messages:[
      ["Player","Not really 😭",true],
      ["Martin","thank god.",1100],
      ["Player","why?",true],
      ["Martin","I thought I was the only one.",1400],
      ["Player","what are you doing then?",true],
      ["Martin","looking at the screen and hoping something makes sense.",1900],
      ["Player","same.",true],
      ["Martin","good.",900],
      ["Martin","we're doing great.",1300]
    ]
  },
  {
    text:"Why? Are you?",
    points:2,
    messages:[
      ["Player","Why? Are you?",true],
      ["Martin","...",900],
      ["Martin","no.",800],
      ["Player","HAHAHAHA",true],
      ["Martin","don't expose me.",1200],
      ["Player","I won't.",true],
      ["Martin","thank you.",1000],
      ["Player","you're welcome.",true]
    ]
  }
];

const privateChoice3Intro = [
  ["Martin","they're talking about campus organizations now.",1400],
  ["Player","already?",true],
  ["Martin","apparently.",900],
  ["Player","have you thought about joining one?",1500],
  ["Martin","maybe.",900],
  ["Player","which one?",true],
  ["Martin","not sure yet.",1000],
  ["Martin","you?",1100]
];

const choice3 = [
  {
    text:"Maybe something creative.",
    points:2,
    messages:[
      ["Player","Maybe something creative.",true],
      ["Martin","makes sense.",1100],
      ["Player","why?",true],
      ["Martin","I don't know.",900],
      ["Martin","you just seem like that kind of person.",1600],
      ["Player","what kind?",true],
      ["Martin","I'll tell you when I figure it out.",1500],
      ["Player","that's suspicious.",true],
      ["Martin","maybe.",1000]
    ]
  },
  {
    text:"Probably nothing. I just want to survive university.",
    points:1,
    messages:[
      ["Player","Probably nothing. I just want to survive university.",true],
      ["Martin","that's actually a good goal.",1400],
      ["Player","thank you.",true],
      ["Martin","we can survive together.",1400],
      ["Player","\"we\"?",true],
      ["Martin","as classmates.",1200],
      ["Player","sure.",true],
      ["Martin","don't make it weird 😭",1400]
    ]
  },
  {
    text:"I haven't decided. Maybe I'll figure it out later.",
    points:1,
    messages:[
      ["Player","I haven't decided. Maybe I'll figure it out later.",true],
      ["Martin","same.",900],
      ["Player","at least I'm not the only one.",true],
      ["Martin","nope.",850],
      ["Martin","we can figure it out eventually.",1400]
    ]
  }
];

const groupEnd = [
  ["Silvia","WE SURVIVED!!!!",1000],
  ["Keonho","barely",850],
  ["Elvaro","speak for yourself",1100],
  ["Seonghyeon","we still have another session later.",1500],
  ["Keonho","...",900],
  ["Keonho","I take it back.",1000],
  ["Silvia","HAHAHAHA",900],
  ["Martin","I'll probably disappear for a bit.",1400],
  ["Silvia","where are you going?",1000],
  ["Martin","lunch.",850],
  ["Keonho","without us???",1200],
  ["Martin","yes.",800],
  ["Elvaro","cruel.",900]
];

const choice4 = [
  {
    text:"Yeah, I'm hungry.",
    points:2,
    messages:[
      ["Player","Yeah, I'm hungry.",true],
      ["Martin","good.",900],
      ["Martin","go eat.",950],
      ["Player","you too.",true],
      ["Martin","I will.",850],
      ["Player","promise?",true],
      ["Martin","promise.",1000]
    ]
  },
  {
    text:"Not yet.",
    points:1,
    messages:[
      ["Player","Not yet.",true],
      ["Martin","you should eat.",1100],
      ["Player","I'll eat later.",true],
      ["Martin","don't forget.",1050],
      ["Player","I won't.",true],
      ["Martin","good.",850]
    ]
  },
  {
    text:"Are you inviting me? 👀",
    points:3,
    messages:[
      ["Player","Are you inviting me? 👀",true],
      ["Martin","maybe.",1500],
      ["Player","maybe???",true],
      ["Martin","I was just asking.",1400],
      ["Player","sure.",true],
      ["Martin","don't make this difficult 😭",1500],
      ["Player","I'm not.",true],
      ["Martin","you are.",1100]
    ]
  }
];

const finalDM = [
  ["Martin","anyway.",950],
  ["Martin","I'll see you later.",1200],
  ["Player","see you.",true],
  ["Martin","and [NAME]?",1400],
  ["Player","yeah?",true],
  ["Martin","glad you joined the group.",1600],
  ["Player","why?",true],
  ["Martin","I don't know.",1000],
  ["Martin","the group would've been more boring without you.",1900],
  ["Martin","don't let that get to your head.",1500],
  ["Player","too late.",true],
  ["Martin","😭",900]
];

function showScreen(screen){
  Object.values(screens).forEach(s=>s.classList.remove("active"));
  screen.classList.add("active");
}
function wait(ms){return new Promise(r=>setTimeout(r,ms))}
function personalize(text){return text.replaceAll("[NAME]",playerName)}
function scrollBottom(){requestAnimationFrame(()=>chatMessages.scrollTop=chatMessages.scrollHeight)}
function addDate(text){
  const d=document.createElement("div"); d.className="date-divider"; d.textContent=text;
  chatMessages.appendChild(d); scrollBottom();
}
function addBubble(sender,text,you=false){
  const row=document.createElement("div");
  row.className=`message-row ${you?"you":"them"}`;
  const b=document.createElement("div"); b.className="bubble";
  const name=you?"":`<div class="sender-name">${sender}</div>`;
  b.innerHTML=`${name}${personalize(text)}<span class="message-time">now</span>`;
  row.appendChild(b); chatMessages.appendChild(row); scrollBottom();
}
function addTyping(){
  const row=document.createElement("div");
  row.className="typing-row"; row.id="typing-indicator";
  row.innerHTML=`<div class="typing-bubble"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>`;
  chatMessages.appendChild(row); scrollBottom();
}
function removeTyping(){document.getElementById("typing-indicator")?.remove()}

async function sendMessage(m){
  const [sender,text,third]=m;
  const you = third === true;
  const delay = typeof third === "number" ? third : null;
  if(you){
    await wait(350);
    addBubble("Player",text,true);
    await wait(350);
    return;
  }
  addTyping();
  await wait(delay ?? Math.min(2600, Math.max(850, 650 + text.length*24)));
  removeTyping();
  addBubble(sender,text,false);
  await wait(500);
}
async function playMessages(list){
  for(const m of list) await sendMessage(m);
}
function showChoices(data, callback, label="How do you respond?"){
  choiceLabel.textContent=label;
  choices.innerHTML="";
  data.forEach(item=>{
    const btn=document.createElement("button");
    btn.className="choice";
    btn.textContent=personalize(item.text);
    btn.onclick=()=>callback(item);
    choices.appendChild(btn);
  });
  choiceArea.classList.remove("hidden"); scrollBottom();
}
function hideChoices(){choiceArea.classList.add("hidden")}
function setChatMode(title, status, letter="M"){
  chatTitle.textContent=title; statusText.textContent=status; avatar.textContent=letter;
}

async function beginStory(){
  const value=nameInput.value.trim();
  if(!value){nameError.textContent="Tell me your name first.";nameInput.focus();return}
  playerName=value; martinAffection=0; nameError.textContent="";
  showScreen(screens.chat); chatMessages.innerHTML="";
  setChatMode("UMN Freshman Orientation","online","U");
  await wait(650);
  addDate("SEPTEMBER 2020 · 7:41 AM");
  await playMessages(groupMorning);

  await sendMessage(["Martin","[NAME], are you joining already?",1100]);
  showChoices(choice1, async selected=>{
    hideChoices(); martinAffection+=selected.points;
    await playMessages(selected.messages);
    await playMessages(afterChoice1);

    // Transition: group chat -> Martin DM
    await wait(1000);
    chatMessages.innerHTML="";
    setChatMode("Martin","online","M");
    addDate("PRIVATE CHAT · 8:03 AM");
    await wait(900);
    await playMessages(privateIntro);

    showChoices(choice2, async selected2=>{
      hideChoices(); martinAffection+=selected2.points;
      await playMessages(selected2.messages);
      await wait(650);
      await playMessages(privateChoice3Intro);

      showChoices(choice3, async selected3=>{
        hideChoices(); martinAffection+=selected3.points;
        await playMessages(selected3.messages);

        // Back to group chat
        await wait(1200);
        chatMessages.innerHTML="";
        setChatMode("UMN Freshman Orientation","online","U");
        addDate("SEPTEMBER 2020 · 10:16 AM");
        await wait(700);
        await playMessages(groupEnd);

        await sendMessage(["Martin","[NAME], you eating too?",1300]);
        showChoices(choice4, async selected4=>{
          hideChoices(); martinAffection+=selected4.points;
          await playMessages(selected4.messages);

          // Final private chat
          await wait(1200);
          chatMessages.innerHTML="";
          setChatMode("Martin","online","M");
          addDate("PRIVATE CHAT · 10:29 AM");
          await wait(800);
          await playMessages(finalDM);

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
nameBtn.onclick=beginStory;
nameInput.onkeydown=e=>{if(e.key==="Enter")beginStory()}
replayBtn.onclick=()=>{nameInput.value="";nameError.textContent="";showScreen(screens.welcome)}
backBtn.onclick=()=>showScreen(screens.name);
