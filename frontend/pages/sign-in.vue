<template>
    <div>Redirecting you to GreenSHeart Accounts for sign in, please wait...</div>
  </template>
  
  <script lang="ts" setup>
  definePageMeta({
    middleware: ["auth"],
  });
  
  await navigateTo("/temp");
  </script>
  