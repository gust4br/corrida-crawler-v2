export const LoginSelectors = {
  emailInput: "#user_login",
  passwordInput: "#user_password",
  submitButton: "input[type='submit']",
} as const;

export const RegisterSelectors = {
  nameInput: "#user_name",
  cpfInput: "#user_cpf",
  emailInput: "#user_email",
  phoneInput: "#user_phone",
  passwordInput: "#user_password",
  passwordConfirmationInput: "#user_password_confirmation",
  submitButton: 'input[type="submit"]',
} as const;

export const HomeSelectors = {
  emailInput: "#user_email",
  userMenu: ".user-menu",
  logoutButton: ".logout-button",
} as const;

// Podemos adicionar mais objetos para outras páginas conforme necessário
// export const HomeSelectors = { ... }
// export const ProfileSelectors = { ... }
