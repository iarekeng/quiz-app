import Question from "./question.js";
import Quiz from "./quiz.js";

const App = (() => {
   // cache the DOM
  const quizEl = document.querySelector(".jabquiz");
  const quizQuestionEl = document.querySelector(".jabquiz__question");
  const trackerEl = document.querySelector(".jabquiz__tracker");
  const taglineEl = document.querySelector(".jabquiz__tagline");
  const choicesEl = document.querySelector(".jabquiz__choices");
  const progressInnerEl = document.querySelector(".progress__inner");
  const nextButtonEl = document.querySelector(".next");
  const restartButtonEl = document.querySelector(".restart");

  const q1 = new Question(
    "First President of US?",
    ["Barrack", "Osama", "George", "Monkey"],
    2
  )
  const q2 = new Question(
    "When was Javascript created?",
    ["June 1995","May 1995","July 1885","Sep 1996"],
    1
  )
  const q3 = new Question(
    "What does CSS stand for?",
    ["County Sheriff Service", "Cascading Sexy Sheets", "Cascading Style Sheets"],
    2
  )
  const q4 = new Question(
    "The Full form of HTML is...?",
    ["Hyper Text Markup Language", "blah", "Hold The Mike Loud", "Error"],
    0
  )
  const q5 = new Question(
    "console.log(typeof []) would return what?",
    ["Object", "Array", "Null", "String"],
    0
  )

  const quiz = new Quiz ([q1,q2,q3,q4,q5]);
  
  const listeners = _ => {
    nextButtonEl.addEventListener("click", function() {
      const selectedRadioElem = document.querySelector('input[name="choice"]:checked')
      if (selectedRadioElem) {
        const key = Number(selectedRadioElem.getAttribute("data-order"));
        quiz.guess(key);
        renderAll();
      }
    })

    restartButtonEl.addEventListener("click", function() {
      // reset the quiz
      quiz.reset();
      setValue(taglineEl, `Pick an option below!`)
      // renderAll aggain()
      renderAll();
      // restore the next button
      nextButtonEl.style.opacity=1;
    })
  }
  
  const setValue = (elem, value) => {
    elem.innerHTML = value;
  }
  
  const renderQuestion = _ => {
    const question = quiz.getCurrentQuestion().question;
    setValue(quizQuestionEl, question)
  }

const renderChoicesElements = _ => {
  let markup = "";
  const currentChoices = quiz.getCurrentQuestion().choices;
  currentChoices.forEach((elem,index) => {
    console.log(elem, index)
    markup += `
    <li class="jabquiz__choice">
      <input type="radio" name="choice" class="jabquiz__input" data-order="${index}" id="choice${index}" >
      <label for="choice${index}" class="jabquiz__label">
        <span>${elem}</span>
      </label>
    </li>
    `
  });

  setValue(choicesEl, markup)
}

const renderTracker = _ => {
  const index = quiz.currentIndex;
  setValue(trackerEl, `${index+1} of ${quiz.questions.length}`)
}

const getPercentage = (num1, num2) => {
  return Math.round((num1/num2) * 100)
}
const launch = (width, maxPercent) => {
  let loadingBar = setInterval(function() {
    if (width > maxPercent) {
      clearInterval(loadingBar);
    } else {
      width++;
      progressInnerEl.style.width = width + "%";
    }
  }, 3)
}
const renderProgress = _ => {
  // 1. width
  const currentWidth = getPercentage(quiz.currentIndex, quiz.questions.length)
  // 2. launch(0, width)
  launch(0, currentWidth);
}

const renderEndScreen = _ => {
  setValue(quizQuestionEl, `Great Job!`);
  setValue(taglineEl, `Complete!`);
  setValue(trackerEl, `Your score: ${getPercentage(quiz.score, quiz.questions.length)}%`);
  nextButtonEl.style.opacity = 0;
  renderProgress();
}

renderProgress();
  const renderAll = _ => {
    if (quiz.hasEnded()) {
      renderEndScreen()
    } else {
      // 1. render the question
      renderQuestion();
      // 2. render the choices elements
      renderChoicesElements();
      // 3. render tracker
      renderTracker();
      // 4. render progress
      renderProgress();
      
    }
  }
  return {
    renderAll: renderAll,
    listeners: listeners
  }
})();

App.renderAll();
App.listeners();