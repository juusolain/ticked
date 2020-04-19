<script>
export default {
  name: 'Task',
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
      editing: false
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
          v-if="editing"
          v-model="task.name"
          class="task input name"
          @blur="editing = false; $emit('update')"
          @keyup.enter="editing=false; $emit('update')"
        >
        <div v-else>
          <label @click="editing = true">
            <strong> {{ task.name }} </strong>
          </label>
        </div>
      </div>
      {{ task.description }}
    </div>
  </article>
</template>

<style></style>
