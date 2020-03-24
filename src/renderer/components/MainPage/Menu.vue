<script>
import net from '@/modules/net'
import store from '@/modules/store'
import backend from '@/modules/backend'

export default {
  data () {
    return {
      loading: false,
      store: store.state,
      error: null,
      isActive: true
    }
  },
  methods: {
    setList (newList) {
      backend.setList(newList)
    },
    logout () {
      backend.logout()
      this.$router.push('/')
    },
    newList () {
      backend.newList()
    }
  }
}
</script>

<template>
  <b-menu
    class="is-sidebar-menu"
  >
    <b-menu-list label="Lists">
      <b-menu-item
        v-for="list in store.lists"
        :key="list.listid"
        :label="list.listname"
        @click="setList(list.listid)"
      />
      <b-menu-item
        tag="a"
        icon="plus"
        label="New list"
        @click="newList"
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
