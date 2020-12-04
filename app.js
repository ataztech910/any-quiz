/*
 * Значения для приложения по-умолчанию
 */
const defaultSelectClass = "selectBox";
let defaultTestIndex = 0;
let score = 0;
const parent = document.querySelector(".content");

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
    console.log(score);
  }
};

createElementInList(matrixOfAnswers[defaultTestIndex]);
