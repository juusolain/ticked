import net from '@/modules/net'

const updateFrequency = 5 // update frequency in minutes

class Database {
  constructor () {
    this.needsUpdate = true
    this.updating = 1 // while loading db, contacting server or syncing
    this.updateHandler = null
    this.lastUpdateTime = 0
    this.ready = false
  }

  init = async () => {
    /*
    this.tasks = await Datastore.create(path.join(userData, 'data', 'tasks.db'))
    this.lists = await Datastore.create(path.join(userData, 'data', 'lists.db'))
    await this.tasks.load()
    await this.lists.load()
    this.ready = true
    setInterval(this.checkUpdate, 500)
    */
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
  }

  syncTasks = async (ourArray, remoteArray) => {
    if (!this.ready) throw 'error.database.notready'
    console.log(ourArray, remoteArray)
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
    console.log(ourArray, remoteArray)
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

  getTasks = async () => {
    if (!this.ready) throw 'error.database.notready'
    return this.tasks.find({ userid: await net.getUserID() }, { _id: 0 })
  }

  getLists = async () => {
    if (!this.ready) throw 'error.database.notready'
    return this.lists.find({ userid: await net.getUserID() }, { _id: 0 })
  }

  deleteTask = async (taskToDelete, netUpdate = false) => {
    this.updating++
    if (!this.ready) throw 'error.database.notready'
    try {
      const newTask = { taskid: taskToDelete.taskid, userid: taskToDelete.userid, deleted: true, modified: this.getTime() }
      this.updateTask(newTask)
      if (netUpdate) {
        try {
          await net.updateTask(newTask)
          this.updating--
        } catch (error) {
          this.needsUpdate = true
          this.checkUpdate()
        }
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
      await this.tasks.insert(newTask)
      if (netUpdate) {
        try {
          await net.addTask(newTask)
          this.updating--
        } catch (error) {
          this.needsUpdate = true
          this.checkUpdate()
        }
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
      await this.tasks.update({ userid: newTask.userid, taskid: newTask.taskid }, newTask)
      if (netUpdate) {
        try {
          await net.updateTask(newTask)
          this.updating--
        } catch (error) {
          this.needsUpdate = true
          this.checkUpdate()
        }
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
      await this.lists.insert(newList)
      if (netUpdate) {
        try {
          await net.addList(newList)
          this.updating--
        } catch (error) {
          this.needsUpdate = true
          this.checkUpdate()
        }
      }
    } catch (error) {
      console.warn(error)
      throw 'error.database.newlist'
    }
  }
}

export default new Database()
