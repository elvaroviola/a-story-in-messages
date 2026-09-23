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

let playerName = "you";

const messages = [
  {
    text: "hey.",
    delay: 700
  },
  {
    text: "are you still awake?",
    delay: 1200
  },
  {
    text: "I know it's late 😭",
    delay: 1400
  },
  {
    text: "I just wanted to ask you something.",
    delay: 1700
  }
];

const responseChoices = [
  {
    text: "Yeah, what's up?",
    reply: "yeah, what's up?",
    next: "oh. nothing serious, I promise."
  },
  {
    text: "Why are you awake?",
    reply: "why are you awake?",
    next: "fair question. I could ask you the same thing."
  },
  {
    text: "I'm about to sleep.",
    reply: "I'm about to sleep.",
    next: "oh— sorry. I'll keep it quick then."
  }
];

function showScreen(screen) {
  Object.values(screens).forEach(s => s.classList.remove("active"));
  screen.classList.add("active");
}

startBtn.addEventListener("click", () => {
  showScreen(screens.name);
  setTimeout(() => nameInput.focus(), 250);
});

nameBtn.addEventListener("click", beginStory);

nameInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") beginStory();
});

function beginStory() {
  const value = nameInput.value.trim();

  if (!value) {
    nameError.textContent = "Tell me your name first.";
    nameInput.focus();
    return;
  }

  playerName = value;
  nameError.textContent = "";

  showScreen(screens.chat);
  runConversation();
}

function clearChat() {
  chatMessages.innerHTML = `<div class="date-divider">MONDAY · 11:47 PM</div>`;
}

function scrollToBottom() {
  requestAnimationFrame(() => {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  });
}

function addBubble(text, type = "them") {
  const row = document.createElement("div");
  row.className = `message-row ${type}`;

  const bubble = document.createElement("div");
  bubble.className = "bubble";

  bubble.innerHTML = `
    ${escapeHtml(text)}
    <span class="message-time">now</span>
  `;

  row.appendChild(bubble);
  chatMessages.appendChild(row);
  scrollToBottom();
}

function addTyping() {
  const row = document.createElement("div");
  row.className = "typing-row";
  row.id = "typing-indicator";

  row.innerHTML = `
    <div class="typing-bubble">
      <span class="dot"></span>
      <span class="dot"></span>
      <span class="dot"></span>
    </div>
  `;

  chatMessages.appendChild(row);
  scrollToBottom();
}

function removeTyping() {
  document.getElementById("typing-indicator")?.remove();
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function sendMartinMessage(text, delay = 900) {
  addTyping();
  await wait(delay);
  removeTyping();
  addBubble(text, "them");
}

async function runConversation() {
  clearChat();
  choiceArea.classList.add("hidden");
  statusText.textContent = "online";

  for (const message of messages) {
    await sendMartinMessage(message.text, message.delay);
  }

  await wait(500);
  showChoices();
}

function showChoices() {
  choices.innerHTML = "";

  responseChoices.forEach((choice, index) => {
    const button = document.createElement("button");
    button.className = "choice";
    button.textContent = choice.text;

    button.addEventListener("click", () => chooseResponse(index));

    choices.appendChild(button);
  });

  choiceArea.classList.remove("hidden");
}

async function chooseResponse(index) {
  const selected = responseChoices[index];

  choiceArea.classList.add("hidden");

  addBubble(selected.reply, "you");

  await wait(650);
  await sendMartinMessage(selected.next, 1100);

  await wait(900);

  statusText.textContent = "last seen just now";

  await wait(1000);

  showEnd();
}

function showEnd() {
  showScreen(screens.end);
}

replayBtn.addEventListener("click", () => {
  nameInput.value = "";
  nameError.textContent = "";
  showScreen(screens.welcome);
});

backBtn.addEventListener("click", () => {
  showScreen(screens.name);
});

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
