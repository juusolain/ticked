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
  }
}
</script>

<template>
  <article class="media">
    <div class="media-content">
      <strong>{{ task.name }}</strong>
      <br>
      {{ task.description }}
    </div>
  </article>
</template>

<style></style>
