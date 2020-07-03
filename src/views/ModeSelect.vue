<script>
import backend from '@/modules/backend'

export default {
  data () {
    return {
      selectedMode: 'login'
    }
  },
  methods: {
    async select (mode) {
      backend.setMode(mode)
      this.$router.push('/')
    }
  }
}
</script>

<template>
  <section class="section">
    <p class="has-text-centered is-size-2">
      {{ $t('modeselect.title') }}
    </p>
    <div class="container">
      <div class="columns">
        <div class="column is-half">
          <article class="box notification is-primary">
            <div class="buttons">
              <b-button
                type="is-primary"
                size="is-large"
                inverted
                expanded
                @click="select('local')"
              >
                {{ $t('modeselect.button.local') }}
              </b-button>
            </div>
          </article>
        </div>
        <div class="column is-half">
          <article class="box notification is-info">
            <div class="buttons">
              <b-button
                type="is-info"
                size="is-large"
                inverted
                expanded
                @click="select('online')"
              >
                {{ $t('modeselect.button.online') }}
              </b-button>
            </div>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<style></style>
