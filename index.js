const cards = document.querySelectorAll(".card");
const wrongTries = document.querySelector(".wrong-tries");
const timerMints = document.querySelector(".timer .minutes");
const timerScnds = document.querySelector(".timer .seconds");
const result = document.querySelector(".result");
const tryAgain = document.querySelector(".try-again");
const message = document.querySelector(".result .msg");
const startGame = document.querySelector(".start-game");
const intro = document.querySelector(".intro-container");
const playerName = document.querySelector(".player-name");

// timer minuters and seconds
let durationMin = 1;
let durationSec = 0;

// track clicks counts
let clickCounts = 0;

// track the count of matched imges
let matched = 0;

// save cards dataset
let cardData = [];

// save card elements
let cardElements = [];

// for enable click one time
let enable = true;

// assign interval, so it can be accessible
let interval;

startGame.addEventListener("click", () => {
  intro.remove();
  playerName.textContent = prompt("please enter your name") || "Unknown";
  showCards();
});

// show cards for three seconds
function showCards() {
  cards.forEach((card) => {
    card.classList.add("clicked");
    card.classList.add("prevenet-click");
  });

  setTimeout(() => {
    hideCards();
    // enable click on card one time
    if (enable) {
      enableClick();
    }
    startTimer(durationMin, durationSec);
  }, 3000);
}

function hideCards() {
  cards.forEach((card) => {
    card.classList.remove("clicked");
    card.classList.remove("prevenet-click");
  });
}

// randomize cards
function randomizeCards() {
  cards.forEach((card) => {
    const randomNum = Math.ceil(Math.random() * cards.length);
    card.style.order = randomNum;
  });
}

randomizeCards();

function startTimer(mints, scnds) {
  interval = setInterval(() => {
    if (scnds === 0) {
      mints--;
      scnds = 60;
    }
    scnds--;

    const minutes = mints < 10 ? `0${mints}:` : `${mints}:`;
    const seconds = scnds < 10 ? `0${scnds}` : `${scnds}`;

    timerMints.textContent = minutes;
    timerScnds.textContent = seconds;

    // if the time end stop the game
    if (mints === 0 && scnds === 0) {
      // prevent clicking on cards
      preventClick();

      // stop the timer
      clearInterval(interval);

      // show the result in a result box
      message.textContent = `Time's Up You Lose`;
      result.classList.add("lose");
      result.classList.remove("hide");
    }
  }, 1000);
}

// click event for all cards
function enableClick() {
  // don't enable click again
  enable = false;

  cards.forEach((card) => {
    card.addEventListener("click", function () {
      this.classList.add("clicked");

      // save the data of the card in cardData
      cardData.push(this.dataset.animal);

      // save the clicked element
      cardElements.push(this);

      // increment clickCounts
      clickCounts++;

      // if there is two clicks, check if they match
      if (clickCounts === 2) {
        // prevent clicking on all cards for two seconds
        preventClick();

        // wait two seconds before checking the match, so that the card can be showed
        setTimeout(() => {
          allowClick();
          isMatched();
          isFinished();
        }, 1000);
      }
    });
  });
}

// check for card matching
function isMatched() {
  if (cardData[0] === cardData[1]) {
    matched++;
    cardElements[0].classList.add("matched", "prevent-click");
    cardElements[1].classList.add("matched", "prevent-click");
  } else {
    cardElements[0].classList.remove("clicked");
    cardElements[1].classList.remove("clicked");

    // increment wrongTries
    wrongTries.textContent++;
  }

  // reset
  clickCounts = 0;
  cardData = [];
  cardElements = [];
}

function preventClick() {
  cards.forEach((card) => {
    card.classList.add("prevent-click");
  });
}

function allowClick() {
  cards.forEach((card) => {
    if (!card.classList.contains("matched")) {
      card.classList.remove("prevent-click");
    }
  });
}

function isFinished() {
  if (matched === cards.length / 2) {
    // show the result in a result box
    message.textContent = `You Win`;
    result.classList.add("win");
    result.classList.remove("hide");

    // stop the timer
    clearInterval(interval);
  }
}

// attach click event on button for restarting the game
tryAgain.addEventListener("click", resetGame);

function resetGame() {
  cards.forEach((card) => {
    card.classList.remove("clicked", "matched", "prevent-click");
  });

  // reset
  clickCounts = 0;
  matched = 0;
  cardData = [];
  cardElements = [];
  wrongTries.textContent = 0;

  // restart the timer
  durationMin = 1;
  durationSec = 0;

  // hide the result box
  result.classList.add("hide");

  // hide cards
  hideCards();

  // randomize the cards
  randomizeCards();

  // wait two seconds then show cards
  setTimeout(() => {
    showCards();
  }, 500);
}
