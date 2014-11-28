# Design Patterns in JavaScript

Examples of the following patterns:

- [Singleton](http://en.wikipedia.org/wiki/Singleton_pattern)
- [Factory](http://en.wikipedia.org/wiki/Factory_method_pattern)
- [Iterator](http://en.wikipedia.org/wiki/Iterator_pattern)
- [Decorator](http://en.wikipedia.org/wiki/Decorator_pattern)
- [Strategy](http://en.wikipedia.org/wiki/Strategy_pattern)
- [Facade](http://en.wikipedia.org/wiki/Facade_pattern)
- [Mediator](http://en.wikipedia.org/wiki/Mediator_pattern)
- [Observer](http://en.wikipedia.org/wiki/Observer_pattern)

# Singleton

The Singleton pattern returns only one instance of a class.

```javascript
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
```

# Factory

The Factory pattern creates objects from a static method.

```javascript
function RobotMaker() {}

RobotMaker.prototype.fire = function() {
  return  'Firing ' + this.weapon;
};

RobotMaker.factory = function(type) {
  if (typeof RobotMaker[type] !== 'function') {
    throw new TypeError(type + ' does not exist');
  }

  if (typeof RobotMaker[type].prototype.fire !== 'function') {
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
```

# Iterator

The Iterator pattern facilitates access to elements in aggregated data.

```javascript
var aggregator = function(data) {
  var index = 0,
      length = data.length;

  return {
    next: function() {
      var element;
      if (!this.hasNext()) {
        return null;
      }
      element = data[index];
      index += 1;
      return element;
    },
    hasNext: function() {
      return index < length;
    },
    rewind: function() {
      index = 0;
    },
    current: function() {
      return data[index];
    }
  };
};

var agg = aggregator([1,2,3,4,5]);

while (agg.hasNext()) {
  console.log(agg.next()); // 1, 2, 3, 4, 5
}
```

# Decorator

The Decorator patterns adds additional functionality to an object as needed.

```javascript
function Sale(price) {
  this.price = price || 100;
  this.decoratorsList = [];
}

Sale.prototype.getPrice = function() {
  var price = this.price,
      i,
      max = this.decoratorsList.length,
      name;

  for (i = 0; i < max; i += 1) {
    name = this.decoratorsList[i];
    price = Sale.decorators[name].getPrice(price);
  }

  return price;
};

Sale.prototype.decorate = function(decorator) {
  this.decoratorsList.push(decorator);
};

Sale.decorators = {};

Sale.decorators.fedtax = {
  getPrice: function(price) {
    return price + (price * 5 / 100);
  }
};

Sale.decorators.money = {
  getPrice: function(price) {
    return '$' + price.toFixed(2);
  }
};

var sale = new Sale(100);
sale.decorate('fedtax');
sale.decorate('money');

console.log(sale.getPrice()); // $105.00
```

# Strategy

The Strategy pattern selects functionality at runtime depending on context.

```javascript
var validator = {
  types: {},
  messages: [],
  config: {},
  validate: function() {
    var i, msg, type, checker, resultOk;

    this.messages = [];

    for (i in data) {
      if (data.hasOwnProperty(i)) {
        type = this.config[i];
        checker = this.types[type];

        if (!type) continue;

        if (!checker) {
          throw {
            name: 'ValidationError',
            message: 'No handler to validate type ' + type
          };
        }

        resultOk = checker.validate(data[i]);
        if (!resultOk) {
          msg = 'Invalid value for *' + i + '*, ' + checker.instructions;
          this.messages.push(msg);
        }
      }
    }

    return this.hasErrors();
  },
  hasErrors: function() {
    return this.messages.length !== 0;
  }
};

validator.types.isNonEmpty = {
  validate: function(value) {
    return value !== '';
  },
  instructions: 'the value cannot be empty'
};

validator.types.isNumber = {
  validate: function(value) {
    return !isNaN(value);
  },
  instructions: 'the value can only be a valid, e.g. 1, 3.14 or 2010'
};

validator.types.isAlphaNum = {
  validate: function(value) {
    return /^[a-z0-9]$/i.test(value);
  },
  instructions: 'the value can only contain characters and numbers, no special symbols'
};

validator.config = {
  firstName: 'isNonEmpty',
  age: 'isNumber',
  username: 'isAlphaNum'
};

var data = {
  firstName: 'Dexter',
  lastName: 'McPherson',
  age: 'unknown',
  username: '-_-'
};

validator.validate(data);
if (validator.hasErrors()) {
  console.log(validator.messages.join('\n'));
}

// Invalid value for *age*, the value can only be a valid, e.g. 1, 3.14 or 2010
// Invalid value for *username*, the value can only contain characters and numbers, no special symbols
```

# Facade

The Facade pattern provides an alternative interface to an object for convenience.

```javascript
var simplifiedEvent = {
  stop: function(e) {
    if (typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    if (typeof e.stopPropagation === 'function') {
      e.stopPropagation();
    }
    // IE
    if (typeof e.returnValue === 'boolean') {
      e.returnValue = false;
    }
    if (typeof e.cancelBubble === 'boolean') {
      e.cancelBubble = false;
    }
  }
};
```

# Proxy

The Proxy pattern allows one object to act as an interface for another object.

```javascript
function GeoCoder() {
  this.getLatLng = function(address) {
    var coords;

    switch(address) {
      case 'Amsterdam':
        coords = '52.3700° N, 4.8900° E';
        break;
      case 'London':
        coords = '51.5171° N, 0.1062° W';
        break;
      default:
        break;
    }

    return coords;
  };
}

function GeoProxy() {
  var geocoder = new GeoCoder();
  var geocache = {};

  return {
    getLatLng: function(address) {
      if (!geocache[address]) {
          geocache[address] = geocoder.getLatLng(address);
      }
      return geocache[address];
    }
  };
}

var geo = new GeoProxy();

console.log(geo.getLatLng('London')); // 51.5171° N, 0.1062° W
console.log(geo.getLatLng('London')); // 51.5171° N, 0.1062° W (cached)
```

# Mediator

The Mediator pattern promotes loose coupling by having independent objects (colleagues) communicate through a mediator object.

```javascript
function Player(name) {
  this.points = 0;
  this.name = name;
}

Player.prototype.play = function() {
  this.points += 1;
  mediator.played();
};

var scoreboard = {
  results : '',
  update: function(score) {
    var i, msg = '' ;
    for (i in score) {
      if (score.hasOwnProperty(i)) {
        msg += i + ': ' + score[i] + ' ';
      }
    }
    this.results = msg;
    console.log(this.results);
  }
};

var mediator = {
  players: {},
  setup: function() {
    var players = this.players;
    players.home = new Player('Home');
    players.guest = new Player('Guest');
  },
  played: function() {
    var players = this.players,
        score = {
          Home: players.home.points,
          Guest: players.guest.points
        };

    scoreboard.update(score);
  },
  keypress: function(key) {
    // simulate keypress
    if (key === 1) {
      mediator.players.home.play();
      return;
    }
    if (key === 0) {
      mediator.players.guest.play();
      return;
    }
  }
};

mediator.setup();
mediator.keypress(1); // Home: 1 Guest: 0
mediator.keypress(1); // Home: 2 Guest: 0
mediator.keypress(0); // Home: 2 Guest: 1
mediator.keypress(1); // Home: 3 Guest: 1
```


# Observer

The Observer pattern (subscriber/publisher) promotes loose coupling by having objects subscribe to an object's specific activity and receiving notfications.

```javascript
var publisher = {
  subscribers: {
    any: [],
  },
  subscribe: function(fn, type) {
    type = type || 'any';
    if (typeof this.subscribers[type] === 'undefined') {
      this.subscribers[type] = [];
    }
    this.subscribers[type].push(fn);
  },
  unsubscribe: function(fn, type) {
    this.visitSubscribers('unsubscribe', fn, type);
  },
  publish: function(publication, type) {
    this.visitSubscribers('publish', publication, type);
  },
  visitSubscribers: function(action, arg, type) {
    var pubtype = type || 'any',
        subscribers = this.subscribers[pubtype],
        i,
        max = subscribers.length;

    for (i = 0; i < max; i += 1) {
      if (action === 'publish') {
        subscribers[i](arg);
      } else {
        if (subscribers[i] === arg) {
          subscribers.splice(i, 1);
        }
      }
    }
  }
};

function makePublisher(o) {
  var i;
  for (i in publisher) {
    if (publisher.hasOwnProperty(i) && typeof publisher[i] === 'function') {
      o[i] = publisher[i];
    }
  }
  o.subscribers = {any: []};
}

var paper = {
  daily: function() {
    this.publish('big news today');
  },
  monthly: function() {
    this.publish('interesting analysis', 'monthly');
  }
};

makePublisher(paper);

var joe = {
  drinkCoffee: function(paper) {
    console.log('Just read ' + paper);
  },
  sundayPrepNap: function(monthly) {
    console.log('About to fall asleep reading this ' + monthly);
  }
};

paper.subscribe(joe.drinkCoffee);
paper.subscribe(joe.sundayPrepNap, 'monthly');

paper.daily(); // Just read big news today
paper.daily(); // Just read big news today
paper.daily(); // Just read big news today
paper.monthly(); // About to fall asleep reading this interesting analysis

makePublisher(joe);
joe.tweet = function(msg) {
  this.publish(msg);
};

paper.readTweets = function(tweet) {
  console.log('Someone ' + tweet);
};

joe.subscribe(paper.readTweets);
```

# Resources

- [JavaScript Patterns ](http://shop.oreilly.com/product/9780596806767.do)
- [Learning JavaScript Design Patterns](http://addyosmani.com/resources/essentialjsdesignpatterns/book/)

# License

MIT
