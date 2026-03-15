import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import { getIDVerificationTemplate } from "../../../../lib/emailTemplates";
import UserModel from "../../../../mongodbConnect";

export async function POST(request) {
  const { formData, frontIDSecureUrl, backIDSecureUrl, email, idType } =
    await request.json();

  try {
    // Update user - documents submitted, under review
    await UserModel.updateOne(
      { email: email.toLowerCase() },
      { isVerified: false }
    );

    // Create a Nodemailer transporter using the correct SMTP settings for Hostinger
    const transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com", // Use Hostinger's S.MTP host
      port: 465, // Port for secure SSL connection
      secure: true, // Use SSL
      auth: {
        user: process.env.EMAIL_USER, // Your email user
        pass: process.env.EMAIL_PASS, // Your email password
      },
    });

    // Email content (ID verification only, no fee block)
    const emailContent = getIDVerificationTemplate(
      formData,
      frontIDSecureUrl,
      backIDSecureUrl,
      email,
      idType
    );

    // Email options
    const mailOptions = {
      from: "support@universalfxgroup.com", // Replace with your email
      to: "support@universalfxgroup.com", // Replace with recipient email
      subject: "ID Verification Request - UniversalFX Group",
      html: emailContent,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log(frontIDSecureUrl, backIDSecureUrl); // Debugging output
    return NextResponse.json(
      { message: "Email sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { message: "An error occurred while sending email" },
      { status: 500 }
    );
  }
}
