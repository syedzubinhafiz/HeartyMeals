<template>
    <div class="flex flex-row min-h-screen">
        <div class="w-2/5 bg-custom-bg-green grow flex items-center justify-center">
            <img src="../assets/img/HeartyMealLargeLogo.png" alt="Hearty Meal">
        </div>
        <div class="w-3/5 flex items-center justify-center">
            <img src="../assets/img/GreenCurve.png" class="h-full" alt="Green Curve Decor">
            <img src="../assets/img/BrownBlob.png" class="w-80 h-80 absolute bottom-0 right-0" style="object-fit: cover; object-position: 220px 120px;" alt="Brown Blob Decor">
            <div class="space-y-5 m-9 grow z-10">
                <H1>Create an account</H1>
                <Overlay v-if="signupPage==0" :level="1" class="flex flex-col space-y-5">
                    <div class="space-y-0">
                        <P><b>Country</b></P>
                        <SearchBar :dataList="countryList" v-model="country"/>
                        <P><b>Ethnicity</b></P>
                        <SearchBar :dataList="ethnicityList" v-model="ethnicity"/>
                        <P><b>Gender</b></P>
                        <RadioButton name="Gender" :options="['male','female']" v-model="gender"/>
                        <P><b>NYHA Classification</b></P>
                        <Dropdown :options="['I','II','III','IV']" v-model="nyhaClassification"/>
                    </div>
                    <ButtonOrange @click.prevent="signupPage = 1; console.log(signupPage)" class="w-full">Next -></ButtonOrange>
                </Overlay>
                <Overlay v-if="signupPage==1" :level="1" class="flex flex-col space-y-5">
                    <ButtonTransparent @click.prevent="signupPage = 0"><- Back</ButtonTransparent>
                    <div class="space-y-0">
                        <P><b>Allergies</b></P>
                        <Dropdown :options="['Allergy 1','Allergy 2','Allergy 3']" v-model="allergies"/>
                        <P><b>Dietary Restriction</b></P>
                        <Dropdown :options="['Restriction 1','Restriction 2','Restriction 3']" v-model="dietaryRestrictions"/>
                        <P><b>Are you currently taking any Warfarin?</b></P>
                        <RadioButton name="gender" :options="['yes','no']" v-model="warfarin" />
                    </div>
                    <ButtonOrange @click.prevent="signUp" class="bg-custom-button-orange hover:bg-custom-button-orange text-custom-text-orange w-full">Sign Up</ButtonOrange>
                </Overlay>
            </div>

        </div>
    </div>

</template>
<script setup>

  definePageMeta({
    middleware: ["auth"],
  });
  
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
const nyhaClassification = ref("II")

const allergies = ref("")
const dietaryRestrictions = ref("")
const warfarin = ref("no")

const userInfo = useUserInfo()
const signUp = () => {
    let result =  userInfo.signup()
    console.log(result)
    // if(result) {
    //     navigateTo("/");
    // }
}

const countryList = ref([])
countryList.value = await useApi('/country','GET')
console.log(countryList)

const ethnicityList = ref([])
ethnicityList.value = await useApi('/ethnicity','GET')
console.log(ethnicityList)
</script>