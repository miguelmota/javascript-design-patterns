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
