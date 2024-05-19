<template>
  <div class="page-wrapper">
    <div class="page-container">
      <header>
        <h1>Nový kontakt</h1>
      </header>
      <main>
        <div class="white-container">
          <el-row type="flex">
            <img src="@/assets/ico-supply.svg" />
          </el-row>
          <el-form :model="clientForm" :rules="rules" label-position="left" ref="clientForm" label-width="100px" class="client-form">
            <div class="two-columns-layout">
              <el-form-item label="Jméno" prop="name">
                <el-input v-model="clientForm.name"></el-input>
              </el-form-item>
              <el-form-item label="Web" prop="web">
                <el-input v-model="clientForm.web"></el-input>
              </el-form-item>

            </div>
            <el-row type="flex" justify="end">
              <el-button type="primary" plain>Zahodit</el-button>
              <el-button @click="submitForm('clientForm')" type="warning" icon="el-icon-plus">Create</el-button>
            </el-row>
          </el-form>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import { CREATE_CLIENT } from '../../muttations';

export default {
  data() {
    return {
      clientForm: {
        name: '',
        companyNumber: '',
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
          { required: true, message: 'Musite zadat jmeno', trigger: 'blur' },
        ],
      }
    };
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
    createClient() {
      this.$apollo
        .mutate({
          mutation: CREATE_CLIENT,
          variables: {
            name: this.clientForm.name,
            company_number: '',
            street: '',
            city: '',
            postcode: '',
            country_code: '',
            email: '',
            phone: '',
            web: '',
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
  }
}
</style>
