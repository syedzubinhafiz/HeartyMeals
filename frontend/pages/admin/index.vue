<template>
    <img src="@/assets/img/admin/admin-home-page.svg" class="logo">

    <div class="page-container">
        <header class="header">
            <Header></Header>
        </header>

        <div class="message-container">
            <h1>Welcome back, Alvin</h1>
            <span>What would you like to do today ?</span>
        </div>


        <div class="button-container">  
            <div class="col">

                <div class="button approve-custom-recipe">
                    <img src="@/assets/icon/tick-circle-icon.svg" alt="">
                    Approve Custom Recipe
                </div>
                <div class="button add-recipe" @click="navigateTo('/admin/add-recipe')">
                    <img src="@/assets/icon/add-recipe-admin-icon.svg" alt="">
                    Add Recipe
                </div>
                <div class="button edu-content" @click="navigateTo('/edu-content')">
                    <img src="@/assets/icon/edu-content-icon.svg" alt="" >
                    Educational Content
                </div>
            </div>
            
            <div class="col">

                <div class="button recipe-library"  @click="navigateTo('/recipe-library')">
                    <img src="@/assets/icon/recipe-lib-icon.svg" alt="">
                    Recipe Library
                </div>
                <div class="button add-component" @click="navigateTo('/admin/add-component')">
                    <img src="@/assets/icon/add-component-admin-icon.svg" alt="" >
                    Add Component
                </div>
                <div class="button add-edu-content" @click="navigateTo('/admin/add-edu-content')">
                    <img src="@/assets/icon/add-edu-content-admin-icon.svg" alt="" >
                    Add Educational Content
                </div>
                
            </div>
        </div>

        <div class="right-title">
            <h1>Pending Approval Recipe</h1>            
        </div>
        <div class="container-header">
            <div>Recipe Name</div>
            <div>Created By</div>
            <div>Created Date</div>

        </div>
        <div class="pending-approval-recipe-container" @scroll="onScroll"> 

            <div v-for="recipe in result" class="custom-recipe-container" @click="goToRecipeDetails(recipe.id)">
                <img :src="recipe.storage_links.thumbnail" alt="">
                <div>{{ recipe.name }}</div>
                <div>{{ recipe.user.first_name  + recipe.user.last_name}}</div>
                <div>{{ recipe.created_at.split('T')[0] }}</div>

            </div>

            <div v-if="isLoading" class="loading-indicator">Loading...</div>
        </div>
    </div>
</template>


<script setup>
definePageMeta({
    layout: 'emptylayout',
    middleware: 'auth'
})

import { ref} from 'vue'
import { useNuxtApp } from '#app';

const {$axios} = useNuxtApp();


const isLoading = ref(false);
const pageNumber = ref(1);
const pageSize = ref(10);
const totalPages = ref(0);
const result = ref([]);

async function fetchData() {

  if (
    isLoading.value 
  )
    return;


  isLoading.value = true;
  const token = localStorage.getItem('accessToken');
  try {


    const response = await $axios.get('/recipe/get-custom-recipe', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      params: {
        page: pageNumber.value,
        pageSize: pageSize.value,
      
      },
    });

    const data = response.data;

    if (data.data.length === 0) {
      isLoading.value = false;
      return;
    }
    result.value = [...result.value, ...data.data];
    totalPages.value = data.total_pages;
    pageNumber.value += 1;

    console.log('Data:', data);
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    isLoading.value = false;
  }
}


onMounted(() => {
  fetchData();
});

function goToRecipeDetails(id) {
    localStorage.setItem('recipeId', id);
    navigateTo('/recipe-library');
}

function onScroll(event) {
  const bottom = event.target.scrollHeight - event.target.scrollTop <= event.target.clientHeight + 1;
  if (bottom) {
    fetchData();
  }
}

</script>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Overpass:wght@400;700&display=swap');

* {
    font-family: 'Overpass', sans-serif;
}

.logo{
        height:100vh;
        position: absolute;
        top: 0;
        left: 0;
        }


.page-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.header {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 40;
}

.message-container{
    position: absolute;
    top: 20%;
    left: 7%;
    color: #fff; 
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;    
    font-size: 1.5rem;
}


.message-container h1 {
    font-size: 3.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
}


.button-container{
    position: absolute;
    top: 43%;
    left: 7%;
    display: flex;
    flex-direction: row;
    width: 30%;
    height: 50%;
    align-items: center;
    justify-items: center;

}

.col{
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 50%;
    align-items: center;
    justify-items: center;
    row-gap: 10%;
}

.button{
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #FFA17A;
    color: #993300;
    font-size: 1rem;
    font-weight: 700;
    border-radius: 10px;
    width: fit-content;
    height: 10%;
    padding: 0% 5%;
    cursor: pointer;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
}

.button img{
    width: 20px;
    height: 20px;
    margin-right: 5px;
}

.button:hover{
    background-color: #E5946B;
    
}

.right-title{
    position: absolute;
    top: 20%;
    left: 61%;
    width: 30%;
    text-align: center;
    font-size: 2rem;
    font-weight: 700;
}

.container-header{
    position: absolute;
    top: 27%;
    left: 61%;
    width: 30%;
    height: 5%;
    z-index: 2;
    border-radius: 10px;
box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.1) 0px 2px 4px -1px;
    background-color: #FEFEF1;
    display: grid;
    grid-template-columns: 50% 25% 25%;
    align-items: center;
    text-align: right;
    padding-right: 2%;
    
    font-weight: bold;

}

.pending-approval-recipe-container{
    position: absolute;
    top: 27%;
    left: 61%;
    width: 30%;
    height: 60%;
    background-color: #FEFEF1;
    border-radius: 10px;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 3%;
    overflow-y: auto;
    cursor: pointer;
}


.custom-recipe-container{
    width: 90%;
    height: 23%;
    background-color: #F8F3EB;
    font-size: 0.8rem;
    font-weight: bold;
    border-radius: 10px;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    margin-bottom: 2%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding-left: 1%;
    padding-right: 3%;
}

.custom-recipe-container img {
    /* width: 80px;
    height: 80px; */
    height: 80%;
    width: 15%;
    border-radius: 10px;
    object-fit: cover;
}

.custom-recipe-container:hover{
    background-color: #EFE8E0;
}

.loading-indicator {
  text-align: center;
  font-size: 18px;
  margin-top: 20px;
}
</style>