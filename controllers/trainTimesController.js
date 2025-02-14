import combine_feeds from "./helperFunctions/combineFeeds.js";
import get_stations from "./helperFunctions/getStations.js";

const trainTimesController = {};

// Data will be stored as a dictionary
// Convert the milliseconds to minutes
// Do not want all the data so limit it to trains within 30 minutes away, if no trains then get the earliest train

const feeds = await combine_feeds()
// Get the station information and train times related to each station
trainTimesController.trainStationTimes = (req, res, next) => {
  try{
    let times = []
    for(let entity of feeds){
      times = process_entity(entity, times)
    }
    let station_times = stationTimesHelper(times)
    // console.log("STATION TIMES: ", station_times)
    res.locals.station_times = station_times;
    next();
  }
  catch(err){
    console.error("Error occurred in trainTimesController.js: ", err)
  }
}

const stationTimesHelper = (times) => {
  const stationTimes = []
  const stations = get_stations();
  // console.log("TIMES: ", times)
  for(let station of stations){
    let stationObject = {'station_id': station['station_id'], 'trains': []}
      const stopTimes = times.filter(time => time.stop_id === station['stop_ids']);
      // console.log("STOPTIMES: ", stopTimes);
      for(let time of stopTimes){
        stationObject['trains'].push(time);
      }
    
    stationObject.trains.sort((a, b) => a.time - b.time);
    stationTimes.push(stationObject)
  }
  // console.log(stationTimes);
  return stationTimes;
} 

const process_entity = (entity, times) => {
  if("tripUpdate" in entity){
    if(entity["tripUpdate"] == null){
      return times
    }
    if(entity["tripUpdate"].hasOwnProperty("stopTimeUpdate")){
      const updates = get_updates(entity)
      for(let update of updates){
        times = process_update(entity, update, times)
      }
    }
  }
  return times
}

const process_update = (entity, update, times) => {
  let time_difference = get_time_difference(update)
  let stopId = update['stopId'].substring(0, update['stopId'].length -1);
  if(time_difference != undefined && time_difference > 0 && time_difference < 1800){
    let route_id = get_route_id(entity) 
    let direction = update['stopId'][update['stopId'].length-1]
    times.push({'stop_id': stopId, 'route_id': route_id, 'direction': direction, 'time':time_difference})
  }
  return times
}

const get_time_difference = (update) => {
  let time = new Date();
  // We will be using time since epoch because that is also how the API schedules time
  let time_since_epoch = time/1000;
  if ("arrival" in update){
    if(update["arrival"] == null) return;
    if("time" in update["arrival"]){
      return update["arrival"]["time"] - time_since_epoch;
    }
  }
  else if ("departure" in update && "time" in update["departure"]){
    return update["departure"]["time"] - time_since_epoch;
  }
  else return;
}

const get_updates = (entity) => {
  let updates = entity["tripUpdate"]["stopTimeUpdate"];
  return updates;
}

const get_route_id = (entity) => {
  return entity["tripUpdate"]["trip"]["routeId"];
}

export default trainTimesController