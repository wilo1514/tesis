<template>
  <div>
    <b-container>
      <h2 class="mb-4">Usuarios</h2>

      <!-- Formulario para registrar un nuevo usuario -->
      <b-form @submit.prevent="registerUser">
        <b-form-group label="Nombre:" label-for="nameInput">
          <b-form-input
              id="nameInput"
              v-model="newUser.username"
              placeholder="Ingresa el nombre"
              required
          ></b-form-input>
        </b-form-group>

        <b-form-group label="Correo:" label-for="emailInput">
          <b-form-input
              id="emailInput"
              type="email"
              v-model="newUser.email"
              placeholder="Ingresa el correo"
              required
          ></b-form-input>
        </b-form-group>

        <b-form-group label="Contraseña:" label-for="passwordInput">
          <b-form-input
              id="passwordInput"
              type="password"
              v-model="newUser.password"
              placeholder="Ingresa la contraseña"
              required
          ></b-form-input>
        </b-form-group>

        <b-button type="submit" variant="primary">Registrar</b-button>
      </b-form>

      <hr />

      <h3 class="mt-4">Lista de Usuarios</h3>
      <b-list-group v-if="usuarios.length">
        <b-list-group-item v-for="usuario in usuarios" :key="usuario.id">
          {{ usuario.username }} - {{ usuario.email }}
        </b-list-group-item>
      </b-list-group>
      <b-alert v-else variant="info">No hay usuarios registrados.</b-alert>
    </b-container>
  </div>
</template>

<script>
import {registerUser} from "@/services/api"; // Importa la función de registro
import axios from "axios";

export default {
  data() {
    return {
      usuarios: [],
      newUser: {
        username: "",
        email: "",
        password: "",
      },
    };
  },
  mounted() {
    this.fetchUsers();
  },
  methods: {
    async fetchUsers() {
      try {
        const response = await axios.get("http://localhost:3000/api/Users"); // Cambia la URL según sea necesario
        this.usuarios = response.data;
      } catch (error) {
        console.error("Error al obtener los usuarios:", error);
      }
    },
    async registerUser() {
      try {
        const response = await registerUser(this.newUser);
        console.log("Usuario registrado:", response);
        this.newUser = {username: "", email: "", password: ""}; // Resetea el formulario
        this.fetchUsers(); // Refresca la lista de usuarios
      } catch (error) {
        console.error("Error al registrar el usuario:", error);
      }
    },
  },
};
</script>

<style scoped>
/* Puedes agregar tus estilos personalizados aquí si lo necesitas */
</style>
