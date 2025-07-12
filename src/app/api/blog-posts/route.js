// app/api/blog-posts/route.js (for Next.js App Router)

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Define the path to your mockBlogPosts.js file
const postsFilePath = path.join(process.cwd(), 'src', 'constants', 'mockBlogPosts.js');
// Function to read and parse the current blog posts
async function getBlogPosts() {
  try {
    const fileContent = await fs.promises.readFile(postsFilePath, 'utf-8');
    // Extract the array part from the file content
    // This regex looks for `export const mockBlogPosts = [` and captures everything until the closing `];`
    const match = fileContent.match(/export const mockBlogPosts = (\[[\s\S]*?\]);/);
    if (match && match[1]) {
      // Use a safe way to parse the array string, avoiding eval()
      // This is a simplified parser; for complex objects, consider JSON.stringify/parse
      const postsArrayString = match[1];
      // Replace single quotes with double quotes for JSON.parse
      const jsonString = postsArrayString.replace(/'/g, '"');
      // Replace unquoted keys with quoted keys (basic attempt)
      const cleanedJsonString = jsonString.replace(/(\w+):/g, '"$1":');
      // Clean up trailing commas if any (common in JS arrays)
      const finalJsonString = cleanedJsonString.replace(/,(\s*[}\]])/g, '$1');

      return JSON.parse(finalJsonString);
    }
    return [];
  } catch (error) {
    console.error("Error reading or parsing mockBlogPosts.js:", error);
    return []; // Return empty array if file doesn't exist or is invalid
  }
}

// Function to write updated blog posts back to the file
async function writeBlogPosts(posts) {
  // Convert the array back to a string that matches your mockBlogPosts.js format
  // Ensure content array is properly stringified for JS file
  const formattedPosts = posts.map(post => {
    const contentString = JSON.stringify(post.content, null, 2)
      .replace(/"type":/g, 'type:') // Remove quotes from 'type' key
      .replace(/"text":/g, 'text:') // Remove quotes from 'text' key
      .replace(/"level":/g, 'level:'); // Remove quotes from 'level' key

    // Re-add single quotes for string values if that's your preferred style in mockBlogPosts.js
    // This is a simplified replacement; for robust formatting, consider a code formatter
    const postString = JSON.stringify({ ...post, content: 'PLACEHOLDER_CONTENT' }, null, 2)
      .replace(/"([^"]+)":/g, '$1:') // Remove quotes from keys
      .replace(/"/g, "'"); // Replace double quotes with single quotes for string values

    return postString.replace("'PLACEHOLDER_CONTENT'", contentString);
  });

  const fileContent = `// constants/mockBlogPosts.js
// This file is updated by the /api/blog-posts route for local development persistence.

export const mockBlogPosts = [
${formattedPosts.join(',\n')}
];
`;

  try {
    await fs.promises.writeFile(postsFilePath, fileContent, 'utf-8');
    console.log("mockBlogPosts.js updated successfully.");
  } catch (error) {
    console.error("Error writing to mockBlogPosts.js:", error);
    throw error;
  }
}

// Handle POST requests
export async function POST(request) {
  try {
    const newPost = await request.json();
    const currentPosts = await getBlogPosts();

    // Add a unique ID to the new post if not already present (for React keys)
    const postToAdd = { ...newPost, id: newPost.slug || Date.now().toString() };

    // Add the new post to the beginning of the array
    const updatedPosts = [postToAdd, ...currentPosts];

    await writeBlogPosts(updatedPosts);

    return NextResponse.json({ message: 'Blog post added successfully!', post: postToAdd }, { status: 201 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ message: 'Failed to add blog post.', error: error.message }, { status: 500 });
  }
}

// You might also want a GET handler if you want to fetch all posts via API
export async function GET() {
  try {
    const posts = await getBlogPosts();
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ message: 'Failed to retrieve blog posts.' }, { status: 500 });
  }
}