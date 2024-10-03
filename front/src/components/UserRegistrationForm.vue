<template>
    <form @submit.prevent="registerUser">
      <input v-model="fullNameUser" placeholder="Full Name" />
      <input v-model="addressUser" placeholder="Address" />
      <button type="submit">Register</button>
    </form>
  </template>
  
  <script>
  import { registerUser } from '@/services/api';
  
  export default {
    data() {
      return {
        fullNameUser: '',
        addressUser: ''
      };
    },
    methods: {
      async registerUser() {
        try {
          await registerUser(this.fullNameUser, this.addressUser);
        } catch (error) {
          console.error('Error registering user:', error);
        }
      }
    }
  };
  </script>
  
