// Global variable declaration
let quizData;
let answers = [];

// DOM elements called
let startQuiz = document.getElementById("startQuiz");
let rulesContainer = document.getElementById("rulesContainer");
let countDownContainer = document.getElementById("countDownContainer");
let submitContainer = document.getElementById("submitContainer");
let quizContainer = document.querySelector(".quizContainer");
let answersContainer = document.getElementById("answersContainer");
let displayResult = document.getElementById("displayResult");

// EventListener for quiz start button
startQuiz.addEventListener("click", () => {
  let counter = document.getElementById("counter");
  let counterNum = 3;
  countDownContainer.classList.remove("hidden");
  countDownContainer.classList.add("flex");

  let x = setInterval(() => {
    if (counterNum < 0) {
      countDownContainer.classList.remove("flex");
      countDownContainer.classList.add("hidden");
      counterNum = 3;
      quizData = null;
      answers = [];
      rulesContainer.classList.add("hidden");
      submitContainer.classList.remove("hidden");
      submitContainer.classList.add("flex");
      loadQuiz();
      clearInterval(x);
    }
    counter.innerText = counterNum;
    counterNum--;
  }, 1000);
});

// All quiz data fetched from JSON
const loadQuiz = async () => {
  const res = await fetch("./data/quiz.json");
  const data = await res.json();
  quizData = data;
  displayQuiz(data);
};

// Displaying quiz on quiz page
const displayQuiz = (data) => {
  if (!data) {
    quizContainer.innerHTML = "";
    return;
  }

  quizContainer.innerHTML = data
    .map(
      (quiz, i) => `<div class="m-3 py-3 px-4 shadow-sm rounded">
    <div class="flex items-center">
      <div class="h-8 w-8 bg-green-300 rounded-full flex justify-center items-center text-green-800 mr-3">
        ${i + 1}
      </div>
      <p class="text-gray-800 text-sm">${quiz.question}</p>
    </div>
    <div class="grid grid-cols-2 gap-4 mt-5">
      ${displayQuizOptions(quiz.options, i)}
    </div>
  </div>`
    )
    .join("");
};

// Function to display quiz options
const displayQuizOptions = (options, index) => {
  return options
    .map(
      (option, i) => `<div class="py-1 px-2 rounded border ${
        answers[index]?.givenAns === option
          ? answers[index]?.givenAns === quizData[index]?.answer
            ? "bg-green-200 border-green-500"
            : "bg-red-200 border-red-500"
          : "bg-gray-100 border-gray-300"
      }">
    <label>
      <input
        type="radio"
        class="hidden"
        name="q${index}"
        value="${option}"
        onchange="handleAnswerChange(${index}, '${option}')"
        ${answers[index]?.givenAns === option ? "checked" : ""}
      />
      ${option}
    </label>
  </div>`
    )
    .join("");
};

// Function to handle answer change
const handleAnswerChange = (index, option) => {
  answers[index] = { answer: quizData[index]?.answer, givenAns: option };
};

// EventListener for quiz submit button
document.getElementById("submit").addEventListener("click", () => {
  if (answers.length < 6) {
    alert("Please answer all questions before submitting.");
    return;
  }
  answersContainer.innerHTML = `<div class="my-4">
    <i class="fa-solid fa-fan animate-spin text-2xl text-green-600"></i>
    <p class="text-xs animate-pulse">Please Wait, We are checking...</p>
  </div>`;
  let timeTaken = document.getElementById("counter");
  let totalMark = 0;
  let grade = {
    status: "",
    color: "",
  };

  for (let ans of answers) {
    if (ans.answer === ans.givenAns) {
      totalMark += 10;
    }
  }

  if (totalMark === 60) {
    grade.status = "Excellent";
    grade.color = "text-green-600";
  } else if (totalMark >= 40) {
    grade.status = "Good";
    grade.color = "text-blue-600";
  } else if (totalMark >= 20) {
    grade.status = "Average";
    grade.color = "text-yellow-600";
  } else {
    grade.status = "Below Average";
    grade.color = "text-red-600";
  }

  setTimeout(() => {
    answersContainer.innerHTML = "";
    displayResult.innerHTML = `
      <div class="bg-white p-4 shadow-md rounded-md">
        <h3 class="text-xl font-semibold mb-4">Result</h3>
        <p class="mb-2">Total Correct Answers: <strong>${totalMark / 10}</strong></p>
        <p class="mb-4">Time Taken: <strong>${timeTaken.innerText}</strong></p>
        <p class="mb-2">Grade: <strong class="${grade.color}">${grade.status}</strong></p>
        <button
          id="retry"
          class="px-4 py-2 bg-green-600 text-white rounded-md"
          onclick="retryQuiz()"
        >
          Retry Quiz
        </button>
      </div>
    `;
    displayResult.classList.remove("hidden");
  }, 3000);
});

// Retry Quiz
const retryQuiz = () => {
  answers = [];
  displayResult.classList.add("hidden");
  rulesContainer.classList.remove("hidden");
  submitContainer.classList.add("hidden");
};

// Initial load of quiz
loadQuiz();
