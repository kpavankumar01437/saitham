(() => {
  const startBtn = document.getElementById("start-btn");
  const levelTitle = document.getElementById("level-title");
  const colorBtns = Array.from(document.querySelectorAll(".btn"));

  const colors = ["green", "red", "yellow", "blue"];
  const randomColor = () => colors[Math.floor(Math.random() * colors.length)];

  let gameSequence = [];
  let userSequence = [];
  let level = 0;
  let started = false;
  let playingSeq = false;

  function playSound(name) {
    let sound = new Audio(`sounds/${name}.mp3`);
    sound.play();
  }

  function flashButton(color) {
    const btn = document.getElementById(color);
    if (!btn) return;

    btn.classList.add(
      "brightness-150",
      "scale-95",
      "shadow-[0_0_30px_white]",
      "z-10",
    );
    playSound(color);

    setTimeout(() => {
      btn.classList.remove(
        "brightness-150",
        "scale-95",
        "shadow-[0_0_30px_white]",
        "z-10",
      );
    }, 300);
  }

  function startGame() {
    if (started) return;
    gameSequence = [];
    userSequence = [];
    level = 0;
    started = true;
    nextSequence();
  }

  function nextSequence() {
    // Reset the user's clicks so they have to start from the beginning
    userSequence = [];
    level++;
    levelTitle.textContent = `Level ${level}`;

    // Pick the newest color and add it to the memory bank
    const newColor = randomColor();
    gameSequence.push(newColor);

    // Lock the board while the computer takes its turn
    playingSeq = true;
    toggleButtons(true);

    // Pause for a moment, then ONLY flash the newest color
    setTimeout(() => {
      flashButton(newColor);

      // Unlock the buttons after the flash is finished
      setTimeout(() => {
        playingSeq = false;
        toggleButtons(false);
      }, 500);
    }, 800);
  }

  function toggleButtons(disable) {
    colorBtns.forEach(
      (btn) => (btn.style.pointerEvents = disable ? "none" : "auto"),
    );
  }

  function handleUserClick(e) {
    if (!started || playingSeq) return;

    const color = e.currentTarget.id;
    userSequence.push(color);
    flashButton(color);

    const index = userSequence.length - 1;

    if (userSequence[index] !== gameSequence[index]) {
      wrongAnswer();
      return;
    }

    if (userSequence.length === gameSequence.length) {
      setTimeout(() => {
        nextSequence();
      }, 1000);
    }
  }

  function wrongAnswer() {
    playSound("wrong");

    document.body.classList.add("game-over");
    setTimeout(() => {
      document.body.classList.remove("game-over");
    }, 200);

    levelTitle.textContent = "Game Over, Press Any Key to Restart";

    level = 0;
    gameSequence = [];
    started = false;
  }

  // Event listeners
  colorBtns.forEach((btn) => btn.addEventListener("click", handleUserClick));
  startBtn.addEventListener("click", startGame);

  document.addEventListener("keydown", () => {
    if (!started) startGame();
  });
})();
