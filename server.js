const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

const fs = require("fs");
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const cors = require('cors')

app.use(cors());

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));

// create a GET route
app.get('/getState', (req, res) => {
  fs.readFile('timers.json', (err, data) => {
    if (err) throw err;

    res.send(data);
  });
});

app.post('/syncState', (req, res) => {
  syncState(req.body);
  fs.readFile('timers.json', (err, data) => {
    if (err) throw err;

    res.send(data);
  });
});

const syncState = (state) => {
  if (fs.existsSync('timers.json')) {
    fs.truncateSync('timers.json', 0, () => {
      console.log('done deleting content')
    });
  }

  fs.writeFileSync('timers.json', JSON.stringify(state), (err) => {
    if (err) {
      throw err;
    } else {
      console.log("updated state");
    }
  });
}