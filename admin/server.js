require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const matter = require('gray-matter');
const cookieParser = require('cookie-parser');
const supabase = require('./supabase');
const bcrypt = require('bcryptjs');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const app = express();
const PORT = process.env.PORT || 3001;

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


// Paths
const PORTFOLIO_ROOT = path.resolve(__dirname, '..');
const FEATURED_DIR = path.join(PORTFOLIO_ROOT, 'content', 'featured');
const CASE_STUDIES_DIR = path.join(PORTFOLIO_ROOT, 'content', 'case-studies');
const JOBS_DIR = path.join(PORTFOLIO_ROOT, 'content', 'jobs');
const RESUME_DIR = path.join(PORTFOLIO_ROOT, 'content', 'resume');
const HERO_DIR = path.join(PORTFOLIO_ROOT, 'content', 'hero');
const ABOUT_DIR = path.join(PORTFOLIO_ROOT, 'content', 'about');
const STATIC_DIR = path.join(PORTFOLIO_ROOT, 'static');
const UPLOADS_DIR = path.join(STATIC_DIR, 'uploads', 'case-studies');

if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// Middleware
app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(STATIC_DIR, 'uploads')));

// Serve login page
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

// Login endpoint sets cookie
app.post('/api/login', async (req, res) => {
  const { password } = req.body;
  try {
    const { data: admin } = await supabase.from('admin').select('*').eq('username', 'admin').single();
    if (!admin) return res.status(401).json({ error: 'Admin not initialized' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (isMatch) {
      res.cookie('admin_auth', 'valid', { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }); // 1 day
      res.json({ success: true });
    } else {
      res.status(401).json({ error: 'Incorrect password' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Auth Middleware for everything else
app.use((req, res, next) => {
  if (req.cookies && req.cookies.admin_auth === 'valid') {
    return next();
  }
  if (req.path.startsWith('/api/')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  res.redirect('/login');
});

// Serve case study content statically
app.use('/api/content/case-studies', express.static(CASE_STUDIES_DIR));

// Serve static on /admin (now protected by middleware)
app.use('/admin', express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => res.redirect('/admin'));

// Multer config for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'portfolio/featured',
    allowed_formats: ['jpg', 'png', 'webp', 'jpeg', 'gif', 'svg'],
  },
});
const upload = multer({ storage });

const resumeStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'portfolio/resumes',
    allowed_formats: ['pdf'],
    resource_type: 'raw',
  },
});
const uploadResume = multer({ storage: resumeStorage });

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

function findMarkdownFile(dir) {
  const files = fs.readdirSync(dir);
  const md = files.find(f => f === 'index.md');
  const xxmd = files.find(f => f === 'index.xxmd');
  if (md) return { path: path.join(dir, md), published: true };
  if (xxmd) return { path: path.join(dir, xxmd), published: false };
  return null;
}

function findCoverImage(dir) {
  const files = fs.readdirSync(dir);
  const imageExts = ['.webp', '.png', '.jpg', '.jpeg', '.gif', '.svg'];
  const cover = files.find(f => {
    const ext = path.extname(f).toLowerCase();
    const name = path.basename(f, ext).toLowerCase();
    return imageExts.includes(ext) && (name === 'cover' || name.includes('cover') || name.includes('front'));
  });
  // If no cover-named file, find the first image that's referenced in frontmatter
  return cover || files.find(f => imageExts.includes(path.extname(f).toLowerCase()));
}

function parseFeaturedProject(slug) {
  const dir = path.join(FEATURED_DIR, slug);
  if (!fs.statSync(dir).isDirectory()) return null;

  const mdFile = findMarkdownFile(dir);
  if (!mdFile) return null;

  const raw = fs.readFileSync(mdFile.path, 'utf-8');
  const { data: frontmatter, content } = matter(raw);
  const coverImage = findCoverImage(dir);

  return {
    slug,
    title: frontmatter.title || slug,
    date: frontmatter.date || '0',
    cover: frontmatter.cover || '',
    coverImage: coverImage || null,
    cta: frontmatter.cta || '',
    external: frontmatter.external || '',
    button: frontmatter.button || 'Read More',
    role: frontmatter.role || '',
    tech: frontmatter.tech || [],
    description: content.trim(),
    published: mdFile.published,
  };
}

function parseJob(slug) {
  const dir = path.join(JOBS_DIR, slug);
  if (!fs.statSync(dir).isDirectory()) return null;

  const mdFile = findMarkdownFile(dir);
  if (!mdFile) return null;

  const raw = fs.readFileSync(mdFile.path, 'utf-8');
  const { data: frontmatter, content } = matter(raw);

  return {
    slug,
    title: frontmatter.title || '',
    company: frontmatter.company || slug,
    location: frontmatter.location || '',
    range: frontmatter.range || '',
    date: frontmatter.date || '',
    url: frontmatter.url || '',
    description: content.trim(),
    published: mdFile.published,
  };
}

// Helper: escape a value for YAML single-quoting
function yq(val) {
  if (val === undefined || val === null) return "''";
  const s = String(val);
  // Single-quote and escape internal single quotes by doubling them
  return "'" + s.replace(/'/g, "''") + "'";
}

// Helper: build YAML tech list
function yamlTechList(tech) {
  if (!tech || !tech.length) return 'tech:\n  - User Experience';
  return 'tech:\n' + tech.map(t => `  - ${t}`).join('\n');
}

function writeFeaturedMarkdown(dir, data) {
  const ext = data.published !== false ? '.md' : '.xxmd';
  const filePath = path.join(dir, `index${ext}`);

  // Remove old index files
  ['index.md', 'index.xxmd'].forEach(f => {
    const p = path.join(dir, f);
    if (fs.existsSync(p)) fs.unlinkSync(p);
  });

  // Build frontmatter manually to preserve URL quoting
  const lines = [
    '---',
    `date: ${yq(data.date || '1')}`,
    `title: ${yq(data.title)}`,
    `cover: ${yq(data.cover || './cover.webp')}`,
    `cta: ${yq(data.cta || '')}`,
    `external: ${yq(data.external || '')}`,
    `button: ${yq(data.button || 'Read More')}`,
    `role: ${yq(data.role || '')}`,
    yamlTechList(data.tech),
    '---',
    '',
    (data.description || '').trim(),
    '',
  ];

  fs.writeFileSync(filePath, lines.join('\n'));
}

function writeJobMarkdown(dir, data) {
  const ext = data.published !== false ? '.md' : '.xxmd';
  const filePath = path.join(dir, `index${ext}`);

  // Remove old index files
  ['index.md', 'index.xxmd'].forEach(f => {
    const p = path.join(dir, f);
    if (fs.existsSync(p)) fs.unlinkSync(p);
  });

  // Build frontmatter manually to preserve quoting
  const lines = [
    '---',
    `date: ${yq(data.date || new Date().toISOString().split('T')[0])}`,
    `title: ${yq(data.title)}`,
    `company: ${yq(data.company)}`,
    `location: ${yq(data.location || '')}`,
    `range: ${yq(data.range || '')}`,
    `url: ${yq(data.url || '#')}`,
    '---',
    '',
    (data.description || '').trim(),
    '',
  ];

  fs.writeFileSync(filePath, lines.join('\n'));
}

const { exec } = require('child_process');

// ─────────────────────────────────────────────
// DEPLOY API
// ─────────────────────────────────────────────

app.post('/api/deploy', async (req, res) => {
  try {
    const webhookUrl = process.env.DEPLOY_WEBHOOK_URL;
    
    if (!webhookUrl) {
      return res.json({ 
        success: false, 
        message: 'Deployment webhook URL is not configured. Please add DEPLOY_WEBHOOK_URL to your admin/.env file.' 
      });
    }

    console.log(`Triggering deploy webhook: ${webhookUrl}`);
    const response = await fetch(webhookUrl, { method: 'POST' });
    
    if (response.ok) {
      res.json({ success: true, message: 'Deployment triggered successfully! Your live site will update shortly.' });
    } else {
      res.status(500).json({ error: `Webhook failed with status: ${response.status}` });
    }
  } catch (err) {
    console.error(`Deploy error: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────
// FEATURED PROJECTS API
// ─────────────────────────────────────────────

// GET all featured projects
app.get('/api/featured', async (req, res) => {
  try {
    const { data: projects, error } = await supabase.from('projects').select('*').order('date', { ascending: true }); if(error) throw error;
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT reorder featured projects — MUST be before /:slug routes
app.put('/api/featured/reorder', async (req, res) => {
  try {
    const { order } = req.body;
    if (!order || !Array.isArray(order)) {
      return res.status(400).json({ error: 'order array required' });
    }

    for (let i = 0; i < order.length; i++) {
      await supabase.from('projects').update({ date: String(i + 1) }).eq('slug', order[i]);
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single project cover image
app.get('/api/featured/:slug/cover', (req, res) => {
  try {
    const dir = path.join(FEATURED_DIR, req.params.slug);
    if (!fs.existsSync(dir)) return res.status(404).json({ error: 'Not found' });

    const coverImage = findCoverImage(dir);
    if (!coverImage) return res.status(404).json({ error: 'No cover image' });

    res.sendFile(path.join(dir, coverImage));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create a new featured project
app.post('/api/featured', upload.single('cover'), async (req, res) => {
  try {
    const { title, role, description, tech, cta, external, button } = req.body;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    // Determine cover path
    let coverPath = './cover.webp';
    if (req.file) {
      coverPath = req.file.path || req.file.secure_url;
    }

    // Calculate next order number
    const { count } = await supabase.from('projects').select('*', { count: 'exact', head: true });

    const { data: project, error } = await supabase.from('projects').insert([{
      date: String(count + 1),
      title,
      slug,
      cover: coverPath,
      cta: cta || '',
      external: external || '',
      button: button || 'Read More',
      role: role || '',
      tech: tech ? (typeof tech === 'string' ? JSON.parse(tech) : tech) : [],
      description: description || '',
      published: true,
    }]).select().single(); if(error) throw error;
    res.json({ success: true, project });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update a featured project
app.put('/api/featured/:slug', upload.single('cover'), async (req, res) => {
  try {
    const { slug } = req.params;
    const { data: project } = await supabase.from('projects').select('*').eq('slug', slug).single();
    if (!project) return res.status(404).json({ error: 'Not found' });

    let coverPath = project.cover;
    if (req.file) {
      coverPath = req.file.path || req.file.secure_url;
    }

    const { title, role, description, tech, cta, external, button } = req.body;
    console.log('Updating project:', slug, { title, role, description, tech, cta, external, button });

    const update = {
      title: title || project.title,
      cover: coverPath,
      cta: cta !== undefined ? cta : project.cta,
      external: external !== undefined ? external : project.external,
      button: button || project.button,
      role: role !== undefined ? role : project.role,
      tech: tech ? (typeof tech === 'string' ? JSON.parse(tech) : tech) : project.tech,
      description: description !== undefined ? description : project.description,
    };

    if (title && title !== project.title) {
      update.slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }

    const { data: updatedProject, error } = await supabase.from('projects').update(update).eq('slug', slug).select().single(); if(error) throw error;
    console.log('Project updated in MongoDB:', updatedProject.slug);
    res.json({ success: true, project: updatedProject });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE a featured project
app.delete('/api/featured/:slug', async (req, res) => {
  try {
    const { data: result, error } = await supabase.from('projects').delete().eq('slug', req.params.slug).select().single(); if(error) throw error;
    if (!result) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST toggle publish/unpublish
app.post('/api/featured/:slug/toggle-publish', async (req, res) => {
  try {
    const { slug } = req.params;
    const { data: project } = await supabase.from('projects').select('*').eq('slug', slug).single();
    if (!project) return res.status(404).json({ error: 'Not found' });

    const { data: p2, error } = await supabase.from('projects').update({ published: !project.published }).eq('slug', slug).select().single(); if(error) throw error; Object.assign(project, p2);

    res.json({ success: true, project });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// (reorder route moved above /:slug routes)

// ─────────────────────────────────────────────
// JOBS API
// ─────────────────────────────────────────────

// GET all jobs
app.get('/api/jobs', async (req, res) => {
  try {
    const { data: jobs, error } = await supabase.from('jobs').select('*').order('date', { ascending: false }); if(error) throw error;
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT reorder jobs — MUST be before /:slug routes
app.put('/api/jobs/reorder', async (req, res) => {
  try {
    const { order } = req.body;
    if (!order || !Array.isArray(order)) {
      return res.status(400).json({ error: 'order array required' });
    }

    const baseDate = new Date('2025-01-01');
    for (let i = 0; i < order.length; i++) {
      const d = new Date(baseDate);
      d.setDate(d.getDate() - i);
      await supabase.from('jobs').update({ date: d.toISOString().split('T')[0] }).eq('slug', order[i]);
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create a new job
app.post('/api/jobs', async (req, res) => {
  try {
    const { title, company, location, range, url, description, date } = req.body;
    const slug = (company || title).toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const { data: job, error } = await supabase.from('jobs').insert([{
      date: date || new Date().toISOString().split('T')[0],
      title,
      company: company || slug,
      slug,
      location: location || '',
      range: range || '',
      url: url || '#',
      description: description || '',
      published: true,
    }]).select().single(); if(error) throw error;
    res.json({ success: true, job });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update a job
app.put('/api/jobs/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const { data: job } = await supabase.from('jobs').select('*').eq('slug', slug).single();
    if (!job) return res.status(404).json({ error: 'Not found' });

    const { title, company, location, range, url, description, date } = req.body;
    console.log('Updating job:', slug, { title, company, location, range, url, description, date });

    const update = {
      date: date || job.date,
      title: title !== undefined ? title : job.title,
      company: company !== undefined ? company : job.company,
      location: location !== undefined ? location : job.location,
      range: range !== undefined ? range : job.range,
      url: url !== undefined ? url : job.url,
      description: description !== undefined ? description : job.description,
    };

    if (company && company !== job.company) {
      update.slug = company.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }

    const { data: updatedJob, error } = await supabase.from('jobs').update(update).eq('slug', slug).select().single(); if(error) throw error;
    console.log('Job updated in MongoDB:', updatedJob.slug);
    res.json({ success: true, job: updatedJob });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE a job
app.delete('/api/jobs/:slug', async (req, res) => {
  try {
    const { data: result, error } = await supabase.from('jobs').delete().eq('slug', req.params.slug).select().single(); if(error) throw error;
    if (!result) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST toggle publish/unpublish for jobs
app.post('/api/jobs/:slug/toggle-publish', async (req, res) => {
  try {
    const { slug } = req.params;
    const { data: job } = await supabase.from('jobs').select('*').eq('slug', slug).single();
    if (!job) return res.status(404).json({ error: 'Not found' });

    const { data: j2, error } = await supabase.from('jobs').update({ published: !job.published }).eq('slug', slug).select().single(); if(error) throw error; Object.assign(job, j2);

    res.json({ success: true, job });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// (reorder route moved above /:slug routes)

// ─────────────────────────────────────────────
// RESUME API
// ─────────────────────────────────────────────

app.get('/api/resume', (req, res) => {
  try {
    const filePath = path.join(RESUME_DIR, 'resume.json');
    if (!fs.existsSync(filePath)) {
      return res.json({ type: 'url', value: '' });
    }
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/resume', (req, res) => {
  try {
    const { type, value } = req.body;
    const filePath = path.join(RESUME_DIR, 'resume.json');
    fs.writeFileSync(filePath, JSON.stringify({ type, value }, null, 2));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/resume/upload', uploadResume.single('resume'), async (req, res) => {
  try {
    const resumeUrl = req.file.path || req.file.secure_url;
    // We can store this in a setting or update the Hero/About if needed
    // For now, let's just return it or save to a small collection if you want
    res.json({ success: true, url: resumeUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── HOMEPAGE API ───
app.get('/api/homepage/hero', async (req, res) => {
  try {
    const { data: hero } = await supabase.from('hero').select('*').limit(1).single();
    res.json(hero || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/homepage/hero', async (req, res) => {
  try {
    await supabase.from('hero').upsert({ id: '00000000-0000-0000-0000-000000000000', ...req.body });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/homepage/about', async (req, res) => {
  try {
    const { data: about } = await supabase.from('about').select('*').limit(1).single();
    res.json(about || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/homepage/about', async (req, res) => {
  try {
    await supabase.from('about').upsert({ id: '00000000-0000-0000-0000-000000000000', ...req.body });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────
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

    // Handle Banner Image via Cloudinary
    let bannerPath = banner || '';
    if (bannerPath.startsWith('data:')) {
      const uploadRes = await cloudinary.uploader.upload(bannerPath, { folder: `portfolio/case-studies/${slug}` });
      bannerPath = uploadRes.secure_url;
    }

    let markdown = ``;
    const savedBlocks = JSON.parse(JSON.stringify(blocks)); 

    const derivedTocItems = [];
    
    // Convert to for...of to allow async await for Cloudinary uploads
    for (let block of savedBlocks) {
      if (block.type === 'text') {
        let content = block.content;
        if (block.tocEntry) {
          const anchor = (block.tocName || 'section').toLowerCase().replace(/[^a-z0-9]+/g, '-');
          if (content.includes('<h2')) {
            content = content.replace(/<h2([^>]*)>/, `<h2 id="${anchor}"$1>`);
          }
          derivedTocItems.push({ text: block.tocName || 'Section', anchor: anchor });
        }
        markdown += `${content.trim()}\n\n`;
      } else if (block.type === 'image') {
        markdown += `\n<div class="grid grid-${block.grid}">\n\n`;
        
        for (let i = 0; i < block.images.length; i++) {
          let img = block.images[i];
          if (img.startsWith('data:')) {
            const uploadRes = await cloudinary.uploader.upload(img, { folder: `portfolio/case-studies/${slug}` });
            const publicPath = uploadRes.secure_url;
            markdown += `![Image](${publicPath})\n\n`;
            block.images[i] = publicPath;
          } else {
            markdown += `![Image](${img})\n\n`;
          }
        }
        markdown += `</div>\n\n`;
      }
    }

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
// START SERVER
// ─────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`\n  🚀 Portfolio Admin Panel`);
  console.log(`  ───────────────────────`);
  console.log(`  Local:   http://localhost:${PORT}`);
  console.log(`  Content: ${PORTFOLIO_ROOT}/content/\n`);
});
