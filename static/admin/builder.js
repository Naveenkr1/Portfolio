/* ═══════════════════════════════════════════
   CASE STUDY BUILDER — CORE LOGIC
   ═══════════════════════════════════════════ */

// ─── FILE DRAG AND DROP HELPER (Shared) ───
window.bindFileDragAndDrop = function(containerId, inputId, callback) {
  const container = document.getElementById(containerId);
  const input = document.getElementById(inputId);
  if (!container || !input) return;

  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    container.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
    }, false);
  });

  ['dragenter', 'dragover'].forEach(eventName => {
    container.addEventListener(eventName, () => container.classList.add('drag-active'), false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    container.addEventListener(eventName, () => container.classList.remove('drag-active'), false);
  });

  container.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files && files.length > 0) {
      input.files = files;
      input.dispatchEvent(new Event('change'));
      if (callback) callback(files);
    }
  }, false);
};

class CaseStudyBuilder {
  constructor() {
    this.slug = null;
    this.title = null;
    this.blocks = [];
    this.published = false;
    this.tocEnabled = false;
    this.tocItems = [];
    this.viewMode = 'desktop'; // 'desktop' or 'mobile'
    this.banner = '';
    this.init();
  }

  init() {
    document.getElementById('btn-builder-close').addEventListener('click', () => this.close());
    document.getElementById('btn-builder-save').addEventListener('click', () => this.save());
    
    // View Mode Toggle
    const btnDesktop = document.getElementById('btn-view-desktop');
    const btnMobile = document.getElementById('btn-view-mobile');
    
    if (btnDesktop && btnMobile) {
      btnDesktop.addEventListener('click', () => this.setViewMode('desktop'));
      btnMobile.addEventListener('click', () => this.setViewMode('mobile'));
    }
    
    // Link Modal
    const modalLinkClose = document.getElementById('modal-link-close');
    if (modalLinkClose) modalLinkClose.addEventListener('click', () => this.closeLinkModal());
    document.getElementById('btn-link-cancel').addEventListener('click', () => this.closeLinkModal());
    document.getElementById('btn-link-confirm').addEventListener('click', () => this.insertLink());
    
    this.savedRange = null;
    
    // Outside click listener for Link Popover
    document.addEventListener('mousedown', (e) => {
      const popover = document.getElementById('modal-link');
      if (popover && popover.classList.contains('active')) {
        if (!popover.contains(e.target)) {
          this.closeLinkModal();
        }
      }
    });

    // Initialize Global Builder Drag and Drop
    window.bindFileDragAndDrop('banner-upload-container', 'banner-upload');
  }


  openLinkModal() {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      this.savedRange = selection.getRangeAt(0);
      document.getElementById('link-text').value = selection.toString();
      
      const rect = this.savedRange.getBoundingClientRect();
      const popover = document.getElementById('modal-link');
      
      // Clear URL
      document.getElementById('link-url').value = '';
      
      // Position popover
      popover.style.display = 'block';
      const top = rect.top + window.scrollY - 130; // 130 is approx height of popover + arrow
      const left = rect.left + window.scrollX + (rect.width / 2) - 150; // 150 is half width
      
      popover.style.top = `${top}px`;
      popover.style.left = `${left}px`;
      popover.classList.add('active');
      document.getElementById('link-url').focus();
    }
  }

  closeLinkModal() {
    const popover = document.getElementById('modal-link');
    popover.classList.remove('active');
    popover.style.display = 'none';
  }

  insertLink() {
    const url = document.getElementById('link-url').value;
    const text = document.getElementById('link-text').value;
    if (!url) return;

    if (this.savedRange) {
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(this.savedRange);
    }

    // If there's text but no selection, or we want to override selection with text
    if (text) {
      // Create the anchor element
      document.execCommand('insertHTML', false, `<a href="${url}" target="_blank">${text}</a>`);
    } else {
      document.execCommand('createLink', false, url);
    }

    this.closeLinkModal();
  }


  open(slug) {
    const study = caseStudies.find(s => s.slug === slug);
    if (!study) return;

    this.slug = slug;
    this.title = study.title;
    this.published = study.published;
    
    document.getElementById('builder-case-study-title').value = this.title;
    document.getElementById('builder-case-study-slug').textContent = `/${this.slug}`;
    document.getElementById('builder-publish-toggle').checked = this.published;
    
    const previewBtn = document.getElementById('btn-builder-preview');
    previewBtn.style.display = 'inline-flex';
    previewBtn.href = `http://localhost:8000/case-study/${this.slug}`;
    
    document.getElementById('builder-overlay').classList.add('active');
    
    this.loadData();
  }

  openNew() {
    this.slug = null;
    this.title = '';
    this.published = false;
    this.blocks = [];
    
    document.getElementById('builder-case-study-title').value = '';
    document.getElementById('builder-case-study-slug').textContent = '/new-case-study';
    document.getElementById('builder-publish-toggle').checked = false;
    document.getElementById('btn-builder-preview').style.display = 'none';
    
    document.getElementById('builder-meta-summary').value = '';
    document.getElementById('builder-meta-role').value = '';
    document.getElementById('builder-meta-results').value = '';
    document.getElementById('builder-meta-methods').value = '';

    document.getElementById('builder-overlay').classList.add('active');
    this.render();
  }

  close() {
    document.getElementById('builder-overlay').classList.remove('active');
  }

  async loadData() {
    try {
      const res = await fetch(`${API}/api/case-studies/${this.slug}`);
      const data = await res.json();
      this.blocks = data.blocks || [];
      const meta = data.metadata || {};
      
      document.getElementById('builder-meta-methods').value = meta.methods || '';
      
      this.banner = meta.banner || '';
      const bannerPreview = document.getElementById('banner-preview');
      const bannerPlaceholder = document.getElementById('banner-placeholder');
      if (this.banner) {
        bannerPreview.src = this.banner.startsWith('/uploads') ? `${API}${this.banner}` : this.banner;
        bannerPreview.style.display = 'block';
        bannerPlaceholder.style.display = 'none';
      } else {
        bannerPreview.style.display = 'none';
        bannerPlaceholder.style.display = 'flex';
      }
      
      this.render();
    } catch (err) {
      showToast('Failed to load content', 'error');
    }
  }

  addBlock(type) {
    const id = Date.now().toString();
    let block = { id, type };

    if (type === 'text') {
      block.content = '<h2>New Section</h2><p>Start writing here...</p>';
      block.tocEntry = false;
      block.tocName = '';
    } else if (type === 'image') {
      block.images = [];
      block.grid = 1; // 1, 2, or 3
    }

    this.blocks.push(block);
    this.render();
  }

  removeBlock(id) {
    this.blocks = this.blocks.filter(b => b.id !== id);
    this.render();
  }

  moveBlock(id, direction) {
    const idx = this.blocks.findIndex(b => b.id === id);
    if (idx === -1) return;
    const newIdx = idx + direction;
    if (newIdx < 0 || newIdx >= this.blocks.length) return;

    const temp = this.blocks[idx];
    this.blocks[idx] = this.blocks[newIdx];
    this.blocks[newIdx] = temp;
    this.render();
  }

  applyTemplate(template) {
    if (template === 'blank') {
      this.blocks = [];
    } else if (template === 'premade') {
      this.blocks = [
        { id: '1', type: 'text', content: '<h2>Overview</h2><p>Briefly describe the project goals and context.</p>', tocEntry: true, tocName: 'Overview' },
        { id: '2', type: 'text', content: '<h2>The Problem</h2><p>What challenge were you trying to solve?</p>', tocEntry: true, tocName: 'Problem' },
        { id: '3', type: 'image', images: [], grid: 1 },
        { id: '4', type: 'text', content: '<h2>Solution</h2><p>Describe your design process and the final outcome.</p>', tocEntry: true, tocName: 'Solution' }
      ];
    }
    this.render();
  }

  render() {
    const container = document.getElementById('builder-blocks-list');
    container.innerHTML = '';

    if (this.blocks.length === 0) {
      container.innerHTML = `<div class="builder-empty">Click an option in the sidebar to add a block</div>`;
      return;
    }

    this.blocks.forEach((block, idx) => {
      const el = document.createElement('div');
      el.className = 'builder-block-wrapper';
      el.dataset.id = block.id;

      let blockHtml = '';
      if (block.type === 'text') {
        blockHtml = this.renderTextBlock(block);
      } else if (block.type === 'image') {
        blockHtml = this.renderImageBlock(block);
      } else if (block.type === 'toc') {
        blockHtml = this.renderTocBlock(block);
      }

      el.innerHTML = `
        <div class="block-controls">
          <button class="ctrl-btn" onclick="builder.moveBlock('${block.id}', -1)" title="Move Up"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"/></svg></button>
          <button class="ctrl-btn" onclick="builder.moveBlock('${block.id}', 1)" title="Move Down"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg></button>
          <button class="ctrl-btn delete" onclick="builder.removeBlock('${block.id}')" title="Remove"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>
        </div>
        <div class="block-content">
          ${blockHtml}
        </div>
      `;

      container.appendChild(el);
      
      // Initialize RTE for text blocks
      if (block.type === 'text') {
        this.initRTE(block.id);
      }
      
      // Initialize Drag and Drop for Image Blocks
      if (block.type === 'image') {
        window.bindFileDragAndDrop(`image-block-drop-${block.id}`, `upload-${block.id}`);
      }
    });
  }

  renderTextBlock(block) {
    return `
      <div class="rte-toolbar">
        <button class="rte-btn" onclick="builder.exec('bold', '${block.id}')" title="Bold"><strong>B</strong></button>
        <button class="rte-btn" onclick="builder.exec('italic', '${block.id}')" title="Italic"><em>I</em></button>
        <button class="rte-btn" onclick="builder.openLinkModal()" title="Link">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
        </button>
        <input type="color" class="rte-color-picker" title="Text Color" onchange="builder.exec('foreColor', '${block.id}', this.value)">
        <button class="rte-btn" onclick="builder.exec('insertUnorderedList', '${block.id}')" title="List">•</button>
        <button class="rte-btn" onclick="builder.exec('formatBlock', '${block.id}', 'H2')" title="H2">H2</button>
        <button class="rte-btn" onclick="builder.exec('formatBlock', '${block.id}', 'P')" title="Text">P</button>
      </div>
      <div class="rte-editor" contenteditable="true" data-id="${block.id}" oninput="builder.updateTextBlock('${block.id}', this.innerHTML)">
        ${block.content}
      </div>
      <div class="block-toc-config" style="margin-top:12px; padding-top:12px; border-top:1px solid var(--lightest-navy); display:flex; align-items:center; gap:15px;">
        <label style="display:flex; align-items:center; gap:8px; font-size:12px; cursor:pointer; color:var(--light-slate);">
          <input type="checkbox" ${block.tocEntry ? 'checked' : ''} onchange="builder.updateBlockData('${block.id}', { tocEntry: this.checked })">
          Include in Table of Contents
        </label>
        ${block.tocEntry ? `
          <input type="text" placeholder="TOC Display Name" value="${block.tocName || ''}" oninput="builder.updateBlockData('${block.id}', { tocName: this.value })" style="background:var(--light-navy); border:1px solid var(--lightest-navy); color:var(--white); border-radius:4px; font-size:12px; padding:4px 8px; flex:1;">
        ` : ''}
      </div>
    `;
  }

  renderImageBlock(block) {
    return `
      <div class="image-block-header">
        <div class="grid-options">
          <span>Grid:</span>
          <button class="grid-btn ${block.grid === 1 ? 'active' : ''}" onclick="builder.updateImageGrid('${block.id}', 1)">1</button>
          <button class="grid-btn ${block.grid === 2 ? 'active' : ''}" onclick="builder.updateImageGrid('${block.id}', 2)">2</button>
          <button class="grid-btn ${block.grid === 3 ? 'active' : ''}" onclick="builder.updateImageGrid('${block.id}', 3)">3</button>
        </div>
      </div>
      <div class="image-block-dropzone" id="image-block-drop-${block.id}" onclick="builder.triggerImageUpload('${block.id}')">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
        <span><strong>Upload Images</strong> or Drag & Drop</span>
        <input type="file" id="upload-${block.id}" multiple accept="image/*" style="display:none" onchange="builder.handleImageUpload('${block.id}', this.files)">
      </div>
      <div class="image-grid grid-${block.grid}">
        ${block.images.length === 0 ? '<div class="empty-grid">No images uploaded</div>' : 
          block.images.map((img, i) => {
            let src = img;
            if (img.startsWith('/uploads')) {
              src = `${API}${img}`;
            } else if (img.startsWith('./') && this.slug) {
              src = `${API}/api/content/case-studies/${this.slug}/${img.substring(2)}`;
            }
            return `
              <div class="grid-item">
                <img src="${src}" />
                <button class="img-delete-btn" onclick="builder.removeImage('${block.id}', ${i})" title="Delete Image">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>`;
          }).join('')}
      </div>
    `;
  }

  renderTocBlock(block) {
    return `
      <div class="toc-block">
        <strong>Table of Contents</strong>
        <p class="toc-hint">(Generated automatically from H2 headers)</p>
      </div>
    `;
  }

  initRTE(id) {
    // Optional: add focus event if needed
  }

  exec(command, id, value = null) {
    const editor = document.querySelector(`.rte-editor[data-id="${id}"]`);
    editor.focus();
    document.execCommand(command, false, value);
  }

  updateTextBlock(id, content) {
    const block = this.blocks.find(b => b.id === id);
    if (block) block.content = content;
  }

  updateBlockData(id, data) {
    const block = this.blocks.find(b => b.id === id);
    if (block) {
      // Only re-render if it's a structural change (checkbox toggle)
      // Do NOT re-render for name input to avoid scroll jump and focus loss
      const needsRender = data.hasOwnProperty('tocEntry');
      Object.assign(block, data);
      if (needsRender) this.render();
    }
  }

  updateImageGrid(id, grid) {
    const block = this.blocks.find(b => b.id === id);
    if (block) {
      block.grid = grid;
      this.render();
    }
  }

  removeImage(blockId, imageIndex) {
    const block = this.blocks.find(b => b.id === blockId);
    if (block) {
      block.images.splice(imageIndex, 1);
      this.render();
    }
  }

  triggerImageUpload(id) {
    document.getElementById(`upload-${id}`).click();
  }

  async handleImageUpload(id, files) {
    const block = this.blocks.find(b => b.id === id);
    if (!block) return;

    const promises = Array.from(files).map(file => {
      return new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = (e) => {
          block.images.push(e.target.result);
          resolve();
        };
        reader.readAsDataURL(file);
      });
    });

    await Promise.all(promises);
    this.render();
  }

  async save() {
    const btn = document.getElementById('btn-builder-save');
    const originalText = btn.innerHTML;
    
    // Show Progress Overlay
    const overlay = document.getElementById('upload-progress-overlay');
    const bar = document.getElementById('progress-bar-fill');
    const status = document.getElementById('progress-status');
    
    overlay.classList.add('active');
    bar.style.width = '0%';
    status.textContent = 'Preparing files...';

    try {
      this.title = document.getElementById('builder-case-study-title').value.trim() || 'Untitled';
      
      if (!this.slug) {
        this.slug = this.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '');
        document.getElementById('builder-case-study-slug').textContent = `/${this.slug}`;
      }

      const body = {
        title: this.title,
        blocks: this.blocks,
        published: document.getElementById('builder-publish-toggle').checked,
        summary: document.getElementById('builder-meta-summary').value,
        role: document.getElementById('builder-meta-role').value,
        results: document.getElementById('builder-meta-results').value,
        methods: document.getElementById('builder-meta-methods').value,
        banner: this.banner
      };

      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${API}/api/case-studies/${this.slug}`, true);
      xhr.setRequestHeader('Content-Type', 'application/json');

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          bar.style.width = `${percent}%`;
          status.textContent = `Uploading data: ${percent}%`;
          if (percent === 100) status.textContent = 'Server processing...';
        }
      };

      const promise = new Promise((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) resolve(JSON.parse(xhr.responseText));
          else reject(new Error(xhr.responseText || 'Failed to save'));
        };
        xhr.onerror = () => reject(new Error('Network error'));
      });

      xhr.send(JSON.stringify(body));
      const res = await promise;

      bar.style.width = '100%';
      status.textContent = 'Finalizing...';
      
      // Update preview button
      const previewBtn = document.getElementById('btn-builder-preview');
      previewBtn.style.display = 'inline-flex';
      previewBtn.href = `http://localhost:8000/case-study/${this.slug}`;

      showToast('Case study saved successfully');
      await loadCaseStudies();
      
      setTimeout(() => {
        overlay.classList.remove('active');
      }, 1000);

    } catch (err) {
      console.error(err);
      showToast(err.message || 'Failed to save', 'error');
      overlay.classList.remove('active');
    } finally {
      btn.innerHTML = originalText;
      btn.disabled = false;
    }
  }

  toggleTOC() {
    this.tocEnabled = document.getElementById('builder-meta-toc-enable').checked;
    document.getElementById('builder-meta-toc-container').style.display = this.tocEnabled ? 'block' : 'none';
  }

  addTOCItem() {
    this.tocItems.push({ text: '', anchor: '' });
    this.renderTOCItems();
  }

  removeTOCItem(index) {
    this.tocItems.splice(index, 1);
    this.renderTOCItems();
  }

  updateTOCItem(index, field, value) {
    this.tocItems[index][field] = value;
  }

  renderTOCItems() {
    const container = document.getElementById('builder-meta-toc-items');
    container.innerHTML = '';
    
    this.tocItems.forEach((item, index) => {
      const itemEl = document.createElement('div');
      itemEl.className = 'toc-item-row';
      itemEl.style = 'display:flex; gap:10px; margin-bottom:10px;';
      itemEl.innerHTML = `
        <input type="text" placeholder="Title" value="${item.text}" oninput="builder.updateTOCItem(${index}, 'text', this.value)" style="flex:1;">
        <input type="text" placeholder="Anchor (e.g. discovery)" value="${item.anchor}" oninput="builder.updateTOCItem(${index}, 'anchor', this.value)" style="flex:1;">
        <button class="btn-icon btn-delete" onclick="builder.removeTOCItem(${index})">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
        </button>
      `;
      container.appendChild(itemEl);
    });
  }

  setViewMode(mode) {
    this.viewMode = mode;
    const canvas = document.getElementById('builder-canvas');
    const btnDesktop = document.getElementById('btn-view-desktop');
    const btnMobile = document.getElementById('btn-view-mobile');
    
    if (mode === 'mobile') {
      canvas.classList.add('mobile-view');
      btnMobile.classList.add('active');
      btnDesktop.classList.remove('active');
    } else {
      canvas.classList.remove('mobile-view');
      btnMobile.classList.remove('active');
      btnDesktop.classList.add('active');
    }
  }

  handleBannerUpload(files) {
    if (files && files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.banner = e.target.result;
        const bannerPreview = document.getElementById('banner-preview');
        const bannerPlaceholder = document.getElementById('banner-placeholder');
        bannerPreview.src = this.banner;
        bannerPreview.style.display = 'block';
        bannerPlaceholder.style.display = 'none';
      };
      reader.readAsDataURL(files[0]);
    }
  }
}

const builder = new CaseStudyBuilder();

// Link app.js openBuilder to this instance
window.openBuilder = (slug) => builder.open(slug);
