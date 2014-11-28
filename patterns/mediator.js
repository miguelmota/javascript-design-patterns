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
