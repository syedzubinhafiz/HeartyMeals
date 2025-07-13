<template>
  <div class="auth-layout">
    <!-- Logo Section - Hidden on mobile, visible on desktop -->
    <div class="logo-section">
      <img src="@/assets/img/HeartyMealLargeLogo.svg" alt="Hearty Meal" class="logo-image">
    </div>
    
    <!-- Mobile Logo - Only visible on mobile -->
    <div class="mobile-logo">
      <img src="@/assets/img/HeartyMealLargeLogo.svg" alt="Hearty Meal">
    </div>
    
    <!-- Form Section -->
    <div class="form-section">
      <img src="@/assets/img/GreenCurve.png" class="curve-decoration" alt="Green Curve Decor">
      <img src="@/assets/img/brownBlob.svg" class="blob-decoration" alt="Brown Blob Decor">
      
      <div class="form-container">
        <div class="form-card">
          <H1>Complete Your Profile</H1>
          
          <!-- Progress Indicator -->
          <div class="progress-container">
            <div class="progress-step" :class="{ active: section_one }">1</div>
            <div class="progress-line" :class="{ completed: section_two || section_three }"></div>
            <div class="progress-step" :class="{ active: section_two, completed: section_three }">2</div>
            <div class="progress-line" :class="{ completed: section_three }"></div>
            <div class="progress-step" :class="{ active: section_three }">3</div>
          </div>

          <div class="form-sections">
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
/* =================================== */
/*        RESPONSIVE AUTH LAYOUT        */
/* =================================== */

.auth-layout {
  display: flex;
  min-height: 100vh;
  position: relative;
}

/* Desktop Layout */
@media (min-width: 768px) {
  .auth-layout {
    flex-direction: row;
  }
  
  .logo-section {
    display: flex;
    width: 40%;
    background: #015B59;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }
  
  .logo-image {
    max-width: 280px;
    width: 100%;
    height: auto;
  }
  
  .mobile-logo {
    display: none;
  }
  
  .form-section {
    width: 60%;
    position: relative;
    background: #DAC2A8;
  }
}

/* Mobile Layout */
@media (max-width: 767px) {
  .auth-layout {
    flex-direction: column;
  }
  
  .logo-section {
    display: none;
  }
  
  .mobile-logo {
    display: flex;
    justify-content: center;
    padding: 1.5rem 1rem 1rem;
    background: #015B59;
  }
  
  .mobile-logo img {
    max-width: 200px;
    width: 80%;
    height: auto;
  }
  
  .form-section {
    flex: 1;
    background: #DAC2A8;
    position: relative;
  }
}

/* =================================== */
/*           DECORATIVE ELEMENTS        */
/* =================================== */

.curve-decoration {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  object-fit: cover;
  z-index: 1;
}

.blob-decoration {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 320px;
  height: 320px;
  object-fit: cover;
  object-position: 220px 120px;
  z-index: 1;
}

@media (max-width: 767px) {
  .curve-decoration {
    display: none;
  }
  
  .blob-decoration {
    width: 200px;
    height: 200px;
    opacity: 0.6;
  }
}

/* =================================== */
/*            FORM CONTAINER           */
/* =================================== */

.form-container {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  padding: 2rem 1rem;
}

@media (max-width: 767px) {
  .form-container {
    padding: 1rem;
    align-items: flex-start;
    padding-top: 2rem;
  }
}

.form-card {
  background: #F3EADA;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 520px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-height: 85vh;
  overflow-y: auto;
}

@media (max-width: 767px) {
  .form-card {
    padding: 1.5rem;
    margin: 0;
    border-radius: 12px;
    max-width: none;
    gap: 1.25rem;
    max-height: none;
  }
}

/* =================================== */
/*          PROGRESS INDICATOR         */
/* =================================== */

.progress-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1rem 0;
  gap: 0.5rem;
}

.progress-step {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #d1d5db;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
  transition: all 0.3s ease;
}

.progress-step.active {
  background: #015B59;
  color: white;
}

.progress-step.completed {
  background: #83BBBE;
  color: white;
}

.progress-line {
  width: 40px;
  height: 2px;
  background: #d1d5db;
  transition: all 0.3s ease;
}

.progress-line.completed {
  background: #83BBBE;
}

/* =================================== */
/*              FORM STYLES            */
/* =================================== */

.form-sections {
  min-height: 400px;
}

.section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.input-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.5rem;
  width: 100%;
}

.input-container label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  align-self: flex-start;
}

.from-input-box {
  width: 100%;
  max-width: 400px;
  min-height: 44px;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background-color: white;
  font-size: 14px;
  transition: border-color 0.2s ease;
}

.from-input-box:focus {
  outline: none;
  border-color: #83BBBE;
  box-shadow: 0 0 0 3px rgba(131, 187, 190, 0.1);
}

@media (max-width: 767px) {
  .from-input-box {
    font-size: 16px;
  }
}

/* Radio Groups */
.radio-group {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 0.5rem;
}

.radio {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.radio input {
  margin: 0;
  accent-color: #83BBBE;
}

.radio label {
  font-size: 14px;
  font-weight: normal;
  margin: 0;
  cursor: pointer;
}

/* Range Sliders */
.range-slider {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 0.5rem;
}

.slider {
  flex: 1;
  height: 6px;
  background: #d1d5db;
  border-radius: 3px;
  outline: none;
  -webkit-appearance: none;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  background: #015B59;
  border-radius: 50%;
  cursor: pointer;
}

.slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  background: #015B59;
  border-radius: 50%;
  cursor: pointer;
  border: none;
}

.nutrient-text-input {
  width: 80px;
  min-height: 36px;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background-color: white;
  text-align: center;
  font-size: 14px;
}

.nutrient-total-container {
  padding: 1rem;
  background: rgba(131, 187, 190, 0.1);
  border-radius: 8px;
  margin-top: 1rem;
}

.nutrient-total {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.nutrient-total-message {
  font-size: 12px;
  font-weight: 600;
  color: #dc2626;
  margin-top: 0.25rem;
}

/* Buttons */
.button-back {
  align-self: flex-start;
  background: #6b7280;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  min-height: 44px;
}

.button-back:hover {
  background: #4b5563;
}

.button-next {
  background: #015B59;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  min-height: 44px;
  width: 100%;
  margin-top: 1rem;
}

.button-next:hover {
  background: #3a7b70;
  transform: translateY(-1px);
}

@media (max-width: 767px) {
  .button-back,
  .button-next {
    font-size: 16px;
    padding: 14px 24px;
  }
}

/* =================================== */
/*           RESPONSIVE FORM           */
/* =================================== */

@media (max-width: 767px) {
  :deep(h1) {
    font-size: 1.75rem;
    text-align: center;
  }
  
  .radio-group {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .range-slider {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }
  
  .nutrient-text-input {
    width: 100px;
    align-self: center;
  }
}

/* =================================== */
/*            ACCESSIBILITY            */
/* =================================== */

.button-back:focus,
.button-next:focus {
  outline: 2px solid #83BBBE;
  outline-offset: 2px;
}

@media (prefers-contrast: high) {
  .from-input-box,
  .nutrient-text-input {
    border-width: 2px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .button-next,
  .progress-step,
  .progress-line {
    transition: none;
  }
  
  .button-next:hover {
    transform: none;
  }
}
</style>