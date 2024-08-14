<template>
  <main>
    <Suspense>
      <feed />
    </Suspense>
  </main>
</template>

<script setup lang="ts">
import Feed from "@/components/Feed.vue";
</script>

<style lang="scss">
@use "scss/styles";
</style>
