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