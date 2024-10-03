<template>
  <div class="mt-2 bg-white">
    
    <b-nav class="flex-column mt-2">
      <b-nav-item v-for="item in items" :key="item.id" @click="handleItemClick(item.name)"
        :style="{ 'background-color': selectedMenuItem === item.name ? 'whitesmoke' : '' }">
        <b-icon :icon="item.icon" :variant="item.color" class="mr-2" />
        <span class="mr-3">
          {{ item.name }}
        </span>
      </b-nav-item>
    </b-nav>
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
      selectedMenuItem: 'Todo' 
    };
  },
  methods: {
    handleItemClick(itemName) {
     
      this.selectedMenuItem = itemName;

      this.$emit('selectItem', itemName);
    }
  }
};
</script>
