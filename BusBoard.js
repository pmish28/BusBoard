import fetch from 'node-fetch';
import readline from 'readline-sync';

const api_key = process.env.API_KEY

//let busStopCode = "490G00013535"// "940GZZLUHWE" // Remove this hardcoded value for testing
const getBusStopCode = async() => {
    
    return readline.prompt("Please enter bus stop code:");
}

const fetchTflBuses = async (busStopCode) => {
    
    const response = await fetch(`https://api.tfl.gov.uk/StopPoint/${busStopCode}/Arrivals`);
    if(response.status !== 200) {
        throw Error(`Status code ${response.status} received.`);
    }
          
    return(response.json());
}

const parseResponse = async(busStopResponse) =>{
    if(busStopResponse.length > 0)
    {
        busStopResponse.sort((a,b)=>a.timeToStation-b.timeToStation);
        let busInformation = [];
        for(let i =0;i<5;i++)
        {
            busInformation.push(
                busStopResponse[i]["destinationName"] +" " +busStopResponse[i]["vehicleId"]+" " 
                +busStopResponse[i]["lineName"]+" " +busStopResponse[i]["timeToStation"]);
        } 
        return busInformation.join('\n');       
    }
    else
    {
         return "No data present";
    }        
}

const logging = async(busInformation) =>{
    console.log(busInformation);
}

const busBoardingInfo = async() =>{
    const busStopCode = await getBusStopCode();
    const busStopResponse = await fetchTflBuses(busStopCode);
    const busInformation = await parseResponse(busStopResponse);
    await logging(busInformation)
    }


busBoardingInfo();


