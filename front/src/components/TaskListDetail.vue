<template>
  <div class="mt-3">
    <b-card>
      <b-row class="text-end">
        <b-col lg="2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" :fill="getStarFill()" class="bi bi-star-fill"
            viewBox="0 0 16 16">
            <path
              d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
          </svg>
        </b-col>
        <b-col lg="">
        </b-col>

        <b-col lg="6">
          <div class="m-1">
            <b-form-group id="groupSelectGroup" class="sm ">
              <b-form-select v-model="localTask.idCategory" :options="groupOptions"
                class="form-select form-control"></b-form-select>
            </b-form-group>
          </div>
        </b-col>
      </b-row>
      <b-row>
        <b-col lg="12">
          <div class="m-1">

            <b-form-group>
              <b-form-input v-model="localTask.nameTask" class="no-border-input" />
            </b-form-group>
          </div>

        </b-col>
        <b-col lg="12">
          <div class="m-1">
            <b-form-group>
              <b-form-textarea v-model="localTask.detailTask" rows="4" />
            </b-form-group>
          </div>
        </b-col>

        <b-col lg="">
          <div class="m-1">
            Limit
            <b-form-group id="limitTaskGroup">
              <b-form-datepicker v-model="selectedLimitDate" @input="updateSelectedDate(selectedLimitDate)"
                :min="currentDate" required placeholder="Limit Task" class="small-datepicker" />
            </b-form-group>
          </div>
        </b-col>

      </b-row>
      <hr>
      <b-row class="text-left">
        <b-col>
          <h4>Steps</h4>
        </b-col>
      </b-row>
      <b-row v-for="(step, index) in getStepTaskStore" :key="'step_' + index" class="m-1">
        <div class="col d-flex justify-content-center align-items-center">
          <div v-if="step.statusStepTask == 'false'" class="text-center">
            <b-icon icon="circle-fill" class="text-white h2 border rounded-circle border-gray-3"
              @click="handleCheckboxChange(step)"></b-icon>
          </div>
          <div v-else>
            <div>
              <b-icon icon="check-circle-fill" class="text-success h2" @click="handleCheckboxChange(step)"></b-icon>

            </div>
          </div>
        </div>
        <b-col lg="9">
          <b-form-group>
            <b-form-input v-model="step.nameStepTask" />
          </b-form-group>
        </b-col>
      </b-row>
      <b-row v-for="(step, index) in localSteps" :key="'localStep_' + index" class="m-1">
        <b-col lg="9">
          <b-form-group>
            <b-form-input v-model="step.nameStepTask" :placeholder="'Name Step'" />
          </b-form-group>
        </b-col>
        <b-col>
          <div class="text-end">
            <b-button v-if="index === localSteps.length - 1" @click="addStep" variant="secondary">+</b-button>
          </div>
        </b-col>
      </b-row>


      <template #footer>
        <div class="text-end">
          <b-button @click="updateTaskGeneral" variant="success">Save</b-button>
        </div>
      </template>
    </b-card>
  </div>
</template>
  
<script>
import { getAuthData } from '@/services/auth'; 
import { editTask, addStepTask, getStepTasks, editStepStatusTask } from '@/services/api';
import moment from 'moment';
import { mapGetters } from 'vuex';
export default {
  props: {
    selectedTask: Object 
  },
  data() {
    return {
      localTask: { ...this.selectedTask },
      localSteps: [
        {
          nameStepTask: '',
          detailStepTask: 'ssssssssssssssssss',
          statusStepTask: "false",
          updateStepTask: "2023-08-25T05:31:12.392Z",
          idTask: '',
        },
      ],
      groupOptions: [
        { value: 1, text: 'Personal' },
        { value: 2, text: 'Estudio' },
        { value: 3, text: 'Trabajo' },
        { value: 4, text: 'Viaje' },
        { value: 5, text: 'Investigación' },
      ],
      selectedGroup: 1,
      selectedLimitDate: '',

      newStep: '',
    };
  },
  computed: {
    ...mapGetters('todoModule', ['getStepTaskStore']),
    idUser() {
      const authData = getAuthData();
      return authData.idUser;
    },
    currentDate() {
      return moment().format('YYYY-MM-DD');
    },

  },
  watch: {
    selectedTask(newSelectedTask) {
      this.localTask = { ...newSelectedTask };
      this.fetchStepTask();
    },
    selectedLimitDate() {
      this.selectedLimitDate = this.localTask.limitTask
    },

  },
  methods: {


    async updateTaskGeneral() {
      try {
        const updatedTaskData = {
          ...this.localTask,
          nameTask: this.localTask.nameTask,
          detailTask: this.localTask.detailTask,
          statusTask: this.localTask.statusTask,
          priorityTask: this.localTask.priorityTask,
          idCategory: this.selectedGroup,
          limitTask: this.selectedLimitDate,
        };
        await editTask(this.$store, this.localTask.idTask, updatedTaskData);
      } catch (error) {
        console.error('Error updating task:', error);
      }
    },
    async addStepTask(step) {
      try {
        await addStepTask(this.$store, step);
      } catch (error) {
        console.error('Error updating task:', error);
      }
    },
    async fetchStepTask() {
      await getStepTasks(this.$store, this.selectedTask.idTask);
    },
    getStarFill() {
      this.selectedLimitDate = this.localTask.limitTask,
        this.selectedGroup = this.localTask.idCategory;

      this.localSteps[0].idTask = this.localTask.idTask;
      return this.localTask.priorityTask === "false" ? "lightgray" : "yellow";
    },
    updateSelectedDate(date) {
      this.localTask.limitTask = date;
    },

    addStep() {
      this.newStep = ''; 
      this.addStepTask(this.localSteps[0]);
      this.localSteps[0].nameStepTask = ""
    },
    handleCheckboxChange(item) {
      this.reviewPriority = true;

      this.updateStatusTask(item);
    },
    async updateStatusTask(dataTask) {
      try {
        const oppositeStatus = dataTask.statusStepTask === '"true"' ? '"false"' : '"true"';
        const newTasks = await editStepStatusTask(this.$store, dataTask.idStepTask, oppositeStatus);
        this.tasks = newTasks; 
      } catch (error) {
        console.error('Error updating task:', error);
      }
    },
  },
};
</script>
  

  