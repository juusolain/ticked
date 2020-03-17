<script>
import net from '@/modules/net'
import state from '@/modules/state'

export default {
  data () {
    return {
      loading: false,
      state: state.state,
      error: null,
      isActive: true
    }
  },
  watch: { $route: 'fetchData' },
  created () {
    this.fetchData()
  },
  methods: {
    async fetchData () {
      this.error = null
      this.loading = true
      try {
        await net.getLists()
      } catch (error) {
        this.error = error
      }
      this.loading = false
    },
    setList (newList) {
      state.setList(newList)
      net.getTasks()
    },
    logout () {
      net.logout()
      this.$router.push('/')
    }
  }
}
</script>

<template>
  <b-menu class="is-sidebar-menu">
    <b-menu-list label="Lists">
      <b-menu-item
        v-for="list in state.lists"
        :key="list.listid"
        :label="list.listname"
        @click="setList(list.listid)"
      />
    </b-menu-list>
    <b-menu-list label="Actions">
      <b-menu-item
        label="Logout"
        icon="logout"
        @click="logout"
      />
    </b-menu-list>
  </b-menu>
</template>

<style></style>
