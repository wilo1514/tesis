# todolist

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve  || npm run serve -- --port 7070
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## Dependencies

1. **axios (^1.4.0)**: Axios es una librería de JavaScript que se utiliza para hacer solicitudes HTTP desde el navegador o desde Node.js. Proporciona una interfaz fácil de usar para enviar y recibir datos a través de solicitudes HTTP, como GET, POST, PUT, DELETE, etc. Es especialmente útil para realizar llamadas a APIs y obtener o enviar datos en aplicaciones web.

2. **bootstrap (^5.3.1)**: Bootstrap es un popular framework de diseño y front-end que proporciona una colección de componentes, estilos y utilidades predefinidos para construir interfaces de usuario responsivas y atractivas. Ayuda a estandarizar y agilizar el proceso de diseño y desarrollo de sitios web y aplicaciones.

3. **bootstrap-vue (^2.23.1)**: Bootstrap-Vue es una integración de Bootstrap para Vue.js. Proporciona componentes de interfaz de usuario Vue.js que están diseñados siguiendo las pautas y el estilo de Bootstrap. Esto permite que los desarrolladores utilicen la funcionalidad de Bootstrap directamente en sus componentes Vue.

4. **core-js (^3.8.3)**: Core-js es una biblioteca que proporciona polyfills (rellenos) para características de JavaScript que pueden no ser compatibles con todos los navegadores. Esto asegura que tu código funcione de manera consistente en diferentes navegadores y versiones de ECMAScript.

5. **jwt-decode (^3.1.2)**: jwt-decode es una pequeña biblioteca que se utiliza para decodificar tokens JSON Web (JWT) en JavaScript. Las JWT son utilizadas comúnmente para autenticación y autorización en aplicaciones web y móviles. Esta biblioteca te permite decodificar el contenido de un token JWT sin necesidad de enviar la solicitud al servidor.


6. **sweetalert2 (^11.7.22)**: SweetAlert2 es una biblioteca que te permite crear ventanas modales personalizadas y atractivas en tus aplicaciones web. Estas ventanas modales se utilizan para mostrar mensajes, confirmaciones, alertas y otros tipos de interacciones con los usuarios.

7. **vue (^2.7.14)**: Vue.js es un framework progresivo de JavaScript utilizado para construir interfaces de usuario interactivas. Permite crear componentes reutilizables y dinámicos, y se centra en la creación de aplicaciones web de una sola página (SPA) con una estructura de componentes clara.

8. **vue-router (^3.6.5)**: Vue Router es la librería oficial de enrutamiento para Vue.js. Permite gestionar la navegación en una aplicación Vue de una manera declarativa, permitiendo que los componentes se muestren y oculten según la URL actual.

9. **moment (^2.29.4)**: Es una biblioteca de JavaScript que se utiliza para manipular, formatear y mostrar fechas y horas. Proporciona una gran cantidad de funcionalidades para trabajar con fechas, como análisis, validación, cálculos, formato y manipulación. Moment es ampliamente utilizado en aplicaciones web para tareas relacionadas con fechas y horarios.

9. **vuex (^2.5.0)**: Vuex es una biblioteca de administración de estado para aplicaciones Vue.js en su versión 2.5.0. Proporciona un patrón de arquitectura y herramientas para gestionar el estado global de una aplicación de manera estructurada. Vuex se utiliza para resolver el problema de compartir y mantener el estado entre múltiples componentes en una aplicación Vue.


## DEV Dependencies

Por supuesto, aquí tienes una descripción de cada una de las dependencias adicionales listadas en tu fragmento de código:

1. **@babel/core (^7.12.16)**: Babel es una herramienta que se utiliza para compilar y transformar código JavaScript moderno (usando características futuras de JavaScript) en un formato compatible con versiones anteriores de navegadores. `@babel/core` es el núcleo de Babel que realiza la transformación principal.

2. **@babel/eslint-parser (^7.12.16)**: Este paquete permite usar el parser (analizador sintáctico) de Babel como el analizador de ESLint. ESLint es una herramienta que ayuda a mantener la calidad del código en proyectos JavaScript al encontrar y resaltar patrones de código problemáticos o que no siguen las convenciones definidas.

3. **@vue/cli-plugin-babel (~5.0.0)**: Este es un complemento del Vue CLI que configura Babel en tu proyecto Vue. Babel se utiliza para transpilar el código de JavaScript a una versión compatible con navegadores más antiguos.

4. **@vue/cli-plugin-eslint (~5.0.0)**: Similar al anterior, este es un complemento del Vue CLI que configura ESLint en tu proyecto Vue. ESLint ayuda a mantener un código limpio y coherente al encontrar y resaltar errores y problemas en el código.

5. **@vue/cli-service (~5.0.0)**: Parte del Vue CLI, `@vue/cli-service` es una capa de abstracción sobre herramientas como webpack que permite compilar y servir aplicaciones Vue. Facilita la configuración y gestión del proyecto.

6. **eslint (^7.32.0)**: ESLint es una herramienta de linting para JavaScript que te ayuda a mantener la calidad y coherencia del código. Puedes definir reglas personalizadas y configuraciones para que ESLint detecte y resalte problemas en el código.

7. **eslint-plugin-vue (^8.0.3)**: Este es un plugin específico para ESLint que proporciona reglas y configuraciones para el código Vue.js. Ayuda a mantener un estilo coherente y detectar problemas comunes en los componentes de Vue.

8. **sass (^1.65.1)**: Sass (Syntactically Awesome Stylesheets) es un preprocesador de CSS que permite escribir estilos de manera más avanzada y eficiente. Agrega características como variables, anidación, mixins y más a CSS estándar.

9. **sass-loader (^13.3.2)**: El paquete `sass-loader` se utiliza junto con webpack para cargar archivos `.scss` y `.sass` y compilarlos en CSS. Funciona especialmente bien con Vue.js y otros marcos de trabajo.

10. **zxcvbn: ^4.4.2**: Es una biblioteca de estimación de la fortaleza de contraseñas. Ayuda a evaluar la fortaleza de una contraseña y proporciona retroalimentación a los usuarios sobre la calidad de las contraseñas que eligen.

## Structure
```
src/
|-- assets/
|-- components/
|   |-- UserRegistrationForm.vue
|   |-- TaskForm.vue
|   |-- ...
|-- views/
|   |-- Login.vue
|   |-- AdminDashboard.vue
|   |-- UserDashboard.vue
|   |-- ...
|-- services/
|   |-- api.js
|-- router/
|   |-- index.js
|-- App.vue
|-- main.js

```