
<template>
    <div class="absolute w-screen z-40" style="z-index: 10">
        <AdminHeader/>
    </div>

    <div style="padding-top: 7%; padding-left: 5%;">
        <ButtonOrange  @click="async () => await navigateTo('/admin')">
            <img src="~/assets/icon/Back_Icon.svg" alt="Back Icon" style="width: 20px; height: 20px; margin-right: 8px;"/>
            Back
        </ButtonOrange>
    </div>

    <h1 class="title">Add New Cuisine</h1>

    <div class="content-container">
        <form class="form-format" @submit.prevent>
            
            <!-- First Name -->
            <div class="form-group">
                <label class="form-label-format" for="name">Cuisine Name</label>
                <div></div>
                <input type="text" id="name" class="form-normal-text-input" placeholder="Name"/>
            </div>
            
            <div class="form-group">
                <label class="form-label-format" for="country">Country</label>
                <div></div>
                <SingleSelectionDropdownWithSearch
                  :items="country_dropdown_option"
                  @item-selected="selectedCountry = $event"
                  defaultText="Select a Country"
                  buttonStyle="background-color: rgba(255, 255, 255, 0.8); border: 1.5px solid #8B8585; border-radius: 5px; width: 100%; z-index: 10;"
                  dropdownStyle="background-color: rgb(253, 251, 248); border: 1.5px solid #8B8585; border-radius: 5px; overflow-y: auto; max-height: 200px; width: 100%; z-index: 25;"
                />
            </div>
            
            <!-- Add Button  -->
            <div style="grid-column: span 2; display: flex; align-items: center; justify-content: center;">
                <button type="submit" class="submit-button" @click="createNewCategory">Add Food Category</button>
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
import { useNuxtApp } from '#app';
import { useToast } from 'vue-toast-notification';
import SingleSelectionDropdownWithSearch from '~/components/Dropdown/SingleSelectionWSearchBarDropdown.vue';

defineOptions({
  name: "Add Food Category",

});

definePageMeta({
  layout: "emptylayout",
  middleware: ["auth"],

});

const { $axios } = useNuxtApp();
const country_dropdown_option =  ref([]);
const selectedCountry = ref(null);

const isLoading = ref(false)

const validateForm = () => {
  let isValid = true;

  // Check if firs name is empty
  if (!document.getElementById('name').value) {
    useToast().error("Name is required");
    isValid = false;
  }

  if (selectedCountry.value == null) {
    useToast().error("Country is required");
    isValid = false;
  }

  return isValid;
};
  
const createNewCategory = async () => {
  if (!validateForm()) {
    return;
  }

  isLoading.value = true; // Show loading indicator


  try {
    const token = localStorage.getItem('accessToken');
    const response = await $axios.post('/cuisine', {
        name: document.getElementById('name').value,
        countryId: selectedCountry.value,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
    
    if (response.data.status == 201) {
      useToast().success("Cuisine added successfully!");
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      window.location.reload();
    } else if (response.data.status === 400) {
      useToast().warning(response.data.message);
    }
  } catch (error) {
    if (error.response && error.response.data.status === 400) {
      useToast().error(error.response.data.message);
    } else {
      useToast().error(error.message);
    }
  } finally {
    isLoading.value = false; // Hide loading indicator
  }
};

onMounted(async () => {
try{
  const response = await $axios.get('/country');
  country_dropdown_option.value = response.data.map((country) => {
    return {
      id: country.id,
      display: country.name,
    };
  });
} catch (error) {
  useToast().error(error.message);
}
});
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
    padding: 2.5% 2.5%;

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