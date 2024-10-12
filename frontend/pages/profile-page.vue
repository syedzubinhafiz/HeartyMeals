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
          <h2 class="profile-name">{{ userInfo.name || 'No Name Available' }}</h2>
        </div>
        <div class="header-buttons">
          <!-- Apply Changes Button -->
          <button v-if="isEditing" class="apply-btn" @click="applyChanges">Apply Changes</button>

          <!-- Edit / Cancel Button -->
          <button class="edit-btn" @click="toggleEditMode">
            <img src="../assets/img/Edit_fill.png" alt="Edit Icon" class="edit-icon" />
            {{ isEditing ? 'Cancel' : 'Edit Profile' }}
          </button>
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
              <div v-for="(label, key) in userDetails" :key="key" class="info-row">
                <span class="info-label">{{ label }}</span>
                <span class="info-value">{{ userInfo[key] || 'No Data Available' }}</span>
              </div>
            </div>

            <!-- Edit Mode (Editable) -->
            <div v-else>
              <div class="info-row">
                <label class="info-label">Email</label>
                <input  type="text" :value="userInfoEdit['email']" disabled class="info-value"/>
              </div>
              <div class="info-row">
                <label class="info-label">Name</label>
                <input  type="text" :value="userInfoEdit['name']" disabled class="info-value"/>
              </div>
              <div class="info-row">
                <label class="info-label">Age</label>
                <input  type="number" v-model="userInfoEdit['age']" class="info-value" :placeholder="'Enter ' + label"/>
              </div>
              <div class="info-row">
                <label class="info-label">Weight</label>
                <input  type="number" v-model="userInfoEdit['weight']" class="info-value" :placeholder="'Enter ' + label"/>
              </div>
              <div class="info-row">
                <label class="info-label">Height</label>
                <input  type="number" v-model="userInfoEdit['height']" class="info-value" :placeholder="'Enter ' + label"/>
              </div>
              <div class="info-row">
                <label class="info-label">Gender</label>
                <!-- <input  type="text" v-model="userInfo['gender']" class="info-value" :placeholder="'Enter ' + label"/> -->
                <RadioButton name="Gender" :options="['Male','Female']" v-model="userInfoEdit['gender']"/>
              </div>
              <div class="info-row">
                <label class="info-label">Country</label>
                <DropdownSearchBar :dataList="countryList" v-model="userInfoEdit['country']"/>

              </div>
              <div class="info-row">
                <label class="info-label">NYHA classification</label>
                <Dropdown :options="['I','II','III','IV']" :optionValues="[1,2,3,4]" v-model="userInfoEdit['nyha_level']" color="bg-white w-96"/>
              </div>
              <div class="info-row">
                <label class="info-label">Activity level</label>
                <Dropdown :options="['1','2','3','4','5']" :optionValues="[1,2,3,4,5]" v-model="userInfoEdit['activity_level']" color="bg-white w-96"/>
              </div>
            </div>
          </div>
        </div>

        <!-- Nutrition Information Section (View Only) -->
        <div class="nutrition-section">
          <div class="nutrition-card">
            <h3 class="card-title">Max Intake Budget</h3>
            <ul>
              <li class="nutrition-row">
                <span class="nutrition-label">Carbs</span>
                <span class="nutrition-value">{{ userInfo.daily_budget?.carbs }} g</span>
              </li>
              <li class="nutrition-row">
                <span class="nutrition-label">Protein</span>
                <span class="nutrition-value">{{ userInfo.daily_budget?.protein }} g</span>
              </li>
              <li class="nutrition-row">
                <span class="nutrition-label">Fat</span>
                <span class="nutrition-value">{{ userInfo.daily_budget?.fat }} g</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Profile Details Section (Dietary Preferences, Food Allergies, Medical Restrictions) -->
      <div class="profile-details">
        <div class="detail-card">
          <h3 class="card-title">Dietary Preferences</h3>
          <ul>
            <!-- <li v-if="dietaryPreferences.length === 0" class="detail-row no-data">No Dietary Preferences detected!</li>
            <li v-for="item in dietaryPreferences" :key="item" class="detail-row">
              <span class="detail-value">{{ item }}</span>
            </li> -->
            <li class="detail-row">
              <span class="detail-value">{{ userInfo.dietary?.name }}</span>
            </li>
          </ul>
        </div>

        <div class="detail-card">
          <h3 class="card-title">Food Allergies</h3>
          <ul>
            <li v-if="foodAllergies.length === 0" class="detail-row no-data">No Food Allergies detected!</li>
            <li v-for="item in foodAllergies" :key="item" class="detail-row">
              <span class="detail-value">{{ item }}</span>
            </li>
          </ul>
        </div>

        <div class="detail-card">
          <h3 class="card-title">Medical Restrictions</h3>
          <ul>
            <li v-if="medicalRestrictions.length === 0" class="detail-row no-data">No Medical Restrictions detected!</li>
            <li v-for="item in medicalRestrictions" :key="item" class="detail-row">
              <span class="detail-value">{{ item }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>
<script setup>

const countryList = ref([])
const userInfo = ref({})
const userInfoEdit = ref({})

onMounted(async () => {
  await useApi("/dietary","GET")
  const results = await useApi("/user/info","GET")
  console.log(results)
  userInfo.value = results.value
  userInfo.value.name = userInfo.value.first_name + ' ' + userInfo.value.last_name
  userInfo.value.country_name = userInfo.value.country.name
  userInfo.value.activity_level = userInfo.value.user_nutrition_setting.activity_level
  countryList.value = (await useApi('/country','GET')).value
})
const isEditing = ref(false)

const toggleEditMode = () => {
  isEditing.value = !isEditing.value;
  if(isEditing.value) {
    userInfoEdit.value = JSON.parse(JSON.stringify(userInfo.value))
  }
}

const applyChanges = async () => {
  let result = await useApi("/user/update","POST",{
    countryId: userInfoEdit.value.country.id,
    nyhaLevel: userInfoEdit.value.nyha_level,
    dietaryId: userInfoEdit.value.dietary.id,
    gender : userInfoEdit.value.gender,
    ethnicityId: userInfoEdit.value.ethnicity.id,

    medicalInfo : userInfoEdit.value.medical_info,
    age: userInfoEdit.value.age,
    height : userInfoEdit.value.weight,
    weight: userInfoEdit.value.height,
    userNutritionSetting: {
      carbsPercentage: userInfoEdit.value.user_nutrition_setting.carbs_percentage,
      proteinPercentage: userInfoEdit.value.user_nutrition_setting.protein_percentage,
      fatPercentage: userInfoEdit.value.user_nutrition_setting.fat_percentage,
      cholesterolLevel: userInfoEdit.value.user_nutrition_setting.cholesterol_level,
      activityLevel: userInfoEdit.value.user_nutrition_setting.activity_level
    }
  })
  console.log(result)
  if(result.isError) {
    useToast().error("update failed!")
  }
  else {
    useToast().success("user info updated!")
  }

  const results = await useApi("/user/info","GET")
  console.log(results)
  userInfo.value = results.value
  userInfo.value.name = userInfo.value.first_name + ' ' + userInfo.value.last_name
  userInfo.value.country_name = userInfo.value.country.name
  userInfo.value.activity_level = userInfo.value.user_nutrition_setting.activity_level

  isEditing.value = false
}

</script>

  
<script>
export default {
  data() {
    return {
      dietaryPreferences: [],
      foodAllergies: [],
      medicalRestrictions: [],
      user: {
        name: '',
        email: '',
        age: '',
        weight: '',
        height: '',
        gender: '',
        country: '',
        nyha: '',
        activityLevel: '',
      },
    };
  },
  mounted() {
    this.fetchUserPreferences();
  },
  methods: {
    fetchUserPreferences() {
      // Simulate fetching data from an API
      this.dietaryPreferences = []; 
      this.foodAllergies = []; 
      this.medicalRestrictions = []; 

    },

  },
  computed: {
    userDetails() {
      return {
        email: "Email",
        name: "Name",
        age: "Age",
        weight: "Weight",
        height: "Height",
        gender: "Gender",
        country_name : "Country",
        nyha_level: "NYHA Classification",
        activity_level: "Activity Level",
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

  .header-buttons {
  display: flex;
  align-items: center;
}

.header-buttons {
  display: flex;
  align-items: center;
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
  margin-left: 10px;
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
  