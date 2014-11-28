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
