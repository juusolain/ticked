<script>
import backend from '@/modules/backend'
import store from '@/modules/store'

export default {
  name: 'EditListModal',
  data () {
    return {
      name: ''
    }
  },
  methods: {
    create () {
      console.log(this.$parent)
      this.close()
      backend.updateList({
        name: this.name
      })
    },
    close () {
      store.viewBack()
      this.$parent.close()
    }
  }
}
</script>

<template>
  <div
    class="modal-card"
    style="width: auto"
  >
    <header class="modal-card-head">
      <p class="modal-card-title">
        {{ $t('newlist.title') }}
      </p>
    </header>
    <section class="modal-card-body">
      <b-field :label="$t('newlist.label.name')">
        <b-input
          v-model="name"
          type="text"
          :placeholder="$t('newlist.placeholder.name')"
          required
        />
      </b-field>
    </section>
    <footer class="modal-card-foot">
      <b-button
        type="is-primary"
        @click="create"
      >
        {{ $t('newlist.create') }}
      </b-button>
      <b-button
        type="is-light"
        @click="close"
      >
        {{ $t('newlist.close') }}
      </b-button>
    </footer>
  </div>
</template>

<style></style>
