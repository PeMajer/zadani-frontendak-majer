<template>
  <div class="page-wrapper">
    <div class="page-container">
      <header>
        <h1>Detail kontaktu</h1>
      </header>
      <main>
        <div class="white-container">
          <ClientForm />
        </div>
      </main>
    </div>
  </div>
</template>

<script>
  import ClientForm from '@/components/clients/ClientForm.vue';

  export default {
    components: {
      ClientForm,
    },
  }
</script>
