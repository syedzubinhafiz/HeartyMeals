<template>
    <div class="flex flex-row min-h-screen">
        <div class="w-2/5 bg-custom-bg-green grow flex items-center justify-center">
            <img src="../assets/img/HeartyMealLargeLogo.png" alt="Hearty Meal">
        </div>
        <div class="w-3/5 flex items-center">
            <img src="../assets/img/GreenCurve.png" class="h-screen" alt="Green Curve Decor">
            <img src="../assets/img/BrownBlob.png" class="w-80 h-80 absolute bottom-0 right-0" style="object-fit: cover; object-position: 220px 120px;" alt="Brown Blob Decor">
            <div class="w-fit flex justify-center grow">
                <div class="space-y-5 m-9 z-10">
                    <H1 class="">Login to your account</H1>
                    <H2>Welcome back 👋</H2>
                    <Overlay :level="1" class="flex flex-col space-y-5">
                        <div class="flex justify-center">
                            <ButtonOrange @click.prevent="onVerify">Log In</ButtonOrange>
                        </div>
                        
                    </Overlay>
                    <Overlay :level="1" class="flex flex-col space-y-5">
                        <P>Temporary quick login to skip needing to enter an email</P>
                        <NuxtLink to="/temp" class="rounded-md shadow-md bg-custom-button-green w-fit text-white p-3">Quicker Login</NuxtLink>
                        <Button @click.prevent="quickLogin">Quick Login</Button>
                    </Overlay>
                </div>
            </div>


        </div>
    </div>

</template>
<script setup>
defineOptions({
	name: "HomePage",
});


definePageMeta({
	layout: "emptylayout"
});

const onVerify = () => {
    navigateTo('/sign-in');
}

</script>