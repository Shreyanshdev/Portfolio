// src/app/api/newsletter/route.js
import { NextResponse } from 'next/server';
import { Resend } from 'resend'; // Import Resend SDK
// import { connectToDatabase } from '@/lib/mongodb'; // Uncomment if using MongoDB

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email address.' },
        { status: 400 }
      );
    }

    // --- Database Integration Placeholder (Optional but Recommended) ---
    // In a real application, you'd save this email to a database
    // before sending a welcome email to prevent sending to duplicates or
    // to manage your subscriber list.
    /*
    const { db } = await connectToDatabase();
    const collection = db.collection('newsletter_subscribers');
    const existingSubscriber = await collection.findOne({ email });

    if (existingSubscriber) {
      return NextResponse.json(
        { message: 'You are already subscribed!' },
        { status: 409 } // Conflict
      );
    }

    await collection.insertOne({ email, subscribedAt: new Date() });
    */

    // --- Send a Welcome Email to the Subscriber (or a notification to yourself) ---
    // Option 1: Send a "Welcome" email to the subscriber
    const { data: welcomeEmailData, error: welcomeEmailError } = await resend.emails.send({
      from: process.env.EMAIL_FROM, // Your verified sender email/domain
      to: email,                   // The subscriber's email address
      subject: 'Welcome to Shreyansh Dev Updates! 🎉',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #e50914; border-bottom: 2px solid #e50914; padding-bottom: 10px; margin-bottom: 20px;">Thanks for Subscribing!</h2>
          <p>Hi there,</p>
          <p>Thank you for subscribing to my newsletter! You'll now receive updates on my latest projects, articles, and insights directly in your inbox.</p>
          <p>Stay tuned for exciting content!</p>
          <br/>
          <p>Best regards,</p>
          <p><strong>Shreyansh Gupta</strong></p>
          <p style="font-size: 0.8em; color: #777;">
            <a href="https://yourportfolio.com" style="color: #e50914;">Visit My Portfolio</a>
            | <a href="https://x.com/Shreyans_hg" style="color: #e50914;">Twitter</a>
            | <a href="https://www.linkedin.com/in/shreyansh-gupta-680025276" style="color: #e50914;">LinkedIn</a>
          </p>
          <p style="margin-top: 25px; font-size: 0.8em; color: #999; text-align: center;">
            You received this email because you subscribed to the newsletter on Shreyansh's portfolio.
          </p>
        </div>
      `,
    });

    if (welcomeEmailError) {
      console.error('Resend Welcome Email Error:', welcomeEmailError);
      // You might still want to return 200 if the subscription was saved (if using DB)
      // but if the email failed to send, it's an issue.
      // For now, if the email fails, we'll indicate an error to the client.
      return NextResponse.json(
        { message: 'Subscription successful, but failed to send welcome email.' },
        { status: 500 }
      );
    }

    // Option 2: Send a notification email to YOURSELF (in addition to or instead of welcome email)
    // const { data: notificationData, error: notificationError } = await resend.emails.send({
    //   from: process.env.EMAIL_FROM, // Your verified sender email/domain
    //   to: process.env.EMAIL_TO,     // Your own email address
    //   subject: `New Newsletter Subscriber: ${email}`,
    //   html: `<p>A new user has subscribed to your newsletter: <strong>${email}</strong></p>`,
    // });

    // if (notificationError) {
    //   console.error('Resend Notification Email Error:', notificationError);
    //   // Decide how critical this is. You might still return 200 to the user.
    // }

    console.log(`Newsletter subscription: ${email} received. Welcome email sent.`);
    return NextResponse.json({ message: 'Subscribed successfully!' }, { status: 200 });

  } catch (error) {
    console.error('API Error subscribing to newsletter:', error);
    return NextResponse.json(
      { message: 'Failed to subscribe. Please try again later.' },
      { status: 500 }
    );
  }
}