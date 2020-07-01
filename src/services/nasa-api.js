import axios from 'axios'

const apiURL = process.env.API_ADRESS || "https://api.nasa.gov/"

//https://api.nasa.gov/planetary/apod?api_key=1TwfM7IWv7Q4TkmKBCgUNmJrVEg8BHi9RKUVwQpe

const api = axios.create({ baseURL: apiURL })

var currentToken = "1TwfM7IWv7Q4TkmKBCgUNmJrVEg8BHi9RKUVwQpe"

api.defaults.headers.commom = { 'Authorization': `Bearer ${currentToken}` }

export default api