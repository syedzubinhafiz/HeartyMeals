<template>
  <div class="page-container" @click="handleClickOutside">
    <div v-if="userRole === 'admin'">
      <header class="header">
        <AdminHeader></AdminHeader>
      </header>
    </div>
    <div v-else>
      <header class="header">
        <Header></Header>
      </header>
    </div>

    <div class="image-container">
      <img src="/assets/img/backGround.svg" class="background-image" />
      <div class="text-overlay">
        <h2 class="text-white text-3xl font-bold text-center">Educational Content</h2>
        <p class="mt-[15px] text-white text-xl text-center italic">
          Caring for your body with wholesome foods is a lifelong investment in your health and well-being.
        </p>
      </div>
    </div>

    <div class="body">
      <div class="search-bar" ref="searchBar">
        <img src="/assets/img/Search_Icon.svg" alt="Search Icon" />
        <input
          type="text"
          v-model="searchValue"
          placeholder="Enter Keywords"
          class="search-input"
          aria-label="Search Content"
        />
      </div>

      <div class="search-result-text-display">
        <p
          class="aligned-paragraph"
          style="font-size: 15px; margin-top: 20px;"
          v-if="searchValue"
        >
          Search Results for "{{ searchValue }}"
        </p>
        <p
          class="aligned-paragraph"
          style="font-size: 15px; margin-top: 20px;"
          v-if="!searchValue"
        >
          Recently Added Content
        </p>
      </div>

      <div class="search-result-container" @scroll="onScroll">
        <div v-if="searchResults && searchResults.length > 0" class="search-result-item-display">
          <EdContentCard
            v-for="(content, index) in searchResults"
            :key="content.id"
            :title="content.title"
            :summary="content.summary"
            :thumbnail="content.storage_links.thumbnail"
            @click="openOverlay(content)"
          />
        </div>
        <div v-else-if="!isLoading" class="no-data-message">
          No content available.
        </div>
        <div v-if="isLoading" class="loading-indicator">
          Loading...
        </div>
      </div>
    </div>

    <EdContentOverlay
      v-if="isOverlayVisible"
      v-model:show="isOverlayVisible"
      :header="overlayHeader"
      :content="overlayContent"
      :imageSrc="overlayImageSrc"
      @close="isOverlayVisible = false"
    />

    <footer class="footer">
      <Footer />
    </footer>
  </div>
</template>



<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useNuxtApp } from '#app';
import EdContentOverlay from '@/components/EdContentOverlay.vue';
import EdContentCard from '@/components/EdContentCard.vue';


const { $axios } = useNuxtApp();

const userRole = ref(null);
// For search functionality and data fetching
const isLoading = ref(false);
const searchValue = ref("");
const searchResults = ref([]);
const pageNumber = ref(1);
const totalPages = ref(1);
const searchBar = ref(null);
// For overlay functionality
const isOverlayVisible = ref(false);
const overlayHeader = ref('');
const overlayImageSrc = ref('');
const overlayContent = ref('');
// Simulated data fetch for EdContent (replace with your API call if needed)
const fetchContentData = async () => { 

  if (
    isLoading.value 
  )
    return;

  isLoading.value = true;


  const token = localStorage.getItem('accessToken');
  try {
    console.log('here')
    // Ensure meal_type is an array of strings

    const response = await $axios.get('/education/get', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      params: {
        page: pageNumber.value,
        pageSize: 10,
        search: searchValue.value || undefined,
      },
    });

    const data = response.data;

    if (data.data.length === 0) {
      isLoading.value = false;
      return;
    }
    searchResults.value = [...searchResults.value, ...data.data];
    totalPages.value = data.totalPages;
    pageNumber.value += 1;
  } catch (error) {
    console.error('Unexpected error:', error);
  } finally {
    isLoading.value = false;
  }
};

async function verifyAdmin(){
  const token = localStorage.getItem('accessToken');
  try {
    const response = await $axios.get('/user/verify/admin', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    console.log(response.data);
    if (response.data) {
      userRole.value = 'admin';
    } else {
      userRole.value = 'patient';
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

const onScroll = (event) => {
  const bottom = event.target.scrollHeight - event.target.scrollTop <= event.target.clientHeight + 1;
  if (bottom && !isLoading.value && pageNumber.value <= totalPages.value) {
    fetchContentData();
  }
};

onMounted(async () => {
  await verifyAdmin();
  fetchContentData();  // Load initial content data

  if (localStorage.getItem('educationalContentId')) {
    const content = {id: localStorage.getItem('educationalContentId')};
    // Fetch content data for the selected content
    openOverlay(content);
    localStorage.removeItem('educationalContentId');
  }
});

watch(searchValue, (newQuery) => {
  pageNumber.value = 1;
  searchResults.value = [];
  fetchContentData();

});

const openOverlay = async (content) => {

  try{ 
    const token = localStorage.getItem('accessToken');
    const response = await $axios.get('/education/get', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      params: {
        educationalContentId: content.id,
      },
    });

    content = response.data;
    console.log(content)
    overlayHeader.value = content.title;
    overlayImageSrc.value = content.storage_links.thumbnail;
    isOverlayVisible.value = true;
    overlayContent.value = content.content
  } catch (error) {
    console.error('Unexpected error:', error);
  } 


};



</script>

<style scoped>
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

.image-container {
  position: relative;
  width: 100%;
}

.background-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  background-color: #DAC2A8;
}

.text-overlay {
  position: absolute;
  width: 100%;
  top: 60%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.body {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: #DAC2A8;
}

.footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 40;
}

.search-bar {
  display: flex;
  align-items: center;
  background-color: #F8F2E2;
  width: 50%;
  border: 1px solid #ccc;
  border-radius: 50px;
  padding: 2px 15px;
}

.search-input {
  width: 100%;
  padding: 5px;
  background-color:#F8F2E2
}

.search-input:focus {
  outline: none;
}

.search-result-item-display {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 50px;
  padding: 15px;
}

.search-result-text-display {
  width: 60%;
  display: flex;
  justify-content: flex-start;
  padding-left: 15px;
}

.search-result-container {
  width: 70%;
  height: 65%;
  margin-top: 10px;
  overflow-y: auto;
  overflow-x: hidden;
}

.aligned-paragraph {
  text-align: left;
  margin: 0;
  font-weight: bold;
  color: #333;
}

.loading-indicator {
  text-align: center;
  font-size: 18px;
  margin-top: 20px;
}

.filter-button {
  cursor: pointer;
  height: 70%;
}
/* WebKit browsers (Chrome, Safari) */
.search-result-container::-webkit-scrollbar {
  width: 12px; /* Adjust scrollbar width */
}

.search-result-container::-webkit-scrollbar-track {
  background: #dac2a8; /* Scrollbar track color */
}

.search-result-container::-webkit-scrollbar-thumb {
  background-color: #015B59; /* Scrollbar thumb color */
  border-radius: 10px; /* Make the scrollbar rounded */
  border: 3px solid #dac2a8; /* Add border around the thumb to match the track */
}

/* Firefox */
.search-result-container {
  scrollbar-width: thin; /* Thin scrollbar */
  scrollbar-color: #015B59 #dac2a8; /* Thumb and track colors */
}
</style>
