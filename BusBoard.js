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
    // return getAPIResponse(`https://api.postcodes.io/postcodes/${postCode}`);
};

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
    const postCode = await getPostCode();
    const busStopResponse = await fetchTflBuses("940GZZLUHWE");// remove hardcoded value
    const coordinates = await getCoordinates(postCode);// remove hardcoded value
    const busInformation = await parseResponse(busStopResponse);
    await logging(busInformation)
    }

busBoardingInfo();