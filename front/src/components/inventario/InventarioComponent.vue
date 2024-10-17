<script>
import {
  getProducts, createProduct, getProductById, updateProduct, deleteProduct
} from "@/services/productsService";
import * as XLSX from "xlsx";
import Select2 from 'v-select2-component';

export default {
  props: {flagInvoice: Boolean},
  components: {Select2},
  data() {
    return {
      listImpuestos: [
        {name: "IVA", value: "2"},
        {name: "ICE", value: "3"},
        {name: "IRBPNR", value: "5"},
      ],
      listTarifas: [
        {name: "0%", tarifa: "0", codigo: "0"},
        {name: "12%", tarifa: "12", codigo: "2"},
        {name: "13%", tarifa: "13", codigo: "10"},
        {name: "14%", tarifa: "14", codigo: "3"},
        {name: "15%", tarifa: "15", codigo: "4"},
        {name: "5%", tarifa: "5", codigo: "5"},
        {name: "No objeto de Impuesto", tarifa: "0", codigo: "6"},
        {name: "Excento de IVA", tarifa: "0", codigo: "7"},
        {name: "IVA diferenciado", tarifa: "0", codigo: "8"},
      ],
      products: [],
      fields: [
        {key: "index", label: "N", tdClass: "text-center"},
        {key: "codigoPrincipal", label: "Código Principal"},
        {key: "descripcion", label: "Producto / Servicio"},
        {key: 'tarifa', label: 'Tarifa de Impuesto', tdClass: "text-center", sortable: true},
        {key: "precioUnitario", label: "Precio Unitario", tdClass: "text-center"},
        {key: 'iva', label: 'Iva', tdClass: "text-center" },
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
        impuestos: [
          {codigo: '2', codigoPorcentaje: '1', tarifa: 0, baseImponible: 0, valor: 0},
        ]
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
  watch: {
    'productoActual.precioTotalSinImpuesto'(newValue) {
      this.calculateImpuestos(newValue);
    },

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

    updateProductDetails(detalle, index) {
      console.log(detalle, index);
      // const product = this.products.find(p => p.codigoPrincipal === detalle.codigoPrincipal);
      // if (product) {
      //   detalle.descripcion = product.descripcion;
      //   detalle.precioUnitario = product.precioUnitario;
      //   this.calculateSubtotal(detalle);
      // }
    },
    updateImpuestosDetails(impuesto, index) {
      // Encuentra la tarifa seleccionada en listTarifas y asigna su valor a impuesto.tarifa
      const selectedTarifa = this.listTarifas.find(tarifa => tarifa.codigo === impuesto.codigoPorcentaje);
      if (selectedTarifa) {
        impuesto.tarifa = selectedTarifa.tarifa; // Actualiza impuesto.tarifa con el valor de la tarifa seleccionada
      }
      this.calculateImpuestos(this.productoActual.precioTotalSinImpuesto);
    },
    updatePrecioYBase(nuevoPrecio) {
      this.productoActual.precioTotalSinImpuesto = nuevoPrecio;

      if (this.productoActual.impuestos && this.productoActual.impuestos.length > 0) {
        this.productoActual.impuestos.forEach(impuesto => {
          impuesto.baseImponible = nuevoPrecio;
        });
      }
    },
    calculateImpuestos(precioTotalSinImpuesto) {
      this.productoActual.impuestos.forEach(impuesto => {
        impuesto.baseImponible = parseFloat(precioTotalSinImpuesto).toFixed(2);
        impuesto.valor = (parseFloat(impuesto.baseImponible) * parseFloat(impuesto.tarifa) / 100).toFixed(2);
      });
    },

    resetSearch() {
      this.searchQuery = "";
      this.fetchProducts();
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
          {codigo: '2', codigoPorcentaje: '1', tarifa: 0, baseImponible: 0, valor: 0},
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
      this.$refs['modal-producto'].show();
    },
    showModalEdit(data) {
      this.editMode = true;
      this.productoActual = {...data};
      this.$refs['modal-producto'].show();
    },
    hideModal() {
      this.editMode = false;
      this.resetProduct();
      this.$refs['modal-producto'].hide();
    },
    toggleModal() {
      this.$refs['modal-producto'].toggle('#toggle-btn');
    }

  },

  created() {
    this.fetchProducts();
  },

};
</script>
<template>
  <b-container fluid>
    <div class="d-flex justify-content-end  mr-4 mt-4" v-if="!flagInvoice">
      <b-breadcrumb :items="items"></b-breadcrumb>
    </div>

    <div class="d-flex justify-content-between align-items-center p-3" v-if="!flagInvoice">
      <div>
        <h2 class="mb-0 text-primary">Lista de Productos</h2>
      </div>
      <div>
        <b-button variant="primary" class="align-self-center m-2" @click="showModalNew">Nuevo producto</b-button>
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

    <b-table class="mt-3" :items="paginatedProducts" :fields="computedFields" responsive="sm" striped hover>
      <template #cell(index)="data">
        {{ (currentPage - 1) * perPage + data.index + 1 }}
      </template>

      <template #cell(tarifa)="data">
        <span v-if="data.item.impuestos && data.item.impuestos.length > 0">
          {{ data.item.impuestos[0].tarifa }} %
        </span>

      </template>
      <template #cell(iva)="data">
        <span v-if="data.item.impuestos && data.item.impuestos.length > 0">
          {{ data.item.impuestos[0].valor }}
        </span>
      </template>

      <template #cell(actions)="data" v-if="!flagInvoice">
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

    <b-modal ref="modal-producto" :title="editMode ? 'Editar Producto' : 'Nuevo Producto'" size="lg" centered
             hide-header-close>
      <b-form @submit.stop.prevent="saveProduct">
        <b-row>
          <b-col lg="3">
            <b-form-group label="Código Principal" label-for="codigoPrincipal" class="col-12">
              <b-form-input v-model="productoActual.codigoPrincipal" id="codigoPrincipal" required></b-form-input>
            </b-form-group>

          </b-col>
          <b-col>
            <b-form-group label="Nombre del producto o servicio" label-for="descripcion" class="col-12">
              <b-form-input v-model="productoActual.descripcion" id="descripcion" required></b-form-input>
            </b-form-group>

          </b-col>
          <b-col lg="2">
            <b-form-group label="Precio Unitario" label-for="precioUnitario">
              <b-form-input type="number" v-model="productoActual.precioUnitario" id="precioUnitario"
                            @input="updatePrecioYBase(productoActual.precioUnitario)" required></b-form-input>
            </b-form-group>
          </b-col>

        </b-row>

        <b-row>
          <b-col lg="12">
            <div class="mt-3 mb-3 text-center">
              <h5>Impuesto</h5>
              <hr>
            </div>
          </b-col>
          <b-col>

            <div v-for="(impuesto, index) in productoActual.impuestos" :key="index" class="col-12 mb-2">
              <div class="d-flex justify-content-around align-items-center">
                <b-form-group label="Tipo" class="row">

                  <b-form-select
                      class="form-control"
                      v-model="impuesto.codigo"
                      :options="listImpuestos.map(p => ({ value: p.value, text: p.name }))"
                      @change="updateProductDetails(impuesto, index)"
                      required
                  />
                </b-form-group>
                <b-form-group label="Tarifa" class="row">
                  <b-form-select
                      class="form-control"
                      v-model="impuesto.codigoPorcentaje"
                      :options="listTarifas.map(p => ({ value: p.codigo, text: p.name }))"
                      @change="updateImpuestosDetails(impuesto, index)"
                      required
                  />

                </b-form-group>

                <b-form-group label="Valor" class="">
                  <b-form-input type="number" v-model="impuesto.valor" disabled required></b-form-input>
                </b-form-group>

              </div>
            </div>


          </b-col>
        </b-row>


      </b-form>

      <template #modal-footer>
        <b-button class="mt-2" variant="outline-secondary" block @click="hideModal">Cancelar</b-button>
        <b-button class="mt-2" v-if="!editMode" variant="outline-success" block @click="saveProduct">Guardar producto
        </b-button>
        <b-button class="mt-2" v-if="editMode" variant="outline-success" block @click="saveProduct">Actualizar
          producto
        </b-button>
      </template>


    </b-modal>
  </b-container>
</template>

