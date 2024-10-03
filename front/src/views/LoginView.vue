<template>
  <div>
    <b-container>
      <div class="text-center">
        <h3 class="mb-4">Sign in</h3>

        <small class="mb-2">Sign in and start managing your tasks!</small>
      </div>
      <b-form @submit.prevent="login">
        <b-form-group label-for="username-input">
          <b-form-input v-model="identificationUser" id="username-input" placeholder="Identification" type="text"
            required class="m-2"></b-form-input>
        </b-form-group>
        <b-form-group>
          <b-form-input v-model="passwordUser" placeholder="Password" type="password" required
            class="m-2"></b-form-input>
        </b-form-group>
        <div class="text-end">
          <small :class="messageClass">{{ loginMessage }}</small>
          <b-button type="submit" variant="success" class="m-2 w-100">Login</b-button>
        </div>
      </b-form>
    </b-container>
    <AvisoModal :aviso="aviso" />

    <HeaderView :name-user="loggedInUserName" />
  </div>
</template>

<script>
import { login } from '@/services/api';
import HeaderView from './general/HeaderView.vue';
import { setAuthData } from '@/services/auth';

export default {
  components: {
    HeaderView
  },
  data() {
    return {
      identificationUser: '',
      passwordUser: '',
      loginMessage: '',
      loggedInUserName: '',
      aviso: {
        titulo: '',
        texto: '',
        type: 'success'
      },
      isLogged: false
    };
  },
  computed: {
    messageClass() {
      return this.loginMessage.includes('error') ? 'text-danger' : 'text-success';
    }

  },
  methods: {
    async login() {
      try {
        const userData = await login(this.identificationUser, this.passwordUser);
        console.log("user", userData);
        this.loggedInUserName = userData.result.usuario.nameUser;

        localStorage.setItem('token', userData.result.token);

        const loggedInUserName = userData.result.usuario.nameUser;
        const loggedIdUser = userData.result.usuario.idUser;

        setAuthData(userData.result.token, loggedInUserName, loggedIdUser);
        this.aviso.titulo = 'Welcome!';
        this.aviso.texto = loggedInUserName;
        this.aviso.type = 'success';

        this.isLogged = true;

      } catch (error) {
        console.error('Login error:', error);
        this.loginMessage = 'Invalid username or password, please try again!';
      }
    },

    
    toPageAfterNotification() {
      if (this.isLogged) {
        setTimeout(() => {
          this.$router.push({ name: 'UserDashboard' });
        }, 2000);
      }
    },

  },
  watch: {
    aviso: {
      handler() {
        this.toPageAfterNotification();
      },
      deep: true
    }
  }
};
</script>
