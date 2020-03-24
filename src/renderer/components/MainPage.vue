<script>
import Menu from '@/components/MainPage/Menu'
import TaskList from '@/components/MainPage/TaskList'
import store from '@/modules/store'
import backend from '@/modules/backend'
export default {
  name: 'MainPage',
  components: { Menu, TaskList },
  data () {
    return {
      loading: false,
      store: store.state,
      error: null,
      isActive: true
    }
  },
  mounted () {
    backend.initialLoad()
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
      :active="store.loading !== 0"
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
