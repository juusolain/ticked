<script>
import Menu from '@/components/MainPage/Menu'
import TaskList from '@/components/MainPage/TaskList'
import state from '@/modules/state'
export default {
  name: 'MainPage',
  components: { Menu, TaskList },
  data () {
    return {
      loading: false,
      state: state.state,
      error: null,
      isActive: true
    }
  },
  lists: {listid: '1234', listname: 'Example'},
  methods: {
    open (link) {
      this.$electron.shell.openExternal(link)
    }
  }
}
</script>

<template>
  <div class="columns is-fullheight">
    <b-loading
      :active="state.loading !== 0"
      :is-full-page="true"
      :can-cancel="false"
    />
    <div class="column is-one-quarter has-background-black-ter has-text-light">
      <Menu />
    </div>
    <div class="column is-three-quarters">
      <TaskList />
    </div>
  </div>
</template>

<style></style>
