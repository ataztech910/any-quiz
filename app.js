/*
 * Значения для приложения по-умолчанию
 */
const defaultSelectClass = "selectBox";
const resultLayoutClass = "resultBox";
const answerLayoutClass = "answerBox";
const startOverLayoutClass = "startOverButton";
let defaultTestIndex = 0;
let score = 0;
const testApp = document.querySelector(".app");
const dashboard = document.querySelector(".dashboard");
const parent = document.querySelector(".content");
const progress = document.querySelector("#progress");
progress.max = matrixOfAnswers.length;

/*
 * Отрисовка кнопок теста
 */
const createElementInList = dataList => {
  let answerValue = 0;
  dataList.forEach(dataElement => {
    const btn = document.createElement("button");
    btn.className = defaultSelectClass;
    btn.dataset.answerValue = answerValue;
    btn.innerHTML = dataElement;
    parent.appendChild(btn);
    answerValue++;
  });
  document.querySelectorAll(`.${defaultSelectClass}`).forEach(selector => {
    selector.addEventListener("click", iterateTest);
  });
};

/*
 * Переход по уровням теста. Если дошли до конца нужно показать результат
 */
const iterateTest = event => {
  console.log(event.target.dataset.answerValue);
  score += parseInt(event.target.dataset.answerValue);
  defaultTestIndex++;
  parent.innerHTML = "";
  if (defaultTestIndex < matrixOfAnswers.length) {
    createElementInList(matrixOfAnswers[defaultTestIndex]);
  } else {
    console.log(checkResults());
    createResultLayout(checkResults());
    const resultToState = {
      score,
      timestamp: new Date()
    };
    setItem("logs", resultToState);
  }
  progress.value = defaultTestIndex;
};

const checkResults = () => {
  let previousElement = 0;
  let result = 0;
  maximalValues.forEach((max, index) => {
    if (score >= previousElement && score <= max) {
      result = index;
    }
    previousElement = max;
  });
  return result;
};

const createResultLayout = result => {
  const resultLayout = document.createElement("div");
  resultLayout.className = resultLayoutClass;
  resultLayout.innerHTML = `Ваш результат ${score} баллов`;

  const answerLayout = document.createElement("div");
  answerLayout.className = answerLayoutClass;
  answerLayout.innerHTML = systemAnswersByValues[result];

  const startOverLayout = document.createElement("button");
  startOverLayout.className = startOverLayoutClass;
  startOverLayout.innerHTML = "Пройти еще раз";

  startOverLayout.addEventListener("click", initTest);

  parent.appendChild(resultLayout);
  parent.appendChild(answerLayout);
  parent.appendChild(startOverLayout);
};

const initTest = () => {
  testApp.style.display = "block";
  dashboard.style.display = "none";
  progress.value = 0;
  parent.innerHTML = "";
  defaultTestIndex = 0;
  score = 0;
  createElementInList(matrixOfAnswers[defaultTestIndex]);
};

// initTets();
