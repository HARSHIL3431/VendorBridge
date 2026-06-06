import nodemailer from 'nodemailer';

interface EmailData {
  to: string;
  invoiceNumber: string;
  pdfBuffer: Buffer;
}

export async function sendInvoiceEmail(data: EmailData): Promise<void> {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    // Allow self-signed certs in development
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_USER || 'noreply@vendorbridge.com',
    to: data.to,
    subject: `Invoice ${data.invoiceNumber} — VendorBridge`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a2557;">VendorBridge Invoice</h2>
        <p>Dear Vendor,</p>
        <p>Please find attached the invoice <strong>${data.invoiceNumber}</strong> from VendorBridge.</p>
        <p>If you have any questions, please contact our procurement team.</p>
        <br/>
        <p style="color: #666;">Best regards,<br/>VendorBridge Procurement Team</p>
      </div>
    `,
    attachments: [
      {
        filename: `invoice-${data.invoiceNumber}.pdf`,
        content: data.pdfBuffer,
        contentType: 'application/pdf',
      },
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error: any) {
    console.error('Email sending failed:', error.message);
    // Don't throw - email failure shouldn't break the API
    // The response still indicates success as per API contract
    console.warn('Email could not be sent. Check SMTP configuration.');
  }
}
