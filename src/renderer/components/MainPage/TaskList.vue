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
    },
    updateTask (newTask) {
      console.log('Updating task: ', newTask)
      backend.updateTask(newTask)
    }
  }
}
</script>

<template>
  <div class="tasks">
    <div class="newtask">
      <b-field class="name">
        <b-input
          v-model="newTaskValue"
          placeholder="New task"
          size="is-medium"
          @keyup.native.enter="newTask"
        />
      </b-field>
      <b-button
        type="is-primary"
        size="is-medium"
        icon-right="plus"
        @click="newTask"
      />
    </div>
    <div class="tasklist">
      <div
        v-if="store.tasks && store.tasks.length !== 0"
        class="tasklist-content"
      >
        <Task
          v-for="task in store.tasks"
          :key="task.taskid"
          :task="task"
          @update="updateTask(task)"
        />
      </div>
      <div
        v-else
        class="is-flex"
        style="align-items: center; justify-content: center;"
      >
        <p style="text-align: center">
          {{ $t('tasklist.notasks') }}
        </p>
      </div>
      <div
        v-if="error"
        class="error"
      >
        {{ error }}
      </div>
    </div>
  </div>
</template>

<style></style>
