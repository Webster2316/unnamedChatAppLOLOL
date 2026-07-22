//Check for exiting User
async function checkSession() {
  try {
    const res = await fetch("https://soloprojecttest.onrender.com/api/session", {
      method: "GET",
      credentials: "include"
    });

    if (res.status === 200) {
      window.location.replace("https://solo-project-test.vercel.app/index.html");
      return;
    }
  } catch (err) {
    console.error("Failed to check session:", err);
  }
}

//==================================================================
//create user
const form = document.getElementById("createUserForm");
const statusEl = document.getElementById("status");
const submitBtn = document.getElementById("submitBtn");

// where to go if session exists
const REDIRECT_IF_LOGGED_IN = "../index.html"; 

function setStatus(msg, type = "") {
  statusEl.className = "status " + type;
  statusEl.textContent = msg || "";
}

function toIntOrUndefined(val) {
  if (val === "" || val == null) return undefined;
  const n = Number(val);
  return Number.isFinite(n) ? n : undefined;
}

async function api(path, options = {}) {
  const res = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    credentials: "include", // IMPORTANT for cookie session
  });

  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

// ✅ runs immediately when page loads
(async function boot() {
  setStatus("");

  const { ok, status, data } = await api("https://soloprojecttest.onrender.com/api/session", { method: "GET" });

  if (ok && data?.user) {
    // session exists → leave create page
    window.location.replace(REDIRECT_IF_LOGGED_IN);
    return;
  }

  // 401 means no session, which is expected here
  if (status === 401) {
    return;
  }

  // any other error
  setStatus(data?.message || "err");
})();

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  setStatus("");
  submitBtn.disabled = true;
const username = document.getElementById("username").value.trim();
const gender = document.getElementById("gender").value || undefined;

const bdayStr = document.getElementById("birthday").value.trim(); // "MM-DD"
let birthMonth, birthDay;

if (bdayStr) {
  // accept "MM-DD" 
  const match = bdayStr.match(/^(\d{1,2})[-/](\d{1,2})$/);
  if (!match) {
    setStatus("Birthday must be in MM-DD format (e.g. 03-21).", "err");
    submitBtn.disabled = false;
    return;
  }

  birthMonth = Number(match[1]);
  birthDay = Number(match[2]);

  if (!Number.isInteger(birthMonth) || birthMonth < 1 || birthMonth > 12) {
    setStatus("Birth month must be 1–12.", "err");
    submitBtn.disabled = false;
    return;
  }

  if (!Number.isInteger(birthDay) || birthDay < 1 || birthDay > 31) {
    setStatus("Birth day must be 1–31.", "err");
    submitBtn.disabled = false;
    return;
  }
}

if (!username) {
  setStatus("Username is required.", "err");
  submitBtn.disabled = false;
  return;
}

const body = { username };
if (gender) body.gender = gender;
if (birthMonth != null) body.birthMonth = birthMonth;
if (birthDay != null) body.birthDay = birthDay;
  try {
    setStatus("Creating user...", "");

    const res = await api("https://soloprojecttest.onrender.com/api/users", {
      method: "POST",
      body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error(res.data?.message || `Failed (${res.status})`);

    // cookie should now be set; go to main app
    setStatus("Created. Redirecting...", "ok");
    window.location.replace(REDIRECT_IF_LOGGED_IN);
  } catch (err) {
    setStatus(err.message, "err");
  } finally {
    submitBtn.disabled = false;
  }
});

const birthdayInput = document.getElementById("birthday");
const zodiacNameEl = document.getElementById("zodiacName");
const zodiacRangeEl = document.getElementById("zodiacRange");
const zodiacIconEl = document.getElementById("zodiacIcon");

//url for image
const ZODIAC_ICON_BASE = "../";

const ZODIAC = [
  { name: "Capricorn", start: [12, 22], end: [1, 19], file: "assets/zodiac/capricorn.png", range: "Dec 22 – Jan 19" },
  { name: "Aquarius",  start: [1, 20],  end: [2, 18], file: "assets/zodiac/aquarius.png",  range: "Jan 20 – Feb 18" },
  { name: "Pisces",    start: [2, 19],  end: [3, 20], file: "assets/zodiac/pisces.png",    range: "Feb 19 – Mar 20" },
  { name: "Aries",     start: [3, 21],  end: [4, 19], file: "assets/zodiac/aries.png",     range: "Mar 21 – Apr 19" },
  { name: "Taurus",    start: [4, 20],  end: [5, 20], file: "assets/zodiac/taurus.png",    range: "Apr 20 – May 20" },
  { name: "Gemini",    start: [5, 21],  end: [6, 20], file: "assets/zodiac/gemini.png",    range: "May 21 – Jun 20" },
  { name: "Cancer",    start: [6, 21],  end: [7, 22], file: "assets/zodiac/cancer.png",    range: "Jun 21 – Jul 22" },
  { name: "Leo",       start: [7, 23],  end: [8, 22], file: "assets/zodiac/leo.png",       range: "Jul 23 – Aug 22" },
  { name: "Virgo",     start: [8, 23],  end: [9, 22], file: "assets/zodiac/virgo.png",     range: "Aug 23 – Sep 22" },
  { name: "Libra",     start: [9, 23],  end: [10, 22],file: "assets/zodiac/libra.png",     range: "Sep 23 – Oct 22" },
  { name: "Scorpio",   start: [10, 23], end: [11, 21],file: "assets/zodiac/scorpio.png",   range: "Oct 23 – Nov 21" },
  { name: "Sagittarius",start:[11, 22], end: [12, 21],file: "assets/zodiac/sagittarius.png",range:"Nov 22 – Dec 21" },
];

function isValidDay(month, day) {
  if (month < 1 || month > 12) return false;
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return day >= 1 && day <= daysInMonth[month - 1];
}

function inRange(month, day, start, end) {
  const [sm, sd] = start;
  const [em, ed] = end;

  // normal range within year
  if (sm < em || (sm === em && sd <= ed)) {
    return (
      (month > sm || (month === sm && day >= sd)) &&
      (month < em || (month === em && day <= ed))
    );
  }

  // wraps year-end (Capricorn)
  return (
    (month > sm || (month === sm && day >= sd)) ||
    (month < em || (month === em && day <= ed))
  );
}

function getZodiac(month, day) {
  for (const z of ZODIAC) {
    if (inRange(month, day, z.start, z.end)) return z;
  }
  return null;
}

function formatMMDD(raw) {
  const digits = raw.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return digits.slice(0, 2) + "-" + digits.slice(2);
}

function updateZodiacUI(val) {
  const m = Number(val.slice(0, 2));
  const d = Number(val.slice(3, 5));

  if (!val || val.length < 5) {
    zodiacNameEl.textContent = "—";
    zodiacRangeEl.textContent = "Enter birthday";
    zodiacIconEl.style.display = "none";
    zodiacIconEl.src = "";
    return;
  }

  if (!isValidDay(m, d)) {
    zodiacNameEl.textContent = "Invalid date";
    zodiacRangeEl.textContent = "Use MM-DD (e.g. 03-21)";
    zodiacIconEl.style.display = "none";
    zodiacIconEl.src = "";
    return;
  }

  const z = getZodiac(m, d);
  zodiacNameEl.textContent = z.name;
  zodiacRangeEl.textContent = z.range;

  zodiacIconEl.src = `${ZODIAC_ICON_BASE}/${z.file}`;
  zodiacIconEl.style.display = "block";
}

// live input formatting + update
birthdayInput.addEventListener("input", (e) => {
  const formatted = formatMMDD(e.target.value);
  if (formatted !== e.target.value) e.target.value = formatted;
  updateZodiacUI(formatted);
});

// optional: init on load (if browser autofills)
updateZodiacUI(birthdayInput.value || "");

// background music
const bgm = document.getElementById("bgm");
document.addEventListener("click", () => {

  bgm.muted = false;
  bgm.loop = true;   
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
