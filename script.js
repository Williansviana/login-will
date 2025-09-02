const passwordList = document.getElementById("passwordList");
let items = [];

// Mostrar email do usuário
auth.onAuthStateChanged(user => {
  if (user) {
    document.getElementById("userEmail").textContent = user.email;
    loadPasswords();
  } else {
    window.location.href = "index.html";
  }
});

// Carregar senhas do Firestore
function loadPasswords() {
  const user = auth.currentUser;
  if (!user) return;

  db.collection("users")
    .doc(user.uid)
    .collection("passwords")
    .onSnapshot(snapshot => {
      items = [];
      snapshot.forEach(doc => {
        items.push({ id: doc.id, ...doc.data() });
      });
      renderList();
    });
}

// Adicionar nova senha
function addItem() {
  const site = document.getElementById("site").value.trim();
  const login = document.getElementById("login").value.trim();
  const senha = document.getElementById("senha").value.trim();
  const user = auth.currentUser;

  if (!site || !login || !senha) {
    alert("Preencha todos os campos!");
    return;
  }

  db.collection("users")
    .doc(user.uid)
    .collection("passwords")
    .add({
      site,
      login,
      senha,
      createdAt: new Date()
    })
    .then(() => {
      document.getElementById("site").value = "";
      document.getElementById("login").value = "";
      document.getElementById("senha").value = "";
    })
    .catch(err => {
      alert("Erro ao salvar: " + err.message);
    });
}

// Renderizar lista
function renderList() {
  passwordList.innerHTML = "";
  if (items.length === 0) {
    passwordList.innerHTML = "<li><em>Nenhum login salvo ainda.</em></li>";
    return;
  }
  items.forEach(item => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${escapeHtml(item.site)}</strong><br>
      Login: ${escapeHtml(item.login)}<br>
      Senha: ${escapeHtml(item.senha)}
    `;
    passwordList.appendChild(li);
  });
}

// Proteção contra XSS
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Logout
function logout() {
  auth.signOut().then(() => {
    window.location.href = "index.html";
  });
}