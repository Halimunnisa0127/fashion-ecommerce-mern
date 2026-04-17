// utils/mail.js - Professional with separate HTML files
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

class EmailService {
  constructor() {
    this.transporter = null;
    this.templates = {};
    this.loadTemplates();
    this.initializeTransporter();
  }

  loadTemplates() {
    try {
      const templatePath = path.join(__dirname, "emailTemplates", "passwordReset.html");
      this.templates.passwordReset = fs.readFileSync(templatePath, "utf8");
      console.log(" Email templates loaded");
    } catch (error) {
      console.error(" Failed to load templates:", error.message);
    }
  }

  initializeTransporter() {
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      this.transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
        pool: true,
        maxConnections: 5,
        maxMessages: 100,
        rateLimit: 5,
      });
      
      this.transporter.verify((error, success) => {
        if (error) {
          console.error("Email service error:", error.message);
          this.transporter = null;
        } else {
          console.log(" Email service ready from:", process.env.EMAIL_USER);
        }
      });
    } else {
      console.log(" No email credentials. Using console mode.");
    }
  }

  // Compile template with variables
  compileTemplate(template, data) {
    let html = template;
    
    // Replace all {{variable}} with actual values
    Object.keys(data).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      html = html.replace(regex, this.escapeHtml(String(data[key])));
    });
    
    // Handle conditional blocks (simple implementation)
    html = html.replace(/\{{#if (\w+)\}}([\s\S]*?)\{{\/if}}/g, (match, condition, content) => {
      return data[condition] ? content : '';
    });
    
    return html;
  }

  async sendOTP(email, otp, username = "") {
    // Always log to console
    this.logOTPToConsole(email, otp);

    // Prepare template data
    const templateData = {
      otp: otp,
      username: username || "",
      year: new Date().getFullYear(),
      appName: process.env.APP_NAME || "Fashion Store"
    };

    // Generate HTML from template
    const htmlTemplate = this.compileTemplate(this.templates.passwordReset, templateData);
    const plainText = this.getPlainTextTemplate(otp, username);

    // Send real email if configured
    if (this.transporter) {
      try {
        const info = await this.transporter.sendMail({
          from: `"${process.env.APP_NAME || 'Fashion Store'}" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: " Password Reset OTP",
          text: plainText,
          html: htmlTemplate,
        });
        
        console.log(` Email sent to ${email}`);
        return { success: true, messageId: info.messageId };
        
      } catch (error) {
        console.error(" Email failed:", error.message);
        return { success: false, fallback: true };
      }
    }
    
    return { success: true, fallback: true };
  }

  getPlainTextTemplate(otp, username = "") {
    return `
═══════════════════════════════════════
         PASSWORD RESET OTP
═══════════════════════════════════════

${username ? `Hello ${username},` : 'Hello,'}

We received a request to reset your password.

Your verification code is: ${otp}

⏰ This code will expire in 5 minutes.

⚠️ Never share this code with anyone.

If you didn't request this, please ignore this email.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${process.env.APP_NAME || 'Fashion Store'} - Automated Message
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `;
  }

  logOTPToConsole(email, otp) {
    console.log("\n" + "═".repeat(70));
    console.log("🔐 PASSWORD RESET REQUEST");
    console.log("═".repeat(70));
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 OTP: ${otp}`);
    console.log(`⏰ Expires: 5 minutes`);
    console.log(`🕐 Time: ${new Date().toLocaleString()}`);
    console.log("═".repeat(70) + "\n");
  }

  escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}

// Singleton instance
const emailService = new EmailService();

const sendEmail = async (to, text) => {
  const otpMatch = text.match(/\d{6}/);
  const otp = otpMatch ? otpMatch[0] : "000000";
  return await emailService.sendOTP(to, otp);
};

module.exports = sendEmail;
module.exports.EmailService = EmailService;