<script>
import {
  getSuppliers, createSupplier, getSupplierById, updateSupplier, deleteSupplier
} from "@/services/supplierService";
import * as XLSX from "xlsx";
import Select2 from 'v-select2-component';
import Swal from "sweetalert2";

export default {
  props: {flagInvoice: Boolean},
  components: {Select2},
  data() {
    return {
      suppliers: [],
      fields: [
        {key: "index", label: "N", tdClass: "text-center"},
        {key: "razonSocial", label: "Razón Social"},
        {key: "email", label: "Correo Electrónico"},
        {key: "telefono", label: "Teléfono", tdClass: "text-center"},
        {key: "identificacion", label: "Identificación", tdClass: "text-center"},
        {key: "direccion", label: "Dirección"},
        // {key: 'tipoIdentificacion', label: 'Tipo de Identificación', tdClass: "text-center", sortable: true},
        //{key: 'regimen', label: 'Régimen', tdClass: "text-center"},
        {key: 'obligadoContabilidad', label: 'Obligado Contabilidad', tdClass: "text-center"},
      ],
      items: [
        {text: 'Proveedores', href: '#'},
        {text: 'Lista de proveedores', active: true}
      ],
      proveedorActual: {
        razonSocial: '',
        email: '',
        telefono: '',
        identificacion: '',
        direccion: '',
        tipoIdentificacion: '02',
        regimen: 'General',
        obligadoContabilidad: ''
      },
      editMode: false,
      searchQuery: "",
      perPage: 5,
      currentPage: 1,
      modalTitle: '',
      file: null,
      importMessage: '',
      failedSuppliersData: [],
    };
  },
  computed: {
    filteredSuppliers() {
      if (this.searchQuery) {
        return this.suppliers.filter((supplier) => {
          return (
              supplier.razonSocial
                  .toLowerCase()
                  .includes(this.searchQuery.toLowerCase()) ||
              supplier.identificacion
                  .toLowerCase()
                  .includes(this.searchQuery.toLowerCase())
          );
        });
      }
      return this.suppliers;
    },
    paginatedSuppliers() {
      const start = (this.currentPage - 1) * this.perPage;
      const end = start + this.perPage;
      return this.filteredSuppliers.slice(start, end);
    },
    computedFields() {
      // Si flagInvoice es false, agregar la columna 'actions'
      if (!this.flagInvoice) {
        return [...this.fields, {key: "actions", label: "Acciones"}];
      }
      // Si flagInvoice es true, no agregar la columna 'actions'
      return this.fields;
    }
  },
  methods: {
    rowClicked(client) {
      // Aquí puedes emitir un evento o manejar la acción con la data
      console.log("Fila seleccionada:", client);
      this.$emit('supplierSelected', client); // Emitir el cliente seleccionado
    },

    showSuccessAlertDeleted(clientName) {
      Swal.fire({
        title: '¡Eliminado!',
        text: `El cliente "${clientName}" ha sido eliminado correctamente.`,
        icon: 'success',
        timer: 2500,
        showConfirmButton: false
      });
    },

    showErrorAlertDeleted(clientName) {
      Swal.fire({
        title: 'Error',
        text: `No se pudo eliminar al cliente "${clientName}".`,
        icon: 'error',
        confirmButtonText: 'Intentar de nuevo'
      });
    },

    showSuccessAlert(name, action) {
      Swal.fire({
        title: '¡Correcto!',
        text: `El ${name} se ha ${action}.`,
        icon: 'success',
        timer: 2500,
        showConfirmButton: false
      });
    },

    // Alerta de error
    showErrorAlert() {
      Swal.fire({
        title: '¡Error!',
        text: 'Ocurrió un problema durante la operación.',
        icon: 'error',
        confirmButtonText: 'Intentar de nuevo'
      });
    },

    async fetchSuppliers() {
      try {
        if (this.searchQuery) {
          // Si hay búsqueda, obtener los proveedores que coinciden con la búsqueda
        } else {
          // Si no hay búsqueda, obtener todos los proveedores
          this.suppliers = await getSuppliers();
        }
        this.currentPage = 1; // Reiniciar la página al hacer una búsqueda
      } catch (error) {
        console.error("Error al obtener la lista de proveedores:", error);
      }
    },
    resetSupplier() {
      this.proveedorActual = {
        razonSocial: '',
        email: '',
        telefono: '',
        identificacion: '',
        direccion: '',
        tipoIdentificacion: '02',
        regimen: 'General',
        obligadoContabilidad: ''
      };
    },
    async saveSupplier() {
      try {
        if (this.editMode) {
          this.showSuccessAlert('proveedor', 'actualizado');
          await updateSupplier(this.proveedorActual._id, this.proveedorActual); // Actualizar proveedor existente
        } else {
          this.showSuccessAlert('proveedor', 'creado');
          await createSupplier(this.proveedorActual); // Crear nuevo proveedor
        }
        this.resetSupplier();
        this.hideModal();
        this.fetchSuppliers(); // Recargar la lista de proveedores
      } catch (error) {
        this.showErrorAlert();
        console.error("Error al guardar el proveedor:", error);
      }
    },
    async deleteSupplier(supplier) {
      // Mostrar alerta de confirmación antes de eliminar
      Swal.fire({
        title: '¡Alerta!',
        text: `¿Quieres eliminar al proveedor "${supplier.razonSocial}"?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: 'gray',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            // Intentar eliminar el proveedor si se confirma
            await deleteSupplier(supplier._id);
            this.fetchSuppliers(); // Recargar lista de proveedores
            this.showSuccessAlertDeleted(supplier.razonSocial);
          } catch (error) {
            console.error("Error al eliminar el proveedor:", error);
            this.showErrorAlertDeleted();
          }
        }
      });
    },

    showModalNew() {
      this.editMode = false;
      this.resetSupplier();
      this.$refs['modal-proveedor'].show();
    },
    showModalEdit(data) {
      this.editMode = true;
      this.proveedorActual = {...data};
      this.$refs['modal-proveedor'].show();
    },
    hideModal() {
      this.editMode = false;
      this.resetSupplier();
      this.$refs['modal-proveedor'].hide();
    },
    resetSearch() {
      this.searchQuery = "";
      this.fetchSuppliers();
    }
  },
  created() {
    this.fetchSuppliers();
  },
};
</script>

<template>
  <b-container fluid>
    <div class="d-flex justify-content-end  mr-4 mt-4" v-if="!flagInvoice">
      <b-breadcrumb class="m-0 p-0" :items="items"></b-breadcrumb>
    </div>

    <div class="d-flex justify-content-between align-items-center p-3" v-if="!flagInvoice">
      <div>
        <h2 class="mb-0 text-primary">Lista de Proveedores</h2>
      </div>
      <div>
        <b-button variant="primary" class="align-self-center m-2" @click="showModalNew">Nuevo proveedor</b-button>
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
      </b-row>
    </div>

    <b-table class="mt-3" :items="paginatedSuppliers" :fields="computedFields" responsive="sm" hover
             @row-clicked="rowClicked">
      <template #cell(index)="data">
        {{ (currentPage - 1) * perPage + data.index + 1 }}
      </template>
      <template #cell(actions)="data" v-if="!flagInvoice">
        <b-button variant="primary" size="sm" @click="showModalEdit(data.item)">Editar</b-button>
        <b-button variant="danger" size="sm" @click="deleteSupplier(data.item)">Eliminar</b-button>
      </template>
    </b-table>

    <b-pagination
        v-model="currentPage"
        :total-rows="filteredSuppliers.length"
        :per-page="perPage"
        align="center"
        class="mt-3"
    ></b-pagination>

    <b-modal ref="modal-proveedor" :title="editMode ? 'Editar Proveedor' : 'Nuevo Proveedor'" size="lg" centered
             hide-header-close>
      <b-form @submit.stop.prevent="saveSupplier">
        <b-row>
          <b-col lg="6">
            <b-form-group label="Razón Social" label-for="razonSocial" class="col-12">
              <b-form-input v-model="proveedorActual.razonSocial" id="razonSocial" required></b-form-input>
            </b-form-group>
          </b-col>
          <b-col lg="6">
            <b-form-group label="Correo Electrónico" label-for="email" class="col-12">
              <b-form-input type="email" v-model="proveedorActual.email" id="email" required></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>

        <b-row>
          <b-col lg="6">
            <b-form-group label="Teléfono" label-for="telefono">
              <b-form-input type="text" v-model="proveedorActual.telefono" id="telefono" required></b-form-input>
            </b-form-group>
          </b-col>
          <b-col lg="6">
            <b-form-group label="Identificación" label-for="identificacion">
              <b-form-input type="text" v-model="proveedorActual.identificacion" id="identificacion"
                            required></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>

        <b-row>
          <b-col lg="6">
            <b-form-group label="Dirección" label-for="direccion">
              <b-form-input type="text" v-model="proveedorActual.direccion" id="direccion" required></b-form-input>
            </b-form-group>
          </b-col>
          <b-col lg="3">
            <b-form-group label="Tipo de Identificación" label-for="tipoIdentificacion">
              <b-form-input type="text" v-model="proveedorActual.tipoIdentificacion" id="tipoIdentificacion" required
                            disabled></b-form-input>
            </b-form-group>
          </b-col>
          <b-col lg="3">
            <b-form-group label="Régimen" label-for="regimen">
              <b-form-input type="text" v-model="proveedorActual.regimen" id="regimen" required disabled></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>

        <b-row>
          <b-col lg="6">
            <b-form-group label="Obligado Contabilidad" label-for="obligadoContabilidad">
              <b-form-select class="form-control" v-model="proveedorActual.obligadoContabilidad" :options="['SI', 'NO']"
                             required></b-form-select>
            </b-form-group>
          </b-col>
        </b-row>
      </b-form>

      <template #modal-footer>
        <b-button class="mt-2" variant="outline-secondary" block @click="hideModal">Cancelar</b-button>
        <b-button class="mt-2" v-if="!editMode" variant="outline-success" block @click="saveSupplier">Guardar
          proveedor
        </b-button>
        <b-button class="mt-2" v-if="editMode" variant="outline-success" block @click="saveSupplier">Actualizar
          proveedor
        </b-button>
      </template>
    </b-modal>
  </b-container>
</template>
