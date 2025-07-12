// src/data/mockBlogPosts.js

const mockBlogPosts = [
    {
      slug: "crafting-digital-experiences-my-journey",
      title: "Crafting Digital Experiences: My Journey as a Developer",
      date: "July 12, 2025",
      author: "Your Name Here",
      readTime: "5 min read",
      featuredImage: "/mock/blog-about-me.jpg",
      imageAlt: "Abstract representation of code and creativity",
      tags: ["Frontend", "Fullstack", "Personal"],
      excerpt: "Dive into my journey as a developer, exploring the technologies I love and the philosophy that drives my passion for creating impactful digital solutions.",
      content: [
        {
          type: "paragraph",
          text: "Hello there! I'm a dedicated and enthusiastic developer with a profound passion for bringing ideas to life through code. My journey in the digital realm is driven by a constant curiosity to learn, build, and innovate. I believe in the power of well-crafted software to solve real-world problems and enhance user experiences."
        },
        {
          type: "heading",
          level: 2,
          text: "My Technical Playground"
        },
        {
          type: "paragraph",
          text: "Over the years, I've had the privilege of working with a diverse set of technologies, allowing me to tackle various challenges across different platforms. My core expertise lies in modern web development, where I frequently leverage the power of **Next.js** and **React** to build fast, scalable, and SEO-friendly applications. For styling, **TailwindCSS** is my go-to, enabling rapid and consistent UI development. I also enjoy adding a touch of magic with animations, often using **GSAP** and **Framer Motion** to create smooth, engaging user interfaces."
        },
        {
          type: "paragraph",
          text: "Beyond the core frontend stack, I'm proficient in state management with **Redux** and data handling with **Contentlayer** for content-driven sites. My experience extends to e-commerce platforms like **Shopify**, where I've worked with **Liquid**, **SCSS**, and **JavaScript** to customize and enhance online stores. For more complex applications, I've delved into **Vue.js** and backend services like **Firebase**, building robust and interactive solutions."
        },
        {
          type: "paragraph",
          text: "On the mobile front, I'm comfortable with **React Native** and **Expo**, enabling me to deliver cross-platform applications. My toolkit also includes **Angular** for enterprise-level applications, utilizing **RxJS** for reactive programming and integrating with various APIs like **OpenWeather API** for dynamic data."
        },
        {
          type: "heading",
          level: 2,
          text: "What Drives Me"
        },
        {
          type: "paragraph",
          text: "My motivation stems from the satisfaction of seeing a concept transform into a functional, beautiful product. I thrive on challenges and am always eager to explore new technologies and methodologies. Whether it's optimizing performance, refining user flows, or architecting robust systems, I approach every task with meticulous attention to detail and a commitment to delivering high-quality results."
        },
        {
          type: "paragraph",
          text: "I am a firm believer in continuous learning and open-source contributions. I enjoy sharing knowledge and collaborating with fellow developers to build impactful solutions. This blog is a space where I'll share insights from my development journey, tutorials, thoughts on technology, and updates on my latest projects."
        },
        {
          type: "heading",
          level: 2,
          text: "Let's Connect"
        },
        {
          type: "paragraph",
          text: "Thank you for stopping by! If you have a project in mind, a question about development, or just want to chat about tech, feel free to reach out. I'm always excited to connect with like-minded individuals and explore new opportunities."
        },
      ]
    },
    {
      slug: "understanding-react-hooks-a-deep-dive",
      title: "Understanding React Hooks: A Deep Dive",
      date: "June 28, 2025",
      author: "Your Name Here",
      readTime: "8 min read",
      featuredImage: "/mock/blog-react-hooks.jpg",
      imageAlt: "React Hooks explained with code snippets",
      tags: ["React", "Frontend", "JavaScript"],
      excerpt: "Demystifying React Hooks: From useState to custom hooks, learn how to build more functional and concise React components.",
      content: [
        { type: "paragraph", text: "React Hooks revolutionized how we write React components, offering a way to use state and other React features without writing a class. This post will cover the fundamental hooks and how they can improve your component logic." },
        { type: "heading", level: 3, text: "useState: The Foundation" },
        { type: "code", text: "import React, { useState } from 'react';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  return (\n    <div>\n      <p>You clicked {count} times</p>\n      <button onClick={() => setCount(count + 1)}>Click me</button>\n    </div>\n  );\n}" },
        { type: "paragraph", text: "The `useState` hook lets you add React state to function components. It returns a pair: the current state value and a function that lets you update it." },
        { type: "heading", level: 3, text: "useEffect: Side Effects in Functional Components" },
        { type: "code", text: "import React, { useState, useEffect } from 'react';\n\nfunction TitleUpdater() {\n  const [count, setCount] = useState(0);\n  useEffect(() => {\n    document.title = `You clicked ${count} times`;\n  }, [count]); // Only re-run if count changes\n  return (\n    <div>\n      <p>Count: {count}</p>\n      <button onClick={() => setCount(count + 1)}>Increment</button>\n    </div>\n  );\n}" },
        { type: "paragraph", text: "`useEffect` is the equivalent of `componentDidMount`, `componentDidUpdate`, and `componentWillUnmount` combined. It's used for side effects like data fetching, subscriptions, or manually changing the DOM." },
        { type: "paragraph", text: "This article is just a small glimpse into the power of Hooks. Mastering them is key to writing modern, efficient React applications." }
      ]
    },
    {
      slug: "mastering-tailwind-css-for-rapid-ui-development",
      title: "Mastering Tailwind CSS for Rapid UI Development",
      date: "May 15, 2025",
      author: "Your Name Here",
      readTime: "7 min read",
      featuredImage: "/mock/blog-tailwind.jpg",
      imageAlt: "Tailwind CSS logo with abstract shapes",
      tags: ["TailwindCSS", "CSS", "Frontend"],
      excerpt: "Unlock the full potential of Tailwind CSS and streamline your UI development workflow. Learn tips and tricks for building beautiful, responsive interfaces faster than ever.",
      content: [
        { type: "paragraph", text: "Tailwind CSS has become my preferred utility-first CSS framework for building highly custom and responsive designs without ever leaving my HTML. Its approach significantly speeds up development and improves maintainability." },
        { type: "heading", level: 3, text: "The Utility-First Approach" },
        { type: "paragraph", text: "Instead of writing custom CSS for every element, Tailwind provides low-level utility classes that you can compose directly in your markup. For example, to style a button, you might use: `<button class='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>Click me</button>`." },
        { type: "heading", level: 3, text: "Responsiveness Made Easy" },
        { type: "paragraph", text: "Tailwind's responsive design features are incredibly intuitive. Prefixes like `sm:`, `md:`, `lg:`, and `xl:` allow you to apply styles conditionally based on screen size, making responsive design a breeze." },
        { type: "code", text: "<div class='flex flex-col md:flex-row'>...</div>" },
        { type: "paragraph", text: "This class makes the div a column layout on small screens and a row layout on medium screens and up. This declarative approach saves immense time and effort." },
        { type: "paragraph", text: "Embracing Tailwind CSS can dramatically improve your development speed and the consistency of your design system." }
      ]
    },
    {
      slug: "a-beginners-guide-to-gsap-animations",
      title: "A Beginner's Guide to GSAP Animations",
      date: "April 01, 2025",
      author: "Your Name Here",
      readTime: "6 min read",
      featuredImage: "/mock/blog-gsap.jpg",
      imageAlt: "GSAP logo with animation timeline",
      tags: ["Animation", "GSAP", "JavaScript"],
      excerpt: "Get started with GSAP (GreenSock Animation Platform) and bring your web projects to life with powerful, high-performance animations.",
      content: [
        { type: "paragraph", text: "Animations can elevate a user experience from good to great. GSAP (GreenSock Animation Platform) is a robust JavaScript library that allows you to create highly performant and flexible animations across the web." },
        { type: "heading", level: 3, text: "Why GSAP?" },
        { type: "paragraph", text: "GSAP is renowned for its cross-browser compatibility, blazing-fast performance, and extensive feature set. Whether you're animating simple elements or complex SVG paths, GSAP offers precise control over every aspect of your animation." },
        { type: "heading", level: 3, text: "Basic Tweening" },
        { type: "code", text: "import gsap from 'gsap';\n\ngsap.to('.my-box', { x: 100, duration: 1, ease: 'power2.out' });" },
        { type: "paragraph", text: "This simple line of code animates an element with the class `my-box` 100 pixels to the right over 1 second with a smooth easing function. GSAP's chaining capabilities and timelines allow for complex sequence creation." },
        { type: "paragraph", text: "Dive into GSAP, and you'll discover a world of possibilities for adding dynamic and engaging motion to your websites." }
      ]
    }
  ];
  
  export default mockBlogPosts;