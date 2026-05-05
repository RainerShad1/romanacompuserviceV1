/* ================================================
   PANEL ADMIN + LOGIN - ESTILOS
   ================================================ */

/* === LOGIN PAGE === */
.auth-body {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: var(--bg);
  position: relative;
  overflow: hidden;
}

.auth-body::before {
  content: '';
  position: absolute;
  top: 50%; left: 50%;
  width: 600px; height: 600px;
  background: radial-gradient(circle, var(--accent-glow) 0%, transparent 70%);
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.auth-container {
  width: 100%;
  max-width: 440px;
  position: relative;
  z-index: 2;
}

.auth-card {
  background: var(--bg-2);
  border: 1px solid var(--line);
  border-radius: var(--r-xl);
  padding: 40px;
  box-shadow: var(--shadow-md);
}

.auth-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: var(--fg);
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--line-soft);
}

.auth-logo .logo-img {
  width: 48px;
  height: 48px;
  border-radius: var(--r-md);
}

.auth-header {
  margin-bottom: 32px;
}

.auth-eyebrow {
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  color: var(--accent);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  margin-bottom: 12px;
}

.auth-title {
  font-family: 'Archivo Black', sans-serif;
  font-size: 36px;
  line-height: 1;
  letter-spacing: -0.02em;
  margin-bottom: 12px;
}
.auth-title em {
  color: var(--accent);
  font-style: italic;
}

.auth-subtitle {
  color: var(--fg-2);
  font-size: 14px;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  color: var(--fg-2);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.form-group input,
.form-group textarea,
.form-group select {
  background: var(--bg);
  border: 1px solid var(--line);
  border-radius: var(--r-md);
  color: var(--fg);
  font-family: inherit;
  font-size: 14px;
  padding: 14px 16px;
  transition: all 0.2s;
  width: 100%;
}
.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--accent);
  background: var(--bg-3);
}
.form-group input::placeholder,
.form-group textarea::placeholder {
  color: var(--fg-3);
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
  line-height: 1.5;
}

.auth-error {
  background: rgba(255, 107, 107, 0.1);
  border: 1px solid var(--danger);
  border-radius: var(--r-md);
  padding: 12px 16px;
  color: var(--danger);
  font-size: 13px;
}

.auth-submit {
  justify-content: center;
  margin-top: 8px;
}
.auth-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.auth-back {
  display: block;
  text-align: center;
  color: var(--fg-3);
  text-decoration: none;
  font-size: 13px;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid var(--line-soft);
  transition: color 0.2s;
}
.auth-back:hover {
  color: var(--accent);
}

/* === ADMIN DASHBOARD === */
.admin-body {
  background: var(--bg);
}

.admin-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(18, 18, 20, 0.95);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--line);
  padding: 16px 24px;
}

.admin-header-inner {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
}

.admin-header .logo-img {
  width: 44px;
  height: 44px;
}

.admin-user-info {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 13px;
  color: var(--fg-2);
}
.admin-user-email {
  font-family: 'Space Mono', monospace;
  font-size: 12px;
}

.admin-logout {
  background: var(--bg-2);
  border: 1px solid var(--line);
  border-radius: var(--r-md);
  color: var(--fg);
  padding: 8px 16px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: inherit;
}
.admin-logout:hover {
  border-color: var(--danger);
  color: var(--danger);
}

.admin-main {
  max-width: 1400px;
  margin: 0 auto;
  padding: 32px 24px 80px;
}

.admin-page-header {
  margin-bottom: 32px;
}

.admin-eyebrow {
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  color: var(--accent);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.admin-title {
  font-family: 'Archivo Black', sans-serif;
  font-size: clamp(2rem, 5vw, 3rem);
  line-height: 1;
  letter-spacing: -0.02em;
  margin-bottom: 12px;
}
.admin-title em {
  color: var(--accent);
  font-style: italic;
}

.admin-subtitle {
  color: var(--fg-2);
  font-size: 15px;
}

/* Tabs */
.admin-tabs {
  display: flex;
  gap: 4px;
  border-bottom: 1px solid var(--line);
  margin-bottom: 32px;
}

.admin-tab {
  background: transparent;
  border: none;
  color: var(--fg-2);
  padding: 14px 24px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  position: relative;
  transition: color 0.2s;
}
.admin-tab:hover { color: var(--fg); }
.admin-tab.active { color: var(--accent); }
.admin-tab.active::after {
  content: '';
  position: absolute;
  bottom: -1px; left: 0; right: 0;
  height: 2px;
  background: var(--accent);
  border-radius: 2px;
}

.admin-tab-count {
  display: inline-block;
  background: var(--bg-3);
  color: var(--fg-2);
  border-radius: 100px;
  padding: 2px 10px;
  font-size: 11px;
  font-family: 'Space Mono', monospace;
  margin-left: 8px;
}

/* Stats cards */
.admin-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}

.stat-card {
  background: var(--bg-2);
  border: 1px solid var(--line);
  border-radius: var(--r-lg);
  padding: 20px 24px;
}

.stat-card-label {
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  color: var(--fg-3);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 8px;
}

.stat-card-value {
  font-family: 'Archivo Black', sans-serif;
  font-size: 32px;
  color: var(--accent);
  line-height: 1;
}

/* Toolbar */
.admin-toolbar {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
  align-items: center;
}

.admin-search {
  flex: 1;
  min-width: 200px;
  background: var(--bg-2);
  border: 1px solid var(--line);
  border-radius: var(--r-md);
  color: var(--fg);
  font-family: inherit;
  font-size: 14px;
  padding: 12px 16px;
}
.admin-search:focus {
  outline: none;
  border-color: var(--accent);
}

/* Tabla */
.admin-table-wrap {
  background: var(--bg-2);
  border: 1px solid var(--line);
  border-radius: var(--r-lg);
  overflow: hidden;
  overflow-x: auto;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 700px;
}

.admin-table th {
  background: var(--bg-3);
  padding: 14px 16px;
  text-align: left;
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  color: var(--fg-2);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 700;
  border-bottom: 1px solid var(--line);
}

.admin-table td {
  padding: 14px 16px;
  border-bottom: 1px solid var(--line-soft);
  font-size: 14px;
  vertical-align: middle;
}
.admin-table tr:last-child td { border-bottom: none; }
.admin-table tbody tr:hover { background: var(--bg-3); }

.admin-table .row-image {
  width: 48px;
  height: 48px;
  border-radius: var(--r-sm);
  background: var(--bg);
  border: 1px solid var(--line);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
}
.admin-table .row-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.admin-table .row-image svg {
  width: 24px;
  height: 24px;
  color: var(--fg-3);
}

.row-name {
  font-weight: 600;
  color: var(--fg);
  margin-bottom: 2px;
}
.row-meta {
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  color: var(--fg-3);
  letter-spacing: 0.05em;
}

.row-price {
  font-family: 'Archivo Black', sans-serif;
  color: var(--accent);
}

.row-actions {
  display: flex;
  gap: 6px;
  justify-content: flex-end;
}

.row-action-btn {
  background: var(--bg);
  border: 1px solid var(--line);
  border-radius: var(--r-sm);
  color: var(--fg-2);
  width: 36px; height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
}
.row-action-btn:hover {
  background: var(--bg-3);
  color: var(--fg);
}
.row-action-btn.edit:hover { color: var(--accent); border-color: var(--accent); }
.row-action-btn.delete:hover { color: var(--danger); border-color: var(--danger); }
.row-action-btn svg { width: 16px; height: 16px; }

/* Toggle de disponibilidad */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
}
.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0; left: 0; right: 0; bottom: 0;
  background: var(--bg-3);
  border: 1px solid var(--line);
  border-radius: 100px;
  transition: 0.3s;
}
.toggle-slider::before {
  position: absolute;
  content: "";
  height: 18px; width: 18px;
  left: 2px; bottom: 2px;
  background: var(--fg-3);
  border-radius: 50%;
  transition: 0.3s;
}
.toggle-switch input:checked + .toggle-slider {
  background: var(--success);
  border-color: var(--success);
}
.toggle-switch input:checked + .toggle-slider::before {
  transform: translateX(20px);
  background: white;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 100px;
  font-family: 'Space Mono', monospace;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  border: 1px solid;
}
.status-available {
  color: var(--success);
  border-color: var(--success);
  background: rgba(74, 222, 128, 0.1);
}
.status-unavailable {
  color: var(--danger);
  border-color: var(--danger);
  background: rgba(255, 107, 107, 0.1);
}

/* Empty state */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--fg-3);
}
.empty-state svg {
  width: 48px;
  height: 48px;
  margin-bottom: 16px;
  opacity: 0.4;
}
.empty-state h3 {
  font-size: 18px;
  margin-bottom: 8px;
  color: var(--fg-2);
}
.empty-state p {
  font-size: 14px;
  max-width: 400px;
  margin: 0 auto;
}

/* === MODAL === */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 24px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.25s;
}
.modal-backdrop.show {
  opacity: 1;
  pointer-events: auto;
}

.modal {
  background: var(--bg-2);
  border: 1px solid var(--line);
  border-radius: var(--r-xl);
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  transform: scale(0.95);
  transition: transform 0.25s;
}
.modal-backdrop.show .modal {
  transform: scale(1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 28px;
  border-bottom: 1px solid var(--line);
  position: sticky;
  top: 0;
  background: var(--bg-2);
  z-index: 1;
}

.modal-title {
  font-family: 'Archivo Black', sans-serif;
  font-size: 20px;
}

.modal-close {
  background: transparent;
  border: 1px solid var(--line);
  border-radius: var(--r-sm);
  color: var(--fg-2);
  width: 36px; height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}
.modal-close:hover {
  background: var(--bg-3);
  color: var(--fg);
}
.modal-close svg { width: 16px; height: 16px; }

.modal-body {
  padding: 28px;
}

.modal-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 20px 28px;
  border-top: 1px solid var(--line);
  background: var(--bg-2);
  position: sticky;
  bottom: 0;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group + .form-group {
  margin-top: 16px;
}

.form-help {
  font-size: 11px;
  color: var(--fg-3);
  margin-top: 4px;
  font-family: 'Space Mono', monospace;
}

/* Image upload */
.image-upload {
  border: 2px dashed var(--line);
  border-radius: var(--r-md);
  padding: 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  background: var(--bg);
}
.image-upload:hover {
  border-color: var(--accent);
  background: var(--bg-3);
}
.image-upload.has-image {
  padding: 0;
  border-style: solid;
  border-color: var(--accent);
  overflow: hidden;
}

.image-upload-preview {
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
}
.image-upload-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.image-upload-remove {
  position: absolute;
  top: 8px; right: 8px;
  background: rgba(0, 0, 0, 0.7);
  border: none;
  color: white;
  width: 32px; height: 32px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.image-upload-remove:hover {
  background: var(--danger);
}

.image-upload-prompt {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: var(--fg-3);
}
.image-upload-prompt svg {
  width: 32px;
  height: 32px;
  color: var(--accent);
}
.image-upload-prompt strong {
  color: var(--fg);
  font-size: 14px;
}
.image-upload-prompt span {
  font-size: 12px;
}

input[type="file"] {
  display: none;
}

/* Toast notifications */
.toast-container {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 200;
  display: flex;
  flex-direction: column-reverse;
  gap: 8px;
  pointer-events: none;
}

.toast {
  background: var(--bg-2);
  border: 1px solid var(--line);
  border-radius: var(--r-md);
  padding: 14px 20px;
  font-size: 14px;
  color: var(--fg);
  box-shadow: var(--shadow-md);
  pointer-events: auto;
  opacity: 0;
  transform: translateX(20px);
  animation: toastIn 0.3s forwards;
  max-width: 360px;
}
@keyframes toastIn {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
.toast.success { border-color: var(--success); }
.toast.error { border-color: var(--danger); }
.toast.exiting {
  animation: toastOut 0.3s forwards;
}
@keyframes toastOut {
  to {
    opacity: 0;
    transform: translateX(20px);
  }
}

/* Loading state */
.loading-overlay {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px;
  color: var(--fg-3);
}
.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--line);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Mobile */
@media (max-width: 768px) {
  .auth-card { padding: 28px 24px; }
  .admin-main { padding: 24px 16px 60px; }
  .admin-header { padding: 14px 16px; }
  .admin-header .logo-text { display: none; }
  .form-row { grid-template-columns: 1fr; }
  .modal { border-radius: var(--r-md); }
  .modal-header, .modal-body, .modal-footer { padding-left: 20px; padding-right: 20px; }
  .row-actions { gap: 4px; }
  .row-action-btn { width: 32px; height: 32px; }
  .row-action-btn svg { width: 14px; height: 14px; }
  .admin-tab { padding: 12px 16px; font-size: 13px; }
  .admin-user-email { display: none; }
}
