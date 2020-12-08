/*
 * Значения для приложения по-умолчанию
 */
const defaultSelectClass = "selectBox";
const resultLayoutClass = "resultBox";
const answerLayoutClass = "answerBox";
const startOverLayoutClass = "startOverButton";
let score = 0;
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


/*
 * Отрисовка кнопок теста
 */
const createElementInList = dataList => {
  parent.innerHTML = "";
  dataList.forEach(dataElement => {
    const btn = createElementWithContent(
      "button",
      defaultSelectClass,
      dataElement.content,
      answerValueName,
      dataElement.score
    );
    parent.appendChild(btn);
  });

  const navigationBlock = createNavigationBlock(matrixOfAnswers.length);
  parent.appendChild(navigationBlock);

  document.querySelectorAll(`.${defaultSelectClass}`).forEach(selector => {
    selector.addEventListener("click", selectElementInTest);
  });
};

/*
 *
 */
const selectElementInTest = () => {
  selectTestInDataSet(
    parseInt(event.target.dataset[answerValueName]),
    event.target
  );
  // score += parseInt(event.target.dataset[answerValueName]);
  // console.log(score);
  // // defaultTestIndex++;
  // applicationState.changeIndexState(true);
  // parent.innerHTML = "";
  // if (applicationState.defaultTestIndex < matrixOfAnswers.length) {
  //   createElementInList(matrixOfAnswers[applicationState.defaultTestIndex]);
  // } else {
  //   createResultLayout(checkResults());
  //   const resultToState = {
  //     score,
  //     timestamp: new Date().toLocaleDateString("en-US")
  //   };
  //   setItem("logs", resultToState);
  // }
  // progress.value = applicationState.defaultTestIndex;
};

/**
 * Проверка результатов. Получая значения проверяем в какой разброс оно попадает и выдаем ID из массива результатов
 */
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

/**
 * Создание слоя с результатами
 */
const createResultLayout = result => {
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
