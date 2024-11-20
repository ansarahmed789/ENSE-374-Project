function togglePasswordVisibility() {
  const passwordField = document.getElementById('password');
  const eyeIcon = document.getElementById('eye-icon');
  if (passwordField.type === 'password') {
    passwordField.type = 'text';
    eyeIcon.textContent = '-';
  } else {
    passwordField.type = 'password';
    eyeIcon.textContent = '👁';
  }
}
