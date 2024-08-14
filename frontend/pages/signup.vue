<template>
    <div class="flex flex-row min-h-screen">
        <div class="w-2/5 bg-custom-bg-green grow flex items-center justify-center">
            <img src="../assets/img/HeartyMealLargeLogo.png" alt="Hearty Meal">
        </div>
        <div class="w-3/5 flex items-center justify-center">
            <img src="../assets/img/GreenCurve.png" class="h-full" alt="Green Curve Decor">
            <img src="../assets/img/BrownBlob.png" class="w-80 h-80 absolute bottom-0 right-0" style="object-fit: cover; object-position: 220px 120px;" alt="Brown Blob Decor">
            <div class="space-y-5 m-9 sm:mx-24 grow z-10">
                <H1>Create an account</H1>
                <Overlay v-if="signupPage==0" :level="1" class="flex flex-col space-y-5">
                    <div class="space-y-0">
                        <P><b>Country</b></P>
                        <SearchBar :dataList="countryList" v-model="country"/>
                        <P>country: {{ country }}</P>
                        <P><b>Ethnicity</b></P>
                        <SearchBar :dataList="ethnicityList" v-model="ethnicity"/>
                        <P><b>Gender</b></P>
                        <RadioButton name="Gender" :options="['Male','Female']" v-model="gender"/>
                        <P><b>NYHA Classification</b></P>
                        <Dropdown :options="['I','II','III','IV']" :optionValues="[1,2,3,4]" v-model="nyhaClassification"/>
                    </div>
                    <div class="w-full flex justify-center">
                        <ButtonOrange @click.prevent="signupPage = 1; console.log(signupPage)">Next -></ButtonOrange>
                    </div>
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
                    <div class="w-full flex justify-center">
                        <ButtonOrange @click.prevent="signUp">Sign Up</ButtonOrange>
                    </div>
                    <p class="text-red-500">{{ errorMessage }}</p>
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
const country = ref({name:"",id:""})
const ethnicity = ref({name:"",id:""})
const gender = ref("")
const homeAddress = ref("")
const phoneNumber = ref("")
const email = ref("")
const nyhaClassification = ref("II")

const allergies = ref("")
const dietaryRestrictions = ref("")
const warfarin = ref("no")

const userInfo = useUserInfo()

const errorMessage = ref("")
const signUp = async () => {
    errorMessage.value = ""
    let result = await userInfo.signup(gender.value,country.value.id,nyhaClassification.value,"1232bd2d-fb5d-45d8-ab3a-c39da5b0781b",ethnicity.value.id,`{\"warfarin\":${warfarin.value=="yes"?"true":"false"}}`)
    console.log(result)
    if(result.value?.statusCode==null && result.status==null) {
        navigateTo("/temp");
    }
    else {
        errorMessage.value = "sign up failed!"
    }
}

const countryList = ref([])
countryList.value = await useApi('/country','GET')
console.log(countryList)

const ethnicityList = ref([])
ethnicityList.value = await useApi('/ethnicity','GET')
console.log(ethnicityList)
</script>