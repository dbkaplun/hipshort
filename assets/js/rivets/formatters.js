rivets.formatters.not = function (value) {
  return !value;
};

rivets.formatters.preventDefault = function (value) {
  return function (evt) {
    evt.preventDefault();
    value.apply(this, arguments);
    return false;
  };
};
