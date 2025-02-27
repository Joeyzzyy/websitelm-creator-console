<template>
  <div class="auth-container">
    <div class="auth-loader">
      <div class="spinner"></div>
      <p>{{ message }}</p>
    </div>
  </div>
</template>

<script>
import api from '../api/api';

export default {
  name: 'Auth',
  data() {
    return {
      message: 'Authenticating, please wait...'
    };
  },
  created() {
    this.processToken();
  },
  methods: {
    processToken() {
      // Get token from URL
      const token = this.$route.query.token;
      const customerId = this.$route.query.customerId;
      const customerEmail = this.$route.query.customerEmail;
      
      if (!token) {
        this.message = 'No valid authentication information found';
        setTimeout(() => {
          this.$router.replace('/login');
        }, 1500);
        return;
      }
      
      try {
        // Store token
        localStorage.setItem('accessToken', token);
        localStorage.setItem('intelickIsLoggedIn', 'true');
        
        // Store customerId and customerEmail if available
        if (customerId) {
          localStorage.setItem('currentCustomerId', customerId);
        }
        
        if (customerEmail) {
          localStorage.setItem('customerEmail', customerEmail);
        }
        
        // Validate token
        this.validateTokenAndRedirect();
      } catch (error) {
        console.error('Error processing authentication:', error);
        this.message = 'Error during authentication process';
        setTimeout(() => {
          this.$router.replace('/login');
        }, 1500);
      }
    },
    
    // Optional: Validate token
    async validateTokenAndRedirect() {
      try {
        // Call API to validate token
        const userInfo = await api.getUserInfo();
        
        if (userInfo) {
          // Token is valid, redirect to dashboard
          this.$router.replace('/dashboard');
        } else {
          // Token is invalid
          this.message = 'Authentication information is invalid';
          localStorage.removeItem('accessToken');
          localStorage.removeItem('intelickIsLoggedIn');
          localStorage.removeItem('currentCustomerId');
          localStorage.removeItem('customerEmail');
          
          setTimeout(() => {
            this.$router.replace('/login');
          }, 1500);
        }
      } catch (error) {
        // API call failed, token might be invalid
        console.error('Error validating token:', error);
        this.message = 'Failed to validate authentication';
        
        localStorage.removeItem('accessToken');
        localStorage.removeItem('intelickIsLoggedIn');
        localStorage.removeItem('currentCustomerId');
        localStorage.removeItem('customerEmail');
        
        setTimeout(() => {
          this.$router.replace('/login');
        }, 1500);
      }
    }
  }
};
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
}

.auth-loader {
  text-align: center;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid #3498db;
  width: 40px;
  height: 40px;
  margin: 0 auto 1rem;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

p {
  color: #333;
  font-size: 16px;
  margin: 0;
}
</style> 