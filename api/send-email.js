import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Name, email, and message are required." });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email address." });
  }

  try {
    await resend.emails.send({
      from: "La-MORKS <noreply@la-morks.com>",
      to: ["info@la-morks.com"],
      reply_to: email,
      subject: `New Contact Message from ${escapeHtml(name)}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e0e0e0;border-radius:8px;overflow:hidden;">
          <div style="background:#1A3A6B;padding:20px 30px;">
            <h2 style="color:#fff;margin:0;font-size:20px;">New Contact Form Submission</h2>
          </div>
          <div style="padding:30px;background:#fff;">
            <table style="width:100%;border-collapse:collapse;">
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;width:100px;color:#888;font-size:14px;">Name</td>
                <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-size:14px;color:#222;">${escapeHtml(name)}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#888;font-size:14px;">Email</td>
                <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-size:14px;color:#222;">${escapeHtml(email)}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;color:#888;font-size:14px;vertical-align:top;">Message</td>
                <td style="padding:10px 0;font-size:14px;color:#222;white-space:pre-line;">${escapeHtml(message)}</td>
              </tr>
            </table>
          </div>
          <div style="background:#f7f7f7;padding:14px 30px;font-size:12px;color:#aaa;">
            Sent via La-MORKS contact form · Reply directly to respond to ${escapeHtml(name)}
          </div>
        </div>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: "Failed to send email. Please try again later." });
  }
}
