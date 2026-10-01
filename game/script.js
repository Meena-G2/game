const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const scoreEl = document.getElementById('score');
const livesEl = document.getElementById('lives');
const bestEl = document.getElementById('best');
const startBtn = document.getElementById('startBtn');

const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const PLAYER_WIDTH = 88;
const PLAYER_HEIGHT = 18;
const PLAYER_Y = HEIGHT - 38;
const STAR_SIZE = 14;
const METEOR_SIZE = 22;

let state = {
  score: 0,
  best: Number(localStorage.getItem('star-catcher-best') || 0),
  lives: 3,
  stars: [],
  meteors: [],
  lastTime: 0,
  spawnTimer: 0,
  meteorTimer: 0,
  gameOver: false,
  started: false,
  pointerX: WIDTH / 2,
};

const player = {
  x: WIDTH / 2 - PLAYER_WIDTH / 2,
  y: PLAYER_Y,
  width: PLAYER_WIDTH,
  height: PLAYER_HEIGHT,
  speed: 7,
};

const keys = {
  left: false,
  right: false,
};

function resetGame() {
  state.score = 0;
  state.lives = 3;
  state.stars = [];
  state.meteors = [];
  state.lastTime = 0;
  state.spawnTimer = 0;
  state.meteorTimer = 0;
  state.gameOver = false;
  state.started = true;
  player.x = WIDTH / 2 - player.width / 2;
  updateHud();
}

function updateHud() {
  scoreEl.textContent = String(state.score);
  livesEl.textContent = String(state.lives);
  bestEl.textContent = String(state.best);
}

function spawnStar() {
  const size = STAR_SIZE;
  const x = Math.random() * (WIDTH - size);
  state.stars.push({
    x,
    y: -size,
    size,
    speed: 2.4 + Math.random() * 2.2,
  });
}

function spawnMeteor() {
  const size = METEOR_SIZE;
  const x = Math.random() * (WIDTH - size);
  state.meteors.push({
    x,
    y: -size,
    size,
    speed: 2.8 + Math.random() * 2.2,
  });
}

function collides(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function update(dt) {
  if (!state.started || state.gameOver) {
    return;
  }

  if (keys.left) {
    player.x -= player.speed * dt;
  }
  if (keys.right) {
    player.x += player.speed * dt;
  }

  const targetX = state.pointerX - player.width / 2;
  player.x += (targetX - player.x) * 0.17;

  player.x = Math.max(0, Math.min(WIDTH - player.width, player.x));

  state.spawnTimer += dt;
  state.meteorTimer += dt;

  if (state.spawnTimer > 700) {
    spawnStar();
    state.spawnTimer = 0;
  }

  if (state.meteorTimer > 1100) {
    spawnMeteor();
    state.meteorTimer = 0;
  }

  for (let i = state.stars.length - 1; i >= 0; i--) {
    const star = state.stars[i];
    star.y += star.speed * dt;

    if (collides(player, { x: star.x, y: star.y, width: star.size, height: star.size })) {
      state.stars.splice(i, 1);
      state.score += 1;
      state.best = Math.max(state.best, state.score);
      localStorage.setItem('star-catcher-best', String(state.best));
      updateHud();
      continue;
    }

    if (star.y > HEIGHT) {
      state.stars.splice(i, 1);
      state.lives = Math.max(0, state.lives - 1);
      updateHud();
    }
  }

  for (let i = state.meteors.length - 1; i >= 0; i--) {
    const meteor = state.meteors[i];
    meteor.y += meteor.speed * dt;

    if (collides(player, { x: meteor.x, y: meteor.y, width: meteor.size, height: meteor.size })) {
      state.meteors.splice(i, 1);
      state.lives = Math.max(0, state.lives - 1);
      updateHud();
      continue;
    }

    if (meteor.y > HEIGHT) {
      state.meteors.splice(i, 1);
    }
  }

  if (state.lives <= 0) {
    state.gameOver = true;
    state.started = false;
  }
}

function drawBackground() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  const gradient = ctx.createLinearGradient(0, 0, 0, HEIGHT);
  gradient.addColorStop(0, '#0b1020');
  gradient.addColorStop(1, '#111b36');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  for (let i = 0; i < 100; i++) {
    const x = (i * 53) % WIDTH;
    const y = (i * 97) % HEIGHT;
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.fillRect(x, y, 2, 2);
  }
}

function drawPlayer() {
  ctx.fillStyle = '#7dd3fc';
  ctx.fillRect(player.x, player.y, player.width, player.height);

  ctx.fillStyle = '#a78bfa';
  ctx.fillRect(player.x + 12, player.y - 8, player.width - 24, 8);
}

function drawStars() {
  for (const star of state.stars) {
    ctx.beginPath();
    ctx.fillStyle = '#facc15';
    ctx.arc(star.x + star.size / 2, star.y + star.size / 2, star.size / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.arc(star.x + star.size / 2, star.y + star.size / 2, star.size / 5, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawMeteors() {
  for (const meteor of state.meteors) {
    ctx.beginPath();
    ctx.fillStyle = '#f87171';
    ctx.moveTo(meteor.x + meteor.size / 2, meteor.y);
    ctx.lineTo(meteor.x + meteor.size, meteor.y + meteor.size * 0.7);
    ctx.lineTo(meteor.x + meteor.size * 0.7, meteor.y + meteor.size);
    ctx.lineTo(meteor.x, meteor.y + meteor.size * 0.75);
    ctx.closePath();
    ctx.fill();
  }
}

function drawOverlay() {
  if (state.started) return;

  ctx.fillStyle = 'rgba(5, 8, 16, 0.5)';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  ctx.fillStyle = '#edf2ff';
  ctx.textAlign = 'center';
  ctx.font = 'bold 34px Arial';

  const message = state.gameOver ? 'Game Over' : 'Ready?';
  ctx.fillText(message, WIDTH / 2, HEIGHT / 2 - 12);

  ctx.font = '20px Arial';
  const sub = state.gameOver ? `Final Score: ${state.score}` : 'Catch the stars!';
  ctx.fillText(sub, WIDTH / 2, HEIGHT / 2 + 26);
}

function tick(timestamp) {
  if (!state.lastTime) state.lastTime = timestamp;
  const dt = Math.min(32, timestamp - state.lastTime);
  state.lastTime = timestamp;

  update(dt);
  drawBackground();
  drawStars();
  drawMeteors();
  drawPlayer();
  drawOverlay();

  requestAnimationFrame(tick);
}

window.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') {
    keys.left = true;
  }
  if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') {
    keys.right = true;
  }
});

window.addEventListener('keyup', (event) => {
  if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') {
    keys.left = false;
  }
  if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') {
    keys.right = false;
  }
});

canvas.addEventListener('mousemove', (event) => {
  const rect = canvas.getBoundingClientRect();
  const scaleX = WIDTH / rect.width;
  state.pointerX = (event.clientX - rect.left) * scaleX;
});

startBtn.addEventListener('click', () => {
  resetGame();
});

updateHud();
requestAnimationFrame(tick);
