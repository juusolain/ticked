import net from '@/modules/net'
import store from '@/modules/store'
import router from '@/router'

class Backend {
    loadTasks = async () => {
      try {
        const newTasks = await net.getTasks()
        store.setTasks(newTasks)
      } catch (err) {
        console.error(err)
      }
    }

    loadLists = async () => {
      try {
        const newLists = await net.getLists()
        store.setLists(newLists)
      } catch (err) {
        console.error(err)
      }
    }

    syncTasks = async () => {
      await this.loadTasks()
    }

    initialLoad = async () => {
      store.addLoading(1)
      await this.loadTasks()
      await this.loadLists()
      store.addLoading(-1)
    }

    addTask = async (newTask) => {
      try {
        store.addTask(newTask)
        await net.addTask(newTask)
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
          await this.initialLoad()
          router.push('/')
          return null
        } else {
          return 'Supply both username and a password'
        }
      } catch (err) {
        console.error(err)
        return 'Internal error: ' + err.toString()
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
