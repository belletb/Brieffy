
(function(global) {
  'use strict';

  const CONFIG = {
    STORAGE_KEY: 'brieffy_user',
    SESSION_KEY: 'brieffy_session',
    TOKEN_KEY: 'brieffy_token',
    SESSION_DURATION: 3600000, // 1 hora em ms
  };

  const SecurityUtils = {

    escapeHtml(text) {
      const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
      };
      return String(text).replace(/[&<>"']/g, m => map[m]);
    },

    isValidEmail(email) {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
    },

    isValidPassword(password) {
      return password && password.length >= 6;
    },


    generateToken() {
      return Math.random().toString(36).substring(2) + Date.now().toString(36);
    },


    simpleHash(str) {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & 0xFFFFFFFF;
      }
      return hash.toString(36);
    }
  };

  const StorageManager = {
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (e) {
        console.error('Erro ao salvar no storage:', e);
        return false;
      }
    },

    get(key) {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      } catch (e) {
        console.error('Erro ao ler do storage:', e);
        return null;
      }
    },

    remove(key) {
      try {
        localStorage.removeItem(key);
        return true;
      } catch (e) {
        console.error('Erro ao remover do storage:', e);
        return false;
      }
    },

    clear() {
      try {
        Object.values(CONFIG).forEach(key => {
          if (typeof key === 'string') {
            localStorage.removeItem(key);
          }
        });
        return true;
      } catch (e) {
        console.error('Erro ao limpar storage:', e);
        return false;
      }
    }
  };

  const NotificationManager = {
    show(message, type = 'info') {
      const toast = document.createElement('div');
      toast.className = `toast-notification toast-${type}`;
      toast.textContent = message;
      toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${this.getColor(type)};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 9999;
        animation: slideIn 0.3s ease-out;
        max-width: 300px;
        font-weight: 500;
      `;

      document.body.appendChild(toast);

      setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    },

    getColor(type) {
      const colors = {
        success: '#4CAF50',
        error: '#dc3545',
        warning: '#ffc107',
        info: '#0dcaf0'
      };
      return colors[type] || colors.info;
    }
  };

  const SessionManager = {
    create(user, remember = false) {
      const session = {
        user,
        token: SecurityUtils.generateToken(),
        createdAt: Date.now(),
        expiresAt: Date.now() + CONFIG.SESSION_DURATION,
        remember
      };

      StorageManager.set(CONFIG.SESSION_KEY, session);
      StorageManager.set(CONFIG.TOKEN_KEY, session.token);

      return session;
    },

    isValid() {
      const session = StorageManager.get(CONFIG.SESSION_KEY);
      
      if (!session) return false;
      
      if (session.remember) return true;
      
      return Date.now() < session.expiresAt;
    },

    renew() {
      const session = StorageManager.get(CONFIG.SESSION_KEY);
      if (session) {
        session.expiresAt = Date.now() + CONFIG.SESSION_DURATION;
        StorageManager.set(CONFIG.SESSION_KEY, session);
        return true;
      }
      return false;
    },

    getUser() {
      const session = StorageManager.get(CONFIG.SESSION_KEY);
      return session ? session.user : null;
    },

    destroy() {
      StorageManager.clear();
    }
  };

  const AuthAPI = {
    login(email, password, remember = false) {
      if (!email || !password) {
        return {
          success: false,
          error: 'EMAIL_PASSWORD_REQUIRED',
          message: 'Email e senha são obrigatórios'
        };
      }

      if (!SecurityUtils.isValidEmail(email)) {
        return {
          success: false,
          error: 'INVALID_EMAIL',
          message: 'Email inválido'
        };
      }

      if (!SecurityUtils.isValidPassword(password)) {
        return {
          success: false,
          error: 'INVALID_PASSWORD',
          message: 'Senha deve ter no mínimo 6 caracteres'
        };
      }

      const user = {
        id: SecurityUtils.simpleHash(email),
        name: email.split('@')[0],
        email: email,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}&background=C9A227&color=fff`,
        createdAt: new Date().toISOString()
      };

      SessionManager.create(user, remember);
      
      StorageManager.set(CONFIG.STORAGE_KEY, user);

      return {
        success: true,
        user,
        message: 'Login realizado com sucesso'
      };
    },

    register(name, email, role, password) {
      if (!name || !email || !password) {
        return {
          success: false,
          error: 'MISSING_FIELDS',
          message: 'Preencha todos os campos obrigatórios'
        };
      }

      if (!SecurityUtils.isValidEmail(email)) {
        return {
          success: false,
          error: 'INVALID_EMAIL',
          message: 'Email inválido'
        };
      }

      if (!SecurityUtils.isValidPassword(password)) {
        return {
          success: false,
          error: 'WEAK_PASSWORD',
          message: 'Senha deve ter no mínimo 6 caracteres'
        };
      }

      const user = {
        id: SecurityUtils.simpleHash(email),
        name: SecurityUtils.escapeHtml(name),
        email: email,
        role: role || 'estudante',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=C9A227&color=fff`,
        createdAt: new Date().toISOString()
      };

      SessionManager.create(user, true);
      StorageManager.set(CONFIG.STORAGE_KEY, user);

      return {
        success: true,
        user,
        message: 'Cadastro realizado com sucesso'
      };
    },

    logout() {
      SessionManager.destroy();
      return {
        success: true,
        message: 'Logout realizado com sucesso'
      };
    },


    getCurrentUser() {
      if (!SessionManager.isValid()) {
        return null;
      }
      return SessionManager.getUser();
    },

    isAuthenticated() {
      return SessionManager.isValid();
    }
  };

  const UIManager = {
    init() {
      const user = AuthAPI.getCurrentUser();
      
      if (user) {
        this.showUserInfo(user);
      }

      setInterval(() => {
        if (AuthAPI.isAuthenticated()) {
          SessionManager.renew();
        }
      }, 300000); 
    },


    showUserInfo(user) {
      const placeholder = document.getElementById('navUserPlaceholder');
      
      if (placeholder) {
        placeholder.style.display = 'flex';
        placeholder.innerHTML = `
          <div class="d-flex align-items-center gap-2">
            <img src="${user.avatar}" alt="${SecurityUtils.escapeHtml(user.name)}" 
                 width="32" height="32" class="rounded-circle">
            <a class="nav-link" href="./entrevista.html">
              ${SecurityUtils.escapeHtml(user.name)}
            </a>
          </div>
        `;
      }
    },


    showLoading(button, show = true) {
      if (show) {
        button.disabled = true;
        button.dataset.originalText = button.textContent;
        button.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Carregando...';
      } else {
        button.disabled = false;
        button.textContent = button.dataset.originalText || 'Enviar';
      }
    }
  };

  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => UIManager.init());
  } else {
    UIManager.init();
  }

  global.BrieffyAuth = {
    login: AuthAPI.login,
    register: AuthAPI.register,
    logout: AuthAPI.logout,
    getCurrentUser: AuthAPI.getCurrentUser,
    isAuthenticated: AuthAPI.isAuthenticated,
    notify: NotificationManager.show.bind(NotificationManager),
    showLoading: UIManager.showLoading
  };

})(window);