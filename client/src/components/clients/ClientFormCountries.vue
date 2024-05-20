<template>
  <el-form-item label="Země" prop="country">
    <el-select
      v-model="selectedOption"
      filterable
      no-match-text="Hledání neodpovídá žádná země"
      no-data-text="Země se načítají"
      style="width: 100%;"
    >
      <el-option
        v-for="country in countries"
        :key="country.alpha3Code"
        :label="country.translations.ces.official"
        :value="country.translations.ces.official"
      >
        {{ country.translations.ces.official }}
      </el-option>
    </el-select>
  </el-form-item>
</template>

<script>
export default {
  data() {
    return {
      countries: [],
      selectedOption: 'Česká republika',
      error: '',
    }
  },
  created() {
    this.fetchCountries();
  },
  methods: {
    async fetchCountries() {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        if (!response.ok) {
          this.error = `Network response was not ok: ${response.statusText}`;
        }
        const data = await response.json();
        this.countries = data;
      } catch (error) {
        this.error = error;
      }
    }
  }
};
</script>
