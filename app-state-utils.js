const getItem = name => {
  if (!!!localStorage.getItem(name)) {
    localStorage.setItem(name, JSON.stringify([]));
  }
  return JSON.parse(localStorage.getItem(name));
};

const setItem = (name, value) => {
  const state = getItem(name);
  state.push(value);
  localStorage.setItem(name, JSON.stringify(state));
};
