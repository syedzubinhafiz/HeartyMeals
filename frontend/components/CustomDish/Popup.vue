<template>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <div v-if="isPopupOpen" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex w-full h-full items-center justify-center" @click.self="close">
        <Overlay class="overlay">
            <!-- Custom Recipe -->
            <h1 class="title">Create Custom Recipe</h1>
            <!-- Close Pop Up Button -->
            <div>
                <button @click="close" class="close-button" >
                    <i class="bi bi-x text-3xl"></i>
                </button>
            </div>
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
                                <label><input type="checkbox" id="Custom-Recipe-Breakfast" value="Breakfast" class="large-checkbox"/> Breakfast</label>
                                <label><input type="checkbox" id="Custom-Recipe-Lunch" value="Lunch" class="large-checkbox"/> Lunch</label>
                                <label><input type="checkbox" id="Custom-Recipe-Dinner" value="Dinner" class="large-checkbox"/> Dinner</label>
                                <label><input type="checkbox" id="Custom-Recipe-Other" value="Other" class="large-checkbox"/> Other</label>
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
                            <div class="selected-components-container">
                                <h3 class="selected-components-title">Selected Ingredients ({{ selectedIngredients.length }})</h3>
                                
                                <!-- Empty state message -->
                                <div v-if="selectedIngredients.length === 0" class="empty-state-message" @click.stop>
                                    <p>No ingredients selected yet. Click the "Add Ingredient" button above to start building your custom dish!</p>
                                </div>
                                
                                <!-- Selected ingredients list -->
                                <div v-else class="selected-components-list">
                                    <div v-for="ingredient in selectedIngredients" :key="ingredient.id" class="selected-component-item">
                                        <img :src="ingredient.storage_links.thumbnail" :alt="ingredient.name" class="w-20 h-20 mr-2" />
                                        <p class="selected-item-name">{{ ingredient.name }}</p>
                                        <input type="number" v-model="ingredient.serving" class="form-normal-text-input small-serving-input" placeholder="Enter Serving Size" min="1" step="0.01" />
                                        <SingleSelectionDropdown
                                            :items="measuring_unit_dropdown_option"
                                            @update:modelValue="ingredient.selectedUnit = $event"
                                            defaultText="Unit"
                                            buttonStyle="background-color: rgba(255, 255, 255, 0.8); border: 1.5px solid #8B8585; border-radius: 5px; width: 100%; z-index: 10;"
                                            dropdownStyle="background-color: rgb(253, 251, 248); border: 1.5px solid #8B8585; border-radius: 5px; overflow-y: auto; overflow-x: hidden; max-height: 150px; width: 100%; z-index: 25;"
                                        />
                                        <button class="remove-component-button" @click="removeIngredient(ingredient.id)">-</button>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <!-- Seasoning Display -->
                        <div class="form-group">
                            <div class="selected-components-container">
                                <h3 class="selected-components-title">Selected Seasonings ({{ selectedSeasonings.length }})</h3>
                                
                                <!-- Empty state message -->
                                <div v-if="selectedSeasonings.length === 0" class="empty-state-message" @click.stop>
                                    <p>No seasonings selected yet. Click the "Add Seasoning" button above to add flavor to your custom dish!</p>
                                </div>
                                
                                <!-- Selected seasonings list -->
                                <div v-else class="selected-components-list">
                                    <div v-for="seasoning in selectedSeasonings" :key="seasoning.id" class="selected-component-item">
                                        <img :src="seasoning.storage_links.thumbnail" :alt="seasoning.name" class="w-20 h-20 mr-2" />
                                        <p class="selected-item-name">{{ seasoning.name }}</p>
                                        <input type="number" v-model="seasoning.serving" class="form-normal-text-input small-serving-input" placeholder="Enter Serving Size" min="0" step="0.01" />
                                        <SingleSelectionDropdown
                                            :items="measuring_unit_dropdown_option"
                                            @update:modelValue="seasoning.selectedUnit = $event"
                                            defaultText="Unit"
                                            buttonStyle="background-color: rgba(255, 255, 255, 0.8); border: 1.5px solid #8B8585; border-radius: 5px; width: 100%; z-index: 10;"
                                            dropdownStyle="background-color: rgb(253, 251, 248); border: 1.5px solid #8B8585; border-radius: 5px; overflow-y: auto; overflow-x: hidden; max-height: 150px; width: 100%; z-index: 25;"
                                        />
                                        <button class="remove-component-button" @click="removeSeasoning(seasoning.id)">-</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        
                        <!-- Instruction -->
                        <div class="form-group" style="grid-column:span 2; grid-template-rows: 20% 80%; grid-gap: 15px; margin-right: 2.5%;">
                            <label class="form-label-format" style="grid-column: span 3;" >Instruction</label>
                            <div class="form-normal-text-input" style="grid-column: span 3; padding-bottom: 7%;">
                                <!-- TODO: Put your rich text editior here -->
                                <TinyMCE ref="tinymceComponent"/>
                            </div>
                        </div>

                                    <!-- Add Button  -->
                        <div style="grid-column: span 2; display: flex; align-items: center; justify-content: center;">
                            <button type="submit" class="submit-button" @click="gatherRecipeData">Add Recipe</button>
                        </div>
                    </form>

                

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

            </div>
        </Overlay>
    </div>

</template>
<script setup>
import { ref, computed } from 'vue';
import SingleSelectionDropdown from '~/components/Dropdown/SingleSelectionDropdown.vue';
import AddComponentPopup from '~/components/AddComponentPopup.vue';
import { useNuxtApp } from '#app';
import { NutritionLabelList } from '~/assets/template/nutritionLabel';
import { useToast } from 'vue-toast-notification';
defineOptions({
	name: "CustomDishPopup",
});

const props = defineProps({
  isPopupOpen: {
      type: Boolean,
      default: false
  },
})

const emits = defineEmits(["close"]);

const close = () => {
  emits('close');
};

definePageMeta({
  layout: "emptylayout",
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
  const mealTimes = ['Custom-Recipe-Breakfast', 'Custom-Recipe-Lunch', 'Custom-Recipe-Dinner', 'Custom-Recipe-Other'];
  const isMealTimeSelected = mealTimes.some(mealTime => document.querySelector(`input[id="${mealTime}"]`).checked);
  
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
    Breakfast: document.querySelector('input[id="Custom-Recipe-Breakfast"]').checked,
    Lunch: document.querySelector('input[id="Custom-Recipe-Lunch"]').checked,
    Dinner: document.querySelector('input[id="Custom-Recipe-Dinner"]').checked,
    Other: document.querySelector('input[id="Custom-Recipe-Other"]').checked,
  };

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
    }
  } catch (error) {
    if (error.response && error.response.data.status === 400) {
      useToast().error("Failed to add recipe");
    } else {
        console.log(error)
      useToast().error("An unexpected error occurred");
    }
  } finally {
    isLoading.value = false; // Hide loading indicator
    setTimeout(() => {
      emits('close');
    }, 1500);
  }
};




</script>

<style scoped lang="scss">

.overlay {
    width: 70%;
    height:90%;
    background-color: #F3EADA;
    border-radius: 20px;
    padding: 20px;
    overflow-y: auto;
    overflow-x: hidden;
    max-height: 90%;
    max-width: 70%;
    position: relative;
    z-index: 100;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
}

.title {
    align-self: center;
    font-size: 36px;
    font-weight: bold;
    color: #333;
    margin-bottom: 20px;
    padding-top: 0.5vh;
}

.close-button {
    position: absolute;
    top: 5%;
    right: 5%;
}

.content-container {
    padding: 20px;
    margin:1%;
    background-color: #F3EADA;
    border-radius: 8px;
}

.form-format {
    display: grid;
    padding: 2.5% 2.5%;
    grid-template-columns: 1fr 1fr;
    column-gap: 50px;
    row-gap: 28px;
    align-items: start;
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
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin: 0.625rem 0;
    padding: 0.75rem;
    background-color: #FFFEF1;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
    border-radius: 20px;
    min-height: 60px;
    width: 100%;
    box-sizing: border-box;
}

.remove-component-button{
    font-family: 'Overpass', sans-serif;
    font-size: 28px;
    font-weight: 600;
    color: #dc3545;
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
}

.remove-component-button:hover {
    color: #c82333;
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

/* Selected Components Container Styles */
.selected-components-container {
    width: 100%;
    max-width: 100%;
    padding: 15px;
    margin-top: 5px;
    background-color: rgba(255, 255, 255, 0.8);
    border: 1.5px solid #8B8585;
    border-radius: 5px;
    min-height: 120px;
    cursor: default;
    box-sizing: border-box;
    grid-column: 1 / -1;
}

.selected-components-title {
    font-family: 'Overpass', sans-serif;
    font-weight: 600;
    font-size: 16px;
    color: #333;
    margin-bottom: 10px;
    padding-bottom: 8px;
    border-bottom: 1px solid #ddd;
    cursor: default;
    user-select: none;
}

.empty-state-message {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 60px;
    color: #666;
    font-style: italic;
    text-align: center;
    background-color: #f9f9f9;
    border-radius: 5px;
    border: 2px dashed #ddd;
    padding: 15px;
}

.empty-state-message p {
    margin: 0;
    font-size: 14px;
}

.selected-components-list {
    max-height: 300px;
    overflow-y: auto;
    overflow-x: hidden;
}

/* Override any collapsible/dropdown behavior */
.selected-components-container * {
    pointer-events: auto !important;
}

/* Remove any dropdown arrows */
.selected-components-container::after,
.selected-components-container::before {
    display: none !important;
}

/* Ensure no hover effects that suggest clickability */
.selected-components-container:hover {
    cursor: default !important;
}

.selected-components-title:hover {
    cursor: default !important;
}

/* Fix container sizing and scrolling */
.selected-components-container {
    overflow: hidden !important;
    max-width: 100% !important;
}

/* Responsive component item children */
.selected-component-item img {
    width: 4rem;
    height: 4rem;
    flex-shrink: 0;
    object-fit: cover;
    border-radius: 8px;
}

.selected-item-name {
    flex: 1;
    min-width: 0;
    margin-right: 0.5rem;
}

.selected-component-item input[type="number"], .small-serving-input {
    width: 8rem;
    flex-shrink: 0;
    font-size: 0.75rem;
}

.selected-component-item .dropdown-container,
.selected-component-item > div:has(button) {
    width: 6rem;
    flex-shrink: 0;
}

.remove-component-button {
    flex-shrink: 0;
    margin-left: 0.5rem;
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
</style>