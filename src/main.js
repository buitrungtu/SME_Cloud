import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import {routes} from './router'
import ElementUI from 'element-ui';
import ElSelectTree from 'el-select-tree';

import locale from 'element-ui/lib/locale/lang/vi'

import DialogNotification from '@/components/content/cash/Process/DialogNotification'
import MSTextbox from '@/components/common/MSTextbox'




Vue.use(VueRouter)
Vue.use(ElementUI, { locale })
Vue.use(ElSelectTree);
Vue.use(require('vue-shortkey'))
Vue.directive('focus', {
  inserted: function (el) {
      el.focus()
  }
})

Vue.component('MSTextbox',MSTextbox)
Vue.component('DialogNotification',DialogNotification)



const router = new VueRouter({
  routes
})

// bus event
export const busData = new Vue();
Vue.config.productionTip = false



new Vue({
  el:'#app',
  router,
  render: h => h(App)
});
