import net from '@/modules/net'
import db from '@/modules/db-schema'
import store from '@/modules/store'

const updateFrequency = 5 // update frequency in minutes

class Database {
  constructor () {
    this.needsUpdate = true
    this.updating = 1 // while loading db, contacting server or syncing
    this.updateHandler = null
    this.lastUpdateTime = 0
    this.ready = true
    if (store.getMode() === 'online') {
      setInterval(this.checkUpdate, 5000)
    }
  }

  checkUpdate = async () => {
    if (!this.ready) return
    if (this.needsUpdate) {
      this.updating++
      await this.sync()
    } else if (this.getTime() - this.lastUpdateTime > 1000 * 60 * updateFrequency) {
      await this.sync()
    }
  }

  sync = async () => {
    if (!this.ready) throw 'error.database.notready'
    if (store.getMode() === 'online') {
      try {
        const tasks = await net.getTasks()
        const lists = await net.getLists()
        const ourTasks = await this.getTasks()
        const ourLists = await this.getLists()
        await this.syncTasks(ourTasks, tasks)
        await this.syncLists(ourLists, lists)
        if (this.updateHandler) {
          this.updateHandler()
        }
        this.needsUpdate = false
        this.updating = 0
        this.lastUpdateTime = this.getTime()
      } catch (error) {
        console.error(error)
      }
    } else {
      this.updating = 0
      this.needsUpdate = false
    }
  }

  syncTasks = async (ourArray, remoteArray) => {
    if (!this.ready) throw 'error.database.notready'
    if (ourArray) {
      ourArray.forEach(ourTask => {
        const theirTask = remoteArray.find(elem => {
          return elem.userid === ourTask.userid && elem.taskid === ourTask.taskid
        })
        if (theirTask) {
          if (theirTask.modified < ourTask.modified) {
            net.updateTask(ourTask)
          } else if (theirTask.modified > ourTask.modified) {
            this.updateTask(theirTask)
          } else if (theirTask.modified === ourTask.modified === undefined) {
            this.updateTask(ourTask)
          }
        } else {
          net.addTask(ourTask)
        }
      })
    }

    if (remoteArray) {
      remoteArray.forEach(theirTask => {
        if (ourArray) {
          const ourTask = ourArray.find(elem => {
            return elem.userid === theirTask.userid && elem.taskid === theirTask.taskid
          })
          if (!ourTask) {
            this.addTask(theirTask)
          }
        } else {
          this.addTask(theirTask)
        }
      })
    }
  }

  syncLists = async (ourArray, remoteArray) => {
    if (!this.ready) throw 'error.database.notready'
    if (ourArray) {
      ourArray.forEach(ourList => {
        const theirList = remoteArray.find(elem => {
          return elem.userid === ourList.userid && elem.listid === ourList.listid
        })
        if (theirList) {
          if (theirList.modified < ourList.modified) {
            net.updateList(ourList)
          } else if (theirList.modified > ourList.modified) {
            this.updateList(theirList)
          } else if (theirList.modified === ourList.modified === undefined) {
            this.updateList(ourList)
          }
        } else {
          net.addList(ourList)
        }
      })
    }

    if (remoteArray) {
      remoteArray.forEach(theirList => {
        if (ourArray) {
          const ourList = ourArray.find(elem => {
            return elem.userid === theirList.userid && elem.listid === theirList.listid
          })
          if (!ourList) {
            this.addList(theirList)
          }
        } else {
          this.addList(theirList)
        }
      })
    }
  }

  onUpdate = (handler) => {
    this.updateHandler = handler
  }

  getTime = () => {
    return Date.now()
  }

  getTasks = async (userid = net.getUserID()) => {
    if (!this.ready) throw 'error.database.notready'
    return db.tasks.where('userid').equals(userid).toArray()
  }

  getLists = async (userid = net.getUserID()) => {
    if (!this.ready) throw 'error.database.notready'
    return db.lists.where('userid').equals(userid).toArray()
  }

  deleteList = async (listToDelete, netUpdate = false) => {
    this.updating++
    try {
      const newTask = { listid: listToDelete.taskid, userid: listToDelete.userid, deleted: true, modified: this.getTime() }
      this.updateList(newTask)
      if (netUpdate && store.getMode() === 'online') {
        try {
          await net.updateList(newTask)
          this.updating--
        } catch (error) {
          this.needsUpdate = true
          this.checkUpdate()
        }
      } else if (store.getMode() === 'local') {
        this.updating--
      }
    } catch (error) {
      console.warn(error)
      throw 'error.database.deletetask'
    }
  }

  deleteTask = async (taskToDelete, netUpdate = false) => {
    this.updating++
    if (!this.ready) throw 'error.database.notready'
    try {
      const newTask = { taskid: taskToDelete.taskid, userid: taskToDelete.userid, deleted: true, modified: this.getTime() }
      this.updateTask(newTask)
      if (netUpdate && store.getMode() === 'online') {
        try {
          await net.updateTask(newTask)
          this.updating--
        } catch (error) {
          this.needsUpdate = true
          this.checkUpdate()
        }
      } else if (store.getMode() === 'local') {
        this.updating--
      }
    } catch (error) {
      console.warn(error)
      throw 'error.database.deletetask'
    }
  }

  addTask = async (newTask, netUpdate = false) => {
    this.updating++
    if (!this.ready) throw 'error.database.notready'
    try {
      newTask.modified = this.getTime()
      await db.tasks.add(newTask)
      if (netUpdate && store.getMode() === 'online') {
        try {
          await net.addTask(newTask)
          this.updating--
        } catch (error) {
          this.needsUpdate = true
          this.checkUpdate()
        }
      } else if (store.getMode() === 'local') {
        this.updating--
      }
    } catch (error) {
      console.warn(error)
      throw 'error.database.addtask'
    }
  }

  updateTask = async (newTask, netUpdate = false) => {
    this.updating++
    if (!this.ready) throw 'error.database.notready'
    try {
      newTask.modified = this.getTime()
      await db.tasks.put(newTask)
      if (netUpdate && store.getMode() === 'online') {
        try {
          await net.updateTask(newTask)
          this.updating--
        } catch (error) {
          this.needsUpdate = true
          this.checkUpdate()
        }
      } else if (store.getMode() === 'local') {
        this.updating--
      }
    } catch (error) {
      console.warn(error)
      throw 'error.database.updatetask'
    }
  }

  addList = async (newList, netUpdate = false) => {
    this.updating++
    if (!this.ready) throw 'error.database.notready'
    try {
      newList.modified = this.getTime()
      await db.lists.add(newList)
      if (netUpdate && store.getMode() === 'online') {
        try {
          await net.addList(newList)
          this.updating--
        } catch (error) {
          this.needsUpdate = true
          this.checkUpdate()
        }
      } else if (store.getMode() === 'local') {
        this.updating--
      }
    } catch (error) {
      console.warn(error)
      throw 'error.database.newlist'
    }
  }

  putArray = async (newArray, target) => {
    if (target === 'tasks') {
      await db.tasks.bulkPut(newArray)
    } else if (target === 'lists') {
      await db.lists.bulkPut(newArray)
    } else {
      throw new Error('Invalid query to putarray - invalid target')
    }
  }
}

export default new Database()
