(function () {
  const storage = {
    get(key, fallback) {
      try {
        return JSON.parse(localStorage.getItem(key)) ?? fallback;
      } catch {
        return fallback;
      }
    },
    set(key, value) {
      localStorage.setItem(key, JSON.stringify(value));
    },
    remove(key) {
      localStorage.removeItem(key);
    }
  };

  window.IMT = { storage };

  const showToast = (message, type = 'info') => {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    window.setTimeout(() => toast.remove(), 2600);
  };

  window.IMT.showToast = showToast;

  const savedTheme = storage.get('imt_theme', 'light');
  document.body.classList.toggle('is-dark', savedTheme === 'dark');

  document.addEventListener('click', (event) => {
    const actionButton = event.target.closest('[data-action]');
    if (!actionButton) return;

    const action = actionButton.dataset.action;

    if (action === 'theme') {
      const isDark = document.body.classList.toggle('is-dark');
      storage.set('imt_theme', isDark ? 'dark' : 'light');
      showToast(isDark ? 'Tema escuro ativado' : 'Tema claro ativado');
    }

    if (action === 'logout') {
      storage.remove('imt_user');
      storage.remove('imt_token');
      showToast('Sessão encerrada');
      window.setTimeout(() => {
        window.location.href = actionButton.dataset.redirect || 'index.html';
      }, 500);
    }
  });

  document.querySelectorAll('.nav-link[href]').forEach((link) => {
    const linkPath = new URL(link.href, window.location.href).pathname;
    if (linkPath === window.location.pathname) {
      link.classList.add('active');
    }
  });

  const form = document.querySelector('[data-form]');
  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());

      if (form.dataset.form === 'register') {
        storage.set('imt_user', { nome: data.nome, email: data.email });
        storage.set('imt_token', `local-${Date.now()}`);
        showToast('Cadastro criado localmente. Backend pronto para conexão.', 'success');
      }

      if (form.dataset.form === 'login') {
        storage.set('imt_user', { nome: data.email.split('@')[0], email: data.email });
        storage.set('imt_token', `local-${Date.now()}`);
        showToast('Login realizado localmente.', 'success');
      }

      window.setTimeout(() => {
        window.location.href = 'index.html';
      }, 700);
    });
  }
})();
