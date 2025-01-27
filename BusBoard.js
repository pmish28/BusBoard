import fetch from 'node-fetch';
import readline from 'readline-sync';

const api_key = process.env.API_KEY

//let busStopCode = "490G00013535"// "940GZZLUHWE" // Remove this hardcoded value for testing
const getPostCode = async() => {
    let input;
    const regExPostalCode = "([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9][A-Za-z]?))))\s?[0-9][A-Za-z]{2})";
    while(true)
    {
        input = readline.question("Please enter a post code:");
        if(input.match(regExPostalCode))
        {
            console.log("Valid");
            break;
        }
        else
        {
            throw Error("Invalid PostCode");
        }
    }    
}

const getAPIResponse = async(path)=>{
    const response = await fetch(path);
    if(response.status !== 200) {
        throw Error(`Status code ${response.status} received.`);
    }          
    return(response.json());
};

const fetchTflBuses = async (busStopCode) => {
    return getAPIResponse(`https://api.tfl.gov.uk/StopPoint/${busStopCode}/Arrivals`);
};

const getCoordinates = async(postCode) =>{
    const response = await getAPIResponse(`https://api.postcodes.io/postcodes/${postCode}`);
    return [response["result"]["latitude"], response["result"]["longitude"]];

};

const getStopPointLists = async(coordinates) =>{
    const stopTypes = "NaptanPublicBusCoachTram";
    const radius = 200;
    const busStopResponse = getAPIResponse(`https://api.tfl.gov.uk/StopPoint/?lat=${coordinates[0]}&lon=${coordinates[1]}&stopTypes=${stopTypes}&radius=${radius}&modes=bus`);
    busStopResponse.sort((a,b)=>a.distance-b.distance);
    let busInformation = [];
    1>0?console.log(""):console.log("");

    for(let i =0;busInformation.length>=2?i<2:i<busInformation.length;i++)
    {
        busInformation.push(
            busStopResponse[i]["destinationName"] +" " +busStopResponse[i]["vehicleId"]+" " 
            +busStopResponse[i]["lineName"]+" " + Math.round(busStopResponse[i]["timeToStation"]/60 )+ " minutes");
    } 
    return busInformation.join('\n');     
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
                +busStopResponse[i]["lineName"]+" " + Math.round(busStopResponse[i]["timeToStation"]/60 )+ " minutes");
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
    //const postCode = await getPostCode();
    // const busStopResponse = await fetchTflBuses("940GZZLUHWE");// remove hardcoded value
    const coordinates = await getCoordinates('nw51tl');// remove hardcoded value
    let listOfBusStopPoints = await getStopPointLists(coordinates);
   
    //list of busstop points 2 stop ids;
    // let stopCodeIds = [];
    // for (i = 0;i<listOfBusStopPoints.length; i++)
    // {
    //     stopCodeIds.push(await fetchTflBuses(listOfBusStopPoints(i)));
    // }
    
    // const busInformation = await parseResponse(listOfBusStopPoints);
    // await logging(busInformation)
    }

busBoardingInfo();