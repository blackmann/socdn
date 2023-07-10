import axios from 'redaxios'

const ENDPOINT = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const req = axios.create({
  baseURL: ENDPOINT,
})

export default req
export { ENDPOINT }
