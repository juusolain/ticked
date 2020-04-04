import ElectronStore from 'electron-store'
import jwtDecode from 'jwt-decode'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'

import store from '@/modules/store'

const electronstore = new ElectronStore()

const server = process.env.NODE_ENV === 'development'
  ? 'http://localhost:5000/'
  : 'https://ticked-server.herokuapp.com/'

class Net {
  constructor () {
    this.server = server
    console.log(`New auth created with server ${this.server}`)
  }

  login = async (username, password) => {
    if (username && password) {
      try {
        const res = await this.post('/login', {
          data: {
            username: username,
            password: password
          }
        })
        if (res.data.success) {
          return res.data.token
        } else {
          return null
        }
      } catch (err) {
        throw new Error('netError')
      }
    } else {
      throw new Error('invalidQuery')
    }
  };

  getToken = () => {
    return electronstore.get('token')
  };

  setToken = newToken => {
    return electronstore.set('token', newToken)
  };

  isLoggedIn = () => {
    const token = this.getToken()
    if (token && !this.isExpired(token)) {
      return true
    } else {
      return false
    }
  };

  getDeviceID = () => {
    var deviceID = electronstore.get('deviceid')
    if (deviceID === null) {
      deviceID = uuidv4()
      electronstore.set('deviceid', deviceID)
    }
    return deviceID
  }

  logout = () => {
    this.setToken(null)
    return true
  };

  isExpired = token => {
    const decodedJWT = jwtDecode(token)
    if (decodedJWT.exp < Date.now() / 1000) {
      return true
    } else {
      return false
    }
  };

  post = async (apiAddress, options) => {
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
    if (this.isLoggedIn()) {
      headers['Authorization'] = 'Bearer ' + this.getToken()
    }
    try {
      const res = await axios({
        baseURL: this.server,
        method: 'post',
        url: apiAddress,
        headers: headers,
        ...options
      })
      return res
    } catch (error) {
      return Promise.reject(error)
    }
  };

  get = async (apiAddress, options) => {
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
    if (this.isLoggedIn()) {
      headers['Authorization'] = 'Bearer ' + this.getToken()
    }
    try {
      const res = await axios({
        baseURL: this.server,
        method: 'get',
        url: apiAddress,
        headers: headers,
        ...options
      })
      return res
    } catch (error) {
      return Promise.reject(error)
    }
  };

  updateTask = async newTask => {
    console.log(newTask)
  };

  addTask = async (name) => {
    const taskid = uuidv4()
    const listid = store.state.list
    const newTask = {
      name: name,
      listid: listid,
      taskid: taskid
    }
    await this.post('/newTask', {
      data: newTask
    })
  };

  getUserData = async () => {
    const res = await this.post('/getUserData')
    if (res.data.success) {
      return res.data
    } else {
      throw res.data.error
    }
  }

  getLists = async () => {
    const res = await this.post('/getLists')
    if (res.data.success) {
      return res.data.lists
    } else {
      throw res.data.error
    }
  };

  getTasks = async () => {
    const res = await this.post('/getTask/all')
    if (res.data.success) {
      return res.data.tasks
    } else {
      throw res.data.error
    }
  };

  sendKey = async (key) => {
    const res = await this.post('/sendKey', {
      data: {
        key: key
      }
    })
  }

  fetchKey = async () => {
    const res = await this.post('/getKey')
    return res.data.key
  }
}

export default new Net()
