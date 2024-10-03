<template>
  <div class="mt-3">
    <b-card>
      <b-form @submit.prevent="addTask">
        <b-row>
          <b-col>
            <b-form-group id="taskNameGroup" label="New Task" class="no-border-input">
              <template #label>
                <div class="text-left">
                  <strong class="">New Task</strong>
                </div>
              </template>
              <b-form-input ref="taskNameInput" v-model="taskName" required placeholder="Name" />
            </b-form-group>
            <hr>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <b-form-group id="descriptionGroup" class="no-border-input">
              <b-form-textarea v-model="taskDescription" placeholder="Description" rows="3" />
            </b-form-group>
          </b-col>
        </b-row>

        <div class="mt-1">
          <b-row>

            <b-col cols="5" class="text-start">
              <b-form-group id="limitTaskGroup">
                <b-form-datepicker v-model="selectedLimitDate" @input="updateSelectedDate" :min="currentDate" required
                  placeholder="Limit Task" class="small-datepicker" />
              </b-form-group>
            </b-col>
            <b-col>
              <b-form-group id="groupSelectGroup" class="mb-3 sm" title="Select Category">
                <b-button-group>
                  <b-button v-for="category in groupOptions" :key="category.value" class="btn-sm"
                    :variant="selectedGroup === category.value ? 'primary' : 'outline-secondary'"
                    @click="selectedGroup = category.value">
                    {{ category.text }}
                  </b-button>
                </b-button-group>
              </b-form-group>
            </b-col>

            <b-col class="text-end">
              <b-button type="submit" variant="success" :disabled="isButtonDisabled">+</b-button>
            </b-col>
          </b-row>
        </div>
      </b-form>
    </b-card>

    <AvisoModal :aviso="aviso" />
  </div>
</template>
  
<script>
import { addTask } from '@/services/api';
import { getAuthData } from '@/services/auth'; 
import moment from 'moment';

export default {
  data() {
    return {
      aviso: {
        titulo: '',
        texto: '',
        type: 'success' 
      },

      taskName: '',
      taskDescription: '',
      selectedLimitDate: '',
      groupOptions: [
        { value: 1, text: 'Personal' },
        { value: 2, text: 'Estudio' },
        { value: 3, text: 'Trabajo' },
        { value: 4, text: 'Viaje' },
        { value: 5, text: 'Investigación' },
      ],
      selectedGroup: 1,
      selectedTask: null,
    };
  },
  computed: {
    idUser() {
      const authData = getAuthData();
      return authData.idUser;
    },
    currentDate() {
      return moment().format('YYYY-MM-DD');
    },
    isButtonDisabled() {
      return this.taskName === '' || this.taskDescription === '';
    },
  },

  methods: {
    async addTask() {
      try {
        const taskData = {
          nameTask: this.taskName,
          detailTask: this.taskDescription,
          statusTask: 'false',
          limitTask: this.selectedLimitDate,
          priorityTask: 'false',
          idUser: this.idUser,
          idCategory: this.selectedGroup,
        };

        const updatedTasks = await addTask(this.$store, taskData);
        this.$emit('task-added', updatedTasks);
        this.taskName = '';
        this.taskDescription = '';
        this.selectedLimitDate = moment().format('YYYY-MM-DD HH:mm:ss'); 
        this.selectedGroup = 1; 

        this.aviso.titulo = 'New Task!';
        this.aviso.texto = taskData.nameTask;
        this.aviso.type = 'success';

      } catch (error) {
        console.error('Error adding task:', error);
      }
    },

    selectGroup(value) {
      this.selectedGroup = value;
    },

    updateSelectedDate(date) {
      this.selectedLimitDate = moment(date).toISOString();
    },
    handleEditTask(task) {
      this.selectedTask = task;
      this.$emit('show-task-detail', this.selectedTask);
    },

  },

  async mounted() {
    this.selectedLimitDate = moment().format('YYYY-MM-DD HH:mm:ss');
  }
};
</script>
  
<style scoped>
.no-border-input .form-control {
  border: none;
  box-shadow: none;
}

.small-datepicker .datepicker-dropdown {
  font-size: 0.8rem;
}
</style>