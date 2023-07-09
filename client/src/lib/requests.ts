import axios from 'redaxios'

const req = axios.create({
  baseURL: import.meta.env.API_URL || 'http://localhost:3000',
})

export default req
