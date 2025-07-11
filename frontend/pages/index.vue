<template>
    <div class="flex flex-row min-h-screen">
        <div class="w-2/5 bg-custom-bg-green grow flex items-center justify-center">
            <img src="../assets/img/HeartyMealLargeLogo.svg" alt="Hearty Meal">
        </div>
        <div class="w-3/5 flex items-center">
            <img src="../assets/img/GreenCurve.png" class="h-screen" alt="Green Curve Decor">
            <img src="../assets/img/brownBlob.svg" class="w-80 h-80 absolute bottom-0 right-0" style="object-fit: cover; object-position: 220px 120px;" alt="Brown Blob Decor">
            <div class="w-fit flex justify-center grow">
                <div class="space-y-5 m-9 z-10 container">
                    <H1 class="">Login to your account</H1>
                    <H2>Welcome back 👋</H2>
                    <div class="flex justify-center">
                        <ButtonOrange @click.prevent="onVerify">Log In</ButtonOrange>
                    </div>
                    <!-- 
                    <Overlay :level="1" class="flex flex-col space-y-5">
                        <div class="flex justify-center">
                            <ButtonOrange @click.prevent="onVerify">Log In</ButtonOrange>
                        </div>
                        
                    </Overlay> -->
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

const onVerify = async () => {
    await navigateTo('/sign-in');
}

</script>

<style scoped>

.container {
    width: fit-content;
    background-color: #F3EADA;
    padding:2.5%;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
}

</style>