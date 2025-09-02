const passwordList = document.getElementById("passwordList");
const siteInput = document.getElementById("site");
const loginInput = document.getElementById("login");
const senhaInput = document.getElementById("senha");

const addButton = document.getElementById("addButton");
const saveEditButton = document.getElementById("saveEditButton");
const cancelEditButton = document.getElementById("cancelEditButton");

let editingId = null; // Armazena o ID do item que está sendo editado

// Mostrar email do usuário
auth.onAuthStateChanged(user => {
  if (user) {
    window.currentUser = user;
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
      passwordList.innerHTML = "";
      snapshot.forEach(doc => {
        const data = doc.data();
        const item = { id: doc.id, ...data };

        const li = document.createElement("li");
        li.innerHTML = `
          <strong>${escapeHtml(data.site)}</strong><br>
          Login: ${escapeHtml(data.login)}<br>
          Senha: ${escapeHtml(data.senha)}
          <div style="margin-top: 8px;">
            <button class="action-btn edit-btn" onclick="startEdit('${doc.id}', '${escapeHtml(data.site)}', '${escapeHtml(data.login)}', '${escapeHtml(data.senha)}')">Editar</button>
            <button class="action-btn delete-btn" onclick="deleteItem('${doc.id}')">Excluir</button>
          </div>
        `;
        passwordList.appendChild(li);
      });

      if (snapshot.size === 0) {
        const li = document.createElement("li");
        li.textContent = "Nenhum login salvo ainda.";
        passwordList.appendChild(li);
      }
    });
}

// Iniciar edição
function startEdit(id, site, login, senha) {
  editingId = id;
  siteInput.value = site;
  loginInput.value = login;
  senhaInput.value = senha;

  // Mudar os botões
  addButton.classList.add("hidden");
  saveEditButton.classList.remove("hidden");
  cancelEditButton.classList.remove("hidden");
}

// Salvar alterações
function saveEdit() {
  const site = siteInput.value.trim();
  const login = loginInput.value.trim();
  const senha = senhaInput.value.trim();

  if (!site || !login || !senha || !editingId) {
    alert("Preencha todos os campos!");
    return;
  }

  const user = auth.currentUser;
  db.collection("users")
    .doc(user.uid)
    .collection("passwords")
    .doc(editingId)
    .update({
      site,
      login,
      senha,
      updatedAt: new Date()
    })
    .then(() => {
      clearForm();
      showMessage("✅ Alterações salvas!");
    })
    .catch(err => {
      alert("Erro ao salvar: " + err.message);
    });
}

// Cancelar edição
function cancelEdit() {
  clearForm();
  showMessage("Edição cancelada.");
}

// Adicionar novo item
function addItem() {
  const site = siteInput.value.trim();
  const login = loginInput.value.trim();
  const senha = senhaInput.value.trim();
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
      clearForm();
    })
    .catch(err => {
      alert("Erro ao salvar: " + err.message);
    });
}

// Excluir item
function deleteItem(id) {
  if (!confirm("Tem certeza que deseja excluir este login?")) return;

  const user = auth.currentUser;
  db.collection("users")
    .doc(user.uid)
    .collection("passwords")
    .doc(id)
    .delete()
    .then(() => {
      showMessage("🗑️ Login excluído!");
    })
    .catch(err => {
      alert("Erro ao excluir: " + err.message);
    });
}

// Limpar formulário (voltar ao modo "adicionar")
function clearForm() {
  siteInput.value = "";
  loginInput.value = "";
  senhaInput.value = "";

  editingId = null;
  addButton.classList.remove("hidden");
  saveEditButton.classList.add("hidden");
  cancelEditButton.classList.add("hidden");
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

// Mensagem temporária
function showMessage(text) {
  const toast = document.createElement("div");
  toast.textContent = text;
  toast.style.cssText = `
    position: fixed; top: 20px; right: 20px; background: #2ecc71; color: white;
    padding: 12px 16px; border-radius: 6px; z-index: 1000; opacity: 1;
    transition: opacity 0.5s;
  `;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => document.body.removeChild(toast), 500);
  }, 3000);
}