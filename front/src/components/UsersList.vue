<template>
    <div>
        <div class="text-center m-2">
            <h2>Todos los usuarios</h2>
        </div>
        <div class="row">
            <div class="col-4" v-for="user in userList" :key="user.id">
                <b-card class="mb-2">
                    <b-card-header>{{ user.nameUser }}</b-card-header>
                    <b-card-body>
                        <p> {{ user.id }}</p>
                        <p>{{ user.identificationUser }}</p>
                        <p>{{ user.emailUser }}</p>
                        <p>{{ user.createUser }}</p>
                    </b-card-body>
                </b-card>
            </div>
        </div>
    </div>
</template>
<script>
import { getUsers } from '@/services/api';
export default {
    data() {
        return {
            userList: [],
        };
    },
    created() {
        this.fetchUserList();
    },
    methods: {
        async fetchUserList() {
            try {
                const userList = await getUsers();
                this.userList = userList;
            } catch (error) {
                console.error('Error fetching user list:', error);
            }
        },

    },
};
</script>
  
