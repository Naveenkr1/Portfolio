const fs = require('fs');

let code = fs.readFileSync('server.js', 'utf-8');

// 1. Imports
code = code.replace(/const mongoose = require\('mongoose'\);\n/, "const supabase = require('./supabase');\n");
code = code.replace(/const \{ Project, Job, Hero, About, Admin \} = require\('\.\/models'\);\n/, "");

// 2. DB Connection
code = code.replace(/\/\/ MongoDB Connection\n[\s\S]*?\.catch\(err => console\.error\('MongoDB connection error:', err\)\);\n/, "");

// 3. Login
code = code.replace(/const admin = await Admin\.findOne\(\{ username: 'admin' \}\);/g, "const { data: admin } = await supabase.from('admin').select('*').eq('username', 'admin').single();");

// 4. Featured Projects
code = code.replace(/const projects = await Project\.find\(\)\.sort\(\{ date: 1 \}\);/g, "const { data: projects, error } = await supabase.from('projects').select('*').order('date', { ascending: true }); if(error) throw error;");
code = code.replace(/await Project\.findOneAndUpdate\(\{ slug: order\[i\] \}, \{ date: String\(i \+ 1\) \}\);/g, "await supabase.from('projects').update({ date: String(i + 1) }).eq('slug', order[i]);");
code = code.replace(/const count = await Project\.countDocuments\(\);/g, "const { count } = await supabase.from('projects').select('*', { count: 'exact', head: true });");
code = code.replace(/const project = new Project\(\{([\s\S]*?)\}\);\n\n    await project\.save\(\);/g, "const { data: project, error } = await supabase.from('projects').insert([{$1}]).select().single(); if(error) throw error;");
code = code.replace(/const project = await Project\.findOne\(\{ slug \}\);/g, "const { data: project } = await supabase.from('projects').select('*').eq('slug', slug).single();");
code = code.replace(/const updatedProject = await Project\.findOneAndUpdate\(\{ slug \}, update, \{ new: true \}\);/g, "const { data: updatedProject, error } = await supabase.from('projects').update(update).eq('slug', slug).select().single(); if(error) throw error;");
code = code.replace(/const result = await Project\.findOneAndDelete\(\{ slug: req\.params\.slug \}\);/g, "const { data: result, error } = await supabase.from('projects').delete().eq('slug', req.params.slug).select().single(); if(error) throw error;");
code = code.replace(/project\.published = !project\.published;\n    await project\.save\(\);/g, "const { data: p2, error } = await supabase.from('projects').update({ published: !project.published }).eq('slug', slug).select().single(); if(error) throw error; Object.assign(project, p2);");

// 5. Jobs
code = code.replace(/const jobs = await Job\.find\(\)\.sort\(\{ date: -1 \}\);/g, "const { data: jobs, error } = await supabase.from('jobs').select('*').order('date', { ascending: false }); if(error) throw error;");
code = code.replace(/await Job\.findOneAndUpdate\(\{ slug: order\[i\] \}, \{ date: d\.toISOString\(\)\.split\('T'\)\[0\] \}\);/g, "await supabase.from('jobs').update({ date: d.toISOString().split('T')[0] }).eq('slug', order[i]);");
code = code.replace(/const job = new Job\(\{([\s\S]*?)\}\);\n\n    await job\.save\(\);/g, "const { data: job, error } = await supabase.from('jobs').insert([{$1}]).select().single(); if(error) throw error;");
code = code.replace(/const job = await Job\.findOne\(\{ slug \}\);/g, "const { data: job } = await supabase.from('jobs').select('*').eq('slug', slug).single();");
code = code.replace(/const updatedJob = await Job\.findOneAndUpdate\(\{ slug \}, update, \{ new: true \}\);/g, "const { data: updatedJob, error } = await supabase.from('jobs').update(update).eq('slug', slug).select().single(); if(error) throw error;");
code = code.replace(/const result = await Job\.findOneAndDelete\(\{ slug: req\.params\.slug \}\);/g, "const { data: result, error } = await supabase.from('jobs').delete().eq('slug', req.params.slug).select().single(); if(error) throw error;");
code = code.replace(/job\.published = !job\.published;\n    await job\.save\(\);/g, "const { data: j2, error } = await supabase.from('jobs').update({ published: !job.published }).eq('slug', slug).select().single(); if(error) throw error; Object.assign(job, j2);");

// 6. Homepage Hero & About
code = code.replace(/const hero = await Hero\.findOne\(\);/g, "const { data: hero } = await supabase.from('hero').select('*').limit(1).single();");
code = code.replace(/await Hero\.findOneAndUpdate\(\{.*\}, req\.body, \{ upsert: true \}\);/g, "await supabase.from('hero').upsert({ id: '00000000-0000-0000-0000-000000000000', ...req.body });");
code = code.replace(/const about = await About\.findOne\(\);/g, "const { data: about } = await supabase.from('about').select('*').limit(1).single();");
code = code.replace(/await About\.findOneAndUpdate\(\{.*\}, req\.body, \{ upsert: true \}\);/g, "await supabase.from('about').upsert({ id: '00000000-0000-0000-0000-000000000000', ...req.body });");

// 7. Case Studies
// This is more complex because it used file system. I will replace the entire blocks for case studies.
const caseStudiesRegex = /\/\/ ─────────────────────────────────────────────\n\/\/ CASE STUDIES API\n\/\/ ─────────────────────────────────────────────[\s\S]*?\/\/ ─────────────────────────────────────────────\n\/\/ START SERVER/;
const newCaseStudies = `// ─────────────────────────────────────────────
// CASE STUDIES API
// ─────────────────────────────────────────────

app.get('/api/case-studies', async (req, res) => {
  try {
    const { data: studies, error } = await supabase.from('case_studies').select('slug, title, date, published').order('date', { ascending: false });
    if (error) throw error;
    res.json(studies || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/case-studies', async (req, res) => {
  try {
    const { title, slug } = req.body;
    const { data: existing } = await supabase.from('case_studies').select('id').eq('slug', slug).single();
    if (existing) return res.status(400).json({ error: 'Slug already exists' });
    
    const { error } = await supabase.from('case_studies').insert([{
      title,
      slug,
      date: new Date().toISOString().split('T')[0],
      published: false
    }]);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/case-studies/:slug', async (req, res) => {
  try {
    const { error } = await supabase.from('case_studies').delete().eq('slug', req.params.slug);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/case-studies/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const { blocks, published, title, summary, role, results, methods, banner } = req.body;

    // Handle Banner Image
    let bannerPath = banner || '';
    if (bannerPath.startsWith('data:')) {
      const slugDir = path.join(UPLOADS_DIR, slug);
      if (!fs.existsSync(slugDir)) fs.mkdirSync(slugDir, { recursive: true });
      
      const mimeMatch = bannerPath.match(/^data:(image\\/\\w+);base64,/);
      const mimeType = mimeMatch ? mimeMatch[1] : 'image/png';
      let ext = 'png';
      if (mimeType.includes('gif')) ext = 'gif';
      else if (mimeType.includes('webp')) ext = 'webp';
      else if (mimeType.includes('jpeg') || mimeType.includes('jpg')) ext = 'jpg';
      else if (mimeType.includes('svg')) ext = 'svg';

      const fileName = \`banner.\${ext}\`;
      const base64Data = bannerPath.replace(/^data:image\\/\\w+;base64,/, "");
      fs.writeFileSync(path.join(slugDir, fileName), base64Data, 'base64');
      bannerPath = \`/uploads/case-studies/\${slug}/\${fileName}\`;
    }

    let markdown = \`\`;
    const savedBlocks = JSON.parse(JSON.stringify(blocks)); 

    const derivedTocItems = [];
    savedBlocks.forEach(block => {
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
        const slugDir = path.join(UPLOADS_DIR, slug);
        if (!fs.existsSync(slugDir)) fs.mkdirSync(slugDir, { recursive: true });
        
        markdown += \`\\n<div class="grid grid-\${block.grid}">\\n\\n\`;
        block.images.forEach((img, i) => {
          if (img.startsWith('data:')) {
            const mimeMatch = img.match(/^data:(image\\/\\w+);base64,/);
            const mimeType = mimeMatch ? mimeMatch[1] : 'image/png';
            let ext = 'png';
            if (mimeType.includes('gif')) ext = 'gif';
            else if (mimeType.includes('webp')) ext = 'webp';
            else if (mimeType.includes('jpeg') || mimeType.includes('jpg')) ext = 'jpg';
            else if (mimeType.includes('svg')) ext = 'svg';

            const fileName = \`img-\${block.id}-\${i}.\${ext}\`;
            const base64Data = img.replace(/^data:image\\/\\w+;base64,/, "");
            fs.writeFileSync(path.join(slugDir, fileName), base64Data, 'base64');
            
            const publicPath = \`/uploads/case-studies/\${slug}/\${fileName}\`;
            markdown += \`![Image](\${publicPath})\\n\\n\`;
            block.images[i] = publicPath;
          } else {
            markdown += \`![Image](\${img})\\n\\n\`;
          }
        });
        markdown += \`</div>\\n\\n\`;
      }
    });

    const updateData = {
      title,
      slug,
      date: new Date().toISOString().split('T')[0],
      published,
      summary: summary || '',
      role: role || '',
      results: results || '',
      methods: methods || '',
      banner: bannerPath,
      toc_enabled: derivedTocItems.length > 0,
      toc_items: derivedTocItems,
      blocks: savedBlocks,
      markdown: markdown
    };

    const { error } = await supabase.from('case_studies').update(updateData).eq('slug', slug);
    if (error) throw error;
    
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/case-studies/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const { data: study, error } = await supabase.from('case_studies').select('*').eq('slug', slug).single();
    if (error || !study) return res.status(404).json({ error: 'Not found' });
    
    const frontmatter = {
      title: study.title,
      slug: study.slug,
      date: study.date,
      published: study.published,
      summary: study.summary,
      role: study.role,
      results: study.results,
      methods: study.methods,
      banner: study.banner,
      tocEnabled: study.toc_enabled,
      tocItems: study.toc_items
    };

    res.json({ blocks: study.blocks || [], metadata: frontmatter, frontmatter });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────
// START SERVER`;

code = code.replace(caseStudiesRegex, newCaseStudies);

fs.writeFileSync('server.js', code);
console.log('Refactored server.js');
