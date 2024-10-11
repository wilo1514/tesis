<template>
  <div class="mt-2 bg-white">
    <b-nav class="flex-column mt-2">
      <!-- Itera sobre los items principales -->
      <div v-for="item in items" :key="item.id">
        <b-nav-item v-if="!item.subitems" @click="handleItemClick(item.name)"
                    :style="{ 'background-color': selectedMenuItem === item.name ? 'whitesmoke' : '' }">
          <b-icon :icon="item.icon" :variant="item.color" class="mr-2"/>
          <span class="mr-3 text-small">{{ item.name }}</span>
        </b-nav-item>

        <!-- Si el item tiene subitems, no emite el evento selectItem -->
        <div v-else>
          <b-nav-item :style="{ 'background-color': selectedMenuItem === item.name ? 'whitesmoke' : '' }">
            <b-icon :icon="item.icon" :variant="item.color" class="mr-2"/>
            <b-button v-b-toggle="'subitems-' + item.id"  variant="transparent" class="p-0 ml-auto"   :class="`text-${item.color}`">
              <span class="mr-3 text-small ">{{ item.name }}</span>
              <b-icon :icon="openItem === item.id ? 'chevron-compact-up' : 'chevron-compact-down'"/>
            </b-button>
          </b-nav-item>

          <!-- Subitems (toggleable) debajo del item principal -->
          <b-collapse :id="'subitems-' + item.id" @show="openItem = item.id" @hide="openItem = null" >
            <b-nav class="ml-4">
              <b-nav-item v-for="subitem in item.subitems" :key="subitem.id" @click="handleSubitemClick(subitem.name)"
                          class="d-block w-100"
                          :style="{ 'background-color': selectedSubitem === subitem.name ? 'whitesmoke' : '' }">
                <span class="mr-2 text-small">{{ subitem.name }}</span>
                <br>
              </b-nav-item>
            </b-nav>
          </b-collapse>
        </div>
      </div>
    </b-nav>

    <!-- Sidebar que puede ser controlado desde el menú (opcional) -->
    <b-sidebar id="menu-sidebar" title="Opciones adicionales" shadow>
      <div class="px-3 py-2">
        <p>Aquí puedes agregar información adicional o enlaces rápidos del menú.</p>
        <p>Por ejemplo, una sección de ayuda, información de contacto, etc.</p>
      </div>
    </b-sidebar>
  </div>
</template>

<script>
export default {
  props: {
    items: Array,
    activeItem: String
  },
  data() {
    return {
      selectedMenuItem: '',   // Main item
      selectedSubitem: '',    // Subitem
      openItem: null          // Controls which item is expanded
    };
  },
  methods: {
    handleItemClick(itemName) {
      // Solo actualiza si no hay subitems
      this.selectedMenuItem = itemName;
      this.$emit('selectItem', itemName);
    },
    handleSubitemClick(subitemName) {
      this.selectedSubitem = subitemName;
      this.$emit('selectSubitem', subitemName);
    },
    toggleSidebar() {
      this.$bvSidebar.show('menu-sidebar'); // Muestra la sidebar al hacer clic
    }
  }
};
</script>
