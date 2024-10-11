<template>
    <div class="absolute w-screen z-40" style="z-index: 10">
        <Header/>
    </div>

    <div style="padding-top: 7%; padding-left: 5%;">
        <ButtonOrange  @click="navigateTo('/admin')">
            <img src="~/assets/icon/Back_Icon.svg" alt="Back Icon" style="width: 20px; height: 20px; margin-right: 8px;"/>
            Back
        </ButtonOrange>
    </div>

    <h1 class="title">Add Educational Content</h1>

    <div class="content-container">
        <form class="form-format" @submit.prevent>
            <!-- Title -->
            <div class="form-group">
              <label class="form-label-format" for="title">Title</label>
              <textarea 
                type="text" 
                id="title" 
                class="form-normal-text-input" 
                placeholder="Enter educational content title" 
                style="grid-column: span 2;"
                v-model="title"
                @input="updateTitleCount"
                maxlength="100">
              </textarea>
              <span class="char-count"></span>
              <span class="char-count">{{ titleCount }} characters remaining</span>
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

            <!-- Summary -->
            <div class="form-group" style="grid-row: span 3;">
                <label class="form-label-format" for="summary">Summary</label>
                <textarea 
                  id="summary" 
                  class="form-normal-text-input" 
                  placeholder="Enter summary" 
                  style="grid-column: span 2;"
                  v-model="summary"
                  @input="updateSummaryCount"
                  maxlength="300">
                </textarea>
                <span class="char-count"></span>
                <span class="char-count">{{ summaryCount }} characters remaining</span>
            </div>

            <!-- Visibility -->
            <div class="form-group">
                <label class="form-label-format" for="ingredients">Visibility</label>
                <SingleSelectionDropdown 
                :items="visibility_dropdown_option" 
                defaultText="Choose a visibility" 
                buttonStyle="background-color: rgba(255, 255, 255, 0.8); border: 1.5px solid #8B8585; border-radius: 5px;"
                dropdownStyle="background-color: rgb(253, 251, 248); border: 1.5px solid #8B8585; border-radius: 5px; z-index: 10; overflow-x:auto; height:120px;"
                @update:modelValue="updateSelectedVisibility($event)"
                style="grid-column: span 2;"
                >
                </SingleSelectionDropdown>
            </div>
            
            <!-- Instruction -->
            <div class="form-group" style="grid-column:span 2; grid-template-rows: 20% 80%; grid-gap: 15px; margin-right: 2.5%;">
                <label class="form-label-format" style="grid-column: span 3;" >Content</label>
                <div class="form-normal-text-input" style="grid-column: span 3; padding-bottom: 7%;">
                    <TinyMCE ref="tinymceComponent"/>
                </div>

            </div>
            
            <!-- Add Button  -->
            <div style="grid-column: span 2; ">
                <button type="submit" class="submit-button" @click="gatherEducationalContentData">Add Educational Content</button>
            </div>
        </form>
    </div>

    <!-- Loading Spinner -->
    <div v-if="isLoading" class="loading-overlay">
        <div class="spinner"></div>
    </div>

</template>
  
<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useNuxtApp } from '#app';
import { useToast } from 'vue-toast-notification';
import SingleSelectionDropdown from '~/components/Dropdown/SingleSelectionDropdown.vue';

defineOptions({
  name: "Add Recipe",
});

definePageMeta({
  layout: "emptylayout",
    middleware: ["auth"],

});

// reset form fields on page load
onMounted(() => {
  window.addEventListener('beforeunload', handleBeforeUnload);
  title.value = '';
  summary.value = '';
  titleCount.value = 100;
  summaryCount.value = 300;
});

// Function to handle beforeunload event
const handleBeforeUnload = (event) => {
  event.preventDefault();
  event.returnValue = ''; // This is required for the prompt to show in some browsers
};

// Remove event listener when the component is unmounted
onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload);
});

const { $axios } = useNuxtApp();

const visibility_dropdown_option = ref([
  { id: 'Public', display: 'Public' },
  { id: 'Unlisted', display: 'Unlisted' }
]);

const title = ref('');
const summary = ref('');
const titleCount = ref(100);
const summaryCount = ref(300);

const fileInput = ref(null);
const imageUrl = ref(null);
const fileDetails = ref({
  fileName: null,
  fileType: null,
  fileDataInBase64: null,
});

const tinymceComponent = ref(null);

const selected_visibility = ref(null);

const isLoading = ref(false)

const updateTitleCount = () => {
  titleCount.value = 100 - title.value.length;
};

const updateSummaryCount = () => {
  summaryCount.value = 300 - summary.value.length;
};

// for updating selected visibility, cuisine and dietary
const updateSelectedVisibility = (id) => {
  selected_visibility.value = id;
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
            fileDataInBase64: e.target.result.split(',')[1]
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



const validateForm = () => {
  let isValid = true;

  // Check if title is empty
  if (!document.getElementById('title').value) {
    useToast().error("Title is required");
    isValid = false;
  }

  // Check if summary is empty
  if (!document.getElementById('summary').value) {
    useToast().error("Summary is required");
    isValid = false;
  }

  // Check if visibility is selected
  if (!selected_visibility.value) {
    useToast().error("Visibility is required");
    isValid = false;
  }

  if (!fileDetails.value.fileDataInBase64) {
    useToast().error("Thumbnail is required");
    isValid = false;
  }

  if (!tinymceComponent.value.editorInstance.getContent()) {
    useToast().error("Content is required");
    isValid = false;
  }

  return isValid;
};

const gatherEducationalContentData = async () => {
  if (!validateForm()) {
    return;
  }

  isLoading.value = true; // Show loading indicator

  // get files
  const { paragraphsArray, file_upload_dto_array } = getInstruction();

  const educationalContentData = {
    educationalContent: {
      title: document.getElementById('title').value,
      summary: document.getElementById('summary').value,
      content: paragraphsArray, // Assuming instructions are handled separately
      visibility: selected_visibility.value,
    },
    files: {
        thumbnail: fileDetails.value,
        content: file_upload_dto_array
    }
  };

  try {
    const token = localStorage.getItem('accessToken');
    const response = await $axios.post('/education/add', educationalContentData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
    if (response.data.status === 200) {
      useToast().success("Educational content added successfully!");
    }
  } catch (error) {
    if (error.response && error.response.data.status === 400) {
      useToast().error("Failed to add educational content");
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

.form-normal-text-input {
    width: 100%;
    padding: 5px;
    margin-top: 5px;
    background-color: rgba(255, 255, 255, 0.8);
    border: 1.5px solid #8B8585;
    border-radius: 5px;
}

.char-count {
  display: block;
  margin-top: 5px;
  font-size: 0.9em;
  color: #666;
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
