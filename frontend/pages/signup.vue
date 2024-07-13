<template>
    <div class="flex flex-row min-h-screen">
        <div class="w-1/2 bg-custom-bg-green grow flex items-center justify-center">
            <img src="../assets/img/HeartyMealLoginLogo.png" alt="Hearty Meal">
        </div>
        <div class="w-1/2 flex items-center justify-center">
            <div class="h-0 w-0 border-t-[50vh] border-l-[5vw] border-b-[50vh] border-solid border-t-transparent border-b-transparent border-l-custom-bg-green grow"/>
            <div class="space-y-5 m-9 grow">
                <H1>Create an account</H1>
                <Overlay :level="1" class="flex flex-col space-y-5">
                    <div class="space-y-0">
                        <P><b>Full Name</b></P>
                        <Input placeholder="Full Name" v-model="fullName"></Input>
                        <P><b>Identity Number</b></P>
                        <Input placeholder="Identity Number" v-model="identityNumber"></Input>
                        <P><b>Ethnicity</b></P>
                        <Input placeholder="Ethnicity" v-model="ethnicity"></Input>
                        <P><b>Gender</b></P>
                        <RadioButton name="gender" :options="['male','female','other']" v-model="gender"/>
                        <P><b>Home Address</b></P>
                        <Input placeholder="Home Address" v-model="homeAddress"></Input>
                        <P><b>Phone Number</b></P>
                        <Input placeholder="Phone Number" v-model="phoneNumber"></Input>
                    </div>
                    <Button class="bg-custom-button-orange hover:bg-custom-button-orange text-custom-text-orange w-full">Next -></Button>
                </Overlay>
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

const fullName = ref("")
const identityNumber = ref("")
const ethnicity = ref("")
const gender = ref("")
const homeAddress = ref("")
const phoneNumber = ref("")
</script>