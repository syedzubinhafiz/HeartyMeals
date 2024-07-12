<template>
    <div class="flex flex-row min-h-screen">
        <div class="w-1/2 bg-custom-bg-green grow flex items-center justify-center">
            <img src="../assets/img/HeartyMealLoginLogo.png" alt="Hearty Meal">
        </div>
        <div class="w-1/2 flex items-center justify-center p-9">
            <div class="space-y-5 justify-center">
                <H1>Create an account</H1>
                <Overlay :level="1" class="flex flex-col space-y-5">
                    <div class="space-y-0">
                        <P><b>Full Name</b></P>
                        <Input placeholder="Full Name"></Input>
                        <P><b>Identity Number</b></P>
                        <Input placeholder="Identity Number"></Input>
                        <P><b>Ethnicity</b></P>
                        <Input placeholder="Ethnicity"></Input>
                        <P><b>Gender</b></P>
                        <RadioButton name="gender" :options="['male','female','other']"/>
                        <P><b>Home Address</b></P>
                        <Input placeholder="Home Address"></Input>
                        <P><b>Phone Number</b></P>
                        <Input placeholder="Phone Number"></Input>
                    </div>
                    <Button class="bg-custom-button-orange hover:bg-custom-button-orange text-custom-text-orange w-full">Next -></Button>
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
	name: "SignUpPage",
});


definePageMeta({
	layout: "emptylayout"
});
</script>