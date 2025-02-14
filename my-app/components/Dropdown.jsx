import DropDownPicker from 'react-native-dropdown-picker';
import { Text, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import Time from './Time.jsx';

const Dropdown = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [stops, setStops] = useState([]);
  const [times, setTimes] = useState([]);


  const convertObjToArray = (obj) => {
    let arr= []
      for(let i in obj)
        arr.push([i, obj[i]]);
    return arr;
  };
  
  const processApiObj = (obj) => {
    let arr = convertObjToArray(obj.data)
    arr = arr.map(elmt => elmt[1]);
    return arr;
  };

  const getStopInfo = async (selectedStop) => {
    console.log(`SELECTEDSTOP: ${selectedStop.value}`);
    const url = '/times/' + selectedStop.value;
    let times = await fetch(url).then((response) => { return response.json() });
    times = processApiObj(times);
    times = times[0].trains;

    const routeIds = times.map(time => time.route_id)

    let colors = await fetch('/routes/').then((response) => { return response.json() });
    colors = colors.data;
    
    times = times.map(time => time={...time, color: colors.find(color => color.route_id === time.route_id).color});
    setTimes(times);
  };
  
  useEffect(() => {
    try{
    fetch('http://192.168.1.165:4000/stations').then((response) => response.json())
      .then(stops_list => stops_list.map(
        (stop => {
          return { 
            label: stop.name, 
            value: stop.station_id,
          }
        }
        )
      ))
      // stops is now stored with the labels and values of all stations
      .then(results => {setStops(results)});
    } catch(err){
      console.log("ERROR FETCHING STATION DATA: ", err);
    }
  }, []);

  return (
    <View>
    <DropDownPicker
      open={open}
      value={value}
      items={stops}
      setOpen={setOpen}
      setValue={setValue}
      setItems={setStops}
      onChangeValue={selectedStop => getStopInfo(selectedStop)}
    />
    <Text>STOPS: {stops.length}</Text>
    </View>
  );
};

export default Dropdown;