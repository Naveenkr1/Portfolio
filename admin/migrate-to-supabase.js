require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const supabase = require('./supabase');
const { Project, Job, Hero, About, Admin } = require('./models');

const PORTFOLIO_ROOT = path.resolve(__dirname, '..');
const CASE_STUDIES_DIR = path.join(PORTFOLIO_ROOT, 'content', 'case-studies');

async function migrate() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB.');

  try {
    // 1. Migrate Projects
    console.log('Migrating Projects...');
    const projects = await Project.find().lean();
    for (const p of projects) {
      const { _id, __v, ...data } = p;
      if (data.tech && typeof data.tech === 'string') {
        data.tech = JSON.parse(data.tech);
      }
      const { error } = await supabase.from('projects').insert({ ...data });
      if (error) console.error(`Error migrating project ${p.slug}:`, error);
    }

    // 2. Migrate Jobs
    console.log('Migrating Jobs...');
    const jobs = await Job.find().lean();
    for (const j of jobs) {
      const { _id, __v, ...data } = j;
      const { error } = await supabase.from('jobs').insert({ ...data });
      if (error) console.error(`Error migrating job ${j.slug}:`, error);
    }

    // 3. Migrate Hero
    console.log('Migrating Hero...');
    const heroes = await Hero.find().lean();
    for (const h of heroes) {
      const { _id, __v, ...data } = h;
      const { error } = await supabase.from('hero').insert({ ...data });
      if (error) console.error(`Error migrating hero:`, error);
    }

    // 4. Migrate About
    console.log('Migrating About...');
    const abouts = await About.find().lean();
    for (const a of abouts) {
      const { _id, __v, ...data } = a;
      const { error } = await supabase.from('about').insert({ ...data });
      if (error) console.error(`Error migrating about:`, error);
    }

    // 5. Migrate Admin
    console.log('Migrating Admin...');
    const admins = await Admin.find().lean();
    for (const a of admins) {
      const { _id, __v, ...data } = a;
      const { error } = await supabase.from('admin').insert({ ...data });
      if (error) console.error(`Error migrating admin ${a.username}:`, error);
    }

    // 6. Migrate Case Studies (from Markdown)
    console.log('Migrating Case Studies from Markdown...');
    if (fs.existsSync(CASE_STUDIES_DIR)) {
      const dirs = fs.readdirSync(CASE_STUDIES_DIR).filter(d => 
        fs.statSync(path.join(CASE_STUDIES_DIR, d)).isDirectory()
      );
      
      for (const slug of dirs) {
        const dir = path.join(CASE_STUDIES_DIR, slug);
        const mdFiles = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
        if (mdFiles.length === 0) continue;
        
        const raw = fs.readFileSync(path.join(dir, mdFiles[0]), 'utf-8');
        const { data: frontmatter, content } = matter(raw);
        
        // Try to read blocks.json if it exists
        let blocks = [];
        const blocksFile = path.join(dir, 'blocks.json');
        if (fs.existsSync(blocksFile)) {
          const blocksData = JSON.parse(fs.readFileSync(blocksFile, 'utf-8'));
          blocks = blocksData.blocks || blocksData || [];
        }

        const caseStudyData = {
          title: frontmatter.title || slug,
          slug: slug,
          date: frontmatter.date || new Date().toISOString(),
          published: frontmatter.published !== false,
          summary: frontmatter.summary || null,
          role: frontmatter.role || null,
          results: frontmatter.results || null,
          methods: frontmatter.methods || null,
          banner: frontmatter.banner || null,
          toc_enabled: !!frontmatter.tocEnabled,
          toc_items: frontmatter.tocItems || [],
          blocks: blocks,
          markdown: content
        };

        const { error } = await supabase.from('case_studies').upsert(caseStudyData, { onConflict: 'slug' });
        if (error) console.error(`Error migrating case study ${slug}:`, error);
      }
    }

    console.log('Migration Complete!');
  } catch (error) {
    console.error('Fatal migration error:', error);
  } finally {
    mongoose.connection.close();
  }
}

migrate();
