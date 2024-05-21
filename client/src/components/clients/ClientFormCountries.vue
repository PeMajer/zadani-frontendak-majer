<template>
  <el-form-item label="Země" prop="country">
    <el-select
      v-model="selectedOption"
      @change="onSelectedOptionChange"
      filterable
      no-match-text="Hledání neodpovídá žádná země"
      no-data-text="Země se načítají"
      style="width: 100%;"
    >
      <el-option
        v-for="country in countries"
        :key="country.code"
        :label="country.name"
        :value="country.code"
      >
        {{ country.name }}
      </el-option>
    </el-select>
  </el-form-item>
</template>

<script>
export default {
  props: {
    selected: {
      type: String,
      default: '',
    }
  },
  emits: ['update-selected-country'],
  data() {
    return {
      countries: [],
      selectedOption: this.selected || 'CZ',
      error: '',
    }
  },
  watch: {
    selected(newVal) {
      this.selectedOption = newVal;
    }
  },
  created() {
    // this.fetchCountries();
    const countriesI18n = require("i18n-iso-countries");
    countriesI18n.registerLocale(require("i18n-iso-countries/langs/cs.json"));
    this.countries = Object.values(countriesI18n.getAlpha3Codes()).map((item) => { return({ code: item, name:  countriesI18n.getName(item, "cs") })});
  },
  methods: {
    // async fetchCountries() {
    //   try {
    //     const response = await fetch('https://restcountries.com/v3.1/all?fields=translations,cca2');
    //     if (!response.ok) {
    //       this.error = `Network response was not ok: ${response.statusText}`;
    //     }
    //     const data = await response.json();
    //     this.countries = data;
    //     this.selectedOption = this.selected || 'CZ';
    //   } catch (error) {
    //     this.error = error;
    //   }
    // },
    onSelectedOptionChange(value) {
      this.$emit('update-selected-country', value);
    }
  }
};
</script>
