<template>
    <div class="flex flex-row min-h-screen">
        <div class="w-2/5 bg-custom-bg-green grow flex items-center justify-center">
            <img src="../assets/img/HeartyMealLoginLogo.png" alt="Hearty Meal">
        </div>
        <div class="w-3/5 flex items-center">
            <img src="../assets/img/GreenCurve.png" class="h-full" alt="Green Curve Decor">
            <img src="../assets/img/BrownBlob.png" class="w-80 h-80 absolute bottom-0 right-0" style="object-fit: cover; object-position: 220px 120px;" alt="Brown Blob Decor">
            <div class="space-y-5 m-9 z-10">
                <H1 class="">Login to your account</H1>
                <H2>Welcome back 👋</H2>
                <Overlay :level="1" class="flex flex-col space-y-5">
                    <ButtonOrange @click.prevent="onVerify" class="w-full">Verify</ButtonOrange>
                </Overlay>
                <Overlay :level="1" class="flex flex-col space-y-5">
                    <P>Temporary quick login to skip needing to enter an email</P>
                    <Button @click.prevent="quickLogin">Quick Login</Button>
                </Overlay>
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

const userInfo = useUserInfo()
const email = ref("")

const emailErrorText = ref("")

const onVerify = async () => {
    emailErrorText.value = ""
    let result = await userInfo.login(email.value)
    if(result) {
        navigateTo("/");
    }
    else {
        emailErrorText.value = "email not registered"
    }
}

const quickLogin = async () => {
    useUserInfo().quickLogin()
    navigateTo("/")
}

</script>