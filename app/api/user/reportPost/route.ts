import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// takes a json with user_Id and postId and sends email with this info to tmureportapp@protonmail.com, returns message on success
export async function POST(request: Request) {
  try {
    // Parse the JSON body from the request
    const body = await request.json();
    const { user_Id, post_Id } = body;

    // Validate required fields
    if (!user_Id || !post_Id) {
      return NextResponse.json(
        { error: 'User ID and Post ID are required.' },
        { status: 400 }
      );
    }

    // Configure the Mailgun SMTP transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.mailgun.org',
      port: 587,
      secure: false, // Use STARTTLS
      auth: {
        user: 'postmaster@sandbox03795f7a4b41416a97b4d2054a809640.mailgun.org', // Replace with your Mailgun SMTP login
        pass: '6c678ab0f3ff15d9f96f568b61ac139d-c02fd0ba-0d7f48b1', // Replace with your Mailgun SMTP password
      },
    });

    // Define the email options
    const mailOptions = {
      from: '"TMU Report App" <postmaster@sandbox03795f7a4b41416a97b4d2054a809640.mailgun.org>', // Sender address
      to: 'tmureportapp@protonmail.com', // Receiver address
      subject: `New Report Submitted: Post ID ${post_Id}`,
      text: `A new report has been submitted:\n\nPost ID: ${post_Id}\nReported By: ${user_Id}`,
      html: `
        <p>A new report has been submitted:</p>
        <ul>
          <li><strong>Post ID:</strong> ${post_Id}</li>
          <li><strong>Reported By:</strong> ${user_Id}</li>
        </ul>
      `,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);

    // Log the response for debugging
    console.log('Email sent:', info.response);

    return NextResponse.json(
      { message: 'Report email sent successfully.' },
      { status: 200 }
    );
  } catch (err) {
    console.error('Error sending email:', err);
    return NextResponse.json(
      { error: 'Failed to send report email.' },
      { status: 500 }
    );
  }
}