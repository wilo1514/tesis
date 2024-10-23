<template>
  <div>
    <div class="d-flex justify-content-end mr-4 mt-4" v-if="!flagInvoice">
      <b-breadcrumb class="m-0 p-0" :items="breadcrumbItems"></b-breadcrumb>
    </div>
    <div class="d-flex justify-content-between align-items-center p-3" v-if="!flagInvoice">
      <div>
        <h2 class="mb-0 text-primary">Lista de facturas de compra</h2>
      </div>
      <div>
        <b-button variant="primary" class="align-self-center m-2" @click="showModalNew">Nuevo factura de compra
        </b-button>
      </div>
    </div>


    <!-- Pestañas principales -->
    <div class="d-flex justify-content-center align-items-center mt-4">
      <div class="w-50">
        <b-form-input
            v-model="searchQuery"
            placeholder="Buscar por número de comprobante o razón social"
        ></b-form-input>
      </div>
      <div>
        <b-button variant="white" class="align-self-center" v-if="activeTab!==1" @click="loadBillings" size="sm">
          <b-icon icon="arrow-counterclockwise"></b-icon>
        </b-button>
      </div>
    </div>
    <!-- Tabla de facturas -->

    <b-table hover :items="paginatedRetenciones" :fields="computedFields" responsive="sm">
      <template #cell(secuencial)="data">
        {{ `${data.item.estab}-${data.item.ptoEmi}-${data.item.secuencial}` }}
      </template>
      <template #cell(emisorRazonSocial)="data">
        {{ data.item.emisor.razonSocial }}
      </template>
      <template #cell(fechaEmision)="data">
        {{ data.item.fechaEmision }}
      </template>
      <template #cell(importeTotal)="data">

        ${{ data.item.importeTotal.toFixed(2) }}
      </template>
      <template #cell(claveAcceso)="data">
        {{ data.item.numeroAutorizacion }}
      </template>
      <template #cell(actions)="data" v-if="!flagInvoice">
        <b-button variant="danger" size="sm" @click="deleteInvoice(data.item)">Eliminar</b-button>
      </template>
    </b-table>

    <b-pagination
        v-model="currentPage"
        :total-rows="filteredRetenciones.length"
        :per-page="perPage"
        align="center"
        class="mt-3"
    ></b-pagination>


    <b-modal ref="my-modal" title="Agregar nueva factura de compra" size="xl" centered hide-header-close>

      <b-row class="d-flex justify-content-center align-items-center">
        <b-col>
          <b-form-input id="supplierId" v-model="numeroAutorizacion"
                        placeholder="Agregar factura ingresando número de autorización" required></b-form-input>
        </b-col>

      </b-row>

      <template #modal-footer>

        <b-button class="mt-2" variant="outline-secondary" block @click="hideModal">Cancelar</b-button>
        <b-button class="mt-2" variant="outline-success" block @click="searchInvoiceByAutorizacion">Guardar factura
        </b-button>

      </template>


    </b-modal>
  </div>
</template>

<script>
import {getBillings, createBilling, deleteBilling} from '@/services/saveBillingService';
import Swal from "sweetalert2";
import RetencionComponent from "@/components/retenciones/RetencionComponent.vue";

export default {
  name: 'FacturasCompraComponent',
  props: {flagInvoice: Boolean},
  components: {
    RetencionComponent,
  },
  data() {
    return {
      breadcrumbItems: [
        {text: 'Facturas de compra', href: '#'},
        {text: 'Proveedores', active: true}
      ],
      listRetenciones: [],
      activeTab: 'list', // Controlador de la pestaña activa
      fields: [
        {key: 'fechaEmision', label: 'Fecha de Emisión'},
        {key: 'numeroComprobante', label: 'Número Comprobante'},
        {key: 'emisorRazonSocial', label: 'Razón Social del Emisor'},
        {key: 'importeTotal', label: 'Importe Total', tdClass: "text-center"},
        {key: 'claveAcceso', label: 'Clave de Acceso'},
      ],
      perPage: 5, // Número de elementos por página
      currentPage: 1, // Página actual
      numeroAutorizacion: "",
      invoiceData: [],
      searchQuery: "",
    };
  },
  computed: {
    computedFields() {
      // Si flagInvoice es false, agregar la columna 'actions'
      if (!this.flagInvoice) {
        return [...this.fields, {key: "actions", label: "Acciones"}];
      }
      // Si flagInvoice es true, no agregar la columna 'actions'
      return this.fields;
    },
    filteredRetenciones() {
      if (this.searchQuery) {
        return this.listRetenciones.filter((retencion) =>
            retencion.numeroComprobante.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            retencion.emisor.razonSocial.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }
      return this.listRetenciones;
    },
    paginatedRetenciones() {
      const start = (this.currentPage - 1) * this.perPage;
      const end = start + this.perPage;
      return this.filteredRetenciones.slice(start, end); // Asegúrate de que uses filteredRetenciones aquí
    }

  },
  methods: {


    showModalNew() {
      this.$refs['my-modal'].show()
    },
    hideModal() {
      this.numeroAutorizacion = "";
      this.$refs['my-modal'].hide()
    },

    async deleteInvoice(invoice) {
      Swal.fire({
        title: '¿Estás seguro?',
        text: `Eliminarás la factura con el número de comprobante ${invoice.numeroComprobante}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await deleteBilling(invoice._id); // Eliminar la factura por su ID
            this.loadBillings();
            this.showSuccessAlertDeleted(invoice.numeroComprobante);
            // Recargar la lista de facturas

          } catch (error) {
            Swal.fire({
              title: 'Error',
              text: 'No se pudo eliminar la factura.',
              icon: 'error',
              confirmButtonText: 'Intentar de nuevo'
            });
          }
        }
      });
    },

    showSuccessAlertDeleted(modulo) {
      Swal.fire({
        title: '¡Eliminado!',
        text: `La factura "${modulo}" ha sido eliminada correctamente.`,
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


    async loadBillings() {
      try {
        this.listRetenciones = await getBillings();
      } catch (error) {
        console.error('Error al cargar facturas:', error);
      }
    },
    async searchInvoiceByAutorizacion() {
      try {
        const autorizacionData = {
          numeroAutorizacion: this.numeroAutorizacion
        };

        const response = await createBilling(autorizacionData);
        this.invoiceData = response.factura;

        Swal.fire({
          title: 'Factura agregada',
          text: 'La factura ha sido procesada exitosamente.',
          icon: 'success',
          timer: 2500,
          showConfirmButton: false
        });
        await this.loadBillings();
        this.hideModal();

      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: 'No se pudo enviar la factura. Intenta de nuevo.',
          icon: 'error',
          confirmButtonText: 'Intentar de nuevo'
        });
      }
    }
  },
  async mounted() {
    await this.loadBillings();
  }
};
</script>

<style scoped>
h4 {
  text-align: center;
}
</style>
