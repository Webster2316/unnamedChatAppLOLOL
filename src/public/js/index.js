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

    if (!res.ok) {
      console.error("Session check failed:", res.status);
      return;
    }

    const data = await res.json();
    const user = data.user;

    // update username display
    const usernameDisplay = document.getElementById("usernameDisplay");
    if (usernameDisplay) {
      usernameDisplay.textContent = user.username;
    }

    // first update of lastSeenAt
    updateLastSeen();
    // after getting user from /api/session
const resGrant = await fetch("https://soloprojecttest.onrender.com/api/users/grantDaily", { method: "POST", credentials: "include" });
const dataGrant = await resGrant.json();
console.log("Daily transmissions:", dataGrant.transmissions);

    // set interval to auto-update every 5 minutes
    setInterval(updateLastSeen, 5 * 60 * 1000); // 5 min in ms

  } catch (err) {
    console.error("Error checking session:", err);
  }
}

checkSession();
document.querySelectorAll('.orbit').forEach(el => {
  const randomAngle = Math.floor(Math.random() * 360);
  el.style.setProperty('--start', `${randomAngle}deg`);

  const goClockwise = Math.random() < 0.5;
  const animName = goClockwise ? 'orbitSpin' : 'orbitSpinReverse';
  const duration = 30 + Math.random() * 30; // 30-60s

  el.classList.remove('orbit-dm', 'orbit-avatar');
  el.style.animation = `${animName} ${duration}s linear infinite`;
});

async function fetchUserInfo() {
  try {
    const res = await fetch("https://soloprojecttest.onrender.com/api/users/me", {
      method: "GET",
      credentials: "include"
    });

    if (res.status === 401) {
      window.location.replace("https://solo-project-test.vercel.app/createUser.html");
      return;
    }

    if (!res.ok) {
      console.error("Failed to get user info:", res.status);
      return;
    }

    const data = await res.json();
    const user = data.user;

    // update UI
    
  const usernameDisplay = document.querySelector(".usernameDisplay");
    const tokensDisplay = document.querySelector(".tokens");
    const transmissionsDisplay = document.querySelector(".transmissions");

    if (usernameDisplay) usernameDisplay.textContent = user.username;
    if (tokensDisplay) tokensDisplay.textContent = `🪙 ${user.tokens}`;
    if (transmissionsDisplay) transmissionsDisplay.textContent = `📡 ${user.transmissions}`;

  } catch (err) {
    console.error("Error fetching user info:", err);
  }
}

fetchUserInfo();

function updateTime() {
  const timeDisplay = document.querySelector(".time");
  if (!timeDisplay) return;

  const now = new Date();
  // format as HH:MM
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");

  timeDisplay.textContent = `${hours}:${minutes}`;
}

// run immediately and then every minute
updateTime();
setInterval(updateTime, 1000);


// --------------------
// function to update lastSeenAt
async function updateLastSeen() {
  try {
    const res = await fetch("https://soloprojecttest.onrender.com/api/users/me", {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lastSeenAt: new Date() })
    });

    if (!res.ok) {
      console.error("Failed to update lastSeenAt:", res.status);
      return;
    }

    const data = await res.json();
    console.log("Last seen updated:", data.user.lastSeenAt);
  } catch (err) {
    console.error("Error updating lastSeenAt:", err);
  }
}

// background music
const bgm = document.getElementById("bgm");
document.addEventListener("click", () => {

  bgm.muted = false;
  bgm.loop = true;     // keep looping
  bgm.volume = 0;

  bgm.play().catch(e => console.log("Playback blocked:", e));

  let fade = setInterval(() => {
    if (bgm.volume < 0.5) {
      bgm.volume += 0.0001;
    } else {
      clearInterval(fade);
    }
  }, 100);

}, { once: true });
