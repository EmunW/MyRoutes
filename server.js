import express from 'express'
import trainStationsController from './controllers/trainStationsController.js';
import trainTimesController from './controllers/trainTimesController.js';
import trainRoutesController from './controllers/trainRoutesController.js';

const port = process.env.PORT || 4000;

const app = express();

app.post("test", (req, res) =>{
  trainStationsController(req, res);
  res.status(200).send("GOOD");
})

app.get("/", (req, res) => {
  res.status(200).send("EXPRESS SERVER WORKING")
})

app.get("/stations", trainStationsController.trainStations, (req, res) => {
  res.status(200).json(res.locals.feeds)
})

app.get("/stations/:station_id", trainStationsController.trainStations, (req, res) => {
  let station_id = res.locals.feeds;
  res.status(200).json(station_id[req.params.station_id])
})

app.get("/times", trainTimesController.trainStationTimes, (req, res) => {
  res.status(200).send(res.locals.station_times)
})

app.get("/times/:station_id", trainTimesController.trainStationTimes, (req, res) => {
  let station_times = res.locals.station_times
  res.status(200).send(station_times[req.params.station_id])
})

app.get("/routes", trainRoutesController.getRoutes, (req, res) => {
  res.status(200).send(res.locals.routes);
})

app.listen(port, () =>{
  console.log(`Server is running on port ${port}`)
})