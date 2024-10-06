<template>
    <b-container fluid>
      <h2 class="my-4">Dashboard Principal</h2>
  
      <!-- Tarjetas de estadísticas -->
      <b-row>
        <b-col md="4">
          <b-card bg-variant="primary" text-variant="white" title="Total de Clientes" class="text-center">
            <b-card-text>{{ totalClients }}</b-card-text>
          </b-card>
        </b-col>
  
       
      </b-row>
  
      <!-- Gráficos o listas -->
      
    </b-container>
  </template>
  
  <script>
  import { getClients } from "@/services/clientService";
  
  export default {
    data() {
      return {
        totalClients: 0,
        completedTasks: 10, // Valores ficticios, reemplazar con datos reales
        pendingTasks: 5,
        tasks: [],
        taskFields: [
          { key: "name", label: "Nombre de la Tarea", sortable: true },
          { key: "status", label: "Estado", sortable: true },
        ],
      };
    },
    async created() {
      // Llamada a la API para obtener los clientes y tareas
      this.fetchDashboardData();
    },
    methods: {
      async fetchDashboardData() {
        try {
          const clients = await getClients();
          this.totalClients = clients.length;
        } catch (error) {
          console.error("Error al cargar los datos del dashboard:", error);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  h2 {
    text-align: center;
  }
  
  b-card {
    margin-bottom: 20px;
  }
  </style>
  