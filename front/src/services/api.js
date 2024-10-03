import axios from "axios";
import { getAuthData } from "./auth"; 
import moment from "moment";

const apiClient = axios.create({
  baseURL: "http://localhost:3000", 
});

export const login = async (email, password) => {

  console.log("api login", email, password)
  const response = await apiClient.post("/api/auth/login", {
    email,
    password,
  });
  console.log("api login response", response)
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await apiClient.post("/api/Users/registro", userData);
  return response.data;
};

export const addTask = async (store, taskData) => {
  try {
    const { token } = getAuthData();

    const formattedDate = moment(taskData.limitTask).toISOString();

    const response = await apiClient.post(
      "/api/Tasks/TaskRegistro",
      {
        ...taskData,
        limitTask: formattedDate,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    store.commit("todoModule/addTaskStore", response.data);

    return response.data;
  } catch (error) {
    console.error("Error al agregar tarea:", error.message);
    throw error;
  }
};

export const addStepTask = async (store, taskData) => {
  try {
    const { token } = getAuthData();

    const response = await apiClient.post(
      "/api/StepTasks/StepTaskRegistro",
      {
        ...taskData,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    store.commit("todoModule/addStepTaskStore", response.data);

    return response.data;
  } catch (error) {
    console.error("Error al agregar tarea:", error.message);
    throw error;
  }
};

export const getTasks = async (store, userId) => {
  try {
    const { token } = getAuthData();

    const response = await apiClient.get(`/api/Tasks/GetTasksUser/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const mappedTasks = response.data.map((task) => ({
      ...task,
      statusTask: task.statusTask === "0" ? "false" : task.statusTask,
    }));

  
    store.commit("todoModule/addAllTaskStore", mappedTasks);

    return mappedTasks;
  } catch (error) {
    console.error("SALIDA ERROR", error.message);
    return [];
  }
};
export const getStepTasks = async (store, taskId) => {
  try {
    const { token } = getAuthData();

    const response = await apiClient.get(
      `/api/StepTasks/GetStepTasks/${taskId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    store.commit("todoModule/getStepTasksStore", response.data);

    return response.data;
  } catch (error) {
    console.error("SALIDA ERROR", error.message);
    return [];
  }
};
export const getTasksTodo = async (store, userId) => {
  try {
    const { token } = getAuthData();

    const response = await apiClient.get(`/api/Tasks/GetTasksUser/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const mappedTasks = response.data
      .map((task) => ({
        ...task,
        statusTask: task.statusTask === "0" ? "false" : task.statusTask,
      }))
      .filter((task) => task.statusTask === "false"); 

    
    store.commit("todoModule/addAllTaskStore", mappedTasks);

    return mappedTasks;
  } catch (error) {
    console.error("SALIDA ERROR", error.message);
    return [];
  }
};
export const getTasksPriority = async (store, userId) => {
  try {
    const { token } = getAuthData();

    const response = await apiClient.get(`/api/Tasks/GetTasksUser/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const mappedTasks = response.data.map((task) => ({
      ...task,
      statusTask: task.statusTask === "0" ? "false" : task.statusTask,
    }));

    const filteredTasks = mappedTasks.filter(
      (task) => task.priorityTask === "true"
    );

    
    store.commit("todoModule/addAllTaskStore", filteredTasks);

    return filteredTasks;
  } catch (error) {
    console.error("SALIDA ERROR", error.message);
    return [];
  }
};

export const editStatusTask = async (store, taskId, newPriority) => {
  try {
    const { token } = getAuthData();

    const response = await apiClient.put(
      `/api/Tasks/editStatusTask/${taskId}`,
      newPriority,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    store.commit("todoModule/editStatusTaskStore", taskId);
    
    return response.data;
  } catch (error) {
    console.error("Error al editar prioridad de tarea:", error.message);
    throw error;
  }
};
export const editStepStatusTask = async (store, taskId, newPriority) => {
  try {
    const { token } = getAuthData();

    const response = await apiClient.put(
      `/api/StepTasks/editStatusStepTask/${taskId}`,
      newPriority,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    store.commit("todoModule/editStepStatusTaskStore", taskId);
    
    return response.data;
  } catch (error) {
    console.error("Error al editar prioridad de tarea:", error.message);
    throw error;
  }
};
export const editTaskPriority = async (store, taskId, newPriority) => {

  try {
    const { token } = getAuthData();

    const response = await apiClient.put(
      `/api/Tasks/editPriorityTask/${taskId}`,
      newPriority,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    store.commit("todoModule/editPriorityTaskStore", taskId);
   
    return response.data;
  } catch (error) {
    console.error("Error al editar prioridad de tarea:", error.message);
    throw error;
  }
};

export const editTask = async (store, taskId, updatedTaskData) => {
  try {
    const { token } = getAuthData();

    if (updatedTaskData.limitTask) {
      updatedTaskData.limitTask = moment(
        updatedTaskData.limitTask
      ).toISOString();
    }

    const response = await apiClient.put(
      `/api/Tasks/updateTask/${taskId}`,
      updatedTaskData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    store.commit("todoModule/editTaskStore", updatedTaskData);
    return response.data;
  } catch (error) {
    console.error("Error al editar tarea:", error.message);
    throw error;
  }
};

export const createStepTask = async (idTask, stepTaskData) => {
  try {
    const response = await apiClient.post(
      `/api/tasks/${idTask}/createStepTask`,
      stepTaskData
    );
    return response.data;
  } catch (error) {
    console.error("Error creating step task:", error);
    throw error;
  }
};

export const editStatusStepTask = async (idStepTask, newStatus) => {
  try {
    const response = await apiClient.put(
      `/api/stepTasks/${idStepTask}/editStatus`,
      { statusStepTask: newStatus }
    );


    return response.data;
  } catch (error) {
    console.error("Error editing Step Task status:", error);
    throw error;
  }
};

export const getUsers = async () => {
  try {
    const response = await apiClient.get("/api/Users");
    return response.data;
  } catch (error) {
    console.error("Error fetching user list:", error);
    return [];
  }
};



export default {
  login,
  registerUser,
  addTask,
  getTasks,
  getStepTasks,
  addStepTask
};
