<template>
    <div class="flex flex-row min-h-screen">
        <div class="bg-custom-bg-green grow flex items-center justify-center">
            <img src="../assets/img/HeartyMealLoginLogo.png" alt="Hearty Meal">
        </div>
        <div class="grow flex items-center justify-center">
            <div class="space-y-5">
                <H1 class="">Login to your account</H1>
                <H2>Welcome back 👋</H2>
                <Overlay :level="1" class="flex flex-col space-y-5">
                    <div class="space-y-0">
                        <P><b>Email</b></P>
                        <Input placeholder="email"></Input>
                    </div>
                    <Button class="bg-custom-button-orange hover:bg-custom-button-orange text-custom-text-orange w-full">Verify</Button>
                </Overlay>
                <div class="flex flex-row space-x-2 items-center">
                    <P>Don't have an account?</P>
                    <Button class="bg-transparent hover:bg-transparent shadow-none text-custom-text-orange">Sign up</Button>
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
</script>