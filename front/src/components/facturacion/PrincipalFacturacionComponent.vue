<template>
  <div>
    <h1>Gestión de Facturas</h1>

    <!-- Botón para alternar entre Lista de Facturas y Nueva Factura -->
    <b-button @click="toggleView" variant="primary" class="mb-3">
      {{ buttonLabel }}
    </b-button>

    <!-- Mostrar la tabla de facturas o el componente de facturación dependiendo del estado -->
    <div v-if="showInvoiceList">
      <!-- Tabla para mostrar las facturas -->
      <b-table striped hover :items="invoices" :fields="fields">

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
    </div>

    <div v-else>
      <!-- Componente de facturación -->
      <FacturacionComponent></FacturacionComponent>
    </div>
  </div>
</template>

<script>
import { getInvoices } from '@/services/invoiceServices';
import FacturacionComponent from '@/components/clientes/FacturacionComponent.vue';

export default {
  name: 'PrincipalFacturacionComponent',
  components: {
    FacturacionComponent
  },
  data() {
    return {
      invoices: [],
      showInvoiceList: true, // Estado para alternar entre lista de facturas y nueva factura
      fields: [
        { key: 'secuencial', label: 'Razón Social del Emisor' },
        { key: 'emisorRazonSocial', label: 'Razón Social del Emisor' },
        { key: 'fechaEmision', label: 'Fecha de Emisión' },
        { key: 'importeTotal', label: 'Importe Total' },
        { key: 'claveAcceso', label: 'Clave de Acceso' }
      ],
    };
  },
  computed: {
    buttonLabel() {
      // Cambia el texto del botón dependiendo del estado actual
      return this.showInvoiceList ? 'Nueva Factura' : 'Lista de Facturas';
    }
  },
  methods: {
    toggleView() {
      // Alternar entre mostrar la lista de facturas y el componente de nueva factura
      this.showInvoiceList = !this.showInvoiceList;
    },
    async loadInvoices() {
      try {
        const dataInvoices = await getInvoices();
        this.invoices = dataInvoices;
      } catch (error) {
        console.error('Error al cargar facturas:', error);
      }
    }
  },
  mounted() {
    this.loadInvoices();
  }
};
</script>

<style scoped>
.mb-3 {
  margin-bottom: 1.5rem;
}
</style>
