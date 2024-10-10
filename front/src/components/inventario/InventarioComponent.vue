<script>
import {
  getProducts, createProduct, getProductById, updateProduct, deleteProduct
} from "@/services/productsService";
import * as XLSX from "xlsx";

export default {
  data() {
    return {
      products: [],
      fields: [
        {key: "index", label: "N"},
        {key: "codigoPrincipal", label: "Código Principal"},
        {key: "descripcion", label: "Descripción", sortable: true},
        {key: "precioUnitario", label: "Precio Unitario", sortable: true},
        {key: "precioTotalSinImpuesto", label: "Precio Total Sin Impuesto"},
        {key: "actions", label: "Acciones"},
      ],
      items: [
        {text: 'Productos', href: '#'},
        {text: 'Lista de productos', active: true}
      ],
      productoActual: {
        codigoPrincipal: '',
        descripcion: '',
        precioUnitario: 0,
        precioTotalSinImpuesto: 0,
        impuestos: []
      },
      editMode: false,
      searchQuery: "",
      perPage: 10,
      currentPage: 1,
      modalTitle: '',
      file: null,
      importMessage: '',
      failedProductsData: [],

    };
  },
  computed: {
    filteredProducts() {
      if (this.searchQuery) {
        return this.products.filter((product) => {
          return (
              product.codigoPrincipal
                  .toLowerCase()
                  .includes(this.searchQuery.toLowerCase()) ||
              product.descripcion
                  .toLowerCase()
                  .includes(this.searchQuery.toLowerCase())
          );
        });
      }
      return this.products;
    },
    paginatedProducts() {
      const start = (this.currentPage - 1) * this.perPage;
      const end = start + this.perPage;
      return this.filteredProducts.slice(start, end);
    },
    selectedFile: {
      get() {
        return this.file; // Retorna el archivo seleccionado
      },
      set(file) {
        this.file = file; // Actualiza el archivo seleccionado
      }
    }

  },
  methods: {
    addImpuesto() {
      this.productoActual.impuestos.push({ codigo: '', codigoPorcentaje: '', tarifa: 0, baseImponible: 0, valor: 0 });
    },
    removeImpuesto(index) {
      this.productoActual.impuestos.splice(index, 1);
    },
    downloadFailedProducts() {
      if (this.failedProductsData.length === 0) {
        this.importMessage = "No hay productos fallidos para descargar.";
        return;
      }
      this.importMessage = "";
      // Crear el archivo Excel con los productos fallidos
      const ws = XLSX.utils.json_to_sheet(this.failedProductsData); // Convierte los datos de productos fallidos en una hoja de Excel
      const wb = XLSX.utils.book_new(); // Crea un nuevo libro de Excel
      XLSX.utils.book_append_sheet(wb, ws, "Productos Fallidos"); // Agregar la hoja con el nombre "Productos Fallidos"

      // Descargar el archivo Excel con el nombre 'productos_fallidos.xlsx'
      XLSX.writeFile(wb, "productos_fallidos.xlsx");
    },
    resetSearch() {
      this.searchQuery = "";
      this.fetchProducts();
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

    exportToExcel() {
      const data = this.filteredProducts.map(product => ({
        "Código Principal": product.codigoPrincipal,
        Descripción: product.descripcion,
        "Precio Unitario": product.precioUnitario,
        "Precio Total Sin Impuesto": product.precioTotalSinImpuesto,
      }));

      const ws = XLSX.utils.json_to_sheet(data); // Convierte los datos a una hoja de Excel
      const wb = XLSX.utils.book_new(); // Crea un nuevo libro de Excel
      XLSX.utils.book_append_sheet(wb, ws, "Productos"); // Agrega la hoja al libro

      XLSX.writeFile(wb, "productos.xlsx"); // Genera y descarga el archivo Excel
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
        let failedProducts = 0; // Contador de productos fallidos (errores)
        this.failedProductsData = []; // Array para almacenar los datos de productos fallidos

        // Procesar los datos y crear los productos
        for (const productData of jsonData) {
          const newProduct = {
            codigoPrincipal: productData.codigoPrincipal || '',
            descripcion: productData.descripcion || '',
            precioUnitario: productData.precioUnitario || 0,
            precioTotalSinImpuesto: productData.precioTotalSinImpuesto || 0,
            impuestos: productData.impuestos || []
          };

          // Validar si los campos requeridos están presentes
          if (!newProduct.codigoPrincipal || !newProduct.descripcion) {
            console.warn("Faltan datos obligatorios para el producto:", newProduct);
            failedProducts++; // Contar los fallidos debido a datos incompletos
            this.failedProductsData.push(newProduct); // Agregar producto fallido a la lista
            continue; // Saltar este producto si faltan datos
          }

          try {
            // Intentar crear un nuevo producto
            await createProduct(newProduct);
            successfullyAdded++; // Incrementar el contador de productos agregados exitosamente
          } catch (error) {
            console.error("Error al crear el producto:", error.response ? error.response.data.message : error);
            failedProducts++; // Contar los errores
            this.failedProductsData.push(newProduct); // Agregar producto fallido a la lista
          }
        }

        // Actualizar el mensaje de éxito o error basado en los resultados de la importación
        if (successfullyAdded > 0) {
          // Mostrar cuántos productos fueron cargados y cuántos fallaron
          this.importMessage = `Se cargaron ${successfullyAdded} productos exitosamente. <br> No se cargaron ${failedProducts} productos.`;
        } else {
          // Si no se cargó ninguno, mostrar mensaje de error
          this.importMessage = `No se cargó ninguno. Los ${failedProducts} productos ya existen o tienen errores.`;
        }

        // Refrescar la lista de productos después de la importación
        this.fetchProducts();

      } catch (error) {
        this.importMessage = "Error al importar productos desde Excel. Verifica el archivo y vuelve a intentarlo.";
        console.error("Error al importar productos desde Excel:", error);
      }
    },

    async fetchProducts() {
      try {
        if (this.searchQuery) {

        } else {
          // Si no hay búsqueda, obtener todos los productos
          this.products = await getProducts();
        }
        this.currentPage = 1; // Reiniciar la página al hacer una búsqueda
      } catch (error) {
        console.error("Error al obtener la lista de productos:", error);
      }
    },
    resetProduct() {
      this.productoActual = {
        codigoPrincipal: '',
        descripcion: '',
        precioUnitario: 0,
        precioTotalSinImpuesto: 0,
        impuestos: [
          { codigo: '', codigoPorcentaje: '', tarifa: 0, baseImponible: 0, valor: 0 }
        ]
      };
    },

    async saveProduct() {
      try {
        if (this.editMode) {
          await updateProduct(this.productoActual._id, this.productoActual); // Actualizar producto existente
        } else {
          await createProduct(this.productoActual); // Crear nuevo producto
        }
        this.resetProduct();
        this.hideModal();

        this.fetchProducts(); // Recargar la lista de productos

      } catch (error) {
        console.error("Error al guardar el producto:", error);
      }
    },
    async deleteProduct(productId) {
      try {
        await deleteProduct(productId);
        this.fetchProducts();
      } catch (error) {
        console.error("Error al eliminar el producto:", error);
      }
    },
    showModalNew() {
      this.editMode = false;
      this.resetProduct();
      this.$refs['my-modal'].show();
    },
    showModalEdit(data) {
      this.editMode = true;
      this.productoActual = {...data};
      this.$refs['my-modal'].show();
    },
    hideModal() {
      this.editMode = false;
      this.resetProduct();
      this.$refs['my-modal'].hide();
    },
    toggleModal() {
      this.$refs['my-modal'].toggle('#toggle-btn');
    }

  },

  created() {
    this.fetchProducts();
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
      <div>
        <b-button variant="primary" class="align-self-center m-2" @click="showModalNew">Nuevo producto</b-button>
      </div>
    </div>

    <b-table class="mt-3" :items="paginatedProducts" :fields="fields" responsive="sm" striped hover>
      <template #cell(index)="data">
        {{ (currentPage - 1) * perPage + data.index + 1 }}
      </template>

      <template #cell(actions)="data">
        <b-button variant="primary" size="sm" @click="showModalEdit(data.item)">Editar</b-button>
        <b-button variant="danger" size="sm" @click="deleteProduct(data.item._id)">Eliminar</b-button>
      </template>
    </b-table>

    <b-pagination
        v-model="currentPage"
        :total-rows="filteredProducts.length"
        :per-page="perPage"
        align="center"
        class="mt-3"
    ></b-pagination>

    <b-modal ref="my-modal" :title="editMode ? 'Editar Producto' : 'Nuevo Producto'" size="xl" centered hide-header-close>
      <b-form @submit.stop.prevent="saveProduct">
        <div class="row mb-3">
          <b-form-group label="Código Principal" label-for="codigoPrincipal" class="col-12">
            <b-form-input v-model="productoActual.codigoPrincipal" id="codigoPrincipal" required></b-form-input>
          </b-form-group>
        </div>

        <div class="row mb-3">
          <b-form-group label="Descripción" label-for="descripcion" class="col-12">
            <b-form-input v-model="productoActual.descripcion" id="descripcion" required></b-form-input>
          </b-form-group>
        </div>

        <div class="row mb-3">
          <b-form-group label="Precio Unitario" label-for="precioUnitario" class="col-12 col-md-6">
            <b-form-input type="number" v-model="productoActual.precioUnitario" id="precioUnitario" required></b-form-input>
          </b-form-group>
          <b-form-group label="Precio Total Sin Impuesto" label-for="precioTotalSinImpuesto" class="col-12 col-md-6">
            <b-form-input type="number" v-model="productoActual.precioTotalSinImpuesto" id="precioTotalSinImpuesto" required></b-form-input>
          </b-form-group>
        </div>

        <!-- Sección de Impuestos -->
        <div class="row mb-3">
          <div class="col-12">
            <h5>Impuestos</h5>
            <b-button size="sm" variant="success" @click="addImpuesto">Agregar Impuesto</b-button>
          </div>
          <div v-for="(impuesto, index) in productoActual.impuestos" :key="index" class="col-12 mb-2">
            <div class="row">
              <b-form-group label="Código" class="col-12 col-md-2">
                <b-form-input v-model="impuesto.codigo" required></b-form-input>
              </b-form-group>
              <b-form-group label="Código Porcentaje" class="col-12 col-md-2">
                <b-form-input v-model="impuesto.codigoPorcentaje" required></b-form-input>
              </b-form-group>
              <b-form-group label="Tarifa" class="col-12 col-md-2">
                <b-form-input type="number" v-model="impuesto.tarifa" required></b-form-input>
              </b-form-group>
              <b-form-group label="Base Imponible" class="col-12 col-md-3">
                <b-form-input type="number" v-model="impuesto.baseImponible" required></b-form-input>
              </b-form-group>
              <b-form-group label="Valor" class="col-12 col-md-2">
                <b-form-input type="number" v-model="impuesto.valor" required></b-form-input>
              </b-form-group>
              <div class="col-12 col-md-1 d-flex align-items-center">
                <b-button variant="danger" size="sm" @click="removeImpuesto(index)">Eliminar</b-button>
              </div>
            </div>
          </div>
        </div>
      </b-form>

      <template #modal-footer>
        <b-button class="mt-2" variant="outline-secondary" block @click="hideModal">Cancelar</b-button>
        <b-button class="mt-2" v-if="!editMode" variant="outline-success" block @click="saveProduct">Guardar producto</b-button>
        <b-button class="mt-2" v-if="editMode" variant="outline-success" block @click="saveProduct">Actualizar producto</b-button>
      </template>
    </b-modal>
  </b-container>
</template>
