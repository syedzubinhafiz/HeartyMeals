<template>
    <div class="page-wrapper">
      <!-- Header component -->
      <Header />
  
      <!-- Profile Page Content -->
      <div class="profile-page">
        <div class="profile-header">
          <div class="profile-avatar">
            <!-- Placeholder for avatar -->
            <img src="../assets/img/ProfilePIc.png" alt="Avatar" />
          </div>
          <div class="profile-info">
            <h2>{{ user.name }}</h2>
          </div>
          <button class="edit-btn">Edit Profile</button>
        </div>
  
        <!-- Main Information Section -->
        <div class="info-section">
          <div class="info-row" v-for="(value, key) in userDetails" :key="key">
            <span class="info-label">{{ key }}</span>
            <span class="info-value">{{ value }}</span>
          </div>
        </div>
  
        <!-- Profile Details Section (Dietary Preferences, Food Allergies, Medical Restrictions) -->
        <div class="profile-details">
          <div class="detail-card">
            <h3 class="card-title">Dietary Preferences</h3>
            <ul>
              <li v-for="item in user.dietaryPreferences" :key="item" class="detail-row">
                <span class="detail-value">{{ item }}</span>
              </li>
            </ul>
          </div>
  
          <div class="detail-card">
            <h3 class="card-title">Food Allergies</h3>
            <ul>
              <li v-for="item in user.foodAllergies" :key="item" class="detail-row">
                <span class="detail-value">{{ item }}</span>
              </li>
            </ul>
          </div>
  
          <div class="detail-card">
            <h3 class="card-title">Medical Restrictions</h3>
            <ul>
              <li v-for="item in user.medicalRestrictions" :key="item" class="detail-row">
                <span class="detail-value">{{ item }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
  
      <!-- Footer component -->
      <Footer />
    </div>
  </template>
  
  <script>
  import Header from "@/components/Header.vue"; // Adjust the import path accordingly
  import Footer from "@/components/Footer.vue"; // Adjust the import path accordingly
  
  export default {
    components: {
      Header,
      Footer,
    },
    data() {
      return {
        user: {
          name: "Alice Lebowski",
          email: "alicesmith@fakemail.com",
          age: 24,
          country: "Sri Lanka",
          condition: "Coronary artery disease",
          nyha: "II",
          dietaryPreferences: ["No Beef"],
          foodAllergies: ["Peanuts", "Shrimp", "Human Flesh"],
          medicalRestrictions: ["Low Sugar", "Low Sodium"],
        },
      };
    },
    computed: {
      userDetails() {
        return {
          Email: this.user.email,
          Age: this.user.age,
          Country: this.user.country,
          Condition: this.user.condition,
          "NYHA Classification": this.user.nyha,
        };
      },
    },
  };
  </script>
  
  <style scoped>
  .page-wrapper {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background-color: #DAC2A8;
  }
  
  .profile-page {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding: 20px;
    box-sizing: border-box;
    background-color: #DAC2A8;
  }
  
  .profile-header {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    background-color: #F3EADA;
    padding: 15px;
    border-radius: 10px;
  }
  
  .profile-avatar {
    flex: 1;
  }
  
  .profile-avatar img {
    width: 100px;
    height: 100px;
  }
  
  .profile-info {
    flex: 3;
    margin-left: 20px;
  }
  
  .edit-btn {
    flex: 1;
    background-color: #ff9800;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
  }
  
  .info-section {
    margin-top: 20px;
    background-color: #F3EADA;
    border-radius: 15px;
    padding: 20px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }
  
  .info-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    background-color: #FFFEF1;
    border-radius: 25px;
    margin-bottom: 10px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  }
  
  .info-label {
    font-weight: bold;
    color: black;
    padding-left: 20px;
    flex: 1;
  }
  
  .info-value {
    color: black;
    padding-right: 20px;
    flex: 2;
    text-align: right;
  }
  
  /* Style for the detail cards */
.profile-details {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.detail-card {
  background-color: #F3EADA;
  border-radius: 15px;
  padding: 20px;
  width: 30%;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.card-title {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 15px;
  text-align: center; /* Center align the title */
}

.detail-row {
  background-color: #FFFEF1;
  border-radius: 25px;
  padding: 10px 15px;
  margin-bottom: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: center; /* Center horizontally */
  text-align: center; /* Center text within the row */
}

.detail-value {
  color: black;
  font-weight: bold;
  text-align: start; /* Ensure text is centered */
  width: 100%; /* Make sure text takes full width of the container */
}
  </style>
  