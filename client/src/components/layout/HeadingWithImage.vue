<template>
  <el-row type="flex" align="center" class="form-heading">
    <img :src="image">
    <h2>{{ heading }}</h2>
  </el-row>
</template>

<script>
 export default {
  props: {
    heading: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: '',
    }
  }
 }
</script>

<style>
 .form-heading {
    gap: 16px;
    margin-bottom: 2rem;
  }
</style>
