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
  }
}
export default state
