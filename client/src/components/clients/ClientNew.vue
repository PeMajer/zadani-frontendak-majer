<template>
  <div class="page-wrapper">
    <div class="page-container">
      <header>
        <h1>Nový kontakt</h1>
      </header>
      <main>
        <div class="main-container">
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

