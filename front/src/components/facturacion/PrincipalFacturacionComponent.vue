<template>
  <div>
    <div class="d-flex justify-content-end mr-4 mt-4">
      <b-breadcrumb :items="breadcrumbItems"></b-breadcrumb>
    </div>
<!--    <div class="d-flex justify-content-between align-items-center p-3">-->
<!--      <div>-->
<!--        <h2 class="mb-0 text-primary">Facturación</h2>-->
<!--      </div>-->
<!--      <div>-->
<!--        <b-button variant="white" class="align-self-center m-2" v-if="activeTab!==1" @click="loadInvoices">-->
<!--          <b-icon icon="arrow-counterclockwise"></b-icon>-->
<!--        </b-button>-->
<!--      </div>-->
<!--    </div>-->

    <!-- Tabs para alternar entre vistas -->
    <b-tabs content-class="mt-3" v-model="activeTab">
      <b-tab title="Lista de Facturas" key="list" active>

        <template #title>
          Lista de facturas
          <b-button variant="white" class="align-self-center" v-if="activeTab!==1" @click="loadInvoices" size="sm">
            <b-icon icon="arrow-counterclockwise"></b-icon>
          </b-button>
        </template>

        <template v-slot:default>
          <!-- Tabla para mostrar las facturas -->
          <b-table hover :items="paginatedInvoices" :fields="fields" responsive="sm">

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
              {{ data.item.claveAcceso }}
            </template>
          </b-table>

          <!-- Paginación -->
          <b-pagination
              v-model="currentPage"
              :total-rows="invoices.length"
              :per-page="perPage"
              align="center"
              class="mt-3"
          ></b-pagination>
        </template>
      </b-tab>

      <b-tab title="Nueva Factura" key="create">
        <template v-slot:default>
          <!-- Componente de creación de facturas -->
          <FacturacionComponent></FacturacionComponent>
        </template>
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
import {getInvoices} from '@/services/invoiceServices';
import FacturacionComponent from '@/components/clientes/FacturacionComponent.vue';

export default {
  name: 'PrincipalFacturacionComponent',
  components: {
    FacturacionComponent
  },
  data() {
    return {
      invoices: [],
      activeTab: 'list', // Controlador de la pestaña activa
      fields: [
        {key: 'secuencial', label: 'Secuencial'},
        {key: 'emisorRazonSocial', label: 'Razón Social del Emisor'},
        {key: 'fechaEmision', label: 'Fecha de Emisión'},
        {key: 'importeTotal', label: 'Importe Total'},
        {key: 'claveAcceso', label: 'Clave de Acceso'}
      ],
      perPage: 10, // Número de elementos por página
      currentPage: 1, // Página actual
    };
  },
  computed: {
    // Migas de pan dinámicas
    breadcrumbItems() {
      return this.activeTab === 'list'
          ? [
            {text: 'Facturación', href: '#'},
            {text: 'Lista de Facturas', active: true}
          ]
          : [
            {text: 'Facturación', href: '#'},
            {text: 'Nueva Factura', active: true}
          ];
    },
    paginatedInvoices() {
      // Filtra las facturas en función de la paginación actual
      const start = (this.currentPage - 1) * this.perPage;
      const end = start + this.perPage;
      return this.invoices.slice(start, end);
    }
  },
  methods: {
    async loadInvoices() {
      try {
        const dataInvoices = await getInvoices();
        this.invoices = dataInvoices;
      } catch (error) {
        console.error('Error al cargar facturas:', error);
      }
    }
  },
  async mounted() {
    await this.loadInvoices();
  }
};
</script>

<style scoped>
.mb-3 {
  margin-bottom: 1.5rem;
}
</style>
