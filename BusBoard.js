import fetch from 'node-fetch';
//import prompt from 'prompt-sync';
import readline from 'readline-sync';
//const prompt = require('promp-sync')();
const api_key = process.env.API_KEY

// const fetchTfl = async (api_key) => {
//     const response = await fetch(`https://api.tfl.gov.uk/StopPoint/Mode/bus/Disruption`);
//     return(response);
// }
// const response = await fetchTfl();
// console.log(response);

//let busStopCode = "940GZZLUHWE" // Remove this hardcoded for testing
let busStopCode = readline.prompt("Please enter bus stop code:");

const fetchTflBuses = async (busStopCode) => {
        const response = await fetch(`https://api.tfl.gov.uk/StopPoint/${busStopCode}/Arrivals`);
        return(response.json());
}
const busResponse = await fetchTflBuses(busStopCode);
// console.log(busResponse);

for(let i =0;i<5;i++)
{
    console.log(busResponse[i]["destinationName"] +" " 
        +busResponse[i]["vehicleId"]+" " 
        +busResponse[i]["lineName"]+" "
        +busResponse[i]["timeToStation"]    
    ); //vehicleId lineName timeToStation
}
