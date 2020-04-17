import net from '@/modules/net'
import store from '@/modules/store'
import router from '@/router'
import auth from '@/modules/auth'

import { v4 as uuidv4 } from 'uuid'

class Backend {
    loadTasks = async () => {
      try {
        const newTasks = await net.getTasks()
        const decryptedTasks = await auth.decryptArray(newTasks, auth.decryptObj)
        store.setTasks(decryptedTasks)
      } catch (err) {
        console.error(err)
      }
    }

    loadLists = async () => {
      try {
        const newLists = await net.getLists()
        const decryptedLists = await auth.decryptArray(newLists, auth.decryptObj)
        store.setLists(decryptedLists)
      } catch (err) {
        console.error(err)
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
      store.addLoading(1)
      const userData = await net.getUserData()
      store.setUserData(userData)
      await this.loadTasks()
      await this.loadLists()
      store.addLoading(-1)
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
        console.error(err)
      }
    }

    setList = async (newList) => {
      store.setList(newList)
    }

    login = async (username, password) => {
      try {
        store.addLoading(1)
        const token = await net.login(username, password)
        store.addLoading(-1)
        if (token !== null) {
          net.setToken(token)
          auth.setPassword(password)
          router.push('/')
          return null
        } else {
          return 'Supply both username and a password'
        }
      } catch (err) {
        store.addLoading(-1)
        return err.toString()
      }
    }

    register = async (username, password) => {
      try {
        store.addLoading(1)
        const token = await net.register(username, password)
        store.addLoading(-1)
        if (token !== null) {
          net.setToken(token)
          auth.setPassword(password)
          router.push('/')
          return null
        } else {
          return 'Supply both username and a password'
        }
      } catch (err) {
        store.addLoading(-1)
        return err.toString()
      }
    }

    logout = async () => {
      net.logout()
      store.setTasks([])
      store.setLists([])
      router.push('/')
    }
}

export default new Backend()
