import Vue from 'vue'
import Components from './index'

new Vue({
	render: (h) => h(Components.HelloWorld),
}).$mount('#app')
