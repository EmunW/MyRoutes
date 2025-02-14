import GtfsRealtimeBindings from "gtfs-realtime-bindings";

export default async function combine_feeds() {
  const schedule = {};
  schedule.ACE = "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-ace";
  schedule.BDFM = "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-bdfm";
  schedule.G = "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-g";
  schedule.JZ = "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-jz";
  schedule.NQRW = "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-nqrw";
  schedule.L = "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-l";
  schedule.Numbers = "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs";
  schedule.Sir = "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-si"

  const feeds = [];
  for(const URL of Object.values(schedule)){
    const entity = await GtfsToJson(URL);
    feeds.push(entity.entity);
  }
  // console.log(feeds.flat())
  return feeds.flat();
}

const GtfsToJson = (async (URL) => {
  try {
    const response = await fetch(URL)
    if (!response.ok) {
      const error = new Error(`${response.url}: ${response.status} ${response.statusText}`);
      error.response = response;
      throw error;
      process.exit(1);
    }
    const buffer = await response.arrayBuffer();
    const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(
      new Uint8Array(buffer)
    );
    // console.log(feed.entity[0])
    return feed;
  }
  catch (error) {
    console.log("ERROR with GtfsToJson: ", error);
    process.exit(1);
  }
});