<template>
  <div class="main-container">
    <HeadingWithImage heading="Propojené faktury" :image="require('@/assets/ico-bill.svg')" />
    <div v-if="error" class="error">
      <div class="error-container">
        <img src="@/assets/ares-error.svg" />
        <p>{{ error }}</p>
      </div>
    </div>
    <div v-else>
      <div class="table-heading table-heading--align-right">
        <el-switch v-model="showOnlyPaidInvoices" active-color="#13ce66" inactive-color="#cbe0ed"></el-switch>
        <span style="padding-right: 8px;">Jen zaplacené</span>
        <el-input v-model="search" placeholder="Zadejte text pro vzhledávání" style="width: 300px;" />
      </div>
      <div class="negative-margin">
        <el-table
          v-loading="loading"
          @sort-change="handleSortChange"
          :data="loading ? [] : allInvoices"
          style="width: 100%;"
          header-row-class-name="table-header"
          header-cell-class-name="table-header-cell"
          empty-text="Žádné faktury"
        >
          <el-table-column fixed sortable prop="id" label="Číslo" width="100px"></el-table-column>
          <el-table-column sortable prop="due_on" label="Splatnost">
            <template slot-scope="scope">
              <span>{{ formatDate(scope.row.due_on) }}</span>
            </template>
          </el-table-column>
          <el-table-column sortable prop="kind" label="Typ dokladu">
            <template slot-scope="scope">
              <span v-if="scope.row.kind === 'vat_invoice'">Faktura s DPH</span>
              <span v-else>Proforma</span>
            </template>
          </el-table-column>
          <el-table-column sortable prop="total_float" label="Částka">
            <template slot-scope="scope">
              <b> {{ scope.row.currency }} {{ scope.row.total_float }}</b>
            </template>
          </el-table-column>
          <el-table-column sortable prop="state" label="Stav" width="160px">
            <template slot-scope="scope">
              <span v-if="scope.row.state === 'sent'">Odeslaná</span>
              <span v-else-if="scope.row.state === 'paid'">Zaplacená</span>
              <span v-else>Draft</span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" prop="actions">
            <template>
              Akce
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          v-if="invoicesCount > pageSize"
          @current-change="setPage"
          :current-page="page"
          :page-size="pageSize"
          :total="invoicesCount"
          layout="prev, pager, next"
          class="table-pagination"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import HeadingWithImage from '@/components/layout/HeadingWithImage';
  import { INVOICES_LIST_QUERY, ALL_INVOICES_LIST_META_QUERY } from '@/queries';

  export default {
    props: {
      clientID: {
        type: String,
        required: true,
      },
    },
    data() {
      return {
        loading: true,
        error: null,
        search: '',
        invoicesCount: 0,
        page: 1,
        pageSize: 15,
        sortField: 'id',
        sortOrder: 'descending',
        showOnlyPaidInvoices: false,
      };
    },
    components: {
      HeadingWithImage
    },
    watch: {
      showOnlyPaidInvoices() {
        this.setPage(1);
      },
      search() {
        this.setPage(1);
      },
    },
    apollo: {
      allInvoices: {
        query: INVOICES_LIST_QUERY,
        variables() {
          return {
            sortField: this.sortField,
            sortOrder: this.sortOrder === 'ascending' ? 'asc' : 'desc',
            filter: this.getQueryFilter(),
            perPage: this.pageSize,
            page: this.page - 1,
          };
        },
        result({ loading, error }) {
          this.loading = loading;
          this.error = error;
        },
      },
      _allInvoicesMeta: {
        query: ALL_INVOICES_LIST_META_QUERY,
        variables() {
          return {
            filter: this.getQueryFilter(),
          };
        },
        result({ data }) {
          this.invoicesCount = data._allInvoicesMeta.count;
        },
      },
    },
    methods: {
      refetchInvoicesData() {
        this.$apollo.queries.allInvoices.refetch();
        this.$apollo.queries._allInvoicesMeta.refetch();
      },
      setPage(val) {
        this.page = val;
        this.refetchInvoicesData();
      },
      handleSortChange({ prop, order }) {
        this.sortField = prop;
        this.sortOrder = order;
        this.refetchInvoicesData();
      },
      formatDate(internationalDate) {
        const date = new Date(internationalDate);
        return `${date.getDate()}. ${date.getMonth() + 1}. ${date.getFullYear()}`;
      },
      getQueryFilter() {
        return {
          client_id: this.clientID,
          q: this.search,
          state: this.showOnlyPaidInvoices ? 'paid' : undefined,
        };
      },
    },
  }
</script>
