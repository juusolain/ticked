<script>
import Task from '@/components/MainPage/Task'
import net from '@/modules/net'
import store from '@/modules/store'
import backend from '@/modules/backend'

export default {
  name: 'Tasklist',
  components: { Task },
  data () {
    return {
      error: null,
      store: store.state,
      newTaskValue: ''
    }
  },
  methods: {
    newTask (event) {
      console.log('Creating new task, ', event.target)
      event.target.blur()
      backend.newTask({
        name: this.newTaskValue
      })
      this.newTaskValue = ''
    }
  }
}
</script>

<template>
  <div class="tasklist">
    <div class="newtask">
      <b-field>
        <b-input
          v-model="newTaskValue"
          placeholder="New task"
          size="is-medium"
          @keyup.native.enter="newTask"
        />
      </b-field>
    </div>
    <div v-if="store.tasks">
      <Task
        v-for="task in store.tasks"
        :key="task.taskid"
        :task="task"
      />
    </div>
    <div
      v-if="error"
      class="error"
    >
      {{ error }}
    </div>
  </div>
</template>

<style></style>
