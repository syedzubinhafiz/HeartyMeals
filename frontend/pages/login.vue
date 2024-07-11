<template>
    <div class="flex flex-row min-h-screen">
        <div class="w-1/2 bg-custom-bg-green grow flex items-center justify-center">
            <img src="../assets/img/HeartyMealLoginLogo.png" alt="Hearty Meal">
        </div>
        <div class="w-1/2 flex items-center justify-center p-9">
            <div class="space-y-5">
                <H1 class="">Login to your account</H1>
                <H2>Welcome back 👋</H2>
                <Overlay :level="1" class="flex flex-col space-y-5">
                    <div class="space-y-0">
                        <P><b>Email</b></P>
                        <Input placeholder="email" v-model="email"></Input>
                        <P class="text-red-500">{{emailErrorText}}</P>
                    </div>
                    <Button @click.prevent="onVerify" class="bg-custom-button-orange hover:bg-custom-button-orange text-custom-text-orange w-full">Verify</Button>
                </Overlay>
                <div class="flex flex-row space-x-2 items-center">
                    <P>Don't have an account?</P>
                    <Button class="bg-transparent hover:bg-transparent shadow-none text-custom-text-orange">Sign up</Button>
                </div>
                <Overlay :level="1" class="flex flex-col space-y-5">
                    <P>The login system currently uses a placeholder verification system that accepts the following emails: bob@gmail.com, kate@gmail.com</P>
                    <Button @click.prevent="() => {email='bob@gmail.com';onVerify()}">Quick Login</Button>
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

const onVerify = () => {
    emailErrorText.value = ""
    let result = userInfo.login(email.value)
    if(result) {
        navigateTo("/");
    }
    else {
        emailErrorText.value = "email not registered"
    }
}

</script>