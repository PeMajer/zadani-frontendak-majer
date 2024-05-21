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
        :key="country.alpha3Code"
        :label="country.translations.ces.official"
        :value="country.cca2"
      >
        {{ country.translations.ces.official }}
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
      selectedOption: 'Česká republika',
      error: '',
    }
  },
  watch: {
    selected(newVal) {
      this.selectedOption = newVal;
    }
  },
  created() {
    this.fetchCountries();
  },
  methods: {
    async fetchCountries() {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all?fields=translations,cca2');
        if (!response.ok) {
          this.error = `Network response was not ok: ${response.statusText}`;
        }
        const data = await response.json();
        this.countries = data;
        this.selectedOption = this.selected || 'CZ';
      } catch (error) {
        this.error = error;
      }
    },
    onSelectedOptionChange(value) {
      this.$emit('update-selected-country', value);
    }
  }
};
</script>
