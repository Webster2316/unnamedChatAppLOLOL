


////stars in the back
const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");

function resize() {
  // crisp on high-DPI screens
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.floor(window.innerWidth * dpr);
  canvas.height = Math.floor(window.innerHeight * dpr);
  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener("resize", resize);
resize();

const STAR_COUNT = 180;
const stars = [];
function rand(min, max) { return Math.random() * (max - min) + min; }

// Create stars
for (let i = 0; i < STAR_COUNT; i++) {
 stars.push({
  x: rand(0, window.innerWidth),
  y: rand(0, window.innerHeight),
  r: rand(0.6, 2.2),

  vx: rand(-0.05, 0.05), // horizontal speed
  vy: rand(-0.05, 0.05), // vertical speed

  a: rand(0.3, 1),          // brightness
  twinkleSpeed: rand(0.001, 0.017), 
  twinkleDir: Math.random() > 0.5 ? 1 : -1
});
}

function animate() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  for (const st of stars) {
st.a += st.twinkleSpeed * st.twinkleDir;

if (st.a > 1) st.twinkleDir = -1;
if (st.a < 0.2) st.twinkleDir = 1;

    st.x += st.vx;
st.y += st.vy;               
   if (st.x > window.innerWidth) st.x = 0;
if (st.x < 0) st.x = window.innerWidth;

if (st.y > window.innerHeight) st.y = 0;
if (st.y < 0) st.y = window.innerHeight;

    ctx.beginPath();
    ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${st.a})`;
    ctx.fill();
  }

  requestAnimationFrame(animate);
}
animate();
