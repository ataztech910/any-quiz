/*
 * Значения для приложения по-умолчанию
 */
const defaultSelectClass = "selectBox";
const resultLayoutClass = "resultBox";
const answerLayoutClass = "answerBox";
const startOverLayoutClass = "startOverButton";
const testApp = getElement(".app");
const dashboard = getElement(".dashboard");
const dashboardLogs = getElement(".dashboardLogs");
const parent = getElement(".content");
const progress = getElement("#progress");
progress.max = matrixOfAnswers.length;
const maxProgress = 63;
const answerValueName = "answerValue";
const loggerTitleClass = "logerTitle";
const navigationBlockClass = "navigationBlock";
const navigationClass = "navigation";
let defaultTestIndex = 0;
const maxTestValue = matrixOfAnswers.length;
const questionClass = "questionLayout";

/*
 * Отрисовка кнопок теста
 */
const createElementInList = dataList => {
  parent.innerHTML = "";

  const question = getElement(`.${questionClass}`);
  question.innerHTML = matrixOfQuestions[defaultTestIndex];

  dataList.forEach(dataElement => {
    const btn = createElementWithContent(
      "button",
      defaultSelectClass,
      dataElement.content,
      answerValueName,
      dataElement.score,
      dataElement.selected
    );
    parent.appendChild(btn);
  });

  const navigationBlock = createNavigationBlock(matrixOfAnswers.length);
  parent.appendChild(navigationBlock);

  document.querySelectorAll(`.${defaultSelectClass}`).forEach(selector => {
    selector.addEventListener("click", selectElementInTest);
  });
  progress.value = defaultTestIndex;
};

/*
 *
 */
const selectElementInTest = () => {
  selectTestInDataSet(
    parseInt(event.target.dataset[answerValueName]),
    event.target
  );
};

/**
 * Создание слоя с результатами
 */
const createResultLayout = result => {
  let score = 0;

  matrixOfAnswers.forEach(element => {
    const selectedValue = element.find(answer => answer.selected);
    score += selectedValue.score;
  });

  const resultLayout = createElementWithContent(
    "div",
    resultLayoutClass,
    buildYourResultsString(score)
  );

  const answerLayout = createElementWithContent(
    "div",
    answerLayoutClass,
    systemAnswersByValues[result]
  );
  const startOverLayout = createElementWithContent(
    "button",
    startOverLayoutClass,
    "Пройти еще раз"
  );
  startOverLayout.addEventListener("click", initTest);

  progress.value = maxTestValue;
  parent.innerHTML = "";
  parent.appendChild(resultLayout);
  parent.appendChild(answerLayout);
  parent.appendChild(startOverLayout);
};

/**
 * Инициация тестов. Сброс всех параметров
 */
const initTest = () => {
  testApp.style.display = "block";
  dashboard.style.display = "none";
  progress.value = 0;
  resetIndex();
  score = 0;
  resetLastResults();
  createElementInList(matrixOfAnswers[defaultTestIndex]);
};

/**
 * Отменить тест и вернуться на главную
 */
const cancelTest = () => {
  testApp.style.display = "none";
  dashboard.style.display = "block";
  initDash();
};

/**
 * Создание главного экрана
 */
const initDash = () => {
  const logs = getItem("logs");
  dashboardLogs.innerHTML = "";
  if (logs.length > 0) {
    logs.forEach(log => {
      const loger = createElementWithContent(
        "div",
        loggerTitleClass,
        buildLoggerString(log)
      );
      const progress = createProgressBar(maxProgress, log.score);

      dashboardLogs.appendChild(loger);
      dashboardLogs.appendChild(progress);
    });
  } else {
    const loger = createElementWithContent(
      "div",
      undefined,
      "Вы еще не проходили тест"
    );
    dashboardLogs.appendChild(loger);
  }
};

/**
 * Старт приложения
 */
initDash();
