import vue from '@/main'

import net from '@/modules/net'
import store from '@/modules/store'
import router from '@/router'
import auth from '@/modules/auth'
import database from '@/modules/database'
import payments from '@/modules/payments'

import { ToastProgrammatic as Toast, ModalProgrammatic as Modal } from 'buefy'

import { v4 as uuidv4 } from 'uuid'

class Backend {
  constructor () {
    payments.init()
    this.warnConsolePasting()
  }

  warnConsolePasting = () => {
    console.warn('%cSTOP!', 'color:#000;background-color:#faa;font-size:20em')
    console.warn('%cThe developer tools are intended for developers. If you have been told by someone to paste or type anything here, there is a 200% chance that they\'re trying to scam you.', 'color: #000; font-size:x-large;')
    console.warn('%cTo stay safe, close this side-bar. ', 'color:#000;font-size:xx-large;')
    console.warn('%cIf you want to learn more, visit https://en.wikipedia.org/wiki/Self-XSS', 'color: #6; font-size:large;')
  }

  loadTasks = async () => {
    try {
      const newTasks = await database.getTasks()
      const decryptedTasks = await auth.decryptArray(newTasks, null, auth.decryptObj)
      store.setTasks(decryptedTasks)
    } catch (err) {
      console.warn(err)
      this.showError(err)
    }
  }

  loadLists = async () => {
    try {
      const newLists = await database.getLists()
      const decryptedLists = await auth.decryptArray(newLists, null, auth.decryptObj)
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

  initialLoad = async (mainRef) => {
    try {
      if (store.getMode() === 'local') {
        store.addLoading(1)
        if (auth.getEncryptionKey() === null) {
          await auth.createEncryptionKey()
        }
      } else {
        store.addLoading(1)
      }

      await database.sync()

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

  deleteTask = async (taskToDelete) => {
    try {
      store.removeTask(taskToDelete)
      const encryptedTask = await auth.encryptObj(taskToDelete)
      await database.deleteTask(taskToDelete, true)
    } catch (err) {
      store.addTask(taskToDelete)
      this.showError(err)
    }
  }

  deleteList = async (listToDelete) => {
    try {
      store.removeList(listToDelete)
      const encryptedList = await auth.encryptObj(listToDelete)
      await database.deleteList(listToDelete, true)
    } catch (err) {
      store.addList(listToDelete)
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
      store.viewBack()
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
      const { salt, serverEphemeralPublic } = await net.loginSalt(username, clientEphemeralPublic)
      const clientSessionProof = await auth.createSession(username, password, salt, serverEphemeralPublic)
      const { token, key } = await net.loginToken(username, clientSessionProof) // serverSessionProof

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
      const { salt, verifier } = await auth.createVerifier(username, password)
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

  paymentPortal = async () => {
    try {
      const url = await net.getPaymentPortal()
      payments.goToPortal(url)
    } catch (error) {
      console.warn(error)
      this.showError(error)
    }
  }

  checkout = async () => {
    try {
      const session = await net.getCheckout()
      payments.goToCheckout(session)
    } catch (error) {
      console.warn(error)
      this.showError(error)
    }
  }

  migrate = async (from) => {
    if (from === 'local') {
      // get old tasks
      const oldTasks = await database.getTasks('local')
      // reencrypt tasks with current key
      var newTasks = await auth.reencrypt('local', net.getUserID(), oldTasks, auth.encryptArray, auth.decryptArray)

      // replace userid with new
      newTasks = this.replaceArrayUserID(newTasks, net.getUserID())

      // same with lists
      const oldLists = await database.getLists('local')
      var newLists = await auth.reencrypt('local', net.getUserID(), oldLists, auth.encryptArray, auth.decryptArray)

      newLists = this.replaceArrayUserID(newLists, net.getUserID())

      await database.putArray(newTasks, 'tasks')
      await database.putArray(newLists, 'lists')

      await database.sync()
      await this.initialLoad()
    }
  }

  replaceArrayUserID = (array, newUserID) => {
    const newArray = []
    array.forEach(element => {
      element.userid = newUserID
      newArray.push(element)
    })
    return newArray
  }
}

export default new Backend()
