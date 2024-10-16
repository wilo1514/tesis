<script>
import {
  getClients,
  createClient,
  updateClient,
  deleteClient,
  getClientByIdentificacion,
  getClientByRazonSocial
} from "@/services/clientService";
import * as XLSX from "xlsx";

export default {
  props:{ flagInvoice: Boolean},
  data() {
    return {
      clients: [],
      fields: [
        {key: "index", label: "N"},
        {key: "identificacion", label: "Identificacion"},
        {key: "razonSocial", label: "Razón Social", sortable: true},
        {key: "email", label: "Email", sortable: true},
        {key: "telefono", label: "Teléfono"},
        {key: "obligadoContabilidad", label: "Obligado Contabilidad", sortable: true}
      ],
      items: [
        {text: 'Clientes', href: '#'},
        {text: 'Lista de clientes', active: true}
      ],
      clienteActual: {
        razonSocial: '',
        email: '',
        telefono: '',
        identificacion: '',
        direccion: '',
        tipoIdentificacion: '05',
        contribuyenteRimpe: '',
        obligadoContabilidad: 'NO'
      },
      contribuyenteRimpeOptions: [
        {value: '0', text: 'Ninguna'},
        {value: '1', text: 'Contribuyente Régimen RIMPE'},
        {value: '2', text: 'Contribuyente Negocio Popular - Régimen RIMPE'}
      ],
      tipoIdentificacionOptions: [
        {value: '05', text: 'Cédula de ciudadanía'},
        {value: '05', text: 'Cédula de identidad'},
        {value: '06', text: 'Pasaporte'},
        {value: '04', text: 'RUC (Registro Único de Contribuyentes)'},
        {value: '08', text: 'Identificación de extranjeros'},
        {value: '00', text: 'Otros (especificar según normativa)'}
      ],
      obligadoContabilidadOptions: [
        {value: 'SI', text: 'Sí'},
        {value: 'NO', text: 'No'}
      ],
      editMode: false,
      searchQuery: "",
      perPage: 10,
      currentPage: 1,
      modalTitle: '',
      file: null,
      importMessage: '',
      failedClientsData: [],

    };
  },
  computed: {
    filteredClients() {
      if (this.searchQuery) {
        return this.clients.filter((client) => {
          return (
              client.identificacion
                  .toLowerCase()
                  .includes(this.searchQuery.toLowerCase()) ||
              client.razonSocial
                  .toLowerCase()
                  .includes(this.searchQuery.toLowerCase()) ||
              client.email.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
              client.telefono
                  .toLowerCase()
                  .includes(this.searchQuery.toLowerCase())
          );
        });
      }
      return this.clients;
    },
    paginatedClients() {
      const start = (this.currentPage - 1) * this.perPage;
      const end = start + this.perPage;
      return this.filteredClients.slice(start, end);
    },
    selectedFile: {
      get() {
        return this.file; // Retorna el archivo seleccionado
      },
      set(file) {
        this.file = file; // Actualiza el archivo seleccionado
      }
    },
    computedFields() {
      // Si flagInvoice es false, agregar la columna 'actions'
      if (!this.flagInvoice) {
        return [...this.fields, { key: "actions", label: "Acciones" }];
      }
      // Si flagInvoice es true, no agregar la columna 'actions'
      return this.fields;
    }

  },
  methods: {

    downloadFailedClients() {
      if (this.failedClientsData.length === 0) {
        this.importMessage = "No hay clientes fallidos para descargar.";
        return;
      }
      this.importMessage = "";
      // Crear el archivo Excel con los clientes fallidos
      const ws = XLSX.utils.json_to_sheet(this.failedClientsData); // Convierte los datos de clientes fallidos en una hoja de Excel
      const wb = XLSX.utils.book_new(); // Crea un nuevo libro de Excel
      XLSX.utils.book_append_sheet(wb, ws, "Clientes Fallidos"); // Agregar la hoja con el nombre "Clientes Fallidos"

      // Descargar el archivo Excel con el nombre 'clientes_fallidos.xlsx'
      XLSX.writeFile(wb, "clientes_fallidos.xlsx");
    },
    resetSearch() {
      this.searchQuery = "";
      this.fetchClients();
    },

    fileInputChange(event) {
      this.file = event.target.files[0]; // Guardar el archivo seleccionado
      this.importMessage = ''; // Resetear el mensaje cuando se selecciona un archivo
    },
    showModalImport() {
      this.$refs['my-modal-import'].show()
    },
    hideModalImport() {
      this.importMessage = "";
      this.$refs['my-modal-import'].hide()
    },

    getMappedClientData() {
      // Crear un mapa de los valores a su respectivo texto para tipoIdentificacion y contribuyenteRimpe
      const tipoIdentificacionMap = this.tipoIdentificacionOptions.reduce((map, option) => {
        map[option.value] = option.text;
        return map;
      }, {});

      const contribuyenteRimpeMap = this.contribuyenteRimpeOptions.reduce((map, option) => {
        map[option.value] = option.text;
        return map;
      }, {});

      // Mapear los valores de cada cliente a su correspondiente texto
      return this.filteredClients.map(client => ({
        Identificación: client.identificacion,
        "Razón Social": client.razonSocial,
        Email: client.email,
        Teléfono: client.telefono,
        Dirección: client.direccion,
        "Tipo de Identificación": tipoIdentificacionMap[client.tipoIdentificacion] || client.tipoIdentificacion,
        "Contribuyente RIMPE": contribuyenteRimpeMap[client.contribuyenteRimpe] || client.contribuyenteRimpe,
        "Obligado Contabilidad": client.obligadoContabilidad === 'SI' ? 'Sí' : 'No',
      }));
    },
    exportToExcel() {
      const data = this.getMappedClientData(); // Obtener los datos ya mapeados

      const ws = XLSX.utils.json_to_sheet(data); // Convierte los datos a una hoja de Excel
      const wb = XLSX.utils.book_new(); // Crea un nuevo libro de Excel
      XLSX.utils.book_append_sheet(wb, ws, "Clientes"); // Agrega la hoja al libro

      XLSX.writeFile(wb, "clientes.xlsx"); // Genera y descarga el archivo Excel
    },


    async importFromExcel() {
      if (!this.file) {
        this.importMessage = "Por favor selecciona un archivo primero";
        return;
      }

      try {
        const file = this.file;
        const data = await file.arrayBuffer(); // Leer el archivo
        const workbook = XLSX.read(data); // Leer el archivo Excel
        const sheet = workbook.Sheets[workbook.SheetNames[0]]; // Obtener la primera hoja
        const jsonData = XLSX.utils.sheet_to_json(sheet); // Convertir a JSON

        let successfullyAdded = 0;
        let failedClients = 0; // Contador de clientes fallidos (errores)
        this.failedClientsData = []; // Array para almacenar los datos de clientes fallidos

        // Procesar los datos y crear los clientes
        for (const clientData of jsonData) {
          const newClient = {
            razonSocial: clientData.razonSocial || '',
            email: clientData.email || '',
            telefono: clientData.telefono || '',
            identificacion: clientData.identificacion || '',
            direccion: clientData.direccion || '',
            tipoIdentificacion: clientData.tipoIdentificacion || '01',
            contribuyenteRimpe: clientData.contribuyenteRimpe || '0',
            obligadoContabilidad: clientData.obligadoContabilidad || 'NO'
          };

          // Validar si los campos requeridos están presentes
          if (!newClient.razonSocial || !newClient.email || !newClient.identificacion) {
            console.warn("Faltan datos obligatorios para el cliente:", newClient);
            failedClients++; // Contar los fallidos debido a datos incompletos
            this.failedClientsData.push(newClient); // Agregar cliente fallido a la lista
            continue; // Saltar este cliente si faltan datos
          }

          try {
            // Intentar crear un nuevo cliente
            await createClient(newClient);
            successfullyAdded++; // Incrementar el contador de clientes agregados exitosamente
          } catch (error) {
            console.error("Error al crear el cliente:", error.response ? error.response.data.message : error);
            failedClients++; // Contar los errores
            this.failedClientsData.push(newClient); // Agregar cliente fallido a la lista
          }
        }

        // Actualizar el mensaje de éxito o error basado en los resultados de la importación
        if (successfullyAdded > 0) {
          // Mostrar cuántos clientes fueron cargados y cuántos fallaron
          this.importMessage = `Se cargaron ${successfullyAdded} clientes exitosamente. <br> No se cargaron ${failedClients} clientes.`;
        } else {
          // Si no se cargó ninguno, mostrar mensaje de error
          this.importMessage = `No se cargó ninguno. Los ${failedClients} clientes ya existen o tienen errores.`;
        }

        // Refrescar la lista de clientes después de la importación
        this.fetchClients();

      } catch (error) {
        this.importMessage = "Error al importar clientes desde Excel. Verifica el archivo y vuelve a intentarlo.";
        console.error("Error al importar clientes desde Excel:", error);
      }
    },


    downloadFormatoImportar() {
      const data = [
        {
          razonSocial: 'Cliente A',
          email: 'clienteA@example.com',
          telefono: '0991234567',
          identificacion: '0123456789',
          direccion: 'Direccion 1',
          tipoIdentificacion: '05',
          contribuyenteRimpe: '0',
          obligadoContabilidad: 'SI'
        },
        {
          razonSocial: 'Cliente B',
          email: 'clienteB@example.com',
          telefono: '0997654321',
          identificacion: '0123456790',
          direccion: 'Direccion 2',
          tipoIdentificacion: '05',
          contribuyenteRimpe: '0',
          obligadoContabilidad: 'SI'
        },
        {
          razonSocial: 'Cliente C',
          email: 'clienteC@example.com',
          telefono: '0992345678',
          identificacion: '0123456791',
          direccion: 'Direccion 3',
          tipoIdentificacion: '05',
          contribuyenteRimpe: '0',
          obligadoContabilidad: 'SI'
        }
      ];

      const ws = XLSX.utils.json_to_sheet(data); // Convierte los datos en una hoja de Excel
      const wb = XLSX.utils.book_new(); // Crea un nuevo libro de Excel
      XLSX.utils.book_append_sheet(wb, ws, "Formato Clientes"); // Agrega la hoja al libro con el nombre "Formato Clientes"

      // Descargar el archivo Excel con el nombre 'formato_importar_clientes.xlsx'
      XLSX.writeFile(wb, "formato_importar_clientes.xlsx");
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
    resetClient() {

      this.clienteActual = {
        razonSocial: '',
        email: '',
        telefono: '',
        identificacion: '',
        direccion: '',
        tipoIdentificacion: '05',
        contribuyenteRimpe: '',
        obligadoContabilidad: 'NO'
      };
    },


    async saveClient() {
      try {
        if (this.editMode) {
          await updateClient(this.clienteActual._id, this.clienteActual); // Actualizar cliente existente
        } else {
          await createClient(this.clienteActual); // Crear nuevo cliente
        }
        this.resetClient()
        this.hideModal();

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
    showModalNew() {

      this.editMode = false;
      this.resetClient();
      console.log("abrir modal", this.clienteActual)
      this.$refs['my-modal'].show()
    },
    showModalEdit(data) {

      this.editMode = true;
      this.clienteActual = {...data};
      console.log("abrir modal", this.clienteActual)
      this.$refs['my-modal'].show()
    },
    hideModal() {
      this.editMode = false;
      this.resetClient();
      this.$refs['my-modal'].hide()
      console.log("ocultar modal", this.clienteActual)
    },

    rowClicked(client) {
      // Aquí puedes emitir un evento o manejar la acción con la data
      console.log("Fila seleccionada:", client);
      this.$emit('clientSelected', client); // Emitir el cliente seleccionado
    },

  },

  created() {
    this.fetchClients();
  },


};
</script>

<template>
  <b-container fluid>
    <div class="d-flex justify-content-end  mr-4 mt-4" v-if="!flagInvoice">
      <b-breadcrumb :items="items"></b-breadcrumb>
    </div>

    <div class="d-flex justify-content-between align-items-center p-3 " v-if="!flagInvoice">
      <div>
        <h2 class="mb-0 text-primary">Lista de Clientes</h2>
      </div>
      <div>
{{flagInvoice}}
        <b-button variant="primary" class="align-self-center m-2" @click="showModalNew">
          Nuevo cliente</b-button>

      </div>
    </div>

    <div class="d-flex justify-content-center w-100">
      <b-row class="w-100 d-flex justify-content-center align-items-center">
        <b-col lg="6">
          <b-form-input
              v-model="searchQuery"
              placeholder="Buscar"
              class="m-1"
          ></b-form-input>
        </b-col>
        <b-col lg="1">
          <b-icon icon="x-lg" @click="resetSearch"></b-icon>

        </b-col>
        <b-col class="text-end" v-if="!flagInvoice">


          <b-button variant="outline-secondary" class="m-1" size="sm" @click="showModalImport"> Importar
            <b-icon icon="file-excel" variant="success"></b-icon>
          </b-button>

          <b-button variant="outline-secondary" size="sm" @click="exportToExcel"> Exportar
            <b-icon icon="file-excel" variant="success"></b-icon>
          </b-button>

        </b-col>


      </b-row>
    </div>

    <b-table class="mt-3" :items="paginatedClients" :fields="computedFields" responsive="sm" striped hover     @row-clicked="rowClicked" >

      <template #cell(index)="data">
        {{ (currentPage - 1) * perPage + data.index + 1 }}
      </template>
      <template #cell(obligadoContabilidad)="data">
        <div class="d-flex justify-content-center align-items-center w-100" >

          <b-icon icon="circle-fill" variant="success" v-if="data.item.obligadoContabilidad === 'SI'"></b-icon>
          <b-icon v-else icon="circle-fill" variant="danger"></b-icon>
        </div>
      </template>


      <template #cell(actions)="data" v-if="!flagInvoice">
        <b-button variant="primary" size="sm" @click="showModalEdit(data.item)">Editar</b-button>
        <b-button variant="danger" size="sm" @click="deleteClient(data.item._id)">Eliminar</b-button>
      </template>
    </b-table>

    <b-pagination
        v-model="currentPage"
        :total-rows="filteredClients.length"
        :per-page="perPage"
        align="center"
        class="mt-3"
    ></b-pagination>

    <b-modal ref="my-modal" :title="editMode?'Edita cliente':'Nuevo cliente' " size="xl" centered hide-header-close>


      <b-form @submit.stop.prevent="saveClient">
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

        <b-button class="mt-2" variant="outline-secondary" block @click="hideModal">Cancelar</b-button>
        <b-button class="mt-2" v-if="!editMode" variant="outline-success" block @click="saveClient">Guardar cliente
        </b-button>
        <b-button class="mt-2" v-if="editMode" variant="outline-success" block @click="saveClient">Actualizar cliente
        </b-button>

      </template>
    </b-modal>

    <b-modal ref="my-modal-import" title="Importar clientes" centered hide-header-close>
      <div class="d-block text-center">
        <div class="mb-3">


          <!-- Input para cargar el archivo Excel -->
          <input class="form-control" type="file" id="formFile" @change="fileInputChange">

          <span v-if="importMessage" class="text-danger" v-html="importMessage"></span>
          <div v-if="failedClientsData.length > 0" class="mt-1">
            <b-button variant="danger" size="sm" @click="downloadFailedClients"> Descargar clientes fallidos
              <b-icon icon="download" variant="danger"></b-icon>
            </b-button>
          </div>
          <hr>
          <b-button variant="light" size="sm" @click="downloadFormatoImportar"> Descargar plantilla
            <b-icon icon="download" variant="success"></b-icon>
          </b-button>

        </div>
      </div>

      <template #modal-footer>
        <b-button class="mt-2" variant="outline-secondary" block @click="hideModalImport">Cancelar</b-button>
        <b-button class="mt-2" variant="outline-success" block @click="importFromExcel">Cargar clientes</b-button>
      </template>
    </b-modal>
  </b-container>
</template>

<style scoped>
/* Estilos para hacer la fila clicable */
.rowClass{
  cursor: pointer;
}

.rowClass:hover {
  background-color: #f5f5f5;
}
</style>