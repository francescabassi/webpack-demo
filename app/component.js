// var styles = require('./main.css');

module.exports = function () {
  var element = document.createElement('h1');

  element.innerHTML = 'Hello world!!!!';
  // element.className = 'redButton';
  element.className = 'pure-button';
  return element;
};
