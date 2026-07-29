const fs = require('fs');
const path = require('path');

const indexJsPath = path.join(__dirname, '../api/index.js');
let code = fs.readFileSync(indexJsPath, 'utf-8');

const regex = /app\.put\('\/api\/case-studies\/:slug', async \(req, res\) => \{[\s\S]*?\}\);\s*app\.delete\('\/api\/case-studies\/:slug'/m;

const replacement = `app.post('/api/case-studies/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const dir = path.join(CASE_STUDIES_DIR, slug);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    
    let study = parseCaseStudy(slug);
    if (!study) {
      study = { title: req.body.title || slug, slug, date: new Date().toISOString().split('T')[0] };
    }

    const { blocks, published, title, summary, role, results, methods, banner } = req.body;

    // Helper for base64
    const saveBase64Image = (dataUri) => {
      const match = dataUri.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (!match) return dataUri;
      let ext = 'png';
      if (match[1].includes('jpeg') || match[1].includes('jpg')) ext = 'jpg';
      else if (match[1].includes('gif')) ext = 'gif';
      else if (match[1].includes('webp')) ext = 'webp';
      else if (match[1].includes('mp4')) ext = 'mp4';
      
      const buffer = Buffer.from(match[2], 'base64');
      const filename = \`img-\${Date.now()}-\${Math.floor(Math.random()*1000)}.\${ext}\`;
      const fullPath = path.join(STATIC_DIR, 'uploads', 'case-studies', slug);
      if (!fs.existsSync(fullPath)) fs.mkdirSync(fullPath, { recursive: true });
      fs.writeFileSync(path.join(fullPath, filename), buffer);
      return \`/uploads/case-studies/\${slug}/\${filename}\`;
    };

    let bannerPath = banner || '';
    if (bannerPath.startsWith('data:')) {
      bannerPath = saveBase64Image(bannerPath);
    }

    let markdown = \`\`;
    const savedBlocks = JSON.parse(JSON.stringify(blocks || [])); 
    const derivedTocItems = [];
    
    for (let block of savedBlocks) {
      if (block.type === 'text') {
        let content = block.content;
        if (block.tocEntry) {
          const anchor = (block.tocName || 'section').toLowerCase().replace(/[^a-z0-9]+/g, '-');
          if (content.includes('<h2')) {
            content = content.replace(/<h2([^>]*)>/, \`<h2 id="\${anchor}"$1>\`);
          }
          derivedTocItems.push({ text: block.tocName || 'Section', anchor: anchor });
        }
        markdown += \`\${content.trim()}\\n\\n\`;
      } else if (block.type === 'image') {
        markdown += \`\\n<div class="grid grid-\${block.grid}">\\n\\n\`;
        for (let i = 0; i < block.images.length; i++) {
          let img = block.images[i];
          if (img.startsWith('data:')) {
            const publicPath = saveBase64Image(img);
            markdown += \`![Image](\${publicPath})\\n\\n\`;
            block.images[i] = publicPath;
          } else {
            markdown += \`![Image](\${img})\\n\\n\`;
          }
        }
        markdown += \`</div>\\n\\n\`;
      }
    }

    const update = {
      title: title || study.title,
      date: study.date,
      summary: summary || '',
      role: role || '',
      results: results || '',
      methods: methods || '',
      banner: bannerPath,
      toc_enabled: derivedTocItems.length > 0,
      toc_items: derivedTocItems,
      markdown: markdown,
      published: published !== undefined ? published : study.published,
    };
    
    let newSlug = slug;
    if (title && title !== study.title) newSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    if (newSlug !== slug) {
      const newDir = path.join(CASE_STUDIES_DIR, newSlug);
      writeCaseStudyMarkdown(dir, update);
      fs.renameSync(dir, newDir);
    } else {
      writeCaseStudyMarkdown(dir, update);
    }
    
    update.slug = newSlug;
    
    // Save blocks.json to the NEW dir
    const finalDir = path.join(CASE_STUDIES_DIR, newSlug);
    fs.writeFileSync(path.join(finalDir, 'blocks.json'), JSON.stringify(savedBlocks, null, 2));

    res.json({ success: true, caseStudy: update });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/case-studies/:slug', async (req, res) => {
  try {
    const study = parseCaseStudy(req.params.slug);
    if (!study) return res.status(404).json({ error: 'Not found' });
    
    const dir = path.join(CASE_STUDIES_DIR, req.params.slug);
    let blocks = [];
    const blocksFile = path.join(dir, 'blocks.json');
    if (fs.existsSync(blocksFile)) {
      blocks = JSON.parse(fs.readFileSync(blocksFile, 'utf-8'));
    } else if (study.markdown) {
      blocks = [{ id: Date.now().toString(), type: 'text', content: study.markdown }];
    }

    res.json({ blocks, metadata: study, frontmatter: study });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/case-studies/:slug'`;

code = code.replace(regex, replacement);

// Also remove `app.get('/api/case-studies/:slug/details', ...` to avoid conflict or just leave it
code = code.replace(/app\.get\('\/api\/case-studies\/:slug\/details', async \(req, res\) => \{[\s\S]*?\}\);\s*/, '');

fs.writeFileSync(indexJsPath, code);
console.log('Fixed API routes');
