<template>
  <div>
    <HeaderView/>

    <div class="container-fluid d-flex flex-column pt-0 mt-5" style="height:85vh; overflow-y: scroll;">
      <div class="row flex-grow-1 mt-3 m-2">

        <!-- Usar el componente MenuView para mostrar el menú -->
        <MenuView :items="navigationItems" @selectItem="handleNavigation" @selectSubitem="handleNavigation"
                  class="col bg-light mt-2"/>
        <div :class="['col-lg-7', !selectedTask ? 'col-lg-10' : 'col-lg-7']">
          <div v-show="activeNavItem === 'Home'">
            <PrincipalComponent></PrincipalComponent>

          </div>
          <div v-show="activeNavItem === 'Lista de Clientes'">
            <ClientComponent></ClientComponent>
          </div>

          <div v-show="activeNavItem === 'Facturación'">
            <PrincipalFacturacionComponent></PrincipalFacturacionComponent>
          </div>

          <div v-show="activeNavItem === 'Inventario'">
            <InventarioComponent></InventarioComponent>
          </div>

          <div v-show="activeNavItem === 'Lista de Proveedores'">
            <SupplierComponent></SupplierComponent>
          </div>

          <div v-show="activeNavItem === 'Retenciones'">
            <RetencionComponent></RetencionComponent>
          </div>

          <div v-show="activeNavItem === 'Facturas de compra'">
            <FacturasCompraComponent></FacturasCompraComponent>

          </div>
          <div v-show="activeNavItem === 'Registros contables'">
            PRUEBA REGISTROS
            <!--<b-card class="mt-3">
           <TaskList :tasks="tasks" @edit-task="handleEditTask" @edit-task-hidden="handleEditTaskHidden"
              :menu="activeNavItem" :selectedTask="selectedTask" :refresh="refresh" />
            </b-card>-->
          </div>

          <div v-show="activeNavItem === 'Usuarios'">
            <AdminUsuariosComponent></AdminUsuariosComponent>
          </div>
        </div>
        <div class="col-lg-3">
          <div v-if="selectedTask">
            <!-- <TaskListDetail :selectedTask="selectedTask" /> -->
          </div>

        </div>
      </div>
    </div>

    <FooterView class="fixed-bottom bg-primary text-light"></FooterView>
  </div>
</template>

<script>
import TaskForm from '@/components/TaskForm';
import TaskListDetail from '@/components/TaskListDetail';
import TaskList from '@/components/TaskList.vue';
import HeaderView from './general/HeaderView';
import FooterView from './general/FooterView';
import MenuView from './general/MenuView';
import store from '@/store/index';
import ClientComponent from '@/components/clientes/ClientComponent.vue';
import PrincipalComponent from '@/components/principal/principalComponent.vue';
import InventarioComponent from '@/components/inventario/InventarioComponent.vue';
import FacturacionComponent from '@/components/clientes/FacturacionComponent.vue';
import PrincipalFacturacionComponent from '@/components/facturacion/PrincipalFacturacionComponent.vue';
import SupplierComponent from '@/components/proveedores/proveedorComponent.vue';
import AdminUsuariosComponent from '@/components/administrador/usuarios/AdminUsuariosComponent.vue';
import PrincipalRetencionComponent from "@/components/retenciones/PrincipalRetencionComponent.vue";
import FacturasCompraComponent from "@/components/proveedores/FacturasCompraComponent.vue";
import RetencionComponent from "@/components/retenciones/RetencionComponent.vue";

export default {
  components: {
    RetencionComponent,
    FacturasCompraComponent,
    PrincipalRetencionComponent,
    TaskForm,
    HeaderView,
    FooterView,
    MenuView,
    TaskList,
    TaskListDetail,
    ClientComponent,
    PrincipalComponent,
    InventarioComponent,
    FacturacionComponent,
    SupplierComponent,
    AdminUsuariosComponent,
    PrincipalFacturacionComponent
  },
  data() {
    return {
      navigationItems: [
        {
          id: 0,
          name: 'Home',
          icon: 'house',
          color: 'primary',
          subitems: null // No tiene subitems
        },
        {
          id: 1,
          name: 'Clientes',
          icon: 'person',
          color: 'primary',
          subitems: [
            {id: 11, name: 'Lista de Clientes'},
            {id: 12, name: 'Facturación'}
          ]
        },
        {
          id: 4,
          name: 'Inventario',
          icon: 'box-seam',
          color: 'primary',
          // subitems: [
          // {id: 41, name: 'Ver Inventario'},
          // {id: 42, name: 'Añadir Producto'}
          // ]
        },

        {
          id: 2,
          name: 'Proveedores',
          icon: 'people',
          color: 'primary',
          subitems: [
            {id: 21, name: 'Lista de Proveedores'},
            {id: 22, name: 'Facturas de compra'},
            {id: 23, name: 'Retenciones'}
          ]
        },
        {
          id: 3,
          name: 'Registros contables',
          icon: 'files',
          color: 'primary',
          subitems: null // No tiene subitems
        },
        {
          id: 5,
          name: 'Administrador',
          icon: 'gear',
          color: 'primary',
          subitems: [
            {id: 51, name: 'Ajustes'},
            {id: 52, name: 'Usuarios'}
          ]
        }
      ],
      activeNavItem: 'Home',
      showTaskDetail: false,
      selectedTask: null,
      tasks: [],
      perPage: 10,
      currentPage: 1,
      tareas: [],
      refresh: false,
      store
    };
  },
  watch: {
    tasks(newTasks) {
      this.tasks = newTasks;
      this.internalPage = 1;
    },
  },
  methods: {

    handleNavigation(selectedItem) {
      this.activeNavItem = selectedItem;
    },
    handleEditTask(task) {
      this.selectedTask = task;
      this.showTaskDetail = true;
    },
    handleEditTaskHidden() {
      this.selectedTask = null;
      this.showTaskDetail = false;
    },
    actualizar(updatedTasks) {
      this.tasks = updatedTasks;
    },


    handleShowTaskDetail(task) {
      this.selectedTask = task;


    },

    handleTaskAdded(updatedTasks) {
      this.tasks = updatedTasks;
      this.refresh = true;
    },
  }


};
</script>


