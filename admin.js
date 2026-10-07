/* ============================================================
   ADMIN.JS — Wish Manager for Tioluwanimi's Birthday
============================================================ */

const ADMIN_PASS = 'Ayinke';   
const WISHES_KEY = 'hbd_tioluwanimi_wishes'; 
let currentFilter = 'all';

/* ── Storage ── */
function getWishes() {
  try { return JSON.parse(localStorage.getItem(WISHES_KEY)) || []; }
  catch { return []; }
}
function saveWishes(w) { localStorage.setItem(WISHES_KEY, JSON.stringify(w)); }

/* ── Helpers ── */
function escapeHtml(s) {
  const d = document.createElement('div');
  d.appendChild(document.createTextNode(s));
  return d.innerHTML;
}
function fmtDate(ts) {
  return new Date(ts).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

/* ── Login ── */
function doLogin() {
  const pw  = document.getElementById('loginPw').value;
  const err = document.getElementById('loginErr');
  if (pw === ADMIN_PASS) {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('dashboard').style.display   = 'block';
    renderDashboard();
  } else {
    err.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> Incorrect password.';
    const inp = document.getElementById('loginPw');
    inp.value = '';
    inp.classList.remove('shake');
    void inp.offsetWidth;
    inp.classList.add('shake');
    setTimeout(() => { err.textContent = ''; inp.classList.remove('shake'); }, 3000);
  }
}

function doLogout() {
  document.getElementById('dashboard').style.display   = 'none';
  document.getElementById('loginScreen').style.display = 'flex';
  document.getElementById('loginPw').value = '';
}

function toggleEye() {
  const inp = document.getElementById('loginPw');
  const ico = document.getElementById('eyeIco');
  if (inp.type === 'password') {
    inp.type = 'text';
    ico.className = 'fa-solid fa-eye-slash';
  } else {
    inp.type = 'password';
    ico.className = 'fa-solid fa-eye';
  }
}

/* ── Dashboard ── */
function renderDashboard() {
  const all = getWishes();
  document.getElementById('sTotal').textContent   = all.length;
  document.getElementById('sVisible').textContent = all.filter(w => !w.hidden).length;
  document.getElementById('sHidden').textContent  = all.filter(w =>  w.hidden).length;
  document.getElementById('sPinned').textContent  = all.filter(w =>  w.pinned).length;
  applyFilters();
}

function setFilter(f, el) {
  currentFilter = f;
  document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  applyFilters();
}

function applyFilters() {
  const query = (document.getElementById('searchInput').value || '').toLowerCase();
  let wishes = getWishes();

  if (currentFilter === 'visible') wishes = wishes.filter(w => !w.hidden);
  if (currentFilter === 'hidden')  wishes = wishes.filter(w =>  w.hidden);
  if (currentFilter === 'pinned')  wishes = wishes.filter(w =>  w.pinned);

  if (query) {
    wishes = wishes.filter(w =>
      w.name.toLowerCase().includes(query) ||
      w.message.toLowerCase().includes(query) ||
      (w.location || '').toLowerCase().includes(query)
    );
  }

  /* Pinned always first */
  wishes = [...wishes.filter(w => w.pinned), ...wishes.filter(w => !w.pinned)];

  const grid = document.getElementById('wishesGrid');

  if (wishes.length === 0) {
    grid.innerHTML = '<div class="empty-state"><i class="fa-solid fa-inbox"></i><p>No wishes found.</p></div>';
    return;
  }

  grid.innerHTML = wishes.map(w => `
    <div class="admin-wish-card ${w.hidden ? 'is-hidden' : ''} ${w.pinned ? 'is-pinned' : ''}">
      <div class="card-header">
        <div class="card-author">
          <div class="card-avatar"><i class="fa-solid fa-user"></i></div>
          <div class="card-author-info">
            <strong>${escapeHtml(w.name)}</strong>
            <span><i class="fa-solid fa-location-dot"></i> ${escapeHtml(w.location || 'Somewhere special')}</span>
          </div>
        </div>
        <div class="card-badges">
          ${w.pinned ? '<span class="badge badge-pinned"><i class="fa-solid fa-thumbtack"></i> Pinned</span>' : ''}
          ${w.hidden ? '<span class="badge badge-hidden"><i class="fa-solid fa-eye-slash"></i> Hidden</span>' : ''}
        </div>
      </div>
      <p class="card-message">${escapeHtml(w.message)}</p>
      <div class="card-footer">
        <span class="card-date"><i class="fa-regular fa-clock"></i> ${fmtDate(w.timestamp)}</span>
        <div class="card-actions">
          <button class="action-btn pin-btn ${w.pinned ? 'on' : ''}"
            onclick="togglePin('${w.id}')" title="${w.pinned ? 'Unpin' : 'Pin to top'}">
            <i class="fa-solid fa-thumbtack"></i>
          </button>
          <button class="action-btn hide-btn ${w.hidden ? 'on' : ''}"
            onclick="toggleHide('${w.id}')" title="${w.hidden ? 'Show' : 'Hide'}">
            <i class="fa-solid fa-${w.hidden ? 'eye' : 'eye-slash'}"></i>
          </button>
          <button class="action-btn del-btn"
            onclick="deleteWish('${w.id}')" title="Delete permanently">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

/* ── Actions ── */
function togglePin(id) {
  const wishes = getWishes();
  const w = wishes.find(x => x.id === id);
  if (w) { w.pinned = !w.pinned; saveWishes(wishes); renderDashboard(); }
}

function toggleHide(id) {
  const wishes = getWishes();
  const w = wishes.find(x => x.id === id);
  if (w) { w.hidden = !w.hidden; saveWishes(wishes); renderDashboard(); }
}

function deleteWish(id) {
  if (!confirm('Delete this wish permanently?')) return;
  saveWishes(getWishes().filter(x => x.id !== id));
  renderDashboard();
}

function clearAllWishes() {
  if (!confirm('Delete ALL wishes? This cannot be undone.')) return;
  saveWishes([]);
  renderDashboard();
}

/* ── Keyboard: Enter to login ── */
document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && document.getElementById('loginScreen').style.display !== 'none') {
    doLogin();
  }
});
