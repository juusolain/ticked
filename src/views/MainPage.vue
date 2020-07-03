<script>
import Menu from '@/components/MainPage/Menu'
import TaskList from '@/components/MainPage/TaskList'
import Settings from '@/components/MainPage/Settings'

import store from '@/modules/store'
import backend from '@/modules/backend'
import auth from '@/modules/auth'

export default {
  name: 'MainPage',
  components: { Menu, TaskList, Settings },
  data () {
    return {
      loading: false,
      store: store.state,
      error: null,
      isActive: true
    }
  },
  lists: {},
  mounted: function () {
    console.log('Mounted')
    this.$nextTick(() => {
      backend.initialLoad(this)
    })
  },
  methods: {
    open (link) {
      this.$electron.shell.openExternal(link)
    }
  }
}
</script>

<template>
  <div class="main">
    <b-loading
      :active="store.loading !== 0"
      :is-full-page="true"
      :can-cancel="false"
    />
    <section class="main-layout">
      <Menu />
      <div class="main-content">
        <TaskList v-if="store.view === 'tasks'" />
        <Settings v-if="store.view === 'settings'" />
      </div>
    </section>
  </div>
</template>

<style></style>
