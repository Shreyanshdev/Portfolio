// components/AddPostModal.js
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, Heading, TextCursorInput, Code, Quote, CalendarDays } from 'lucide-react';

const AddPostModal = ({ isOpen, onClose, onSave }) => {
  const [postData, setPostData] = useState({
    slug: '',
    title: '',
    excerpt: '',
    // Default date to current date, formatted
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
    readTime: '',
    featuredImage: '',
    imageAlt: '',
    author: 'Shreyansh Gupta', // Default author, can be made an input
    tags: '', // Comma-separated string
    content: [{ id: Date.now(), type: 'paragraph', text: '' }] // Start with one paragraph
  });

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setPostData({
        slug: '',
        title: '',
        excerpt: '',
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
        readTime: '',
        featuredImage: '',
        imageAlt: '',
        author: 'Shreyansh Gupta',
        tags: '',
        content: [{ id: Date.now(), type: 'paragraph', text: '' }]
      });
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPostData(prev => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (id, field, value) => {
    setPostData(prev => ({
      ...prev,
      content: prev.content.map(block =>
        block.id === id ? { ...block, [field]: value } : block
      )
    }));
  };

  const handleAddContentBlock = (type) => {
    setPostData(prev => ({
      ...prev,
      content: [...prev.content, { id: Date.now(), type: type, text: '', level: type === 'heading' ? 2 : null }]
    }));
  };

  const handleRemoveContentBlock = (id) => {
    setPostData(prev => ({
      ...prev,
      content: prev.content.filter(block => block.id !== id)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic validation
    if (!postData.slug || !postData.title || !postData.excerpt) {
      alert('Please fill in required fields: Slug, Title, Excerpt.');
      return;
    }
    onSave(postData);
    onClose(); // Close modal after saving
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto"
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="glass-card w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 rounded-lg shadow-xl relative"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-3xl font-bold text-foreground mb-6">Create New Blog Post</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Details */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-foreground mb-1">Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={postData.title}
                  onChange={handleChange}
                  className="w-full p-2 rounded-md bg-input border border-border text-foreground focus:ring-primary focus:border-primary"
                  required
                />
              </div>
              <div>
                <label htmlFor="slug" className="block text-sm font-medium text-foreground mb-1">Slug (URL friendly)</label>
                <input
                  type="text"
                  id="slug"
                  name="slug"
                  value={postData.slug}
                  onChange={handleChange}
                  className="w-full p-2 rounded-md bg-input border border-border text-foreground focus:ring-primary focus:border-primary"
                  required
                />
              </div>
              <div>
                <label htmlFor="excerpt" className="block text-sm font-medium text-foreground mb-1">Excerpt</label>
                <textarea
                  id="excerpt"
                  name="excerpt"
                  value={postData.excerpt}
                  onChange={handleChange}
                  rows="3"
                  className="w-full p-2 rounded-md bg-input border border-border text-foreground focus:ring-primary focus:border-primary"
                  required
                ></textarea>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-foreground mb-1">Date</label>
                  <div className="relative">
                    <input
                      type="text" // Can use 'date' type for native picker, or 'text' for manual input
                      id="date"
                      name="date"
                      value={postData.date}
                      onChange={handleChange}
                      className="w-full p-2 rounded-md bg-input border border-border text-foreground focus:ring-primary focus:border-primary pr-10"
                    />
                    <CalendarDays className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  </div>
                </div>
                <div>
                  <label htmlFor="readTime" className="block text-sm font-medium text-foreground mb-1">Read Time (e.g., "5 min read")</label>
                  <input
                    type="text"
                    id="readTime"
                    name="readTime"
                    value={postData.readTime}
                    onChange={handleChange}
                    className="w-full p-2 rounded-md bg-input border border-border text-foreground focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="featuredImage" className="block text-sm font-medium text-foreground mb-1">Featured Image URL</label>
                <input
                  type="url"
                  id="featuredImage"
                  name="featuredImage"
                  value={postData.featuredImage}
                  onChange={handleChange}
                  className="w-full p-2 rounded-md bg-input border border-border text-foreground focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label htmlFor="imageAlt" className="block text-sm font-medium text-foreground mb-1">Image Alt Text</label>
                <input
                  type="text"
                  id="imageAlt"
                  name="imageAlt"
                  value={postData.imageAlt}
                  onChange={handleChange}
                  className="w-full p-2 rounded-md bg-input border border-border text-foreground focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label htmlFor="author" className="block text-sm font-medium text-foreground mb-1">Author</label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  value={postData.author}
                  onChange={handleChange}
                  className="w-full p-2 rounded-md bg-input border border-border text-foreground focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-foreground mb-1">Tags (comma-separated)</label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={postData.tags}
                  onChange={handleChange}
                  className="w-full p-2 rounded-md bg-input border border-border text-foreground focus:ring-primary focus:border-primary"
                />
              </div>

              {/* Content Editor */}
              <div className="border-t border-border pt-6 mt-6">
                <h3 className="text-xl font-bold text-foreground mb-4">Content Blocks</h3>
                <div className="space-y-4">
                  {postData.content.map((block, index) => (
                    <div key={block.id} className="relative p-4 bg-muted/20 rounded-md border border-border group">
                      <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">{block.type.toUpperCase()}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveContentBlock(block.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                          title="Remove block"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      {block.type === 'paragraph' && (
                        <textarea
                          placeholder="Enter paragraph text..."
                          value={block.text}
                          onChange={(e) => handleContentChange(block.id, 'text', e.target.value)}
                          rows="4"
                          className="w-full p-2 rounded-md bg-input border border-border text-foreground focus:ring-primary focus:border-primary"
                        ></textarea>
                      )}
                      {block.type === 'heading' && (
                        <>
                          <select
                            value={block.level || 2} // Default to H2
                            onChange={(e) => handleContentChange(block.id, 'level', parseInt(e.target.value))}
                            className="p-2 rounded-md bg-input border border-border text-foreground mb-2"
                          >
                            <option value={1}>H1</option>
                            <option value={2}>H2</option>
                            <option value={3}>H3</option>
                            <option value={4}>H4</option>
                            <option value={5}>H5</option>
                            <option value={6}>H6</option>
                          </select>
                          <input
                            type="text"
                            placeholder={`Enter H${block.level || 2} text...`}
                            value={block.text}
                            onChange={(e) => handleContentChange(block.id, 'text', e.target.value)}
                            className="w-full p-2 rounded-md bg-input border border-border text-foreground focus:ring-primary focus:border-primary"
                          />
                        </>
                      )}
                      {block.type === 'code' && (
                        <textarea
                          placeholder="Enter code block..."
                          value={block.text}
                          onChange={(e) => handleContentChange(block.id, 'text', e.target.value)}
                          rows="6"
                          className="w-full p-2 font-mono text-sm rounded-md bg-input border border-border text-foreground focus:ring-primary focus:border-primary"
                        ></textarea>
                      )}
                      {block.type === 'quote' && (
                        <textarea
                          placeholder="Enter quote text..."
                          value={block.text}
                          onChange={(e) => handleContentChange(block.id, 'text', e.target.value)}
                          rows="3"
                          className="w-full p-2 rounded-md bg-input border border-border text-foreground focus:ring-primary focus:border-primary italic"
                        ></textarea>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                  <button
                    type="button"
                    onClick={() => handleAddContentBlock('paragraph')}
                    className="flex items-center gap-1 p-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary-foreground hover:text-secondary transition-colors"
                  >
                    <TextCursorInput size={16} /> Add Paragraph
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddContentBlock('heading')}
                    className="flex items-center gap-1 p-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary-foreground hover:text-secondary transition-colors"
                  >
                    <Heading size={16} /> Add Heading
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddContentBlock('code')}
                    className="flex items-center gap-1 p-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary-foreground hover:text-secondary transition-colors"
                  >
                    <Code size={16} /> Add Code
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddContentBlock('quote')}
                    className="flex items-center gap-1 p-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary-foreground hover:text-secondary transition-colors"
                  >
                    <Quote size={16} /> Add Quote
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-6 border-t border-border mt-6">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary-dark shadow-md"
                >
                  <Plus className="w-4 h-4 mr-2" /> Save Post
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddPostModal;