import get_stations from "./helperFunctions/getStations.js";

const trainStationsController = {};

trainStationsController.trainStations = async (req, res, next) => {
  try{ 
    res.locals.feeds = await get_stations();
    next();
  }
  catch(err){
    console.error("Error occurred in trainStationsController.js: ", err)
    next(err);
  }
}



export default trainStationsController