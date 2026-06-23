let currentUser = null;

// =======================
// INIT
// =======================
document.addEventListener("DOMContentLoaded", () => {
  bindUI();
  fetchUserInfo();
});
const ZODIAC = [
  { name: "Capricorn", start: [12, 22], end: [1, 19], file: "assets/zodiac/capricorn.png" },
  { name: "Aquarius",  start: [1, 20],  end: [2, 18], file: "assets/zodiac/aquarius.png" },
  { name: "Pisces",    start: [2, 19],  end: [3, 20], file: "assets/zodiac/pisces.png" },
  { name: "Aries",     start: [3, 21],  end: [4, 19], file: "assets/zodiac/aries.png" },
  { name: "Taurus",    start: [4, 20],  end: [5, 20], file: "assets/zodiac/taurus.png" },
  { name: "Gemini",    start: [5, 21],  end: [6, 20], file: "assets/zodiac/gemini.png" },
  { name: "Cancer",    start: [6, 21],  end: [7, 22], file: "assets/zodiac/cancer.png" },
  { name: "Leo",       start: [7, 23],  end: [8, 22], file: "assets/zodiac/leo.png" },
  { name: "Virgo",     start: [8, 23],  end: [9, 22], file: "assets/zodiac/virgo.png" },
  { name: "Libra",     start: [9, 23],  end: [10, 22],file: "assets/zodiac/libra.png" },
  { name: "Scorpio",   start: [10, 23], end: [11, 21],file: "assets/zodiac/scorpio.png" },
  { name: "Sagittarius",start:[11, 22], end: [12, 21],file:"assets/zodiac/sagittarius.png" }
];

function inRange(month, day, start, end) {
  const [sm, sd] = start;
  const [em, ed] = end;

  if (sm < em || (sm === em && sd <= ed)) {
    return (
      (month > sm || (month === sm && day >= sd)) &&
      (month < em || (month === em && day <= ed))
    );
  }

  return (
    (month > sm || (month === sm && day >= sd)) ||
    (month < em || (month === em && day <= ed))
  );
}

function getZodiac(month, day) {
  return ZODIAC.find(z => inRange(month, day, z.start, z.end));
}


// =======================
// FETCH USER
// =======================
async function fetchUserInfo() {
  try {
    const res = await fetch("https://soloprojecttest.onrender.com/api/users/me", {
      credentials: "include"
    });

    if (res.status === 401) {
      window.location.replace("https://solo-project-test.vercel.app/newUser.html");
      return;
    }

    const data = await res.json();
    currentUser = data.user;

    renderUser(currentUser);
    console.log("Fetched user info:", currentUser);

  } catch (err) {
    console.error("Fetch error:", err);
  }
}

console.log(currentUser);
// =======================
// RENDER USER
// =======================
function renderUser(user) {
  qs(".usernameDisplay").textContent = user.username || "Unnamed";
  qs(".tokens").textContent = `🪙 ${user.tokens ?? 0}`;
  qs(".transmissions").textContent = `📡 ${user.transmissions ?? 0}`;
  qs("textarea").value = user.aboutMe || "";

  renderPronouns(user);
  renderStatus(user);
  renderGender(user);
  renderZodiac(user);
  renderPfp(user);
}

// =======================
// UI BINDINGS
// =======================
function bindUI() {
  bindUsernameEdit();
  bindPronounsEdit();
  bindStatusEdit();
  bindPfpUpload();
  qs(".edit-btn")?.addEventListener("click", updateUserInfo , uploadPfp);
}

// =======================
// USERNAME EDIT
// =======================
function bindUsernameEdit() {
  const editIcon = qs(".edit-icon");

  editIcon?.addEventListener("click", () => {
    const display = qs(".usernameDisplay");

    const input = document.createElement("input");
    input.value = display.textContent;
    input.className = "username-edit";

    display.replaceWith(input);
    input.focus();

    input.addEventListener("blur", () => {
      const h2 = document.createElement("h2");
      h2.className = "usernameDisplay";
      h2.textContent = input.value || "Unnamed";

      input.replaceWith(h2);
    });
  });
}

// =======================
// PRONOUNS
// =======================
function bindPronounsEdit() {
  const tag = qs(".pronouns-tag");
  const input = qs(".pronouns-input");

  if (!tag || !input) return;

  tag.addEventListener("click", () => {
    tag.classList.add("hidden");
    input.classList.remove("hidden");

    input.value = tag.textContent === "+ add pronouns" ? "" : tag.textContent;
    input.focus();
  });

  input.addEventListener("blur", () => {
    tag.textContent = input.value.trim() || "+ add pronouns";

    input.classList.add("hidden");
    tag.classList.remove("hidden");
  });
}

function renderPronouns(user) {
  qs(".pronouns-tag").textContent = user.pronouns || "+ add pronouns";
  qs(".pronouns-input").value = user.pronouns || "";
}

// =======================
// STATUS
// =======================
function bindStatusEdit() {
  const text = qs(".status-text");
  const input = qs(".status-input");

  if (!text || !input) return;

  text.addEventListener("click", () => {
    text.classList.add("hidden");
    input.classList.remove("hidden");

    input.value = text.textContent === "+ set status" ? "" : text.textContent;
    input.focus();
  });

  input.addEventListener("blur", () => {
    const value = input.value.trim();
    text.textContent = value || "+ set status";

    input.classList.add("hidden");
    text.classList.remove("hidden");
  });
}

function renderStatus(user) {
  const text = qs(".status-text");
  const input = qs(".status-input");

  const value = user.statusText?.trim();

  text.textContent = value || "+ set status";
  input.value = value || "";
}

// =======================
// UPDATE USER
// =======================
async function updateUserInfo() {
  try {
    const username =
      qs(".username-edit")?.value ||
      qs(".usernameDisplay").textContent;

    const pronouns = qs(".pronouns-input").value;
    const bio = qs("textarea").value;

    const statusInput = qs(".status-input");
    const statusText = qs(".status-text");

    let status = statusInput.classList.contains("hidden")
      ? statusText.textContent
      : statusInput.value;

    if (status === "+ set status") status = "";

    const res = await fetch("https://soloprojecttest.onrender.com/api/users/me", {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        aboutMe: bio,
        pronouns,
        statusText: status
      })
    });

    if (!res.ok) {
      console.error("Update failed");
      return;
    }

    showPopup();
    fetchUserInfo();

  } catch (err) {
    console.error("Update error:", err);
  }
}

// =======================
// GENDER
// =======================
function renderGender(user) {
  const genderDiv = qs(".gender");

  const map = {
    MALE: "../assets/gender/male.png",
    FEMALE: "../assets/gender/female.png",
    NB: "../assets/gender/nb.png",
    SECRET: "../assets/gender/secret.png"
  };

  const icon = map[user.gender] || map.SECRET;

  genderDiv.innerHTML = `
    <img src="${icon}" class="gender-icon" />
    <span>${user.gender}</span>
  `;
}

// =======================
// ZODIAC
// =======================
function renderZodiac(user) {
  const container = document.querySelector(".zodiac-bday");

  if (!user.birthMonth || !user.birthDay || !container) return;

  const zodiac = getZodiac(user.birthMonth, user.birthDay);

  if (!zodiac) return;

  const day = String(user.birthDay).padStart(2, "0");
  const month = String(user.birthMonth).padStart(2, "0");

  container.innerHTML = `
    <span class="bday">🎂 ${day}/${month}</span>
    <span class="zodiac-name">${zodiac.name}</span>
    <img src="../${zodiac.file}" class="zodiac-icon" />
  `;
}

// =======================
// HELPERS
// =======================
function qs(selector) {
  return document.querySelector(selector);
}

// =======================
// POPUP
// =======================
function showPopup() {
  const popup = qs("#popup");
  popup.classList.remove("hidden");

  setTimeout(() => popup.classList.add("hidden"), 2000);
}

// =======================
// AUDIO
// =======================
const bgm = qs("#bgm");

document.addEventListener("click", () => {
  if (!bgm) return;

  bgm.muted = false;
  bgm.volume = 0.5;
  bgm.loop = true;
  bgm.play().catch(() => {});
}, { once: true });





// =======================
// BIND PFP UPLOAD
// =======================
function bindPfpUpload() {
  const wrapper = qs(".pfp-wrapper");
  const input = qs("#pfpInput");

  if (!wrapper || !input) return;

  // click → open file picker (with unlock check)
  wrapper.addEventListener("click", () => {
    if (!currentUser) return;

    if ((currentUser.messagesSentCount ?? 0) < 3) {
      alert("Dear Ranger, please send 3 transmission signals first^^");
      return;
    }

    input.click();
  });

  // file selected
  input.addEventListener("change", async () => {
    if (!input.files || !input.files[0]) return;
    await uploadPfp(input.files[0]);
  });

  // drag & drop
  wrapper.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  wrapper.addEventListener("drop", async (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) await uploadPfp(file);
  });
}

// =======================
// UPLOAD PFP
// =======================
async function uploadPfp(file) {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload-pfp", {
      method: "POST",
      body: formData,
      credentials: "include"
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Upload failed:", data.error);
      alert(data.error || "Upload failed");
      return;
    }

    // update UI immediately (no waiting needed)
    if (data.imageUrl) {
      const img = qs(".pfp");
      if (img) img.src = data.imageUrl;
    }

    showPopup();
    fetchUserInfo(); // refresh full user state

  } catch (err) {
    console.error("Upload error:", err);
  }
}
// =======================
// RENDER PFP
// =======================
function renderPfp(user) {
  const img = qs(".pfp");
  const overlay = qs(".pfp-overlay");

  if (!img) return;

  const locked = (user.messagesSentCount ?? 0) < 4);

  if (locked) {
    img.src = "../assets/icons/lockedPfp.png";
   
    return;
  }

  // unlocked state
  if (user.profilePicUrl) {
    img.src = user.profilePicUrl;
    if (overlay) overlay.textContent = "";
  } else {
    img.src = "../assets/icons/unlockedPfp.png";
  }
}
