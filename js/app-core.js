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
  dataSetValue = null,
  selected = false
) => {
  const element = document.createElement(elementName);
  if (className) {
    element.className = className;
  }
  if (selected) {
    element.classList.add("selected");
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

