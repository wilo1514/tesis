<template>
  <b-container fluid>
    <h2 class="my-4">Gestión de Facturas</h2>

    <!-- Formulario para crear y enviar una nueva factura -->
    <b-card class="mb-4">


      <div class="mb-3 d-flex justify-content-between align-items-end">
        <b-form-group label="Número de Factura" label-for="fac">
          <b-form-input disabled id="fac" v-model="newInvoice.emisor.fac" required></b-form-input>
        </b-form-group>
        <b-button v-b-toggle.my-collapse>Configurar emisor
          <b-icon icon="wrench" scale="0.8"></b-icon>
        </b-button>
      </div>

      <b-collapse id="my-collapse">
        <b-card title="Configurar emisor">

          <b-form-group label="RUC Empresa" label-for="rucEmpresa">
            <b-form-input id="rucEmpresa" v-model="newInvoice.ruc_empresa" required></b-form-input>
          </b-form-group>

          <!-- Información del emisor -->
          <b-card-title>Información del Emisor</b-card-title>

          <div class="d-flex justify-content-between">


            <b-form-group label="RUC del Emisor" label-for="emisorRuc" class="w-30 m-1">
              <b-form-input id="emisorRuc" v-model="newInvoice.emisor.ruc" required></b-form-input>
            </b-form-group>

            <b-form-group label="Razón Social" label-for="razonSocial" class="w-100 m-1">
              <b-form-input id="razonSocial" v-model="newInvoice.emisor.razonSocial" required></b-form-input>
            </b-form-group>


          </div>
        </b-card>
      </b-collapse>


      <b-card-title>Crear y Enviar Factura</b-card-title>
      <b-form @submit.prevent="createInvoice">
        <!-- Cliente ID -->
        <b-row>
          <b-col>
            <b-button class="w-100 mt-4" variant="primary" @click="showModalClient">Seleccionar cliente</b-button>
          </b-col>
          <b-col lg="6">
            <b-form-group label="Cliente" label-for="clienteId">
              <b-form-input id="clienteId" v-model="razonSocial" required disabled></b-form-input>
            </b-form-group>
          </b-col>
          <b-col>
            <b-form-group label="Fecha de emisión" label-for="rucEmpresa">
              <b-input type="date" v-model="fechaFormateada" @input="updateFechaFormateada"></b-input>
            </b-form-group>
          </b-col>
        </b-row>
        <pre>{{ newInvoice.detalles }}</pre>

        <!-- Detalles de la factura -->
        <b-card-title class="mt-4">Detalles de la Factura</b-card-title>

        <b-row>
          <b-col>Producto</b-col>
          <b-col>Descripción</b-col>
          <b-col>Cantidad</b-col>
          <b-col>Precio</b-col>
          <b-col>Impuesto</b-col>
          <b-col>Subtotal</b-col>
          <b-col>Acción</b-col>
        </b-row>
        <!-- Filas dinámicas para los productos -->
        <b-row v-for="(detalle, index) in newInvoice.detalles" :key="index">
          <b-col>
            <Select2
                v-model="detalle.codigoPrincipal"
                :options="products.map(p => ({ id: p.codigoPrincipal, text: `${p.codigoPrincipal} - ${p.descripcion}` }))"
                @change="updateProductDetails(detalle, index)"
            />
          </b-col>
          <b-col>
            <b-form-input v-model="detalle.descripcion" required></b-form-input>
          </b-col>
          <b-col>
            <b-form-input v-model="detalle.cantidad" type="number" min="1" @input="calculateSubtotal(detalle)"
                          required></b-form-input>
          </b-col>
          <b-col>
            <b-form-input v-model="detalle.precioUnitario" type="number" @input="calculateSubtotal(detalle)"
                          required></b-form-input>
          </b-col>
          <b-col>
            <b-form-select class="form-control" v-model="detalle.impuestos[0].codigoPorcentaje" :options="taxOptions"
                           @change="calculateTax(detalle)" required></b-form-select>
          </b-col>
          <b-col>
            <b-form-input v-model="detalle.precioTotalSinImpuesto" disabled></b-form-input>
          </b-col>
          <b-col>
            <b-button variant="white" @click="removeProductRow(index)">
              <b-icon icon="trash" variant="danger"></b-icon>
            </b-button>
          </b-col>
        </b-row>

        <!-- Botón para agregar más productos -->
        <b-button variant="success" @click="addNewProductRow">Agregar Producto</b-button>
        <b-row>
          <b-col>Total sin Impuestos: {{ totalSinImpuestos }}....{{ newInvoice.totalSinImpuestos }}</b-col>
        </b-row>
        <b-row>
          <b-col>To: {{ importeTotal }} .......... {{ newInvoice.importeTotal }}</b-col>
        </b-row>


        <!--
                <b-form-group label="Cliente" label-for="clienteId">
                  <b-row>
                    <b-col lg="10">
                      <b-form-input id="clienteId" v-model="razonSocial" required disabled></b-form-input>
                    </b-col>
                    <b-col>
                      <b-button class="w-100" variant="warning" @click="showModalProducts">Productos / Servicios</b-button>
                    </b-col>
                  </b-row>
                </b-form-group>
                <b-form-group label="Descripción del Producto" label-for="descripcionProducto">
                  <b-form-input id="descripcionProducto" v-model="newInvoice.detalles[0].descripcion" required></b-form-input>
                </b-form-group>

                <b-form-group label="Cantidad" label-for="cantidadProducto">
                  <b-form-input id="cantidadProducto" v-model="newInvoice.detalles[0].cantidad" type="number"
                                required></b-form-input>
                </b-form-group>

                <b-form-group label="Precio Unitario" label-for="precioUnitarioProducto">
                  <b-form-input id="precioUnitarioProducto" v-model="newInvoice.detalles[0].precioUnitario" type="number"
                                required></b-form-input>
                </b-form-group>

                -->


        <br>
        <br>
        <br>
        <br>
        <br>

        <!-- Información del pago -->
        <b-card-title>Información del Pago</b-card-title>
        <b-form-group label="Forma de Pago" label-for="formaPago">
          <b-form-input id="formaPago" v-model="newInvoice.pagos[0].formaPago" required></b-form-input>
        </b-form-group>

        <b-form-group label="Total Pago" label-for="totalPago">
          <b-form-input id="totalPago" v-model="newInvoice.pagos[0].total" type="number" required></b-form-input>
        </b-form-group>

        <!-- Información adicional -->
        <b-card-title>Información Adicional</b-card-title>
        <b-form-group label="Teléfono" label-for="telefono">
          <b-form-input id="telefono" v-model="newInvoice.informacionAdicional[0].valor" required></b-form-input>
        </b-form-group>

        <b-button variant="primary" type="submit">Enviar Factura</b-button>
      </b-form>
    </b-card>

    <pre>{{ newInvoice }}</pre>

    <b-modal ref="modal-client" title="Agregar cliente" size="xl" centered hide-header-close>
      <ClientComponent :flagInvoice="flagInvoice" @clientSelected="clientSelected"></ClientComponent>

    </b-modal>
    <b-modal ref="modal-products" title="Agregar productos o servicios" size="xl" centered hide-header-close>
      <InventarioComponent :flagInvoice="flagInvoice" @clientSelected="clientSelected"></InventarioComponent>

    </b-modal>
    <!--    <pre>{{products}}</pre>-->

    <!--    <pre>{{ newInvoice }}</pre>-->
  </b-container>
</template>

<script>
import {createAndSendInvoice} from "@/services/invoiceServices";
import ClientComponent from "@/components/clientes/ClientComponent.vue";
import InventarioComponent from "@/components/inventario/InventarioComponent.vue";
import Select2 from 'v-select2-component';
import {getProducts} from "@/services/productsService";
import moment from 'moment';

export default {
  components: {ClientComponent, InventarioComponent, Select2},
  data() {
    return {
      valorTotal: 0,
      fechaFormateada: '',
      products: [],
      taxOptions: [
        {value: '0', text: '0%'},
        {value: '15', text: '15%'}
      ],
      selected: null,
      options: [
        {value: null, text: 'Please select an option'},
        {value: 'a', text: 'This is First option'},
        {value: 'b', text: 'Selected Option'},
        {value: {C: '3PO'}, text: 'This is an option with object value'},
        {value: 'd', text: 'This one is disabled', disabled: true}
      ],
      myValue: '',
      myOptions: ['op1', 'op2', 'op3'],
      flagInvoice: true,
      razonSocial: '',
      newInvoice: {
        clienteId: "",
        fechaEmision: "",
        ruc_empresa: "0190412040001",
        emisor: {
          ruc: "0190412040001",
          razonSocial: "AUDITORES CONTABLES & CONSULTORES ENRIQUETA SARMIENTO ACCESCONT CIA. LTDA.",
          nombreComercial: "ACCESCONT CIA. LTDA.",
          direccionMatriz: "TOMÁS ORDOÑEZ 14-31 Y PIO BRAVO",
          direccionEstablecimiento: "DE LA MISTELA Y RAFAEL CARPIO ABAD",
          contribuyenteEspecial: "NO",
          obligadoContabilidad: "SI",
          fac: "000000076"
        },
        detalles: [
          {
            codigoPrincipal: "",
            descripcion: "",
            cantidad: 1,
            precioUnitario: 0,
            descuento: 0,
            precioTotalSinImpuesto: 0,
            impuestos: [
              {
                codigo: "2",
                codigoPorcentaje: "0",
                tarifa: 0,
                baseImponible: 0,
                valor: 0
              }
            ]
          }
        ],
        totalSinImpuestos: 0,
        totalDescuento: 0,
        propina: 0,
        importeTotal: 0,
        moneda: "USD",
        pagos: [
          {
            formaPago: "20",
            total: 0,
            plazo: "0",
            unidadTiempo: "dias"
          }
        ],
        informacionAdicional: [
          {
            nombre: "Teléfono",
            valor: ""
          }
        ],
        firma: "AquiVaLaFirmaElectronica"
      },

    };
  },

  watch: {
    totalSinImpuestos(newValue) {
      // Asignar el valor calculado a newInvoice.totalSinImpuestos
      this.newInvoice.totalSinImpuestos = newValue;
    },
    importeTotal(newValue) {
      this.newInvoice.importeTotal = newValue;
    }

  },

  computed: {
    fechaEnDDMMYYYY() {
      return this.fechaFormateada ? moment(this.fechaFormateada, 'YYYY-MM-DD').format('DD/MM/YYYY') : '';
    },
    totalSinImpuestos() {
      // Inicializamos el total en 0
      let total = 0;

      // Recorremos todos los detalles
      this.newInvoice.detalles.forEach(detalle => {
        // Recorremos los impuestos de cada detalle y sumamos la base imponible
        detalle.impuestos.forEach(impuesto => {
          total += impuesto.baseImponible;
        });
      });

      // Retornamos el total sin impuestos
      return total;
    },
    importeTotal() {
      let total = 0;

      // Recorremos todos los detalles
      this.newInvoice.detalles.forEach(detalle => {
        // Recorremos los impuestos de cada detalle y sumamos la base imponible
        detalle.impuestos.forEach(impuesto => {
          total += impuesto.valor;
        });
      });

      // Retornamos el total sin impuestos
      return total;
    }
  },
  methods: {
    updateFechaFormateada() {
      // Convertir la fecha ingresada en el input al formato DD/MM/YYYY
      this.newInvoice.fechaEmision = moment(this.fechaFormateada, 'YYYY-MM-DD').format('DD/MM/YYYY');
    },
    addNewProductRow() {
      this.newInvoice.detalles.push({
        codigoPrincipal: "",
        descripcion: "",
        cantidad: 1,
        precioUnitario: 0,
        descuento: 0,
        precioTotalSinImpuesto: 0,
        impuestos: [
          {
            codigo: "2",
            codigoPorcentaje: "0",
            tarifa: 0,
            baseImponible: 0,
            valor: 0
          }
        ]
      });
    },
    removeProductRow(index) {
      this.newInvoice.detalles.splice(index, 1);
    },

    calculateSubtotal(detalle) {
      detalle.precioTotalSinImpuesto = detalle.cantidad * detalle.precioUnitario;

      this.calculateTax(detalle);
    },

    calculateTax(detalle) {
      const tarifa = parseFloat(detalle.impuestos[0].codigoPorcentaje);
      const baseImponible = detalle.cantidad * detalle.precioUnitario;

      // Actualizamos los valores de impuestos
      detalle.impuestos[0].tarifa = tarifa;
      detalle.impuestos[0].baseImponible = baseImponible;
      detalle.impuestos[0].valor = baseImponible * (tarifa / 100);
    },
    updateProductDetails(detalle, index) {
      const product = this.products.find(p => p.codigoPrincipal === detalle.codigoPrincipal);
      if (product) {
        detalle.descripcion = product.descripcion;
        detalle.precioUnitario = product.precioUnitario;
        this.calculateSubtotal(detalle);
      }
    },

    myChangeEvent(val) {
      console.log(val);
    },
    mySelectEvent({id, text}) {
      console.log({id, text})
    },
    clientSelected(data) {
      this.newInvoice.clienteId = data._id;
      this.razonSocial = data.razonSocial;
      console.log("RECIBE", data);
      this.hideModal();

    },
    hideModal() {
      this.$refs['modal-client'].hide()
    },


    async createInvoice() {
      try {
        await createAndSendInvoice(this.newInvoice);
        this.resetInvoiceForm();
      } catch (error) {
        console.error("Error al crear y enviar factura:", error);
      }
    },
    showModalClient() {
      this.$refs['modal-client'].show()
    },
    showModalProducts() {
      this.$refs['modal-products'].show()
    },

    resetInvoiceForm() {
      this.newInvoice = {
        clienteId: "",
        ruc_empresa: "",
        emisor: {
          ruc: "",
          razonSocial: "",
          nombreComercial: "",
          direccionMatriz: "",
          direccionEstablecimiento: "",
          contribuyenteEspecial: "",
          obligadoContabilidad: "SI",
          fac: ""
        },
        detalles: [
          {
            codigoPrincipal: "",
            descripcion: "",
            cantidad: 1,
            precioUnitario: 0,
            descuento: 0,
            precioTotalSinImpuesto: 0,
            impuestos: [
              {
                codigo: "2",
                codigoPorcentaje: "0",
                tarifa: 0,
                baseImponible: 0,
                valor: 0
              }
            ]
          }
        ],
        totalSinImpuestos: 0,
        totalDescuento: 0,
        propina: 0,
        importeTotal: 0,
        moneda: "USD",
        pagos: [
          {
            formaPago: "20",
            total: 0,
            plazo: "0",
            unidadTiempo: "dias"
          }
        ],
        informacionAdicional: [
          {
            nombre: "Teléfono",
            valor: ""
          }
        ],
        firma: "AquiVaLaFirmaElectronica"
      };
    },
    async fetchProducts() {
      try {
        this.products = await getProducts();
      } catch (error) {
        console.error("Error al obtener productos:", error);
      }
    },
  },
  mounted() {
    this.fetchProducts();
    this.fechaFormateada = moment().format('YYYY-MM-DD');
    // Establecer la fecha interna en el formato DD/MM/YYYY
    this.newInvoice.fechaEmision = moment(this.fechaFormateada, 'YYYY-MM-DD').format('DD/MM/YYYY');

  }
};
</script>

<style scoped>
h2 {
  text-align: center;
  margin-bottom: 20px;
}
</style>
