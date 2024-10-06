<template>
    <div>
      <h2>Lista de Clientes</h2>

      <b-table :items="clients" :fields="fields" responsive="sm" striped hover>
        <template #cell(actions)="data">
          <b-button variant="primary" size="sm" @click="editClient(data.item)">Editar</b-button>
          <b-button variant="danger" size="sm" @click="deleteClient(data.item._id)">Eliminar</b-button>
        </template>
      </b-table>
    </div>
  </template>
  
  <script>
  import { getClients, deleteClient } from "@/services/clientService";
  
  export default {
    data() {
      return {
        clients: [],
        fields: [
          { key: "razonSocial", label: "Razón Social", sortable: true },
          { key: "email", label: "Email", sortable: true },
          { key: "telefono", label: "Teléfono" },
          { key: "actions", label: "Acciones" },
        ],
      };
    },
    async created() {
      await this.fetchClients();
    },
    methods: {
      async fetchClients() {
        try {
          this.clients = await getClients();
        } catch (error) {
          console.error("Error al obtener la lista de clientes:", error);
        }
      },
      async deleteClient(clientId) {
        try {
          await deleteClient(clientId);
          this.fetchClients(); // Actualizar la lista de clientes después de eliminar uno
        } catch (error) {
          console.error("Error al eliminar el cliente:", error);
        }
      },
      editClient(client) {
        // Lógica para editar un cliente
        console.log("Editar cliente:", client);
      },
    },
  };
  </script>
  