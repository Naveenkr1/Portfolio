const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const matter = require('gray-matter');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = 3001;

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
app.post('/api/login', (req, res) => {
  const { password } = req.body;
  if (password === 'Sage6969@') {
    res.cookie('admin_auth', 'valid', { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }); // 1 day
    res.json({ success: true });
  } else {
    res.status(401).json({ error: 'Incorrect password' });
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

// Multer config for cover image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const slug = req.params.slug || req.body.slug;
    const dir = path.join(FEATURED_DIR, slug);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `cover${ext}`);
  },
});
const upload = multer({ storage });

// Multer config for PDF uploads
const resumeStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, STATIC_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, 'resume.pdf');
  },
});
const uploadResume = multer({
  storage: resumeStorage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Only PDFs are allowed'));
  },
});

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

app.post('/api/deploy', (req, res) => {
  try {
    // Run git add, commit, and push from the PORTFOLIO_ROOT
    const cmd = 'git add content/ && git commit -m "Content update via Admin Panel" && git push';
    exec(cmd, { cwd: PORTFOLIO_ROOT }, (error, stdout, stderr) => {
      if (error) {
        // If there's nothing to commit, git returns an error, which is fine to catch.
        if (stdout.includes('nothing to commit') || stderr.includes('nothing to commit')) {
          return res.json({ success: true, message: 'No changes to publish.' });
        }
        console.error(`Deploy error: ${error.message}`);
        return res.status(500).json({ error: error.message, stderr });
      }
      res.json({ success: true, message: 'Changes published to live portfolio successfully!', stdout });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────
// FEATURED PROJECTS API
// ─────────────────────────────────────────────

// GET all featured projects
app.get('/api/featured', (req, res) => {
  try {
    const dirs = fs.readdirSync(FEATURED_DIR).filter(d =>
      fs.statSync(path.join(FEATURED_DIR, d)).isDirectory(),
    );

    const projects = dirs
      .map(slug => parseFeaturedProject(slug))
      .filter(Boolean)
      .sort((a, b) => {
        const aNum = parseInt(a.date) || 0;
        const bNum = parseInt(b.date) || 0;
        return aNum - bNum;
      });

    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT reorder featured projects — MUST be before /:slug routes
app.put('/api/featured/reorder', (req, res) => {
  try {
    const { order } = req.body;
    if (!order || !Array.isArray(order)) {
      return res.status(400).json({ error: 'order array required' });
    }

    order.forEach((slug, index) => {
      const dir = path.join(FEATURED_DIR, slug);
      if (!fs.existsSync(dir)) return;

      const project = parseFeaturedProject(slug);
      if (!project) return;

      project.date = String(index + 1);
      writeFeaturedMarkdown(dir, project);
    });

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
app.post('/api/featured', upload.single('cover'), (req, res) => {
  try {
    const { title, role, description, tech, cta, external, button } = req.body;
    const slug = title; // Use title as folder name

    const dir = path.join(FEATURED_DIR, slug);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    // Determine cover path
    let coverPath = './cover.webp';
    if (req.file) {
      coverPath = `./${req.file.filename}`;
    }

    // Calculate next order number
    const dirs = fs.readdirSync(FEATURED_DIR).filter(d =>
      fs.statSync(path.join(FEATURED_DIR, d)).isDirectory(),
    );
    const maxDate = dirs.reduce((max, d) => {
      const p = parseFeaturedProject(d);
      if (p) {
        const num = parseInt(p.date) || 0;
        return Math.max(max, num);
      }
      return max;
    }, 0);

    const data = {
      date: String(maxDate + 1),
      title,
      cover: coverPath,
      cta: cta || '',
      external: external || '',
      button: button || 'Read More',
      role: role || '',
      tech: tech ? (typeof tech === 'string' ? JSON.parse(tech) : tech) : [],
      description: description || '',
      published: true,
    };

    writeFeaturedMarkdown(dir, data);
    res.json({ success: true, project: parseFeaturedProject(slug) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update a featured project
app.put('/api/featured/:slug', upload.single('cover'), (req, res) => {
  try {
    const { slug } = req.params;
    const dir = path.join(FEATURED_DIR, slug);
    if (!fs.existsSync(dir)) return res.status(404).json({ error: 'Not found' });

    const existing = parseFeaturedProject(slug);
    if (!existing) return res.status(404).json({ error: 'Not found' });

    let coverPath = existing.cover;
    if (req.file) {
      coverPath = `./${req.file.filename}`;
    }

    const { title, role, description, tech, cta, external, button } = req.body;

    const data = {
      date: existing.date,
      title: title || existing.title,
      cover: coverPath,
      cta: cta !== undefined ? cta : existing.cta,
      external: external !== undefined ? external : existing.external,
      button: button || existing.button,
      role: role !== undefined ? role : existing.role,
      tech: tech ? (typeof tech === 'string' ? JSON.parse(tech) : tech) : existing.tech,
      description: description !== undefined ? description : existing.description,
      published: existing.published,
    };

    // Handle rename if title changed
    if (title && title !== slug) {
      const newDir = path.join(FEATURED_DIR, title);
      fs.renameSync(dir, newDir);
      writeFeaturedMarkdown(newDir, data);
      res.json({ success: true, project: parseFeaturedProject(title) });
    } else {
      writeFeaturedMarkdown(dir, data);
      res.json({ success: true, project: parseFeaturedProject(slug) });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE a featured project
app.delete('/api/featured/:slug', (req, res) => {
  try {
    const dir = path.join(FEATURED_DIR, req.params.slug);
    if (!fs.existsSync(dir)) return res.status(404).json({ error: 'Not found' });

    fs.rmSync(dir, { recursive: true, force: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST toggle publish/unpublish
app.post('/api/featured/:slug/toggle-publish', (req, res) => {
  try {
    const dir = path.join(FEATURED_DIR, req.params.slug);
    if (!fs.existsSync(dir)) return res.status(404).json({ error: 'Not found' });

    const mdPath = path.join(dir, 'index.md');
    const xxmdPath = path.join(dir, 'index.xxmd');

    if (fs.existsSync(mdPath)) {
      fs.renameSync(mdPath, xxmdPath);
    } else if (fs.existsSync(xxmdPath)) {
      fs.renameSync(xxmdPath, mdPath);
    }

    res.json({ success: true, project: parseFeaturedProject(req.params.slug) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// (reorder route moved above /:slug routes)

// ─────────────────────────────────────────────
// JOBS API
// ─────────────────────────────────────────────

// GET all jobs
app.get('/api/jobs', (req, res) => {
  try {
    const dirs = fs.readdirSync(JOBS_DIR).filter(d =>
      fs.statSync(path.join(JOBS_DIR, d)).isDirectory(),
    );

    const jobs = dirs
      .map(slug => parseJob(slug))
      .filter(Boolean)
      .sort((a, b) => {
        const aDate = new Date(a.date);
        const bDate = new Date(b.date);
        return bDate - aDate; // Most recent first
      });

    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT reorder jobs — MUST be before /:slug routes
app.put('/api/jobs/reorder', (req, res) => {
  try {
    const { order } = req.body;
    if (!order || !Array.isArray(order)) {
      return res.status(400).json({ error: 'order array required' });
    }

    const baseDate = new Date('2025-01-01');
    order.forEach((slug, index) => {
      const dir = path.join(JOBS_DIR, slug);
      if (!fs.existsSync(dir)) return;

      const job = parseJob(slug);
      if (!job) return;

      const d = new Date(baseDate);
      d.setDate(d.getDate() - index);
      job.date = d.toISOString().split('T')[0];
      writeJobMarkdown(dir, job);
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create a new job
app.post('/api/jobs', (req, res) => {
  try {
    const { title, company, location, range, url, description, date } = req.body;
    const slug = company || title;

    const dir = path.join(JOBS_DIR, slug);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const data = {
      date: date || new Date().toISOString().split('T')[0],
      title,
      company: company || slug,
      location: location || '',
      range: range || '',
      url: url || '#',
      description: description || '',
      published: true,
    };

    writeJobMarkdown(dir, data);
    res.json({ success: true, job: parseJob(slug) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update a job
app.put('/api/jobs/:slug', (req, res) => {
  try {
    const { slug } = req.params;
    const dir = path.join(JOBS_DIR, slug);
    if (!fs.existsSync(dir)) return res.status(404).json({ error: 'Not found' });

    const existing = parseJob(slug);
    if (!existing) return res.status(404).json({ error: 'Not found' });

    const { title, company, location, range, url, description, date } = req.body;

    const data = {
      date: date || existing.date,
      title: title !== undefined ? title : existing.title,
      company: company !== undefined ? company : existing.company,
      location: location !== undefined ? location : existing.location,
      range: range !== undefined ? range : existing.range,
      url: url !== undefined ? url : existing.url,
      description: description !== undefined ? description : existing.description,
      published: existing.published,
    };

    // Handle rename if company changed
    if (company && company !== slug) {
      const newDir = path.join(JOBS_DIR, company);
      fs.renameSync(dir, newDir);
      writeJobMarkdown(newDir, data);
      res.json({ success: true, job: parseJob(company) });
    } else {
      writeJobMarkdown(dir, data);
      res.json({ success: true, job: parseJob(slug) });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE a job
app.delete('/api/jobs/:slug', (req, res) => {
  try {
    const dir = path.join(JOBS_DIR, req.params.slug);
    if (!fs.existsSync(dir)) return res.status(404).json({ error: 'Not found' });

    fs.rmSync(dir, { recursive: true, force: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST toggle publish/unpublish for jobs
app.post('/api/jobs/:slug/toggle-publish', (req, res) => {
  try {
    const dir = path.join(JOBS_DIR, req.params.slug);
    if (!fs.existsSync(dir)) return res.status(404).json({ error: 'Not found' });

    const mdPath = path.join(dir, 'index.md');
    const xxmdPath = path.join(dir, 'index.xxmd');

    if (fs.existsSync(mdPath)) {
      fs.renameSync(mdPath, xxmdPath);
    } else if (fs.existsSync(xxmdPath)) {
      fs.renameSync(xxmdPath, mdPath);
    }

    res.json({ success: true, job: parseJob(req.params.slug) });
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

app.post('/api/resume/upload', uploadResume.single('resume'), (req, res) => {
  try {
    const filePath = path.join(RESUME_DIR, 'resume.json');
    fs.writeFileSync(filePath, JSON.stringify({ type: 'file', value: '/resume.pdf' }, null, 2));
    res.json({ success: true, url: '/resume.pdf' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── HOMEPAGE API ───
app.get('/api/homepage/hero', (req, res) => {
  try {
    const filePath = path.join(HERO_DIR, 'hero.json');
    if (!fs.existsSync(filePath)) return res.json({});
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/homepage/hero', (req, res) => {
  try {
    const filePath = path.join(HERO_DIR, 'hero.json');
    if (!fs.existsSync(HERO_DIR)) fs.mkdirSync(HERO_DIR, { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(req.body, null, 2));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/homepage/about', (req, res) => {
  try {
    const filePath = path.join(ABOUT_DIR, 'about.json');
    if (!fs.existsSync(filePath)) return res.json({});
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/homepage/about', (req, res) => {
  try {
    const filePath = path.join(ABOUT_DIR, 'about.json');
    if (!fs.existsSync(ABOUT_DIR)) fs.mkdirSync(ABOUT_DIR, { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(req.body, null, 2));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────
// CASE STUDIES API
// ─────────────────────────────────────────────

app.get('/api/case-studies', (req, res) => {
  try {
    if (!fs.existsSync(CASE_STUDIES_DIR)) fs.mkdirSync(CASE_STUDIES_DIR, { recursive: true });
    const dirs = fs.readdirSync(CASE_STUDIES_DIR).filter(d => 
      fs.statSync(path.join(CASE_STUDIES_DIR, d)).isDirectory()
    );
    const studies = dirs.map(slug => {
      const dir = path.join(CASE_STUDIES_DIR, slug);
      const mdFile = findMarkdownFile(dir);
      if (!mdFile) return null;
      const raw = fs.readFileSync(mdFile.path, 'utf-8');
      const { data: frontmatter } = matter(raw);
      return { slug, title: frontmatter.title || slug, date: frontmatter.date, published: mdFile.published };
    }).filter(Boolean);
    res.json(studies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/case-studies', (req, res) => {
  try {
    const { title, slug } = req.body;
    const dir = path.join(CASE_STUDIES_DIR, slug);
    if (fs.existsSync(dir)) return res.status(400).json({ error: 'Slug already exists' });
    fs.mkdirSync(dir, { recursive: true });
    
    const initialContent = `---
title: '${title}'
slug: '${slug}'
date: '${new Date().toISOString().split('T')[0]}'
---

# ${title}
`;
    fs.writeFileSync(path.join(dir, 'index.md'), initialContent);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/case-studies/:slug', (req, res) => {
  try {
    const dir = path.join(CASE_STUDIES_DIR, req.params.slug);
    if (!fs.existsSync(dir)) return res.status(404).json({ error: 'Not found' });
    fs.rmSync(dir, { recursive: true, force: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/case-studies/:slug', (req, res) => {
  try {
    const { slug } = req.params;
    const { blocks, published, title, summary, role, results, methods, banner } = req.body;
    const dir = path.join(CASE_STUDIES_DIR, slug);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    // Handle Banner Image
    let bannerPath = banner || '';
    if (bannerPath.startsWith('data:')) {
      const slugDir = path.join(UPLOADS_DIR, slug);
      if (!fs.existsSync(slugDir)) fs.mkdirSync(slugDir, { recursive: true });
      
      const mimeMatch = bannerPath.match(/^data:(image\/\w+);base64,/);
      const mimeType = mimeMatch ? mimeMatch[1] : 'image/png';
      let ext = 'png';
      if (mimeType.includes('gif')) ext = 'gif';
      else if (mimeType.includes('webp')) ext = 'webp';
      else if (mimeType.includes('jpeg') || mimeType.includes('jpg')) ext = 'jpg';
      else if (mimeType.includes('svg')) ext = 'svg';

      const fileName = `banner.${ext}`;
      const base64Data = bannerPath.replace(/^data:image\/\w+;base64,/, "");
      fs.writeFileSync(path.join(slugDir, fileName), base64Data, 'base64');
      bannerPath = `/uploads/case-studies/${slug}/${fileName}`;
    }

    let markdown = ``;

    const savedBlocks = JSON.parse(JSON.stringify(blocks)); // Deep copy to avoid mutating the original blocks for the markdown generation if needed

    const derivedTocItems = [];
    savedBlocks.forEach(block => {
      if (block.type === 'text') {
        let content = block.content;
        if (block.tocEntry) {
          const anchor = (block.tocName || 'section').toLowerCase().replace(/[^a-z0-9]+/g, '-');
          // Inject ID into the first H2 tag found in the content
          if (content.includes('<h2')) {
            content = content.replace(/<h2([^>]*)>/, `<h2 id="${anchor}"$1>`);
          }
          derivedTocItems.push({
            text: block.tocName || 'Section',
            anchor: anchor
          });
        }
        markdown += `${content.trim()}\n\n`;
      } else if (block.type === 'image') {
        const slugDir = path.join(UPLOADS_DIR, slug);
        if (!fs.existsSync(slugDir)) fs.mkdirSync(slugDir, { recursive: true });
        
        markdown += `\n<div class="grid grid-${block.grid}">\n\n`;
        block.images.forEach((img, i) => {
          if (img.startsWith('data:')) {
            const mimeMatch = img.match(/^data:(image\/\w+);base64,/);
            const mimeType = mimeMatch ? mimeMatch[1] : 'image/png';
            let ext = 'png';
            if (mimeType.includes('gif')) ext = 'gif';
            else if (mimeType.includes('webp')) ext = 'webp';
            else if (mimeType.includes('jpeg') || mimeType.includes('jpg')) ext = 'jpg';
            else if (mimeType.includes('svg')) ext = 'svg';

            const fileName = `img-${block.id}-${i}.${ext}`;
            const base64Data = img.replace(/^data:image\/\w+;base64,/, "");
            fs.writeFileSync(path.join(slugDir, fileName), base64Data, 'base64');
            
            const publicPath = `/uploads/case-studies/${slug}/${fileName}`;
            markdown += `![Image](${publicPath})\n\n`;
            block.images[i] = publicPath;
          } else {
            markdown += `![Image](${img})\n\n`;
          }
        });
        markdown += `</div>\n\n`;
      }
    });

    const frontmatter = {
      title,
      slug,
      date: new Date().toISOString().split('T')[0],
      published,
      summary: summary || '',
      role: role || '',
      results: results || '',
      methods: methods || '',
      banner: bannerPath,
      tocEnabled: derivedTocItems.length > 0,
      tocItems: derivedTocItems
    };

    const fileContent = matter.stringify(markdown, frontmatter);

    // Save optimized blocks (paths instead of base64)
    const builderData = {
      metadata: { title, published, summary, role, results, methods, banner: bannerPath, tocEnabled: derivedTocItems.length > 0, tocItems: derivedTocItems },
      blocks: savedBlocks
    };
    fs.writeFileSync(path.join(dir, 'blocks.json'), JSON.stringify(builderData, null, 2));
    fs.writeFileSync(path.join(dir, 'index.md'), fileContent);
    
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/case-studies/:slug', (req, res) => {
  try {
    const { slug } = req.params;
    const dir = path.join(CASE_STUDIES_DIR, slug);
    const mdFile = findMarkdownFile(dir);
    if (!mdFile) return res.status(404).json({ error: 'Not found' });

    const raw = fs.readFileSync(mdFile.path, 'utf-8');
    const { data: frontmatter, content } = matter(raw);
    
    // We'd need a way to parse MD back to blocks for a perfect editor
    // For now, let's just return the raw content if needed
    // But our builder currently only works one-way or needs blocks storage
    const blocksFile = path.join(dir, 'blocks.json');
    if (fs.existsSync(blocksFile)) {
      const data = JSON.parse(fs.readFileSync(blocksFile, 'utf-8'));
      if (Array.isArray(data)) {
        return res.json({ blocks: data, metadata: {}, frontmatter });
      }
      return res.json({ blocks: data.blocks || [], metadata: data.metadata || {}, frontmatter });
    }
    
    res.json({ blocks: [], metadata: {}, frontmatter });
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
