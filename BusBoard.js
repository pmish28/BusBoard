import fetch from 'node-fetch';

const api_key = process.env.API_KEY

const fetchTfl = async (api_key) => {
    const response = await fetch(`https://api.tfl.gov.uk/StopPoint/Mode/bus/Disruption`);
    return(response.status);
}

console.log(api_key);
const response = await fetchTfl(api_key);
console.log(response);
