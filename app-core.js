/**
 * Получение элемента из DOM по имени, классу или ID
 */
const getElement = elementNameOrClassOrId => {
  return document.querySelector(elementNameOrClassOrId);
};

/**
 * Получение всех элементов из DOM по имени, классу или ID
 */
const getAll = elementNameOrClassOrId => {
  return document.querySelectorAll(elementNameOrClassOrId);
};

/**
 * Создание элемента в DOM с контентом внутри
 */
const createElementWithContent = (
  elementName,
  className = undefined,
  content = undefined,
  dataSetName = undefined,
  dataSetValue = null
) => {
  const element = document.createElement(elementName);
  if (className) {
    element.className = className;
  }
  if (dataSetName) {
    element.dataset[dataSetName] = dataSetValue;
  }
  if (content) {
    element.innerHTML = content;
  }
  return element;
};

/**
 * Создание элемента Progress Bar HTML5
 */
const createProgressBar = (progress, score) => {
  const progressElement = document.createElement("progress");
  progressElement.max = progress;
  progressElement.value = score;
  return progressElement;
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

const testNavigationForward = event => {
  changeIndex(true);
};

const testNavigationBack = event => {
  changeIndex(false);
};

const createNavigationBlock = max => {
  const navigationBlock = createElementWithContent("div", navigationBlockClass);

  if (defaultTestIndex > 0) {
    const buttonBack = createElementWithContent(
      "button",
      navigationClass,
      "назад"
    );
    buttonBack.addEventListener("click", testNavigationBack);
    navigationBlock.appendChild(buttonBack);
  }

  if (defaultTestIndex < max - 1) {
    const buttonForwad = createElementWithContent(
      "button",
      navigationClass,
      "далее"
    );
    buttonForwad.addEventListener("click", testNavigationForward);
    navigationBlock.appendChild(buttonForwad);
  }

  return navigationBlock;
};

const changeIndex = (direction = true) => {
  if (direction && defaultTestIndex < maxTestValue) {
    defaultTestIndex++;
  } else if (!direction && defaultTestIndex > 0) {
    defaultTestIndex--;
  }
  createElementInList(matrixOfAnswers[defaultTestIndex]);
};

const resetIndex = () => {
  defaultTestIndex = 0;
};

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
