<template>
  <div class="page-wrapper">
    <div class="page-container">
      <header>
        <h1>Detail kontaktu</h1>
      </header>
      <main>
        <div v-if="error">{{ error }}</div>
        <div v-if="!loading && !error">
          <div class="main-container">
            <ClientForm :existed-client-data="clientData" />
          </div>
          <InvoicesList v-if="clientData.invoices_count > 0" :clientID="clientData.id" />
        </div>
      </main>
    </div>
  </div>
</template>

<script>
  import ClientForm from '@/components/clients/ClientForm.vue';
  import InvoicesList from '@/components/invoices/InvoicesList.vue';
  import { CLIENT_QUERY } from '@/queries';

  export default {
    components: {
      ClientForm,
      InvoicesList
    },
    data() {
      return {
        clientData: {},
        loading: true,
        error: null,
      };
    },
    apollo: {
      Client: {
        query: CLIENT_QUERY,
        variables() {
          return {
            id: this.$route.params.id,
          };
        },
        result({ data, loading, error }) {
          this.clientData = data['Client'];
          this.loading = loading;
          this.error = error;
        },
      },
    },
  }
</script>
