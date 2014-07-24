rivets.formatters.not = function (value) {
  return !value;
};

rivets.formatters.preventDefault = function (fn) {
  return function (evt) {
    evt.preventDefault();
    fn.apply(this, arguments);
    return false;
  };
};
