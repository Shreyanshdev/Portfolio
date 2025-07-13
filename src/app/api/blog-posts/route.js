// app/api/blog-posts/route.js (for Next.js App Router)

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb'; // Import the database connection utility
import BlogPost from '@/models/BlogPost'; // Import your Mongoose model

// Handle GET requests to fetch all blog posts
export async function GET() {
  try {
    await dbConnect(); // Connect to the database

    // Fetch all blog posts, sorted by createdAt in descending order (latest first)
    const posts = await BlogPost.find({}).sort({ createdAt: -1 });

    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error("API GET Error (MongoDB):", error);
    return NextResponse.json(
      { message: 'Failed to retrieve blog posts.', error: error.message },
      { status: 500 }
    );
  }
}

// Handle POST requests to create a new blog post
export async function POST(request) {
  try {
    await dbConnect(); // Connect to the database
    const newPostData = await request.json(); // Get the new post data from the request body

    // Generate slug from title, ensuring uniqueness
    const baseSlug = newPostData.title
      ? newPostData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      : 'untitled-post';
    
    let finalSlug = baseSlug;
    let counter = 1;
    // Check if slug already exists and append a counter if it does
    while (await BlogPost.exists({ slug: finalSlug })) {
      finalSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Estimate read time (approx. 200 words per minute)
    const totalWords = newPostData.content.reduce((acc, block) => {
      return acc + (block.text ? block.text.split(' ').length : 0);
    }, 0);
    const readTime = `${Math.ceil(totalWords / 200)} min`;

    // Create a new BlogPost document
    const newPost = await BlogPost.create({
      slug: finalSlug,
      title: newPostData.title || 'Untitled Post',
      excerpt: newPostData.excerpt || '',
      date: newPostData.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      readTime: readTime,
      featuredImage: newPostData.featuredImage || '',
      imageAlt: newPostData.imageAlt || '',
      author: newPostData.author || 'Shreyansh Gupta',
      tags: newPostData.tags || '',
      content: newPostData.content || []
    });

    return NextResponse.json({ message: 'Blog post added successfully!', post: newPost }, { status: 201 });
  } catch (error) {
    console.error("API POST Error (MongoDB):", error);
    // Handle Mongoose validation errors or duplicate key errors specifically
    if (error.name === 'ValidationError') {
      return NextResponse.json({ message: 'Validation Error', errors: error.errors }, { status: 400 });
    }
    if (error.code === 11000) { // MongoDB duplicate key error
      return NextResponse.json({ message: 'Duplicate slug. Please use a different title.', error: error.message }, { status: 409 });
    }
    return NextResponse.json({ message: 'Failed to add blog post.', error: error.message }, { status: 500 });
  }
}

// Optional: Handle DELETE requests for a specific post by slug
export async function DELETE(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ message: 'Slug is required for deletion.' }, { status: 400 });
    }

    const deletedPost = await BlogPost.findOneAndDelete({ slug });

    if (!deletedPost) {
      return NextResponse.json({ message: 'Blog post not found.' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Blog post deleted successfully!', post: deletedPost }, { status: 200 });
  } catch (error) {
    console.error("API DELETE Error (MongoDB):", error);
    return NextResponse.json(
      { message: 'Failed to delete blog post.', error: error.message },
      { status: 500 }
    );
  }
}
