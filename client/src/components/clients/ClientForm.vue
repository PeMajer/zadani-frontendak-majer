<template>
  <div>
    <HeadingWithImage heading="Základní údaje" :image="require('@/assets/ico-supply.svg')" />
    <div v-if="error">{{ error }}</div>
    <el-form
      v-else
      v-loading="loading"
      :model="clientData"
      :rules="rules"
      label-position="left"
      ref="clientForm"
      class="client-form"
      label-width="100px"
    >
      <div class="two-columns-layout">
        <el-form-item label="Jméno" prop="name" class="is-no-asterisk">
          <el-select
            v-model="clientData.name"
            @change="prefillData"
            class="select-like-input"
            filterable
            no-match-text="Hledani neodpovida zadna firma"
            placeholder="Vyhledat firmu podle nazvu"
          >
            <el-option class="select-like-input-item"
              v-for="company in allCompanyInfos"
              :key="company.id"
              :label="company.name"
              :value="company"
            >
              <div>
                <b>{{ company.name }}</b>
                <div>{{  clientData.name  }}</div>
                <div>IČO: {{ company.company_number }}</div>
                <div v-if="company.street && company.city && company.postcode">
                  {{ company.street }}, {{ company.city }}, {{ company.postcode }}
                </div>
              </div>
              <i v-if="company.name == clientData.name" class="el-icon-check"/>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="IČO" prop="companyNumber">
          <el-input
            v-model="clientData.companyNumber"
            @input="handleNumberInput"
            prefix-icon="el-icon-search"
            placeholder="Doplnit údaje podle IČO"
          ></el-input>
          <div class="input-help-text">Pokud zadáte nejprve IČO subjektu, jeho název a adresa se automaticky načtou.</div>
        </el-form-item>
        <el-form-item label="DIČ" prop="vatNumber">
          <el-input v-model="clientData.vatNumber"></el-input>
        </el-form-item>
        <el-form-item label="Telefon" prop="phone" type="tel">
          <el-input v-model="clientData.phone"></el-input>
        </el-form-item>
        <el-form-item label="E-mail" prop="email" type="email">
          <el-input v-model="clientData.email"></el-input>
        </el-form-item>
        <el-form-item label="Web" prop="web">
          <el-input v-model="clientData.web"></el-input>
        </el-form-item>
        <el-form-item label="Ulice" prop="street">
          <el-input v-model="clientData.street"></el-input>
        </el-form-item>
        <el-form-item label="Město" prop="city">
          <el-input v-model="clientData.city"></el-input>
        </el-form-item>
        <el-form-item label="PSČ" prop="postcode">
          <el-input v-model="clientData.postcode"></el-input>
        </el-form-item>
        <ClientFormCountries :selected="clientData.countryCode" @update-selected-country="updateSelectedCountry"/>
      </div>
      <el-row type="flex" justify="end">
        <el-button type="primary" plain @click="() => { this.$router.push({ path: '/' })}">Zahodit</el-button>
        <el-button @click="submitForm('clientForm')" type="warning" icon="el-icon-plus">Uložit změny</el-button>
      </el-row>
    </el-form>
  </div>
</template>

<script>
  import ClientFormCountries from '@/components/clients/ClientFormCountries.vue';
  import HeadingWithImage from '@/components/layout/HeadingWithImage';
  import { CREATE_CLIENT, UPDATE_CLIENT } from '../../muttations';
  import { COMPANIES_LIST_QUERY } from '../../queries';

  export default {
    props: {
      existedClientData: {
        type: Object,
        default: () => ({})
      },
    },
    components: {
      ClientFormCountries,
      HeadingWithImage
    },
    data() {
      return {
        clientData: {
          city: '',
          companyNumber: '',
          countryCode: '',
          email: '',
          invoicesCount: 0,
          name: '',
          phone: '',
          postcode: '',
          street: '',
          taxNumber: '',
          vatNumber: '',
          web: '',
        },
        rules: {
          name: [
            { required: true, message: 'Musíte zadat jméno', trigger: 'blur' },
          ],
          phone: [
            { validator: this.validatePhone, trigger: 'blur' }
          ],
        },
        loading: '',
        error: '',
        isClientNew: true,
      };
    },
    created() {
      if (Object.keys(this.existedClientData).length > 0) {
        this.isClientNew = false;
        this.prefillData(this.existedClientData);
      }
    },
    watch: {
      'clientData.companyNumber': function(newVal) {
        if (this.isClientNew) {
          const company = this.allCompanyInfos.find(company => company.company_number === newVal);
          if (company) {
            this.prefillData(company);
          }
        }
      }
    },
    apollo: {
      allCompanyInfos: {
        query: COMPANIES_LIST_QUERY,
        variables: {
          sortField: 'name',
          sortOrder: 'acs',
        },
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
            this.saveClient();
          } else {
            return false;
          }
        });
      },
      handleNumberInput(value) {
        const numericValue = value.replace(/[^0-9]/g, "");
        this.clientData.companyNumber = numericValue;
      },
      validatePhone(rules, value, callback) {
        const phoneRegex = /^[\d+\-() ]{9,}$/;
        if (!value) { return callback() }
        if (!phoneRegex.test(value)) {
          return callback(new Error('Zadejte platné telefonní číslo'));
        }
        callback();
      },
      prefillData(data) {
        this.clientData = {
          id: this.isClientNew ? undefined : data.id ,
          city: data.city || data.address_city,
          companyNumber: data.company_number,
          countryCode: data.country_code,
          email: data.email,
          invoicesCount: data.invoices_count,
          name: data.name,
          phone: data.phone,
          postcode: data.postcode || data.address_postcode,
          street: data.street || data.address_street,
          taxNumber: data.tax_number,
          vatNumber: data.vat_number || data.vat_no,
          web: data.web,
        };
      },
      saveClient() {
        const mutationType = this.isClientNew ? CREATE_CLIENT : UPDATE_CLIENT;

        this.$apollo
          .mutate({
            mutation: mutationType,
            variables: {
              id: this.isClientNew ? undefined : this.clientData.id,
              city: this.clientData.city || '',
              company_number: this.clientData.companyNumber || '',
              country_code: this.clientData.countryCode || '',
              email: this.clientData.email || '',
              invoices_count: this.clientData.invoicesCount || 0,
              name: this.clientData.name || '',
              phone: this.clientData.phone || '',
              postcode: this.clientData.postcode || '',
              street: this.clientData.street || '',
              tax_number: this.clientData.taxNumber || '',
              vat_number: this.clientData.vatNumber || '',
              web: this.clientData.web || '',
            },
          })
          .then(() => {
            this.$router.push({ path: '/' }).then(() => { this.$router.go(0) });
          })
          .catch((error) => {
            console.error("Failed to save client:", error);
          });
      },
      updateSelectedCountry(newVal) {
        this.clientData.countryCode = newVal;
      }
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

  .form-heading {
    gap: 16px;
    margin-bottom: 2rem;
  }

  .client-form .el-form-item label {
    font-weight: 700;
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

  .select-like-input-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    height: auto;
    line-height: 16px;
    padding-top: 8px;
    padding-bottom: 8px;

    &.selected {
      color: #606266;
    }

    .el-icon-check {
      color: green;
      font-size: 1.5rem;
    }
  }
</style>
