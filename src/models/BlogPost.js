// src/models/BlogPost.js
import mongoose from 'mongoose';

const ContentBlockSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  type: { type: String, required: true }, // e.g., "paragraph", "heading", "code", "quote"
  text: { type: String, required: true },
  level: { type: Number, default: null } // For headings
});

const BlogPostSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  excerpt: { type: String, required: true },
  date: { type: String, required: true }, // Storing as string for simplicity, can be Date type
  readTime: { type: String, required: true },
  featuredImage: { type: String, default: '' },
  imageAlt: { type: String, default: '' },
  author: { type: String, required: true },
  tags: { type: String, default: '' },
  content: [ContentBlockSchema], // Array of content blocks
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Use existing model if it exists, otherwise create a new one
const BlogPost = mongoose.models.BlogPost || mongoose.model('BlogPost', BlogPostSchema);

export default BlogPost;
