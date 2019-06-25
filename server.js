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
// app.get('/getState', (req, res) => {
//   fs.readFile('timers.json', (err, data) => {
//     if (err) throw err;

//     res.send(data);
//   });
// });

let timers = {"timers":[{"title":"a","project":"a","id":"88a30850-bf20-4e5f-add4-955cc695d535","elapsed":157183539,"runningSince":null},{"title":"b","project":"b","id":"75c927ff-a98b-4c97-b23b-339b11c0c29e","elapsed":0,"runningSince":1560160761059},{"title":"c","project":"c","id":"9f2bb1fc-6d41-4699-82a1-331e8f5468f5","elapsed":0,"runningSince":1560160780476}]};

app.get('/getState', (req, res) => {
  fs.readFile('timers.json', (err, data) => {
    if (err) throw err;

    res.send(timers);
  });
});

// app.post('/syncState', (req, res) => {
//   syncState(req.body);
//   fs.readFile('timers.json', (err, data) => {
//     if (err) throw err;

//     res.send(data);
//   });
// });

app.post('/syncState', (req, res) => {
  timers = req.body;
  res.send(timers);
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