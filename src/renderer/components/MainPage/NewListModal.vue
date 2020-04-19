<script>
import backend from '@/modules/backend'
export default {
  name: 'NewListModal',
  data () {
    return {
      name: ''
    }
  },
  methods: {
    create () {
      console.log(this.$parent)
      this.$parent.close()
      backend.newList({
        name: this.name
      })
    },
    cancel () {
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
        @click="cancel"
      >
        {{ $t('newlist.close') }}
      </b-button>
    </footer>
  </div>
</template>

<style></style>
