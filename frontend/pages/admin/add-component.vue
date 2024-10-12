<template>
    <div class="absolute w-screen z-40" style="z-index: 10">
        <AdminHeader/>
    </div>

    <div style="padding-top: 7%; padding-left: 5%;">
        <ButtonOrange  @click="navigateTo('/admin')">
            <img src="~/assets/icon/Back_Icon.svg" alt="Back Icon" style="width: 20px; height: 20px; margin-right: 8px;"/>
            Back
        </ButtonOrange>
    </div>

    <h1 class="title">Add Component</h1>

    <div class="content-container">
        <form class="form-format" @submit.prevent>
            <!-- Name -->
            <div class="form-group">
                <label class="form-label-format" for="name">Name</label>
                <div></div>
                <input type="text" id="name" class="form-normal-text-input" placeholder="Enter component name"/>
            </div>
            
            <!-- Thumbnail -->
            <div  style="grid-row: span 4;">
                <div 
                class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50" 
                style="padding: 25%;"
                @click="triggerFileInput" 
                v-if="!imageUrl"
                >
                    <input type="file" @change="handleFileUpload" class="hidden" ref="fileInput" accept="image/*"/>
                    <p class="text-gray-500">Upload Thumbnail</p>
                </div>

                <!-- Display the selected image -->
                <div v-else class="text-center">
                    <img :src="imageUrl" alt="Selected Image" class="w-72 h-72 object-cover rounded-lg mx-auto" />
                    <button @click="removeImage" class="mt-4 bg-red-500 text-white rounded-lg px-4 py-2 hover:bg-red-600">
                        Remove
                    </button>
                </div>
            </div>

            <!-- Amount -->
            <div class="form-group">
                <label class="form-label-format" for="amount">Amount</label>
                <div></div>
                <div style="display: grid; grid-template-columns: 50% 47%; column-gap: 3%; align-items: center;">
                    <input type="number" id="amount" class="form-normal-text-input" placeholder="Enter Amount" min="1" step="0.01"/>
                    <SingleSelectionDropdown
                    :items="measuring_unit_dropdown_option"
                    @update:modelValue="updateSelectedUnit($event)"
                    defaultText="Unit"
                    buttonStyle="background-color: rgba(255, 255, 255, 0.8); border: 1.5px solid #8B8585; border-radius: 5px; width: 100%; z-index: 10;"
                    dropdownStyle="background-color: rgb(253, 251, 248); border: 1.5px solid #8B8585; border-radius: 5px; overflow-y: auto; max-height: 200px; width: 100%; z-index: 25;"
                    /> 
                </div>
            </div>

            <!-- Component Type  Dropdown-->
            <div class="form-group">
                <label class="form-label-format" for="component-type">Component Type</label>
                <div></div>
                <SingleSelectionDropdown
                    :items="component_type_dropdown_option"
                    @update:modelValue="updateSelectedComponentType($event)"
                    defaultText="Component Type"
                    buttonStyle="background-color: rgba(255, 255, 255, 0.8); border: 1.5px solid #8B8585; border-radius: 5px; width: 100%; z-index: 10;"
                    dropdownStyle="background-color: rgb(253, 251, 248); border: 1.5px solid #8B8585; border-radius: 5px; overflow-y: auto; max-height: 200px; width: 100%; z-index: 25;"
                />
            </div>

            <!-- Food Category -->
            <div class="form-group">
                <label class="form-label-format" for="food-category">Food Category</label>
                <div></div>
                <SingleSelectionWSearchbarDropdown
                    :items="food_category_dropdown_option"
                    defaultText="Choose a category"
                    buttonStyle="background-color: rgba(255, 255, 255, 0.8); border: 1.5px solid #8B8585; border-radius: 5px;"
                    dropdownStyle="background-color: rgb(253, 251, 248); border: 1.5px solid #8B8585; border-radius: 5px; overflow-y: auto; max-height: 200px; width: 100%; z-index: 25;"
                    @item-selected="updateSelectedFoodCategory($event)"
                />
            </div>


            <!-- Nutrition Info -->
            <div class="form-group" style="grid-column:span 2; grid-template-rows: 10% 90%; grid-gap: 15px; margin-right: 2.5%;">
                <label class="form-label-format" style="grid-column: span 3;">Nutrition Info</label>
                <div class="form-normal-text-input" style="grid-column: span 3; overflow: auto; height: 400px; padding-top: 2.5%;">
                    <div style="display: grid; grid-template-columns: repeat(2, 50%); grid-gap: 30px; padding-left: 7%;">
                        <div v-for="item in nutrition_label_lists" :key="item.display" :id="item.id" class="nutrition-group">
                            <label class="form-label-format">{{item.display}}</label>
                            <div></div>
                            <input type="number" class="form-normal-text-input" placeholder="Enter value" />
                            <p class="nutrition-unit-format">{{ item.unit }}</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Add Button  -->
            <div style="grid-column: span 2; display: flex; align-items: center; justify-content: center;">
                <button type="submit" class="submit-button" @click="gatherComponentData">Add Component</button>
            </div>
        </form>
    </div>

    <!-- Loading Spinner -->
    <div v-if="isLoading" class="loading-overlay">
        <div class="spinner"></div>
    </div>


</template>

<script setup>
import { ref } from 'vue';
import SingleSelectionDropdown from '~/components/Dropdown/SingleSelectionDropdown.vue';
import SingleSelectionWSearchbarDropdown from '~/components/Dropdown/SingleSelectionWSearchBarDropdown.vue';
import { useNuxtApp } from '#app';
import { NutritionLabelList } from '~/assets/template/nutritionLabel';
import { useToast } from 'vue-toast-notification';

defineOptions({
  name: "Add Component",
});

definePageMeta({
  layout: "emptylayout",
    middleware: ["auth"],

});

const { $axios } = useNuxtApp();

const component_type_dropdown_option = ref([
  { id: 'Ingredient', display: 'Ingredient' },
  { id: 'Seasoning', display: 'Seasoning' },
]);

const nutrition_label_lists = ref(NutritionLabelList);
const fileInput = ref(null);
const imageUrl = ref(null);


const measuring_unit_dropdown_option = ref([]);
const food_category_dropdown_option = ref([]);

const selected_component_type = ref(null);
const selected_food_category = ref(null);
const selected_unit = ref(null);

const isLoading = ref(false)

const fileDetails = ref({
  fileName: null,
  fileType: null,
  fileDataInBase64: null,
});


// Fetch data from the backend
try {
  const token = localStorage.getItem('accessToken');
  const measuring_unit_response = await $axios.get('/component/measuring-units', {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });

  // Transform the response data
  const measuringUnitDropdownOptions = Object.entries(measuring_unit_response.data).map(([key, value]) => ({
    id: value,
    display: value
  }));

  // Save the transformed data
  measuring_unit_dropdown_option.value = measuringUnitDropdownOptions;

  const food_category_response = await $axios.get('/food_category/get', {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });

  food_category_response.data.forEach(food_category => {
    food_category_dropdown_option.value.push({
        id: food_category.id,
        display: food_category.type
        });
    });

} catch (error) {
  console.error('Error fetching data:', error);
}

//

const updateSelectedUnit= (id) => {
  selected_unit.value = id;
}

const updateSelectedFoodCategory = (id) => {
    console.log(id);
    selected_food_category.value = id;
}

const updateSelectedComponentType = (id) => {
    selected_component_type.value = id;
}

// Thumbnail upload
const triggerFileInput = () => {
  fileInput.value.click();
};


const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      fileDetails.value = {
        fileName: file.name,
        fileType: file.type,
        fileDataInBase64: e.target.result.split(',')[1],
      };
      imageUrl.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const removeImage = () => {
  fileDetails.value = {
    fileName: null,
    fileType: null,
    fileDataInBase64: null,
  };
  imageUrl.value = null;
};



const validateForm = () => {
  let isValid = true;

  // Check if name is empty
  if (!document.getElementById('name').value) {
    useToast().error("Name is required");
    isValid = false;
  }

  if (!document.getElementById('amount').value) {
    useToast().error("Amount is required");
    isValid = false;
  }

  // Check if amount unit is selected
  if (!selected_unit.value) {
    useToast().error("Amount's unit is required");
    isValid = false;
  }

  // Check if food category is selected
  if (!selected_food_category.value) {
    useToast().error("Food category is required");
    isValid = false;
  }

  // Check if component type is selected
  if (!selected_component_type.value) {
    useToast().error("Component type is required");
    isValid = false;
  }

  return isValid;
};
  
const gatherComponentData = async () => {
  if (!validateForm()) {
    return;
  }

  isLoading.value = true; // Show loading indicator



  const nutritionInformation = {};
  nutrition_label_lists.value.forEach(item => {
    const input = document.getElementById(item.id).querySelector('input');
    if (input) {
      nutritionInformation[item.id] = parseFloat(input.value) || 0;
    }
  });

  const component_data = {
    component:{

      name: document.getElementById('name').value,
      amount: parseFloat(document.getElementById('amount').value) || 0,
      nutritionInformation,
      unit: selected_unit.value,
      foodCategoryId: selected_food_category.value,
      componentType: selected_component_type.value,
    },
    files: {
      thumbnail: fileDetails.value,
    },
  };

  try {
    const token = localStorage.getItem('accessToken');
    const response = await $axios.post('/component/add', component_data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
    if (response.data.status === 200) {
      useToast().success("Component added successfully!");
    }
  } catch (error) {
    if (error.response && error.response.data.status === 400) {
      useToast().error("Failed to add component");
    } else {
      useToast().error("An unexpected error occurred");
    }
  } finally {
    isLoading.value = false; // Hide loading indicator
  }
};

</script>



<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Overpass:wght@400;700&display=swap');

* {
    font-family: 'Overpass', sans-serif;
}

.content-container {
    padding: 20px;
    margin: 0 15%;
    background-color: #F3EADA;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.title {
    align-self: center;
    font-size: 36px;
    font-weight: bold;
    color: #333;
    margin-bottom: 20px;
    padding-top: 0.5vh;
}

.form-format {
    display: grid;
    padding: 2.5% 2.5%;
    grid-template-columns: 1fr 1fr;
    column-gap: 40px;
    row-gap: 28px;
}

.form-group {
    display: grid;
    grid-template-columns: 30% 30% 40%;
    margin-bottom: 15px;
}

.nutrition-group {
    display: grid;
    max-width: 80%;
    grid-template-columns: 60% 10% 15% 15%;
    margin-bottom: 15px;
}

.nutrition-unit-format{
    font-family: 'Overpass', sans-serif;
    font-weight: 600; /* SemiBold */
    font-size: 15px;
    align-self: center;
    margin-left: 5px;
    letter-spacing: normal; /* Auto */
    text-transform: none; /* No text transformation */
    text-align: left;
}

.form-normal-text-input {
    width: 100%;
    padding: 5px;
    margin-top: 5px;
    background-color: rgba(255, 255, 255, 0.8);
    border: 1.5px solid #8B8585;
    border-radius: 5px;
}

.form-label-format {
    font-family: 'Overpass', sans-serif;
    font-weight: 600; /* SemiBold */
    font-size: 20px;
    align-self: center;
    letter-spacing: normal; /* Auto */
    text-transform: none; /* No text transformation */
    text-align: left; /* Left align */
}


.submit-button{
    width:fit-content;
    border-radius: 5px;
    padding: 10px 10px;
    background-color:  #FFA17A;
    color: #993300;
}

.submit-button:hover{
    background-color: #E5946B;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.spinner {
  border: 16px solid #f3f3f3;
  border-top: 16px solid #3498db;
  border-radius: 50%;
  width: 120px;
  height: 120px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>