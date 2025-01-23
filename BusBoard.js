import fetch from 'node-fetch';
import readline from 'readline-sync';

const api_key = process.env.API_KEY

//let busStopCode = "490G00013535"// "940GZZLUHWE" // Remove this hardcoded value for testing
const getBusStopCode = async() => {
    return readline.prompt("Please enter bus stop code:");
}
const fetchTflBuses = async (busStopCode) => {
    const response = await fetch(`https://api.tfl.gov.uk/StopPoint/${busStopCode}/Arrivals`);
    return(response.json());
}

const parseResponse = async(busStopResponse) =>{
    if(busStopResponse.length > 0)
        {
            //console.log(typeof busStopResponse);
                busStopResponse.sort((a,b)=>a.timeToStation-b.timeToStation);
            for(let i =0;i<5;i++)
                {
                    console.log(busStopResponse[i]["destinationName"] +" " 
                        +busStopResponse[i]["vehicleId"]+" " 
                        +busStopResponse[i]["lineName"]+" "
                        +busStopResponse[i]["timeToStation"]    
                    ); 
                }        
        }
        else
        {
                console.log("No data present");
        }        
}


const busStopCode = await getBusStopCode();
const busStopResponse = await fetchTflBuses(busStopCode);
await parseResponse(busStopResponse);
