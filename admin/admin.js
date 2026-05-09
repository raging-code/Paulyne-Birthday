const SUPABASE_URL = 'https://rsxkatksleryuvdgvuib.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzeGthdGtzbGVyeXV2ZGd2dWliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5ODE3NDUsImV4cCI6MjA5MzU1Nzc0NX0.hmySwLwdOaDvdHqL1Z6WiK_RHY-RGEa_PisU_Rgh_2I';
const adminSupabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// DOM elements
const loginView = document.getElementById('loginView');
const dashboardView = document.getElementById('dashboardView');
const loginBtn = document.getElementById('loginBtn');
const loginError = document.getElementById('loginError');
const logoutBtn = document.getElementById('logoutBtn');

const rsvpTableBody = document.getElementById('rsvpTableBody');
const rsvpCount = document.getElementById('rsvpCount');
const msgTableBody = document.getElementById('msgTableBody');
const msgCount = document.getElementById('msgCount');

const refreshRsvpBtn = document.getElementById('refreshRsvpBtn');
const refreshMsgBtn = document.getElementById('refreshMsgBtn');
const addRsvpBtn = document.getElementById('addRsvpBtn');

// ---------- Session Management ----------
async function checkSession() {
  const { data: { session } } = await adminSupabase.auth.getSession();
  if (session) {
    showDashboard();
    loadData();
  } else {
    showLogin();
  }
}

function showLogin() {
  loginView.classList.remove('hidden');
  dashboardView.classList.add('hidden');
  loginError.classList.add('hidden');
}

function showDashboard() {
  loginView.classList.add('hidden');
  dashboardView.classList.remove('hidden');
}

// ---------- Login ----------
loginBtn.addEventListener('click', async () => {
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value.trim();

  if (!email || !password) {
    loginError.textContent = 'Please fill in both fields.';
    loginError.classList.remove('hidden');
    return;
  }

  const { error } = await adminSupabase.auth.signInWithPassword({ email, password });
  if (error) {
    loginError.textContent = error.message || 'Login failed.';
    loginError.classList.remove('hidden');
  } else {
    showDashboard();
    loadData();
  }
});

// ---------- Logout ----------
logoutBtn.addEventListener('click', async () => {
  await adminSupabase.auth.signOut();
  showLogin();
  rsvpTableBody.innerHTML = '';
  msgTableBody.innerHTML = '';
});

// ---------- Load Data ----------
async function loadData() {
  await Promise.all([loadRSVPs(), loadMessages()]);
}

async function loadRSVPs() {
  rsvpTableBody.innerHTML = '<tr><td colspan="6" class="text-center py-3">Loading…</td></tr>';
  const { data, error } = await adminSupabase
    .from('rsvp')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    rsvpTableBody.innerHTML = '<tr><td colspan="6" class="text-center text-danger">Failed to load RSVPs</td></tr>';
    return;
  }

  renderRSVPTable(data || []);
}

function renderRSVPTable(entries) {
  if (entries.length === 0) {
    rsvpTableBody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No RSVPs yet</td></tr>';
  } else {
    rsvpTableBody.innerHTML = entries.map(e => `
      <tr>
        <td>${escapeHtml(e.full_name)}</td>
        <td>${escapeHtml(e.email || '—')}</td>
        <td>${escapeHtml(e.contact_number || '—')}</td>
        <td><span class="status-dot ${e.attending === 'yes' ? 'attending-yes' : 'attending-no'}"></span>${e.attending === 'yes' ? 'Yes' : 'No'}</td>
        <td>${new Date(e.created_at).toLocaleDateString()}</td>
        <td><button class="delete-btn" data-id="${e.id}" data-type="rsvp">Delete</button></td>
      </tr>
    `).join('');
  }
  rsvpCount.textContent = `${entries.length} RSVP${entries.length !== 1 ? 's' : ''} total`;
  attachDeleteListeners();
}

async function loadMessages() {
  msgTableBody.innerHTML = '<tr><td colspan="4" class="text-center py-3">Loading…</td></tr>';
  const { data, error } = await adminSupabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    msgTableBody.innerHTML = '<tr><td colspan="4" class="text-center text-danger">Failed to load messages</td></tr>';
    return;
  }

  renderMsgTable(data || []);
}

function renderMsgTable(messages) {
  if (messages.length === 0) {
    msgTableBody.innerHTML = '<tr><td colspan="4" class="text-center text-muted">No messages yet</td></tr>';
  } else {
    msgTableBody.innerHTML = messages.map(m => `
      <tr>
        <td>${escapeHtml(m.name_relation)}</td>
        <td style="max-width:320px; white-space:pre-wrap;">${escapeHtml(m.message)}</td>
        <td>${new Date(m.created_at).toLocaleDateString()}</td>
        <td><button class="delete-btn" data-id="${m.id}" data-type="message">Delete</button></td>
      </tr>
    `).join('');
  }
  msgCount.textContent = `${messages.length} message${messages.length !== 1 ? 's' : ''} total`;
  attachDeleteListeners();
}

// ---------- Delete Handling ----------
function attachDeleteListeners() {
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.removeEventListener('click', handleDelete);
    btn.addEventListener('click', handleDelete);
  });
}

async function handleDelete(e) {
  const id = e.target.getAttribute('data-id');
  const type = e.target.getAttribute('data-type');

  if (!confirm(`Are you sure you want to delete this ${type}?`)) return;

  const table = type === 'rsvp' ? 'rsvp' : 'messages';
  const { error } = await adminSupabase.from(table).delete().eq('id', id);

  if (error) {
    alert(`Could not delete ${type}: ${error.message}`);
  } else {
    if (type === 'rsvp') loadRSVPs();
    else loadMessages();
  }
}

// ---------- Add RSVP ----------
addRsvpBtn.addEventListener('click', async () => {
  const name = document.getElementById('adminFullName').value.trim();
  const email = document.getElementById('adminEmail').value.trim();
  const contact_number = document.getElementById('adminContact').value.trim();
  const attending = document.getElementById('adminAttending').value;

  if (!name) {
    alert('Please enter at least a full name.');
    return;
  }

  const { error } = await adminSupabase.from('rsvp').insert([
    { full_name: name, email, contact_number, attending }
  ]);

  if (error) {
    alert('Could not add RSVP: ' + error.message);
  } else {
    document.getElementById('adminFullName').value = '';
    document.getElementById('adminEmail').value = '';
    document.getElementById('adminContact').value = '';
    loadRSVPs();
  }
});

// ---------- Refresh buttons ----------
refreshRsvpBtn.addEventListener('click', loadRSVPs);
refreshMsgBtn.addEventListener('click', loadMessages);

// ---------- Utility ----------
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return String(text).replace(/[&<>"']/g, m => map[m]);
}

// ---------- Initial check ----------
checkSession();

adminSupabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT') {
    showLogin();
  } else if (event === 'SIGNED_IN' && session) {
    showDashboard();
    loadData();
  }
});