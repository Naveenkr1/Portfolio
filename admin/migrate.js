require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { Project, Job, Hero, About } = require('./models');

const PORTFOLIO_ROOT = path.resolve(__dirname, '..');
const FEATURED_DIR = path.join(PORTFOLIO_ROOT, 'content', 'featured');
const JOBS_DIR = path.join(PORTFOLIO_ROOT, 'content', 'jobs');
const HERO_DIR = path.join(PORTFOLIO_ROOT, 'content', 'hero');
const ABOUT_DIR = path.join(PORTFOLIO_ROOT, 'content', 'about');

async function migrate() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for migration');

    // Migrate Featured Projects
    if (fs.existsSync(FEATURED_DIR)) {
      const dirs = fs.readdirSync(FEATURED_DIR).filter(d => fs.statSync(path.join(FEATURED_DIR, d)).isDirectory());
      for (const slug of dirs) {
        const dir = path.join(FEATURED_DIR, slug);
        const mdFile = fs.readdirSync(dir).find(f => f.startsWith('index.m') || f.startsWith('index.xxm'));
        if (mdFile) {
          const raw = fs.readFileSync(path.join(dir, mdFile), 'utf-8');
          const { data, content } = matter(raw);
          await Project.findOneAndUpdate(
            { slug },
            {
              ...data,
              slug,
              description: content.trim(),
              published: mdFile.endsWith('.md'),
              tech: Array.isArray(data.tech) ? data.tech : []
            },
            { upsert: true }
          );
          console.log(`Migrated Project: ${slug}`);
        }
      }
    }

    // Migrate Jobs
    if (fs.existsSync(JOBS_DIR)) {
      const dirs = fs.readdirSync(JOBS_DIR).filter(d => fs.statSync(path.join(JOBS_DIR, d)).isDirectory());
      for (const slug of dirs) {
        const dir = path.join(JOBS_DIR, slug);
        const mdFile = fs.readdirSync(dir).find(f => f.startsWith('index.m') || f.startsWith('index.xxm'));
        if (mdFile) {
          const raw = fs.readFileSync(path.join(dir, mdFile), 'utf-8');
          const { data, content } = matter(raw);
          await Job.findOneAndUpdate(
            { slug },
            {
              ...data,
              slug,
              description: content.trim(),
              published: mdFile.endsWith('.md')
            },
            { upsert: true }
          );
          console.log(`Migrated Job: ${slug}`);
        }
      }
    }

    // Migrate Hero
    const heroPath = path.join(HERO_DIR, 'hero.json');
    if (fs.existsSync(heroPath)) {
      const data = JSON.parse(fs.readFileSync(heroPath, 'utf-8'));
      await Hero.findOneAndUpdate({}, {
        title: data.intro || data.title,
        name: data.name,
        subtitle: data.title || data.subtitle,
        description: data.description
      }, { upsert: true });
      console.log('Migrated Hero content');
    }

    // Migrate About
    const aboutPath = path.join(ABOUT_DIR, 'about.json');
    if (fs.existsSync(aboutPath)) {
      const data = JSON.parse(fs.readFileSync(aboutPath, 'utf-8'));
      await About.findOneAndUpdate({}, {
        title: data.title,
        description: Array.isArray(data.paragraphs) ? data.paragraphs.join('\n\n') : data.description,
        skills: data.skills
      }, { upsert: true });
      console.log('Migrated About content');
    }

    console.log('Migration complete!');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

migrate();
