<template>
    <div class="container-format">
      <div class="flex justify-between items-center cursor-pointer" @click="toggle">
        <h3 class="font-format">{{ title }}</h3>
        <svg :class="{'rotate-180': isOpen}" class="w-6 h-6 transition-transform duration-300" src="assets/icon/Dropdown_Arrow.svg"  fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      <div v-if="isOpen" style="overflow-x: hidden; height: 250px; z-index: 11;">
        <slot ></slot>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      title: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        isOpen: false
      };
    },
    methods: {
      toggle() {
        this.isOpen = !this.isOpen;
      }
    }
  };
  </script>
  
  <style scoped>
.container-format {
    width: 100%;
    padding: 5px;
    margin-top: 5px;
    background-color: rgba(255, 255, 255, 0.8);
    border: 1.5px solid #8B8585;
    border-radius: 5px;
}

.font-format {
    font-family: 'Overpass', sans-serif;
    font-weight: 600; /* SemiBold */
    font-size: 16px;
    align-self: center;
    letter-spacing: normal; /* Auto */
    text-transform: none; /* No text transformation */
    text-align: left; /* Left align */
}
  </style>
  