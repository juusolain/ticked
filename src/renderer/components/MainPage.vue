<template>
  <div class="columns">
    <div class="column is-one-quarter">
      <Menu></Menu>
    </div>
    <div class="column is-three-quarters">
      <TaskList></TaskList>
    </div>
  </div>
</template>

<script>
import Menu from './MainPage/Menu'
import TaskList from './MainPage/TaskList'

export default {
  name: 'MainPage',
  components: { Menu, TaskList },
  methods: {
    open (link) {
      this.$electron.shell.openExternal(link)
    }
  }
}
</script>

<style>

</style>