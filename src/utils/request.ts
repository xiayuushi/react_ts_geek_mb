import axios from 'axios'

const instance = axios.create({
  baseURL: process.env.REACT_APP_URL
})

instance.interceptors.request.use(config => {
  return config
}, error => {
  Promise.reject(error)
})

instance.interceptors.response.use(response => {
  return response
}, error => {
  Promise.reject(error)
})

export default instance