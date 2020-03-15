import ElectronStore from 'electron-store'
import jwtDecode from 'jwt-decode'
import axios from 'axios'

import state from '@/modules/state'

const store = new ElectronStore()

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
          store.set('token', res.data.token)
          return {
            success: true
          }
        } else {
          store.set('token', null)
          return {
            success: false,
            error: 'Invalid username or password'
          }
        }
      } catch (err) {
        return {
          success: false,
          error: err
        }
      }
    } else {
      return {
        success: false,
        error: 'Please supply both username and password'
      }
    }
  };

  getToken = () => {
    return store.get('token')
  };

  setToken = newToken => {
    return store.set('token', newToken)
  };

  isLoggedIn = () => {
    const token = this.getToken()
    if (token && !this.isExpired(token)) {
      return true
    } else {
      return false
    }
  };

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

  getLists = async () => {
    state.addLoading(1)
    const res = await this.post('/getLists')
    state.addLoading(-1)
    if (res.data.success) {
      state.setLists(res.data.lists)
      return true
    } else {
      throw res.data.error
    }
  };

  getTasks = async () => {
    state.addLoading(1)
    const res = await this.post('/getTask/all', {
      data: {
        listid: state.state.list
      }
    })
    state.addLoading(-1)
    if (res.data.success) {
      state.setTasks(res.data.tasks)
      return true
    } else {
      throw res.data.error
    }
  };
}

export default new Net()
