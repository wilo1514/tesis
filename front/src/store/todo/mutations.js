export const addTaskStore = (state, dataList) => {
  state.todoList.push(dataList);
};
export const addAllTaskStore = (state, taskList) => {
  state.todoList = [];
  state.todoList.push(...taskList);
};
export const addStepTaskStore = (state, dataList) => {
  state.stepList.push(dataList);
};
export const getStepTasksStore = (state, stepList) => {
  state.stepList = [];
  state.stepList.push(...stepList);
};
export const editStatusTaskStore = (state, taskId) => {
  state.todoList = state.todoList.map((task) => {
    if (task.idTask === taskId) {
      task.statusTask = task.statusTask === "true" ? "false" : "true";
    }
    return task;
  });
};
export const editStepStatusTaskStore = (state, taskId) => {
  state.stepList = state.stepList.map((task) => {
   
    if (task.idStepTask === taskId) {
      task.statusStepTask = task.statusStepTask === "true" ? "false" : "true";
    }
    return task;
  });

};
export const editPriorityTaskStore = (state, taskId) => {
  state.todoList = state.todoList.map((task) => {
    if (task.idTask === taskId) {
      task.priorityTask = task.priorityTask === "true" ? "false" : "true";
    }
    return task;
  });
};
export const editTaskStore = (state, updatedTaskData) => {
  const taskIdToUpdate = updatedTaskData.idTask;

  state.todoList = state.todoList.map((task) => {
    if (task.idTask === taskIdToUpdate) {
      task.nameTask = updatedTaskData.nameTask;
      task.detailTask = updatedTaskData.detailTask;
      task.statusTask = updatedTaskData.statusTask;
      task.limitTask = updatedTaskData.limitTask;
      task.priorityTask = updatedTaskData.priorityTask;
      task.idUser = updatedTaskData.idUser;
      task.idCategory = updatedTaskData.idCategory;
    }
    return task;
  });
};
