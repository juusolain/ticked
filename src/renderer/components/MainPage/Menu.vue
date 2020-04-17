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
      this.setView('tasks')
      backend.setList(newList)
    },
    logout () {
      backend.logout()
    },
    newList () {
      backend.newList()
    },
    setView (newView) {
      store.setView(newView)
    }
  }
}
</script>

<template>
  <b-menu
    class="is-sidebar-menu"
  >
    <b-menu-list :label="$t('menu.label.lists')">
      <b-menu-item
        v-for="list in store.lists"
        :key="list.listid"
        :label="list.listname"
        @click="setList(list.listid)"
      />
      <b-menu-item
        tag="a"
        icon="plus"
        :label="$t('menu.label.newlist')"
        @click="newList"
      />
    </b-menu-list>
    <b-menu-list :label="$t('menu.label.actions')">
      <b-menu-item
        :label="$t('menu.label.settings')"
        icon="settings"
        @click="setView('shareKey')"
      />
      <b-menu-item
        :label="$t('menu.label.logout')"
        icon="logout"
        @click="logout"
      />
    </b-menu-list>
  </b-menu>
</template>

<style></style>
