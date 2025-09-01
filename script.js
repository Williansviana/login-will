// Obter usuário logado
const currentUser = localStorage.getItem("currentUser");
let items = [];

// Mostrar usuário no topo
document.getElementById("userDisplay").textContent = currentUser || "Usuário";

// Carregar itens do usuário
function loadItems() {
  const saved = localStorage.getItem(`passwords_${currentUser}`);
  items = saved ? JSON.parse(saved) : [];
  renderList();
}

// Adicionar novo item
function addItem() {
  const site = document.getElementById("site").value.trim();
  const login = document.getElementById("login").value.trim();
  const senha = document.getElementById("senha").value.trim();

  if (!site || !login || !senha) {
    alert("Preencha todos os campos!");
    return;
  }

  items.push({ site, login, senha });
  saveItems();
  renderList();

  // Limpar campos
  document.getElementById("site").value = "";
  document.getElementById("login").value = "";
  document.getElementById("senha").value = "";
}

// Salvar no localStorage
function saveItems() {
  localStorage.setItem(`passwords_${currentUser}`, JSON.stringify(items));
}

// Renderizar lista
function renderList() {
  const list = document.getElementById("passwordList");
  list.innerHTML = "";
  if (items.length === 0) {
    list.innerHTML = "<li><em>Nenhum login salvo ainda.</em></li>";
    return;
  }
  items.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${escapeHtml(item.site)}</strong><br>
      Login: ${escapeHtml(item.login)}<br>
      Senha: ${escapeHtml(item.senha)}
      <button onclick="deleteItem(${index})" style="float: right; background: #e74c3c; color: white; border: none; padding: 2px 6px; font-size: 12px; border-radius: 3px;">X</button>
    `;
    list.appendChild(li);
  });
}

// Excluir item
function deleteItem(index) {
  items.splice(index, 1);
  saveItems();
  renderList();
}

// Proteção contra XSS
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Carregar ao iniciar
window.onload = function () {
  if (!currentUser) {
    window.location.href = "index.html";
  } else {
    loadItems();
  }
};

// Sair da conta
function logoutAll() {
  localStorage.removeItem("currentUser");
  localStorage.removeItem("authenticated");
  window.location.href = "index.html";
}