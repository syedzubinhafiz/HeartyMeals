<template>
    <div :class="searchBarClass">
        <span class="search-icon">
      <img src="/assets/img/SearchIcon.svg" alt="Search Icon" />
    </span>
      <input type="text" placeholder="Enter Keywords" :class="inputClass" />
    </div>
  </template>
  
  <script>
  export default {
    name: 'SearchBar',
    props: {
      rounded: {
        type: Boolean,
        default: true,
      },
      width: {
        type: String,
        default: '800px', // Adjust this value to make the search bar longer
      },
    },
    computed: {
      searchBarClass() {
        return {
          'search-bar': true,
          'rounded-full': this.rounded, // Change the shape by toggling the 'rounded' prop
        };
      },
      inputClass() {
        return 'search-input';
      },
    },
  };
  </script>
  
  <style scoped>
  .search-bar {
    display: flex;
    align-items: center;
    background-color: #f9f5e7; /* Light background color */
    padding: 10px 20px;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
    width: var(--width); /* Use a CSS variable for the width */
    width: 800px; /* Set the width directly or adjust with the prop */
  }
  
  .rounded-full {
    border-radius: 30px; /* Full rounded corners */
  }
  
  .search-input {
    border: none;
    background-color: transparent;
    outline: none;
    width: 100%;
    font-size: 16px;
    margin-left:25px;
    color: #6b7280; /* Gray text color */
  }
  
  .search-icon {
  position: absolute;
  margin-left: -5px; /* Move icon inside the input */
  color: #6b7280; /* Icon color */
  display: flex;
  align-items: center;
  pointer-events: none; /* Prevent clicking on the icon */
}

.search-icon img {
  width: 24px; /* Adjust size to be smaller */
  height: 24px; /* Adjust size to be smaller */
}
  </style>
  