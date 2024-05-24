// server.js

const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

const app = express();
const PORT = 4000; // Or any other port you prefer

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// POST endpoint to handle form submissions
app.post("/submit-form", async (req, res) => {
  const formData = req.body;

  try {
    await sendEmail(formData);
    res.status(200).send("Form submitted successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Error submitting form");
  }
});

// Function to send email
async function sendEmail(formData) {
  const transporter = nodemailer.createTransport({
    // Configuration for your email service (e.g., Gmail, Outlook, etc.)
    service: "Gmail",
    auth: {
      user: "akhshadgorle@gmail.com",
      pass: "your_email_password",
    },
  });

  const mailOptions = {
    from: "akhshadgorle@gmail.com",
    to: "recipient_email@example.com",
    subject: "New Form Submission",
    text: `
      Name: ${formData.firstname} ${formData.lastname}
      Email: ${formData.email}
      Message: ${formData.message}
    `,
  };

  // Send email
  await transporter.sendMail(mailOptions);
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
