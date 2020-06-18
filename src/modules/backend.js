import vue from '@/main'

import net from '@/modules/net'
import store from '@/modules/store'
import router from '@/router'
import auth from '@/modules/auth'
import database from '@/modules/database'

// import {loadStripe} from '@stripe/stripe-js'

import { ToastProgrammatic as Toast } from 'buefy'

import { v4 as uuidv4 } from 'uuid'

class Backend {
  constructor () {
    this.init()
  }

  init = async () => {
    // this.stripe = await loadStripe('pk_test_9PEe48tGkcyxICp3juCtFr3M00fFSbjMnc')
  }

  loadTasks = async () => {
    try {
      const newTasks = await database.getTasks()
      const decryptedTasks = await auth.decryptArray(newTasks, auth.decryptObj)
      store.setTasks(decryptedTasks)
    } catch (err) {
      console.warn(err)
      this.showError(err)
    }
  }

  loadLists = async () => {
    try {
      const newLists = await database.getLists()
      const decryptedLists = await auth.decryptArray(newLists, auth.decryptObj)
      store.setLists(decryptedLists)
    } catch (err) {
      console.warn(err)
      this.showError(err)
    }
  }

  newSubscription = async () => {
    const token = await net.getNewSubscription()
    const res = await this.stripe.redirectToCheckout({
      sessionId: token
    })
    console.log(res)
    if (res.error) {
      console.log(res.error)
      this.showError('error.payments')
    }
  }

  sendKey = async () => {
    console.log('Sending key')
    const res = await auth.sendKey()
    return res
  }

  fetchKey = async (code) => {
    console.log('Getting key')
    const res = await auth.fetchKey(code)
    router.push('/')
    return res
  }

  syncTasks = async () => {
    await this.loadTasks()
  }

  initialLoad = async () => {
    try {
      await database.init()
      await database.sync()
      store.addLoading(1)
      // const userData = await net.getUserData()
      // store.setUserData(userData)
      await this.loadTasks()
      await this.loadLists()
      store.setList(null)
      store.setMenuView('allLists')
      store.setView('tasks')
      store.addLoading(-1)
    } catch (error) {
      this.showError(error)
      store.addLoading(-1)
    }
  }

  deleteAccount = async (password) => {
    try {
      if (typeof password === 'string') { // TODO: Check with server
        await net.deleteAccount()
        this.logout()
      } else {
        throw 'err.deleteAccount.invalidpassword'
      }
    } catch (error) {
      this.showError(error)
    }
  }

  newTask = async (newTask) => {
    try {
      newTask.taskid = uuidv4()
      newTask.listid = store.state.list
      newTask.userid = net.getUserID()
      store.addTask(newTask)
      const encryptedTask = await auth.encryptObj(newTask)
      await database.addTask(encryptedTask, true)
    } catch (err) {
      store.removeTask(newTask)
      this.showError(err)
    }
  }

  updateTask = async (newTask) => {
    try {
      const encryptedTask = await auth.encryptObj(newTask)
      await database.updateTask(encryptedTask, true)
    } catch (err) {
      store.removeTask(newTask)
      this.showError(err)
    }
  }

  newList = async (newList) => {
    try {
      newList.listid = uuidv4()
      newList.userid = net.getUserID()
      store.addList(newList)
      store.setList(newList.listid)
      store.setMenuView(newList.listid)
      store.setView('tasks')
      const encryptedList = await auth.encryptObj(newList)
      await database.addList(encryptedList, true)
    } catch (err) {
      this.showError(err)
      store.removeList(newList)
      store.backMenuView()
    }
  }

  setList = async (newList) => {
    store.setList(newList)
  }

  login = async (user) => {
    try {
      const { username, password } = user
      if (!username || !password) {
        throw 'error.login.notfilled'
      }
      store.addLoading(1)
      const clientEphemeralPublic = await auth.createEphemeral()
      const {salt, serverEphemeralPublic} = await net.loginSalt(username, clientEphemeralPublic)
      const clientSessionProof = await auth.createSession(username, password, salt, serverEphemeralPublic)
      const {token, key} = await net.loginToken(username, clientSessionProof) // serverSessionProof
      store.addLoading(-1)
      if (token !== null) {
        net.setToken(token)
        await auth.setEncryptionKeyWithPass(password, key)
        router.push('/')
      } else {
        this.showError('error.login.notoken')
      }
    } catch (err) {
      this.showError(err)
      store.addLoading(-1)
    }
  }

  register = async (user) => {
    try {
      const { username, password } = user
      if (!username || !password) throw 'error.register.notfilled'
      store.addLoading(1)
      const {salt, verifier} = await auth.createVerifier(username, password)
      const token = await net.register(username, salt, verifier)
      store.addLoading(-1)
      if (token !== null) {
        net.setToken(token)
        await auth.createEncryptionKey()
        const key = await auth.getEncryptionKeyWithPass(password)
        await net.sendKey(key)
        router.push('/')
      } else {
        this.showError('error.register.notoken')
      }
    } catch (err) {
      this.showError(err)
      store.addLoading(-1)
    }
  }

  logout = async () => {
    net.logout() // clear user token
    store.setTasks([]) // clear data from memory
    store.setLists([])
    router.push('/') // go to login
  }

  showError = (error) => {
    error = error.toString()
    const msg = vue.$t(error)
    Toast.open({
      message: msg,
      type: 'is-danger',
      duration: 5000,
      queue: false
    })
  }
}

export default new Backend()
