// src/app/api/contact/route.js
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const formData = await request.json();
    const { name, email, contact, service, message, budget } = formData;

    // --- Basic Server-Side Validation ---
    if (!name || !email || !service || !message || message.length < 20) {
      return NextResponse.json(
        { message: 'Required fields (Name, Email, Service, Message) are missing or message is too short (min 20 characters).' },
        { status: 400 } // Bad Request
      );
    }

    // --- 1. Send Inquiry Email to You (the owner) ---
    const { data: ownerEmailData, error: ownerEmailError } = await resend.emails.send({
      from: process.env.EMAIL_FROM, // Your verified sender (e.g., "Shreyansh Portfolio <onboarding@resend.dev>")
      to: process.env.EMAIL_TO,     // Your email where you want to receive inquiries
      subject: `New Project Inquiry from ${name} - Shreyansh Portfolio`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #fcfcfc;">
          <h2 style="color: #e50914; border-bottom: 2px solid #e50914; padding-bottom: 10px; margin-bottom: 20px;">New Contact Form Submission!</h2>
          <p style="margin-bottom: 15px;">You've received a new inquiry from your portfolio website. Here are the details:</p>
          
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 0.95em;">
            <tr><td style="padding: 10px; border: 1px solid #eee; background-color: #f9f9f9; font-weight: bold; width: 30%;">Name:</td><td style="padding: 10px; border: 1px solid #eee;">${name}</td></tr>
            <tr><td style="padding: 10px; border: 1px solid #eee; background-color: #f9f9f9; font-weight: bold;">Email:</td><td style="padding: 10px; border: 1px solid #eee;"><a href="mailto:${email}" style="color: #e50914; text-decoration: none;">${email}</a></td></tr>
            <tr><td style="padding: 10px; border: 1px solid #eee; background-color: #f9f9f9; font-weight: bold;">Contact No:</td><td style="padding: 10px; border: 1px solid #eee;">${contact || 'N/A'}</td></tr>
            <tr><td style="padding: 10px; border: 1px solid #eee; background-color: #f9f9f9; font-weight: bold;">Service:</td><td style="padding: 10px; border: 1px solid #eee;">${service}</td></tr>
            <tr><td style="padding: 10px; border: 1px solid #eee; background-color: #f9f9f9; font-weight: bold;">Budget:</td><td style="padding: 10px; border: 1px solid #eee;">${budget ? `$${budget}` : 'N/A'}</td></tr>
          </table>

          <div style="background-color: #e6f7ff; padding: 15px; border-left: 4px solid #e50914; border-radius: 4px; margin-bottom: 20px;">
            <p style="margin-top: 0; font-weight: bold; color: #e50914;">Message:</p>
            <p style="margin-bottom: 0; white-space: pre-wrap;">${message}</p>
          </div>
          
          <p style="margin-top: 25px; font-size: 0.9em; color: #777; text-align: center;">
            This email was sent from your portfolio contact form on ${new Date().toLocaleDateString('en-IN')} at ${new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' })} IST.
          </p>
        </div>
      `,
      reply_to: email, // So you can easily reply to the user
    });

    if (ownerEmailError) {
      console.error('Resend Owner Email Error:', ownerEmailError);
    }

    // --- 2. Send Thank You Email to the User (sender of the form) ---
    const { data: userEmailData, error: userEmailError } = await resend.emails.send({
      from: process.env.EMAIL_FROM, // Your verified sender
      to: email,                     // The user's email address
      subject: `Thank You for Your Inquiry, ${name}!`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #fcfcfc;">
          <h2 style="color: #e50914; border-bottom: 2px solid #e50914; padding-bottom: 10px; margin-bottom: 20px;">Your Message Has Been Received!</h2>
          <p>Hi ${name},</p>
          <p>Thank you for reaching out through my portfolio website!</p>
          <p>I've received your message and will review your inquiry about <strong>${service}</strong>. I aim to respond to all messages within 24-48 business hours.</p>
          <br/>
          <p>Here's a summary of the message you sent:</p>
          <div style="background-color: #f0f0f0; padding: 15px; border-left: 4px solid #e50914; border-radius: 4px; margin-bottom: 20px;">
            <p style="margin-top: 0; font-weight: bold; color: #e50914;">Your Message:</p>
            <p style="margin-bottom: 0; white-space: pre-wrap;">${message}</p>
          </div>
          
          <p>In the meantime, feel free to explore more of my work:</p>
          <p style="text-align: center; margin-top: 20px;">
            <a href="https://yourportfolio.com" style="display: inline-block; padding: 10px 20px; background-color: #e50914; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold;">Visit My Portfolio</a>
          </p>

          <p style="margin-top: 25px; font-size: 0.8em; color: #777; text-align: center;">
            This is an automated confirmation. Please do not reply to this email directly.
          </p>
          <p style="font-size: 0.8em; color: #777; text-align: center;">
            Best regards,<br/>
            <strong>Shreyansh Gupta</strong>
          </p>
        </div>
      `,
    });

    if (userEmailError) {
      console.error('Resend User Thank You Email Error:', userEmailError);
      // This is a critical error for the user experience.
      // While your email might have sent, the user didn't get confirmation.
      return NextResponse.json(
        { message: 'Message sent, but failed to send confirmation email. Please check your spam.' },
        { status: 500 } // Indicate an issue to the client
      );
    }

    console.log(`Contact form submitted by ${name}. Inquiry sent to owner, confirmation sent to user.`);
    return NextResponse.json({ message: 'Message sent successfully!' }, { status: 200 });

  } catch (error) {
    console.error('API Error processing contact form:', error);
    return NextResponse.json(
      { message: 'Internal Server Error. Please try again later.' },
      { status: 500 }
    );
  }
}