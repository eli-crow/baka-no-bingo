// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faCheck, faTrash, faRedo, faChevronLeft, faTimes, faClipboard, faListOl } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
const bnbSkull = { prefix: 'fas', iconName: 'bnb-skull', icon: [38,42,[],null,"M30,37.5V38c0,2.2-1.8,4-4,4H12c-2.2,0-4-1.8-4-4v-0.5c0-0.5,0.4-0.9,0.9-0.9h0.8c0.5,0,0.9,0.4,0.9,0.9v0.6c0,0.3,0.2,0.5,0.5,0.5c0.3,0,0.5-0.2,0.5-0.5v-0.6c0-0.5,0.4-0.9,0.9-0.9h1.3c0.5,0,0.9,0.4,0.9,0.9v0.6c0,0.3,0.2,0.5,0.5,0.5c0.3,0,0.5-0.2,0.5-0.5v-0.6c0-0.5,0.4-0.9,0.9-0.9h1.3c0.5,0,0.9,0.4,0.9,0.9v0.6c0,0.3,0.2,0.5,0.5,0.5c0.3,0,0.5-0.2,0.5-0.5v-0.6c0-0.5,0.4-0.9,0.9-0.9h1.3c0.5,0,0.9,0.4,0.9,0.9v0.6c0,0.3,0.2,0.5,0.5,0.5c0.3,0,0.5-0.2,0.5-0.5v-0.6c0-0.5,0.4-0.9,0.9-0.9h1.3c0.5,0,0.9,0.4,0.9,0.9v0.6c0,0.3,0.2,0.5,0.5,0.5c0.3,0,0.5-0.2,0.5-0.5v-0.6c0-0.5,0.4-0.9,0.9-0.9h0.8C29.6,36.6,30,37,30,37.5z M38,18.6c0,6.2-3.2,11.8-8,15.1v1.1c0,0.5-0.4,0.9-0.9,0.9h-0.8c-0.5,0-0.9-0.4-0.9-0.9v-0.6c0-0.3-0.2-0.5-0.5-0.5c-0.3,0-0.5,0.2-0.5,0.5v0.6c0,0.5-0.4,0.9-0.9,0.9h-1.3c-0.5,0-0.9-0.4-0.9-0.9v-0.6c0-0.3-0.2-0.5-0.5-0.5c-0.3,0-0.5,0.2-0.5,0.5v0.6c0,0.5-0.4,0.9-0.9,0.9h-1.3c-0.5,0-0.9-0.4-0.9-0.9v-0.6c0-0.3-0.2-0.5-0.5-0.5c-0.3,0-0.5,0.2-0.5,0.5v0.6c0,0.5-0.4,0.9-0.9,0.9h-1.3c-0.5,0-0.9-0.4-0.9-0.9v-0.6c0-0.3-0.2-0.5-0.5-0.5c-0.3,0-0.5,0.2-0.5,0.5v0.6c0,0.5-0.4,0.9-0.9,0.9h-1.3c-0.5,0-0.9-0.4-0.9-0.9v-0.6c0-0.3-0.2-0.5-0.5-0.5c-0.3,0-0.5,0.2-0.5,0.5v0.6c0,0.5-0.4,0.9-0.9,0.9H8.9c-0.5,0-0.9-0.4-0.9-0.9v-1.1c-4.8-3.4-8-8.9-8-15.1C0,8.3,8.5,0,19,0C29.5,0,38,8.3,38,18.6z M16,17.6c0-3.2-2.7-5.9-6-5.9s-6,2.6-6,5.9c0,3.2,2.7,5.9,6,5.9S16,20.8,16,17.6z M21.9,27.1l-1-2.8c-0.6-1.8-3.2-1.8-3.8,0l-1,2.8c-0.5,1.5,0.8,3,2.4,2.6l0.5-0.1l0.5,0.1C21,30.1,22.4,28.6,21.9,27.1z M34,18.6c0-3.2-2.7-5.9-6-5.9s-6,2.6-6,5.9s2.7,5.9,6,5.9S34,21.8,34,18.6z"]}
library.add(faCheck, faTrash, faRedo, faChevronLeft, faTimes, faClipboard, faListOl, bnbSkull)
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
