import "dotenv/config";
import { createTransport } from "nodemailer";
import { retryWithBackoff } from "./retryUtils.js";

function parseRecipients() {
  const recipientString = process.env.EMAIL_RECIPIENTS || process.env.EMAIL_TO;
  if (!recipientString) return [];

  return recipientString.split(",").map((entry) => {
    const [email, name] = entry.trim().split("|");
    return {
      email: email.trim(),
      name: (name || "Developer").trim(),
    };
  });
}

async function sendEmail(jobs, recipientConfig = {}) {
  const recipients = recipientConfig.recipients || parseRecipients();

  const transporter = createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const avgScore =
    jobs.length > 0
      ? Math.round(
          (jobs.reduce((sum, j) => sum + (j.relevanceScore || 0), 0) /
            jobs.length) *
            100,
        )
      : 0;

  const bestMatch =
    jobs.length > 0
      ? Math.round(Math.max(...jobs.map((j) => j.relevanceScore || 0)) * 100)
      : 0;

  const excellentJobs = jobs.filter((j) => j.relevanceScore >= 0.8).length;

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const getMatchInfo = (score) => {
    if (score >= 0.8)
      return {
        label: "Excellent",
        color: "#10B981",
        bg: "#ECFDF5",
        text: "#059669",
      };

    if (score >= 0.6)
      return {
        label: "Good",
        color: "#F59E0B",
        bg: "#FFFBEB",
        text: "#D97706",
      };

    return {
      label: "Fair",
      color: "#F43F5E",
      bg: "#FFF1F2",
      text: "#E11D48",
    };
  };

  const jobCard = (job, index) => {
    const score = Math.round((job.relevanceScore || 0) * 100);
    const match = getMatchInfo(job.relevanceScore || 0);

    return `
    
    <div class="job-col" style="
      display:inline-block;
      width:100%;
      max-width:320px;
      padding:6px;
      box-sizing:border-box;
      vertical-align:top;
    ">

      <table width="100%" cellpadding="0" cellspacing="0"
      style="
      border-radius:14px;
      border:1px solid #E2E8F0;
      background:#FFFFFF;
      box-shadow:0 6px 18px rgba(15,23,42,0.08);
      overflow:hidden;
      ">

        <tr>
          <td style="height:4px;background:${match.color};"></td>
        </tr>

        <tr>
        <td style="padding:16px">

        <table width="100%">
        <tr>

        <td style="
        font-size:10px;
        font-weight:700;
        color:#94A3B8;
        font-family:monospace;">
        #${String(index + 1).padStart(2, "0")}
        </td>

        <td align="right">

        <span style="
        background:${match.bg};
        color:${match.text};
        padding:4px 9px;
        border-radius:20px;
        font-size:10px;
        font-weight:700;">
        ${match.label}
        </span>

        </td>
        </tr>
        </table>


        <p style="
        margin:10px 0 4px;
        font-size:15px;
        font-weight:800;
        color:#0F172A;">
        ${job.role}
        </p>


        <p style="
        margin:0 0 10px;
        font-size:12px;
        font-weight:600;
        color:#3B82F6;">
        ${job.company}
        </p>



        <div style="margin-bottom:10px">

        <span style="
        background:#EEF2FF;
        color:#4F46E5;
        padding:4px 9px;
        border-radius:20px;
        font-size:10px;
        font-weight:600;">
        📍 ${job.location}
        </span>

        <span style="
        background:#EFF6FF;
        color:#1D4ED8;
        padding:4px 9px;
        border-radius:20px;
        font-size:10px;
        font-weight:600;
        margin-left:4px;">
        🔗 ${job.source || "Direct"}
        </span>

        </div>


        <div style="margin-bottom:10px">

        <table width="100%">
        <tr>

        <td style="
        font-size:10px;
        color:#94A3B8;
        font-weight:600;">
        Match Score
        </td>

        <td align="right"
        style="
        font-size:11px;
        font-weight:800;
        color:${match.text};">
        ${score}%
        </td>

        </tr>
        </table>


        <div style="
        height:7px;
        background:#E2E8F0;
        border-radius:20px;
        overflow:hidden;
        margin-top:4px;">

        <div style="
        width:${score}%;
        background:${match.color};
        height:7px;">
        </div>

        </div>

        </div>


        <div style="text-align:right">

        <a href="${job.link}"
        style="
        background:#2563EB;
        color:white;
        padding:9px 18px;
        border-radius:8px;
        font-size:12px;
        font-weight:700;
        text-decoration:none;
        box-shadow:0 3px 10px rgba(37,99,235,0.35);
        display:inline-block;">
        Apply Now →
        </a>

        </div>

        </td>
        </tr>

      </table>

    </div>
    
    `;
  };

  const jobGrid = jobs.map((job, i) => jobCard(job, i)).join("");

  const buildHtml = (name) => `
<!DOCTYPE html>
<html>

<head>

<meta name="viewport" content="width=device-width, initial-scale=1">

<style>

body{
margin:0;
background:#0D1321;
font-family:-apple-system,BlinkMacSystemFont,'Segoe UI';
}

.container{
max-width:700px;
margin:auto;
background:white;
border-radius:14px;
overflow:hidden;
box-shadow:0 25px 70px rgba(0,0,0,0.5);
}

.header{
padding:34px;
text-align:center;
background:linear-gradient(135deg,#0F172A,#1E293B);
color:white;
}

.stats{
display:flex;
justify-content:space-between;
margin-top:20px;
}

.stat{
flex:1;
text-align:center;
}

.stat-num{
font-size:32px;
font-weight:900;
}

.jobs{
padding:22px;
font-size:0;
}

@media (max-width:640px){

.job-col{
display:block !important;
max-width:100% !important;
width:100% !important;
padding:0 !important;
margin-bottom:12px;
}

}

</style>

</head>


<body>

<div class="container">

<div class="header">

<p style="color:#94A3B8;font-size:11px">
Daily Job Digest • ${today}
</p>

<h1 style="margin:8px 0 4px;font-size:28px">
Hello ${name} 👋
</h1>

<p style="color:#CBD5F5">
We found <b>${jobs.length}</b> jobs matching your profile
</p>


 <!-- Stats row with dividers -->
                  <table role="presentation" cellpadding="0" cellspacing="0" width="100%"
                    style="background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08);
                      border-radius:14px; overflow:hidden;">
                    <tr>
                      <td width="33%" align="center" style="padding:18px 10px;">
                        <p class="stat-num" style="margin:0; font-size:28px; font-weight:900;
                          color:#60A5FA; line-height:1;
                          font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
                          ${jobs.length}
                        </p>
                        <p class="stat-lbl" style="margin:6px 0 0; font-size:10px; font-weight:600;
                          color:#475569; text-transform:uppercase; letter-spacing:1.2px;
                          font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
                          Jobs Found
                        </p>
                      </td>
                      <td width="1" style="background:rgba(255,255,255,0.08); width:1px;">&nbsp;</td>
                      <td width="33%" align="center" style="padding:18px 10px;">
                        <p class="stat-num" style="margin:0; font-size:28px; font-weight:900;
                          color:#34D399; line-height:1;
                          font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
                          ${avgScore}%
                        </p>
                        <p class="stat-lbl" style="margin:6px 0 0; font-size:10px; font-weight:600;
                          color:#475569; text-transform:uppercase; letter-spacing:1.2px;
                          font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
                          Avg Match
                        </p>
                      </td>
                      <td width="1" style="background:rgba(255,255,255,0.08); width:1px;">&nbsp;</td>
                      <td width="33%" align="center" style="padding:18px 10px;">
                        <p class="stat-num" style="margin:0; font-size:28px; font-weight:900;
                          color:#FBBF24; line-height:1;
                          font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
                          ${excellentJobs}
                        </p>
                        <p class="stat-lbl" style="margin:6px 0 0; font-size:10px; font-weight:600;
                          color:#475569; text-transform:uppercase; letter-spacing:1.2px;
                          font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
                          Excellent Fits
                        </p>
                      </td>
                    </tr>
                  </table>

</div>


<div class="jobs">

<h3 style="margin-bottom:18px;font-size:16px">
🚀 Top Opportunities For You
</h3>

${jobGrid}

</div>

</div>

</body>

</html>
`;

  for (const recipient of recipients) {
    await retryWithBackoff(async () => {
      await transporter
        .sendMail({
          from: `"Job Finder 🤖" <${process.env.EMAIL_USER}>`,
          to: `"${recipient.name}" <${recipient.email}>`,
          subject: `🎯 ${jobs.length} Jobs Found — Best Match ${bestMatch}%`,
          html: buildHtml(recipient.name),
        })
        .then(() => {
          console.log(`📧 Sent to ${recipient.name}.....`);
        });
    });
    console.log(`📧 Sent to ${recipient.name}`);
  }
}

export default sendEmail;
