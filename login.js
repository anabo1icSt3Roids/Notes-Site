import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { auth } from "./firebase-config.js";

// Initialize Lucide Icons
lucide.createIcons();

// Elements
const tabUser = document.getElementById("tabUser");
const tabAdmin = document.getElementById("tabAdmin");
const roleIndicator = document.getElementById("roleIndicator");
const loginBtn = document.getElementById("loginBtn");
const passToggle = document.getElementById("passToggle");

let selectedRole = "User";

// Admin Emails
const adminEmails = [
  "warmblanket05@gmail.com",
  "drparadoxkalita@gmail.com",
  "talukdaryuvraj8@gmail.com"
];

// Theme Update
function updateTheme(role) {
  selectedRole = role;
  const root = document.documentElement;

  if (role === "User") {
    tabUser.classList.add("active");
    tabAdmin.classList.remove("active");

    root.style.setProperty("--current-primary", "var(--user-primary)");
    root.style.setProperty("--current-bg", "var(--user-bg)");

    roleIndicator.innerHTML = `<i data-lucide="user"></i>`;
    loginBtn.textContent = "Sign in as User";
  } else {
    tabAdmin.classList.add("active");
    tabUser.classList.remove("active");

    root.style.setProperty("--current-primary", "var(--admin-primary)");
    root.style.setProperty("--current-bg", "var(--admin-bg)");

    roleIndicator.innerHTML = `<i data-lucide="shield"></i>`;
    loginBtn.textContent = "Sign in as Admin";
  }

  lucide.createIcons();
}

// Tab Listeners
tabUser.addEventListener("click", () => updateTheme("User"));
tabAdmin.addEventListener("click", () => updateTheme("Admin"));

// Password Toggle
passToggle.addEventListener("click", () => {
  const passInput = document.getElementById("passwordInput");
  const isHidden = passInput.type === "password";

  passInput.type = isHidden ? "text" : "password";
  passToggle.innerHTML = `<i data-lucide="${isHidden ? "eye-off" : "eye"}"></i>`;

  lucide.createIcons();
});

// Login
loginBtn.addEventListener("click", async () => {
  const email = document.getElementById("emailInput").value.trim().toLowerCase();
  const password = document.getElementById("passwordInput").value;

  if (!email || !password) {
    alert("Please enter email and password.");
    return;
  }

  loginBtn.disabled = true;
  loginBtn.textContent = "Authenticating...";

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const isAdmin = adminEmails.includes(user.email.toLowerCase());

    // Role Validation: Only block students from using the Admin tab
    if (selectedRole === "Admin" && !isAdmin) {
      alert("Access denied. You are not an admin.");
      return;
    }

    // Redirect: Identity-based redirection (Admins always go to Dashboard)
    if (isAdmin) {
      window.location.href = "dashboard.html";
    } else {
      window.location.href = "index.html";
    }

  } catch (error) {
    console.error(error);

    if (
      error.code === "auth/invalid-credential" ||
      error.code === "auth/user-not-found" ||
      error.code === "auth/wrong-password"
    ) {
      alert("Invalid email or password.");
    } else if (error.code === "auth/invalid-email") {
      alert("Invalid email format.");
    } else {
      alert("Login failed. Check your connection.");
    }
  } finally {
    loginBtn.disabled = false;
    loginBtn.textContent =
      selectedRole === "User" ? "Sign in as User" : "Sign in as Admin";
  }
});
