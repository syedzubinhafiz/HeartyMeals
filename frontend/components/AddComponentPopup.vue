<template>
  <div v-if="isVisible" class="popup-overlay" @click.self="closeWithoutSaving">
    <div class="popup-content">
      <div class="popup-header">
        <h1 class="title">Select {{ type === 'ingredient' ? 'Ingredient' : 'Seasoning' }}</h1>
        <button @click="closeWithoutSaving" class="close-button" aria-label="Close popup">x</button>
      </div> 

      <div class="popup-body">
        <div class="search-bar">
          <img src="../assets/icon/Search_Icon.svg" alt="Search Icon">
          <input
            type="text"
            v-model="query"
            @input="debouncedOnInput"
            :placeholder="`Enter Keywords ${type === 'ingredient' ? '(e.g., Egg, Potato)' : '(e.g., Salt, Sugar)'}`"
            class="search-input"
            :aria-label="`Search ${type === 'ingredient' ? 'Ingredient' : 'Seasoning'}`"
          />
        </div>

        <div class="search-result-text-display">
          <p class="aligned-paragraph" style="font-size: 15px; margin-top: 20px;" v-if="query">Search Result of "{{ query }}"</p>
        </div>

        <div class="search-result-container" @scroll="onScroll">
          <div class="search-result-item-display">
            <div v-for="item in searchResults" :key="item.id" class="search-result-item">
              <img :src="item.icon" alt="item icon" class="item-icon" style="max-height: 70%; max-width: 70%;">
              <span style="align-content: center;">{{ item.name }}</span>
              <button @click="addItem(item)" aria-label="Add {{ item.name }}" class="add-component-button">+</button>
            </div>
            <div v-if="isLoading" class="loading-indicator">
              Loading...
            </div>
          </div>
        </div>

        <div class="selected-item-text-display">
          <p class="aligned-paragraph" style="font-size: 25px; margin-top: 15px;">Selected Items</p>
        </div>

        <div class="selected-item-container">
          <div class="selected-item-display">
            <div v-for="item in selectedItems" :key="item.id" class="selected-item">
              <img :src="item.icon" alt="item icon" class="item-icon" style="max-height: 70%; max-width: 70%;">
              <span>{{ item.name }}</span>
              <button @click="removeItem(item)" aria-label="Remove {{ item.name }}" class="remove-component-button">-</button>
            </div>
          </div>
        </div>
      </div>

      <ButtonOrange style="margin-left: auto; margin-right: 5%; margin-top: 2%;" @click="addAndClose">
        <img src="~/assets/icon/Add_Icon.svg" alt="Back Icon" style="width: 30px; height: 30px; margin-right: 2px; padding-bottom: 3px;"/>
        Add
      </ButtonOrange>
    </div>
  </div>
</template>

<script>
import debounce from 'lodash.debounce';

export default {
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      required: true
    },
    initialSelectedItems: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      query: '',
      searchResults: [],
      selectedItems: [],
      pageNumber: 1,
      pageSize: 10,
      totalPages: 1,
      isLoading: false,
      type: this.type
    }
  },
  mounted() {
    this.selectedItems = [...this.initialSelectedItems];
    this.fetchData(); // Fetch data when the component is mounted
  },
  watch: {
    query(newQuery) {
      if (newQuery === '') {
        this.pageNumber = 1;
        this.searchResults = [];
        this.fetchData();
      }
    }
  },
  methods: {
    closeWithoutSaving() {
      this.$emit('close', { selectedItems: this.initialSelectedItems, type: this.type });
    },
    addAndClose() {
      this.$emit('close', { selectedItems: this.selectedItems, type: this.type });
      this.resetData();
    },
    resetData() {
      this.query = '';
      this.searchResults = [];
      this.selectedItems = [];
      this.pageNumber = 1;
      this.totalPages = 1;
      this.fetchData();
    },
    async fetchData() {
      if (this.isLoading || this.pageNumber > this.totalPages) return;

      this.isLoading = true;
      const token = localStorage.getItem('accessToken');

      let url_suffix = '/component/ingredients';

      if (this.type === 'seasoning') {
        url_suffix = '/component/seasonings';
      }

      try {
        const response = await this.$axios.get(url_suffix, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          params: {
            page: this.pageNumber,
            pageSize: this.pageSize,
            search: this.query || undefined,
          }
        });
        const data = response.data;
        this.searchResults = [...this.searchResults, ...data.data];
        this.totalPages = data.totalPages;
        this.pageNumber += 1;
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        this.isLoading = false;
      }
    },
    async onInput() {
      this.pageNumber = 1;
      this.searchResults = [];
      await this.fetchData();
    },
    debouncedOnInput: debounce(function() {
      this.onInput();
    }, 300),
    async loadMore() {
      await this.fetchData();
    },
    onScroll(event) {
      const bottom = event.target.scrollHeight - event.target.scrollTop <= event.target.clientHeight + 1;
      if (bottom) {
        this.loadMore();
      }
    },
    addItem(item) {
      this.selectedItems.push(item);
    },
    removeItem(item) {
      this.selectedItems = this.selectedItems.filter(i => i.id !== item.id);
    }
  }
}
</script>


<style scoped>
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 20;
}

.popup-content {
  background: #F3EADA;
  width: 60%;
  height: 85%;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 30;
}

.close-button {
  margin-left: auto;
  margin-right: 2%;
  font-size: xx-large;
  background: none;
  border: none;
  cursor: pointer;
}

.title {
  margin-left:  40%;
  text-align: center;
  font-size: 30px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
  padding-top: 0.5vh;
}

.popup-header{ 
  display: flex;
  flex-direction: row;
}

.popup-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 80%;
}

.search-bar {
  display: flex;
  align-items: center;
  background-color: white;
  width: 70%;
  border: 1px solid #ccc;
  border-radius: 50px; /* This makes the div round at both ends */
  padding: 2px 15px;
}

.search-input {
  width: 100%;
  align-self: center;
  padding: 5px;
}

.search-input:focus {
  outline: none;
}


.search-result-item{
  background-color: #FFFEF1;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  padding: 10px;
  border-radius: 10px;
  font-size: small;
  font-weight: 600;
  display:  grid;
  grid-template-columns: 20% 70% 10%;
  column-gap: 5px;
}
.search-result-item-display{
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 15px;
  padding: 15px;
}

.add-component-button{
  font-size: 30px;
  font-weight: 300;
}

.remove-component-button{
  font-size: 30px;
  font-weight: 500;
  color: red;
}

.search-result-text-display,
.selected-item-text-display {
  width: 80%;
  display: flex;
  justify-content: flex-start; /* Align text to the left */
  padding-left: 15px; /* Adjust padding to match the container's padding */
}

.search-result-container {
  width: 80%;
  height: 40%;
  background-color: rgba(255, 255, 255, 0.4);
  border: 1px solid #ccc;
  border-radius: 10px;
  margin-top: 10px;
  overflow-y: auto; /* Enable scrolling */
}
.selected-item {
  background-color: #FFFEF1;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  padding: 10px;
  border-radius: 10px;
  font-size: small;
  font-weight: 600;
  display: grid;
  grid-template-columns: 20% 70% 10%;
  column-gap: 5px;
  align-items: center; /* Ensure items are centered vertically */
}

.selected-item-container {
  width: 80%;
  height: 40%;
  background-color: rgba(255, 255, 255, 0.4);
  border: 1px solid #ccc;
  border-radius: 10px;
  margin-top: 10px;
  padding: 5px;
  overflow: auto;

}

.selected-item-display{
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 15px;
}

.aligned-paragraph {
  text-align: left;
  margin: 0; /* Ensure it starts at the container's starting point */
  padding: 0; /* Remove default padding */
  margin-top: 10px;
  font-weight: bold;
  color: #333;
}

.loading-indicator {
  text-align: center;
  font-size: 18px;
  margin-top: 20px;
}
</style>
