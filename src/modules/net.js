import jwtDecode from 'jwt-decode'
import axios from 'axios'

const server = process.env.API_SERVER | 'https://api.ticked.jusola.xyz/'

class Net {
  constructor () {
    this.server = server
    console.log(`Created networking with server ${this.server}`)
  }

  loginSalt = async (username, clientEphemeralPublic) => {
    if (username && clientEphemeralPublic) {
      var res
      try {
        res = await this.post('/login/salt', {
          data: {
            username: username,
            clientEphemeralPublic: clientEphemeralPublic
          }
        })
      } catch (err) {
        console.error(err)
        throw 'error.neterror'
      }
      if (res.data.success) {
        return res.data
      } else {
        throw res.data.err
      }
    } else {
      throw 'error.login.invalidquery'
    }
  }

  loginToken = async (username, clientSessionProof) => {
    if (username && clientSessionProof) {
      var res
      try {
        res = await this.post('/login/token', {
          data: {
            username: username,
            clientSessionProof: clientSessionProof
          }
        })
      } catch (err) {
        console.error(err)
        throw 'error.neterror'
      }
      if (res.data.success) {
        return res.data
      } else {
        throw res.data.err
      }
    } else {
      throw 'error.login.invalidquery'
    }
  }

  register = async (username, salt, verifier) => {
    if (username && salt && verifier) {
      var res
      try {
        res = await this.post('/register', {
          data: {
            username,
            salt,
            verifier
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
  }

  getToken = () => {
    return localStorage.getItem('token')
  }

  setToken = newToken => {
    if (newToken) {
      return localStorage.setItem('token', newToken)
    } else {
      return localStorage.removeItem('token')
    }
  }

  isLoggedIn = () => {
    const token = this.getToken()
    if (token && !this.isExpired(token)) {
      return true
    } else {
      return false
    }
  }

  getUserID = () => {
    const token = this.getToken()
    const decodedJWT = jwtDecode(token)
    return decodedJWT.userid
  }

  logout = () => {
    this.setToken(null)
    return true
  }

  isExpired = token => {
    const decodedJWT = jwtDecode(token)
    return decodedJWT.exp < Date.now() / 1000
  }

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
  }

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
  }

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
  }

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
  }

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
  }

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
  }

  getTasks = async () => {
    const res = await this.post('/getTask/all')
    if (res.data.success) {
      return res.data.tasks
    } else {
      throw res.data.err
    }
  }

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

  getCheckout = async () => {
    var res
    try {
      res = await this.get('/newSubscription')
    } catch (error) {
      throw 'err.neterror'
    }
    if (res.data.success) {
      return res.data.token
    } else {
      throw res.data.err
    }
  }

  getPaymentPortal = async () => {
    var res
    try {
      res = await this.get('/manageSubscription')
    } catch (error) {
      throw 'err.neterror'
    }
    if (res.data.success) {
      return res.data.url
    } else {
      throw res.data.err
    }
  }

  sendKey = async (key) => {
    if (key) {
      var res
      try {
        res = await this.post('/datakey/set', {
          data: {
            key
          }
        })
      } catch (err) {
        console.error(err)
        throw 'error.neterror'
      }
      if (!res.data.success) {
        throw res.data.error
      }
    } else {
      throw 'error.sendkey.invalidquery'
    }
  }
}

export default new Net()
