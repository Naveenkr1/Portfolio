/* ═══════════════════════════════════════════
   PORTFOLIO ADMIN — CLIENT APP
   ═══════════════════════════════════════════ */

const API = (typeof window !== 'undefined' && (window.location.port === '3000' || window.location.port === '3002' || window.location.port === '8000')) ? 'http://localhost:3001' : '';
let currentSection = 'featured';
let featuredProjects = [];
let jobsData = [];
let caseStudies = [];
let deleteTarget = null;

let aiProjectsData = [];
let aiCoverAction = 'keep';

// ─── INIT ───
document.addEventListener('DOMContentLoaded', async () => {
  // First verify session authentication status
  try {
    const authRes = await fetch(`${API}/api/auth/check`, { credentials: 'include' });
    if (!authRes.ok) {
      window.location.href = '/login';
      return;
    }
  } catch (err) {
    window.location.href = '/login';
    return;
  }

  bindNavigation();
  bindMobileNav();
  bindModals();
  bindForms();
  
  // Try to load initial data
  try {
    await loadHomepage();
    await loadFeatured();
    await loadJobs();
    await loadCaseStudies();
    await loadResume();
    await loadAiProjects();
  } catch (e) {
    if (e.message === 'Unauthorized') {
      window.location.href = '/login';
    }
  }
});

// Add global fetch wrapper to handle cookie expiration 401s
const originalFetch = window.fetch;
window.fetch = async function(...args) {
  const res = await originalFetch(...args);
  if (res.status === 401 && !args[0].includes('/api/login')) {
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }
  return res;
};

// ─── NAVIGATION ───
function bindNavigation() {
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const section = btn.dataset.section;
      switchSection(section);
      if (window.innerWidth <= 1024) {
        closeMobileSidebar();
      }
    });
  });
}

function switchSection(section) {
  currentSection = section;
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const activeNavItem = document.querySelector(`[data-section="${section}"]`);
  if (activeNavItem) activeNavItem.classList.add('active');

  document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
  const activeSection = document.getElementById(`section-${section}`);
  if (activeSection) activeSection.classList.add('active');

  if (section === 'homepage') {
    document.getElementById('page-title').textContent = 'Homepage Management';
    document.getElementById('page-subtitle').textContent = 'Update your hero section and about me content';
  } else if (section === 'featured') {
    document.getElementById('page-title').textContent = 'Selected Work';
    document.getElementById('page-subtitle').textContent = 'Manage your featured portfolio projects';
  } else if (section === 'jobs') {
    document.getElementById('page-title').textContent = 'Jobs';
    document.getElementById('page-subtitle').textContent = 'Manage your work experience entries';
  } else if (section === 'case-studies') {
    document.getElementById('page-title').textContent = 'Case Studies';
    document.getElementById('page-subtitle').textContent = 'Manage and build detailed case studies for your projects';
  } else if (section === 'resume') {
    document.getElementById('page-title').textContent = 'Resume Management';
    document.getElementById('page-subtitle').textContent = 'Update your external resume link or upload a PDF';
  } else if (section === 'ai-projects') {
    document.getElementById('page-title').textContent = 'AI Projects';
    document.getElementById('page-subtitle').textContent = 'Manage your AI Playground projects';
  }
}

// ─── MOBILE NAV ───
function bindMobileNav() {
  const toggle = document.getElementById('mobile-toggle');
  const close = document.getElementById('sidebar-close');
  const overlay = document.getElementById('sidebar-overlay');
  const sidebar = document.getElementById('sidebar');

  if (toggle) {
    toggle.addEventListener('click', () => {
      sidebar.classList.add('active');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }

  if (close) {
    close.addEventListener('click', closeMobileSidebar);
  }

  if (overlay) {
    overlay.addEventListener('click', closeMobileSidebar);
  }
}

function closeMobileSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  if (sidebar) sidebar.classList.remove('active');
  if (overlay) overlay.classList.remove('active');
  document.body.style.overflow = '';
}

// ─── HOMEPAGE ───
async function loadHomepage() {
  try {
    // Load Hero
    const heroRes = await fetch(`${API}/api/homepage/hero`);
    const hero = await heroRes.json();
    if (hero.name) {
      document.getElementById('hero-intro').value = hero.title || ''; // Maps intro -> title
      document.getElementById('hero-name').value = hero.name || '';
      document.getElementById('hero-title').value = hero.subtitle || ''; // Maps title -> subtitle
      document.getElementById('hero-description').value = hero.description || '';
      document.getElementById('hero-button').value = hero.buttonText || 'Check out my Work';
    }

    // Load About
    const aboutRes = await fetch(`${API}/api/homepage/about`);
    const about = await aboutRes.json();
    if (about.title) {
      document.getElementById('about-paragraphs').value = about.description || '';
      document.getElementById('about-skills-title').value = 'Skills';
      document.getElementById('about-skills').value = (about.skills || []).join(', ');
    }
  } catch (err) {
    console.error('Failed to load homepage data', err);
  }
}

// ─── TOAST ───
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const icons = {
    success: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
    error: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>'
  };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-icon">${icons[type]}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => { toast.classList.add('removing'); setTimeout(() => toast.remove(), 300); }, 3000);
}

// ─── DEPLOY ───
async function deployToLive(e) {
  const btn = (e && e.currentTarget) || document.getElementById('btn-deploy');
  if (!btn) return;
  const originalText = btn.innerHTML;
  btn.innerHTML = `<svg class="spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg><span>Publishing...</span>`;
  btn.disabled = true;

  try {
    const res = await fetch(`${API}/api/deploy`, { method: 'POST' });
    const data = await res.json();
    if (data.success) {
      showToast(data.message, 'success');
    } else {
      showToast(data.error || 'Failed to publish', 'error');
    }
  } catch (err) {
    showToast('Failed to publish', 'error');
  } finally {
    btn.innerHTML = originalText;
    btn.disabled = false;
  }
}

// ═══════════════════════════════════════════
// FEATURED PROJECTS
// ═══════════════════════════════════════════

async function loadFeatured() {
  try {
    const res = await fetch(`${API}/api/featured`);
    featuredProjects = await res.json();
    renderFeatured();
    document.getElementById('featured-count').textContent = featuredProjects.length;
  } catch (err) {
    showToast('Failed to load projects', 'error');
  }
}

function renderFeatured() {
  const list = document.getElementById('featured-list');
  const empty = document.getElementById('featured-empty');

  if (!featuredProjects.length) {
    list.innerHTML = '';
    empty.style.display = 'flex';
    return;
  }
  empty.style.display = 'none';

  // Keep order matching date sequence
  const sortedFeatured = [...featuredProjects];

  list.innerHTML = sortedFeatured.map((p, i) => `
    <div class="project-card" draggable="true" data-slug="${p.slug}" data-index="${i}">
      <div class="drag-handle" title="Drag to reorder">
        <div class="drag-dots"><span></span><span></span><span></span><span></span><span></span><span></span></div>
      </div>
      <div class="card-order">${i + 1}</div>
      <div class="card-cover">
        ${p.cover
          ? `<img src="${p.cover.startsWith('http') ? p.cover : `${API}/api/featured/${encodeURIComponent(p.slug)}/cover`}" alt="${p.title}" />`
          : `<div class="card-cover-placeholder"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></div>`
        }
      </div>
      <div class="card-info">
        <div class="card-title">${p.title}</div>
        <div class="card-meta">
          ${p.role ? `<span class="card-meta-tag">${p.role}</span>` : ''}
          ${p.tech && p.tech.length ? p.tech.map(t => `<span class="card-meta-tag">${t}</span>`).join('') : ''}
        </div>
      </div>
      <div class="status-badge ${p.published ? 'published' : 'draft'}">
        <span class="status-dot"></span>
        ${p.published ? 'Published' : 'Draft'}
      </div>
      <div class="card-actions">
        <label class="switch" title="${p.published ? 'Unpublish' : 'Publish'}">
          <input type="checkbox" ${p.published ? 'checked' : ''} onchange="togglePublishFeatured('${esc(p.slug)}')">
          <span class="slider"></span>
        </label>
        <button class="card-action-btn" title="Edit" onclick="editFeatured('${esc(p.slug)}')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </button>
        <button class="card-action-btn btn-delete" title="Delete" onclick="confirmDeleteFeatured('${esc(p.slug)}', '${esc(p.title)}')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
        </button>
      </div>
    </div>
  `).join('');

  bindDragAndDrop('featured');
}

function esc(str) {
  return str.replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

async function togglePublishFeatured(slug) {
  try {
    await fetch(`${API}/api/featured/${encodeURIComponent(slug)}/toggle-publish`, { method: 'POST' });
    await loadFeatured();
    showToast('Publish status updated');
  } catch (err) {
    showToast('Failed to update', 'error');
  }
}

function editFeatured(slug) {
  const p = featuredProjects.find(x => x.slug === slug);
  if (!p) return;
  document.getElementById('modal-featured-title').textContent = 'Edit Project';
  document.getElementById('feat-editing-slug').value = slug;
  document.getElementById('feat-title').value = p.title;
  document.getElementById('feat-role').value = p.role || '';
  document.getElementById('feat-description').value = p.description || '';
  document.getElementById('feat-cta').value = p.cta || '';
  document.getElementById('feat-external').value = p.external || '';
  document.getElementById('feat-button').value = p.button || 'Read More';
  document.getElementById('feat-tech').value = (p.tech || []).join(', ');

  // Show existing cover
  const preview = document.getElementById('feat-cover-preview');
  const placeholder = document.getElementById('feat-upload-placeholder');
  if (p.cover) {
    const coverUrl = p.cover.startsWith('http') ? p.cover : `${API}/api/featured/${encodeURIComponent(slug)}/cover`;
    preview.src = coverUrl;
    preview.style.display = 'block';
    placeholder.style.display = 'none';
  } else {
    preview.style.display = 'none';
    placeholder.style.display = 'flex';
  }

  openModal('modal-featured');
}

function confirmDeleteFeatured(slug, title) {
  deleteTarget = { type: 'featured', slug };
  document.getElementById('delete-item-name').textContent = title;
  openModal('modal-delete');
}

// ═══════════════════════════════════════════
// JOBS
// ═══════════════════════════════════════════

async function loadJobs() {
  try {
    const res = await fetch(`${API}/api/jobs`);
    jobsData = await res.json();
    renderJobs();
    document.getElementById('jobs-count').textContent = jobsData.length;
  } catch (err) {
    showToast('Failed to load jobs', 'error');
  }
}

function renderJobs() {
  const list = document.getElementById('jobs-list');
  const empty = document.getElementById('jobs-empty');

  if (!jobsData.length) {
    list.innerHTML = '';
    empty.style.display = 'flex';
    return;
  }
  empty.style.display = 'none';

  // Sort: Published first, then unpublished (maintaining relative order)
  const sortedJobs = [...jobsData].sort((a, b) => {
    if (a.published === b.published) return 0;
    return a.published ? -1 : 1;
  });

  list.innerHTML = sortedJobs.map((j, i) => `
    <div class="project-card" draggable="true" data-slug="${j.slug}" data-index="${i}">
      <div class="drag-handle" title="Drag to reorder">
        <div class="drag-dots"><span></span><span></span><span></span><span></span><span></span><span></span></div>
      </div>
      <div class="card-order">${i + 1}</div>
      <div class="card-info">
        <div class="card-title">${j.title} <span style="color:var(--green);font-weight:400;">@ ${j.company}</span></div>
        <div class="card-meta">
          ${j.location ? `<span class="card-meta-tag">${j.location}</span>` : ''}
          ${j.range ? `<span class="card-meta-tag">${j.range}</span>` : ''}
        </div>
      </div>
      <div class="status-badge ${j.published ? 'published' : 'draft'}">
        <span class="status-dot"></span>
        ${j.published ? 'Published' : 'Draft'}
      </div>
      <div class="card-actions">
        <label class="switch" title="${j.published ? 'Unpublish' : 'Publish'}">
          <input type="checkbox" ${j.published ? 'checked' : ''} onchange="togglePublishJob('${esc(j.slug)}')">
          <span class="slider"></span>
        </label>
        <button class="card-action-btn" title="Edit" onclick="editJob('${esc(j.slug)}')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </button>
        <button class="card-action-btn btn-delete" title="Delete" onclick="confirmDeleteJob('${esc(j.slug)}', '${esc(j.company)}')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
        </button>
      </div>
    </div>
  `).join('');

  bindDragAndDrop('jobs');
}

async function togglePublishJob(slug) {
  try {
    await fetch(`${API}/api/jobs/${encodeURIComponent(slug)}/toggle-publish`, { method: 'POST' });
    await loadJobs();
    showToast('Publish status updated');
  } catch (err) {
    showToast('Failed to update', 'error');
  }
}

function editJob(slug) {
  const j = jobsData.find(x => x.slug === slug);
  if (!j) return;
  document.getElementById('modal-job-title').textContent = 'Edit Job';
  document.getElementById('job-editing-slug').value = slug;
  document.getElementById('job-title').value = j.title || '';
  document.getElementById('job-company').value = j.company || '';
  document.getElementById('job-location').value = j.location || '';
  document.getElementById('job-range').value = j.range || '';
  document.getElementById('job-url').value = j.url || '';
  document.getElementById('job-date').value = j.date || '';
  document.getElementById('job-description').value = j.description || '';
  openModal('modal-job');
}

function confirmDeleteJob(slug, name) {
  deleteTarget = { type: 'jobs', slug };
  document.getElementById('delete-item-name').textContent = name;
  openModal('modal-delete');
}

// ═══════════════════════════════════════════
// MODALS
// ═══════════════════════════════════════════

function openModal(id) {
  document.getElementById(id).classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal(id) {
  document.getElementById(id).classList.remove('active');
  document.body.style.overflow = '';
}

function closeAllModals() {
  document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
  document.body.style.overflow = '';
}

function bindModals() {
  // Create button
  document.getElementById('btn-create').addEventListener('click', () => {
    if (currentSection === 'featured') {
      document.getElementById('form-featured').reset();
      document.getElementById('feat-editing-slug').value = '';
      document.getElementById('feat-button').value = 'Read More';
      document.getElementById('modal-featured-title').textContent = 'New Project';
      document.getElementById('feat-cover-preview').style.display = 'none';
      document.getElementById('feat-upload-placeholder').style.display = 'flex';
      openModal('modal-featured');
    } else if (currentSection === 'jobs') {
      document.getElementById('form-job').reset();
      document.getElementById('job-editing-slug').value = '';
      document.getElementById('modal-job-title').textContent = 'New Job';
      openModal('modal-job');
    } else if (currentSection === 'case-studies') {
      builder.openNew();
    } else if (currentSection === 'ai-projects') {
      document.getElementById('form-ai-project').reset();
      document.getElementById('ai-editing-slug').value = '';
      document.getElementById('modal-ai-project-title').textContent = 'New Play Project';
      document.getElementById('ai-type').removeAttribute('data-original-type');
      document.getElementById('ai-cover-name').textContent = 'Upload new image or GIF...';
      document.getElementById('ai-cover-preview-container').style.display = 'none';
      aiCoverAction = 'none';
      openModal('modal-ai-project');
    }
  });

  // Close buttons
  document.getElementById('modal-featured-close').addEventListener('click', () => closeModal('modal-featured'));
  document.getElementById('btn-feat-cancel').addEventListener('click', () => closeModal('modal-featured'));
  document.getElementById('modal-job-close').addEventListener('click', () => closeModal('modal-job'));
  document.getElementById('btn-job-cancel').addEventListener('click', () => closeModal('modal-job'));
  document.getElementById('modal-ai-project-close').addEventListener('click', () => closeModal('modal-ai-project'));
  document.getElementById('btn-ai-cancel').addEventListener('click', () => closeModal('modal-ai-project'));
  document.getElementById('modal-delete-close').addEventListener('click', () => closeModal('modal-delete'));
  document.getElementById('btn-delete-cancel').addEventListener('click', () => closeModal('modal-delete'));

  // Click overlay to close
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeAllModals();
    });
  });

  // Delete confirm
  document.getElementById('btn-delete-confirm').addEventListener('click', async () => {
    if (!deleteTarget) return;
    try {
      await fetch(`${API}/api/${deleteTarget.type}/${encodeURIComponent(deleteTarget.slug)}`, { method: 'DELETE' });
      closeModal('modal-delete');
      if (deleteTarget.type === 'featured') await loadFeatured();
      else if (deleteTarget.type === 'jobs') await loadJobs();
      else if (deleteTarget.type === 'case-studies') await loadCaseStudies();
      showToast('Deleted successfully');
    } catch (err) {
      showToast('Delete failed', 'error');
    }
    deleteTarget = null;
  });

  // Cover image preview
  document.getElementById('feat-cover').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      document.getElementById('feat-cover-preview').src = ev.target.result;
      document.getElementById('feat-cover-preview').style.display = 'block';
      document.getElementById('feat-upload-placeholder').style.display = 'none';
    };
    reader.readAsDataURL(file);
  });

  // Initialize Drag and Drop
  if (window.bindFileDragAndDrop) {
    window.bindFileDragAndDrop('feat-upload-container', 'feat-cover');
    // window.bindFileDragAndDrop('resume-upload-container', 'resume-file-input'); // Disabled for URL-only mode
  }

  // HOMEPAGE SAVE
  document.getElementById('btn-hero-save').addEventListener('click', async () => {
    const btn = document.getElementById('btn-hero-save');
    const originalText = btn.innerHTML;
    
    const data = {
      title: document.getElementById('hero-intro').value,
      name: document.getElementById('hero-name').value,
      subtitle: document.getElementById('hero-title').value,
      description: document.getElementById('hero-description').value,
    };

    try {
      btn.disabled = true;
      btn.innerHTML = 'Saving...';
      const res = await fetch(`${API}/api/homepage/hero`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) {
        const err = await res.json();
        showToast(err.error || `Save failed (${res.status})`, 'error');
      } else {
        showToast('Hero section updated ✅');
      }
    } catch (err) {
      showToast('Failed to save hero section: ' + err.message, 'error');
    } finally {
      btn.disabled = false;
      btn.innerHTML = originalText;
    }
  });

  document.getElementById('btn-about-save').addEventListener('click', async () => {
    const btn = document.getElementById('btn-about-save');
    const originalText = btn.innerHTML;
    
    const paragraphs = document.getElementById('about-paragraphs').value
      .split('\n\n')
      .filter(p => p.trim() !== '');
    
    const skills = document.getElementById('about-skills').value
      .split(',')
      .map(s => s.trim())
      .filter(s => s !== '');

    const data = {
      title: 'About Me',
      description: document.getElementById('about-paragraphs').value,
      skills
    };

    try {
      btn.disabled = true;
      btn.innerHTML = 'Saving...';
      const res = await fetch(`${API}/api/homepage/about`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) {
        const err = await res.json();
        showToast(err.error || `Save failed (${res.status})`, 'error');
      } else {
        showToast('About section updated ✅');
      }
    } catch (err) {
      showToast('Failed to save about section: ' + err.message, 'error');
    } finally {
      btn.disabled = false;
      btn.innerHTML = originalText;
    }
  });
}

// ═══════════════════════════════════════════
// FORMS
// ═══════════════════════════════════════════

function bindForms() {
  // Featured form
  document.getElementById('form-featured').addEventListener('submit', async (e) => {
    e.preventDefault();
    const slug = document.getElementById('feat-editing-slug').value;
    const isEdit = !!slug;

    const formData = new FormData();
    formData.append('title', document.getElementById('feat-title').value);
    formData.append('role', document.getElementById('feat-role').value);
    formData.append('description', document.getElementById('feat-description').value);
    formData.append('cta', document.getElementById('feat-cta').value);
    formData.append('external', document.getElementById('feat-external').value);
    formData.append('button', document.getElementById('feat-button').value);

    const techStr = document.getElementById('feat-tech').value;
    const techArr = techStr ? techStr.split(',').map(t => t.trim()).filter(Boolean) : [];
    formData.append('tech', JSON.stringify(techArr));

    const coverFile = document.getElementById('feat-cover').files[0];
    if (coverFile) formData.append('cover', coverFile);
    if (!isEdit) formData.append('slug', document.getElementById('feat-title').value);

    try {
      const url = isEdit ? `${API}/api/featured/${encodeURIComponent(slug)}` : `${API}/api/featured`;
      const method = isEdit ? 'PUT' : 'POST';
      const res = await fetch(url, { method, body: formData });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || `Save failed (${res.status})`, 'error');
        return;
      }
      closeModal('modal-featured');
      await loadFeatured();
      showToast(isEdit ? 'Project updated ✅' : 'Project created ✅');
    } catch (err) {
      showToast('Save failed: ' + err.message, 'error');
    }
  });

  // Job form
  document.getElementById('form-job').addEventListener('submit', async (e) => {
    e.preventDefault();
    const slug = document.getElementById('job-editing-slug').value;
    const isEdit = !!slug;

    const body = {
      title: document.getElementById('job-title').value,
      company: document.getElementById('job-company').value,
      location: document.getElementById('job-location').value,
      range: document.getElementById('job-range').value,
      url: document.getElementById('job-url').value,
      date: document.getElementById('job-date').value,
      description: document.getElementById('job-description').value,
    };

    try {
      const url = isEdit ? `${API}/api/jobs/${encodeURIComponent(slug)}` : `${API}/api/jobs`;
      const method = isEdit ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || `Save failed (${res.status})`, 'error');
        return;
      }
      closeModal('modal-job');
      await loadJobs();
      showToast(isEdit ? 'Job updated ✅' : 'Job created ✅');
    } catch (err) {
      showToast('Save failed: ' + err.message, 'error');
    }
  });

  // Resume Save
  document.getElementById('btn-resume-save').addEventListener('click', async () => {
    const btn = document.getElementById('btn-resume-save');
    const originalText = btn.innerHTML;
    const value = document.getElementById('resume-url-input').value;

    if (!value) {
      showToast('Please enter a valid URL', 'error');
      return;
    }

    btn.disabled = true;
    btn.innerHTML = 'Saving...';

    try {
      await fetch(`${API}/api/resume`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'url', value }),
      });
      showToast('Resume settings saved');
    } catch (err) {
      showToast('Failed to save resume', 'error');
    } finally {
      btn.disabled = false;
      btn.innerHTML = originalText;
    }
  });

  // Resume File Input change
  // Removed file input listener for URL-only mode
}

// ═══════════════════════════════════════════
// RESUME
// ═══════════════════════════════════════════

async function loadResume() {
  try {
    const res = await fetch(`${API}/api/resume`);
    const data = await res.json();
    if (data.value) {
      document.getElementById('resume-url-input').value = data.value;
    }
  } catch (err) {
    console.error('Failed to load resume', err);
  }
}

// ═══════════════════════════════════════════
// CASE STUDIES
// ═══════════════════════════════════════════

async function loadCaseStudies() {
  try {
    const res = await fetch(`${API}/api/case-studies`);
    caseStudies = await res.json();
    renderCaseStudies();
    document.getElementById('case-studies-count').textContent = caseStudies.length;
  } catch (err) {
    showToast('Failed to load case studies', 'error');
  }
}

function renderCaseStudies() {
  const list = document.getElementById('case-studies-list');
  const empty = document.getElementById('case-studies-empty');

  if (!caseStudies.length) {
    list.innerHTML = '';
    empty.style.display = 'flex';
    return;
  }
  empty.style.display = 'none';

  list.innerHTML = caseStudies.map((s, i) => `
    <div class="project-card" data-slug="${s.slug}">
      <div class="card-order">${i + 1}</div>
      <div class="card-info">
        <div class="card-title">${s.title}</div>
        <div class="card-meta">
          <span class="card-meta-tag">Slug: /${s.slug}</span>
          <span class="card-meta-tag">Date: ${s.date}</span>
        </div>
      </div>
      <div class="status-badge ${s.published ? 'published' : 'draft'}">
        <span class="status-dot"></span>
        ${s.published ? 'Published' : 'Draft'}
      </div>
      <div class="card-actions">
        <a class="card-action-btn" title="Preview" href="${window.location.origin}/case-study/${s.slug}/" target="_blank" style="text-decoration:none;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
        </a>
        <button class="card-action-btn" title="Copy Link" onclick="copyCaseStudyLink('${esc(s.slug)}')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
        </button>
        <button class="card-action-btn" title="Edit in Builder" onclick="openBuilder('${esc(s.slug)}')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </button>
        <button class="card-action-btn btn-delete" title="Delete" onclick="confirmDeleteCaseStudy('${esc(s.slug)}', '${esc(s.title)}')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
        </button>
      </div>
    </div>
  `).join('');
}

async function createCaseStudy(title, slug) {
  try {
    const res = await fetch(`${API}/api/case-studies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, slug }),
    });
    if (res.ok) {
      showToast('Case study created');
      await loadCaseStudies();
      openBuilder(slug);
    } else {
      const err = await res.json();
      showToast(err.error || 'Failed to create', 'error');
    }
  } catch (err) {
    showToast('Failed to create', 'error');
  }
}

function confirmDeleteCaseStudy(slug, title) {
  deleteTarget = { type: 'case-studies', slug };
  document.getElementById('delete-item-name').textContent = title;
  openModal('modal-delete');
}

function copyCaseStudyLink(slug) {
  const url = `${window.location.origin}/case-study/${slug}/`;
  navigator.clipboard.writeText(url);
  showToast('Link copied to clipboard');
}


// ═══════════════════════════════════════════
// DRAG AND DROP
// ═══════════════════════════════════════════

function bindDragAndDrop(section) {
  const listId = section === 'featured' ? 'featured-list' : section === 'jobs' ? 'jobs-list' : 'ai-projects-list';
  const list = document.getElementById(listId);
  if (!list) return;
  const cards = list.querySelectorAll('.project-card');
  let draggedEl = null;

  cards.forEach(card => {
    card.addEventListener('dragstart', (e) => {
      draggedEl = card;
      card.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', card.dataset.slug);
    });

    card.addEventListener('dragend', () => {
      draggedEl = null;
      card.classList.remove('dragging');
      list.querySelectorAll('.project-card').forEach(c => c.classList.remove('drag-over'));
      // Remove any drop indicators
      list.querySelectorAll('.drop-indicator').forEach(d => d.remove());
    });

    card.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      if (card === draggedEl) return;

      // Remove existing indicators
      list.querySelectorAll('.drop-indicator').forEach(d => d.remove());
      list.querySelectorAll('.project-card').forEach(c => c.classList.remove('drag-over'));

      const rect = card.getBoundingClientRect();
      const midY = rect.top + rect.height / 2;

      if (e.clientY < midY) {
        const indicator = document.createElement('div');
        indicator.className = 'drop-indicator';
        card.parentNode.insertBefore(indicator, card);
      } else {
        const indicator = document.createElement('div');
        indicator.className = 'drop-indicator';
        card.parentNode.insertBefore(indicator, card.nextSibling);
      }
    });

    card.addEventListener('drop', async (e) => {
      e.preventDefault();
      if (!draggedEl || card === draggedEl) return;

      const rect = card.getBoundingClientRect();
      const midY = rect.top + rect.height / 2;

      if (e.clientY < midY) {
        card.parentNode.insertBefore(draggedEl, card);
      } else {
        card.parentNode.insertBefore(draggedEl, card.nextSibling);
      }

      list.querySelectorAll('.drop-indicator').forEach(d => d.remove());

      // Collect new order
      let newOrder;
      if (section === 'ai-projects') {
        newOrder = [...list.querySelectorAll('.project-card')].map(c => {
          const item = aiProjectsData.find(x => x.slug === c.dataset.slug);
          return { slug: c.dataset.slug, type: item ? item.type : 'ai' };
        });
      } else {
        newOrder = [...list.querySelectorAll('.project-card')].map(c => c.dataset.slug);
      }

      try {
        let endpoint = '';
        if (section === 'featured') endpoint = '/api/featured/reorder';
        else if (section === 'jobs') endpoint = '/api/jobs/reorder';
        else if (section === 'ai-projects') endpoint = '/api/play-projects/reorder';

        await fetch(`${API}${endpoint}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order: newOrder }),
        });

        if (section === 'featured') await loadFeatured();
        else if (section === 'jobs') await loadJobs();
        else if (section === 'ai-projects') await loadAiProjects();
        showToast('Order updated');
      } catch (err) {
        showToast('Reorder failed', 'error');
      }
    });
  });
}

/* ═══════════════════════════════════════════
   AI PROJECTS
   ═══════════════════════════════════════════ */

async function loadAiProjects() {
  try {
    const res = await fetch('/api/play-projects');
    if (!res.ok) throw new Error('Failed to load AI Projects');
    aiProjectsData = await res.json();
    document.getElementById('ai-projects-count').textContent = aiProjectsData.length;
    renderAiProjects();
  } catch (err) {
    console.error(err);
  }
}

function renderAiProjects() {
  const list = document.getElementById('ai-projects-list');
  const empty = document.getElementById('ai-projects-empty');

  if (!list) return;

  if (!aiProjectsData.length) {
    list.innerHTML = '';
    if (empty) empty.style.display = 'flex';
    return;
  }
  if (empty) empty.style.display = 'none';

  // Sort: Published first, then unpublished
  const sortedProjects = [...aiProjectsData].sort((a, b) => {
    if (a.published === b.published) return 0;
    return a.published ? -1 : 1;
  });

  list.innerHTML = sortedProjects.map((p, i) => `
    <div class="project-card" draggable="true" data-slug="${p.slug}" data-index="${i}">
      <div class="drag-handle" title="Drag to reorder">
        <div class="drag-dots"><span></span><span></span><span></span><span></span><span></span><span></span></div>
      </div>
      <div class="card-order">${i + 1}</div>
      <div class="card-cover">
        <img src="${p.cover ? (p.cover.startsWith('http') ? p.cover : '/' + p.cover) : '/uploads/ai-play-default.png'}" alt="${p.title}" />
      </div>
      <div class="card-info">
        <div class="card-title">${p.title}</div>
        <div class="card-meta">
          <span class="card-meta-tag" style="background: var(--lightest-navy); color: var(--green); text-transform: uppercase; font-size: 10px;">${p.type === 'ai' ? 'AI Project' : 'Other Project'}</span>
          ${p.tech && p.tech.length ? p.tech.map(t => `<span class="card-meta-tag">${t}</span>`).join('') : ''}
        </div>
      </div>
      <div class="status-badge ${p.published ? 'published' : 'draft'}">
        <span class="status-dot"></span>
        ${p.published ? 'Published' : 'Draft'}
      </div>
      <div class="card-actions">
        <label class="switch" title="${p.published ? 'Unpublish' : 'Publish'}">
          <input type="checkbox" ${p.published ? 'checked' : ''} onchange="toggleAiProjectPublish('${esc(p.slug)}', '${esc(p.type)}')">
          <span class="slider"></span>
        </label>
        <button class="card-action-btn" title="Edit" onclick="editAiProject('${esc(p.slug)}')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </button>
        <button class="card-action-btn btn-delete" title="Delete" onclick="confirmDeleteAiProject('${esc(p.slug)}', '${esc(p.type)}')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2 2v2"/></svg>
        </button>
      </div>
    </div>
  `).join('');

  bindDragAndDrop('ai-projects');
}

function editAiProject(slug) {
  const p = aiProjectsData.find(x => x.slug === slug);
  if (!p) return;

  document.getElementById('form-ai-project').reset();
  
  document.getElementById('ai-editing-slug').value = p.slug;
  document.getElementById('ai-type').value = p.type || 'ai';
  document.getElementById('ai-type').setAttribute('data-original-type', p.type || 'ai');
  document.getElementById('ai-title').value = p.title;
  document.getElementById('ai-date').value = p.date;
  document.getElementById('ai-external').value = p.external || '';
  document.getElementById('ai-tech').value = (p.tech || []).join(', ');
  document.getElementById('ai-description').value = p.description || '';

  const label = document.getElementById('ai-cover-name');
  const preview = document.getElementById('ai-cover-preview');
  const container = document.getElementById('ai-cover-preview-container');

  if (p.cover) {
    label.textContent = 'Change image or GIF...';
    preview.src = p.cover;
    container.style.display = 'block';
    aiCoverAction = 'keep';
  } else {
    label.textContent = 'Upload new image or GIF...';
    container.style.display = 'none';
    aiCoverAction = 'none';
  }

  document.getElementById('modal-ai-project-title').textContent = 'Edit Play Project';
  openModal('modal-ai-project');
}

async function toggleAiProjectPublish(slug, type) {
  try {
    const res = await fetch(`/api/play-projects/${type}/${slug}/toggle-publish`, { method: 'POST' });
    if (res.ok) await loadAiProjects();
  } catch (err) {
    console.error(err);
  }
}

function confirmDeleteAiProject(slug, projectType) {
  deleteTarget = { type: 'ai-project', slug, projectType };
  document.getElementById('modal-delete-title').textContent = 'Delete Play Project';
  document.getElementById('modal-delete-text').textContent = 'Are you sure you want to delete this project? This action cannot be undone.';
  openModal('modal-delete');
}

// Bind the form submission
document.addEventListener('DOMContentLoaded', () => {
  const formAiProject = document.getElementById('form-ai-project');
  if (formAiProject) {
    formAiProject.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const slug = document.getElementById('ai-editing-slug').value;
      const isEdit = !!slug;
      
      const fd = new FormData();
      fd.append('title', document.getElementById('ai-title').value);
      fd.append('external', document.getElementById('ai-external').value);
      fd.append('date', document.getElementById('ai-date').value);
      fd.append('tech', document.getElementById('ai-tech').value);
      fd.append('description', document.getElementById('ai-description').value);
      fd.append('type', document.getElementById('ai-type').value || 'ai');
      
      if (aiCoverAction === 'delete') {
        fd.append('deleteCover', 'true');
      } else if (aiCoverAction === 'upload') {
        const coverFile = document.getElementById('ai-cover').files[0];
        if (coverFile) {
          fd.append('cover', coverFile);
        }
      }
      
      try {
        let res;
        if (isEdit) {
          const origType = document.getElementById('ai-type').getAttribute('data-original-type') || 'ai';
          res = await fetch(`/api/play-projects/${origType}/${slug}`, { method: 'PUT', body: fd });
        } else {
          res = await fetch('/api/play-projects', { method: 'POST', body: fd });
        }
        
        if (!res.ok) throw new Error(await res.text());
        
        closeModal('modal-ai-project');
        await loadAiProjects();
      } catch (err) {
        alert(err.message);
      }
    });
  }



  // Play Projects Cover image preview
  const aiCoverInput = document.getElementById('ai-cover');
  if (aiCoverInput) {
    aiCoverInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (ev) => {
        const preview = document.getElementById('ai-cover-preview');
        const container = document.getElementById('ai-cover-preview-container');
        if (preview && container) {
          preview.src = ev.target.result;
          container.style.display = 'block';
          aiCoverAction = 'upload';
        }
      };
      reader.readAsDataURL(file);
      
      const label = document.getElementById('ai-cover-name');
      if (label) {
        label.textContent = file.name;
      }
    });
  }

  // Play Projects Delete cover image button
  const btnDeleteAiCover = document.getElementById('btn-delete-ai-cover');
  if (btnDeleteAiCover) {
    btnDeleteAiCover.addEventListener('click', () => {
      const input = document.getElementById('ai-cover');
      if (input) input.value = '';
      
      const label = document.getElementById('ai-cover-name');
      if (label) label.textContent = 'Upload new image or GIF...';
      
      const container = document.getElementById('ai-cover-preview-container');
      if (container) container.style.display = 'none';
      
      const editingSlug = document.getElementById('ai-editing-slug').value;
      if (editingSlug) {
        aiCoverAction = 'delete';
      } else {
        aiCoverAction = 'none';
      }
    });
  }
});

// ─── AI PLAY TAB TOGGLE ───
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const res = await fetch(`${API}/api/settings/ai-play`);
    if (res.ok) {
      const data = await res.json();
      const toggle = document.getElementById('global-ai-play-toggle');
      if (toggle) toggle.checked = data.showTab;
    }
  } catch (err) {
    console.error('Failed to load AI play toggle status', err);
  }

  const toggleBtn = document.getElementById('global-ai-play-toggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('change', async (e) => {
      try {
        const res = await fetch(`${API}/api/settings/ai-play`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ showTab: e.target.checked })
        });
        if (res.ok) {
          showToast('AI Play Tab visibility updated');
        } else {
          e.target.checked = !e.target.checked; // revert
          showToast('Failed to update visibility', 'error');
        }
      } catch (err) {
        e.target.checked = !e.target.checked; // revert
        showToast('Network error', 'error');
      }
    });
  }
});
