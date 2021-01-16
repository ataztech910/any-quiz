/*
 * Значения для приложения по-умолчанию
 */
const quizApplication = getElement(".app");
const dashboard = getElement(".dashboard");
const dashboardLogsLayout = getElement(".dashboardLogsLayout");
const contentLayout = getElement(".content");
const progress = getElement("#progress");
progress.max = matrixOfAnswers.length;
const maxProgress = 100;
let defaultTestIndex = 0;
const maxTestValue = matrixOfAnswers.length;
const snackBarTimeout = 3000;

const defaultSelectClass = "selectBox";
const resultLayoutClass = "resultBox";
const answerLayoutClass = "answerBox";
const startOverLayoutClass = "startOverButton";

const answerValueName = "answerValue";
const loggerTitleClass = "logerTitle";
const navigationBlockClass = "navigationBlock";
const navigationClass = "navigation";

const questionClass = "questionLayout";
const backButtonText = "❮ назад";
const forwardButtonText = "далее ❯";
const endQuizButton = "завершить";
const noAnswerSelected = "Не выбран ответ";
const noResultsYet = "Вы еще не проходили тест";
const restartQuiz = "Пройти еще раз";
const yourResult = "Ваш результат";
const scoreTextName = "баллов";


/**
 * Создание главного экрана
 * @dashboardLogsLayout содержит слой для отображения логов
 */
const initDash = (dashboardLogsLayout) => {
  const logs = getItem("logs");
  dashboardLogsLayout.innerHTML = "";
  if (logs.length > 0) {
    logs.forEach(log => {
      const loger = createElementWithContent(
        "div",
        loggerTitleClass,
        buildLoggerString(log)
      );
      const progress = createProgressBar(maxProgress, log.score);

      dashboardLogsLayout.appendChild(loger);
      dashboardLogsLayout.appendChild(progress);
    });
  } else {
    const loger = createElementWithContent("div", undefined, noResultsYet);
    dashboardLogsLayout.appendChild(loger);
  }
};

/**
 * Инициация тестов. Вызывает функцию обнуления всех параметров
 * @quizApplication элемент приложения
 * @dashboard слой с дашбордом
 * @progress элемент прогресбар
 * @matrixOfAnswers массив ответов
 * @defaultTestIndex текущий номер вопроса
 */
const initQuizListener = () => {
  console.log(contentLayout);
  initQuiz(quizApplication, {
    dashboard,
    progress,
    matrixOfAnswers,
    defaultTestIndex,
    contentLayout
  });
};

/**
 * Функция сброса всех параметров
 * @resetIndex функция сброса индекса теста
 * @resetAnswersToFalse сброс всех ответов в массиве на "не отвечено"
 * @createQuizElementsWithAnswersList создание списка ответов для текущего вопроса
*/
const initQuiz = (application, {
                                  dashboard,
                                  progress,
                                  contentLayout,
                               }) => {
  application.style.display = "block";
  dashboard.style.display = "none";
  progress.value = 0;
  resetIndex();
  resetAnswersToFalse();
  createQuizElementsWithAnswersList(matrixOfAnswers[defaultTestIndex], contentLayout, progress);
}

/*
 * Отрисовка кнопок теста
 */
const createQuizElementsWithAnswersList = (dataList, layout, progressBar) => {
  layout.innerHTML = "";

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
    layout.appendChild(btn);
  });

  const navigationBlock = createNavigationBlock(matrixOfAnswers.length);
  layout.appendChild(navigationBlock);

  document.querySelectorAll(`.${defaultSelectClass}`).forEach(selector => {
    selector.addEventListener("click", selectElementInTest);
  });
  progressBar.value = defaultTestIndex;
};

/*
 * Выбор ответа в списке вариантов
 */
const selectElementInTest = (event) => {
  selectTestInDataSet(
    parseInt(event.target.dataset[answerValueName]),
    event.target
  );
};

/**
 * Создание слоя с результатами
 */
const createResultLayout = (result, progress, contentLayout) => {
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
    restartQuiz
  );
  startOverLayout.addEventListener("click", initQuizListener);

  progress.value = maxTestValue;
  contentLayout.innerHTML = "";
  contentLayout.appendChild(resultLayout);
  contentLayout.appendChild(answerLayout);
  contentLayout.appendChild(startOverLayout);
};

/**
 * Отменить тест и вернуться на главную
 */
const cancelTest = () => {
  clearGlobalParams(quizApplication, dashboard);
  initDash(dashboardLogsLayout);
};

const clearGlobalParams = (application, dashboard) => {
  application.style.display = "none";
  dashboard.style.display = "block";
}

/**
 * Создание строки результатов
 */
const buildYourResultsString = string => {
  return `${yourResult} ${string} ${scoreTextName}`;
};

/**
 * Создание строки логгера
 */
const buildLoggerString = log => {
  return `${log.timestamp}<span class="bold">(${log.score})</span>`;
};

/**
 * Смена навигации по тесту. Если не выбран ответ, то не можем двигаться
 */
const changeNavigationState = resolve => {
  let readyToProceed = false;
  matrixOfAnswers[defaultTestIndex].forEach(element => {
    if (element.selected === true) {
      readyToProceed = true;
    }
  });
  if (readyToProceed) {
    resolve(true);
  } else {
    const snackbar = getElement("#snackbar");
    snackbar.innerHTML = noAnswerSelected;
    snackbar.className = "show";

    setTimeout(function() {
      snackbar.className = snackbar.className.replace("show", "");
    }, snackBarTimeout);
  }
};

/**
 * Навигация по тесту на следующий вопрос
 */
const testNavigationForward = () => {
  changeNavigationState(changeIndex);
};

/**
 * Навигация по тесту на предыдущий вопрос
 */
const testNavigationBack = () => {
  changeIndex(false);
};

/**
 * Навигация по тесту на экрвн с результатами
 */
const getResult = () => {
  changeNavigationState(finishTest);
};

/**
 * Создание навигации
 */
const createNavigationBlock = max => {
  const navigationBlock = createElementWithContent("div", navigationBlockClass);

  if (defaultTestIndex > 0) {
    const buttonBack = createElementWithContent(
      "button",
      navigationClass,
      backButtonText
    );
    buttonBack.addEventListener("click", testNavigationBack);
    navigationBlock.appendChild(buttonBack);
  }

  if (defaultTestIndex < max - 1) {
    const buttonForwad = createElementWithContent(
      "button",
      navigationClass,
      forwardButtonText
    );
    buttonForwad.addEventListener("click", testNavigationForward);
    navigationBlock.appendChild(buttonForwad);
  }

  if (defaultTestIndex === max - 1) {
    const buttonForwad = createElementWithContent(
      "button",
      navigationClass,
      endQuizButton
    );
    buttonForwad.addEventListener("click", getResult);
    navigationBlock.appendChild(buttonForwad);
  }

  return navigationBlock;
};

/**
 * Смена текущего индекса для теста
 */
const changeIndex = (direction = true) => {
  if (direction && defaultTestIndex < maxTestValue) {
    defaultTestIndex++;
  } else if (!direction && defaultTestIndex > 0) {
    defaultTestIndex--;
  }
  createQuizElementsWithAnswersList(matrixOfAnswers[defaultTestIndex], contentLayout, progress);
};

/**
 * Сброс текущего индекса теста в ноль
 */
const resetIndex = () => {
  defaultTestIndex = 0;
};

/**
 * Выбрать ответ
 */
const selectTestInDataSet = (selectedIndex, target) => {
  getAll(`.${defaultSelectClass}`).forEach(element => {
    element.classList.remove("selected");
  });

  matrixOfAnswers[defaultTestIndex].forEach((value, index) => {
    if (index === selectedIndex) {
      value.selected = true;
      target.classList.add("selected");
    } else {
      value.selected = false;
    }
  });
};

/**
 * Сброс всех ответов
 */
const resetAnswersToFalse = () => {
  matrixOfAnswers.forEach(element => {
    element.forEach(answer => (answer.selected = false));
  });
};

/**
 * Получение результата теста
 */
const getTestScore = () => {
  let score = 0;
  matrixOfAnswers.forEach(element => {
    const selectedValue = element.find(answer => answer.selected);
    score += selectedValue.score;
  });
  return score;
};

/**
 * Проверка к какой категории относится набранный счет
 */
const checkResults = score => {
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
 * Завершить тест и сохранить данные
 */
const finishTest = () => {
  const score = getTestScore();
  createResultLayout(checkResults(score), progress, contentLayout);
  const resultToState = {
    score,
    timestamp: new Date().toLocaleDateString("en-US")
  };
  setItem("logs", resultToState);
};

// ==================================================================================
/**
 * Старт приложения
 */
initDash(dashboardLogsLayout);

/*
 * Это создание service worker нужен для инициации Progressive возможностей страницы
 */
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/service-worker.js")
    .then(function(registration) {
      console.log(
        "Регистрация успешна. Область видимости:",
        registration.scope
      );
    })
    .catch(function(error) {
      console.log("Сервис не включен, ошибка:", error);
    });
}
