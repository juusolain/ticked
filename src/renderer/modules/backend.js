import net from '@/modules/net'
import store from '@/modules/store'

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

    logout = async () => {
      net.logout()
      store.setTasks([])
      store.setLists([])
    }
}

export default new Backend()
