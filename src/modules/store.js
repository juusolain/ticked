var state = {
  state: {
    list: null,
    lists: [],
    tasks: [],
    allTasks: [],
    loading: 0,
    userData: {},
    view: 'tasks', // tasks or settings
    menuView: '',
    lastMenuView: '',
    lastView: ''
  },
  setList (newList) {
    if (process.env.NODE_ENV === 'development') console.log('Changing list: ', newList)
    this.state.list = newList
    this.state.tasks = this.state.allTasks.filter((elem) => {
      if (this.state.list === null) return true
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
    if (this.state.loading < 0) this.state.loading = 0
  },
  setLoading (newLoading) {
    if (process.env.NODE_ENV === 'development') console.log('Changing loading: ', newLoading)
    this.state.loading = newLoading
  },
  addTask (newTask) {
    if (process.env.NODE_ENV === 'development') console.log('Adding task: ', newTask)
    this.state.allTasks.push(newTask)
    if (newTask.listid === this.state.list || this.state.list === null) {
      this.state.tasks.push(newTask)
    }
  },
  removeTask (taskToRemove) {
    if (process.env.NODE_ENV === 'development') console.log('Removing task: ', taskToRemove)
    this.state.allTasks = this.state.allTasks.filter(function (task) {
      return task.taskid !== taskToRemove.taskid
    })
    this.state.tasks = this.state.tasks.filter(function (task) {
      return task.taskid !== taskToRemove.taskid
    })
  },
  removeList (listToRemove) {
    console.log('TODO - removelist')
  },
  addList (newList) {
    if (process.env.NODE_ENV === 'development') console.log('Adding list: ', newList)
    this.state.lists.push(newList)
  },
  setAllLists () {
    this.state.tasks = this.state.allTasks
  },
  setUserData (newUserData) {
    if (process.env.NODE_ENV === 'development') console.log('Setting user data: ', newUserData)
    this.state.userData = newUserData
  },
  setView (newView) {
    this.state.lastView = newView
    if (process.env.NODE_ENV === 'development') console.log('Setting view: ', newView)
    this.state.view = newView
  },
  setMenuView (newMenu) {
    this.state.lastMenuView = this.state.menuView
    if (process.env.NODE_ENV === 'development') console.log('Setting menu view: ', newMenu)
    this.state.menuView = newMenu
  },
  viewBack () {
    const newView = this.state.lastView
    const newMenuView = this.state.lastMenuView
    this.state.lastView = this.state.view
    this.state.lastMenuView = this.state.menuView
    this.state.view = newView
    this.state.menuView = newMenuView
    if (process.env.NODE_ENV === 'development') console.log('Going back')
  },
  getMode () {
    return localStorage.getItem('mode')
  },
  setMode (newMode) {
    if (newMode) {
      return localStorage.setItem('mode', newMode)
    } else {
      return localStorage.removeItem('mode')
    }
  }
}

window.state = state

export default state
