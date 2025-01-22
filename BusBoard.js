import fetch from 'node-fetch';
import readline from 'readline-sync';

const api_key = process.env.API_KEY

//let busStopCode = "490G00013535"// "490G00013535" 940GZZLUHWE// Remove this hardcoded value for testing
let busStopCode = readline.prompt("Please enter bus stop code:");

const fetchTflBuses = async (busStopCode) => {
        const response = await fetch(`https://api.tfl.gov.uk/StopPoint/${busStopCode}/Arrivals`);
        return(response.json());
}
const busResponse = await fetchTflBuses(busStopCode);
console.log(busResponse.length);
if(busResponse.length > 0)
{
    for(let i =0;i<5;i++)
        {
            console.log(busResponse[i]["destinationName"] +" " 
                +busResponse[i]["vehicleId"]+" " 
                +busResponse[i]["lineName"]+" "
                +busResponse[i]["timeToStation"]    
            ); 
        }        
}
else
{
        console.log("No data present");
}
