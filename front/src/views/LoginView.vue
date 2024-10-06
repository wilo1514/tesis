<template>
  <div>
      <div class="text-center">
        <h3 class="mb-4">Ingresar</h3>
        <small class="mb-2">Inicia sesión y comienza a gestionar tus tareas!</small>
      </div>
      <b-form @submit.prevent="login">
        <b-form-group label-for="username-input">
          <b-form-input v-model="identificationUser" id="username-input" placeholder="Ingrese su correo" type="text"
            required class="m-2"></b-form-input>
        </b-form-group>
        <b-form-group>
          <b-form-input v-model="passwordUser" placeholder="Ingrese su contraseña" type="password" required
            class="m-2"></b-form-input>
        </b-form-group>
        <div class="text-end">
          <small :class="messageClass">{{ loginMessage }}</small>
          <b-button type="submit" variant="success" class="m-2 w-100">Ingresar</b-button>
        </div>
      </b-form>
    <AvisoModal :aviso="aviso" />

    <HeaderView :name-user="loggedInUserName" />
  </div>
</template>

<script>
import { login, identifyLogin } from '@/services/api';
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
        type: 'success',
      },
      isLogged: false,
      responseIdLogin: [],
      isLoggingIn: false,

    };
  },
  computed: {
    messageClass() {
      return this.loginMessage.includes('error') ? 'text-danger' : 'text-success';
    }

  },
  methods: {

    async Identifylogin() {
      try {
        const userLoeado = await identifyLogin();
        console.log("user identifyLogin", userLoeado);
        this.responseIdLogin = userLoeado;
      } catch (error) {
        if (error.response) {
          // El servidor respondió pero hubo un problema con los datos
          this.loginMessage = 'Invalid username or password, please try again!';
        } else if (error.request) {
          // El servidor no respondió (problema de red)
          this.loginMessage = 'Network error, please check your connection!';
        } else {
          // Otro tipo de error
          this.loginMessage = 'An unexpected error occurred!';
        }
        console.error('Login error:', error);
      }
    }
    ,
    async login() {
  this.isLoggingIn = true;
  try {
    // Hacer el login usando la función de servicio 'login' y pasando el email y contraseña
    const userData = await login(this.identificationUser, this.passwordUser);
    
    // Revisar si el login fue exitoso y la data tiene el token
    if (userData && userData.token && userData.user) {
      console.log("user", userData);
      
      // Extraer datos del usuario
      const token = userData.token;
      const loggedInUserName = userData.user.username;
      const loggedIdUser = userData.user.id;  // Suponiendo que 'id' es el identificador del usuario

      // Guardar token en localStorage
      localStorage.setItem('token', token);

      // Establecer los datos de autenticación
      setAuthData(token, loggedInUserName, loggedIdUser);

      // Mostrar notificación de éxito
      this.aviso.titulo = 'Welcome!';
      this.aviso.texto = loggedInUserName;
      this.aviso.type = 'success';

      // Cambiar el estado de logueo
      this.isLogged = true;

      // Redirigir a la página correspondiente después del login exitoso
      this.toPageAfterNotification();
    } else {
      throw new Error('Invalid login response');
    }
  } catch (error) {
    console.error('Login error:', error);

    // Mensaje de error al usuario
    this.loginMessage = 'Invalid username or password, please try again!';
  } finally {
    this.isLoggingIn = false;
  }
},


    toPageAfterNotification() {
      if (this.isLogged) {
        setTimeout(() => {
          if (this.$route.name !== 'UserDashboard') {
            this.$router.replace({ name: 'UserDashboard' });

          }
        }, 2000);
      }
    }


  },
  watch: {
    aviso: {
      handler() {
        this.toPageAfterNotification();
      },
      deep: true
    }
  },
  mounted() {
    this.Identifylogin();
  }
};
</script>
