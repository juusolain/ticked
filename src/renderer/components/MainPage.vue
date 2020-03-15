<template>
  <div class="columns is-fullheight">
    <div class="column is-one-quarter has-background-black-ter has-text-light">
      <Menu />
    </div>
    <div class="column is-three-quarters">
      <TaskList />
    </div>
  </div>
</template>

<script>
import Menu from '@/components/MainPage/Menu'
import TaskList from '@/components/MainPage/TaskList'
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

<style></style>
