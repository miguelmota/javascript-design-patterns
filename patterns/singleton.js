var Universe = (function() {
  var instance;

  Universe = function Universe() {
    if (instance) return instance;

    instance = this;

    instance.bang = 'big';
  };

  return Universe;

})();

var universe1 = new Universe();
var universe2 = new Universe();

console.log('Is equal', universe1 === universe2);
