let categoryChosen;
let nextBtn = document.querySelector('#next-btn')
let homeHeading = document.querySelector('#home-heading')
let categoryContainer = document.querySelector('#quiz-category-container')
let quizLink = document.querySelector('#quiz-link')
let categorySelector = document.querySelector('#category-selector')
let quizUI = document.querySelector('#quiz-app')
let homeUI = document.querySelector('#home-UI')
let choice1 = document.querySelector('#choice-1')
let choice2 = document.querySelector('#choice-2')
let choice3 = document.querySelector('#choice-3')
let choice4 = document.querySelector('#choice-4')
let choicesChar = document.querySelectorAll('.choice-char')
let choicesBtn = document.querySelectorAll('.choices-btn')
let result = document.querySelector('#result')
let Qnumber = document.querySelector('#q-number')
let nextQBtn = document.querySelector('#next-Q-btn')
let resultHeading = document.querySelector('#result-heading')
let resultPage = document.querySelector('#result-page')
let playAgainBtn = document.querySelector('#play-again-btn')
let choicesContainer = document.querySelector('#choices-container')
let arrOfChoices = [choice1, choice2, choice3, choice4]
let listOfQuestions = []
let currentId = 0;
let currentQ;
let theAnswers = []
let answerChosen = false;
let points = 0;

function fetchQuestions(category) {
  resetForNewQ()
  Question.getQuestions(category)
    .then(questions => {
      listOfQuestions = [...questions]
      Question.renderQuestions(questions, 0)
      Qnumber.textContent = '1'
    })
    .catch(error => console.log(error))
}

class Question {
  constructor(questionObj, id) {
    this.id = id
    this.question = questionObj.question;
    this.category = questionObj.category;
    this.difficulty = questionObj.difficulty;
    this.correct_answer = questionObj.correct_answer;
    this.incorrect_answers = questionObj.incorrect_answers
  }

  static getQuestions(category) {

    if (!category) {
      return fetch('https://opentdb.com/api.php?amount=10&type=multiple')
        .then(response => response.json())
        .then(object => object.results.map((question, index) => new Question(question, index)))
        .catch(error => console.log(error))
    }
    else {
      return fetch(`https://opentdb.com/api.php?amount=10&category=${category}&type=multiple`)
        .then(response => response.json())
        .then(object => object.results.map((question, index) => new Question(question, index)))
        .catch(error => console.log(error))
    }
  }

  static renderQuestion(theQuestion) {
    let questionArea = document.querySelector('#the-question')
    questionArea.innerText = theQuestion.question.replace(/&quot;+/gm, '"').replace(/&#039;+/gm, "'")
  }

  static renderQuestions(questions, id) {
    answerChosen = false;
    currentQ = questions.find(question => question.id === id)
    Question.renderQuestion(currentQ)
    let arrOfAnswers = []
    arrOfAnswers.push(new Answer(currentQ.correct_answer, true))
    currentQ.incorrect_answers.forEach(answer => arrOfAnswers.push(new Answer(answer, false)))
    Answer.render(...arrOfAnswers)
  }

  static goToNextQuestion() {
    currentId++;
    Question.renderQuestions(listOfQuestions, currentId)
  }
}

class Answer {
  constructor(answer, isCurrect) {
    this.answer = answer;
    this.currect = isCurrect
  }

  static render(answer1, answer2, answer3, answer4) {
    theAnswers = [answer1, answer2, answer3, answer4]
    let arrOfAnswers = [answer1.answer, answer2.answer, answer3.answer, answer4.answer]
    shuffle(arrOfChoices)
    for (let i = 0; i < 4; i++) {
      arrOfChoices[i].textContent = arrOfAnswers[i].replace(/&quot;+/gm, '"').replace(/&#039;+/gm, "'")
    }
  }

  static checkAnswer(answer) {
    let deFormattedAnswer = answer.replace(/"/gm, '&quot;').replace(/'/gm, "&#039;");
    let theAnswer = theAnswers.find(element => element.answer === deFormattedAnswer)
    return theAnswer.currect
  }
}

document.addEventListener('DOMContentLoaded', () => {
  clicked = 0;
  nextBtn.addEventListener('click', (e) => {
    e.preventDefault()

    if (clicked === 0) {
      animateElements(removeElements, homeHeading)
      function removeElements() {
        homeHeading.classList.add('hidden')
        nextBtn.classList.add('green-btn')
        nextBtn.style.cssText = "animation: none;"
        nextBtn.textContent = "Let's go!"
        categoryContainer.classList.remove('hidden')
      }
      clicked = 1;
    }
    else if (clicked === 1) {
      animateElements(removeElements, categoryContainer)
      function removeElements() {
        homeUI.classList.add('hidden')
        quizUI.classList.remove('hidden')
      }
      if (categoryChosen === 0) {
        fetchQuestions()
      } else {
        fetchQuestions(categoryChosen)
      }
      clicked = 0;
    }
  })

  categorySelector.addEventListener('change', (e) => {
    categoryChosen = Number(e.target.value);
  })

  choicesBtn.forEach(element => {
    element.addEventListener('click', (e) => {
      if (answerChosen === false) {
        if (e.target.nodeName === 'BUTTON') {
          answerChosen = true;
          let childNodes = [...e.target.childNodes]
          let answer = childNodes.find(node => node.nodeName === 'P')
          let isItTrue = Answer.checkAnswer(answer.textContent)
          choicesChar.forEach(element => element.classList.add('hidden'))
          showResult(isItTrue, e.target)
          setTimeout(showNextQuestionBtn, 450)
        }
      }
    })
  })

  nextQBtn.addEventListener('click', () => {
    if (currentId === 9) {
      quizUI.classList.add('hidden')
      resultPage.classList.remove('hidden')
      whatsTheResult()
      resetForNewQ()
    } else {
      Question.goToNextQuestion()
      Qnumber.textContent = `${currentId + 1}`
      resetForNewQ()
    }
  })

  playAgainBtn.addEventListener('click', () => {
    resultPage.classList.add('hidden')
    homeUI.classList.remove('hidden')
    categoryContainer.style.cssText = "animation: none;";
    nextBtn.style.cssText = "animation: none;";
    clicked = 1;
    listOfQuestions = []
    currentId = 0;
    theAnswers = []
    answerChosen = false;
    points = 0;
  })

})

function whatsTheResult() {
  if (points >= 5) {
    resultHeading.innerText = `your score was ${points} 😃🙌`
  } else {
    resultHeading.innerText = `your score was ${points} 😢`
  }
}

function showResult(isItTrue, theChoice) {
  if (isItTrue === true) {
    points++
    theChoice.classList.add('green-btn')
    result.innerText = 'Currect'
    result.style.cssText = 'color: #04BF8A; font-weight: 400 !important;'
  } else {
    theChoice.classList.add('red-btn')
    result.innerText = 'Wrong'
    result.style.cssText = 'color: #F20505; font-weight: 400 !important;'
    showCurrectAnswer()
  }
}

function findCurrectAnswer() {
  let theCurrectAnswer = theAnswers.find(element => element.currect === true)
  theCurrectAnswer = theCurrectAnswer.answer.replace(/&quot;+/gm, '"').replace(/&#039;+/gm, "'")
  return theCurrectAnswer;
}

function showCurrectAnswer() {
  let theCurrectAnswer = findCurrectAnswer()
  let allChoices = [...choicesBtn]
  let theCurrectChoice = allChoices.find(element => element.childNodes[3].textContent === theCurrectAnswer)
  theCurrectChoice.classList.add('green-btn')
}

function showNextQuestionBtn() {
  nextQBtn.classList.remove('zero-opacity')
}

function resetForNewQ() {
  nextQBtn.classList.add('zero-opacity')
  result.innerHTML = ''
  choicesChar.forEach(element => element.classList.remove('hidden'))
  let allChoices = [...choicesBtn]
  allChoices.forEach(element => {
    if (element.classList.contains('green-btn')) {
      element.classList.remove('green-btn')
    } else if (element.classList.contains('red-btn')) {
      element.classList.remove('red-btn')
    }
  })
}

function shuffle(array) {
  let currentIndex = array.length, temp, randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temp = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temp;
  }
}

function animateElements(func, element) {
  element.style.cssText = "animation: swoosh 0.7s ease-in-out forwards;";
  nextBtn.style.cssText = "animation: swoosh 0.8s ease-in-out forwards;";
  setTimeout(func, 900)
}