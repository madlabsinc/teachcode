let text = '{ "name":"John", "age":"39", "city":"New York"}';
let obj = JSON.parse(text, function(key, value) {
  if (key === 'city') {
    return value.toUpperCase();
  } else {
    return value;
  }
});

console.log(obj);
