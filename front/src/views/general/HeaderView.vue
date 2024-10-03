<template>
    <div>
        <b-navbar variant="white" type="primary" class="fixed-top shadow">
            <b-navbar-brand class="d-flex align-items-center justify-content-between w-100 text-primary ">
                <div style="margin-left: 20px !important;">
                    <a href="/">
                        <img src="../../assets/logoTodoList2.png" width="70" alt="Logo" class="" />
                    </a>
                </div>
                <h4 class="text-center mx-auto">TodoList | Secure software</h4>
                <div v-if="isAuthenticated">
                    <b-row>
                        <b-col class="mt-1">
                            <span><small class="text-muted"> Welcome,</small> {{ nameUser }}</span>
                        </b-col>
                        <b-col>

                            <div class="text-center">
                                <img src="../../assets/login.png" alt="" width="30">
                            </div>
                        </b-col>
                    </b-row>

                </div>

            </b-navbar-brand>
        </b-navbar>
    </div>
</template>

<script>
import { isAuthenticated, getAuthData } from '@/services/auth'; 

export default {
    name: 'HeaderView',
    props: {
        loggedInUser: {
            type: String,
            default: 'Invitado'
        }
    },
    computed: {
        isAuthenticated() {
            return isAuthenticated();
        },
        nameUser() {
            const authData = getAuthData();
            return authData.nameUser || this.loggedInUser;
        },
        idUser() {
            const authData = getAuthData();
            return authData.idUser || this.loggedInUser;
        }
    }
};
</script>
