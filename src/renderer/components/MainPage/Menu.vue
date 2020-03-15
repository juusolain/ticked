<script>
import net from '@/modules/net'
export default {
  data () {
    return { loading: false, lists: null, error: null, isActive: true }
  },
  watch: { $route: 'fetchData' },
  created () {
    this.fetchData()
  },
  methods: {
    async fetchData () {
      this.error = this.lists = null
      this.loading = true
      const res = await net.post('/getLists')
      if (res.data.success) {
        this.lists = res.data.lists
        this.loading = false
      } else {
        this.loading = false
        this.error = res.data.error
      }
    }
  }
}
</script>

<template>
  <b-menu class="is-sidebar-menu">
    <b-menu-list label="Lists">
      <b-menu-item
        v-for="list in lists"
        :key="list.listid"
        :label="list.listname"
      />
    </b-menu-list>
    <b-menu-list label="Actions">
      <b-menu-item label="Logout" />
    </b-menu-list>
  </b-menu>
</template>

<style></style>
