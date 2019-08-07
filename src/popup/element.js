import Vue from 'vue'

import {main, input, scrollbar, select, button, option } from 'element-ui'

import 'element-ui/lib/theme-chalk/reset.css';

import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'

locale.use(lang)

Vue.use(main)
Vue.use(input)
Vue.use(option)
Vue.use(scrollbar)
Vue.use(select)
Vue.use(button)