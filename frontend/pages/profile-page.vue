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
            <p>{{ user.email }}</p>
            <p>{{ user.age }} years old</p>
            <p>Country: {{ user.country }}</p>
            <p>Condition: {{ user.condition }}</p>
            <p>NYHA Classification: {{ user.nyha }}</p>
          </div>
          <button class="edit-btn">Edit Profile</button>
        </div>
  
        <div class="profile-details">
          <div class="card">
            <h3>Dietary Preferences</h3>
            <ul>
              <li v-for="item in user.dietaryPreferences" :key="item">{{ item }}</li>
            </ul>
          </div>
          <div class="card">
            <h3>Food Allergies</h3>
            <ul>
              <li v-for="item in user.foodAllergies" :key="item">{{ item }}</li>
            </ul>
          </div>
          <div class="card">
            <h3>Medical Restrictions</h3>
            <ul>
              <li v-for="item in user.medicalRestrictions" :key="item">{{ item }}</li>
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
  };
  </script>
  
  <style scoped>
  .page-wrapper {
    display: flex;
    flex-direction: column;
    height: 100vh; /* Ensure the wrapper takes up full viewport height */
  }
  
  .profile-page {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 20px;
    box-sizing: border-box;
  }
  
  .profile-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #f9f9f9;
    padding: 15px;
    border-radius: 10px;
  }
  
  .profile-avatar {
    flex: 1;
  }
  
  .profile-avatar img {
    border-radius: 50%;
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
  
  .profile-details {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
  }
  
  .card {
    background-color: #fff;
    border-radius: 10px;
    padding: 20px;
    width: 30%;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .card h3 {
    margin-bottom: 10px;
  }
  
  .card ul {
    list-style: none;
    padding: 0;
  }
  
  .card ul li {
    background-color: #eee;
    padding: 5px;
    border-radius: 5px;
    margin-bottom: 5px;
    text-align: center;
  }
  </style>
  