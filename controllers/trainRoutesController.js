import * as fs from 'fs';
import {parse} from 'csv-parse';

const ROUTES_FILE = "google_transit/routes.csv"
const routes = readCSV(ROUTES_FILE);

function readCSV(file){
  const data = [];
  fs.createReadStream(file)
    .pipe(
      parse({
        delimiter: ",",
        columns: true,
        ltrim: true,
      })
    )
    .on("data", function (row) {
      // This will push the object row into the array
      data.push(row);
    })
    .on("error", function (error) {
      console.log(error.message);
    })
    .on("end", function () {
    });
  return data;
}

const trainRoutesController = {};

trainRoutesController.getRoutes = (req, res, next) => {
  try{
    res.locals.routes = [];
    if(routes === null) routes = "grey";
    for(let route of routes){
      if(route.route_color === null || route.route_color.length === 0) route.route_color = 'grey';
      res.locals.routes.push({'route_id': route.route_id, 'color': route.route_color})
    }
    next();
  }
  catch(err){
    console.error("Error occurred in trainRoutesController.js: ", err);
  }
}

export default trainRoutesController;