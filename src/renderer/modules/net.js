import ElectronStore from 'electron-store'
import jwtDecode from 'jwt-decode'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import * as errors from '@/modules/errors'

import store from '@/modules/store'

const electronstore = new ElectronStore()

console.log(process.env.server)

const server = process.env.server || (process.env.NODE_ENV === 'development'
  ? 'http://localhost/'
  : 'https://server.ticked.jusola.xyz/')

class Net {
  constructor () {
    this.server = server
    console.log(`New auth created with server ${this.server}`)
  }

  login = async (username, password) => {
    if (username && password) {
      var res
      try {
        res = await this.post('/login', {
          data: {
            username: username,
            password: password
          }
        })
      } catch (err) {
        console.error(err)
        throw 'error.neterror'
      }
      if (res.data.success) {
        return res.data.token
      } else {
        throw res.data.err
      }
    } else {
      throw 'error.login.invalidquery'
    }
  };

  register = async (username, password) => {
    if (username && password) {
      var res
      try {
        res = await this.post('/register', {
          data: {
            username: username,
            password: password
          }
        })
      } catch (err) {
        console.error(err)
        throw 'error.neterror'
      }
      if (res.data.success) {
        return res.data.token
      } else {
        throw res.data.err
      }
    } else {
      throw 'error.login.invalidquery'
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

  getUserID = () => {
    const token = this.getToken()
    const decodedJWT = jwtDecode(token)
    return decodedJWT.userid
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
      headers.Authorization = 'Bearer ' + this.getToken()
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
      console.error(error)
      throw 'error.neterror'
    }
  };

  get = async (apiAddress, options) => {
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
    if (this.isLoggedIn()) {
      headers.Authorization = 'Bearer ' + this.getToken()
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
      console.error(error)
      throw 'error.neterror'
    }
  };

  updateTask = async newTask => {
    var res
    try {
      res = await this.post('/updateTask', {
        data: newTask
      })
    } catch (error) {
      console.error(error)
      throw 'error.neterror'
    }
    if (res.data.success) {
      return true
    } else {
      throw res.data.err
    }
  };

  addTask = async (newTask) => {
    var res
    try {
      res = await this.post('/newTask', {
        data: newTask
      })
    } catch (error) {
      console.error(error)
      throw 'error.neterror'
    }
    if (res.data.success) {
      return true
    } else {
      throw res.data.err
    }
  };

  addList = async (newList) => {
    var res
    try {
      res = await this.post('/newList', {
        data: newList
      })
    } catch (error) {
      console.error(error)
      throw 'error.neterror'
    }
    if (res.data.success) {
      return true
    } else {
      throw res.data.err
    }
  };

  getUserData = async () => {
    var res
    try {
      res = await this.post('/getUserData')
    } catch (error) {
      console.error(error)
      throw 'error.neterror'
    }
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
      throw res.data.err
    }
  };

  getTasks = async () => {
    const res = await this.post('/getTask/all')
    if (res.data.success) {
      return res.data.tasks
    } else {
      throw res.data.err
    }
  };

  deleteAccount = async () => {
    var res
    try {
      res = await this.post('/deleteAccount')
    } catch (error) {
      throw 'err.neterror'
    }
    if (res.data.success) {
      return true
    } else {
      throw res.data.err
    }
  }
}

export default new Net()
