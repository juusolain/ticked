var state = {
  state: {
    list: null,
    lists: [],
    tasks: [],
    allTasks: [],
    loading: 0
  },
  setList (newList) {
    if (process.env.NODE_ENV === 'development') console.log('Changing list: ', newList)
    this.state.list = newList
    this.state.tasks = this.state.allTasks.filter((elem) => {
      return elem.listid === this.state.list
    })
  },
  setLists (newLists) {
    if (process.env.NODE_ENV === 'development') console.log('Changing lists: ', newLists)
    this.state.lists = newLists
  },
  setTasks (newTasks) {
    if (process.env.NODE_ENV === 'development') console.log('Changing tasks: ', newTasks)
    this.state.allTasks = newTasks
  },
  addLoading (newLoading) {
    if (process.env.NODE_ENV === 'development') console.log('Adding loading: ', newLoading)
    this.state.loading += newLoading
  },
  setLoading (newLoading) {
    if (process.env.NODE_ENV === 'development') console.log('Changing loading: ', newLoading)
    this.state.loading = newLoading
  },
  addTask (newTask) {
    if (newTask.listid === this.state.list) {
      if (process.env.NODE_ENV === 'development') console.log('Adding task: ', newTask)
      this.state.allTasks.push(newTask)
      this.state.tasks.push(newTask)
    }
  },
  removeTask (taskToRemove) {
    if (process.env.NODE_ENV === 'development') console.log('Removing task: ', taskToRemove)
    this.state.allTasks = this.state.allTasks.filter(function (task) {
      return task.taskid !== taskToRemove.taskid
    })
  }
}

window.state = state

export default state
