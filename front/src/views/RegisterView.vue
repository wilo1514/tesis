<template>
  <div>
    <b-container>
      <div class="text-center">
        <h3 class="mb-4">Register</h3>
      </div>

      <b-form @submit.prevent="register">
        <b-form-group label-for="identification-input">
          <label for="identification-input">Identification</label>
          <small v-if="identificationError" class="text-danger">{{ identificationError }}</small>
          <b-form-input v-model="registrationData.identificationUser" id="identification-input" type="number"
            max="9999999999" placeholder="Identification" required @input="restrictLength"></b-form-input>
        </b-form-group>
        <b-form-group label-for="name-input">
          <label for="name-input">Full Name</label>
          <b-form-input v-model="registrationData.nameUser" id="name-input" placeholder="Name" required></b-form-input>
        </b-form-group>
        <b-form-group label="Email" label-for="email-input">
          <b-form-input v-model="registrationData.emailUser" id="email-input" placeholder="Email" required
            :class="{ 'is-invalid': !isEmailValid && registrationData.emailUser !== '' }"></b-form-input>
          <small v-if="!isEmailValid && registrationData.emailUser !== ''" class="text-danger">Please enter a valid email
            address!</small>
        </b-form-group>



        <b-form-group label-for="password-input">
          <b-row>
            <b-col md="9">
              <label for="password-input">Password</label>
            </b-col>
            <b-col>
              <b-button @click="togglePasswordVisibility" variant="transparent" class="ml-2 btn-sm"
                v-if="registrationData.passwordUser">
                <b-icon v-if="showPassword" icon="eye-slash"></b-icon>
                <b-icon v-else icon="eye"></b-icon>
              </b-button>
            </b-col>

          </b-row>
          <b-form-input v-model="registrationData.passwordUser" placeholder="Password"
            :type="showPassword ? 'text' : 'password'" required :class="passwordStrengthClassText"
            @input="checkPasswordStrength"></b-form-input>
          <b-row class="m-1" v-if="passwordStrength.score">
            <b-col md="8" class="mt-2 justify-content-between">
              <b-progress :value="passwordStrength.score * 25" :max="100" :variant="getVariant()" style="height: 5px;">
              </b-progress>
            </b-col>
            <b-col>
              <small :class="passwordStrengthClassText">
                {{ passwordStrengthLabel }}
              </small>
            </b-col>
          </b-row>
        </b-form-group>
        <div class="mt-4 text-end">

          <b-button v-if="passwordStrength.score >= 4 && isEmailValid" type="submit" variant="success"
            class="w-100">Register</b-button>

        </div>
      </b-form>
      <AvisoModal :aviso="aviso" />
    </b-container>
  </div>
</template>

<script>
import { registerUser } from '@/services/api';
import zxcvbn from 'zxcvbn';

export default {

  data() {
    return {
      registrationData: {
        identificationUser: '',
        nameUser: '',
        emailUser: '',
        passwordUser: ''
      },
      aviso: {
        titulo: '',
        texto: '',
        type: 'success'
      },
      identificationError: '',
      isRegistered: false,
      passwordStrength: {
        score: 0,
      },
      showPassword: false,
    };
  },
  watch: {
    aviso: {
      handler() {
        
        // this.reloadPageAfterNotification();
      },
      deep: true
    }
  },
  computed: {
    isEmailValid() {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(this.registrationData.emailUser);
    },

    passwordStrengthClassText() {
      return {
        "text-danger": this.passwordStrength.score <= 2,
        "text-warning": this.passwordStrength.score === 3,
        "text-success": this.passwordStrength.score >= 4,
      };
    },
    passwordStrengthLabel() {
      const score = this.passwordStrength.score;
      if (score <= 2) {
        return "Weak";
      } else if (score === 3) {
        return "Medium";
      } else {
        return "Strong";
      }
    },
  },
  methods: {
    async register() {
      try {
        const userData = await registerUser(this.registrationData);

        if (userData.isSuccess) {
          this.aviso.titulo = '¡Registrado!';
          this.aviso.texto = 'El registro se ha completado exitosamente.';
          this.aviso.type = 'success';
          this.isRegistered = true;
          this.vaciarCampos();
        } else {
          this.aviso.titulo = 'Error';
          this.aviso.texto = 'Hubo un problema con el registro.';
          this.aviso.type = 'error';
        }
      } catch (error) {
        this.vaciarCampos();
        this.aviso.titulo = 'Atención!';
        this.aviso.texto = error.response.data.errorMessages[0];
        this.aviso.type = 'warning';

      }
    },
    vaciarCampos() {
      this.registrationData.identificationUser = '';
      this.registrationData.nameUser = '';
      this.registrationData.emailUser = '';
      this.registrationData.passwordUser = '';
      this.passwordStrength.score = 0;
    },
    restrictLength() {
      if (this.registrationData.identificationUser.length > 13) {
        this.registrationData.identificationUser = this.registrationData.identificationUser.slice(0, 13);
      }
    },
    reloadPageAfterNotification() {
      if (this.isRegistered) {
        setTimeout(() => {
          location.reload();
        }, 3000);
      }
    },
    checkPasswordStrength() {
      const password = this.registrationData.passwordUser;
      const result = zxcvbn(password);
      this.passwordStrength = { score: result.score };
    },
    getVariant() {
      if (this.passwordStrength.score === 0) {
        return 'light';
      } else if (this.passwordStrength.score <= 2) {
        return 'danger';
      } else if (this.passwordStrength.score === 3) {
        return 'warning';
      } else if (this.passwordStrength.score >= 4) {
        return 'success';
      }
    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
  },
};
</script>


