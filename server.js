var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var app = express()

var apiKey = '762e3496ca09b07fc2e5a5f4c8a0ac1b';

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')
var provinces = {};

app.get('/', function (req, res) {
  request('https://apis.datos.gob.ar/georef/api/provincias', function(err,response,data){
  provinces = JSON.parse(data) 
  res.render('index', {weather: null, error: null, provinces: provinces});
  })
})

app.post('/', function (req, res) {
  var city = JSON.parse(req.body.city);
  var lat = city.lat;
  var lon = city.lon;
  // var url = `https://api.openweathermap.org/data/2.5/find?q=${city}&units=metric&appid=${apiKey}`
  var url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  request(url, function (err, response, data) {
    if(err){
      res.render('index', {weather: null, error: err, provinces: provinces});
    } else {
      //console.log(data)
      var weather = JSON.parse(data);

      if(weather.cod != 200){
        res.render('index', {weather: null, error: 'Error, please try again', provinces: provinces});
      } else {
        //var w = weather.list[0];
        //console.log(w)
        var weatherText = `It's ${weather.main.temp} degrees in ${weather.name}!`;
        res.render('index', {weather: weatherText, error: null, provinces: provinces});
      }
    }
  });
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
