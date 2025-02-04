<template>
  <div>
    <div class="d-flex justify-content-end mr-4 mt-4">
      <b-breadcrumb class="m-0 p-0" :items="breadcrumbItems"></b-breadcrumb>
    </div>

    <!-- Pestañas principales -->
    <b-tabs content-class="mt-3" v-model="activeTab">
      <b-tab title="Lista de Facturas de Compra" key="list" active>
        <template #title>
          Lista de facturas de compra
          <b-button variant="white" class="align-self-center" v-if="activeTab!==1" @click="loadBillings" size="sm">
            <b-icon icon="arrow-counterclockwise"></b-icon>
          </b-button>
        </template>
        <template v-slot:default>
          <!-- Formulario para agregar factura -->
          <h4 class="mt-4 d-flex justify-content-start">Agregar factura ingresando número de autorización</h4>
          <b-row class="d-flex justify-content-center align-items-center">
            <b-col lg="6">
              <b-form-input id="supplierId" v-model="numeroAutorizacion" required></b-form-input>
            </b-col>
            <b-col lg="2">
              <b-button class="w-100" variant="primary" @click="searchInvoiceByAutorizacion">Agregar
                <b-icon icon="save" scale="0.7"></b-icon>
              </b-button>
            </b-col>
          </b-row>

          <b-row class="d-flex justify-content-center align-items-center mt-4">
            <b-col lg="6">
              <b-form-input
                  v-model="searchQuery"
                  placeholder="Buscar por número de comprobante o razón social"
              ></b-form-input>
            </b-col>
          </b-row>

          <!-- Tabla de facturas -->
          <h4 class="mt-4 d-flex justify-content-start">Lista de Facturas de Compra</h4>
          <b-table hover :items="paginatedRetenciones" :fields="fields" responsive="sm">
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
            <template #cell(actions)="data">
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
        </template>
      </b-tab>

      <b-tab title="Nueva Retención" key="create-retencion">
        <template v-slot:default>
          <RetencionComponent></RetencionComponent>
        </template>
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
import {getBillings, createBilling, deleteBilling} from '@/services/saveBillingService';
import Swal from "sweetalert2";
import RetencionComponent from "@/components/retenciones/RetencionComponent.vue";

export default {
  name: 'PrincipalRetencionComponent',
  components: {
    RetencionComponent,
  },
  data() {
    return {
      listRetenciones: [],
      activeTab: 'list', // Controlador de la pestaña activa
      fields: [
        {key: 'fechaEmision', label: 'Fecha de Emisión'},
        {key: 'numeroComprobante', label: 'Número Comprobante'},
        {key: 'emisorRazonSocial', label: 'Razón Social del Emisor'},
        {key: 'importeTotal', label: 'Importe Total', tdClass: "text-center"},
        {key: 'claveAcceso', label: 'Clave de Acceso'},
        {key: 'actions', label: 'Acción'}
      ],
      perPage: 5, // Número de elementos por página
      currentPage: 1, // Página actual
      numeroAutorizacion: "",
      invoiceData: [],
      searchQuery: "",
    };
  },
  computed: {
    breadcrumbItems() {
      return this.activeTab === 'list'
          ? [
            {text: 'Retenciones', href: '#'},
            {text: 'Lista de Facturas', active: true}
          ]
          : this.activeTab === 'create-factura'
              ? [
                {text: 'Retenciones', href: '#'},
                {text: 'Nueva Factura de Compra', active: true}
              ]
              : [
                {text: 'Retenciones', href: '#'},
                {text: 'Nueva Retención', active: true}
              ];
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

        Swal.fire({
          title: 'Enviando factura...',
          text: 'Por favor espera mientras se procesa la factura.',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        const response = await createBilling(autorizacionData);
        this.invoiceData = response.factura;

        Swal.fire({
          title: 'Factura enviada',
          text: 'La factura ha sido procesada exitosamente.',
          icon: 'success',
          timer: 2500,
          showConfirmButton: false
        });
        await this.loadBillings();


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
