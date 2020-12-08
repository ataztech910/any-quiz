/**
 * Получить элемент из localstorage в виде JSON
 */
const getItem = name => {
  if (!!!localStorage.getItem(name)) {
    localStorage.setItem(name, JSON.stringify([]));
  }
  return JSON.parse(localStorage.getItem(name));
};

/**
 * Добавить элемент в массив в хранилище
 */
const setItem = (name, value) => {
  const state = getItem(name);
  state.unshift(value);
  localStorage.setItem(name, JSON.stringify(state));
};
