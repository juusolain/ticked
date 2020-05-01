<script>
export default {
  name: 'Task',
  directives: {
    focus: {
      inserted: function (el) {
        el.focus()
      }
    }
  },
  props: {
    task: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data () {
    return {
      editing_name: false,
      editing_desc: false
    }
  },
  methods: {
    update () {
      this.$emit('update')
    }
  }
}
</script>

<template>
  <article class="media">
    <div class="media-content">
      <div class="name">
        <input
          v-if="editing_name"
          v-model="task.name"
          v-focus
          class="task input name"
          @blur="editing_name = false; update()"
          @keyup.enter="editing_name=false"
        >
        <div v-else>
          <label @click="editing_name = true">
            <strong> {{ task.name }} </strong>
          </label>
        </div>
      </div>
      <div class="description">
        <input
          v-if="editing_desc"
          v-model="task.description"
          v-focus
          class="task input description"
          @blur="editing_desc = false; update()"
          @keyup.enter="editing_desc=false"
        >
        <div v-else>
          <label
            aria-placeholder="description"
            @click="editing_desc = true"
          >
            {{ task.description || $t('task.placeholder.description') }}
          </label>
        </div>
      </div>
    </div>
  </article>
</template>

<style></style>
