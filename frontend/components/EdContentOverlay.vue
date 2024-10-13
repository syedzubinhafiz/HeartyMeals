<template>
    <div class="overlay" :onclick="closeTab">
      <div class="overlay-content">
        <!-- Background image -->
       
        <!-- <button @click="closeOverlay" class="close-btn">X</button> -->
         <!-- Scrollable Content -->
        <div class="scrollable-content">
          
          <h1 class="header">{{ header }}</h1>
          <div class="content">
            <img :src="imageSrc" alt="Overlay Image" class="image-container"/>
          </div>
          <div class="text-box">
            <div v-for="(htmlString, index) in content" :key="index" v-html="htmlString"></div>
          </div>

          <img src="/assets/img/centerBlob.svg" class="center-blob">
        </div>
      </div>

    </div>
  </template>
<script setup>
const props = defineProps({
  show: Boolean,
  header: String,
  content: Array,
  imageSrc: String
})

const emits = defineEmits(["update:show"])

const closeTab = () => {
  props.show = false
  console.log(props.show)
  emits("update:show",false)
}
</script> 
//   <script>
//   const isOverlayVisible = ref(false);
// const overlayHeader = ref('');
// const overlayContent = ref([]);
// const overlayImageSrc = ref('');

// const openOverlay = (content) => {
//   overlayHeader.value = content.title;
//   overlayContent.value = content.content;
//   overlayImageSrc.value = content.storage_links.thumbnail;
//   isOverlayVisible.value = true;
// };

//   export default {
//     props: {
//   show: Boolean,
//   header: String,
//   content: Array,
//   imageSrc: String,
// },

//     methods: {
//       closeOverlay() {
//         this.$emit('close');
//       },
//     },
//   };
//   </script>
  
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
    overflow-y: auto; /* Prevents overflow from background image */
  }
  
  .center-blob {
    position: absolute;
    top: 45%;
    left: 55%;
    width: 85%;
    height: 85%;
    transform: translate(-50%, -50%);
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
  

  .text-box {
  position: relative;
  z-index: 2;
  margin-top: 5%;
  margin-left: 5%;
  width: 90%;
  background-color: #F3EADA;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.text-box h2 {
  margin-top: 20px;
  font-size: 1.5rem;
  font-weight: bold;
}

.text-box p, .text-box ul {
  margin-top: 10px;
  font-size: 1rem;
}

.text-box ul {
  padding-left: 20px;
}

.text-box ul li {
  list-style-type: disc;
}

.image-container {
  width: 350px;
  height: 350px;
  object-fit: cover;
  border-radius: 10px; 
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

}
  </style>
  