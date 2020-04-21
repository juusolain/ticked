import vue from '@/main'

import net from '@/modules/net'
import store from '@/modules/store'
import router from '@/router'
import auth from '@/modules/auth'

import { ToastProgrammatic as Toast } from 'buefy'

import { v4 as uuidv4 } from 'uuid'

class Backend {
    loadTasks = async () => {
      try {
        const newTasks = await net.getTasks()
        const decryptedTasks = await auth.decryptArray(newTasks, auth.decryptObj)
        store.setTasks(decryptedTasks)
      } catch (err) {
        this.showError(err)
      }
    }

    loadLists = async () => {
      try {
        const newLists = await net.getLists()
        console.log(newLists)
        const decryptedLists = await auth.decryptArray(newLists, auth.decryptObj)
        store.setLists(decryptedLists)
      } catch (err) {
        this.showError(err)
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
        store.addLoading(1)
        // const userData = await net.getUserData()
        // store.setUserData(userData)
        await this.loadTasks()
        await this.loadLists()
        store.setList(null)
        store.setMenuView('allLists')
        store.addLoading(-1)
      } catch (error) {
        this.showError(error)
        store.addLoading(-1)
      }
    }

    deleteAccount = async (password) => {
      try {
        if (password === await auth.getPassword()) {
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
        await net.addTask(encryptedTask)
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
        const encryptedTask = await auth.encryptObj(newList)
        await net.addList(encryptedTask)
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
        const { login, password, email } = user
        if (!login || !password) {
          throw 'error.login.notfilled'
        }
        store.addLoading(1)
        const token = await net.login(login, password)
        store.addLoading(-1)
        if (token !== null) {
          net.setToken(token)
          auth.setPassword(password)
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
        const { username, password, email } = user
        if (!username || !password) throw 'error.register.notfilled'
        store.addLoading(1)
        const token = await net.register(username, password)
        store.addLoading(-1)
        if (token !== null) {
          net.setToken(token)
          auth.setPassword(password)
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
      net.logout()
      store.setTasks([])
      store.setLists([])
      router.push('/')
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
