import { NextResponse } from "next/server";
import nodemailer from "nodemailer"; // ✅ Add this line
import UserModel from "../../../../mongodbConnect";
import { getWithdrawalConfirmationTemplate } from "../../../../lib/emailTemplates";

export async function POST(request) {
  const {
    email,
    withdrawMethod,
    withdrawalAccount,
    amount,
    transactionStatus,
  } = await request.json();

  const lowerEmail = email.toLowerCase();
  const id = crypto.randomUUID();

  try {
    // Find user
    const user = await UserModel.findOne({ email: lowerEmail });

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" });
    }

    // Validate withdrawal amount
    const withdrawalAmount = parseFloat(amount);
    if (isNaN(withdrawalAmount) || withdrawalAmount <= 0) {
      return NextResponse.json({
        success: false,
        message: "Invalid withdrawal amount. Please enter a valid amount.",
      });
    }

    // Check minimum withdrawal amount
    if (withdrawalAmount < 10) {
      return NextResponse.json({
        success: false,
        message: "Minimum withdrawal amount is $10.",
      });
    }

    // Validate withdrawal account type
    if (
      !withdrawalAccount ||
      !["mainAccount", "profit", "totalWon"].includes(withdrawalAccount)
    ) {
      return NextResponse.json({
        success: false,
        message:
          "Invalid withdrawal account type. Please select a valid account.",
      });
    }

    // Check if user has sufficient balance based on withdrawal account type
    let userBalance = 0;
    let balanceType = "";

    if (withdrawalAccount === "mainAccount") {
      userBalance = parseFloat(user.tradingBalance || 0);
      balanceType = "trading balance";
    } else if (withdrawalAccount === "profit") {
      userBalance = parseFloat(user.planBonus || 0);
      balanceType = "profit balance";
    } else if (withdrawalAccount === "totalWon") {
      userBalance = parseFloat(user.totalWon || 0);
      balanceType = "total won balance";
    } else {
      return NextResponse.json({
        success: false,
        message: "Invalid withdrawal account type.",
      });
    }

    if (userBalance < withdrawalAmount) {
      return NextResponse.json({
        success: false,
        message: `Insufficient ${balanceType} for withdrawal. Available: $${userBalance.toFixed(
          2
        )}, Required: $${withdrawalAmount.toFixed(2)}.`,
      });
    }

    // Get current date
    const currentDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Create withdrawal entry (no fee - goes directly to pending)
    const withdrawalEntry = {
      id,
      dateAdded: currentDate,
      withdrawMethod,
      withdrawalAccount,
      amount: withdrawalAmount,
      transactionStatus: "pending",
      balanceType: balanceType,
      availableBalance: userBalance,
    };

    // Push and save
    user.withdrawalHistory.push(withdrawalEntry);
    await user.save();

    // ✅ Nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email: withdrawal request received, being processed
    const emailHtml = getWithdrawalConfirmationTemplate(
      withdrawalAmount,
      withdrawMethod,
      balanceType,
      id,
      user.name,
      "pending"
    );
    const mailOptions = {
      from: "UniversalFX Group <support@universalfxgroup.com>",
      to: email,
      subject: "Withdrawal Request Received - UniversalFX Group",
      html: emailHtml,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent:", info.response);
    } catch (emailError) {
      console.error("Error sending email:", emailError);
      // Don't block response even if email fails
    }

    return NextResponse.json({
      success: true,
      message: user.withdrawalHistory,
      id,
      date: currentDate,
    });
  } catch (error) {
    console.error("Withdrawal error:", error);
    return NextResponse.json({
      success: false,
      message: "An error occurred: " + error.message,
    });
  }
}
