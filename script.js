const finishLine = 1280;
const step = 20;
let pos1 = 0,
  pos2 = 0,
  multiplier = 1,
  timer = 0,
  gameInterval,
  powerInterval,
  canPlay = false;  // controla se o jogador pode clicar

const timerEl = document.getElementById("timer");
const multEl = document.getElementById("multiplier");
const winnerText = document.getElementById("winner");
const winSound = document.getElementById("winSound");
const powerSound = document.getElementById("powerSound");
const popupContainer = document.getElementById("popups");
const countdownEl = document.getElementById("countdown");

const splashScreen = document.getElementById("splashScreen");
const gameScreen = document.getElementById("gameScreen");
const startBtn = document.getElementById("startBtn");

const player1El = document.getElementById("player1");
const player2El = document.getElementById("player2");

startBtn.addEventListener("click", startCountdown);

function startCountdown() {
  splashScreen.style.display = "none";
  gameScreen.style.display = "flex";

  countdownEl.textContent = "3";
  countdownEl.classList.add("show");

  let count = 3;

  const countdownInterval = setInterval(() => {
    count--;
    if (count > 0) {
      countdownEl.textContent = count;
    } else if (count === 0) {
      countdownEl.textContent = "Já!";
    } else {
      clearInterval(countdownInterval);
      countdownEl.classList.remove("show");
      countdownEl.textContent = "";

      startGame();
    }
  }, 1000);
}

function startGame() {
  pos1 = 0;
  pos2 = 0;
  multiplier = 1;
  timer = 0;
  timerEl.textContent = timer.toFixed(2);
  multEl.textContent = multiplier;
  winnerText.textContent = "";
  player1El.style.left = "0px";
  player2El.style.left = "0px";
  popupContainer.innerHTML = "";
  canPlay = true;

  gameInterval = setInterval(() => {
    timer += 0.01;
    timerEl.textContent = timer.toFixed(2);
  }, 10);

  powerInterval = setInterval(spawnPowerUp, 4000);
}

function spawnPowerUp() {
  if (winnerText.textContent !== "" || !canPlay) return;

  const popup = document.createElement("div");
  popup.className = "popup";

  const isTurbo = Math.random() < 0.5;
  popup.textContent = isTurbo ? "TURBO!" : "MULTIPLICADOR +1";

  const x = Math.random() * (finishLine - 200) + 100;
  popup.style.left = x + "px";

  popupContainer.appendChild(popup);
  powerSound.currentTime = 0;
  powerSound.play();

  if (isTurbo) {
    multiplier *= 2;
  } else {
    multiplier++;
  }
  multEl.textContent = multiplier;

  setTimeout(() => {
    multiplier = 1;
    multEl.textContent = multiplier;
  }, 5000);

  setTimeout(() => popup.remove(), 1200);
}

function movePlayer(player) {
  if (winnerText.textContent !== "" || !canPlay) return;

  if (player === 1) {
    pos1 += step * multiplier;
    if (pos1 > finishLine) pos1 = finishLine;
    player1El.style.left = pos1 + "px";
    if (pos1 >= finishLine) endGame(1);
  } else {
    pos2 += step * multiplier;
    if (pos2 > finishLine) pos2 = finishLine;
    player2El.style.left = pos2 + "px";
    if (pos2 >= finishLine) endGame(2);
  }
}

function endGame(winner) {
  winnerText.textContent = `🏆 Jogador ${winner} venceu! Tempo: ${timer.toFixed(2)}s`;
  clearInterval(gameInterval);
  clearInterval(powerInterval);
  canPlay = false;
  winSound.currentTime = 0;
  winSound.play();
}

document.addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() === "a") movePlayer(1);
  if (e.key.toLowerCase() === "l") movePlayer(2);
});
