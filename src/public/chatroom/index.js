// =======================
// GLOBAL VARIABLES
// =======================

let currentUser = null;

const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const messagesContainer = document.getElementById("messages");


// =======================
// CHECK SESSION
// =======================

async function checkSession() {

  try {

    const res = await fetch("https://soloprojecttest.onrender.com/api/session", {
      method: "GET",
      credentials: "include"
    });
    

    if (res.status === 401) {
      window.location.replace("https://solo-project-test.vercel.app/newUser.html");
      return;
    }

    const data = await res.json();
    currentUser = data.user;
console.log("Current user:", data);

  } catch (err) {
    console.error("Session check error:", err);
  }

}

// =======================
// ADD MESSAGE TO UI
// =======================
function addMessage(msg) {
  const el = document.createElement("div");

  const isMe = currentUser && msg.userId === currentUser.id;
  el.className = isMe ? "message me" : "message";

  const username = msg.user?.username || "User";

  // decide avatar
  let avatarUrl;

if ((msg.user?.messagesSentCount ?? 0) < 4) {
    avatarUrl = "../assets/icons/lockedPfp.png";
  } else if (msg.user?.profilePic) {
    avatarUrl = msg.user.profilePic;
  } else {
    avatarUrl = "../assets/icons/unlockedPfp.png";
  }

  el.innerHTML = `
    <img class="avatar" src="${avatarUrl}">

    <div class="message-content">
      <div class="username">${username}</div>
      <div class="bubble">${msg.content}</div>
    </div>
  `;

  messagesContainer.appendChild(el);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}
// =======================
// WEBSOCKET
// =======================
let ws;
async function initApp() {
  await checkSession();

  ws = new WebSocket("wss://soloprojecttest.onrender.com");

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if (data.type === "recentMessages") {
      data.messages.forEach(addMessage);
    }

    if (data.type === "message") {
      addMessage(data.message);
    }
  };
}

// =======================
// SEND MESSAGE
// =======================

function sendMessage() {
const text = messageInput.value.trim();
if(!text) return;

  ws.send(JSON.stringify({
    type: "newMessage",
    content: text
  }));

  messageInput.value = "";

}

sendBtn.onclick = sendMessage;


// send when pressing ENTER
messageInput.addEventListener("keydown", (e) => {

  if (e.key === "Enter") {
    sendMessage();
  }

});


// =======================
// BACKGROUND MUSIC
// =======================

const bgm = document.getElementById("bgm");

document.addEventListener("click", async () => {

  try {

    bgm.loop = true;
    bgm.volume = 0;

    await bgm.play();

    const fade = setInterval(() => {

      if (bgm.volume < 0.5) {
        bgm.volume += 0.02;
      } else {
        clearInterval(fade);
      }

    }, 100);

  } catch (err) {
    console.log("Playback blocked", err);
  }

}, { once: true });


// =======================
// START PAGE
// =======================
initApp();
checkSession();
