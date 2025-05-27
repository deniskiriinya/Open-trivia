// Set a cookie
function setCookie(name, value, days) {
  const expires = new Date(Date.now() + days * 86400000).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/`;
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

// Sign Up: Save username/password in localStorage
function signUp() {
  const user = document.getElementById('username').value;
  const pass = document.getElementById('password').value;

  if (user && pass) {
    localStorage.setItem(`user_${user}`, pass);
    setCookie('quizUser', user, 7); // Remember for 7 days
    document.getElementById('message').style.color = 'green';
    document.getElementById('message').innerText = 'Sign up successful!';
  } else {
    document.getElementById('message').innerText = 'Please fill all fields.';
  }
}

// Log In: Check user exists first
function logIn() {
  const user = document.getElementById('username').value;
  const pass = document.getElementById('password').value;
  const storedPass = localStorage.getItem(`user_${user}`);

  if (!storedPass) {
    document.getElementById('message').innerText = 'User not found. Please sign up first.';
    return;
  }

  if (pass === storedPass) {
    setCookie('quizUser', user, 7);
    window.location.href = 'quiz.html'; // Redirect to quiz page
  } else {
    document.getElementById('message').innerText = 'Incorrect password.';
  }
  // Simulate login state using localStorage
document.addEventListener("DOMContentLoaded", function () {
  const loginLink = document.getElementById("login-signup-link");
  const logoutLink = document.getElementById("logout-link");

  // Check if user is logged in
  const user = localStorage.getItem("user");

  if (user) {
    loginLink.style.display = "none";
    logoutLink.style.display = "inline";
  } else {
    loginLink.style.display = "inline";
    logoutLink.style.display = "none";
  }

  // Logout click event
  logoutLink.addEventListener("click", function (e) {
    e.preventDefault();
    localStorage.removeItem("user");
    window.location.href = "login.html";
  });
});

}