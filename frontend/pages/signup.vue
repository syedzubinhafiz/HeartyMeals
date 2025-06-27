<template>
    <img src="@/assets/img/sign-in-logo.svg" class="logo">
    
    <div class="container">
        <h1>Create an account</h1>

        <div class="form">
            <div v-if="section_one" class="section">
                <div class="input-container" style="margin-top: 5%;">
                    <label for="age">Age</label>
                    <input type="number" id="age" name="age" placeholder="Age" min="1" step="1" required class="from-input-box">
                </div>
                <div class="input-container">
                    <label for="weight">Weight (kg)</label>
                    <input type="number" id="weight" name="weight" placeholder="Weight" min="1" step="0.01" required class="from-input-box">
                </div>
                <div class="input-container">
                    <label for="height">Height (cm)</label>
                    <input type="number" id="height" name="height" placeholder="Height" min="1" step="0.01" required class="from-input-box">
                </div>
                <div class="input-container">
                    <label for="country">Country</label>
                    <SingleSelectionWSearchbarDropdown
                        :items="country_dropdown_option"
                        @item-selected="selected_country = $event"
                        defaultText="Select a country"
                        buttonStyle="border-radius: 5px; border: 1px solid #ccc; box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.1);background-color: #fefef1;"
                        dropdownStyle="width: 100%; height: 250px; border-radius: 5px; border: 1px solid #ccc; box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.1); z-index:100; overflow-y: auto;"
                    />
                </div>
                <div class="input-container">
                    <label for="ethnicity">Ethnicity</label>
                    <SingleSelectionWSearchbarDropdown
                        :items="ethnicity_dropdown_option"
                        @item-selected="selected_ethnicity = $event"
                        defaultText="Select an ethnicity"
                        buttonStyle="border-radius: 5px; border: 1px solid #ccc; box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.1);background-color: #fefef1;"
                        dropdownStyle="width: 100%; height: 220px; border-radius: 5px; border: 1px solid #ccc; box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.1); z-index:100; overflow-y:auto"
                    />
                </div>
                <div class="input-container">
                    <label for="gender">Gender</label>
                    <SingleSelectionDropdown
                        :items="gender_dropdown_option"
                        @update:modelValue="updateSelectedGender"
                        defaultText="Select a gender"
                        buttonStyle="border-radius: 5px; border: 1px solid #ccc; box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.1);background-color: #fefef1;"
                        dropdownStyle="width: 100%; height: 120px; border-radius: 5px; border: 1px solid #ccc; box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.1); z-index:100; overflow-y:auto"
                        /> 
                </div>
                <div class="button-next" @click="changeToSection('section_one', 'section_two')" style="margin-top: 1%">
                    Next ->
                </div>
            </div>

            <div v-if="section_two" class="section">
                <div class="button-back" @click="changeToSection('section_two', 'section_one')">
                    <- Back
                </div>

                <div class="input-container">
                    <label for="dietary">Dietary</label>
                    <SingleSelectionWSearchbarDropdown
                        :items="dietary_dropdown_option"
                        @item-selected="selected_dietary = $event"
                        defaultText="Select a dietary"
                        buttonStyle="border-radius: 5px; border: 1px solid #ccc; box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.1);background-color: #fefef1;"
                        dropdownStyle="width: 100%; height: 300px; border-radius: 5px; border: 1px solid #ccc; box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.1); z-index:100; overflow-y: auto;"
                    />
                </div>

                <div class="input-container">
                    <label for="allergy">Food Allergies</label>
                    <MultiSelectionWSearchbarDropdown 
                        :items="allergies_dropdown_option"
                        @items-selected="selected__allergies = $event"
                        defaultText="Select food allergies"
                        buttonStyle="border-radius: 5px; border: 1px solid #ccc; box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.1);background-color: #fefef1;"
                        dropdownStyle="width: 100%; height: 300px; border-radius: 5px; border: 1px solid #ccc; box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.1); z-index:100; overflow-y: auto;"
                    />
                </div>

                <div class="input-container">
                <label for="nyha">NYHA Classification</label>
                <SingleSelectionDropdown
                    :items="nyha_dropdown_option"
                    @update:modelValue="updateSelectedNYHA"
                    defaultText="Select an NYHA Classification"
                    buttonStyle="border-radius: 5px; border: 1px solid #ccc; box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.1);background-color: #fefef1;"
                    dropdownStyle="width: 100%; height: 200px; border-radius: 5px; border: 1px solid #ccc; box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.1); z-index:100; overflow-y:auto"
                />
                </div>

                <div class="input-container">
                    <label>Are you currently taking Warfarin?</label>
                    <div class="radio-group">
                        <div class="radio">
                            <input type="radio" id="yes" name="warfarin" value="yes">
                            <label for="yes">Yes</label>
                        </div>
                        <div class="radio">
                            <input type="radio" id="no" name="warfarin" value="no">
                            <label for="no">No</label>
                        </div>
                    </div>
                </div>

                <div class="button-next" style="margin-top: 17%;" @click="changeToSection('section_two','section_three')">
                    Next ->
                </div>
            </div>   

            <div v-if="section_three" class="section">
                <div class="button-back" @click="changeToSection('section_three', 'section_two')">
                    <- Back
                </div>

                <div class="input-container">
                    <label for="activity-level">Activity Level</label>
                    <SingleSelectionDropdown 
                        :items="activity_level_dropdown_option"
                        @update:modelValue="updateSelectedActivityLevel"
                        defaultText="Select an activity level"
                        buttonStyle="border-radius: 5px; border: 1px solid #ccc; box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.1);background-color: #fefef1;"
                        dropdownStyle="width: 100%; height: 200px; border-radius: 5px; border: 1px solid #ccc; box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.1); z-index:100; overflow-y:auto"
                    />
                </div>

                <div class="input-container">
                    <label for="carbs">Daily Nutrient Setting</label>
                </div>

                <div class="input-container">
                    <label style="font-size: 0.8rem; margin-left: 5%" >Carbohydrate</label>
                    <div class="range-slider">
                        <input type="range" v-model.number="carbsPercentage" min="0" max="100" step="1" class="slider">
                        <input type="number" class="nutrient-text-input" v-model.number="carbsPercentage" min="0" max="100" step="0.01" placeholder="value"> %
                    </div>
                </div>

                <div class="input-container">
                    <label style="font-size: 0.8rem; margin-left: 5%;">Protein</label>
                    <div class="range-slider">
                        <input type="range" v-model.number="proteinPercentage" min="0" max="100" step="0.01" class="slider">
                        <input type="number" class="nutrient-text-input" v-model.number="proteinPercentage" min="0" max="100" step="0.01" placeholder="value">%

                    </div>
                </div>


                <div class="input-container">
                    <label style="font-size: 0.8rem; margin-left: 5%;">Fat</label>
                    <div class="range-slider">
                        <input type="range" v-model.number="fatPercentage" min="0" max="100" step="1" class="slider">
                        <input type="number" class="nutrient-text-input" v-model.number="fatPercentage" min="0" max="100" step="0.01" placeholder="value">%

                    </div>
                </div>

                <div class="nutrient-total-container">
                    <label class="nutrient-total"> Nutrients total percentage: {{ nutrientTotal }} %</label>

                    <label v-if="parseInt(nutrientTotal) > 100" class="nutrient-total-message">Total must add up to 100%</label>
                </div>

                <div class="input-container" style=" margin-top: 2.5%;">
                    <label  for="cholesterol-level">Cholesterol Level</label>
                    <div class="radio-group">
                        <div class="radio">
                            <input type="radio" id="high" name="cholesterol-level" value="High">
                            <label for="high">high</label>
                        </div>
                        <div class="radio">
                            <input type="radio" id="medium" name="cholesterol-level" value="Normal">
                            <label for="normal">normal</label>
                        </div>
                        <div class="radio">
                            <input type="radio" id="low" name="cholesterol-level" value="Low">
                            <label for="low">low</label>
                        </div>
                    </div>
                </div>

                <div class="button-next" style="margin-top: 1%;" @click="signUp()">
                    Sign Up
                </div>
                
            </div>   
        </div>
    </div>
</template>
<script setup>
import SingleSelectionWSearchbarDropdown from "@/components/Dropdown/SingleSelectionWSearchBarDropdown.vue";
import SingleSelectionDropdown from "~/components/Dropdown/SingleSelectionDropdown.vue";
import MultiSelectionWSearchbarDropdown from "~/components/Dropdown/MultiSelectionWSearchbarDropdown.vue";
import { useNuxtApp } from "#app";
import { ref } from "vue";

const {$axios} = useNuxtApp();


defineOptions({
	name: "SignUpPage",
});


definePageMeta({
	layout: "emptylayout",
      middleware: ["auth"],

});

//Section identification
const section_one = ref(true);
const section_two = ref(false);
const section_three = ref(false);



// Section one data
const country_dropdown_option = ref([]);
const ethnicity_dropdown_option = ref([]);
const gender_dropdown_option = ref([
    { id: "Male", display: "Male"},
    { id: "Female", display: "Female"},
]);
const nyha_dropdown_option = ref([
    { id: 1, display: "NYHA Class I" },
    { id: 2, display: "NYHA Class II" },
    { id: 3, display: "NYHA Class III" },
    { id: 4, display: "NYHA Class IV" },
]);

const selected_country = ref(null);
const selected_gender = ref(null);
const selected_ethnicity = ref(null);

// Section two data
const dietary_dropdown_option =  ref([]);
const allergies_dropdown_option = ref([]);

const selected_dietary = ref(null);
const selected__allergies = ref([]);
const selected_nyha = ref(null);


//section three data
const activity_level_dropdown_option = ref([
    {id: 1, display:"less than 1 session of 30 minute exercise per week"},
    {id: 2, display:"1-2 sessions of 30 minute exercise per week"},
    {id: 3, display:"3-4 sessions of 30 minute exercise per week"},
    {id: 4, display:"5-6 sessions of 30 minute exercise per week"},
    {id: 5, display:"7 or more sessions of 30 minute exercise per week"},
])
const carbsPercentage = ref(0);
const proteinPercentage = ref(0);
const fatPercentage = ref(0);
const nutrientTotal = ref(0);

const selected_activity_level = ref(null);

const userInfo = ref({
    countryId: null,
    nyhaLevel: null,
    dietaryId: null,
    gender: null,
    ethnicityId: null,
    age: null,
    weight: null,
    height: null,
    userNutritionSetting:{
        carbsPercentage: null,
        proteinPercentage: null,
        fatPercentage: null,
        cholesterolLevel: null,
        activityLevel: null,    
    }
})


const userAllergies = ref([]);


onMounted(() => {
    const token = localStorage.getItem("accessToken");
    try{
        $axios.get("/country", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((response) => {
            country_dropdown_option.value = response.data.map((country) => {
                return {
                    id: country.id,
                    display: country.name,
                };
            });
        });

        $axios.get('/ethnicity',{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((response) => {
            ethnicity_dropdown_option.value = response.data.map((ethnicity) => {
                return {
                    id: ethnicity.id,
                    display: ethnicity.name
                }
            
            })
        });

        $axios.get('/dietary',{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((response) => {
            dietary_dropdown_option.value = response.data.map((dietary) => {
                return {
                    id: dietary.id,
                    display: dietary.name
                }
            })
        });

        $axios.get('/food_category/get',{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((response) => {
            allergies_dropdown_option.value = response.data.map((food_category) => {
                return {
                    id: food_category.id,
                    display: food_category.type
                }
            })
        });
    } catch (error) {

        console.log(error);
    }
});

watch([carbsPercentage, proteinPercentage, fatPercentage], () => {
    nutrientTotal.value = parseInt(carbsPercentage.value) + parseInt(proteinPercentage.value) + parseInt(fatPercentage.value);
});

const updateSelectedGender = (id) => {
    selected_gender.value = id;
};

const updateSelectedNYHA = (id) => {
    selected_nyha.value = id;
};

const updateSelectedActivityLevel = (id) => {
    selected_activity_level.value = id;
};

function changeToSection(current, next){
    if (current == 'section_one'){
        if(! validateSectionOne()){
            return;
        }
        
    } else if (current == 'section_two'){
        if(! validateSectionTwo()){
            return;
        }
    }
    if (current == 'section_one'){
        section_one.value = false;
    }
    else if (current == 'section_two'){
        section_two.value = false;
    }
    else if (current == 'section_three'){
        section_three.value = false;
    }

    if (next == 'section_one'){
        section_one.value = true;
    }
    else if (next == 'section_two'){
        section_two.value = true;
    }
    else if (next == 'section_three'){
        section_three.value = true;
    }
}

function validateSectionOne(){
    let valid = true;
    if (selected_country.value == null){
        valid = false;
        useToast().error("Please select a country");
    } else{
        userInfo.value.countryId = selected_country.value;
    }
    if (selected_ethnicity.value == null){
        valid = false;
        useToast().error("Please select an ethnicity")
    } else {
        userInfo.value.ethnicityId = selected_ethnicity.value;
    }
    console.log(selected_gender.value);
    if (selected_gender.value == null){
        valid = false;
        useToast().error("Please select a gender")  
    } else {
        userInfo.value.gender = selected_gender.value;
    }

    if (document.getElementById('age').value == ''){
        valid = false;
        useToast().error("Please enter an age")
    } else {
        userInfo.value.age = parseInt(document.getElementById('age').value);
    }

    if (document.getElementById('weight').value == ''){
        valid = false;
        useToast().error("Please enter a weight")
    } else {
        userInfo.value.weight = parseInt(document.getElementById('weight').value);
    }

    if (document.getElementById('height').value == ''){
        valid = false;
        useToast().error("Please enter a height")
    } else {
        userInfo.value.height = parseInt(document.getElementById('height').value);
    }
    return valid;
}

function validateSectionTwo(){

    let valid = true;

    if (selected_dietary.value == null){
        valid = false;
        useToast().error("Please select a dietary")
    } else {
        userInfo.value.dietaryId = selected_dietary.value;
    }

    userAllergies.value = selected__allergies.value;
    
    if (selected_nyha.value == null){
        valid = false;
        useToast().error("Please select an NYHA Classification")
    } else {
        userInfo.value.nyhaLevel = parseInt(selected_nyha.value);
    }

    if(document.querySelector('input[name="warfarin"]:checked') == null){
        valid = false;
        useToast().error("Please select if you are currently taking Warfarin")
    } else {
        const value = document.querySelector('input[name="warfarin"]:checked').value;
        userInfo.value.medicalInfo = JSON.stringify({warfarin: value});
    }

    return valid;

}

function validSectionThree(){

    let valid = true;

    if (selected_activity_level.value == null){
        valid = false;
        useToast().error("Please select an activity level")
    } else {
        userInfo.value.userNutritionSetting.activityLevel = parseInt(selected_activity_level.value);
    }

    if (parseInt(nutrientTotal.value) != 100 ){
        valid = false;
        useToast().error("Nutrient total must add up to 100%")
    } else {
        userInfo.value.userNutritionSetting.carbsPercentage = parseInt(carbsPercentage.value)/100;
        userInfo.value.userNutritionSetting.proteinPercentage = parseInt(proteinPercentage.value)/100;
        userInfo.value.userNutritionSetting.fatPercentage = parseInt(fatPercentage.value)/100;
    }

    if (document.querySelector('input[name="cholesterol-level"]:checked') == null){
        valid = false;
        useToast().error("Please select a cholesterol level")
    } else {
        userInfo.value.userNutritionSetting.cholesterolLevel = document.querySelector('input[name="cholesterol-level"]:checked').value;
    }

    return valid;
}

async function signUp(){
    if (! validSectionThree()){
        return;
    }
    try {
        const response = await $axios.post('/user/signup', userInfo.value,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
        });   

    } catch (error) {
        useToast().error("An error occurred while creating account");
        return;
    }

    try{
         if( userAllergies.value.length > 0){
            const response = await $axios.post('/user_allergy/add', {
                foodCatIds: userAllergies.value
            },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            
            if (response.data.status != 200){
                useToast().error("An error occurred while creating account");
                return;
            }
        }
    } catch (error) {
        console.log(error);
        useToast().error("An error occurred while setting user allergies");   
    }

    useToast().success("Account created successfully");
    await navigateTo('/home');
}





</script>


<style scoped>
    .logo{
        height:100vh;
        position: absolute;
        top: 0;
        left: 0;
        }

    .header{
        position: absolute;
        top: 15%;
        right: 18%;
        font-size: 2rem;
        font-weight: bold;
        text-align: center;
    }

    .container{
        position: absolute;
        top: 15%;
        right: 10%;
        width: 30%;
        height: 70%;
    }

    .container h1{
        font-size: 2rem;
        font-weight: bold;
        text-align: center;
    }

    .form{
        margin-top: 5%;
        width: 100%;
        height: 92%;
        border-radius: 10px;
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
        background-color: #e4d6c0;
    }

    .section{
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        row-gap: 0;
    }

    .input-container{
        margin-left: 10%;
        margin-bottom: 3%;
        width: 80%;
        align-items: left;
    }

    .input-container label{
        font-size: 1rem;
        font-weight: bold;
        margin-bottom: 10px;
    }


    .from-input-box{
        width: 100%;
        height: 65%;
        border-radius: 5px;
        border: 1px solid #ccc;
        box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.1);
        padding: 5px;
        background-color: #fefef1;
    }

    .radio-group{
        display: flex;
        flex-direction: row;
        justify-content:space-around;
        margin-top: 2.5%;
    }

    .radio{
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .radio input{
        margin-right: 5px;
        box-shadow: none;        
    }

    .radio label{
        font-size: .8rem;
        font-weight: bold;
        padding: 0;
        margin:0;
    }

    .range-slider{
        margin-left: 5%;
        display: flex;
        flex-direction: row;
        align-items: center;
        width: 100%;
    }

    .range-slider span{
        margin-left: 5%;
        width: 20%;
        font-weight: bold;
        font-size: 0.8rem;
    }

    .slider{
        -webkit-appearance: none;
        appearance: none;
        width: 80%;
        border-radius: 20px;
    }

    .slider::-webkit-slider-runnable-track{
        width: 100%;
        height: 5px;
        cursor: pointer;
        animate: 0.2s;
        box-shadow: 0px 0px 0px #000000;
        background: #fefef1;
        border-radius: 20px;
    }

    .slider::-webkit-slider-thumb{
        box-shadow: 0px 0px 0px #000000;
        margin-top: -5px;
        height: 15px;
        width: 15px;
        border-radius: 50px;
        background: #FFA17A;
        cursor: pointer;
        -webkit-appearance: none;
    }

   .nutrient-text-input{
        width: 12%;
        height: 100%;
        margin-left: 2%;
        margin-right: 2%;
        border-radius: 5px;
        border: 1px solid #ccc;
        box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.1);
        background-color: #fefef1;
        text-align: center;
        font-size: 1rem;
   }
    
    .nutrient-total-container{
        margin-left: 15%;
        display: flex;
        flex-direction: column;
    }

    .nutrient-total{
        font-size: 0.8rem;
        font-weight: 500;
    }

    .nutrient-total-message{
        font-size: 0.8rem;
        font-weight: bold;
        color: red;
    }   

    .button-back{
        margin-top: 5%;
        margin-bottom: 4%;
        margin-left: 5%;
        width: 15%;
        height: 6%;
        border-radius: 5px;
        border: 1px solid #ccc;
        box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.1);
        padding: 5px;
        background-color: #FFA17A;
        color: #993300;
        text-align: center;
        align-content: center;
        font-size: 1rem;
        font-weight: bold;
    }

    .button-next{
        margin-left: 10%;
        width: 80%;
        height: 7%;
        border-radius: 5px;
        border: 1px solid #ccc;
        box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.1);
        padding: 5px;
        background-color: #FFA17A;
        color: #993300;
        text-align: center;
        align-content: center;
        font-size: 1rem;
        font-weight: bold;
    }
    
    .button-back:hover,
    .button-next:hover{
        background-color: #E5946B;
        cursor: pointer;
    }
</style>