<template>
  <b-container fluid>
    <h2 class="my-4">Gestión de Facturas</h2>

    <!-- Formulario para crear y enviar una nueva factura -->
    <b-card class="mb-4">
      <b-card-title>Crear y Enviar Factura</b-card-title>
      <b-form @submit.prevent="createInvoice">
        <!-- Cliente ID -->
        <b-form-group label="Cliente" label-for="clienteId">
          <b-row>
            <b-col lg="10">
              <b-form-input id="clienteId" v-model="razonSocial" required disabled></b-form-input>
            </b-col>
            <b-col>
              <b-button class="w-100" variant="primary" @click="showModalClient">Clientes</b-button>
            </b-col>
          </b-row>
        </b-form-group>

        <!-- RUC Empresa -->
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
         <b-form-group label="Número de Factura" label-for="fac">
           <b-form-input id="fac" v-model="newInvoice.emisor.fac" required></b-form-input>
         </b-form-group>

       </div>


        <!-- Detalles de la factura -->
        <b-card-title>Detalles de la Factura</b-card-title>

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

    <b-modal ref="modal-client" title="Agregar cliente" size="xl" centered hide-header-close>
      <ClientComponent :flagInvoice="flagInvoice" @clientSelected="clientSelected"></ClientComponent>

    </b-modal>
    <b-modal ref="modal-products" title="Agregar productos o servicios" size="xl" centered hide-header-close>
      <InventarioComponent :flagInvoice="flagInvoice" @clientSelected="clientSelected"></InventarioComponent>

    </b-modal>

    <pre>{{ newInvoice }}</pre>
  </b-container>
</template>

<script>
import {createAndSendInvoice} from "@/services/invoiceServices";
import ClientComponent from "@/components/clientes/ClientComponent.vue";
import InventarioComponent from "@/components/inventario/InventarioComponent.vue";
export default {
  components: {ClientComponent, InventarioComponent},
  data() {
    return {
      flagInvoice: true,
      razonSocial: '',
      newInvoice: {
        clienteId: "",
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
  methods: {
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
    }
  }
};
</script>

<style scoped>
h2 {
  text-align: center;
  margin-bottom: 20px;
}
</style>
