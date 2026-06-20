import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { auth } from './firebase-config.js';

// Initialize Lucide icons
lucide.createIcons();

const signupBtn = document.getElementById('signupBtn');
const passToggle = document.getElementById('passToggle');

// Toggle Password Visibility
passToggle.addEventListener('click', function() {
    const passInput = document.getElementById('passwordInput');
    const isPassword = passInput.type === 'password';
    passInput.type = isPassword ? 'text' : 'password';
    this.innerHTML = `<i data-lucide="${isPassword ? 'eye-off' : 'eye'}"></i>`;
    lucide.createIcons();
});

signupBtn.addEventListener('click', async () => {
  const email = document.getElementById('emailInput').value.trim();
  const password = document.getElementById('passwordInput').value;
  const confirmPassword = document.getElementById('confirmPasswordInput').value;

  if (!email || !password || !confirmPassword) {
    alert('Please fill in all fields.');
    return;
  }

  if (password !== confirmPassword) {
    alert('Passwords do not match!');
    return;
  }

  if (password.length < 6) {
    alert('Password should be at least 6 characters.');
    return;
  }

  signupBtn.classList.add('loading');
  signupBtn.textContent = 'Creating Account...';

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    alert('Account created successfully!');
    
    // Check if the newly created user is an admin
    const adminEmails = [
      "warmblanket05@gmail.com",
      "drparadoxkalita@gmail.com",
      "talukdaryuvraj8@gmail.com"
    ];

    if (adminEmails.includes(user.email.toLowerCase())) {
        window.location.href = 'dashboard.html';
    } else {
        window.location.href = 'landing.html';
    }
  } catch (error) {
    console.error("Signup Error:", error);
    alert(error.message);
  } finally {
    signupBtn.classList.remove('loading');
    signupBtn.textContent = 'Create Account';
  }
});
