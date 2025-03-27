document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".container");
  const containerNew = document.querySelector(".container-new");
  const cocos = document.querySelector(".cocos");
  const modal = document.querySelector(".modal");
  const modalOverlay = document.querySelector(".modal-overlay");
  const activateBtn = document.getElementById("activate-btn");
  const audioClickSound = document.getElementById("clickButton");

  activateBtn.addEventListener("click", () => {
    audioClickSound.currentTime = 0;
    audioClickSound.play();
    closeModal();
  });

  function switchContainers() {
    container.style.display = "none";
    containerNew.style.display = "block";
  }

  cocos.addEventListener("animationiteration", () => {
    setTimeout(switchContainers, 0);
  });

  function closeModal() {
    modal.style.display = "none";
    modalOverlay.style.display = "none";
  }
});

const rows = document.querySelectorAll(".row");
const spinButton = document.getElementById("spin-button");
const freeSpinsText = document.querySelector(".spin-text-score");
const freeSpinsTextOutline = document.querySelector(".spin-text-outline-score");
const buttonImage = document.getElementById("img1");
const spinText = document.querySelector(".spin-text");
const spinTextOutline = document.querySelector(".spin-text-outline");
let freeSpinsCount = parseInt(freeSpinsText.textContent.split(": ")[1]);
let freeSpinsCountOutline = parseInt(
  freeSpinsTextOutline.textContent.split(": ")[1]
);
const audioClickButton = document.getElementById("clickButton");
const audioClickSound = document.getElementById("clickSound");

function initSlots() {
  rows.forEach((row) => {
    const slots = row.querySelectorAll(".slot");
    slots.forEach((slot) => {
      const slotHeight = 740;
      const imageCount = 12;
      const randomImageIndex = Math.floor(Math.random() * imageCount);
      slot.style.backgroundPositionY = `-${randomImageIndex * slotHeight}px`;
      slot.dataset.finalPosition = `-${randomImageIndex * slotHeight}`;
    });
  });
}

function clearHighlightedSlots() {
  const highlightedSlots = document.querySelectorAll(".slot.highlighted");
  highlightedSlots.forEach((slot) => {
    slot.classList.remove("highlighted");
  });
}

function spinSlots() {
  if (freeSpinsCount > 0) {
    clearHighlightedSlots();

    let animations = [];
    let winningRows = [];

    rows.forEach((row) => {
      const slots = row.querySelectorAll(".slot");
      let winningSlots = [];

      slots.forEach((slot) => {
        const slotHeight = 740;
        const imageCount = 12;
        const randomImageIndex = Math.floor(Math.random() * imageCount);
        const finalPosition = -randomImageIndex * slotHeight;
        const fullCycles = imageCount * slotHeight * 3;
        const startPosition =
          finalPosition - fullCycles - slotHeight * imageCount;

        const animation = gsap.fromTo(
          slot,
          {
            backgroundPositionY: startPosition + "px",
          },
          {
            duration: 2 + Math.random() * 1,
            backgroundPositionY: finalPosition + "px",
            ease: "power2.inOut",
            onComplete: () => {
              slot.style.backgroundPositionY = `${finalPosition}px`;
              slot.dataset.finalPosition = finalPosition;

              if (Math.random() < 0.3) {
                winningSlots.push(slot);
                slot.classList.add("highlighted");
                playElectricSound();
              }
            },
          }
        );
        animations.push(animation);
      });

      if (winningSlots.length > 0) {
        winningRows.push(winningSlots);
      }
    });

    freeSpinsCount--;
    freeSpinsCountOutline--;
    freeSpinsText.textContent = `Free spins: ${freeSpinsCount}`;
    freeSpinsTextOutline.textContent = `Free spins: ${freeSpinsCountOutline}`;

    if (freeSpinsCount === 0 && freeSpinsCountOutline === 0) {
      spinButton.classList.add("disabled");
      buttonImage.src = "./images/button-grey.png";
      spinText.style.color = "#FFFFFF9E";
      spinTextOutline.style.color = "#3604438A";

      Promise.all(animations.map((anim) => anim.then())).then(() => {
        setTimeout(() => {
          showEndGameModal();
        }, 4000);
      });
    }
  }
}

function playElectricSound() {
  const electricSound = document.getElementById("electricSound");
  electricSound.currentTime = 0;
  electricSound.play();
}
function showEndGameModal() {
  const modal = document.createElement("div");
  modal.classList.add("modal");
  modal.innerHTML = `
    <div class="modal-overlay-won"></div>
    <img class="logo" src="./images/logo-big.png" alt="logo" />
    <img class="table" src="./images/table.png" alt="table" />
    <p class="popup-header-modal">WELL <br/>DONE! <br/></p>
    <span class="popup-header-won">YOU WON:</span>
    <p class="popup-paragraph-won">450 GPB</p>
    <p class="spin-paragraph">+ 250 Free spins</p>
    <div class="won-container">
      <img class="dis-image" src="./images/done-icon.png" alt="icon-done" />
      <p class="won-paragraph">Turn on notifications and receive more special bonuses!</p>
    </div>
    <button class="install-btn">
      <img src="./images/button-image.png" alt="btn" width="767" height="332" />
      <div class="activate-text-wrapper">
        <p class="install-text">INSTALL THE APP</p><br/>
        <p class="install-text-outline">INSTALL THE APP</p>
      </div>
    </button>
    <div class="time-container">
      <img src="./images/time-table.png" alt="btn" width="421" height="268" />
      <div class="time-text-wrapper">
        <p class="time-text">Bonus will expire in:<br/><span class="timer">15:00</span><br/>MINUTES &nbsp; SECONDS</p>
        <p class="time-text-outline">Bonus will expire in:<br/><span class="timer">15:00</span><br/>MINUTES &nbsp; SECONDS</p>
      </div>
    </div>
  `;
  document.querySelector(".container-new").appendChild(modal);

  let timeLeft = 15 * 60;
  const timerElements = modal.querySelectorAll(".timer");

  const countdown = setInterval(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const timeString = `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
    timerElements.forEach((timer) => (timer.textContent = timeString));
    timeLeft--;
    if (timeLeft < 0) {
      clearInterval(countdown);
      timerElements.forEach((timer) => (timer.textContent = "00:00"));
    }
  }, 1000);

  const spinBtn = modal.querySelector(".spin-btn");
  spinBtn.addEventListener("click", () => {
    clearInterval(countdown);
    modal.remove();
    freeSpinsCount = 3;
    freeSpinsCountOutline = 3;
    freeSpinsText.textContent = `Free spins: ${freeSpinsCount}`;
    freeSpinsTextOutline.textContent = `Free spins: ${freeSpinsCountOutline}`;
    spinButton.classList.remove("disabled");
    buttonImage.src = "./images/button-image.png";
    spinText.style.color = "#ffffff";
    spinTextOutline.style.color = "transparent";
    initSlots();
  });
}

initSlots();

spinButton.addEventListener("click", () => {
  if (!spinButton.classList.contains("disabled")) {
    audioClickSound.currentTime = 0;
    audioClickSound.play();
    audioClickButton.currentTime = 0;
    audioClickButton.play();
    spinSlots();
}
});
