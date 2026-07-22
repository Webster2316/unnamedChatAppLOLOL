
    // 1)lines
const lines = [
  "Welcome, traveller!",
  "Congratulations!\n You have been selected to be apart of the Earth's new space exploration program.",
  "As the Earth's atmosphere is rapidly deteriorating,\n you and a few other selected individuals have been tasked with this once in a lifetime opportunity to explore the galaxy and find a new home for humanity. ",
  "\n And of course, you'll be sailing through sectors no space equipment has ever discovered before so you may encounter new planets and even new life forms!",
  "But fret not, as you venture through the majestic, starlit ocean of infinite space, you'll have your crewmates along the way to lean on throughout your journey. Still do proceed with cation, you'll never know what you might encounter out there. ",
  "Good luck, traveller! "
];

const textEl = document.getElementById("text");
const skipBtn = document.getElementById("skipBtn");
const nextBtn = document.getElementById("nextBtn");
const beep = document.getElementById("beep");
const continueLink = document.getElementById("continueLink");
// 2) Typing settings
const typingSpeedMs = 70;     // smaller = faster
const beepEveryNChars = 2;    // beep every 2 characters

// 3) State (game brain)
let lineIndex = 0;
let charIndex = 0;
let isTyping = false;
let typingTimer = null;

// --- helpers ---
function playBeep() {
  // browsers may block autoplay until user clicks once - that’s normal
  if (!beep) return;
  try {
    beep.currentTime = 0;
    beep.play();
  } catch (e) {
    // ignore if blocked
  }
}

function setButtons() {
  skipBtn.disabled = !isTyping;         // skip only while typing
  nextBtn.disabled = isTyping;          // next only when line finished
}

function startTypingLine() {
  // reset for new line
  clearTimeout(typingTimer);
  textEl.textContent = "";
  charIndex = 0;
  isTyping = true;
  setButtons();

  typeNextChar();
}

function typeNextChar() {
  const full = lines[lineIndex];

  // finished?
  if (charIndex >= full.length) {
    isTyping = false;
    setButtons();
    return;
  }

  // add next character
  const nextChar = full[charIndex];
  textEl.textContent += nextChar;
  charIndex++;

  // beep sometimes (avoid beeping on spaces/newlines)
  if (charIndex % beepEveryNChars === 0 && nextChar.trim() !== "") {
    playBeep();
  }

  typingTimer = setTimeout(typeNextChar, typingSpeedMs);
}

function skipTyping() {
  if (!isTyping) return;

  clearTimeout(typingTimer);
  textEl.textContent = lines[lineIndex];
  isTyping = false;
  setButtons();
}

function nextLine() {
  if (isTyping) return;

  lineIndex++;

  // If story ends, lock buttons 
  if (lineIndex >= lines.length) {
    skipBtn.disabled = true;
    nextBtn.disabled = true;

      continueLink.style.display = "inline"; 
    return;
  }

  startTypingLine();
}

// Buttons
skipBtn.addEventListener("click", skipTyping);
nextBtn.addEventListener("click", nextLine);

// Optional: clicking the textbox area = skip or next
document.querySelector(".textbox").addEventListener("click", (e) => {
  // if they clicked a button, ignore (button already handles it)
  if (e.target.tagName === "BUTTON") return;

  if (isTyping) skipTyping();
  else nextLine();
});

// Start the first line
startTypingLine();




// ////stars in the back
// const canvas = document.getElementById("stars");
// const ctx = canvas.getContext("2d");

// function resize() {
//   // crisp on high-DPI screens
//   const dpr = window.devicePixelRatio || 1;
//   canvas.width = Math.floor(window.innerWidth * dpr);
//   canvas.height = Math.floor(window.innerHeight * dpr);
//   canvas.style.width = window.innerWidth + "px";
//   canvas.style.height = window.innerHeight + "px";
//   ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
// }
// window.addEventListener("resize", resize);
// resize();

// const STAR_COUNT = 180;
// const stars = [];
// function rand(min, max) { return Math.random() * (max - min) + min; }

// // Create stars
// for (let i = 0; i < STAR_COUNT; i++) {
//  stars.push({
//   x: rand(0, window.innerWidth),
//   y: rand(0, window.innerHeight),
//   r: rand(0.6, 2.2),

//   vx: rand(-0.05, 0.05), // horizontal speed
//   vy: rand(-0.05, 0.05), // vertical speed

//   a: rand(0.3, 1),          // brightness
//   twinkleSpeed: rand(0.005, 0.02), 
//   twinkleDir: Math.random() > 0.5 ? 1 : -1
// });
// }

// function animate() {
//   ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

//   for (const st of stars) {
// st.a += st.twinkleSpeed * st.twinkleDir;

// if (st.a > 1) st.twinkleDir = -1;
// if (st.a < 0.2) st.twinkleDir = 1;

//     st.x += st.vx;
// st.y += st.vy;               
//    if (st.x > window.innerWidth) st.x = 0;
// if (st.x < 0) st.x = window.innerWidth;

// if (st.y > window.innerHeight) st.y = 0;
// if (st.y < 0) st.y = window.innerHeight;

//     ctx.beginPath();
//     ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
//     ctx.fillStyle = `rgba(255,255,255,${st.a})`;
//     ctx.fill();
//   }

//   requestAnimationFrame(animate);
// }
// animate();
