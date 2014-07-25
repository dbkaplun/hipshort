Vue.options.filters.preventDefault = function (fn) {
  return function (evt) {
    evt.preventDefault();
    if (typeof fn === 'function') fn.apply(this, arguments);
    return false;
  };
};
