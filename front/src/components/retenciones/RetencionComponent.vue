<template>
  <b-container fluid>
    <b-card class="mb-4" style="height: 80vh; overflow-y: scroll">
      <div class="mb-3 d-flex justify-content-between align-items-end">
        <b-form-group label="Número de Retención" label-for="fac">
          <b-form-input

              id="fac"
              v-model="newRetencion.emisor.ret"
              required
          ></b-form-input>
        </b-form-group>
        <b-col lg="2">
          <b-form-group label="Fecha de emisión" label-for="rucEmpresa">
            <b-input type="date" v-model="fechaFormateada" @input="updateFechaFormateada"></b-input>
          </b-form-group>
        </b-col>
        <b-button v-b-toggle.my-collapse>Configurar emisor
          <b-icon icon="wrench" scale="0.8"></b-icon>
        </b-button>
      </div>

      <b-collapse id="my-collapse">
        <b-card title="Configurar emisor">

          <b-form-group label="RUC Empresa" label-for="rucEmpresa">
            <b-form-input id="rucEmpresa" v-model="newRetencion.ruc_empresa" required></b-form-input>
          </b-form-group>

          <!-- Información del emisor -->
          <b-card-title>Información del Emisor</b-card-title>

          <div class="d-flex justify-content-between">
            <b-form-group label="RUC del Emisor" label-for="emisorRuc" class="w-40 m-1">
              <b-form-input id="emisorRuc" v-model="newRetencion.emisor.ruc" required></b-form-input>
            </b-form-group>
            <b-form-group label="Razón Social" label-for="razonSocial" class="w-100 m-1">
              <b-form-input id="razonSocial" v-model="newRetencion.emisor.razonSocial" required></b-form-input>
            </b-form-group>
            <b-form-group label="Ambiente" label-for="ambiente" class="w-10 m-1">
              <b-form-input id="ambiente" v-model="newRetencion.emisor.ambiente" required></b-form-input>
            </b-form-group>
            <b-form-group label="Tipo emision" label-for="tipoEmision" class="w-10 m-1">
              <b-form-input id="tipoEmision" v-model="newRetencion.emisor.tipoEmision" required></b-form-input>
            </b-form-group>
            <b-form-group label="Establecimiento" label-for="estab">
              <b-form-input
                  id="estab"
                  v-model="newRetencion.emisor.estab"
                  required
                  type="number"
              ></b-form-input>
            </b-form-group>
            <b-form-group label="Punto emisión" label-for="ptoEmi" class="w-10 m-1">
              <b-form-input id="ptoEmi" v-model="newRetencion.emisor.ptoEmi"
                            @input="checkAndSetInvoiceNumber"
                            required type="number"></b-form-input>
            </b-form-group>


          </div>
        </b-card>
      </b-collapse>


      <b-form @submit.prevent="createInvoice">
        <!--        <b-row>-->
        <!--                  <h4 class="mt-4 d-flex justify-content-start">Proveedor</h4>-->
        <!--                    <b-col lg="3">-->
        <!--                      <b-button class="w-100 mt-4" variant="primary" @click="showModalProveedor">Seleccionar proveedor</b-button>-->
        <!--                    </b-col>-->
        <!--                    <b-col>-->
        <!--                      <b-form-group label="Proveedor" label-for="supplierId">-->
        <!--                        <b-form-input id="supplierId" v-model="razonSocial" required disabled></b-form-input>-->
        <!--                      </b-form-group>-->
        <!--                    </b-col>-->
        <!--          <b-col lg="2">-->
        <!--           -->
        <!--          </b-col>-->
        <!--        </b-row>-->

        <h4 class="mt-4 d-flex justify-content-start">Cargar factura mediante número de autorización</h4>
        <b-row class="d-flex justify-content-start align-items-center">

          <b-col lg="2">
            <b-button class="w-100" variant="primary" @click="showModalFacturasCompras">Seleccionar factura
              <b-icon icon="file-arrow-down" scale="0.7"></b-icon>
            </b-button>
          </b-col>
          <b-col lg="6">
            <b-form-input id="supplierId" v-model="numeroAutorizacion" required disabled></b-form-input>
          </b-col>
        </b-row>

        <!-- Detalles de la factura -->
        <h4 class="mt-4 d-flex justify-content-start">Detalles de la Factura</h4>
        <table class="table table-bordered">
          <thead>
          <tr>
            <th>Comprobante</th>
            <th>Número</th>
            <th>Fecha Emisión</th>
            <th>Ejercicio Fiscal</th>
            <th>Base imponible para la retención</th>
            <th>Impuesto</th>
            <th>Porcentaje de retención</th>
            <th>Valor retenido</th>
            <th>Acción</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(detalle, index) in newRetencion.detalles" :key="index">
            <td style="width: 250px">
              <Select2
                  v-model="detalle.codigoPrincipal"
                  :options="products.map(p => ({ id: p.codigoPrincipal, text: `${p.codigoPrincipal} - ${p.descripcion}` }))"
                  @change="updateProductDetails(detalle, index)"
              />
            </td>
            <td>
              <b-form-input v-model="detalle.descripcion" required></b-form-input>
            </td>
            <td>
              <b-form-input v-model="detalle.cantidad" type="number" min="1" @input="calculateSubtotal(detalle)"
                            required></b-form-input>
            </td>
            <td>
              <b-form-input v-model="detalle.precioUnitario" @input="calculateSubtotal(detalle)"
                            required></b-form-input>
            </td>
            <td class="d-flex justify-content-between align-items-center">
              <div>

                <b-form-input v-model="detalle.porcentajeDescuento" @input="calculateSubtotal(detalle)"
                              required></b-form-input>
              </div>
              <div>
                <span v-if="detalle.descuento">{{ (detalle.descuento).toFixed(2) }}</span>

              </div>
            </td>

            <td>

              <b-form-select
                  class="form-control"
                  v-model="detalle.impuestos[0].codigoPorcentaje"
                  :options="listTarifas.map(p => ({ value: p.codigo, text: p.name }))"
                  @change="updateTaxDetails(detalle)"
                  required
              />

            </td>
            <td>
              <span>{{ (detalle.precioTotalSinImpuesto).toFixed(2) }}</span>
              <!--              <b-form-input v-model="detalle.precioTotalSinImpuesto" disabled></b-form-input>-->
            </td>
            <td>
              <b-button variant="white" @click="removeProductRow(index)">
                <b-icon icon="trash" variant="danger"></b-icon>
              </b-button>
            </td>
          </tr>
          </tbody>
        </table>
        <div>
          <b-button variant="success" @click="addNewProductRow">Agregar Retención
            <b-icon icon="plus"></b-icon>
          </b-button>

        </div>


        <h4 class="mt-4 d-flex justify-content-start">Información Adicional</h4>

        <!-- Tabla para Información Adicional -->
        <b-table :items="newRetencion.informacionAdicional" small :fields="fieldsInformacionAdicional">
          <template #cell(nombre)="data">
            <b-form-input v-model="data.item.nombre" placeholder="Nombre" required></b-form-input>
          </template>
          <template #cell(valor)="data">
            <b-form-input v-model="data.item.valor" placeholder="Valor" required></b-form-input>
          </template>
          <template #cell(acciones)="data">
            <b-button variant="white" @click="removeInfoAdicionalRow(data.index)">
              <b-icon icon="trash" variant="danger"></b-icon>
            </b-button>
          </template>
        </b-table>

        <!-- Botón para agregar más filas de información adicional -->
        <b-button variant="success" @click="addNewInfoAdicionalRow">Agregar Información Adicional
          <b-icon icon="plus"></b-icon>
        </b-button>

        <hr>
        <br>
        <div class="d-flex justify-content-end">

          <b-button variant="primary" type="submit">Enviar Factura
            <b-icon icon="upload"></b-icon>
          </b-button>
        </div>
      </b-form>


    </b-card>
    <pre>{{ newRetencion }}</pre>


    <b-modal ref="my-modal" title="Seleccionar factura de compra" size="xl" centered hide-header-close >
      <FacturasCompraComponent :flagInvoice="true" ></FacturasCompraComponent>
    </b-modal>


  </b-container>
</template>

<script>
import {createAndSendInvoice, getInvoicesPorPuntoEmision} from "@/services/invoiceServices";
import ClientComponent from "@/components/clientes/ClientComponent.vue";
import InventarioComponent from "@/components/inventario/InventarioComponent.vue";
import Select2 from 'v-select2-component';
import {getProducts} from "@/services/productsService";
import {createBilling, getBillings, getBillingByNumeroAutorizacion} from "@/services/saveBillingService";
import moment from 'moment';
import Swal from "sweetalert2";
import ProveedorComponent from "@/components/proveedores/proveedorComponent.vue";
import FacturasCompraComponent from "@/components/proveedores/FacturasCompraComponent.vue";

export default {
  name: 'RetencionComponent',
  components: {FacturasCompraComponent, ProveedorComponent, ClientComponent, InventarioComponent, Select2},
  data() {
    return {

      invoiceData: [],
      numeroAutorizacion: "",
      listBillings: [],
      fieldsInformacionAdicional: [
        {key: 'nombre', label: 'Nombre'},
        {key: 'valor', label: 'Valor'},
        {key: 'acciones', label: 'Acciones'}
      ],
      fieldsPagos: [
        {key: 'formaPago', label: 'Forma de Pago'},
        {key: 'plazo', label: 'Plazo'},
        {key: 'unidadTiempo', label: 'Unidad de Tiempo'},
        {key: 'acciones', label: 'Acciones'}
      ],
      fieldsSummaryInvoice: [
        {key: 'label', label: '', tdClass: 'col-md-10 text-end'},
        {key: 'value', label: '', tdClass: 'text-end'}
      ],

      formasDePago: [
        {name: "SIN UTILIZACION DEL SISTEMA FINANCIERO", codigo: "01"},
        {name: "COMPENSACIÓN DE DEUDAS", codigo: "15"},
        {name: "TARJETA DE DÉBITO", codigo: "16"},
        {name: "DINERO ELECTRÓNICO", codigo: "17"},
        {name: "TARJETA PREPAGO", codigo: "18"},
        {name: "TARJETA DE CRÉDITO", codigo: "19"},
        {name: "OTROS CON UTILIZACIÓN DEL SISTEMA FINANCIERO", codigo: "20"},
        {name: "ENDOSO DE TÍTULOS", codigo: "21"}
      ],
      listTarifas: [
        {name: "0%", tarifa: "0", codigo: "0"},
        {name: "12%", tarifa: "12", codigo: "2"},
        {name: "13%", tarifa: "13", codigo: "10"},
        {name: "14%", tarifa: "14", codigo: "3"},
        {name: "15%", tarifa: "15", codigo: "4"},
        {name: "5%", tarifa: "5", codigo: "5"},
        {name: "No objeto de Impuesto", tarifa: "0", codigo: "6"},
        {name: "Excento de IVA", tarifa: "0", codigo: "7"},
        {name: "IVA diferenciado", tarifa: "0", codigo: "8"},
      ],
      valorDescuento: 0,
      porcentajeDescuento: 0,
      valorTotal: 0,
      fechaFormateada: '',
      products: [],
      taxOptions: [
        {value: '0', text: '0%'},
        {value: '15', text: '15%'}
      ],
      selected: null,
      options: [
        {value: null, text: 'Please select an option'},
        {value: 'a', text: 'This is First option'},
        {value: 'b', text: 'Selected Option'},
        {value: {C: '3PO'}, text: 'This is an option with object value'},
        {value: 'd', text: 'This one is disabled', disabled: true}
      ],
      myValue: '',
      myOptions: ['op1', 'op2', 'op3'],
      flagInvoice: true,
      razonSocial: '',
      newRetencion: {
        emisor: {
          ruc: "0190412040001",
          razonSocial: "AUDITORES CONTABLES & CONSULTORES ENRIQUETA SARMIENTO ACCESCONT CIA. LTDA.",
          nombreComercial: "ACCESCONT CIA. LTDA.",
          direccionMatriz: "TOMÁS ORDOÑEZ 14-31 Y PIO BRAVO",
          direccionEstablecimiento: "DE LA MISTELA Y RAFAEL CARPIO ABAD",
          contribuyenteEspecial: "NO",
          obligadoContabilidad: "SI",
          ret: "000000002",
          ambiente: "pruebas",
          tipoEmision: "1",
          estab: "001",
          ptoEmi: "108",
        },
        supplierId: "",
        fechaEmision: "",
        detalles: [],
        periodoFiscal: "10/2024",
        informacionAdicional: [
          {
            nombre: "Observación",
            valor: ""
          }
        ],
      },
      totalSumaImpuestosValue: 0

    };
  },

  watch: {
    totalSinImpuestos(newValue) {
      // Asignar el valor calculado a newRetencion.totalSinImpuestos
      this.newRetencion.totalSinImpuestos = newValue;
    },
    importeTotal(newValue) {
      this.newRetencion.importeTotal = newValue;
      this.newRetencion.pagos[0].total = newValue;
    },
    'newRetencion.propina'(newValue) {
      // Asegurarse de que la propina sea un número válido
      this.newRetencion.propina = parseFloat(newValue) || 0;
      // No necesitas llamar a importeTotal como función, ya es un `computed property`
      // Solo accede a la propiedad para que Vue detecte los cambios
      this.newRetencion.importeTotal = this.importeTotal;
    },
    totalDescuento(newValue) {
      // Asignar el valor calculado a newRetencion.totalSinImpuestos
      this.newRetencion.totalDescuento = newValue.toFixed(2);
    },
    totalSumaImpuestos(newValue) {
      // Asignar el valor calculado a newRetencion.totalSinImpuestos

      this.totalSumaImpuestosValue = newValue;
    },


  },

  computed: {
    summaryInvoiceItems() {
      return [
        {label: 'SUBTOTAL SIN IMPUESTO:', value: this.totalSinImpuestos.toFixed(2)},
        {label: 'DESCUENTO:', value: this.totalDescuento.toFixed(2)},
        {label: 'PROPINA:', value: 'input'}, // La celda para PROPINA contendrá el input
        {label: 'IMPUESTO 15%:', value: this.totalSumaImpuestosValue.toFixed(2)},
        {label: 'VALOR TOTAL:', value: this.importeTotal}
      ];
    },
    fechaEnDDMMYYYY() {
      return this.fechaFormateada ? moment(this.fechaFormateada, 'YYYY-MM-DD').format('DD/MM/YYYY') : '';
    },
    totalSumaImpuestos() {
      let total = 0;
      this.newRetencion.detalles.forEach(detalle => {
        detalle.impuestos.forEach(impuesto => {
          total += impuesto.valor;
        });
      });

      return total;
    },
    totalSinImpuestos() {
      let total = 0;
      this.newRetencion.detalles.forEach(detalle => {
        detalle.impuestos.forEach(impuesto => {
          total += impuesto.baseImponible;
        });
      });
      return total;
    },
    importeTotal() {
      // Asegurarse de sumar correctamente el subtotal sin impuestos más el total de impuestos
      const total = this.totalSinImpuestos + this.totalSumaImpuestos + this.newRetencion.propina;
      return parseFloat(total).toFixed(2); // Retornar con dos decimales
    },

    totalDescuento() {
      let total = 0;
      this.newRetencion.detalles.forEach(detalle => {
        detalle.descuento = parseFloat(detalle.descuento);

        total += detalle.descuento;
      });
      // Aplicar toFixed(2) y devolverlo como número flotante
      return parseFloat(total.toFixed(2));
    },
    propina() {
      return this.newRetencion.propina || 0;
    },
  },
  methods: {
    showModalFacturasCompras(){
      this.$refs['my-modal'].show()
    },
    showSuccessAlertDeleted(clientName) {
      Swal.fire({
        title: '¡Eliminado!',
        text: `El cliente "${clientName}" ha sido eliminado correctamente.`,
        icon: 'success',
        timer: 2500,
        showConfirmButton: false
      });
    },

    showErrorAlertDeleted(clientName) {
      Swal.fire({
        title: 'Error',
        text: `No se pudo eliminar al cliente "${clientName}".`,
        icon: 'error',
        confirmButtonText: 'Intentar de nuevo'
      });
    },

    showSuccessAlert(name, action) {
      Swal.fire({
        title: '¡Correcto!',
        text: `El ${name} se ha ${action}.`,
        icon: 'success',
        timer: 2500,
        showConfirmButton: false
      });
    },

    // Alerta de error
    showErrorAlert() {
      Swal.fire({
        title: '¡Error!',
        text: 'Ocurrió un problema durante la operación.',
        icon: 'error',
        confirmButtonText: 'Intentar de nuevo'
      });
    },


    async checkAndSetInvoiceNumber() {
      try {
        // Verificar que el punto de emisión esté correctamente configurado
        if (!this.newRetencion.emisor.ptoEmi) {
          console.error("Punto de emisión no especificado");
          return;
        }

        // Obtener las facturas para el punto de emisión ingresado
        const invoices = await getInvoicesPorPuntoEmision(this.newRetencion.emisor.ptoEmi);
        console.log("Facturas encontradas para el punto de emisión:", invoices);

        if (invoices.length > 0) {
          // Filtrar facturas por punto de emisión específico y ordenarlas por secuencial de forma descendente
          const facturasOrdenadas = invoices
              .filter(invoice => invoice.emisor.ptoEmi === this.newRetencion.emisor.ptoEmi) // Filtrar por punto de emisión
              .map((invoice) => ({
                ...invoice,
                secuencial: parseInt(invoice.secuencial, 10), // Asegurarse de que el secuencial sea un número
              }))
              .sort((a, b) => b.secuencial - a.secuencial); // Ordenar en orden descendente

          // Verificar que las facturas filtradas y ordenadas no estén vacías
          if (facturasOrdenadas.length > 0) {
            // Obtener el secuencial más alto de las facturas del punto de emisión
            const maxSecuencial = facturasOrdenadas[0].secuencial;

            // Asignar el siguiente número de secuencial incrementado en 1
            this.newRetencion.emisor.fac = (maxSecuencial + 1).toString().padStart(9, "0");
          } else {
            // Si no existen facturas después de filtrar, asignar el secuencial inicial
            this.newRetencion.emisor.fac = "000000001";
          }
        } else {
          // Si no existen facturas, asignar el secuencial inicial
          this.newRetencion.emisor.fac = "000000001";
        }
      } catch (error) {
        console.error("Error al obtener facturas:", error);
      }
    }

    ,


    addNewInfoAdicionalRow() {
      this.newRetencion.informacionAdicional.push({
        nombre: "",
        valor: ""
      });
    },
    removeInfoAdicionalRow(index) {
      this.newRetencion.informacionAdicional.splice(index, 1);
    },

    addNewPaymentRow() {
      this.newRetencion.pagos.push({
        formaPago: "01", // Puedes establecer un valor por defecto o dejarlo vacío
        total: this.newRetencion.importeTotal,
        plazo: "0",
        unidadTiempo: "dias"
      });
    },
    removePaymentRow(index) {
      this.newRetencion.pagos.splice(index, 1);
    },

    updateTaxDetails(detalle) {
      const codigoPorcentaje = detalle.impuestos[0].codigoPorcentaje;
      const tarifa = this.getTarifa(codigoPorcentaje);

      // Actualizar los valores de tarifa y código
      detalle.impuestos[0].tarifa = tarifa;
      //detalle.impuestos[0].codigo = codigoPorcentaje;

      // Llamar a calculateTax para recalcular los impuestos
      this.calculateTax(detalle, tarifa);
    },
    getTarifa(codigoPorcentaje) {
      const tarifaObj = this.listTarifas.find(tarifa => tarifa.codigo === codigoPorcentaje);
      return tarifaObj ? tarifaObj.tarifa : 0; // Retorna la tarifa o 0 si no la encuentra
    },

    updateFechaFormateada() {
      // Convertir la fecha ingresada en el input al formato DD/MM/YYYY
      this.newRetencion.fechaEmision = moment(this.fechaFormateada, 'YYYY-MM-DD').format('DD/MM/YYYY');
    },
    addNewProductRow() {
      this.newRetencion.detalles.push({
        codigoPrincipal: "",
        descripcion: "",
        cantidad: 1,
        precioUnitario: 0,
        descuento: 0,
        porcentajeDescuento: 0, // Nuevo campo para porcentaje de descuento individual
        precioTotalSinImpuesto: 0,
        impuestos: [
          {
            codigo: "0",
            codigoPorcentaje: 0,
            tarifa: 0,
            baseImponible: 0,
            valor: 0
          }
        ]
      });

    },
    removeProductRow(index) {
      this.newRetencion.detalles.splice(index, 1);
    },

    calculateSubtotal(detalle) {


      // Calcular el precio total sin descuento
      detalle.precioTotalSinImpuesto = detalle.cantidad * detalle.precioUnitario;

      // Aplicar el descuento basado en el porcentaje ingresado para el detalle específico
      detalle.descuento = (detalle.porcentajeDescuento / 100) * detalle.precioTotalSinImpuesto;

      detalle.descuento = (detalle.descuento).toFixed(2);

      // Restar el descuento del precio total sin impuestos
      detalle.precioTotalSinImpuesto -= detalle.descuento;

      // Convertir el resultado a dos decimales
      detalle.precioTotalSinImpuesto = parseFloat(detalle.precioTotalSinImpuesto.toFixed(2));

      // Calcular los impuestos después del descuento
      this.calculateTax(detalle);
    }
    ,

    calculateTax(detalle, tax = null) {
      const tarifa = tax ? tax : parseFloat(detalle.impuestos[0].tarifa);
      const baseImponible = parseFloat(detalle.precioTotalSinImpuesto.toFixed(2));

      // Actualizar el valor de baseImponible a dos decimales
      detalle.impuestos[0].baseImponible = baseImponible;

      // Actualizar el valor del impuesto basado en la tarifa
      detalle.impuestos[0].valor = parseFloat((baseImponible * (tarifa / 100)).toFixed(2));
    },

    updateProductDetails(detalle, index) {
      const product = this.products.find(p => p.codigoPrincipal === detalle.codigoPrincipal);
      if (product) {
        detalle.descripcion = product.descripcion;
        detalle.precioUnitario = product.precioUnitario;
        detalle.impuestos[0].tarifa = product.impuestos[0].tarifa;
        detalle.impuestos[0].codigoPorcentaje = product.impuestos[0].codigoPorcentaje;
        detalle.impuestos[0].codigo = product.impuestos[0].codigo;

        console.log("producto", product.impuestos);
        console.log("detalle", detalle.impuestos);
        this.calculateSubtotal(detalle);
      }
    },

    myChangeEvent(val) {
      console.log(val);
    },
    mySelectEvent({id, text}) {
      console.log({id, text})
    },
    supplierSelected(data) {
      this.newRetencion.supplierId = data._id;
      this.razonSocial = data.razonSocial;
      console.log("RECIBE", data);
      this.hideModal();

    },
    hideModal() {
      this.$refs['modal-proveedor'].hide()
    },


    async createInvoice() {
      try {


        Swal.fire({
          title: 'Creando factura...',
          text: 'Por favor espera mientras se genera y envía la factura.',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading(); // Mostrar el indicador de carga
          }
        });

        this.newRetencion.detalles.forEach(detalle => {
          detalle.precioUnitario = parseFloat(detalle.precioUnitario).toFixed(2);  // Convertir a float y asegurar dos decimales
          detalle.precioUnitario = parseFloat(detalle.precioUnitario); // Asegurarse de que se guarde como número
        });
        const facturaCreada = await createAndSendInvoice(this.newRetencion);
        this.showSuccessAlert('factura', 'creado');
        this.resetInvoiceForm();

      } catch (error) {
        this.showErrorAlert();
        console.error("Error al crear y enviar factura:", error);
      }
    },
    showModalProveedor() {
      this.$refs['modal-proveedor'].show()
    },
    showModalProducts() {
      this.$refs['modal-products'].show()
    },

    resetInvoiceForm() {
      this.newRetencion = {
        supplierId: "",
        fechaEmision: "",
        ruc_empresa: "0190412040001",
        emisor: {
          ruc: "0190412040001",
          razonSocial: "AUDITORES CONTABLES & CONSULTORES ENRIQUETA SARMIENTO ACCESCONT CIA. LTDA.",
          nombreComercial: "ACCESCONT CIA. LTDA.",
          direccionMatriz: "TOMÁS ORDOÑEZ 14-31 Y PIO BRAVO",
          direccionEstablecimiento: "DE LA MISTELA Y RAFAEL CARPIO ABAD",
          contribuyenteEspecial: "NO",
          obligadoContabilidad: "SI",
          ret: "000000002",
          ambiente: "pruebas",
          tipoEmision: "1",
          estab: "001",
          ptoEmi: "108",
        },
        detalles: [
          {
            codigoPrincipal: "",
            descripcion: "",
            cantidad: 1,
            precioUnitario: 0,
            descuento: 0,
            precioTotalSinImpuesto: 0,
            impuestos: [
              {
                codigo: "0",
                codigoPorcentaje: 0,
                tarifa: 0,
                baseImponible: 0,
                valor: 0
              }
            ]
          }
        ],
        totalSinImpuestos: 0,
        totalDescuento: 0,
        propina: 0,
        importeTotal: 0,
        moneda: "USD",
        pagos: [
          {
            formaPago: "20",
            total: 0,
            plazo: "0",
            unidadTiempo: "dias"
          }
        ],
        informacionAdicional: [
          {
            nombre: "Teléfono",
            valor: ""
          }
        ],
        firma: "AquiVaLaFirmaElectronica"
      }
    },
    async fetchProducts() {
      try {
        this.products = await getProducts();
      } catch (error) {
        console.error("Error al obtener productos:", error);
      }
    },
    async fetchBillings() {
      try {
        this.listBillings = await getBillings();
      } catch (error) {
        console.error("Error al obtener productos:", error);
      }
    },
  },
  mounted() {
    this.fetchProducts();
    this.fechaFormateada = moment().format('YYYY-MM-DD');
    // Establecer la fecha interna en el formato DD/MM/YYYY
    this.newRetencion.fechaEmision = moment(this.fechaFormateada, 'YYYY-MM-DD').format('DD/MM/YYYY');
    this.fetchBillings();
    this.checkAndSetInvoiceNumber();

  }
};
</script>

<style scoped>
h2 {
  text-align: center;
  margin-bottom: 20px;
}
</style>
