<template>
    <div id="app">
        <HeaderView />
        <br>
        <div class="container-fluid d-flex flex-column pt-4" style="height: 90vh;">
            <div class="row flex-grow-1">
                <div class="col-lg-9 bg-white d-flex justify-content-center align-items-center">
                    <div class="row text-center">

                        <div class="col-12">
                            <div class="div">
                                <img src="./../assets/inicio.png" alt="" style="width: 25vw">
                            </div>
                            <h1>¡One simple to do list for you!</h1>
                        </div>
                        <div class="col-12">

                        </div>
                    </div>
                </div>

                <div class="row col-lg-3 p-3 ">
                    <div class="col-12 tabs-height mt-4 border-left border border-light bg-white">
                        <br>
                        <b-tabs align="end" content-class="tabs-end">
                            <b-tab active title="Login">
                                <LoginInicial />
                            </b-tab>
                            <b-tab title="Register">
                                <RegisterView />
                            </b-tab>
                        </b-tabs>
                    </div>
                    

                </div>
            </div>
        </div>
        <FooterView class="fixed-bottom bg-primary text-light"></FooterView>

    </div>
</template>
  
<script>
import LoginInicial from './LoginView.vue'
import RegisterView from './RegisterView.vue';
import FooterView from './general/FooterView.vue';
import HeaderView from './general/HeaderView.vue';

export default {
    name: 'App',
    components: {
        LoginInicial,
        RegisterView,
        FooterView,
        HeaderView,
    },


}
</script>
<style lang="scss">
@import "@/styles/inicio.scss";
</style>
  
  