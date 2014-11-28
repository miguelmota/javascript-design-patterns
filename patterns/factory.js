function RobotMaker() {}

RobotMaker.prototype.fire = function() {
  return  'Firing ' + this.weapon;
};

RobotMaker.factory = function(type) {
  if (typeof RobotMaker[type] !== 'function') {
    throw new TypeError(type + ' does not exist');
  }

  if (typeof RobotMaker[type].prototype.drive !== 'function') {
    RobotMaker[type].prototype = new RobotMaker();
  }

  return new RobotMaker[type]();
};

RobotMaker.Cyborg = function() {
  this.weapon = 'Laser';
};

RobotMaker.Humanoid = function() {
  this.weapon = 'Machine Gun';
};

var cyborg = RobotMaker.factory('Cyborg');
var humanoid  = RobotMaker.factory('Humanoid');

console.log(cyborg.fire()); // Firing Laser
console.log(humanoid.fire()); // Firing Machine Gun
