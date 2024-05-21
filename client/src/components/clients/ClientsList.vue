<template>
  <div class="page-wrapper">
    <div class="page-container">
      <header>
        <h1>Seznam kontaktů</h1>
      </header>
      <main>
        <div class="main-container">
          <div v-if="error" class="error">
            <div class="error-container">
              <img src="@/assets/ares-error.svg" />
              <p>{{ error }}</p>
            </div>
          </div>
          <div v-else>
            <div class="table-heading">
              <router-link :to="'/new'">
                <el-button type="warning" icon="el-icon-circle-plus-outline">Přidat kontakt</el-button>
              </router-link>
              <el-input v-model="search" placeholder="Zadejte text pro vzhledávání" style="width: 300px;" />
            </div>
            <div class="negative-margin">
              <el-table
                v-loading="loading"
                @sort-change="handleSortChange"
                :data="allClients"
                style="width: 100%;"
                header-row-class-name="table-header"
                header-cell-class-name="table-header-cell"
                empty-text="Žádné kontakty"
              >
                <el-table-column fixed sortable prop="name" label="Kontakt">
                  <template slot-scope="scope">
                    <el-link type="primary" v-bind:href="'/edit/' + scope.row.id">{{ scope.row.name }}</el-link>
                  </template>
                </el-table-column>
                <el-table-column sortable prop="company_number" label="IČ" width="100px"></el-table-column>
                <el-table-column sortable prop="email" label="E-mail"></el-table-column>
                <el-table-column sortable prop="phone" label="Telefon"></el-table-column>
                <el-table-column sortable prop="invoices_count" label="Počet faktur"  width="160px" ></el-table-column>
                <el-table-column fixed="right" prop="actions">
                  <template slot-scope="scope">
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteClient(scope.row)">Delete</el-button>
                  </template>
                </el-table-column>
              </el-table>

              <el-pagination
                v-if="clientsCount > pageSize"
                @current-change="setPage"
                :current-page="page"
                :page-size="pageSize"
                :total="clientsCount"
                layout="prev, pager, next"
                class="table-pagination"
              ></el-pagination>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
  import { CLIENTS_LIST_QUERY, ALL_CLIENTS_LIST_META_QUERY } from '../../queries';
  import { DELETE_CLIENT } from '../../muttations';

  export default {
    data() {
      return {
        loading: false,
        error: null,
        createUserError: null,
        search: '',
        clientsCount: 0,
        page: 1,
        pageSize: 15,
        sortField: 'name',
        sortOrder: 'descending',
      };
    },
    apollo: {
      allClients: {
        query: CLIENTS_LIST_QUERY,
        variables() {
          return {
            sortField: this.sortField,
            sortOrder: this.sortOrder === 'ascending' ? 'asc' : 'desc',
            filter: { q: this.search },
            perPage: this.pageSize,
            page: this.page - 1,
          };
        },
        result({ loading, error }) {
          this.loading = loading;
          this.error = error;
        },
      },
      _allClientsMeta: {
        query: ALL_CLIENTS_LIST_META_QUERY,
        variables() {
          return {
            filter: { q: this.search },
          };
        },
        result({ data }) {
          this.clientsCount = data._allClientsMeta.count;
        },
      },
    },
    watch: {
      search() {
        this.setPage(1);
      },
    },
    methods: {
      refetchClientsData() {
        this.$apollo.queries.allClients.refetch();
        this.$apollo.queries._allClientsMeta.refetch();
      },
      deleteClient(client) {
        this.$apollo
          .mutate({
            mutation: DELETE_CLIENT,
            variables: {
              id: client.id,
            },
          })
          .then(() => {
            this.refetchClientsData();
          })
          .catch((error) => {
            console.error("Failed to delete client:", error);
          });
      },
      setPage(val) {
        this.page = val;
        this.refetchClientsData();
      },
      handleSortChange({ prop, order }) {
        this.sortField = prop;
        this.sortOrder = order;
        this.refetchClientsData();
      },
    },
  };
</script>

<style>
  header,
  main {
    padding: 0 2rem;
  }

  .page-wrapper {
    display: flex;
    flex-direction: column;
    background-color: var(--bg-color);
  }

  .page-container {
    flex: 1 0 auto;
    min-height: 100vh;
    text-align: left;
    width: min(100%, 80rem);
    margin: 0 auto;
  }

  .main-container {
    background-color: var(--bg-color-light);
    padding: 2rem;
    border-radius: 8px;
  }

  .main-container + .main-container {
    margin-top: 3rem;
  }

  .error {
    text-align: center;
    padding: 8rem 0;
  }

  .error-container {
    display: inline-flex;
    align-items: center;
    gap: 1rem;
    color: var(--error-color);
  }

  .table-heading {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .table-heading--align-right {
    justify-content: flex-end;
  }

  .table-header {
    th.table-header-cell {
      background-color: #2980B9;
      color: #ffffff;
      padding: 0.5rem;
    }
  }

  .table-pagination {
    margin-top: 1rem;
    text-align: center;
  }

  .negative-margin {
    margin-left: -1rem;
    margin-right: -1rem;
  }
</style>
