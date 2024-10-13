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

    <h1 class="title">Add New Recipe</h1>

    <div class="content-container">
        <form class="form-format" @submit.prevent>
            <!-- Name -->
            <div class="form-group">
                <label class="form-label-format" for="name">Name</label>
                <div></div>
                <input type="text" id="name" class="form-normal-text-input" placeholder="Enter recipe name"/>
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

            <!-- Preparation Time -->
            <div class="form-group">
                <label class="form-label-format" for="prep-time">Preparation Time (in minutes)</label>
                <div></div>
                <input type="number" id="prep-time" class="form-normal-text-input" placeholder="Enter preparation time" min="1" step="0.01"/>
            </div>

            <!--Serving Size -->
            <div class="form-group">
                <label class="form-label-format" for="serving-size">Serving Size</label>
                <div></div>
                <input type="number" id="serving-size" class="form-normal-text-input" placeholder="Enter serving size" min="1" step="0.01"/>
            </div>

            <!-- Visibility -->
            <div class="form-group">
                <label class="form-label-format" for="ingredients">Visibility</label>
                <div></div>
                <SingleSelectionDropdown 
                :items="visibility_dropdown_option" 
                defaultText="Choose a visibility" 
                buttonStyle="background-color: rgba(255, 255, 255, 0.8); border: 1.5px solid #8B8585; border-radius: 5px;"
                dropdownStyle="background-color: rgb(253, 251, 248); border: 1.5px solid #8B8585; border-radius: 5px; z-index: 10; overflow-x:auto; height:200px;"
                @update:modelValue="updateSelectedVisibility($event)"
                >
                </SingleSelectionDropdown>
            </div>

            <!-- Cuisine -->
            <div class="form-group">
                <label class="form-label-format" for="cuisine">Cuisine</label>
                <div></div>
                <SingleSelectionDropdown
                    :items="cuisine_dropdown_option"
                    defaultText="Choose a cuisine"
                    buttonStyle="background-color: rgba(255, 255, 255, 0.8); border: 1.5px solid #8B8585; border-radius: 5px;"
                    dropdownStyle="background-color: rgb(253, 251, 248); border: 1.5px solid #8B8585; border-radius: 5px; z-index: 10; overflow-x:auto; height:200px;"
                    @update:modelValue="updateSelectedCuisine($event)"
                />
            </div>

            <!-- Description -->
            <div class="form-group" style="grid-row: span 3;">
                <label class="form-label-format" for="description">Description</label>
                <textarea id="description" class="form-normal-text-input" placeholder="Enter description" style="grid-column: span 2;"></textarea>
            </div>

            <!-- Dietary -->
            <div class="form-group">
                <label class="form-label-format" for="dietary">Dietary</label>
                <div></div>
                <SingleSelectionDropdown
                    :items="dietary_dropdown_option"
                    defaultText="Choose a dietary"
                    buttonStyle="background-color: rgba(255, 255, 255, 0.8); border: 1.5px solid #8B8585; border-radius: 5px;"
                    dropdownStyle="background-color: rgb(253, 251, 248); border: 1.5px solid #8B8585; border-radius: 5px; z-index: 10; overflow-x:auto; height:200px;"
                    @update:modelValue="updateSelectedDietary($event)"
                />
            </div>

            
            <!-- Recommended Meal Time -->
            <div class="form-group" style="display: grid; grid-template-columns: 1fr; ">
                <label class="form-label-format" style="padding-bottom: 15px;">Recommended Meal Time</label>
                <div class="checkbox-group-grid">
                    <label><input type="checkbox" value="Breakfast" class="large-checkbox"/> Breakfast</label>
                    <label><input type="checkbox" value="Lunch" class="large-checkbox"/> Lunch</label>
                    <label><input type="checkbox" value="Dinner" class="large-checkbox"/> Dinner</label>
                    <label><input type="checkbox" value="Other" class="large-checkbox"/> Other</label>
                </div>
            </div>


            <!-- Ingredient Header -->
            <div class="form-group" style="margin-top:50px; display: grid; grid-template-columns: 60% 40%; margin-bottom: 0px;">
                <label class="form-label-format">Ingredients</label>
                <ButtonOrange style="margin-left: 24%;" @click="openPopupIngredient">
                <img src="~/assets/icon/Add_Icon.svg" alt="Back Icon" style="width: 30px; height: 30px; margin-right: 2px; padding-bottom: 3px;"/>
                Add Ingredient
                </ButtonOrange>
            </div>

            <!-- Seasoning Header -->
            <div class="form-group" style="margin-top:50px; display: grid; grid-template-columns: 60% 40%; margin-bottom: 0px">
                <label class="form-label-format">Seasonings</label>
                <ButtonOrange style="margin-left: 24%;" @click="openPopupSeasoning">
                <img src="~/assets/icon/Add_Icon.svg" alt="Back Icon" style="width: 30px; height: 30px; margin-right: 2px; padding-bottom: 3px;"/>
                Add Seasoning
                </ButtonOrange>
            </div>

            <!-- Ingredient Display -->
            <div class="form-group">
            <CollapsibleSection :title="`Selected Ingredient (${selectedIngredients.length})`" style="grid-column: span 3; width: 100%;">
                <div v-for="ingredient in selectedIngredients" :key="ingredient.id" class="selected-component-item">
                <img :src="ingredient.storage_links.thumbnail" :alt="ingredient.name" class="w-20 h-20 mr-2" />
                <p class="selected-item-name">{{ ingredient.name }}</p>
                <input type="number" v-model="ingredient.serving" class="form-normal-text-input" placeholder="Enter Serving" min="1" step="0.01" />
                <SingleSelectionDropdown
                    :items="measuring_unit_dropdown_option"
                    @update:modelValue="ingredient.selectedUnit = $event"
                    defaultText="Unit"
                    buttonStyle="background-color: rgba(255, 255, 255, 0.8); border: 1.5px solid #8B8585; border-radius: 5px; width: 100%; z-index: 10;"
                    dropdownStyle="background-color: rgb(253, 251, 248); border: 1.5px solid #8B8585; border-radius: 5px; overflow-y: auto; max-height: 200px; width: 100%; z-index: 25;"
                />
                <button class="remove-component-button" @click="removeIngredient(ingredient.id)">-</button>
                </div>
            </CollapsibleSection>
            </div>


            <!-- Seasoning Display -->
            <div class="form-group">
            <CollapsibleSection :title="`Selected Seasoning (${selectedSeasonings.length})`" style="grid-column: span 3;">
                <div v-for="seasoning in selectedSeasonings" :key="seasoning.id" class="selected-component-item">
                <img :src="seasoning.storage_links.thumbnail" :alt="seasoning.name" class="w-20 h-20 mr-2" />
                <p class="selected-item-name">{{ seasoning.name }}</p>
                <input type="number" v-model="seasoning.serving" class="form-normal-text-input" placeholder="Enter Serving" min="0" step="0.01" />
                <SingleSelectionDropdown
                    :items="measuring_unit_dropdown_option"
                    @update:modelValue="seasoning.selectedUnit = $event"
                    defaultText="Unit"
                    buttonStyle="background-color: rgba(255, 255, 255, 0.8); border: 1.5px solid #8B8585; border-radius: 5px; width: 100%; z-index: 10;"
                    dropdownStyle="background-color: rgb(253, 251, 248); border: 1.5px solid #8B8585; border-radius: 5px; overflow-y: auto; max-height: 200px; width: 100%; z-index: 25;"
                />
                <button class="remove-component-button" @click="removeSeasoning(seasoning.id)">-</button>
                </div>
            </CollapsibleSection>
            </div>

            
            <!-- Instruction -->
            <div class="form-group" style="grid-column:span 2; grid-template-rows: 20% 80%; grid-gap: 15px; margin-right: 2.5%;">
                <label class="form-label-format" style="grid-column: span 3;" >Instruction</label>
                <div class="form-normal-text-input" style="grid-column: span 3; padding-bottom: 7%;">
                    <!-- TODO: Put your rich text editior here -->
                      <TinyMCE ref="tinymceComponent"/>
                </div>
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
                <button type="submit" class="submit-button" @click="gatherRecipeData">Add Recipe</button>
            </div>
        </form>
    </div>

    <!-- Loading Spinner -->
    <div v-if="isLoading" class="loading-overlay">
        <div class="spinner"></div>
    </div>
    
    <AddComponentPopup
      v-if="showPopupIngredient"
      :isVisible="showPopupIngredient"
      type="ingredient"
      :initialSelectedItems="selectedIngredients"
      @close="handleClosePopup"
    />

    <AddComponentPopup
      v-if="showPopupSeasoning"
      :isVisible="showPopupSeasoning"
      type="seasoning"
      :initialSelectedItems="selectedSeasonings"
      @close="handleClosePopup"
    />

</template>
  
<script setup>
import { ref } from 'vue';
import SingleSelectionDropdown from '~/components/Dropdown/SingleSelectionDropdown.vue';
import AddComponentPopup from '~/components/AddComponentPopup.vue';
import { useNuxtApp } from '#app';
import { NutritionLabelList } from '~/assets/template/nutritionLabel';
import { useToast } from 'vue-toast-notification';
import AdminHeader from '~/components/AdminHeader.vue';

defineOptions({
  name: "Add Recipe",
});

definePageMeta({
  layout: "emptylayout",
    middleware: ["auth"],

});

const { $axios } = useNuxtApp();

const visibility_dropdown_option = ref([
  { id: 'Public', display: 'Public' },
  { id: 'Private', display: 'Private' },
  { id: 'Unlisted', display: 'Unlisted' }
]);

const nutrition_label_lists = ref(NutritionLabelList);
const fileInput = ref(null);
const imageUrl = ref(null);

const showPopupIngredient = ref(false);
const showPopupSeasoning = ref(false);

const selectedIngredients = ref([]);
const selectedSeasonings = ref([]);
const selectedType = ref('');

const measuring_unit_dropdown_option = ref([]);
const cuisine_dropdown_option = ref([]);
const dietary_dropdown_option = ref([]);

const selected_visibility = ref(null);
const selected_cuisine = ref(null);
const selected_dietary = ref(null);

const isLoading = ref(false)

const fileDetails = ref({
  fileName: null,
  fileType: null,
  fileDataInBase64: null,
});

const tinymceComponent = ref(null);

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

  const cuisine_response = await $axios.get('/cuisine', {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });
  cuisine_response.data.forEach(cuisine => {
    cuisine_dropdown_option.value.push({ id: cuisine.id, display: cuisine.name });
  });

  const dietary_response = await $axios.get('/dietary', {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });

  dietary_response.data.forEach(dietary => {
    dietary_dropdown_option.value.push({ id: dietary.id, display: dietary.name });
  });

} catch (error) {
  console.error('Error fetching data:', error);
}

// for updating selected visibility, cuisine and dietary
const updateSelectedVisibility = (id) => {
  selected_visibility.value = id;
}

const updateSelectedCuisine = (id) => {
  selected_cuisine.value = id;
}

const updateSelectedDietary = (id) => {
  selected_dietary.value = id;
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

// For component popup
const openPopupIngredient = () => {
  showPopupIngredient.value = true;
};

const openPopupSeasoning = () => {
  showPopupSeasoning.value = true;
};

const handleClosePopup = ({ selectedItems, type }) => {
  if (type === 'ingredient') {
    selectedIngredients.value = selectedItems.map(item => ({
      ...item,
      serving: '',
      selectedUnit: ''
    }));
  } else if (type === 'seasoning') {
    selectedSeasonings.value = selectedItems.map(item => ({
      ...item,
      serving: '',
      selectedUnit: ''
    }));
  }
  selectedType.value = type;
  showPopupIngredient.value = false;
  showPopupSeasoning.value = false;
};

// for removing selected ingredient and seasoning
const removeIngredient = (id) => {
  selectedIngredients.value = selectedIngredients.value.filter(item => item.id !== id);
};

const removeSeasoning = (id) => {
  selectedSeasonings.value = selectedSeasonings.value.filter(item => item.id !== id);
};


const validateForm = () => {
  let isValid = true;

  // Check if name is empty
  if (!document.getElementById('name').value) {
    useToast().error("Name is required");
    isValid = false;
  }

  // Check if description is empty
  if (!document.getElementById('description').value) {
    useToast().error("Description is required");
    isValid = false;
  }

  // Check if preparation time is empty
    if (!document.getElementById('prep-time').value) {
        useToast().error("Preparation time is required");
        isValid = false;
    }

  // Check if serving size is empty
  if (!document.getElementById('serving-size').value) {
    useToast().error("Serving size is required");
    isValid = false;
  }

  // Check if visibility is selected
  if (!selected_visibility.value) {
    useToast().error("Visibility is required");
    isValid = false;
  }

  // Check if cuisine is selected
  if (!selected_cuisine.value) {
    useToast().error("Cuisine is required");
    isValid = false;
  }

  // Check if dietary is selected
  if (!selected_dietary.value) {
    useToast().error("Dietary is required");
    isValid = false;
  }

  // Check if at least one meal time is selected
  const mealTimes = ['Breakfast', 'Lunch', 'Dinner', 'Other'];
  const isMealTimeSelected = mealTimes.some(mealTime => document.querySelector(`input[value="${mealTime}"]`).checked);
  if (!isMealTimeSelected) {
    useToast().error("At least one meal time recommendation is required");
    isValid = false;
  }

  // Check if there is at least one component (either ingredient or seasoning)
  if (selectedIngredients.value.length === 0 && selectedSeasonings.value.length === 0) {
    useToast().error("At least one ingredient or seasoning is required");
    isValid = false;
  }

  // Check if ingredients and seasonings have serving and unit if they exist
  const checkComponents = (components, type) => {
    components.forEach(component => {
      if (!component.serving) {
        useToast().error(`${type} serving is required`);
        isValid = false;
      }
      if (!component.selectedUnit) {
        useToast().error(`${type} unit is required`);
        isValid = false;
      }
    });
  };

  if (selectedIngredients.value.length > 0) {
    checkComponents(selectedIngredients.value, "Ingredient");
  }

  if (selectedSeasonings.value.length > 0) {
    checkComponents(selectedSeasonings.value, "Seasoning");
  }

  // check if instruction is empty
  if (!tinymceComponent.value.editorInstance.getContent()) {
    useToast().error("Instruction is required");
    isValid = false;
  }

  return isValid;
};

const getInstruction = () => {
  // Simply log the current content from the editor
  const tempDiv = document.createElement('div');
  const editorInstance = tinymceComponent.value.editorInstance;
  const fileNames = tinymceComponent.value.fileNames;
  tempDiv.innerHTML = editorInstance.getContent();

  let index = 0; // Initialize an index for images/videos
  const file_upload_dto_array = []; // Array to store image/video sources in order

  // Loop through all child nodes in the content
  tempDiv.querySelectorAll('img, video').forEach((node) => {
    const regex = /^data:(.*?);base64,(.*)$/;
    if (node.nodeName === 'IMG') {
      const match = node.src.match(regex);
      const mimeType = match[1];
      const base64Data = match[2];

      // Store the original image src in the orderedSources array
      file_upload_dto_array.push({ fileName: fileNames[index], fileType: mimeType, fileDataInBase64: base64Data });
      
      // Replace the image src with the current index
      node.src = `${index}`; 
    } else if (node.nodeName === 'VIDEO') {
      const videoSource = node.querySelector('source');
      if (videoSource) {
        const match = videoSource.src.match(regex);
        const mimeType = match[1];
        const base64Data = match[2];

        // Store the original video source in the orderedSources array
        file_upload_dto_array.push({ fileName: fileNames[index], fileType: mimeType, fileDataInBase64: base64Data });
        
        // Replace the video src with the current index
        videoSource.src = `${index}`;
      }
    }
    index++; // Increment the index for each image/video
  });
  
  // Now convert each <p> element into a string and store it in an array
  const paragraphsArray = Array.from(tempDiv.querySelectorAll('p')).map(p => p.outerHTML);
  return { paragraphsArray, file_upload_dto_array };
};

const gatherRecipeData = async () => {
  if (!validateForm()) {
    return;
  }

  isLoading.value = true; // Show loading indicator

  const mealTimeRecommendation = {
    Breakfast: document.querySelector('input[value="Breakfast"]').checked,
    Lunch: document.querySelector('input[value="Lunch"]').checked,
    Dinner: document.querySelector('input[value="Dinner"]').checked,
    Other: document.querySelector('input[value="Other"]').checked,
  };

  const nutritionInformation = {};
  nutrition_label_lists.value.forEach(item => {
    const input = document.getElementById(item.id).querySelector('input');
    if (input) {
      nutritionInformation[item.id] = parseFloat(input.value) || 0;
    }
  });

  const components = [
    ...selectedIngredients.value.map(ingredient => ({
      componentId: ingredient.id,
      amount: parseFloat(ingredient.serving) || 0,
      unit: ingredient.selectedUnit || ''
    })),
    ...selectedSeasonings.value.map(seasoning => ({
      componentId: seasoning.id,
      amount: parseFloat(seasoning.serving) || 0,
      unit: seasoning.selectedUnit || ''
    }))
  ];

  const { paragraphsArray, file_upload_dto_array } = getInstruction();

  const recipeData = {
    recipe: {
      name: document.getElementById('name').value,
      preparationTime: String(parseFloat(document.getElementById('prep-time').value) || 0) + ' minutes',
      description: document.getElementById('description').value,
      instruction: paragraphsArray, // Assuming instructions are handled separately
      servingSize: parseFloat(document.getElementById('serving-size').value) || 0,
      nutritionInformation,
      mealTimeRecommendation,
      visibility: selected_visibility.value,
      cuisineId: selected_cuisine.value,
      dietaryId: selected_dietary.value
    },
    components,
    files: {
      thumbnail: fileDetails.value,
      content: file_upload_dto_array
    },
  };

  try {
    const token = localStorage.getItem('accessToken');
    const response = await $axios.post('/recipe/add', recipeData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
    if (response.data.status === 200) {
      useToast().success("Recipe added successfully!");
      window.location.reload();
    }
  } catch (error) {
    if (error.response && error.response.data.status === 400) {
      useToast().error("Failed to add recipe");
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


.checkbox-group-grid {
    display: grid;
    grid-template-columns:repeat(3, 1fr);
    gap: 10px;
}

.selected-component-item{
    display: grid;
    column-gap: 15px;
    margin: 10px;
    grid-template-columns: 15% 30% 10% 25% 10%;
    background-color: #FFFEF1;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
    border-radius: 20px;
    align-items: center;

}

.remove-component-button{
    font-family: 'Overpass', sans-serif;
    font-size:  35px;
    font-weight: 500;
    color:red;
}

.selected-item-name{
    font-family: 'Overpass', sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: #333;
}

.large-checkbox {
    width: 20px;
    height: 20px;
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
