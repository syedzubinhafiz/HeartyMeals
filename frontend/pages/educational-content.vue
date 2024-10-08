<template>
  <div class="page-container" @click="handleClickOutside">
    <header class="header">
      <Header />
    </header>

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
      </div>

      <div class="search-result-container" @scroll="onScroll">
        <div v-if="searchResults && searchResults.length > 0" class="search-result-item-display">
          <EdContentCard
            v-for="(content, index) in searchResults"
            :key="content.id"
            :title="content.title"
            :summary="content.summary"
            :thumbnail="content.storage_links?.thumbnail"
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
import { useApi } from '@/composables/api';
import { ref, onMounted, onBeforeUnmount } from 'vue';
import debounce from 'lodash/debounce';
import EdContentOverlay from '@/components/EdContentOverlay.vue';
import EdContentCard from '@/components/EdContentCard.vue';
import axios from 'axios';


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
  isLoading.value = true;

  const params = {
    page: pageNumber.value,
    pageSize: 10,
    search: searchValue.value,
  };

  try {
    await useApi("/dietary","GET")
    console.log("Fetching data with params:", params);
    const result = await useApi(`/education/get?page=${pageNumber.value}&pageSize=${10}&search=${searchValue.value}`, 'GET');


    // Log the response to see the returned data
    console.log('API Response:', result);

    if (result && !result.isError && result.value.data) {
      searchResults.value = result.value.data
    } else {
      console.error('Error or no data in the response:', result);
      useToast().error("Educational content retrieval failed, or there is no educational content in the database")
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  } finally {
    isLoading.value = false;
  }
};


const onScroll = (event) => {
  const bottom = event.target.scrollHeight - event.target.scrollTop <= event.target.clientHeight + 1;
  if (bottom && !isLoading.value && pageNumber.value <= totalPages.value) {
    fetchContentData();
  }
};

onMounted(() => {
  fetchContentData();  // Load initial content data
  // document.addEventListener("click", handleClickOutside);
});

// onBeforeUnmount(() => {
//   document.removeEventListener("click", handleClickOutside);
// });

const openOverlay = (content) => {
  overlayHeader.value = content.title;
  overlayImageSrc.value = content.thumbnail;
  isOverlayVisible.value = true;
  overlayContent.value = content.storage_links.content
};

// const toggleFilterOverlay = () => {
//   isFilterOverlayVisible.value = !isFilterOverlayVisible.value;
// };

// const handleClickOutside = (event) => {
//   if (searchBar.value && !searchBar.value.contains(event.target)) {
//     isFilterOverlayVisible.value = false;
//   }
// };

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
  margin-top:6%;
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
  padding-bottom: 2.5%;
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
