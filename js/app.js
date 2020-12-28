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
 * Выбор ответа в списке вариантов
 */
const selectElementInTest = () => {
  selectTestInDataSet(
    parseInt(event.target.dataset[answerValueName]),
    event.target
  );
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
 * Создание строки результатов
 */
const buildYourResultsString = string => {
  return `Ваш результат ${string} баллов`;
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
    snackbar.innerHTML = "Не выбран ответ";
    snackbar.className = "show";

    setTimeout(function() {
      snackbar.className = snackbar.className.replace("show", "");
    }, 3000);
  }
};

/**
 * Навигация по тесту на следующий вопрос
 */
const testNavigationForward = event => {
  changeNavigationState(changeIndex);
};

/**
 * Навигация по тесту на предыдущий вопрос
 */
const testNavigationBack = event => {
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
      "❮ назад"
    );
    buttonBack.addEventListener("click", testNavigationBack);
    navigationBlock.appendChild(buttonBack);
  }

  if (defaultTestIndex < max - 1) {
    const buttonForwad = createElementWithContent(
      "button",
      navigationClass,
      "далее ❯"
    );
    buttonForwad.addEventListener("click", testNavigationForward);
    navigationBlock.appendChild(buttonForwad);
  }

  if (defaultTestIndex === max - 1) {
    const buttonForwad = createElementWithContent(
      "button",
      navigationClass,
      "завершить"
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
  createElementInList(matrixOfAnswers[defaultTestIndex]);
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
const resetLastResults = () => {
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
  createResultLayout(checkResults(score));
  const resultToState = {
    score,
    timestamp: new Date().toLocaleDateString("en-US")
  };
  setItem("logs", resultToState);
};

/**
 * Старт приложения
 */
initDash();

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
