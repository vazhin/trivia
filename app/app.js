let nextBtn = document.querySelector('#next-btn')
let homeHeading = document.querySelector('#home-heading')
let categoryContainer = document.querySelector('#quiz-category-container')
let quizLink = document.querySelector('#quiz-link')
let categorySelector = document.querySelector('#category-selector')

class Question {
  constructor(questionObj, id) {
    this.id = id
    this.question = questionObj.question;
    this.category = questionObj.category;
    this.difficulty = questionObj.difficulty;
    this.correct_answer = questionObj.correct_answer;
    this.incorrect_answers = questionObj.incorrect_answers
  }

  static getQuestions() {
    return fetch('https://opentdb.com/api.php?amount=50&type=multiple')
      .then(response => response.json())
      .then(object => object.results.map((question, index) => new Question(question, index)))
  }

  static renderQuestion(theQuestion) {
    console.log(theQuestion)
    let questionArea = document.querySelector('#the-question')
    questionArea.innerText = theQuestion.question.replace(/&quot;+/gm, '"').replace(/&#039;+/gm, "'")
  }

}

Question.getQuestions()
  .then(questions => {
    questions.forEach(question => {
      Question.renderQuestion(question) //this is rendering all but showing one//////////
      let arrOfAnswers = []
      arrOfAnswers.push(new Answer(question.correct_answer, true))
      question.incorrect_answers.forEach(answer => arrOfAnswers.push(new Answer(answer, false)))
      Answer.render(...arrOfAnswers)
    })
  })
  .catch(error => console.log(error))

class Answer {
  constructor(answer, isCurrect) {
    this.answer = answer;
    this.currect = isCurrect
  }

  static render(answer1, answer2, answer3, answer4) {

    let arrOfAnswers = [answer1.answer, answer2.answer, answer3.answer, answer4.answer]

    let choice1 = document.querySelector('#choice-1')
    let choice2 = document.querySelector('#choice-2')
    let choice3 = document.querySelector('#choice-3')
    let choice4 = document.querySelector('#choice-4')
    let arrOfChoices = [choice1, choice2, choice3, choice4]
    let randomIndex = getRandomIntInclusive(0, 3)

    for (let i = 0; i < 4; i++) {
      arrOfChoices[i].textContent = arrOfAnswers[i]
    }
  }
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

document.addEventListener('DOMContentLoaded', () => {
  let categoryChosen;

  clicked = 0;
  nextBtn.addEventListener('click', () => {
    if (clicked === 0) {
      homeHeading.style.cssText = "animation: swoosh 0.7s ease-in-out forwards;";
      nextBtn.style.cssText = "animation: swoosh 0.8s ease-in-out forwards;"
      setTimeout(removeElements, 900)

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
      quizLink.setAttribute('href', './quiz.html');
    }
  })

  categorySelector.addEventListener('change', (e) => {
    categoryChosen = Number(e.target.value);
  })

})

