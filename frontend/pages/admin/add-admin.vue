
<template>
    <div class="absolute w-screen z-40" style="z-index: 10">
        <Header/>
    </div>

    <div style="padding-top: 7%; padding-left: 5%;">
        <ButtonOrange>
            <img src="~/assets/icon/Back_Icon.svg" alt="Back Icon" style="width: 20px; height: 20px; margin-right: 8px;"/>
            Back
        </ButtonOrange>
    </div>

    <h1 class="title">Add New Admin</h1>

    <div class="content-container">
        <form class="form-format" @submit.prevent>
            
            <!-- First Name -->
            <div class="form-group">
                <label class="form-label-format" for="f-name">First Name</label>
                <div></div>
                <input type="text" id="f-name" class="form-normal-text-input" placeholder="Enter admin first name"/>
            </div>
            
            
            <!-- Email -->
            <div class="form-group">
                <label class="form-label-format" for="email">Email</label>
                <div></div>
                <input type="email" id="email" class="form-normal-text-input" placeholder="Enter email"/>
            </div>

            <!-- Last Name -->
            <div class="form-group">
                <label class="form-label-format" for="l-name">Last Name</label>
                <div></div>
                <input type="text" id="l-name" class="form-normal-text-input" placeholder="Enter admin last name"/>
            </div>
            
            <!-- Gender -->
            <div class="form-group">
                <label class="form-label-format" for="gender">Gender</label>
                <div></div>
                <SingleSelectionDropdown
                    :items="gender_dropdown_option"
                    @item-selected="updateSelectedGender($event)"
                    defaultText="Select a Gender"
                    buttonStyle="background-color: rgba(255, 255, 255, 0.8); border: 1.5px solid #8B8585; border-radius: 5px; width: 100%; z-index: 10;"
                    dropdownStyle="background-color: rgb(253, 251, 248); border: 1.5px solid #8B8585; border-radius: 5px; overflow-y: auto; max-height: 200px; width: 100%; z-index: 25;"
                />
            </div>
            
            <!-- Add Button  -->
            <div style="grid-column: span 2; display: flex; align-items: center; justify-content: center;">
                <button type="submit" class="submit-button" @click="gatherAdminData">Add Admin</button>
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
import { useNuxtApp } from '#app';
import { useToast } from 'vue-toast-notification';

defineOptions({
  name: "Add Component",
});

definePageMeta({
  layout: "emptylayout",
});

const { $axios } = useNuxtApp();

const gender_dropdown_option = ref([
  { id: 'Male', display: 'Male' },
  { id: 'Female', display: 'Female' },
]);

const selected_gender = ref(null);

const isLoading = ref(false)

const updateSelectedGender = (selected) => {
    selected_gender.value = selected;
    console.log(selected_gender.value)
}

const validateForm = () => {
  let isValid = true;

  // Check if firs name is empty
  if (!document.getElementById('f-name').value) {
    useToast().error("First name is required");
    isValid = false;
  }

  // Check if last name is empty
  if (!document.getElementById('l-name').value) {
    useToast().error("Last name is required");
    isValid = false;
  }

  // Check if gender is selected
  if (!selected_gender.value) {
    useToast().error("Gender is required");
    isValid = false;
  }

  //Check if email is empty
  if (!document.getElementById('email').value) {
    useToast().error("Email is required");
    isValid = false;
  
  }

  return isValid;
};
  
const gatherAdminData = async () => {
  if (!validateForm()) {
    return;
  }

  isLoading.value = true; // Show loading indicator


  const admin_data = {
    first_name: document.getElementById('f-name').value,
    last_name: document.getElementById('l-name').value,
    email: document.getElementById('email').value,
    gender: selected_gender.value,
  };

  try {
    const token = localStorage.getItem('accessToken');
    const response = await $axios.post('/user/signup/admin', admin_data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
    
    if (response.data.status === 200) {
      useToast().success("Component added successfully!");
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