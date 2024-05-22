import Vue from 'vue';
import ElementUI from 'element-ui';
import ApolloClient from 'apollo-boost';
import VueApollo from 'vue-apollo';
import VueRouter from 'vue-router'

import './styles.scss';

import App from './App.vue';
import ClientsList from './components/clients/ClientsList.vue';
import ClientEdit from './components/clients/ClientEdit.vue';
import ClientNew from './components/clients/ClientNew.vue';

const apolloClient = new ApolloClient({
  uri: 'http://localhost:4000/graphql'
});

Vue.use(ElementUI);
Vue.use(VueApollo);
Vue.use(VueRouter)

const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
});


const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', component: ClientsList },
    { path: '/new', component: ClientNew },
    { path: '/edit/:id', component: ClientEdit },
  ]
});

new Vue({
  el: '#app',
  router,
  apolloProvider,
  render: h => h(App)
});
