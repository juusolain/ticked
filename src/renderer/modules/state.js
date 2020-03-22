var state = {
  state: {
    list: null,
    lists: [],
    tasks: [],
    loading: 0
  },
  setList (newList) {
    if (process.env.NODE_ENV === 'development') console.log('Changing list: ', newList)
    this.state.list = newList
  },
  setLists (newLists) {
    if (process.env.NODE_ENV === 'development') console.log('Changing lists: ', newLists)
    this.state.lists = newLists
  },
  setTasks (newTasks) {
    if (process.env.NODE_ENV === 'development') console.log('Changing tasks: ', newTasks)
    this.state.tasks = newTasks
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
      this.state.tasks.push(newTask)
    }
  },
  removeTask (taskToRemove) {
    if (process.env.NODE_ENV === 'development') console.log('Removing task: ', taskToRemove)
    this.state.tasks = this.state.tasks.filter(function (task) {
      return task.taskid !== taskToRemove.taskid
    })
  }
}

export default state
