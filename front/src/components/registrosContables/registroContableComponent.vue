<script>
import {
  getClients,
  createClient,
  updateClient,
  deleteClient,
  getClientByIdentificacion,
  getClientByRazonSocial
} from "@/services/clientService";

export default {
  data() {
    return {
      clients: [],
      fields: [
        {key: "identificacion", label: "Identificacion"},
        {key: "razonSocial", label: "Razón Social", sortable: true},
        {key: "email", label: "Email", sortable: true},
        {key: "telefono", label: "Teléfono"},
        {key: "actions", label: "Acciones"},
      ],
      items: [
        {text: 'Admin', href: '#'},
        {text: 'Manage', href: '#'},
        {text: 'Library', active: true}
      ],
      clienteActual: {
        razonSocial: '',
        email: '',
        telefono: '',
        identificacion: '',
        direccion: '',
        tipoIdentificacion: '01',
        contribuyenteRimpe: '',
        obligadoContabilidad: 'NO'
      },
      contribuyenteRimpeOptions: [
        {value: '0', text: 'Ninguna'},
        {value: '1', text: 'Contribuyente Régimen RIMPE'},
        {value: '2', text: 'Contribuyente Negocio Popular - Régimen RIMPE'}
      ],
      tipoIdentificacionOptions: [
        {value: '01', text: 'Cédula de ciudadanía'},
        {value: '02', text: 'Cédula de identidad'},
        {value: '03', text: 'Pasaporte'},
        {value: '04', text: 'RUC (Registro Único de Contribuyentes)'},
        {value: '05', text: 'Identificación de extranjeros'},
        {value: '06', text: 'Otros (especificar según normativa)'}
      ],
      obligadoContabilidadOptions: [
        {value: 'SI', text: 'Sí'},
        {value: 'NO', text: 'No'}
      ],
      editMode: false,
      searchQuery: "",
      perPage: 10,
      currentPage: 1,
    };
  },
  computed: {
    paginatedClients() {
      const start = (this.currentPage - 1) * this.perPage;
      const end = start + this.perPage;
      return this.clients.slice(start, end);
    },
  },
  methods: {
    resetSearch() {
      this.searchQuery = "";
      this.fetchClients();
    },
    async fetchClients() {
      try {
        if (this.searchQuery) {
          if (!isNaN(this.searchQuery)) {
            // Si la búsqueda es un número, buscar por identificación
            this.clients = [await getClientByIdentificacion(this.searchQuery)];
          } else {
            // Si es texto, buscar por razón social
            this.clients = await getClientByRazonSocial(this.searchQuery);
          }
        } else {
          // Si no hay búsqueda, obtener todos los clientes
          this.clients = await getClients();
        }
        this.currentPage = 1; // Reiniciar la página al hacer una búsqueda
      } catch (error) {
        console.error("Error al obtener la lista de clientes:", error);
      }
    },
    openModal(mode, client = null) {
      if (mode === 'crear') {
        this.modalTitle = 'Nuevo Cliente';
        this.editMode = false;
        this.clienteActual = {
          razonSocial: '',
          email: '',
          telefono: '',
          identificacion: '',
          direccion: '',
          tipoIdentificacion: '01',
          contribuyenteRimpe: '',
          obligadoContabilidad: 'NO'
        };
      } else if (mode === 'editar') {
        this.modalTitle = 'Editar Cliente';
        this.editMode = true;
        this.clienteActual = {...client}; // Cargar los datos del cliente
      }
      this.$bvModal.show('modal-nuevo-cliente');
    },
    async saveClient() {
      try {
        if (this.editMode) {
          await updateClient(this.clienteActual._id, this.clienteActual); // Actualizar cliente existente
        } else {
          await createClient(this.clienteActual); // Crear nuevo cliente
        }
        this.$bvModal.hide('modal-nuevo-cliente');
        this.fetchClients(); // Recargar la lista de clientes
      } catch (error) {
        console.error("Error al guardar el cliente:", error);
      }
    },
    async deleteClient(clientId) {
      try {
        await deleteClient(clientId);
        this.fetchClients();
      } catch (error) {
        console.error("Error al eliminar el cliente:", error);
      }
    },
  },
  created () {
    this.fetchClients();
  },
};
</script>

<template>
  <b-container fluid>
    <div class="d-flex justify-content-end  mr-4 mt-4">
      <b-breadcrumb :items="items"></b-breadcrumb>
    </div>

    <div class="d-flex justify-content-between align-items-center p-3">
      <div>
        <h2 class="mb-0 text-primary">Lista de Productos</h2>
      </div>
      <b-button variant="primary" class="align-self-center" @click="openModal('crear')">Nuevo cliente</b-button>
    </div>


    <div class="d-flex justify-content-center w-100">
      <div class="row w-100 d-flex justify-content-center align-items-center">
        <div class="col-6">
          <!-- Se cambia el evento @input para que busque en tiempo real -->
          <b-form-input v-model="searchQuery" @input="fetchClients"
                        placeholder="Buscar por razón social o identificación"
                        class="m-1"></b-form-input>
        </div>
        <div class="col-1">
          <!-- Botón de reset de búsqueda -->
          <b-icon icon="x-lg" @click="resetSearch"></b-icon>
        </div>
      </div>
    </div>

    <b-table class="mt-3" :items="paginatedClients" :fields="fields" responsive="sm" striped hover>
      <template #cell(actions)="data">
        <b-button variant="primary" size="sm" @click="openModal('editar', data.item)">Editar</b-button>
        <b-button variant="danger" size="sm" @click="deleteClient(data.item._id)">Eliminar</b-button>
      </template>
    </b-table>

    <b-pagination
        v-model="currentPage"
        :total-rows="clients.length"
        :per-page="perPage"
        align="center"
        class="mt-3"
    ></b-pagination>
    <pre>{{ clients }}</pre>

    <b-modal id="modal-nuevo-cliente" title="Nuevo Cliente" centered size="xl">
      <b-form @submit.stop.prevent="saveNewClient">
        <div class="row mb-3">
          <b-form-group label="Razón Social" label-for="razonSocial" class="col-12">
            <b-form-input v-model="clienteActual.razonSocial" id="razonSocial" required></b-form-input>
          </b-form-group>
        </div>

        <div class="row mb-3">
          <b-form-group label="Email" label-for="email" class="col-12 col-md-6">
            <b-form-input type="email" v-model="clienteActual.email" id="email" required></b-form-input>
          </b-form-group>
          <b-form-group label="Teléfono" label-for="telefono" class="col-12 col-md-6">
            <b-form-input v-model="clienteActual.telefono" id="telefono" required></b-form-input>
          </b-form-group>
        </div>

        <div class="row mb-3">
          <b-form-group label="Identificación" label-for="identificacion" class="col-12 col-md-6">
            <b-form-input v-model="clienteActual.identificacion" id="identificacion" required></b-form-input>
          </b-form-group>
          <b-form-group label="Dirección" label-for="direccion" class="col-12 col-md-6">
            <b-form-input v-model="clienteActual.direccion" id="direccion" required></b-form-input>
          </b-form-group>
        </div>

        <div class="row mb-3">
          <b-form-group label="Tipo de Identificación" label-for="tipoIdentificacion" class="col-12 col-md-6">
            <b-form-select class="form-select" v-model="clienteActual.tipoIdentificacion" id="tipoIdentificacion"
                           :options="tipoIdentificacionOptions" required></b-form-select>
          </b-form-group>
          <b-form-group label="Contribuyente RIMPE" label-for="contribuyenteRimpe" class="col-12 col-md-6">
            <b-form-select v-model="clienteActual.contribuyenteRimpe" id="contribuyenteRimpe" class="form-select w-100"
                           :options="contribuyenteRimpeOptions" required>
              <option value="" disabled>Seleccione el tipo de contribuyente</option>
            </b-form-select>
          </b-form-group>
        </div>

        <div class="row mb-3">
          <b-form-group label="Obligado a llevar Contabilidad" label-for="obligadoContabilidad" class="col-12 col-md-6">
            <b-form-select class="form-select" v-model="clienteActual.obligadoContabilidad" id="obligadoContabilidad"
                           :options="obligadoContabilidadOptions" required></b-form-select>
          </b-form-group>
        </div>
      </b-form>

      <template #modal-footer>
        <b-button variant="secondary" @click="$bvModal.hide('modal-nuevo-cliente')">Cancelar</b-button>
        <b-button variant="primary" @click="saveClient">Guardar</b-button>
      </template>
    </b-modal>
  </b-container>
</template>

