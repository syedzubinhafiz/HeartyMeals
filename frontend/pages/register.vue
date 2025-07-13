<template>
  <div class="auth-layout">
    <!-- Logo Section - Hidden on mobile, visible on desktop -->
    <div class="logo-section">
      <img src="@/assets/img/HeartyMealLargeLogo.svg" alt="Hearty Meal" class="logo-image">
    </div>
    
    <!-- Mobile Logo - Only visible on mobile -->
    <div class="mobile-logo">
      <img src="@/assets/img/HeartyMealLargeLogo.svg" alt="Hearty Meal">
    </div>
    
    <!-- Form Section -->
    <div class="form-section">
      <img src="@/assets/img/GreenCurve.png" class="curve-decoration" alt="Green Curve Decor">
      <img src="@/assets/img/brownBlob.svg" class="blob-decoration" alt="Brown Blob Decor">
      
      <div class="form-container">
        <div class="form-card">
          <H1>Create an account</H1>
          
          <form @submit.prevent="handleRegister" class="space-y-4">
            <div class="form-row">
              <div class="input-group">
                <label for="firstName" class="form-label">First Name</label>
                <Input 
                  v-model="registerForm.firstName" 
                  type="text" 
                  id="firstName"
                  placeholder="Enter your first name"
                  required
                  class="mt-1"
                />
              </div>
              
              <div class="input-group">
                <label for="lastName" class="form-label">Last Name</label>
                <Input 
                  v-model="registerForm.lastName" 
                  type="text" 
                  id="lastName"
                  placeholder="Enter your last name"
                  required
                  class="mt-1"
                />
              </div>
            </div>
            
            <div class="input-group">
              <label for="email" class="form-label">Email</label>
              <Input 
                v-model="registerForm.email" 
                type="email" 
                id="email"
                placeholder="Enter your email"
                required
                class="mt-1"
              />
            </div>
            
            <div class="input-group">
              <label for="password" class="form-label">Password</label>
              <Input 
                v-model="registerForm.password" 
                type="password" 
                id="password"
                placeholder="Enter your password (min 8 characters)"
                required
                class="mt-1"
              />
              <small class="password-hint">
                Password must be at least 8 characters long
              </small>
            </div>
            
            <div class="input-group">
              <label for="confirmPassword" class="form-label">Confirm Password</label>
              <Input 
                v-model="registerForm.confirmPassword" 
                type="password" 
                id="confirmPassword"
                placeholder="Confirm your password"
                required
                class="mt-1"
              />
            </div>
            
            <div class="input-group">
              <label for="role" class="form-label">Account Type</label>
              <select 
                v-model="registerForm.role" 
                id="role"
                class="form-select"
              >
                <option value="Patient">Patient</option>
                <option value="Dietitian">Dietitian</option>
              </select>
            </div>
            
            <div class="flex justify-center space-x-4">
              <ButtonOrange 
                type="submit" 
                :disabled="loading || !isFormValid"
                class="register-button"
              >
                {{ loading ? 'Creating Account...' : 'Create Account' }}
              </ButtonOrange>
            </div>
          </form>
          
          <div v-if="errorMessage" class="text-red-600 text-center">
            {{ errorMessage }}
          </div>
          
          <div class="text-center">
            <P style="margin-bottom: 10px;">Already have an account?</P>
            <button @click="async () => await navigateTo('/sign-in')" class="link-button">
              Sign in here
            </button>
          </div>
        </div>
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
/* =================================== */
/*        RESPONSIVE AUTH LAYOUT        */
/* =================================== */

.auth-layout {
  display: flex;
  min-height: 100vh;
  position: relative;
}

/* Desktop Layout */
@media (min-width: 768px) {
  .auth-layout {
    flex-direction: row;
  }
  
  .logo-section {
    display: flex;
    width: 40%;
    background: #015B59;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }
  
  .logo-image {
    max-width: 280px;
    width: 100%;
    height: auto;
  }
  
  .mobile-logo {
    display: none;
  }
  
  .form-section {
    width: 60%;
    position: relative;
    background: #DAC2A8;
  }
}

/* Mobile Layout */
@media (max-width: 767px) {
  .auth-layout {
    flex-direction: column;
  }
  
  .logo-section {
    display: none;
  }
  
  .mobile-logo {
    display: flex;
    justify-content: center;
    padding: 1.5rem 1rem 1rem;
    background: #015B59;
  }
  
  .mobile-logo img {
    max-width: 200px;
    width: 80%;
    height: auto;
  }
  
  .form-section {
    flex: 1;
    background: #DAC2A8;
    position: relative;
  }
}

/* =================================== */
/*           DECORATIVE ELEMENTS        */
/* =================================== */

.curve-decoration {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  object-fit: cover;
  z-index: 1;
}

.blob-decoration {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 320px;
  height: 320px;
  object-fit: cover;
  object-position: 220px 120px;
  z-index: 1;
}

/* Mobile decorations */
@media (max-width: 767px) {
  .curve-decoration {
    display: none;
  }
  
  .blob-decoration {
    width: 200px;
    height: 200px;
    opacity: 0.6;
  }
}

/* =================================== */
/*            FORM CONTAINER           */
/* =================================== */

.form-container {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  padding: 2rem 1rem;
}

@media (max-width: 767px) {
  .form-container {
    padding: 1rem;
    align-items: flex-start;
    padding-top: 2rem;
  }
}

.form-card {
  background: #F3EADA;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 480px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

@media (max-width: 767px) {
  .form-card {
    padding: 1.5rem;
    margin: 0;
    border-radius: 12px;
    max-width: none;
    gap: 1.25rem;
  }
}

/* =================================== */
/*              FORM STYLES            */
/* =================================== */

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

@media (max-width: 480px) {
  .form-row {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

.input-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 100%;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
  align-self: flex-start;
}

.input-group :deep(input) {
  width: 100%;
  max-width: 400px;
}

.form-select {
  width: 100%;
  max-width: 400px;
  min-height: 44px;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background-color: white;
  font-size: 14px;
  transition: border-color 0.2s ease;
}

.form-select:focus {
  outline: none;
  border-color: #83BBBE;
  box-shadow: 0 0 0 3px rgba(131, 187, 190, 0.1);
}

@media (max-width: 767px) {
  .form-select {
    font-size: 16px;
  }
}

.password-hint {
  color: #6b7280;
  font-size: 12px;
  margin-top: 4px;
  display: block;
}

.link-button {
  background-color: #015B59;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 24px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  min-height: 44px;
}

.link-button:hover {
  background-color: #3a7b70;
  transform: translateY(-1px);
}

@media (max-width: 767px) {
  .link-button {
    width: 100%;
    padding: 14px 24px;
    font-size: 16px;
  }
}

/* =================================== */
/*           RESPONSIVE FORM           */
/* =================================== */

@media (max-width: 767px) {
  :deep(input) {
    min-height: 44px;
    font-size: 16px;
    padding: 12px 16px;
  }
  
  :deep(button) {
    min-height: 44px;
    font-size: 16px;
  }
  
  :deep(h1) {
    font-size: 1.75rem;
    text-align: center;
  }
}

/* =================================== */
/*            ACCESSIBILITY            */
/* =================================== */

.link-button:focus {
  outline: 2px solid #83BBBE;
  outline-offset: 2px;
}

@media (prefers-contrast: high) {
  .form-select {
    border-width: 2px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .link-button {
    transition: none;
  }
  
  .link-button:hover {
    transform: none;
  }
}
</style> 