<script>
import net from '@/modules/net'
import store from '@/modules/store'
import backend from '@/modules/backend'

import NewListModal from '@/components/MainPage/NewListModal'

export default {
  name: 'Menu',
  data () {
    return {
      loading: false,
      store: store.state,
      error: null,
      isActive: true,
      newListProps: {
        listName: null
      },
      isModalActive: false
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
      this.$buefy.modal.open({
        parent: this,
        component: NewListModal,
        hasModalCard: true,
        trapFocus: true
      })
    },
    setView (newView) {
      store.setView(newView)
    }
  }
}
</script>

<template>
  <div>
    <b-menu
      class="is-sidebar-menu"
    >
      <b-menu-list :label="$t('menu.label.lists')">
        <b-menu-item
          active
          icon="view-sequential"
          :label="$t('menu.label.allLists')"
          @click="setList(null)"
        />
        <b-menu-item
          v-for="list in store.lists"
          :key="list.listid"
          :label="list.name"
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
  </div>
</template>

<style></style>
