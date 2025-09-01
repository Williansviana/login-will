// Função para alternar entre abas
function openTab(tabName) {
  const tabs = document.getElementsByClassName("tab-content");
  const buttons = document.querySelectorAll(".tab-btn");

  for (let i = 0; i < tabs.length; i++) {
    tabs[i].classList.remove("active");
    buttons[i].classList.remove("active");
  }

  if (tabName === "login") {
    document.getElementById("loginForm").classList.add("active");
    document.getElementById("loginTabBtn").classList.add("active");
  } else {
    document.getElementById("registerForm").classList.add("active");
    document.getElementById("registerTabBtn").classList.add("active");
  }
}

// 📝 Cadastrar novo usuário
function register() {
  const username = document.getElementById("regUsername").value.trim();
  const password = document.getElementById("regPassword").value;
  const confirm = document.getElementById("regConfirmPassword").value;
  const error = document.getElementById("registerError");

  error.textContent = "";
  error.style.display = "none";

  if (username === "" || password === "") {
    showError("registerError", "Preencha todos os campos.");
    return;
  }

  if (password !== confirm) {
    showError("registerError", "As senhas não coincidem.");
    return;
  }

  // Verifica se usuário já existe
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  if (users.some(u => u.username === username)) {
    showError("registerError", "Usuário já existe.");
    return;
  }

  // Salva novo usuário (com senha armazenada como hash simples — só para exemplo)
  // Em produção: use PBKDF2, Argon2, etc.
  users.push({
    username,
    password: btoa(password) // Base64 (apenas para exemplo — NÃO use em produção real)
  });
  localStorage.setItem("users", JSON.stringify(users));
  showMessage("✅ Cadastro realizado! Agora você pode entrar.");
  clearForms();
  openTab("login");
}

// 🔐 Login
function login() {
  const username = document.getElementById("loginUsername").value.trim();
  const password = document.getElementById("loginPassword").value;
  const error = document.getElementById("loginError");

  error.textContent = "";
  error.style.display = "none";

  if (username === "" || password === "") {
    showError("loginError", "Preencha todos os campos.");
    return;
  }

  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const user = users.find(u => u.username === username);

  if (!user || user.password !== btoa(password)) {
    showError("loginError", "Usuário ou senha incorretos.");
    return;
  }

  // Salva que está autenticado
  localStorage.setItem("authenticated", "true");
  localStorage.setItem("currentUser", username);
  window.location.href = "vault.html";
}

// Mostra erro
function showError(elementId, message) {
  const el = document.getElementById(elementId);
  el.textContent = message;
  el.style.display = "block";
}

// Limpa formulários
function clearForms() {
  document.getElementById("regUsername").value = "";
  document.getElementById("regPassword").value = "";
  document.getElementById("regConfirmPassword").value = "";
}

// Mostra mensagem temporária
function showMessage(text) {
  const toast = document.createElement("div");
  toast.textContent = text;
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #2ecc71;
    color: white;
    padding: 12px 16px;
    border-radius: 6px;
    font-size: 14px;
    z-index: 1000;
    opacity: 1;
    transition: opacity 0.5s;
  `;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => document.body.removeChild(toast), 500);
  }, 3000);
}

// Verifica autenticação ao carregar
window.onload = function () {
  const isAuthenticated = localStorage.getItem("authenticated") === "true";
  const isVaultPage = window.location.pathname.endsWith("vault.html");

  if (isVaultPage && !isAuthenticated) {
    window.location.href = "index.html";
  }

  // Abre aba de login por padrão
  if (document.getElementById("loginForm")) {
    openTab("login");
  }
};