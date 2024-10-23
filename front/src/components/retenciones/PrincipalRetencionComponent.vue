<template>
  <div>
    <div class="d-flex justify-content-end mr-4 mt-4">
      <b-breadcrumb class="m-0 p-0" :items="breadcrumbItems"></b-breadcrumb>
    </div>


<!--    {{listRetenciones}}-->

    <!--    <div class="d-flex justify-content-between align-items-center p-3">-->
    <!--      <div>-->
    <!--        <h2 class="mb-0 text-primary">Retenciones</h2>-->
    <!--      </div>-->
    <!--      <div>-->
    <!--        <b-button variant="white" class="align-self-center m-2" v-if="activeTab!==1" @click="loadBillings">-->
    <!--          <b-icon icon="arrow-counterclockwise"></b-icon>-->
    <!--        </b-button>-->
    <!--      </div>-->
    <!--    </div>-->
    <b-tabs content-class="mt-3" v-model="activeTab">
      <b-tab title="Lista de Facturas" key="list" active>

        <template #title>
          Lista de facturas de compra
          <b-button variant="white" class="align-self-center" v-if="activeTab!==1" @click="loadBillings" size="sm">
            <b-icon icon="arrow-counterclockwise"></b-icon>
          </b-button>
        </template>
        <template v-slot:default>
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
              {{ data.item.claveAcceso }}
            </template>
          </b-table>

          <b-pagination
              v-model="currentPage"
              :total-rows="listRetenciones.length"
              :per-page="perPage"
              align="center"
              class="mt-3"
          ></b-pagination>
        </template>
      </b-tab>

      <b-tab title="Nueva Factura de compra" key="create">
        <template v-slot:default>
          <!--              <FacturacionComponent></FacturacionComponent>-->
         <NuevaFacturaCompraComponent></NuevaFacturaCompraComponent>
        </template>
      </b-tab>

      <b-tab title="Nueva Retención" key="create">
        <template v-slot:default>
          <!--              <FacturacionComponent></FacturacionComponent>-->
          <RetencionComponent></RetencionComponent>
        </template>
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
import {getBillings} from '@/services/saveBillingService';
import RetencionComponent from "@/components/retenciones/RetencionComponent.vue";
import NuevaFacturaCompraComponent from "@/components/retenciones/NuevaFacturaCompraComponent.vue";

export default {
  name: 'PrincipalRetencionComponent',
  components: {
    NuevaFacturaCompraComponent,
    RetencionComponent,
  },
  data() {
    return {
      listRetenciones: [],
      activeTab: 'list', // Controlador de la pestaña activa
      fields: [
        {key: 'fechaEmision', label: 'Fecha de Emisión'},
        {key: 'numeroComprobante', label: 'numeroComprobante'},
        {key: 'emisorRazonSocial', label: 'Razón Social del Emisor'},
        {key: 'importeTotal', label: 'Importe Total'},
        {key: 'numeroAutorizacion', label: '#Autorización'},
      ],
      perPage: 5, // Número de elementos por página
      currentPage: 1, // Página actual
    };
  },
  computed: {
    // Migas de pan dinámicas
    breadcrumbItems() {
      return this.activeTab === 'list'
          ? [
            {text: 'Retenciones', href: '#'},
            {text: 'Lista', active: true}
          ]
          : [
            {text: 'Retenciones', href: '#'},
            {text: 'Nueva Retención', active: true}
          ];
    },
    paginatedRetenciones() {
      // Filtra las facturas en función de la paginación actual
      const start = (this.currentPage - 1) * this.perPage;
      const end = start + this.perPage;
      return this.listRetenciones.slice(start, end);
    }
  },
  methods: {
    async loadBillings() {
      try {
        this.listRetenciones = await getBillings();

      } catch (error) {
        console.error('Error al cargar facturas:', error);
      }
    }
  },
  async mounted() {
    await this.loadBillings();

    console.log("cargar billing")
  }
};
</script>

<style scoped>
.mb-3 {
  margin-bottom: 1.5rem;
}
</style>
