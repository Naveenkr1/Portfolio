require('dotenv').config();
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
const { Project } = require('./models');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const PORTFOLIO_ROOT = path.resolve(__dirname, '..');
const FEATURED_DIR = path.join(PORTFOLIO_ROOT, 'content', 'featured');

async function migrateImages() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const projects = await Project.find();
    console.log(`Found ${projects.length} projects to check`);

    for (const project of projects) {
      if (project.cover && !project.cover.startsWith('http')) {
        // Local image found
        console.log(`Migrating image for: ${project.title}`);
        
        // Resolve local path
        // project.cover is usually './cover.webp' or similar
        // project.slug matches the folder name in content/featured
        const localFileName = project.cover.replace('./', '');
        const localPath = path.join(FEATURED_DIR, project.slug, localFileName);

        if (fs.existsSync(localPath)) {
          console.log(`Uploading ${localPath} to Cloudinary...`);
          const result = await cloudinary.uploader.upload(localPath, {
            folder: 'portfolio/featured',
            public_id: `${project.slug}-cover`,
            use_filename: true,
          });

          console.log(`Uploaded! URL: ${result.secure_url}`);
          project.cover = result.secure_url;
          await project.save();
        } else {
          console.warn(`File not found: ${localPath}`);
        }
      }
    }

    console.log('Image migration complete!');
    process.exit(0);
  } catch (err) {
    console.error('Image migration failed:', err);
    process.exit(1);
  }
}

migrateImages();
