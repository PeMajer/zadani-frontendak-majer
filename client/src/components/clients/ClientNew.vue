<template>
  <div class="page-wrapper">
    <div class="page-container">
      <header>
        <h1>Nový kontakt</h1>
        {{clientForm.name}}
      </header>
      <main>
        <div class="white-container">
          <el-row type="flex" align="center" class="form-heading">
            <img src="@/assets/ico-supply.svg" />
            <h2>Základní údaje</h2>
          </el-row>
          <el-form :model="clientForm" :rules="rules" label-position="left" ref="clientForm" label-width="100px"
            class="client-form">
            <div class="two-columns-layout">
              <el-form-item label="Jméno" prop="name">
                <el-select
                  :value="clientForm.name"
                  @change="prefillInputs"
                  class="select-like-input"
                  filterable
                  no-match-text="Hledani neodpovida zadna firma"
                  placeholder="Vyhledat firmu podle nazvu"
                >
                  <el-option class="select-item"
                    v-for="company in allCompanyInfos"
                    :key="company.id"
                    :label="company.name"
                    :value="company"
                  >
                    <b>{{ company.name }}</b>
                    <div>IČO: {{ company.company_number }}</div>
                    <div v-if="company.street && company.city && company.postcode">
                      {{ company.street }}, {{ company.city }}, {{ company.postcode }}
                    </div>
                  </el-option>
                </el-select>
              </el-form-item>
              <!-- <el-form-item label="Jméno" prop="name">
                <el-input v-model="clientForm.name" prefix-icon="el-icon-search"></el-input>
              </el-form-item> -->
              <el-form-item label="IČO" prop="companyNumber">
                <el-input v-model="clientForm.companyNumber" prefix-icon="el-icon-search"></el-input>
                <div class="input-help-text">Pokud zadáte nejprve IČO subjektu, jeho název a adresa se automaticky
                  načtou.</div>
              </el-form-item>
              <el-form-item label="DIČ" prop="vatNumber">
                <el-input v-model="clientForm.vatNumber"></el-input>
              </el-form-item>
              <el-form-item label="DIČ" prop="vatNumber">
                <el-input v-model="clientForm.vatNumber"></el-input>
              </el-form-item>
              <el-form-item label="E-mail" prop="email">
                <el-input v-model="clientForm.email"></el-input>
              </el-form-item>
              <el-form-item label="Web" prop="web">
                <el-input v-model="clientForm.web"></el-input>
              </el-form-item>
              <el-form-item label="Ulice" prop="street">
                <el-input v-model="clientForm.street"></el-input>
              </el-form-item>
              <el-form-item label="Město" prop="city">
                <el-input v-model="clientForm.city"></el-input>
              </el-form-item>
              <el-form-item label="PSČ" prop="postcode">
                <el-input v-model="clientForm.postcode"></el-input>
              </el-form-item>
              <el-form-item label="Země" prop="country">
                <el-input v-model="clientForm.country"></el-input>
              </el-form-item>
            </div>
            <el-row type="flex" justify="end">
              <el-button type="primary" plain>Zahodit</el-button>
              <el-button @click="submitForm('clientForm')" type="warning" icon="el-icon-plus">Uložit změny</el-button>
            </el-row>
          </el-form>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import { CREATE_CLIENT } from '../../muttations';
import { COMPANIES_LIST_QUERY } from '../../queries';

export default {
  data() {
    return {
      clientForm: {
        name: '',
        companyNumber: '',
        vatNumber: '',
        street: '',
        city: '',
        postcode: '',
        countryCode: '',
        email: '',
        phone: '',
        web: '',
      },
      rules: {
        name: [
          { required: true, message: 'Musíte zadat jméno', trigger: 'blur' },
        ],
      },
      search: '',
    };
  },
  apollo: {
    allCompanyInfos: {
      query: COMPANIES_LIST_QUERY,
      // variables() {
      //   return {
      //     filter: { q: this.search },
      //   };
      // },
      result({ loading, error }) {
        this.loading = loading;
        this.error = error;
      },
    },
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.createClient();
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    prefillInputs(data) {
      this.clientForm.name = data.name;
      this.clientForm.companyNumber = data.company_number;
      this.clientForm.vatNumber = data.vat_number;
      this.clientForm.email = data.email;
      this.clientForm.web = data.web;
      this.clientForm.street = data.street;
      this.clientForm.city = data.city;
      this.clientForm.postcode = data.postcode;
    },
    createClient() {
      this.$apollo
        .mutate({
          mutation: CREATE_CLIENT,
          variables: {
            name: this.clientForm.name,
            company_number: '',
            vat_number: '',
            tax_number: '',
            street: '',
            city: '',
            postcode: '',
            country_code: '',
            email: '',
            phone: '',
            web: '',
            invoices_count: 0
          },
        })
        .then(() => {
          this.$router.push({ path: '/' }).then(() => { this.$router.go(0) });
        })
        .catch((error) => {
          console.log(error);
        });
    },
  }
}
</script>

<style>
  .two-columns-layout {
    @media (min-width: 992px) {
      display: grid;
      grid-template-rows: repeat(5, auto);
      grid-template-columns: repeat(2, 1fr);
      grid-auto-flow: column;
      grid-gap: 0 40px;
      gap: 0 40px;
    }
  }

  .client-form {
    label {
      font-weight: 700;

      &:before {
        content: unset !important;
      }
    }
  }

  .form-heading {
    gap: 16px;
    margin-bottom: 2rem;
  }

  .input-help-text {
    font-size: 0.8rem;
    line-height: 0.95rem;
    margin-top: 4px;
    color: #6c757d;
  }

  .select-like-input {
    width: 100%;

    .el-input__inner {
      padding: 0 15px;
    }

    .el-input__suffix {
      display: none;
    }

  }

  .select-item {
    height: auto;
    line-height: 16px;
    padding-top: 8px;
    padding-bottom: 8px;
  }
</style>
