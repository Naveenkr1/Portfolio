/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const path = require('path');
const _ = require('lodash');
const fs = require('fs');
const matter = require('gray-matter');

exports.sourceNodes = async ({ actions, createNodeId, createContentDigest }) => {
  const { createNode } = actions;
  
  const contentDir = path.join(__dirname, 'content');

  const createJsonNode = (dir, typeName) => {
    const dirPath = path.join(contentDir, dir);
    if (!fs.existsSync(dirPath)) return;
    const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.json'));
    if (files.length === 0) return;
    
    const raw = fs.readFileSync(path.join(dirPath, files[0]), 'utf-8');
    const item = JSON.parse(raw);
    item.id = item.id || '1';
    
    if (typeName === 'MongodbPortfolioHeros') {
      item.subtitle = item.subtitle || item.intro;
    } else if (typeName === 'MongodbPortfolioAbouts') {
      item.description = item.description || (item.paragraphs ? item.paragraphs.join('\n') : '');
    }
    
    const nodeMeta = {
      id: createNodeId(`${typeName}-${item.id}`),
      parent: null,
      children: [],
      internal: {
        type: typeName,
        mediaType: `application/json`,
        content: JSON.stringify(item),
        contentDigest: createContentDigest(item),
      },
    };
    const node = Object.assign({}, item, nodeMeta);
    createNode(node);
  };

  const createMarkdownNodes = (dir, typeName) => {
    const dirPath = path.join(contentDir, dir);
    if (!fs.existsSync(dirPath)) return;
    const subdirs = fs.readdirSync(dirPath).filter(f => fs.statSync(path.join(dirPath, f)).isDirectory());
    
    subdirs.forEach(subdir => {
      const itemDirPath = path.join(dirPath, subdir);
      const files = fs.readdirSync(itemDirPath);
      const md = files.find(f => f === 'index.md');
      const xxmd = files.find(f => f === 'index.xxmd');
      const fileToParse = md || xxmd;
      if (!fileToParse) return;

      const raw = fs.readFileSync(path.join(itemDirPath, fileToParse), 'utf-8');
      const { data, content } = matter(raw);
      
      const item = { ...data, id: subdir, slug: subdir };
      item.published = !!md;
      
      if (typeName === 'MongodbPortfolioProjects' || typeName === 'MongodbPortfolioJobs') {
        item.description = content.trim();
      } else if (typeName === 'MongodbPortfolioCaseStudies') {
        item.markdown = content;
        item.toc_enabled = item.tocEnabled;
        item.toc_items = item.tocItems;
      }

      if (item.tech && typeof item.tech === 'string') {
        try { item.tech = JSON.parse(item.tech); } catch(e){}
      }

      // Handle relative images in cover or banner
      const handleRelativeImage = (imgPath, subdir) => {
        if (!imgPath || imgPath.startsWith('http') || imgPath.startsWith('/')) return imgPath;
        const staticAssetsDir = path.join(__dirname, 'static', 'assets');
        if (!fs.existsSync(staticAssetsDir)) fs.mkdirSync(staticAssetsDir, { recursive: true });
        
        let safePath = imgPath;
        if (safePath.startsWith('./')) { safePath = safePath.slice(2); }
        
        const sourcePath = path.join(itemDirPath, safePath);
        if (fs.existsSync(sourcePath)) {
          const ext = path.extname(sourcePath);
          let newFileName = `${subdir}-${path.basename(sourcePath, ext)}${ext}`;
          newFileName = newFileName.split(' ').join('-');
          const destPath = path.join(staticAssetsDir, newFileName);
          fs.copyFileSync(sourcePath, destPath);
          return `/assets/${newFileName}`;
        }
        return imgPath;
      };

      if (item.cover) item.cover = handleRelativeImage(item.cover, subdir);
      if (item.banner) item.banner = handleRelativeImage(item.banner, subdir);

      const nodeMeta = {
        id: createNodeId(`${typeName}-${item.id}`),
        parent: null,
        children: [],
        internal: {
          type: typeName,
          mediaType: `application/json`,
          content: JSON.stringify(item),
          contentDigest: createContentDigest(item),
        },
      };
      const node = Object.assign({}, item, nodeMeta);
      createNode(node);
    });
  };

  try {
    createJsonNode('hero', 'MongodbPortfolioHeros');
    createJsonNode('about', 'MongodbPortfolioAbouts');
    createMarkdownNodes('featured', 'MongodbPortfolioProjects');
    createMarkdownNodes('jobs', 'MongodbPortfolioJobs');
    createMarkdownNodes('case-studies', 'MongodbPortfolioCaseStudies');
  } catch (err) {
    console.error("CRITICAL ERROR IN sourceNodes:", err);
    throw err;
  }
};

exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions;
  const postTemplate = path.resolve(`src/templates/post.js`);
  const tagTemplate = path.resolve('src/templates/tag.js');
  const caseStudyTemplate = path.resolve('src/templates/case-study.js');

  const result = await graphql(`
    {
      postsRemark: allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/content/posts/" } }
        sort: { order: DESC, fields: [frontmatter___date] }
        limit: 1000
      ) {
        edges {
          node {
            frontmatter {
              slug
            }
          }
        }
      }
      tagsGroup: allMarkdownRemark(limit: 2000) {
        group(field: frontmatter___tags) {
          fieldValue
        }
      }
      caseStudiesDB: allMongodbPortfolioCaseStudies(
        sort: { order: DESC, fields: [date] }
      ) {
        edges {
          node {
            slug
            published
          }
        }
      }
    }
  `);

  // Handle errors
  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`);
    return;
  }

  // Create post detail pages
  const posts = result.data.postsRemark.edges;

  posts.forEach(({ node }) => {
    createPage({
      path: node.frontmatter.slug,
      component: postTemplate,
      context: {},
    });
  });

  // Extract tag data from query
  const tags = result.data.tagsGroup.group;
  // Make tag pages
  tags.forEach(tag => {
    createPage({
      path: `/pensieve/tags/${_.kebabCase(tag.fieldValue)}/`,
      component: tagTemplate,
      context: {
        tag: tag.fieldValue,
      },
    });
  });

  // Create case study pages
  const caseStudies = result.data.caseStudiesDB.edges;
  caseStudies.forEach(({ node }) => {
    // Only skip drafts if we are in production
    if (process.env.NODE_ENV === 'production' && node.published === false) {
      return;
    }
    createPage({
      path: `/case-study/${node.slug}`,
      component: caseStudyTemplate,
      context: {
        slug: node.slug,
      },
    });
  });
};

// https://www.gatsbyjs.org/docs/node-apis/#onCreateWebpackConfig
exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
  // https://www.gatsbyjs.org/docs/debugging-html-builds/#fixing-third-party-modules
  if (stage === 'build-html' || stage === 'develop-html') {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /scrollreveal/,
            use: loaders.null(),
          },
          {
            test: /animejs/,
            use: loaders.null(),
          },
          {
            test: /miniraf/,
            use: loaders.null(),
          },
        ],
      },
    });
  }

  actions.setWebpackConfig({
    resolve: {
      alias: {
        '@components': path.resolve(__dirname, 'src/components'),
        '@config': path.resolve(__dirname, 'src/config'),
        '@fonts': path.resolve(__dirname, 'src/fonts'),
        '@hooks': path.resolve(__dirname, 'src/hooks'),
        '@images': path.resolve(__dirname, 'src/images'),
        '@pages': path.resolve(__dirname, 'src/pages'),
        '@styles': path.resolve(__dirname, 'src/styles'),
        '@utils': path.resolve(__dirname, 'src/utils'),
      },
    },
  });
};

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  if (node.internal.type === `MarkdownRemark`) {
    const fileNode = getNode(node.parent);
    if (fileNode.internal.type === 'File' && fileNode.sourceInstanceName === 'content' && fileNode.relativeDirectory.startsWith('case-studies')) {
      const parts = fileNode.relativeDirectory.split('/');
      const slug = `/${parts[parts.length - 1]}`;
      createNodeField({
        node,
        name: `slug`,
        value: slug,
      });
    }
  }
};

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  const typeDefs = `
    type MarkdownRemark implements Node {
      frontmatter: MarkdownRemarkFrontmatter
    }
    type MarkdownRemarkFrontmatter @infer {
      title: String
      slug: String
      date: Date @dateformat
      published: Boolean
      summary: String
      details: [CaseStudyDetailItem]
      role: String
      results: String
      methods: String
      tocEnabled: Boolean
      tocItems: [TOCItem]
      cover: File @fileByRelativePath
      tech: [String]
      github: String
      external: String
      button: String
      cta: String
    }
    type TOCItem {
      text: String
      anchor: String
    }
    type CaseStudyDetailItem {
      label: String
      value: String
    }
    type MongodbPortfolioCaseStudies implements Node @infer {
      title: String
      slug: String
      date: String
      published: Boolean
      summary: String
      role: String
      results: String
      methods: String
      details: [CaseStudyDetailItem]
      banner: String
      toc_enabled: Boolean
      toc_items: [CaseStudyTOCItem]
      markdown: String
    }
    type CaseStudyTOCItem {
      text: String
      anchor: String
    }
    type MongodbPortfolioProjects implements Node @infer {
      title: String
      slug: String
      date: String
      published: Boolean
      cover: String
      description: String
      role: String
      tech: [String]
      external: String
      button: String
      cta: String
    }
  `;
  createTypes(typeDefs);
};
