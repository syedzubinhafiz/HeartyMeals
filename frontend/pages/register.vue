<template>
  <div class="page-background">
    <img src="@/assets/img/sign-in-logo.svg" class="logo">
    
    <div class="container">
    <h1>Create an account</h1>
    
    <div class="form">
      <form @submit.prevent="handleRegister">
        <div class="input-container">
          <label for="firstName">First Name</label>
          <input 
            v-model="registerForm.firstName" 
            type="text" 
            id="firstName"
            placeholder="Enter your first name"
            required
            class="from-input-box"
          />
        </div>
        
        <div class="input-container">
          <label for="lastName">Last Name</label>
          <input 
            v-model="registerForm.lastName" 
            type="text" 
            id="lastName"
            placeholder="Enter your last name"
            required
            class="from-input-box"
          />
        </div>
        
        <div class="input-container">
          <label for="email">Email</label>
          <input 
            v-model="registerForm.email" 
            type="email" 
            id="email"
            placeholder="Enter your email"
            required
            class="from-input-box"
          />
        </div>
        
        <div class="input-container">
          <label for="password">Password</label>
          <input 
            v-model="registerForm.password" 
            type="password" 
            id="password"
            placeholder="Enter your password (min 8 characters)"
            required
            class="from-input-box"
          />
          <small style="color: #666; font-size: 0.8rem;">
            Password must be at least 8 characters long
          </small>
        </div>
        
        <div class="input-container">
          <label for="confirmPassword">Confirm Password</label>
          <input 
            v-model="registerForm.confirmPassword" 
            type="password" 
            id="confirmPassword"
            placeholder="Confirm your password"
            required
            class="from-input-box"
          />
        </div>
        
        <div class="input-container">
          <label for="role">Account Type</label>
          <select 
            v-model="registerForm.role" 
            id="role"
            class="from-input-box"
          >
            <option value="Patient">Patient</option>
            <option value="Dietitian">Dietitian</option>
          </select>
        </div>
        
        <div class="button-next" @click="handleRegister" :disabled="loading || !isFormValid">
          {{ loading ? 'Creating Account...' : 'Create Account' }}
        </div>
        
        <div v-if="errorMessage" style="color: red; text-align: center; margin-top: 10px;">
          {{ errorMessage }}
        </div>
        
        <div style="text-align: center; margin-top: 15px; margin-bottom: 10px;">
          <p style="margin-bottom: 8px;">Already have an account?</p>
                      <button type="button" @click="async () => await navigateTo('/sign-in')" class="link-button">
            Sign in here
          </button>
        </div>
      </form>
    </div>
  </div>
  </div>
</template>

<script setup>
defineOptions({
  name: "RegisterPage",
});

definePageMeta({
  layout: "emptylayout"
});

const { $axios } = useNuxtApp();
const { $toast } = useNuxtApp();

const registerForm = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: 'Patient'
});

const loading = ref(false);
const errorMessage = ref('');

const isFormValid = computed(() => {
  return registerForm.value.firstName.length >= 2 &&
         registerForm.value.lastName.length >= 2 &&
         registerForm.value.email.includes('@') &&
         registerForm.value.password.length >= 8 &&
         registerForm.value.password === registerForm.value.confirmPassword;
});

const handleRegister = async () => {
  if (!isFormValid.value) {
    errorMessage.value = 'Please fill in all fields correctly';
    return;
  }

  loading.value = true;
  errorMessage.value = '';
  
  try {
    const response = await $axios.post('/auth/register', {
      firstName: registerForm.value.firstName,
      lastName: registerForm.value.lastName,
      email: registerForm.value.email,
      password: registerForm.value.password,
      role: registerForm.value.role
    });
    
    if (response.data.access_token) {
      // Store the JWT token
      localStorage.setItem('accessToken', response.data.access_token);
      localStorage.setItem('refreshToken', response.data.refresh_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      $toast.success('Account created successfully!');
      
      // Redirect to the existing signup page for additional profile setup
      await navigateTo('/signup');
    }
  } catch (error) {
    console.error('Registration error:', error);
    errorMessage.value = error.response?.data?.message || 'Registration failed. Please try again.';
    $toast.error(errorMessage.value);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.page-background {
  background-color: #F3EADA;
  min-height: 100vh;
  width: 100%;
  position: relative;
}

.logo {
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
}

.container{
  position: absolute;
  top: 15%;
  right: 10%;
  width: 30%;
  height: 70%;
}

.container h1{
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
}

.form{
  margin-top: 5%;
  width: 100%;
  min-height: 92%;
  border-radius: 10px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  background-color: #e4d6c0;
  padding: 20px 0;
  overflow: hidden;
}

.input-container{
  margin-left: 10%;
  margin-bottom: 2%;
  width: 80%;
  align-items: left;
}

.input-container label{
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 10px;
}

.from-input-box{
  width: 100%;
  height: 40px;
  border-radius: 15px;
  border: 1px solid #ccc;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.1);
  padding: 10px 15px;
  background-color: white;
  font-size: 14px;
}

.button-next{
  margin-left: 10%;
  width: 80%;
  height: 50px;
  border-radius: 5px;
  border: 1px solid #ccc;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.1);
  padding: 5px;
  background-color: #FFA17A;
  color: #993300;
  text-align: center;
  align-content: center;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  margin-top: 20px;
}

.button-next:hover{
  background-color: #E5946B;
}

.button-next:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.link-button {
  background-color: #015B59;
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
}

.link-button:hover {
  background-color: #3a7b70;
}
</style> 