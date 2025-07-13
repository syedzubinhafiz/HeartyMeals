<template>
  <div class="auth-layout">
    <!-- Logo Section - Hidden on mobile, visible on desktop -->
    <div class="logo-section">
      <img src="../assets/img/HeartyMealLargeLogo.svg" alt="Hearty Meal" class="logo-image">
    </div>
    
    <!-- Mobile Logo - Only visible on mobile -->
    <div class="mobile-logo">
      <img src="../assets/img/HeartyMealLargeLogo.svg" alt="Hearty Meal">
    </div>
    
    <!-- Form Section -->
    <div class="form-section">
      <img src="../assets/img/GreenCurve.png" class="curve-decoration" alt="Green Curve Decor">
      <img src="../assets/img/brownBlob.svg" class="blob-decoration" alt="Brown Blob Decor">
      
      <div class="form-container">
        <div class="form-card">
          <H1>Sign in to your account</H1>
          <H2>Welcome back 👋</H2>
          
          <!-- Demo Mode Notice -->
          <div class="demo-notice">
            <div class="demo-header">
              <span class="demo-badge">DEMO MODE</span>
            </div>
            <p class="demo-text">Use these credentials to try the application:</p>
            <div class="demo-credentials">
              <p><strong>Email:</strong> patient1@demo.com</p>
              <p><strong>Password:</strong> Patient123!</p>
            </div>
          </div>
          
          <form @submit.prevent="handleLogin" class="space-y-4">
            <div class="input-group">
              <label for="email" class="form-label">Email</label>
              <Input 
                v-model="loginForm.email" 
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
                v-model="loginForm.password" 
                type="password" 
                id="password"
                placeholder="Enter your password"
                required
                class="mt-1"
              />
            </div>
            
            <div class="flex justify-center space-x-4">
              <ButtonOrange type="submit" :disabled="loading">
                {{ loading ? 'Signing in...' : 'Sign In' }}
              </ButtonOrange>
            </div>
          </form>
          
          <div class="text-center">
            <P style="margin-bottom: 10px;">Don't have an account?</P>
            <button @click="async () => await navigateTo('/register')" class="link-button">
              Sign up here
            </button>
          </div>
          
          <div v-if="errorMessage" class="text-red-600 text-center">
            {{ errorMessage }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineOptions({
  name: "SignInPage",
});

definePageMeta({
  layout: "emptylayout"
});

const { $axios } = useNuxtApp();
const { $toast } = useNuxtApp();

const loginForm = ref({
  email: '',
  password: ''
});

const loading = ref(false);
const errorMessage = ref('');

const handleLogin = async () => {
  loading.value = true;
  errorMessage.value = '';
  
  try {
    const response = await $axios.post('/auth/login', {
      email: loginForm.value.email,
      password: loginForm.value.password
    });
    
    if (response.data.access_token) {
      // Store the JWT token
      localStorage.setItem('accessToken', response.data.access_token);
      localStorage.setItem('refreshToken', response.data.refresh_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      $toast.success('Login successful!');
      
      // Check user role and redirect accordingly
      if (response.data.user.user_role === 'Admin') {
        await navigateTo('/admin');
      } else {
        // Note: Dietitians currently redirect to home until TASK-004 is implemented
        await navigateTo('/home');
      }
    }
  } catch (error) {
    console.error('Login error:', error);
    errorMessage.value = error.response?.data?.message || 'Login failed. Please try again.';
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
  max-width: 420px;
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
  min-height: 44px; /* Touch target size */
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
/*          DEMO MODE NOTICE           */
/* =================================== */

.demo-notice {
  background: linear-gradient(135deg, #E2F3F4 0%, #f0f8f8 100%);
  border: 2px solid #83BBBE;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(131, 187, 190, 0.15);
}

@media (max-width: 767px) {
  .demo-notice {
    padding: 14px;
  }
}

.demo-header {
  text-align: center;
  margin-bottom: 12px;
}

.demo-badge {
  background: linear-gradient(45deg, #83BBBE, #9fc9cc);
  color: white;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  box-shadow: 0 2px 8px rgba(131, 187, 190, 0.3);
}

.demo-text {
  color: #5a9a9e;
  font-size: 14px;
  text-align: center;
  margin: 8px 0;
  font-weight: 500;
}

.demo-credentials {
  background: rgba(255, 255, 255, 0.7);
  border-radius: 8px;
  padding: 12px;
  border-left: 4px solid #83BBBE;
}

.demo-credentials p {
  margin: 4px 0;
  font-size: 13px;
  color: #5a9a9e;
  word-break: break-all; /* Ensure email doesn't overflow on small screens */
}

@media (max-width: 480px) {
  .demo-credentials p {
    font-size: 12px;
  }
}

.demo-credentials strong {
  color: #4a8a8e;
  font-weight: 600;
}

/* =================================== */
/*           RESPONSIVE FORM           */
/* =================================== */

/* Ensure form inputs are touch-friendly */
@media (max-width: 767px) {
  :deep(input) {
    min-height: 44px;
    font-size: 16px; /* Prevents zoom on iOS */
    padding: 12px 16px;
  }
  
  :deep(button) {
    min-height: 44px;
    font-size: 16px;
  }
  
  /* Typography adjustments for mobile */
  :deep(h1) {
    font-size: 1.75rem;
    text-align: center;
  }
  
  :deep(h2) {
    font-size: 1.25rem;
    text-align: center;
  }
}

/* =================================== */
/*            ACCESSIBILITY            */
/* =================================== */

/* Focus states for keyboard navigation */
.link-button:focus {
  outline: 2px solid #83BBBE;
  outline-offset: 2px;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .demo-notice {
    border-width: 3px;
  }
  
  .demo-badge {
    background: #015B59;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .link-button {
    transition: none;
  }
  
  .link-button:hover {
    transform: none;
  }
}
</style>
  