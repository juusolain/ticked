<template>
  <article class="media">
    <div class="media-content">
      <strong>{{ task.name }}</strong>
      <br>
      {{ task.description }}
    </div>
  </article>
</template>

<script>
export default {
  name: 'Task'
}
</script>

<style>

</style>