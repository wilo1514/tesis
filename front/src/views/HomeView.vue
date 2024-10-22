<template>
  <div id="app">
    <HeaderView/>
    <br>
    <div class="container-fluid d-flex flex-column pt-4" style="height: 90vh;">
      <div class="row flex-grow-1">
        <div class="col-lg-9 bg-white d-flex justify-content-center align-items-center">
          <div class="row text-center">
            <h3 class="mt-4">Sistema Contable</h3>

            <div class="col-12">
              <div class="div">
                <video autoplay muted width="100%">
                  <source src="https://accescont.com/files/videoportadapginaweb2.mp4"
                          type="video/mp4">
                  Your browser does not support the video tag.
                </video>

              </div>
            </div>

          </div>
        </div>

        <div class="row col-lg-3 p-3 ">
          <div class="col-12 d-flex justify-content-center align-items-center">

            <div class="">

              <LoginInicial/>
            </div>

          </div>


        </div>
      </div>
    </div>
    <FooterView class="fixed-bottom bg-primary text-light"></FooterView>

  </div>
</template>

<script>
import LoginInicial from './LoginView.vue'
import FooterView from './general/FooterView.vue';
import HeaderView from './general/HeaderView.vue';

export default {
  name: 'App',
  components: {
    LoginInicial,
    FooterView,
    HeaderView,
  },


}
</script>
<style lang="scss">
@import "@/styles/inicio.scss";
</style>