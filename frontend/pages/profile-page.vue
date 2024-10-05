<template>
    <div class="page-wrapper">
      <!-- Header component -->
      <Header />
  
      <!-- Profile Page Content -->
      <div class="profile-page">
        <!-- Full-width Profile Header -->
        <div class="profile-header full-width">
          <div class="profile-avatar">
            <!-- Placeholder for avatar -->
            <img src="../assets/img/ProfilePIc.png" alt="Avatar" />
          </div>
          <div class="profile-info">
            <h2 class="profile-name">{{ user.name }}</h2>
          </div>
          <div class="header-buttons">
            <button class="edit-btn" @click="toggleEditMode">
              <img src="../assets/img/Edit_fill.png" alt="Edit Icon" class="edit-icon" />
              {{ isEditing ? 'Cancel' : 'Edit Profile' }}
            </button>
            <button v-if="isEditing" class="apply-btn" @click="applyChanges">Apply Changes</button>
          </div>
        </div>
  
        <!-- Profile Sections (Main Section and Nutrition Information) -->
        <div class="profile-sections">
          <!-- Main Section -->
          <div class="main-section">
            <!-- Main Information Section -->
            <div class="info-section">
              <!-- View Mode (Non-editable) -->
              <div v-if="!isEditing">
                <div class="info-row" v-for="(value, key) in userDetails" :key="key">
                  <span class="info-label">{{ key }}</span>
                  <span class="info-value">{{ value }}</span>
                </div>
              </div>
  
              <!-- Edit Mode (Editable) -->
              <div v-else>
                <form @submit.prevent="saveProfile">
                  <div class="info-row">
                    <label class="info-label">Email</label>
                    <input type="text" :value="user.email" disabled class="info-value" />
                  </div>
                  <div class="info-row">
                    <label class="info-label">Name</label>
                    <input type="text" :value="user.name" disabled class="info-value" />
                  </div>
                  <div class="info-row">
                    <label class="info-label">Age</label>
                    <input type="number" v-model="user.age" class="info-value" />
                  </div>
                  <div class="info-row">
                    <label class="info-label">Weight</label>
                    <input type="number" v-model="user.weight" class="info-value" />
                  </div>
                  <div class="info-row">
                    <label class="info-label">Height</label>
                    <input type="number" v-model="user.height" class="info-value" />
                  </div>
                  <div class="info-row">
                    <label class="info-label">Gender</label>
                    <input type="text" v-model="user.gender" class="info-value" />
                  </div>
                  <div class="info-row">
                    <label class="info-label">Country</label>
                    <input type="text" v-model="user.country" class="info-value" />
                  </div>
                  <button type="submit" class="save-btn green-btn">Save Profile</button>
                </form>
              </div>
            </div>
          </div>
  
          <!-- Nutrition Information Section -->
          <div class="nutrition-section">
            <!-- Show Max Intake Budget in view mode -->
            <div v-if="!isEditing" class="nutrition-card">
              <h3 class="card-title">Max Intake Budget</h3>
              <ul>
                <li class="nutrition-row">
                  <span class="nutrition-label">Carbs</span>
                  <span class="nutrition-value">{{ carbs }} g</span>
                </li>
                <li class="nutrition-row">
                  <span class="nutrition-label">Protein</span>
                  <span class="nutrition-value">{{ protein }} g</span>
                </li>
                <li class="nutrition-row">
                  <span class="nutrition-label">Fat</span>
                  <span class="nutrition-value">{{ fat }} g</span>
                </li>
              </ul>
            </div>
  
            <!-- Edit Nutrition Settings in edit mode -->
            <div v-if="isEditing" class="nutrition-card">
              <h3 class="card-title">Nutrition Settings</h3>
              <div>
                <label>Carbs: {{ carbsPercentage }}%</label>
                <input type="range" min="0" max="100" v-model="carbsPercentage" />
              </div>
              <div>
                <label>Protein: {{ proteinPercentage }}%</label>
                <input type="range" min="0" max="100" v-model="proteinPercentage" />
              </div>
              <div>
                <label>Fat: {{ fatPercentage }}%</label>
                <input type="range" min="0" max="100" v-model="fatPercentage" />
              </div>
  
              <!-- Red warning shown only if Save Settings is clicked and total percentage is not 100% -->
              <div v-if="showWarning" class="warning">
                The total must add up to 100%. Current: {{ totalPercentage }}%
              </div>
              <button @click="saveNutritionSettings" class="green-btn">Save Settings</button>
            </div>
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
      <Footer />
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        isEditing: false,
        showWarning: false,
        user: {
          name: "Alice Lebowski",
          email: "alicesmith@fakemail.com",
          age: 24,
          weight: "65",
          height: "165",
          gender: "Female",
          country: "Sri Lanka",
          nyha: "II",
          activityLevel: "3",
          dietaryPreferences: ["No Beef"],
          foodAllergies: ["Peanuts", "Shrimp", "Human Flesh"],
          medicalRestrictions: ["Low Sugar", "Low Sodium"],
        },
        maxCalories: 2500, // Example max intake
        carbsPercentage: 40,
        proteinPercentage: 40,
        fatPercentage: 20,
      };
    },
    computed: {
      userDetails() {
        return {
          Email: this.user.email,
          Name: this.user.name,
          Age: this.user.age,
          Weight: this.user.weight + " kg",
          Height: this.user.height + " cm",
          Gender: this.user.gender,
          Country: this.user.country,
          "NYHA Classification": this.user.nyha,
          "Activity Level": this.user.activityLevel,
        };
      },
      carbs() {
        return (this.maxCalories * this.carbsPercentage) / 4;
      },
      protein() {
        return (this.maxCalories * this.proteinPercentage) / 4;
      },
      fat() {
        return (this.maxCalories * this.fatPercentage) / 9;
      },
      totalPercentage() {
        return this.carbsPercentage + this.proteinPercentage + this.fatPercentage;
      },
    },
    methods: {
      toggleEditMode() {
        this.isEditing = !this.isEditing;
      },
      saveProfile() {
        // Save profile data here
      },
      saveNutritionSettings() {
        if (this.totalPercentage !== 100) {
          this.showWarning = true;
        } else {
          this.showWarning = false;
          // Save nutrition settings logic
        }
      },
      applyChanges() {
        this.isEditing = false;
      },
    },
  };
  </script>
  
  <style scoped>
  .page-wrapper {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background-color: #dac2a8;
  }
  
  .profile-page {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding: 20px;
    box-sizing: border-box;
    background-color: #dac2a8;
  }
  
  /* Full-width Profile Header */
  .profile-header.full-width {
    width: 100%;
    background-color: #f3eada;
    padding: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 10px;
    margin-bottom: 20px;
  }
  
  .profile-avatar {
    flex: 0 0 100px; /* Control avatar width */
  }
  
  .profile-avatar img {
    width: 100px;
    height: 100px;
  }
  
  .profile-info {
    flex-grow: 1;
    margin-left: 10px; /* Bring name closer to the avatar */
  }
  
  .profile-name {
    font-size: 2rem;
    margin: 0;
    font-weight: bold;
  }
  
  .edit-btn {
    display: flex;
    align-items: center;
    background-color: #ff9770;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 25px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .edit-btn:hover {
    background-color: #ff8a57;
  }
  
  .edit-icon {
    width: 20px;
    height: 20px;
    margin-right: 8px;
  }
  
  /* Profile Sections - Main and Nutrition Information */
  .profile-sections {
    display: flex;
    justify-content: flex-start; /* Start both sections from the left */
    width: 100%; /* Ensure the sections take up the full width */
  }
  
  .main-section {
    flex: 1; /* Take up as much space as needed */
  }
  
  .info-section {
    background-color: #f3eada;
    border-radius: 15px;
    padding: 20px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }
  
  .info-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    background-color: #fffef1;
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
  
  /* Nutrition Section */
  .nutrition-section {
    flex: 0 0 350px; /* Fixed width for the nutrition section */
    margin-left: 20px; /* Add some space between the two sections */
  }
  
  .nutrition-card {
    background-color: #f3eada;
    border-radius: 15px;
    padding: 20px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }
  
  .nutrition-row {
    background-color: #fffef1;
    border-radius: 25px;
    padding: 10px 15px;
    margin-bottom: 10px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .nutrition-label {
    font-weight: bold;
    color: black;
  }
  
  .nutrition-value {
    font-weight: normal;
    color: black;
  }
  
  /* Profile Details Section */
  .profile-details {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
  }
  
  .detail-card {
    background-color: #f3eada;
    border-radius: 15px;
    padding: 20px;
    width: 30%;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }
  
  .card-title {
    font-size: 1.2rem;
    font-weight: bold;
    margin-bottom: 15px;
    text-align: center;
  }
  
  .detail-row {
    background-color: #fffef1;
    border-radius: 25px;
    padding: 10px 15px;
    margin-bottom: 10px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }
  
  .detail-value {
    color: black;
    font-weight: normal;
    width: 100%;
  }

  .edit-btn {
  display: flex;
  align-items: center;
  background-color: #ff9770;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 25px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.apply-btn {
  display: flex;
  align-items: center;
  background-color: #4CAF50; /* Apply button green */
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 25px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.green-btn {
  background-color: #4CAF50; /* Save buttons green */
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 25px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 10px;
}

.warning {
  color: red;
  margin-top: 10px;
}
  </style>
  