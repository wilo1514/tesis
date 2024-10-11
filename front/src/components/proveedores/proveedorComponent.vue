<template>
  <b-container fluid>
    <div class="d-flex justify-content-end mr-4 mt-4">
      <b-breadcrumb :items="items"></b-breadcrumb>
    </div>

    <div class="d-flex justify-content-between align-items-center p-3">
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
              placeholder="Buscar por nombre, RUC o email"
              class="m-1"
          ></b-form-input>
        </b-col>
        <b-col lg="1">
          <b-icon icon="x-lg" @click="resetSearch"></b-icon>
        </b-col>
        <b-col class="text-end">
          <b-button variant="outline-secondary" class="m-1" size="sm" @click="showModalImport">
            Importar
            <b-icon icon="file-excel" variant="success"></b-icon>
          </b-button>

          <b-button variant="outline-secondary" size="sm" @click="exportToExcel">
            Exportar
            <b-icon icon="file-excel" variant="success"></b-icon>
          </b-button>
        </b-col>
      </b-row>
    </div>

    <b-table class="mt-3" :items="paginatedSuppliers" :fields="fields" responsive="sm" striped hover>
      <template #cell(index)="data">
        {{ (currentPage - 1) * perPage + data.index + 1 }}
      </template>

      <template #cell(actions)="data">
        <b-button variant="primary" size="sm" @click="showModalEdit(data.item)">Editar</b-button>
        <b-button variant="danger" size="sm" @click="deleteSupplier(data.item._id)">Eliminar</b-button>
      </template>
    </b-table>

    <b-pagination
        v-model="currentPage"
        :total-rows="filteredSuppliers.length"
        :per-page="perPage"
        align="center"
        class="mt-3"
    ></b-pagination>

    <b-modal ref="my-modal" :title="editMode ? 'Editar Proveedor' : 'Nuevo Proveedor'" size="xl" centered hide-header-close>
      <b-form @submit.stop.prevent="saveSupplier">
        <div class="row mb-3">
          <b-form-group label="Nombre" label-for="name" class="col-12">
            <b-form-input v-model="proveedorActual.name" id="name" required></b-form-input>
          </b-form-group>
        </div>

        <div class="row mb-3">
          <b-form-group label="Email" label-for="email" class="col-12 col-md-6">
            <b-form-input type="email" v-model="proveedorActual.email" id="email" required></b-form-input>
          </b-form-group>
          <b-form-group label="Teléfono" label-for="phone" class="col-12 col-md-6">
            <b-form-input v-model="proveedorActual.phone" id="phone"></b-form-input>
          </b-form-group>
        </div>

        <div class="row mb-3">
          <b-form-group label="RUC" label-for="ruc" class="col-12">
            <b-form-input v-model="proveedorActual.ruc" id="ruc" required></b-form-input>
          </b-form-group>
        </div>
      </b-form>

      <template #modal-footer>
        <b-button class="mt-2" variant="outline-secondary" block @click="hideModal">Cancelar</b-button>
        <b-button class="mt-2" v-if="!editMode" variant="outline-success" block @click="saveSupplier">Guardar proveedor</b-button>
        <b-button class="mt-2" v-if="editMode" variant="outline-success" block @click="saveSupplier">Actualizar proveedor</b-button>
      </template>
    </b-modal>

    <b-modal ref="my-modal-import" title="Importar proveedores" centered hide-header-close>
      <div class="d-block text-center">
        <div class="mb-3">
          <input class="form-control" type="file" id="formFile" @change="fileInputChange">
          <span v-if="importMessage" class="text-danger" v-html="importMessage"></span>
          <div v-if="failedSuppliersData.length > 0" class="mt-1">
            <b-button variant="danger" size="sm" @click="downloadFailedSuppliers">
              Descargar proveedores fallidos
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
        <b-button class="mt-2" variant="outline-success" block @click="importFromExcel">Cargar proveedores</b-button>
      </template>
    </b-modal>
  </b-container>
</template>

<script>
import {
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier
} from "@/services/supplierService";
import * as XLSX from "xlsx";

export default {
  data() {
    return {
      suppliers: [],
      fields: [
        { key: "index", label: "N" },
        { key: "ruc", label: "RUC" },
        { key: "name", label: "Nombre", sortable: true },
        { key: "email", label: "Email", sortable: true },
        { key: "phone", label: "Teléfono" },
        { key: "actions", label: "Acciones" }
      ],
      items: [
        { text: 'Proveedores', href: '#' },
        { text: 'Lista de proveedores', active: true }
      ],
      proveedorActual: {
        name: '',
        email: '',
        phone: '',
        ruc: ''
      },
      editMode: false,
      searchQuery: "",
      perPage: 10,
      currentPage: 1,
      modalTitle: '',
      file: null,
      importMessage: '',
      failedSuppliersData: []
    };
  },
  computed: {
    filteredSuppliers() {
      if (this.searchQuery) {
        return this.suppliers.filter((supplier) => {
          return (
              supplier.ruc.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
              supplier.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
              supplier.email.toLowerCase().includes(this.searchQuery.toLowerCase())
          );
        });
      }
      return this.suppliers;
    },
    paginatedSuppliers() {
      const start = (this.currentPage - 1) * this.perPage;
      const end = start + this.perPage;
      return this.filteredSuppliers.slice(start, end);
    }
  },
  methods: {
    exportToExcel() {
      const data = this.suppliers.map(supplier => ({
        Nombre: supplier.name,
        Email: supplier.email,
        Teléfono: supplier.phone,
        RUC: supplier.ruc
      }));

      const ws = XLSX.utils.json_to_sheet(data); // Convierte los datos a una hoja de Excel
      const wb = XLSX.utils.book_new(); // Crea un nuevo libro de Excel
      XLSX.utils.book_append_sheet(wb, ws, "Proveedores"); // Agrega la hoja al libro

      // Descargar el archivo Excel con el nombre 'proveedores.xlsx'
      XLSX.writeFile(wb, "proveedores.xlsx");
    },
    downloadFailedSuppliers() {
      if (this.failedSuppliersData.length === 0) {
        this.importMessage = "No hay proveedores fallidos para descargar.";
        return;
      }
      this.importMessage = "";
      const ws = XLSX.utils.json_to_sheet(this.failedSuppliersData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Proveedores Fallidos");
      XLSX.writeFile(wb, "proveedores_fallidos.xlsx");
    },
    resetSearch() {
      this.searchQuery = "";
      this.fetchSuppliers();
    },
    fileInputChange(event) {
      this.file = event.target.files[0];
      this.importMessage = '';
    },
    showModalImport() {
      this.$refs['my-modal-import'].show();
    },
    hideModalImport() {
      this.importMessage = "";
      this.$refs['my-modal-import'].hide();
    },
    downloadFormatoImportar() {
      const data = [
        { name: 'Proveedor A', email: 'proveedorA@example.com', phone: '0991234567', ruc: '0123456789' },
        { name: 'Proveedor B', email: 'proveedorB@example.com', phone: '0997654321', ruc: '0123456790' },
        { name: 'Proveedor C', email: 'proveedorC@example.com', phone: '0992345678', ruc: '0123456791' }
      ];

      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Formato Proveedores");
      XLSX.writeFile(wb, "formato_importar_proveedores.xlsx");
    },
    async importFromExcel() {
      if (!this.file) {
        this.importMessage = "Por favor selecciona un archivo primero";
        return;
      }

      try {
        const file = this.file;
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        let successfullyAdded = 0;
        let failedSuppliers = 0;
        this.failedSuppliersData = [];

        for (const supplierData of jsonData) {
          const newSupplier = {
            name: supplierData.name || '',
            email: supplierData.email || '',
            phone: supplierData.phone || '',
            ruc: supplierData.ruc || ''
          };

          if (!newSupplier.name || !newSupplier.email || !newSupplier.ruc) {
            console.warn("Faltan datos obligatorios para el proveedor:", newSupplier);
            failedSuppliers++;
            this.failedSuppliersData.push(newSupplier);
            continue;
          }

          try {
            await createSupplier(newSupplier);
            successfullyAdded++;
          } catch (error) {
            console.error("Error al crear el proveedor:", error.response ? error.response.data.message : error);
            failedSuppliers++;
            this.failedSuppliersData.push(newSupplier);
          }
        }

        if (successfullyAdded > 0) {
          this.importMessage = `Se cargaron ${successfullyAdded} proveedores exitosamente. <br> No se cargaron ${failedSuppliers} proveedores.`;
        } else {
          this.importMessage = `No se cargó ninguno. Los ${failedSuppliers} proveedores ya existen o tienen errores.`;
        }

        this.fetchSuppliers();
      } catch (error) {
        this.importMessage = "Error al importar proveedores desde Excel. Verifica el archivo y vuelve a intentarlo.";
        console.error("Error al importar proveedores desde Excel:", error);
      }
    },
    async fetchSuppliers() {
      try {
        this.suppliers = await getSuppliers();
        this.currentPage = 1;
      } catch (error) {
        console.error("Error al obtener la lista de proveedores:", error);
      }
    },
    resetSupplier() {
      this.proveedorActual = { name: '', email: '', phone: '', ruc: '' };
    },
    async saveSupplier() {
      try {
        if (this.editMode) {
          await updateSupplier(this.proveedorActual._id, this.proveedorActual);
        } else {
          await createSupplier(this.proveedorActual);
        }
        this.resetSupplier();
        this.hideModal();
        this.fetchSuppliers();
      } catch (error) {
        console.error("Error al guardar el proveedor:", error);
      }
    },
    async deleteSupplier(supplierId) {
      try {
        await deleteSupplier(supplierId);
        this.fetchSuppliers();
      } catch (error) {
        console.error("Error al eliminar el proveedor:", error);
      }
    },
    showModalNew() {
      this.editMode = false;
      this.resetSupplier();
      this.$refs['my-modal'].show();
    },
    showModalEdit(data) {
      this.editMode = true;
      this.proveedorActual = {...data};
      this.$refs['my-modal'].show();
    },
    hideModal() {
      this.editMode = false;
      this.resetSupplier();
      this.$refs['my-modal'].hide();
    }
  },
  created() {
    this.fetchSuppliers();
  }
};
</script>
