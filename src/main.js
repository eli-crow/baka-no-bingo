// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faCheck, faTrash, faRedo, faChevronLeft, faTimes, faClipboard, faListOl } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(faCheck, faTrash, faRedo, faChevronLeft, faTimes, faClipboard, faListOl)
Vue.component('Icon', FontAwesomeIcon)

import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)

import VueSocketIO from 'vue-socket.io'
Vue.use(new VueSocketIO({
  debug: true,
  connection: 'http://localhost:3000',
  vuex: {
    store: store,
    actionPrefix: 'SOCKET_',
    mutationPrefix: 'SOCKET_',
  }
}))

Vue.config.productionTip = false

/* eslint-disable no-new */
export default new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
