// Configuration
const API_CONFIG = {
  // API endpoint configuration for local and production environments
  // Development: http://localhost:5000
  // Production: Update this to your deployed backend URL
  baseUrl: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'  // Local development
    : 'https://your-backend-url.herokuapp.com', // Replace with your production backend URL
  submitEndpoint: '/api/contact/submit'
};

// Validation rules
const VALIDATION_RULES = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 100,
    pattern: /^[a-zA-Z\s'-]+$/,
    message: 'Name must be 2-100 characters and contain only letters, spaces, hyphens, and apostrophes'
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address'
  },
  subject: {
    required: false,
    maxLength: 200,
    message: 'Subject must not exceed 200 characters'
  },
  message: {
    required: true,
    minLength: 10,
    maxLength: 5000,
    message: 'Message must be between 10 and 5000 characters'
  },
  file: {
    maxSize: 5242880, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    message: 'File must be PDF, DOC, DOCX, JPG, or PNG and not exceed 5MB'
  }
};

// Contact Form Handler
document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.querySelector('.contact-form form');
  
  if (contactForm) {
    // Initialize real-time validation for all fields
    initializeFieldValidation(contactForm);
    
    contactForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      // Validate all fields before submission
      if (!validateAllFields(contactForm)) {
        showNotification('error', 'Please fix the errors before submitting.');
        return;
      }
      
      // Get form data
      const nameInput = contactForm.querySelector('input[placeholder="Your Name"]');
      const emailInput = contactForm.querySelector('input[placeholder="Your Email"]');
      const subjectInput = contactForm.querySelector('input[placeholder="Subject"]');
      const messageInput = contactForm.querySelector('textarea[placeholder="Your Message"]');
      const fileInput = contactForm.querySelector('input[type="file"]');
      
      const formData = new FormData();
      formData.append('name', nameInput.value.trim());
      formData.append('email', emailInput.value.trim());
      formData.append('subject', subjectInput.value.trim());
      formData.append('message', messageInput.value.trim());
      
      // Add file if present
      if (fileInput && fileInput.files.length > 0) {
        formData.append('file', fileInput.files[0]);
      }
      
      // Disable submit button and show loading state
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      
      try {
        // Send request to backend
        const apiUrl = `${API_CONFIG.baseUrl}${API_CONFIG.submitEndpoint}`;
        
        const response = await fetch(apiUrl, {
          method: 'POST',
          body: formData
        });
        
        const data = await response.json();
        
        if (data.success) {
          // Show success message
          showNotification('success', data.message || 'Your message has been sent successfully! We will contact you soon.');
          contactForm.reset();
          clearFieldErrors(contactForm);
          
          // Log to console for debugging
          console.log('Form submitted successfully:', data);
        } else {
          // Show error message
          const errorMsg = data.errors && data.errors.length > 0
            ? data.errors[0].msg || data.message
            : data.message || 'Failed to send your message. Please try again.';
          showNotification('error', errorMsg);
          
          // Display field-specific errors
          if (data.errors && Array.isArray(data.errors)) {
            data.errors.forEach(error => {
              const field = contactForm.querySelector(`input[placeholder="${error.param}"], textarea[placeholder="${error.param}"]`);
              if (field) {
                displayFieldError(field, error.msg);
              }
            });
          }
        }
      } catch (error) {
        console.error('Form submission error:', error);
        
        // Check if error is due to server not running
        if (error.message.includes('Failed to fetch') || error instanceof TypeError) {
          showNotification('error', 'Server is not responding. Please ensure the backend is running.');
        } else {
          showNotification('error', 'An error occurred. Please try again later.');
        }
      } finally {
        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });
  }
});

// Initialize real-time field validation
function initializeFieldValidation(form) {
  const fields = form.querySelectorAll('input[type="text"], input[type="email"], textarea, input[type="file"]');
  
  fields.forEach(field => {
    field.addEventListener('blur', function() {
      validateField(this);
    });
    
    field.addEventListener('input', function() {
      if (this.classList.contains('error')) {
        validateField(this);
      }
    });
  });
}

// Validate individual field
function validateField(field) {
  const placeholder = field.placeholder;
  const value = field.value.trim();
  let isValid = true;
  let errorMsg = '';
  
  // Determine field type
  let fieldType = placeholder.toLowerCase();
  if (placeholder.includes('Name')) fieldType = 'name';
  if (placeholder.includes('Email')) fieldType = 'email';
  if (placeholder.includes('Subject')) fieldType = 'subject';
  if (placeholder.includes('Message')) fieldType = 'message';
  if (field.type === 'file') fieldType = 'file';
  
  const rules = VALIDATION_RULES[fieldType];
  
  if (rules) {
    // Check required
    if (rules.required && value === '') {
      isValid = false;
      errorMsg = `${placeholder} is required`;
    }
    // Check min length
    else if (rules.minLength && value.length < rules.minLength && value !== '') {
      isValid = false;
      errorMsg = `${placeholder} must be at least ${rules.minLength} characters`;
    }
    // Check max length
    else if (rules.maxLength && value.length > rules.maxLength) {
      isValid = false;
      errorMsg = `${placeholder} must not exceed ${rules.maxLength} characters`;
    }
    // Check pattern
    else if (rules.pattern && value !== '' && !rules.pattern.test(value)) {
      isValid = false;
      errorMsg = rules.message;
    }
    // Check file size and type
    else if (fieldType === 'file' && field.files.length > 0) {
      const file = field.files[0];
      if (file.size > rules.maxSize) {
        isValid = false;
        errorMsg = `File must be smaller than 5MB`;
      } else if (!rules.allowedTypes.includes(file.type)) {
        isValid = false;
        errorMsg = 'File type not allowed. Use PDF, DOC, DOCX, JPG, or PNG';
      }
    }
  }
  
  // Update field state
  if (isValid) {
    field.classList.remove('error');
    clearFieldError(field);
  } else if (value !== '' || rules.required) {
    field.classList.add('error');
    displayFieldError(field, errorMsg);
  }
  
  return isValid;
}

// Validate all fields
function validateAllFields(form) {
  const fields = form.querySelectorAll('input[type="text"], input[type="email"], textarea, input[type="file"]');
  let allValid = true;
  
  fields.forEach(field => {
    if (!validateField(field)) {
      allValid = false;
    }
  });
  
  return allValid;
}

// Display field error
function displayFieldError(field, message) {
  let errorElement = field.nextElementSibling;
  
  if (!errorElement || !errorElement.classList.contains('error-message')) {
    errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    field.parentNode.insertBefore(errorElement, field.nextSibling);
  }
  
  errorElement.textContent = message;
  errorElement.style.display = 'block';
}

// Clear field error
function clearFieldError(field) {
  const errorElement = field.nextElementSibling;
  if (errorElement && errorElement.classList.contains('error-message')) {
    errorElement.style.display = 'none';
  }
}

// Clear all field errors
function clearFieldErrors(form) {
  const errorElements = form.querySelectorAll('.error-message');
  errorElements.forEach(el => {
    el.style.display = 'none';
  });
}

// Notification helper
function showNotification(type, message) {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
      <span>${message}</span>
    </div>
  `;
  
  // Add styles
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 16px 24px;
    border-radius: 8px;
    background-color: ${type === 'success' ? '#4CAF50' : '#f44336'};
    color: white;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 10000;
    animation: slideIn 0.3s ease-in-out;
    max-width: 400px;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 12px;
  `;
  
  // Add animation styles if not already present
  const style = document.querySelector('style[data-notification]');
  if (!style) {
    const newStyle = document.createElement('style');
    newStyle.setAttribute('data-notification', 'true');
    newStyle.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(450px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      @keyframes slideOut {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(450px);
          opacity: 0;
        }
      }
      
      .error-message {
        color: #f44336;
        font-size: 12px;
        margin-top: 4px;
        display: none;
      }
      
      input.error,
      textarea.error {
        border-color: #f44336 !important;
        background-color: #ffebee !important;
      }
      
      .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      
      .notification-content i {
        flex-shrink: 0;
      }
    `;
    document.head.appendChild(newStyle);
  }
  
  // Add to body
  document.body.appendChild(notification);
  
  // Remove after 5 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-in-out forwards';
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 5000);
}
