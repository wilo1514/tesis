<template>
    <div></div>
  </template>
  
  <script>
  import Swal from 'sweetalert2';
  
  export default {
    props: ['aviso'],
    watch: {
      aviso: {
        handler(newValue) {
          this.mostrarAviso(newValue);
        },
        deep: true
      }
    },
    methods: {
      mostrarAviso(aviso) {
        Swal.fire({
          title: aviso.titulo,
          text: aviso.texto,
          icon: aviso.type,
          timer: aviso.duracion || 2500,
          timerProgressBar: true,
          toast: true,
          position: 'top-end',
          showConfirmButton: false
        });
      }
    }
  };
  </script>
  