<template>
    <div class="flex flex-row min-h-screen">
        <div class="w-2/5 bg-custom-bg-green grow flex items-center justify-center">
            <img src="../assets/img/HeartyMealLoginLogo.png" alt="Hearty Meal">
        </div>
        <div class="w-3/5 flex items-center justify-center">
            <img src="../assets/img/GreenCurve.png" class="h-full" alt="Green Curve Decor">
            <img src="../assets/img/BrownBlob.png" class="w-80 h-80 absolute bottom-0 right-0" style="object-fit: cover; object-position: 220px 120px;" alt="Brown Blob Decor">
            <div class="space-y-5 m-9 grow z-10">
                <H1>Create an account</H1>
                <Overlay v-if="signupPage==0" :level="1" class="flex flex-col space-y-5">
                    <div class="space-y-0">
                        <P><b>Full Name</b></P>
                        <Input placeholder="Full Name" v-model="fullName"></Input>
                        <P><b>Country</b></P>
                        <Input placeholder="Country" v-model="country"></Input>
                        <P><b>Ethnicity</b></P>
                        <Input placeholder="Ethnicity" v-model="ethnicity"></Input>
                        <P><b>Gender</b></P>
                        <RadioButton name="gender" :options="['male','female','other']" v-model="gender"/>
                        <P><b>Home Address</b></P>
                        <Input placeholder="Home Address" v-model="homeAddress"></Input>
                        <P><b>Phone Number</b></P>
                        <Input placeholder="Phone Number" v-model="phoneNumber"></Input>
                        <P><b>Email</b></P>
                        <Input placeholder="Email" v-model="email"></Input>
                        <P><b>Password</b></P>
                        <Input placeholder="Password" v-model="password"></Input>
                    </div>
                    <ButtonOrange @click.prevent="signupPage = 2" class="w-full">Next -></ButtonOrange>
                </Overlay>
                <!-- <Overlay v-if="signupPage==1" :level="1" class="flex flex-col space-y-5">
                    <ButtonTransparent @click.prevent="signupPage = 0"><- Back</ButtonTransparent>
                    <div class="space-y-0">
                        <P><b>Heart Failure Diagnosis</b></P>
                        <Input placeholder="Diagnosis" v-model="fullName"></Input>
                        <P><b>Other Conditions</b></P>
                        <Input placeholder="Enter Input" v-model="fullName"></Input>
                        <P><b>Recent hospitalization due to heart failure (leave blank if there is no recent hospilization)</b></P>
                        <Input placeholder="Enter Input" v-model="fullName"></Input>
                        <P><b>Medical Prescribed</b></P>
                        <Input placeholder="Medicines" v-model="fullName"></Input>
                        <P><b>Country</b></P>
                        <Input placeholder="Country" v-model="fullName"></Input>
                    </div>
                    <ButtonOrange @click.prevent="signupPage = 2" class="w-full">Next -></ButtonOrange>
                </Overlay> -->
                <Overlay v-if="signupPage==2" :level="1" class="flex flex-col space-y-5">
                    <ButtonTransparent @click.prevent="signupPage = 0"><- Back</ButtonTransparent>
                    <div class="space-y-0">
                        <P><b>Allergies</b></P>
                        <Dropdown :options="['Allergy 1','Allergy 2','Allergy 3']" v-model="allergies"/>
                        <P><b>Dietary Restriction</b></P>
                        <Dropdown :options="['Restriction 1','Restriction 2','Restriction 3']" v-model="dietaryRestrictions"/>
                        <P><b>Are you currently taking any Warfarin?</b></P>
                        <RadioButton name="gender" :options="['yes','no']" v-model="warfarin" />
                    </div>
                    <ButtonOrange class="bg-custom-button-orange hover:bg-custom-button-orange text-custom-text-orange w-full">Sign Up</ButtonOrange>
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

const signupPage = ref(0)

const fullName = ref("")
const country = ref("")
const ethnicity = ref("")
const gender = ref("")
const homeAddress = ref("")
const phoneNumber = ref("")
const email = ref("")
const password = ref("")

const allergies = ref("")
const dietaryRestrictions = ref("")
const warfarin = ref("no")
</script>