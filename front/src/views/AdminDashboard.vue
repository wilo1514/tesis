<template>
  <div>
    <HeaderView />
    <h1>Admin Dashboard</h1>

    <div class="container-fluid d-flex flex-column pt-0" style="height: 90vh;">
      <div class="row flex-grow-1">
        <MenuView :items="navigationItems" class="col bg-light mt-2" />

        <div class="col-lg-8">
          <UsersList />
        </div>
        <div class="col-lg-2">
        </div>
      </div>
    </div>

    <FooterView class="fixed-bottom bg-primary text-light"></FooterView>
  </div>
</template>

<script>
import UsersList from '@/components/UsersList.vue';
import HeaderView from './general/HeaderView';
import FooterView from './general/FooterView';
import MenuView from './general/MenuView'; 

export default {
  components: {
    UsersList,
    HeaderView,
    FooterView,
    MenuView 
  },
  data() {
    return {
      navigationItems: [
        { id: 2, name: 'All Users', to: '/all-users', icon: 'list-ul' }
      ]
    };
  },
  methods: {
    isActive(item) {
      return this.$route.path === item.to;
    }
  }

};
</script>

