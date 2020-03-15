var state = {
  currentCategory: null,
  state: {
    currentList: null
  },
  setList (newList) {
    if (process.env.NODE_ENV === 'development') console.log('Changing list: ', newList)
    this.state.currentList = newList
  }
}

export default state
