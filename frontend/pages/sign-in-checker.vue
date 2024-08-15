<template>
    <div>Redirecting you to HF Nutrition main page, please wait...</div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { useRoute } from "vue-router";
import { useApi } from '#imports';

export default defineComponent({
  setup() {
      onMounted(async () => {
        const route = useRoute();

        const { $oauth4webapiValidateAuthResponse } = useNuxtApp();
        try {
            
            const { accessToken, claims } = await $oauth4webapiValidateAuthResponse(
                new URL(window.location.href),
                sessionStorage.codeVerifier,
            );

            localStorage.accessToken = accessToken;
            localStorage.claims = JSON.stringify(claims);

            console.log("Authenticated successfully");  

            //check if db contains user
            const result = (await useApi("/user/verify", "GET")).value
            console.log(result)
            if (result == "false") {
                console.log("User not found in db, redirecting to sign up page");
                await navigateTo("/signup");
            } else {
                console.log("User found in db, redirecting to main page");
                await navigateTo("/temp"); //TODO: Change to main page 
            }

        } catch (error) {

            console.error(error);
            await navigateTo("/");
            
        }

        });
    }
});
</script>
