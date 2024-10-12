<template>
    <div v-if="show" class="overlay">
      <div class="overlay-content">
        <!-- Background image -->
        <img src="/assets/img/centerBlob.svg" class="center-blob">
        <!-- <button @click="closeOverlay" class="close-btn">X</button> -->
         <!-- Scrollable Content -->
      <div class="scrollable-content"></div>
        <!-- Header and Image on top of the background -->
        <h1 class="header">{{ header }}</h1>
        <div class="content">
          <img src="/assets/img/overlayimg.svg" alt="Overlay Image" />
        </div>
         <!-- Text Content Box -->
         <div class="text-box">
          <h2>First steps for getting diagnosed</h2>
          <p>
            It's always important to have regular checkups even if you're not noticing any particular symptoms. 
            If you do notice any of the potential signs of heart failure, take action and talk to a health care professional.
          </p>

          <h2>Symptoms to report to your health care professional</h2>
          <p>
            It can be appropriate to begin testing for heart failure if you or a family member has any of the potential signs of heart failure, such as:
          </p>
          <ul>
            <li>Shortness of breath</li>
            <li>Persistent coughing or wheezing</li>
            <li>Buildup of excess fluid in body tissues (edema)</li>
            <li>Unusual fatigue</li>
            <li>Lack of appetite or nausea</li>
            <li>Impaired thinking</li>
            <li>Increased heart rate</li>
          </ul>

          <h2>Testing can provide insights</h2>
          <p>
            After an examination, your doctor could decide that tests and procedures should be ordered to help determine the nature of the possible problem.
            Imaging tests can help show your health care professional the structure and function of your heart's various chambers and ventricles.
            Blood tests can also reveal how much oxygen, electrolytes and other things your blood is circulating.
            All of this information can help clarify what in your heart is responsible for your heart failure symptoms.
          </p>
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
    overflow-y: auto; /* Prevents overflow from background image */
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
  .text-box {
margin-top:200px;
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
  </style>
  