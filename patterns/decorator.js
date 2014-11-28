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
