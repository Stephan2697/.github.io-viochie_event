const { validationResult } = require('express-validator');
const transporter = require('../config/email');
const ContactSubmission = require('../models/contactSubmission');
const fs = require('fs');
const path = require('path');

// Handle contact form submission
exports.submitContact = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Clean up uploaded file if validation fails
      if (req.file) {
        fs.unlink(req.file.path, (err) => {
          if (err) console.error('Failed to delete file:', err);
        });
      }
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, subject, message } = req.body;
    
    // Prepare file data if file was uploaded
    let fileData = null;
    if (req.file) {
      fileData = {
        filename: req.file.filename,
        path: req.file.path,
        mimeType: req.file.mimetype,
        size: req.file.size
      };
    }

    // Save submission to database
    const submission = new ContactSubmission({
      name: name.trim(),
      email: email.trim(),
      subject: (subject || '').trim(),
      message: message.trim(),
      file: fileData,
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    const savedSubmission = await submission.save();
    console.log('Contact submission saved to database:', savedSubmission._id);

    // Prepare file attachment info for emails
    let fileAttachmentHtml = '';
    let attachments = [];
    
    if (req.file) {
      fileAttachmentHtml = `
        <p><strong>Attachment:</strong> ${req.file.originalname} (${(req.file.size / 1024).toFixed(2)} KB)</p>
      `;
      attachments.push({
        filename: req.file.originalname,
        path: req.file.path
      });
    }

    // Email to admin
    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: `New Contact Form Submission: ${subject || 'No Subject'}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Submission ID:</strong> ${savedSubmission._id}</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
        <h3>Message:</h3>
        <p>${message.replace(/\n/g, '<br>')}</p>
        ${fileAttachmentHtml}
        <hr>
        <p><strong>Submitted at:</strong> ${new Date().toLocaleString()}</p>
        <p><em>This email was sent from the Viochie Events website contact form.</em></p>
      `,
      attachments: attachments
    };

    // Confirmation email to user
    const userMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'We Received Your Message - Viochie Events',
      html: `
        <h2>Thank You for Contacting Viochie Events!</h2>
        <p>Dear ${name},</p>
        <p>We have received your message and will get back to you as soon as possible.</p>
        <p><strong>Reference ID:</strong> ${savedSubmission._id}</p>
        <h3>Your Message Summary:</h3>
        <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p>Best regards,<br/>
        <strong>Viochie Events Team</strong></p>
      `
    };

    // Send emails
    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(userMailOptions)
    ]);

    res.status(200).json({
      success: true,
      message: 'Your message has been sent successfully! We will contact you soon.',
      submissionId: savedSubmission._id
    });

  } catch (error) {
    console.error('Error processing contact submission:', error);
    
    // Clean up uploaded file on error
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Failed to delete file:', err);
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to process your submission. Please try again later.'
    });
  }
};

// Get contact info (for display on frontend if needed)
exports.getContactInfo = (req, res) => {
  const contactInfo = {
    address: '123 Event Street, City, State 10001',
    phone: '(555) 123-4567',
    email: 'info@viochieevents.com'
  };
  res.status(200).json(contactInfo);
};
