import "dotenv/config";
import { createTransport } from "nodemailer";

async function sendEmail(jobs) {
  const transporter = createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  let table = `
  <div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:20px">
    
    <h2 style="color:#2c3e50;">🚀 Daily Bangalore Full-Stack Jobs</h2>
    
    <table style="
      border-collapse: collapse;
      width:100%;
      background:white;
      border-radius:8px;
      overflow:hidden;
      box-shadow:0 4px 10px rgba(0,0,0,0.1);
    ">
    
    <thead style="background:#4f46e5;color:white">
      <tr>
        <th style="padding:12px">S.No</th>
        <th style="padding:12px">Company</th>
        <th style="padding:12px">Role</th>
        <th style="padding:12px">Location</th>
        <th style="padding:12px">Apply</th>
      </tr>
    </thead>

    <tbody>
  `;

  jobs.forEach((job, index) => {
    table += `
      <tr style="text-align:center;border-bottom:1px solid #eee">
        <td style="padding:12px">${index + 1}</td>
        <td style="padding:12px;font-weight:600;color:#34495e">${job.company}</td>
        <td style="padding:12px">${job.role}</td>
        <td style="padding:12px;color:#6b7280">${job.location}</td>
        <td style="padding:12px">
          <a href="${job.link}" 
             style="
             background:#10b981;
             color:white;
             padding:8px 14px;
             text-decoration:none;
             border-radius:6px;
             font-weight:bold;
             ">
             Apply
          </a>
        </td>
      </tr>
    `;
  });

  table += `
    </tbody>
    </table>

    <p style="margin-top:20px;color:#6b7280;font-size:14px">
      🤖 This email was generated automatically by your Job Finder Bot.
    </p>

  </div>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_TO,
    subject: "🚀 Daily Bangalore Full Stack Jobs",
    html: table,
  });

  console.log("Email sent successfully");
}

export default sendEmail;
