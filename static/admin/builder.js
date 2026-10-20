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
    this.projectType = 'case-study';
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

    const slugHeader = document.getElementById('builder-case-study-slug-header');
    const slugSidebar = document.getElementById('builder-meta-slug');
    if (slugHeader && slugSidebar) {
      slugHeader.addEventListener('input', (e) => slugSidebar.value = e.target.value);
      slugSidebar.addEventListener('input', (e) => slugHeader.value = e.target.value);
    }

    // Dynamic details
    document.getElementById('btn-add-meta-detail').addEventListener('click', () => this.addDetailRow('', ''));

    // Project Type Selector (Case Study vs AI Lab)
    const typeRadios = document.querySelectorAll('input[name="builder-project-type"]');
    typeRadios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        if (e.target.checked) this.setProjectType(e.target.value);
      });
    });
    const labelCS = document.getElementById('label-type-case-study');
    const labelAI = document.getElementById('label-type-ai-lab');
    if (labelCS) {
      labelCS.addEventListener('click', () => this.setProjectType('case-study'));
    }
    if (labelAI) {
      labelAI.addEventListener('click', () => this.setProjectType('ai-lab'));
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
    this.initDragAndDrop();
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


  setProjectType(type) {
    this.projectType = (type === 'ai-lab') ? 'ai-lab' : 'case-study';
    const isAILab = this.projectType === 'ai-lab';
    const prefix = isAILab ? 'ai-lab' : 'case-study';

    const radios = document.querySelectorAll('input[name="builder-project-type"]');
    radios.forEach(r => {
      r.checked = (r.value === this.projectType);
    });

    const labelCS = document.getElementById('label-type-case-study');
    const labelAI = document.getElementById('label-type-ai-lab');
    if (labelCS) labelCS.classList.toggle('active', !isAILab);
    if (labelAI) labelAI.classList.toggle('active', isAILab);

    const metaCS = document.getElementById('builder-meta-case-study');
    const metaAI = document.getElementById('builder-meta-ai-lab');
    if (metaCS) metaCS.style.display = isAILab ? 'none' : 'block';
    if (metaAI) metaAI.style.display = isAILab ? 'block' : 'none';

    // Synchronize values between Case Study and AI Lab inputs
    const titleHeader = document.getElementById('builder-case-study-title');
    const titleAI = document.getElementById('builder-ai-title');
    if (isAILab) {
      if (titleAI && titleHeader && !titleAI.value) titleAI.value = titleHeader.value;
    } else {
      if (titleHeader && titleAI && !titleHeader.value) titleHeader.value = titleAI.value;
    }

    const slugHeader = document.getElementById('builder-case-study-slug-header');
    const slugMeta = document.getElementById('builder-meta-slug');
    const slugAI = document.getElementById('builder-ai-slug');
    const currentSlug = this.slug || slugHeader?.value || slugMeta?.value || slugAI?.value || '';
    if (slugHeader) slugHeader.value = currentSlug;
    if (slugMeta) slugMeta.value = currentSlug;
    if (slugAI) slugAI.value = currentSlug;

    const headerPrefix = document.getElementById('builder-slug-prefix');
    if (headerPrefix) headerPrefix.textContent = `/${prefix}/`;
    const metaPrefix = document.getElementById('builder-meta-slug-prefix');
    if (metaPrefix) metaPrefix.textContent = `/${prefix}/`;

    const previewBtn = document.getElementById('btn-builder-preview');
    if (previewBtn && this.slug) {
      previewBtn.href = `${window.location.origin}/${prefix}/${this.slug}/`;
    }

    if (isAILab) {
      this.renderAILabels();
      this.renderAICTAPreview();
      this.updateBannerDisplay(this.banner);
    }
  }

  open(slug) {
    const study = caseStudies.find(s => s.slug === slug);
    if (!study) return;

    this.slug = slug;
    this.title = study.title;
    this.published = study.published;
    this.aiLabels = [];
    this.setProjectType(study.project_type || 'case-study');
    
    document.getElementById('builder-case-study-title').value = this.title;
    const slugHeader = document.getElementById('builder-case-study-slug-header');
    if (slugHeader) slugHeader.value = this.slug;
    document.getElementById('builder-publish-toggle').checked = this.published;
    
    const previewBtn = document.getElementById('btn-builder-preview');
    previewBtn.style.display = 'inline-flex';
    const prefix = (this.projectType === 'ai-lab') ? 'ai-lab' : 'case-study';
    previewBtn.href = `${window.location.origin}/${prefix}/${this.slug}/`;
    
    document.getElementById('builder-overlay').classList.add('active');
    
    this.loadData();
  }

  openNew() {
    this.slug = null;
    this.title = '';
    this.published = false;
    this.blocks = [];
    this.banner = '';
    this.aiLabels = [];
    this.setProjectType('case-study');
    
    document.getElementById('builder-case-study-title').value = '';
    const slugHeader = document.getElementById('builder-case-study-slug-header');
    if (slugHeader) slugHeader.value = 'new-case-study';
    document.getElementById('builder-publish-toggle').checked = false;
    document.getElementById('btn-builder-preview').style.display = 'none';
    
    document.getElementById('builder-meta-tagline').value = '';
    document.getElementById('builder-meta-subtagline').value = '';
    document.getElementById('builder-meta-details-list').innerHTML = '';

    const aiLabel = document.getElementById('builder-ai-label');
    if (aiLabel) aiLabel.value = 'AI LAB';
    const aiTitle = document.getElementById('builder-ai-title');
    if (aiTitle) aiTitle.value = '';
    const aiSubtext = document.getElementById('builder-ai-subtext');
    if (aiSubtext) aiSubtext.value = '';
    const aiSlug = document.getElementById('builder-ai-slug');
    if (aiSlug) aiSlug.value = '';
    const ctaEnable = document.getElementById('ai-builder-cta-enable');
    if (ctaEnable) ctaEnable.checked = false;
    this.toggleAICTA(false);
    this.renderAILabels();

    this.updateBannerDisplay('');

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
      if (meta.project_type) {
        this.setProjectType(meta.project_type);
      }
      
      const summaryParts = (meta.summary || '').split(' || ');
      const slugInput = document.getElementById('builder-meta-slug');
      const slugHeader = document.getElementById('builder-case-study-slug-header');
      const finalSlug = meta.slug || this.slug || '';
      if (slugInput) slugInput.value = finalSlug;
      if (slugHeader) slugHeader.value = finalSlug;
      document.getElementById('builder-meta-tagline').value = summaryParts[0] || '';
      document.getElementById('builder-meta-subtagline').value = summaryParts[1] || '';

      const container = document.getElementById('builder-meta-details-list');
      container.innerHTML = '';
      if (meta.details && meta.details.length > 0) {
        meta.details.forEach(d => this.addDetailRow(d.label, d.value));
      } else {
        const roleParts = (meta.role || '').split(' || ');
        if (roleParts[0]) this.addDetailRow('My Role', roleParts[0]);
        if (meta.results) this.addDetailRow('Project Type', meta.results);
        if (roleParts[1]) this.addDetailRow('Timeline', roleParts[1]);
        if (meta.methods) this.addDetailRow('Team', meta.methods);
      }
      
      this.banner = meta.banner || '';
      this.updateBannerDisplay(this.banner);

      // AI Lab specific metadata
      this.aiLabels = Array.isArray(meta.labels) ? meta.labels : [];
      const aiLabelInput = document.getElementById('builder-ai-label');
      if (aiLabelInput) aiLabelInput.value = meta.ai_label || 'AI LAB';

      const aiTitleInput = document.getElementById('builder-ai-title');
      if (aiTitleInput) aiTitleInput.value = meta.title || this.title || '';

      const aiSubtextInput = document.getElementById('builder-ai-subtext');
      if (aiSubtextInput) aiSubtextInput.value = summaryParts[0] || meta.summary || '';

      const aiSlugInput = document.getElementById('builder-ai-slug');
      if (aiSlugInput) aiSlugInput.value = finalSlug;

      // AI Lab CTA button
      let btnData = meta.cta_button;
      if (!btnData && this.blocks && this.blocks.length > 0 && this.blocks[0].type === 'button') {
        btnData = {
          enabled: true,
          text: this.blocks[0].text || 'View Project',
          url: this.blocks[0].url || '',
          styleVariant: this.blocks[0].styleVariant || 'outline',
          color: this.blocks[0].color || '#64ffda',
        };
      }

      const ctaEnable = document.getElementById('ai-builder-cta-enable');
      const ctaText = document.getElementById('ai-cta-text');
      const ctaUrl = document.getElementById('ai-cta-url');
      const ctaStyle = document.getElementById('ai-cta-style');
      const ctaColor = document.getElementById('ai-cta-color');

      if (btnData && btnData.enabled !== false && (btnData.text || btnData.url)) {
        if (ctaEnable) ctaEnable.checked = true;
        if (ctaText) ctaText.value = btnData.text || 'Chrome Store';
        if (ctaUrl) ctaUrl.value = btnData.url || '';
        if (ctaStyle) ctaStyle.value = btnData.styleVariant || 'outline';
        if (ctaColor) ctaColor.value = btnData.color || '#64ffda';
        this.toggleAICTA(true);
      } else {
        if (ctaEnable) ctaEnable.checked = false;
        this.toggleAICTA(false);
      }

      this.renderAILabels();
      this.renderAICTAPreview();
      
      this.render();
    } catch (err) {
      showToast('Failed to load content', 'error');
    }
  }

  addDetailRow(label, value) {
    const container = document.getElementById('builder-meta-details-list');
    const div = document.createElement('div');
    div.className = 'detail-row';
    div.style.display = 'flex';
    div.style.gap = '10px';
    div.innerHTML = `
      <input type="text" placeholder="Label (e.g. Timeline)" value="${(label||'').replace(/"/g, '&quot;')}" class="detail-label" style="flex: 1; min-width: 0;">
      <input type="text" placeholder="Value (e.g. 3 Months)" value="${(value||'').replace(/"/g, '&quot;')}" class="detail-value" style="flex: 2; min-width: 0;">
      <button type="button" class="btn-delete-detail" title="Remove" style="background: var(--light-navy); border: 1px solid var(--lightest-navy); color: var(--red); cursor: pointer; border-radius: 4px; padding: 0 10px;">✕</button>
    `;
    div.querySelector('.btn-delete-detail').onclick = () => div.remove();
    container.appendChild(div);
  }

  getBlockBadgeLabel(type) {
    const labels = {
      text: 'Text Section',
      image: 'Image Grid',
      cards: 'Add Cards',
      callout: 'Callout (Pro Tips)',
      button: 'CTA Button',
      toc: 'Table of Contents'
    };
    return labels[type] || 'Block Section';
  }

  createBlockObject(type) {
    const id = Date.now().toString() + '-' + Math.floor(Math.random() * 1000);
    let block = { id, type };

    if (type === 'text') {
      block.content = '<h2>New Section</h2><p>Start writing here...</p>';
      block.tocEntry = false;
      block.tocName = '';
    } else if (type === 'image') {
      block.images = [];
      block.grid = 1; // 1, 2, or 3
    } else if (type === 'cards') {
      block.grid = 3;
      block.cards = [
        { heading: '', text: '' },
        { heading: '', text: '' },
        { heading: '', text: '' }
      ];
    } else if (type === 'callout') {
      block.heading = 'Pro Tips';
      block.content = '<ul><li>Tip 1</li><li>Tip 2</li></ul>';
    } else if (type === 'button') {
      block.text = 'View Project';
      block.url = '';
      block.styleVariant = 'outline';
      block.color = '#64ffda';
      block.fontSize = '14px';
      block.borderRadius = '4px';
      block.borderWidth = '1px';
      block.borderStyle = 'solid';
      block.align = 'center';
      block.newTab = true;
    }
    return block;
  }

  syncCurrentBlocksFromDOM() {
    const container = document.getElementById('builder-blocks-list');
    if (!container) return;

    const wrappers = container.querySelectorAll('.builder-block-wrapper');
    wrappers.forEach(wrapper => {
      const id = wrapper.dataset.id;
      const block = this.blocks.find(b => b.id === id);
      if (!block) return;

      if (block.type === 'text') {
        const editor = wrapper.querySelector('.rte-editor');
        if (editor) block.content = editor.innerHTML;
        const tocCheck = wrapper.querySelector('.block-toc-config input[type="checkbox"]');
        if (tocCheck) block.tocEntry = tocCheck.checked;
        const tocInput = wrapper.querySelector('.block-toc-config input[type="text"]');
        if (tocInput) block.tocName = tocInput.value;
      } else if (block.type === 'callout') {
        const titleInput = wrapper.querySelector('input[type="text"]');
        if (titleInput) block.heading = titleInput.value;
        const editor = wrapper.querySelector('.rte-editor');
        if (editor) block.content = editor.innerHTML;
      } else if (block.type === 'cards') {
        const cardBoxes = wrapper.querySelectorAll('.cards-builder-grid > div');
        cardBoxes.forEach((box, i) => {
          if (block.cards[i]) {
            const hInput = box.querySelector('input[type="text"]');
            if (hInput) block.cards[i].heading = hInput.value;
            const tArea = box.querySelector('textarea');
            if (tArea) block.cards[i].text = tArea.value;
          }
        });
      } else if (block.type === 'button') {
        const textInput = wrapper.querySelector('input[placeholder*="Live App"], input[placeholder*="Project"]');
        if (textInput) block.text = textInput.value;
        const urlInput = wrapper.querySelector('input[type="url"], input[placeholder*="https://"]');
        if (urlInput) block.url = urlInput.value;
      }
    });
  }

  addBlock(type) {
    this.syncCurrentBlocksFromDOM();
    const block = this.createBlockObject(type);
    this.blocks.push(block);
    this.render();

    setTimeout(() => {
      const el = document.querySelector(`.builder-block-wrapper[data-id="${block.id}"]`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('block-just-inserted');
        setTimeout(() => el.classList.remove('block-just-inserted'), 1200);
      }
    }, 60);
  }

  insertBlockAt(type, index) {
    this.syncCurrentBlocksFromDOM();
    const block = this.createBlockObject(type);
    if (index === undefined || index === null || index >= this.blocks.length) {
      this.blocks.push(block);
    } else {
      const safeIndex = Math.max(0, index);
      this.blocks.splice(safeIndex, 0, block);
    }
    this.render();

    setTimeout(() => {
      const el = document.querySelector(`.builder-block-wrapper[data-id="${block.id}"]`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('block-just-inserted');
        setTimeout(() => el.classList.remove('block-just-inserted'), 1200);
      }
    }, 60);
  }

  reorderBlock(fromIndex, toIndex) {
    if (fromIndex === toIndex || fromIndex < 0 || fromIndex >= this.blocks.length) return;
    this.syncCurrentBlocksFromDOM();
    const [moved] = this.blocks.splice(fromIndex, 1);
    const safeToIndex = Math.max(0, Math.min(toIndex, this.blocks.length));
    this.blocks.splice(safeToIndex, 0, moved);
    this.render();

    setTimeout(() => {
      const el = document.querySelector(`.builder-block-wrapper[data-id="${moved.id}"]`);
      if (el) {
        el.classList.add('block-just-inserted');
        setTimeout(() => el.classList.remove('block-just-inserted'), 1000);
      }
    }, 60);
  }

  removeBlock(id) {
    this.syncCurrentBlocksFromDOM();
    this.blocks = this.blocks.filter(b => b.id !== id);
    this.render();
  }

  moveBlock(id, direction) {
    this.syncCurrentBlocksFromDOM();
    const idx = this.blocks.findIndex(b => b.id === id);
    if (idx === -1) return;
    const newIdx = idx + direction;
    if (newIdx < 0 || newIdx >= this.blocks.length) return;

    const temp = this.blocks[idx];
    this.blocks[idx] = this.blocks[newIdx];
    this.blocks[newIdx] = temp;
    this.render();

    setTimeout(() => {
      const el = document.querySelector(`.builder-block-wrapper[data-id="${id}"]`);
      if (el) {
        el.classList.add('block-just-inserted');
        setTimeout(() => el.classList.remove('block-just-inserted'), 800);
      }
    }, 60);
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

  getDropTarget(e) {
    const container = document.getElementById('builder-blocks-list');
    const wrappers = Array.from(container.querySelectorAll('.builder-block-wrapper:not(.is-dragging)'));

    if (wrappers.length === 0) {
      return { index: 0, element: null, position: 'inside' };
    }

    const clientY = e.clientY;

    for (let i = 0; i < wrappers.length; i++) {
      const rect = wrappers[i].getBoundingClientRect();
      const midY = rect.top + rect.height / 2;
      if (clientY < midY) {
        return {
          index: i,
          element: wrappers[i],
          position: 'before'
        };
      }
    }

    return {
      index: wrappers.length,
      element: wrappers[wrappers.length - 1],
      position: 'after'
    };
  }

  showDropIndicator(target) {
    if (!target) return;

    let indicator = document.getElementById('builder-drop-indicator');
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.id = 'builder-drop-indicator';
      indicator.className = 'builder-drop-indicator';
    }

    let label = 'Insert Block Here';
    if (this.draggingType === 'new' && this.draggedToolType) {
      label = `+ Insert ${this.getBlockBadgeLabel(this.draggedToolType)}`;
    } else if (this.draggingType === 'reorder') {
      label = '↕ Move Section Here';
    }
    indicator.setAttribute('data-label', label);

    const container = document.getElementById('builder-blocks-list');
    const empty = document.querySelector('.builder-empty');

    if (target.position === 'inside' || !target.element) {
      if (empty) empty.classList.add('drag-target-active');
      if (indicator.parentNode !== container) {
        container.appendChild(indicator);
      }
      return;
    }

    if (empty) empty.classList.remove('drag-target-active');

    if (target.position === 'before') {
      if (target.element.previousElementSibling !== indicator) {
        container.insertBefore(indicator, target.element);
      }
    } else if (target.position === 'after') {
      if (target.element.nextElementSibling !== indicator) {
        if (target.element.nextSibling) {
          container.insertBefore(indicator, target.element.nextSibling);
        } else {
          container.appendChild(indicator);
        }
      }
    }
  }

  removeDropIndicator() {
    const indicator = document.getElementById('builder-drop-indicator');
    if (indicator && indicator.parentNode) {
      indicator.parentNode.removeChild(indicator);
    }
    const empty = document.querySelector('.builder-empty');
    if (empty) empty.classList.remove('drag-target-active');
  }

  initDragAndDrop() {
    this.draggingType = null;
    this.draggedToolType = null;
    this.draggingBlockId = null;
    this.currentDropTarget = null;

    // Sidebar Tools: Drag to insert
    const tools = document.querySelectorAll('.builder-sidebar .block-tool');
    tools.forEach(tool => {
      tool.setAttribute('draggable', 'true');

      tool.addEventListener('dragstart', (e) => {
        this.syncCurrentBlocksFromDOM();
        const type = tool.dataset.type || tool.getAttribute('onclick')?.match(/'([^']+)'/)?.[1];
        if (!type) return;

        this.draggingType = 'new';
        this.draggedToolType = type;
        tool.classList.add('is-dragging-tool');

        e.dataTransfer.effectAllowed = 'copy';
        e.dataTransfer.setData('text/plain', type);
        e.dataTransfer.setData('application/x-builder-tool', type);

        document.body.classList.add('builder-is-dragging');
      });

      tool.addEventListener('dragend', () => {
        tool.classList.remove('is-dragging-tool');
        document.body.classList.remove('builder-is-dragging');
        this.draggingType = null;
        this.draggedToolType = null;
        this.removeDropIndicator();
      });
    });

    // Canvas Drop Target & Auto-Scroll
    const canvas = document.querySelector('.builder-canvas');
    if (!canvas) return;

    canvas.addEventListener('dragover', (e) => {
      if (!this.draggingType) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = this.draggingType === 'new' ? 'copy' : 'move';

      // Auto-scroll when near top or bottom edges
      const rect = canvas.getBoundingClientRect();
      const scrollZone = 70;
      if (e.clientY < rect.top + scrollZone) {
        canvas.scrollTop -= 14;
      } else if (e.clientY > rect.bottom - scrollZone) {
        canvas.scrollTop += 14;
      }

      const target = this.getDropTarget(e);
      this.currentDropTarget = target;
      this.showDropIndicator(target);
    });

    canvas.addEventListener('dragleave', (e) => {
      if (!this.draggingType) return;
      const rect = canvas.getBoundingClientRect();
      if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) {
        this.removeDropIndicator();
        this.currentDropTarget = null;
      }
    });

    canvas.addEventListener('drop', (e) => {
      if (!this.draggingType) return;
      e.preventDefault();
      e.stopPropagation();

      const target = this.currentDropTarget || this.getDropTarget(e);
      const draggingType = this.draggingType;
      const draggedToolType = this.draggedToolType;
      const draggingBlockId = this.draggingBlockId;

      this.removeDropIndicator();
      this.draggingType = null;
      this.draggedToolType = null;
      this.draggingBlockId = null;
      this.currentDropTarget = null;
      document.body.classList.remove('builder-is-dragging');

      if (draggingType === 'new' && draggedToolType) {
        let insertIndex = this.blocks.length;
        if (target && target.element && target.element.dataset.id) {
          const idxInBlocks = this.blocks.findIndex(b => b.id === target.element.dataset.id);
          if (idxInBlocks !== -1) {
            insertIndex = target.position === 'before' ? idxInBlocks : idxInBlocks + 1;
          }
        } else if (target && target.position === 'inside') {
          insertIndex = 0;
        }
        this.insertBlockAt(draggedToolType, insertIndex);
      } else if (draggingType === 'reorder' && draggingBlockId) {
        const fromIndex = this.blocks.findIndex(b => b.id === draggingBlockId);
        if (fromIndex !== -1) {
          let toIndex = fromIndex;
          if (target && target.element && target.element.dataset.id) {
            const targetBlockIndex = this.blocks.findIndex(b => b.id === target.element.dataset.id);
            if (targetBlockIndex !== -1) {
              toIndex = target.position === 'before' ? targetBlockIndex : targetBlockIndex + 1;
              if (fromIndex < toIndex) {
                toIndex = toIndex - 1;
              }
            }
          } else if (target && target.position === 'after') {
            toIndex = this.blocks.length - 1;
          } else if (target && target.position === 'inside') {
            toIndex = 0;
          }
          if (fromIndex !== toIndex) {
            this.reorderBlock(fromIndex, toIndex);
          }
        }
      }
    });

    // Global listener to cleanup draggable attribute if mouse released
    document.addEventListener('mouseup', () => {
      if (!this.draggingType) {
        const draggables = document.querySelectorAll('.builder-block-wrapper[draggable="true"]');
        draggables.forEach(d => d.removeAttribute('draggable'));
      }
    });
  }

  render() {
    const container = document.getElementById('builder-blocks-list');
    container.innerHTML = '';

    if (this.blocks.length === 0) {
      container.innerHTML = `<div class="builder-empty">Click an option in the sidebar or drag blocks here to start building</div>`;
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
      } else if (block.type === 'cards') {
        blockHtml = this.renderCardsBlock(block);
      } else if (block.type === 'callout') {
        blockHtml = this.renderCalloutBlock(block);
      } else if (block.type === 'button') {
        blockHtml = this.renderButtonBlock(block);
      }

      const blockLabel = this.getBlockBadgeLabel(block.type);

      el.innerHTML = `
        <div class="block-header-bar">
          <div class="block-drag-handle" title="Drag up or down to reorder" style="cursor: grab;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="8" cy="6" r="2"/><circle cx="16" cy="6" r="2"/>
              <circle cx="8" cy="12" r="2"/><circle cx="16" cy="12" r="2"/>
              <circle cx="8" cy="18" r="2"/><circle cx="16" cy="18" r="2"/>
            </svg>
            <span class="block-badge">${blockLabel}</span>
          </div>
          <div class="block-header-meta">
            <span class="block-order-badge">Section ${idx + 1}</span>
          </div>
        </div>

        <div class="block-controls">
          <button class="ctrl-btn drag-handle" title="Drag to reorder" type="button" style="cursor: grab;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="8" cy="6" r="2"/><circle cx="16" cy="6" r="2"/>
              <circle cx="8" cy="12" r="2"/><circle cx="16" cy="12" r="2"/>
              <circle cx="8" cy="18" r="2"/><circle cx="16" cy="18" r="2"/>
            </svg>
          </button>
          <button class="ctrl-btn" onclick="builder.moveBlock('${block.id}', -1)" title="Move Up"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"/></svg></button>
          <button class="ctrl-btn" onclick="builder.moveBlock('${block.id}', 1)" title="Move Down"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg></button>
          <button class="ctrl-btn delete" onclick="builder.removeBlock('${block.id}')" title="Remove"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>
        </div>
        <div class="block-content">
          ${blockHtml}
        </div>
      `;

      // Setup drag handles on this block wrapper
      const handles = el.querySelectorAll('.block-drag-handle, .ctrl-btn.drag-handle');
      handles.forEach(h => {
        h.addEventListener('mousedown', () => {
          el.setAttribute('draggable', 'true');
        });
        h.addEventListener('touchstart', () => {
          el.setAttribute('draggable', 'true');
        }, { passive: true });
      });

      el.addEventListener('dragstart', (e) => {
        this.syncCurrentBlocksFromDOM();
        this.draggingType = 'reorder';
        this.draggingBlockId = block.id;
        el.classList.add('is-dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', block.id);
        e.dataTransfer.setData('application/x-builder-block', block.id);
        document.body.classList.add('builder-is-dragging');
      });

      el.addEventListener('dragend', () => {
        el.removeAttribute('draggable');
        el.classList.remove('is-dragging');
        document.body.classList.remove('builder-is-dragging');
        this.draggingType = null;
        this.draggingBlockId = null;
        this.removeDropIndicator();
      });

      container.appendChild(el);
      
      // Initialize RTE for text and callout blocks
      if (block.type === 'text' || block.type === 'callout') {
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
        <select class="rte-select" onchange="builder.applyCustomStyle('${block.id}', 'fontWeight', this.value); this.value=''" title="Font Weight">
          <option value="">Weight...</option>
          <option value="400">Regular</option>
          <option value="500">Medium</option>
          <option value="700">Bold</option>
        </select>
        <select class="rte-select" onchange="builder.applyCustomStyle('${block.id}', 'fontSize', this.value); this.value=''" title="Font Size">
          <option value="">Size...</option>
          <option value="12px">12px</option>
          <option value="14px">14px</option>
          <option value="15px">15px</option>
          <option value="16px">16px</option>
          <option value="18px">18px</option>
          <option value="20px">20px</option>
          <option value="24px">24px</option>
          <option value="32px">32px</option>
        </select>
        <button class="rte-btn" onclick="builder.exec('italic', '${block.id}')" title="Italic"><em>I</em></button>
        <button class="rte-btn" onclick="builder.openLinkModal()" title="Link">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
        </button>
        <input type="color" class="rte-color-picker" title="Text Color" onchange="builder.applyCustomStyle('${block.id}', 'color', this.value)">
        <button class="rte-btn" onclick="builder.exec('insertUnorderedList', '${block.id}')" title="List">•</button>
        <button class="rte-btn" onclick="builder.exec('formatBlock', '${block.id}', 'H2')" title="H2">H2</button>
        <button class="rte-btn" onclick="builder.exec('formatBlock', '${block.id}', 'P')" title="Text">P</button>
        <button class="rte-btn" onclick="builder.exec('insertHorizontalRule', '${block.id}')" title="Horizontal Line">—</button>
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

  renderCalloutBlock(block) {
    return `
      <div style="margin-bottom: 15px;">
        <label style="display:block; font-size:12px; color:var(--light-slate); margin-bottom:5px;">Callout Title</label>
        <input type="text" value="${block.heading || ''}" oninput="builder.updateBlockData('${block.id}', { heading: this.value })" style="width:100%; background:var(--light-navy); border:1px solid var(--lightest-navy); color:var(--white); border-radius:4px; padding:8px; font-weight:bold; font-size:16px;">
      </div>
      <div class="rte-toolbar">
        <button class="rte-btn" onclick="builder.exec('italic', '${block.id}')" title="Italic"><em>I</em></button>
        <button class="rte-btn" onclick="builder.openLinkModal()" title="Link">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
        </button>
        <button class="rte-btn" onclick="builder.exec('insertUnorderedList', '${block.id}')" title="List">•</button>
        <button class="rte-btn" onclick="builder.exec('formatBlock', '${block.id}', 'P')" title="Text">P</button>
      </div>
      <div class="rte-editor" contenteditable="true" data-id="${block.id}" oninput="builder.updateTextBlock('${block.id}', this.innerHTML)" style="min-height: 80px; padding: 15px; background: var(--navy); border-radius: 8px;">
        ${block.content || ''}
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

  renderCardsBlock(block) {
    return `
      <div class="image-block-header">
        <div class="grid-options">
          <span>Cards:</span>
          <button class="grid-btn ${block.grid === 2 ? 'active' : ''}" onclick="builder.updateCardGrid('${block.id}', 2)">1x2</button>
          <button class="grid-btn ${block.grid === 3 ? 'active' : ''}" onclick="builder.updateCardGrid('${block.id}', 3)">1x3</button>
          <button class="grid-btn ${block.grid === 4 ? 'active' : ''}" onclick="builder.updateCardGrid('${block.id}', 4)">1x4</button>
        </div>
      </div>
      <div class="cards-builder-grid" style="display:grid; grid-template-columns:repeat(${block.grid}, 1fr); gap:15px; margin-top:15px;">
        ${block.cards.map((card, i) => `
          <div style="background:var(--navy); padding:15px; border-radius:8px; border:1px solid var(--lightest-navy);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:5px;">
              <label style="font-size:12px; color:var(--light-slate);">Heading</label>
              <div style="display:flex; align-items:center; gap:8px;">
                <select onchange="builder.updateCardContent('${block.id}', ${i}, 'fontSize', this.value)" style="background:var(--light-navy); border:1px solid var(--lightest-navy); color:var(--white); border-radius:4px; padding:2px 4px; font-size:11px; cursor:pointer;" title="Heading Text Size">
                  <option value="" ${!card.fontSize ? 'selected' : ''}>Size (Default 36px)</option>
                  <option value="14px" ${card.fontSize === '14px' ? 'selected' : ''}>14px</option>
                  <option value="16px" ${card.fontSize === '16px' ? 'selected' : ''}>16px</option>
                  <option value="18px" ${card.fontSize === '18px' ? 'selected' : ''}>18px</option>
                  <option value="20px" ${card.fontSize === '20px' ? 'selected' : ''}>20px</option>
                  <option value="24px" ${card.fontSize === '24px' ? 'selected' : ''}>24px</option>
                  <option value="28px" ${card.fontSize === '28px' ? 'selected' : ''}>28px</option>
                  <option value="32px" ${card.fontSize === '32px' ? 'selected' : ''}>32px</option>
                  <option value="36px" ${card.fontSize === '36px' ? 'selected' : ''}>36px</option>
                  <option value="40px" ${card.fontSize === '40px' ? 'selected' : ''}>40px</option>
                  <option value="48px" ${card.fontSize === '48px' ? 'selected' : ''}>48px</option>
                </select>
                <input type="color" value="${card.color || '#64ffda'}" onchange="builder.updateCardContent('${block.id}', ${i}, 'color', this.value)" style="width:24px; height:24px; padding:0; border:none; background:transparent; cursor:pointer;" title="Heading Color">
              </div>
            </div>
            <input type="text" value="${card.heading || ''}" oninput="builder.updateCardContent('${block.id}', ${i}, 'heading', this.value)" style="width:100%; background:var(--light-navy); border:1px solid var(--lightest-navy); color:${card.color || 'var(--green)'}; border-radius:4px; padding:8px; margin-bottom:10px; font-weight:bold; font-size:${card.fontSize || '24px'};">
            <label style="display:block; font-size:12px; color:var(--light-slate); margin-bottom:5px;">Subtext</label>
            <textarea oninput="builder.updateCardContent('${block.id}', ${i}, 'text', this.value)" style="width:100%; background:var(--light-navy); border:1px solid var(--lightest-navy); color:var(--white); border-radius:4px; padding:8px; font-size:14px; min-height:80px; resize:vertical;">${card.text || ''}</textarea>
          </div>
        `).join('')}
      </div>
    `;
  }

  updateCardGrid(id, size) {
    const block = this.blocks.find(b => b.id === id);
    if (!block) return;
    block.grid = size;
    // Adjust array size
    while (block.cards.length < size) {
      block.cards.push({ heading: '', text: '' });
    }
    if (block.cards.length > size) {
      block.cards = block.cards.slice(0, size);
    }
    this.render();
  }

  updateCardContent(id, index, field, value) {
    const block = this.blocks.find(b => b.id === id);
    if (!block || !block.cards[index]) return;
    block.cards[index][field] = value;
    if (field === 'color' || field === 'fontSize') {
      this.render();
    }
  }

  renderButtonBlock(block) {
    const text = block.text !== undefined ? block.text : 'View Project';
    const url = block.url || '';
    const styleVariant = block.styleVariant || 'outline'; // 'outline' | 'filled'
    const color = block.color || '#64ffda';
    const fontSize = block.fontSize || '14px';
    const borderRadius = block.borderRadius || '4px';
    const borderWidth = block.borderWidth || '1px';
    const borderStyle = block.borderStyle || 'solid';
    const align = block.align || 'center';
    const newTab = block.newTab !== false;

    const isFilled = styleVariant === 'filled';
    const borderProp = borderStyle === 'none' ? 'none' : `${borderWidth} ${borderStyle} ${color}`;
    const bgProp = isFilled ? color : 'transparent';
    const textProp = isFilled ? '#0a192f' : color;
    const safeEsc = (s) => (window.esc ? window.esc(s) : String(s || '').replace(/"/g, '&quot;'));

    const presetColors = ['#64ffda', '#ffffff', '#57cbff', '#bd93f9', '#ff79c6', '#ffb86c'];

    return `
      <div class="cta-block-editor" style="display:flex; flex-direction:column; gap:16px;">
        <div style="display:flex; align-items:center; justify-content:space-between; border-bottom:1px solid var(--lightest-navy); padding-bottom:10px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2">
              <rect x="2" y="6" width="20" height="12" rx="4" />
              <path d="M7 12h10" />
              <polyline points="13 8 17 12 13 16" />
            </svg>
            <strong style="color:var(--white); font-size:13px; font-family:var(--font-mono); text-transform:uppercase; letter-spacing:0.5px;">CTA Button</strong>
          </div>
          <button type="button" class="btn-secondary-sm" onclick="builder.resetButtonDefaults('${block.id}')" style="font-size:11px; padding:4px 10px; cursor:pointer;" title="Reset to default portfolio CTA button">
            Reset to Default
          </button>
        </div>

        <!-- Inputs Row: Text & Link -->
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
          <div>
            <label style="display:block; font-size:11px; color:var(--light-slate); margin-bottom:5px; font-family:var(--font-mono); font-weight:600;">BUTTON TEXT</label>
            <input type="text" value="${safeEsc(text)}" oninput="builder.updateButtonBlock('${block.id}', 'text', this.value)" placeholder="e.g. View Live App" style="width:100%; background:var(--dark-navy); border:1px solid var(--border-color); color:var(--white); border-radius:6px; padding:8px 12px; font-size:13px; box-sizing:border-box;">
          </div>
          <div>
            <label style="display:block; font-size:11px; color:var(--light-slate); margin-bottom:5px; font-family:var(--font-mono); font-weight:600;">BUTTON LINK (URL)</label>
            <input type="url" value="${safeEsc(url)}" oninput="builder.updateButtonBlock('${block.id}', 'url', this.value)" placeholder="https://..." style="width:100%; background:var(--dark-navy); border:1px solid var(--border-color); color:var(--white); border-radius:6px; padding:8px 12px; font-size:13px; box-sizing:border-box;">
          </div>
        </div>

        <!-- Properties Grid -->
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap:12px; background:var(--navy); padding:14px; border-radius:8px; border:1px solid var(--lightest-navy);">
          <!-- Style Variant -->
          <div>
            <label style="display:block; font-size:11px; color:var(--slate); margin-bottom:5px; font-weight:600;">STYLE</label>
            <select onchange="builder.updateButtonBlock('${block.id}', 'styleVariant', this.value)" style="width:100%; background:var(--dark-navy); border:1px solid var(--border-color); color:var(--white); border-radius:4px; padding:6px 8px; font-size:12px; cursor:pointer;">
              <option value="outline" ${styleVariant === 'outline' ? 'selected' : ''}>Outline (Default)</option>
              <option value="filled" ${styleVariant === 'filled' ? 'selected' : ''}>Filled / Solid</option>
            </select>
          </div>

          <!-- Color -->
          <div>
            <label style="display:block; font-size:11px; color:var(--slate); margin-bottom:5px; font-weight:600;">COLOR</label>
            <div style="display:flex; align-items:center; gap:6px;">
              <input type="color" value="${color}" onchange="builder.updateButtonBlock('${block.id}', 'color', this.value)" style="width:32px; height:28px; padding:0; border:none; background:transparent; cursor:pointer; border-radius:4px;">
              <div style="display:flex; gap:3px;">
                ${presetColors.map(c => `
                  <span onclick="builder.updateButtonBlock('${block.id}', 'color', '${c}')" style="display:inline-block; width:14px; height:14px; border-radius:50%; background:${c}; cursor:pointer; border:1px solid ${c === color ? 'var(--white)' : 'transparent'}; box-sizing:border-box;" title="${c}"></span>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Font Size -->
          <div>
            <label style="display:block; font-size:11px; color:var(--slate); margin-bottom:5px; font-weight:600;">FONT SIZE</label>
            <select onchange="builder.updateButtonBlock('${block.id}', 'fontSize', this.value)" style="width:100%; background:var(--dark-navy); border:1px solid var(--border-color); color:var(--white); border-radius:4px; padding:6px 8px; font-size:12px; cursor:pointer;">
              <option value="12px" ${fontSize === '12px' ? 'selected' : ''}>12px (Small)</option>
              <option value="13px" ${fontSize === '13px' ? 'selected' : ''}>13px</option>
              <option value="14px" ${fontSize === '14px' ? 'selected' : ''}>14px (Default)</option>
              <option value="16px" ${fontSize === '16px' ? 'selected' : ''}>16px (Medium)</option>
              <option value="18px" ${fontSize === '18px' ? 'selected' : ''}>18px (Large)</option>
              <option value="20px" ${fontSize === '20px' ? 'selected' : ''}>20px</option>
            </select>
          </div>

          <!-- Border Radius -->
          <div>
            <label style="display:block; font-size:11px; color:var(--slate); margin-bottom:5px; font-weight:600;">BORDER RADIUS</label>
            <select onchange="builder.updateButtonBlock('${block.id}', 'borderRadius', this.value)" style="width:100%; background:var(--dark-navy); border:1px solid var(--border-color); color:var(--white); border-radius:4px; padding:6px 8px; font-size:12px; cursor:pointer;">
              <option value="0px" ${borderRadius === '0px' ? 'selected' : ''}>0px (Square)</option>
              <option value="4px" ${borderRadius === '4px' ? 'selected' : ''}>4px (Default)</option>
              <option value="8px" ${borderRadius === '8px' ? 'selected' : ''}>8px (Rounded)</option>
              <option value="12px" ${borderRadius === '12px' ? 'selected' : ''}>12px (Smooth)</option>
              <option value="24px" ${borderRadius === '24px' ? 'selected' : ''}>24px (Soft Pill)</option>
              <option value="99px" ${borderRadius === '99px' ? 'selected' : ''}>99px (Full Pill)</option>
            </select>
          </div>

          <!-- Border Style -->
          <div>
            <label style="display:block; font-size:11px; color:var(--slate); margin-bottom:5px; font-weight:600;">BORDER STYLE</label>
            <select onchange="builder.updateButtonBlock('${block.id}', 'borderStyle', this.value)" style="width:100%; background:var(--dark-navy); border:1px solid var(--border-color); color:var(--white); border-radius:4px; padding:6px 8px; font-size:12px; cursor:pointer;">
              <option value="solid" ${borderStyle === 'solid' ? 'selected' : ''}>Solid (Default)</option>
              <option value="dashed" ${borderStyle === 'dashed' ? 'selected' : ''}>Dashed</option>
              <option value="dotted" ${borderStyle === 'dotted' ? 'selected' : ''}>Dotted</option>
              <option value="none" ${borderStyle === 'none' ? 'selected' : ''}>None</option>
            </select>
          </div>

          <!-- Alignment -->
          <div>
            <label style="display:block; font-size:11px; color:var(--slate); margin-bottom:5px; font-weight:600;">ALIGNMENT</label>
            <div style="display:flex; gap:4px;">
              <button type="button" class="ctrl-btn ${align === 'left' ? 'active' : ''}" onclick="builder.updateButtonBlock('${block.id}', 'align', 'left')" title="Left" style="flex:1; height:30px; ${align === 'left' ? 'color:var(--green); border-color:var(--green); background:var(--lightest-navy);' : ''}">Left</button>
              <button type="button" class="ctrl-btn ${align === 'center' ? 'active' : ''}" onclick="builder.updateButtonBlock('${block.id}', 'align', 'center')" title="Center" style="flex:1; height:30px; ${align === 'center' ? 'color:var(--green); border-color:var(--green); background:var(--lightest-navy);' : ''}">Center</button>
              <button type="button" class="ctrl-btn ${align === 'right' ? 'active' : ''}" onclick="builder.updateButtonBlock('${block.id}', 'align', 'right')" title="Right" style="flex:1; height:30px; ${align === 'right' ? 'color:var(--green); border-color:var(--green); background:var(--lightest-navy);' : ''}">Right</button>
            </div>
          </div>
        </div>

        <!-- Live Preview Area -->
        <div>
          <label style="display:flex; justify-content:space-between; align-items:center; font-size:11px; color:var(--slate); margin-bottom:8px; font-family:var(--font-mono);">
            <span>LIVE BUTTON PREVIEW</span>
            <span style="color:var(--light-slate); font-size:10px;">(Click to test link)</span>
          </label>
          <div style="background:var(--dark-navy); border:1px dashed var(--border-color); border-radius:8px; padding:28px 20px; text-align:${align};">
            <a href="${url || 'javascript:void(0)'}" ${newTab ? 'target="_blank" rel="noopener noreferrer"' : ''} style="display:inline-flex; align-items:center; justify-content:center; gap:8px; padding:1.15rem 2.2rem; font-family:var(--font-mono, monospace); font-size:${fontSize}; font-weight:500; line-height:1; text-decoration:none; color:${textProp}; background-color:${bgProp}; border:${borderProp}; border-radius:${borderRadius}; cursor:pointer; transition:all 0.2s ease; box-shadow:0 4px 15px rgba(0,0,0,0.2); white-space:nowrap; max-width:100%; box-sizing:border-box;">
              <span style="white-space:nowrap; display:inline-block; line-height:1;">${safeEsc(text)}</span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:15px; height:15px; min-width:15px; max-width:15px; flex-shrink:0; vertical-align:middle; display:inline-block;">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    `;
  }

  updateButtonBlock(id, field, value) {
    const block = this.blocks.find(b => b.id === id);
    if (!block) return;
    block[field] = value;
    this.render();
  }

  resetButtonDefaults(id) {
    const block = this.blocks.find(b => b.id === id);
    if (!block) return;
    block.styleVariant = 'outline';
    block.color = '#64ffda';
    block.fontSize = '14px';
    block.borderRadius = '4px';
    block.borderWidth = '1px';
    block.borderStyle = 'solid';
    block.align = 'center';
    block.newTab = true;
    this.render();
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
    const editor = document.querySelector(`.rte-editor[data-id="${id}"]`);
    if (!editor) return;

    editor.addEventListener('paste', (e) => {
      e.preventDefault();
      
      let html = (e.originalEvent || e).clipboardData.getData('text/html');
      let text = (e.originalEvent || e).clipboardData.getData('text/plain');

      if (html) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        
        const cleanElements = (el) => {
          if (el.nodeType === 1) { // Element node
            el.removeAttribute('style');
            el.removeAttribute('class');
            el.removeAttribute('id');
            el.removeAttribute('dir');
            el.removeAttribute('data-id');
          }
          Array.from(el.childNodes).forEach(child => cleanElements(child));
        };
        cleanElements(tempDiv);
        
        document.execCommand('insertHTML', false, tempDiv.innerHTML);
      } else {
        document.execCommand('insertText', false, text);
      }
      this.updateTextBlock(id, editor.innerHTML);
    });
  }

  exec(command, id, value = null) {
    const editor = document.querySelector(`.rte-editor[data-id="${id}"]`);
    editor.focus();
    document.execCommand(command, false, value);
  }

  applyCustomStyle(id, styleName, value) {
    if (!value) return;
    const editor = document.querySelector(`.rte-editor[data-id="${id}"]`);
    editor.focus();
    
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    const range = selection.getRangeAt(0);
    
    if (range.collapsed) return; 
    
    const fragment = range.extractContents();
    const span = document.createElement('span');
    span.style[styleName] = value;
    span.appendChild(fragment);
    range.insertNode(span);
    
    this.updateTextBlock(id, editor.innerHTML);
    
    selection.removeAllRanges();
    const newRange = document.createRange();
    newRange.selectNodeContents(span);
    selection.addRange(newRange);
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
      const isAILab = this.projectType === 'ai-lab';
      if (isAILab) {
        const aiTitle = document.getElementById('builder-ai-title')?.value.trim();
        if (aiTitle) this.title = aiTitle;
        else this.title = document.getElementById('builder-case-study-title')?.value.trim() || 'Untitled';
      } else {
        this.title = document.getElementById('builder-case-study-title').value.trim() || 'Untitled';
      }
      
      const slugInput = isAILab ? (document.getElementById('builder-ai-slug') || document.getElementById('builder-meta-slug')) : document.getElementById('builder-meta-slug');
      const newSlug = slugInput ? slugInput.value.trim().toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '') : '';

      if (!this.slug) {
        this.slug = newSlug || this.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '');
      }

      let summary = '';
      let details = [];
      let aiLabel = 'AI LAB';
      let labels = [];
      let ctaButton = null;

      if (isAILab) {
        summary = document.getElementById('builder-ai-subtext')?.value.trim() || '';
        aiLabel = document.getElementById('builder-ai-label')?.value.trim() || 'AI LAB';
        labels = this.aiLabels || [];

        const ctaEnabled = !!document.getElementById('ai-builder-cta-enable')?.checked;
        if (ctaEnabled) {
          ctaButton = {
            enabled: true,
            text: document.getElementById('ai-cta-text')?.value.trim() || 'View Project',
            url: document.getElementById('ai-cta-url')?.value.trim() || '',
            styleVariant: document.getElementById('ai-cta-style')?.value || 'outline',
            color: document.getElementById('ai-cta-color')?.value || '#64ffda',
          };
          // If first block in blocks was a button block that duplicates this, remove it
          if (this.blocks.length > 0 && this.blocks[0].type === 'button') {
            this.blocks.shift();
          }
        }
      } else {
        const tagline = document.getElementById('builder-meta-tagline').value;
        const subtagline = document.getElementById('builder-meta-subtagline').value;
        summary = `${tagline} || ${subtagline}`;

        const detailRows = document.querySelectorAll('#builder-meta-details-list .detail-row');
        details = Array.from(detailRows).map(row => ({
          label: row.querySelector('.detail-label').value.trim(),
          value: row.querySelector('.detail-value').value.trim()
        })).filter(d => d.label || d.value);
      }

      const body = {
        title: this.title,
        blocks: this.blocks,
        published: document.getElementById('builder-publish-toggle').checked,
        project_type: this.projectType || 'case-study',
        summary: summary,
        details: details,
        banner: this.banner,
        newSlug: newSlug,
        ai_label: aiLabel,
        labels: labels,
        cta_button: ctaButton,
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
      
      if (newSlug) {
        this.slug = newSlug;
        const slugHeader = document.getElementById('builder-case-study-slug-header');
        if (slugHeader) slugHeader.value = this.slug;
      }

      // Update preview button
      const previewBtn = document.getElementById('builder-btn-preview') || document.getElementById('btn-builder-preview');
      if (previewBtn) {
        previewBtn.style.display = 'inline-flex';
        const prefix = (this.projectType === 'ai-lab') ? 'ai-lab' : 'case-study';
        previewBtn.href = `${window.location.origin}/${prefix}/${this.slug}/`;
      }

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

  renderAILabels() {
    const container = document.getElementById('ai-builder-labels-list');
    if (!container) return;
    if (!this.aiLabels) this.aiLabels = [];
    container.innerHTML = this.aiLabels.map((lbl, idx) => `
      <span style="display:inline-flex; align-items:center; gap:6px; font-family:var(--font-mono, monospace); font-size:12px; color:var(--green); background:rgba(100,255,218,0.08); border:1px solid rgba(100,255,218,0.25); border-radius:99px; padding:3px 10px; line-height:1; user-select:none;">
        ${window.esc ? window.esc(lbl) : lbl}
        <button type="button" onclick="builder.removeAILabel(${idx})" style="background:transparent; border:none; color:var(--slate); cursor:pointer; font-size:13px; line-height:1; padding:0; display:inline-flex; align-items:center;" title="Remove label" onmouseover="this.style.color='var(--red)'" onmouseout="this.style.color='var(--slate)'">✕</button>
      </span>
    `).join('');
  }

  addAILabel() {
    const input = document.getElementById('ai-builder-new-label-input');
    if (!input) return;
    const val = input.value.trim();
    if (!val) return;
    if (!this.aiLabels) this.aiLabels = [];
    if (!this.aiLabels.includes(val)) {
      this.aiLabels.push(val);
      this.renderAILabels();
    }
    input.value = '';
    input.focus();
  }

  removeAILabel(idx) {
    if (!this.aiLabels) return;
    this.aiLabels.splice(idx, 1);
    this.renderAILabels();
  }

  toggleAICTA(checked) {
    const fields = document.getElementById('ai-builder-cta-fields');
    if (fields) fields.style.display = checked ? 'flex' : 'none';
    this.renderAICTAPreview();
  }

  setAICTAColor(color) {
    const colorInput = document.getElementById('ai-cta-color');
    if (colorInput) colorInput.value = color;
    this.renderAICTAPreview();
  }

  resetAICTADefaults() {
    const textInput = document.getElementById('ai-cta-text');
    const styleSelect = document.getElementById('ai-cta-style');
    const colorInput = document.getElementById('ai-cta-color');
    if (textInput) textInput.value = 'Chrome Store';
    if (styleSelect) styleSelect.value = 'outline';
    if (colorInput) colorInput.value = '#64ffda';
    this.renderAICTAPreview();
  }

  renderAICTAPreview() {
    const wrap = document.getElementById('ai-builder-cta-preview-wrap');
    if (!wrap) return;
    const enabled = document.getElementById('ai-builder-cta-enable')?.checked;
    if (!enabled) {
      wrap.innerHTML = `<span style="color:var(--slate); font-size:11px; font-style:italic;">CTA Button is currently disabled</span>`;
      return;
    }
    const text = document.getElementById('ai-cta-text')?.value.trim() || 'Chrome Store';
    const url = document.getElementById('ai-cta-url')?.value.trim() || '#';
    const styleVariant = document.getElementById('ai-cta-style')?.value || 'outline';
    const color = document.getElementById('ai-cta-color')?.value || '#64ffda';
    const isFilled = styleVariant === 'filled';
    const borderProp = `1px solid ${color}`;
    const bgProp = isFilled ? color : 'transparent';
    const textProp = isFilled ? '#0a192f' : color;
    const safeEsc = (s) => (window.esc ? window.esc(s) : String(s || '').replace(/"/g, '&quot;'));

    wrap.innerHTML = `
      <a href="${url || 'javascript:void(0)'}" target="_blank" rel="noopener noreferrer" style="display:inline-flex; align-items:center; justify-content:center; gap:8px; padding:1.15rem 2.2rem; font-family:var(--font-mono, monospace); font-size:14px; font-weight:500; line-height:1; text-decoration:none; color:${textProp}; background-color:${bgProp}; border:${borderProp}; border-radius:4px; cursor:pointer; transition:all 0.2s ease; box-shadow:0 4px 15px rgba(0,0,0,0.2); white-space:nowrap; max-width:100%; box-sizing:border-box;">
        <span style="white-space:nowrap; display:inline-block; line-height:1;">${safeEsc(text)}</span>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:15px; height:15px; min-width:15px; max-width:15px; flex-shrink:0; vertical-align:middle; display:inline-block;">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
          <polyline points="15 3 21 3 21 9"/>
          <line x1="10" y1="14" x2="21" y2="3"/>
        </svg>
      </a>
    `;
  }

  updateBannerDisplay(url) {
    const isVideo = (u) => {
      if (!u) return false;
      if (u.startsWith('data:video/')) return true;
      const videoExtensions = /\.(mp4|webm|ogg|mov|m4v|ogv)($|\?)/i;
      return videoExtensions.test(u) || u.includes('/video/upload/');
    };

    const bp = document.getElementById('banner-preview');
    const bvp = document.getElementById('banner-video-preview');
    const bph = document.getElementById('banner-placeholder');

    const abp = document.getElementById('ai-banner-preview');
    const abvp = document.getElementById('ai-banner-video-preview');
    const abph = document.getElementById('ai-banner-placeholder');

    if (bp) bp.style.display = 'none';
    if (bvp) bvp.style.display = 'none';
    if (bph) bph.style.display = url ? 'none' : 'flex';

    if (abp) abp.style.display = 'none';
    if (abvp) abvp.style.display = 'none';
    if (abph) abph.style.display = url ? 'none' : 'flex';

    if (!url) return;

    const fullUrl = url.startsWith('/uploads') ? `${API}${url}` : url;
    if (isVideo(fullUrl)) {
      if (bvp) { bvp.src = fullUrl; bvp.style.display = 'block'; }
      if (abvp) { abvp.src = fullUrl; abvp.style.display = 'block'; }
    } else {
      if (bp) { bp.src = fullUrl; bp.style.display = 'block'; }
      if (abp) { abp.src = fullUrl; abp.style.display = 'block'; }
    }
  }

  handleAIBannerUpload(files) {
    if (files && files[0]) {
      this.handleBannerUpload(files);
    }
  }

  handleBannerUpload(files) {
    if (files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.banner = e.target.result;
        this.updateBannerDisplay(this.banner);
      };
      reader.readAsDataURL(file);
    }
  }
}

const builder = new CaseStudyBuilder();

// Link app.js openBuilder to this instance
window.openBuilder = (slug) => builder.open(slug);
