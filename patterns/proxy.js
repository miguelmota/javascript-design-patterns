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
