<template>
    <div v-if="show" class="overlay">
      <div class="overlay-content">
        <!-- Background image -->
        <img src="/assets/img/centerBlob.svg" class="center-blob">
        <button @click="closeOverlay" class="close-btn">X</button>
        <!-- Header and Image on top of the background -->
        <h1 class="header">{{ header }}</h1>
        <div class="content">
          <img src="/assets/img/overlayimg.svg" alt="Overlay Image" />
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      show: Boolean,
      header: String,
      imageSrc: String,
    },
    methods: {
      closeOverlay() {
        this.$emit('close');
      },
    },
  };
  </script>
  
  <style scoped>
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5); /* Dark background for blur effect */
    backdrop-filter: blur(10px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  }
  
  .overlay-content {
    background: #DAC2A8;
    width: 70%;
    height: 80%;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
    position: relative;
    overflow: hidden; /* Prevents overflow from background image */
  }
  
  .center-blob {
    position: absolute;
    top: 45%;
    left: 55%;
    width: 85%;
    height: 85%;
    transform: translate(-50%, -50%);
    z-index: 1; /* The background should be below the header and content */
    opacity: 100%; /* You can adjust opacity as per your design preference */
  }
  
  .header {
    position: relative;
    z-index: 2;
    text-align: center;
    font-size: xx-large;
    font-weight: bold;
    margin-top: 20px;
  }
  
  .content {
    position: relative;
    z-index: 2;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
  }
  
  .content img {
    width: 50%;
    height: auto;
  }
  </style>
  