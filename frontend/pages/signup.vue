<template>
    <div class="flex flex-row min-h-screen">
        <div class="w-2/5 bg-custom-bg-green grow flex items-center justify-center">
            <img src="../assets/img/HeartyMealLargeLogo.png" alt="Hearty Meal">
        </div>
        <div class="w-3/5 flex items-center justify-center">
            <img src="../assets/img/GreenCurve.png" class="h-screen" alt="Green Curve Decor">
            <img src="../assets/img/BrownBlob.png" class="w-80 h-80 absolute bottom-0 right-0" style="object-fit: cover; object-position: 220px 120px;" alt="Brown Blob Decor">
            <div class="space-y-5 m-9 sm:mx-24 grow z-10 flex flex-col items-center">
                <H1>Create an account</H1>
                <!-- subpage 1 -->
                <Overlay v-if="signupPage==0" :level="1" class="flex flex-col w-fit p-5 space-y-5">
                    <!-- options -->
                    <div class="space-y-0">
                        <P><b>Country</b></P>
                        <DropdownSearchBar :dataList="countryList" v-model="country"/>
                        <P><b>Ethnicity</b></P>
                        <DropdownSearchBar :dataList="ethnicityList" v-model="ethnicity"/>
                        <P><b>Gender</b></P>
                        <RadioButton name="Gender" :options="['Male','Female']" v-model="gender"/>
                        <P><b>NYHA Classification</b></P>
                        <Dropdown :options="['I','II','III','IV']" :optionValues="[1,2,3,4]" v-model="nyhaClassification"/>
                    </div>
                    <!-- next page button -->
                    <div class="w-full flex justify-center">
                        <ButtonOrange @click.prevent="signupPage = 1; console.log(signupPage)">Next -></ButtonOrange>
                    </div>
                </Overlay>
                <!-- subpage 2 -->
                <Overlay v-if="signupPage==1" :level="1" class="flex flex-col space-y-5">
                    <!-- previous page button -->
                    <ButtonTransparent @click.prevent="signupPage = 0"><- Back</ButtonTransparent>
                    <!-- options -->
                    <div class="space-y-0">
                        <P><b>Allergies</b></P>
                        <DropdownSearchBar :dataList="allergyList" v-model="allergies"/>
                        <P><b>Dietary Restriction</b></P>
                        <DropdownSearchBar :dataList="dietList" v-model="dietaryRestrictions"/>
                        <P><b>Are you currently taking any Warfarin?</b></P>
                        <RadioButton name="gender" :options="['yes','no']" v-model="warfarin" />
                    </div>
                    <!-- sign-up button -->
                    <div class="w-full flex justify-center">
                        <ButtonOrange @click.prevent="signUp">Sign Up</ButtonOrange>
                    </div>
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
// relevant variables
const signupPage = ref(0)

const country = ref({name:"",id:""})
const ethnicity = ref({name:"",id:""})
const gender = ref("")
const nyhaClassification = ref("II")

const allergies = ref("")
const dietaryRestrictions = ref("")
const warfarin = ref("no")

const userInfo = useUserInfo()
// function for signing up
const signUp = async () => {

    let result = await userInfo.signup(gender.value,country.value.id,nyhaClassification.value,dietaryRestrictions.value.id,ethnicity.value.id,`{\"warfarin\":${warfarin.value=="yes"?"true":"false"}}`,allergies.value.name)
    if(result) {
        navigateTo("/temp");
    }
}
// datalists from API
const countryList = ref([])
const ethnicityList = ref([])
const allergyList = ref([])
const dietList = ref([])

// obtains relevant data
onMounted(async () => {
    await useApi('/country','GET')
    countryList.value = (await useApi('/country','GET')).value
    ethnicityList.value = (await useApi('/ethnicity','GET')).value
    allergyList.value = (await useApi('/food_category','GET')).value
    for(let subVal of allergyList.value) {
        subVal.name = subVal.type
    }
    dietList.value = (await useApi('/dietary','GET')).value
})





</script>