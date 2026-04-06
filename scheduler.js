import { schedule } from "node-cron";

import linkedin from "./scrapers/linkedin.js";
import naukriJobs from "./scrapers/naukri.js";

import sendEmail from "./emailSender.js";
import parseResume from "./resumeParser.js";
import { matchJobsWithOllama } from "./llamaModel.js";
import { filterJobsByDate } from "./jobFilter.js";

async function runJobFinder() {
  // Get skills from resume
  const resumeSkills = await parseResume();

  const resumeContent = {
    skills: resumeSkills,
    summary:
      "Full-Stack Developer with expertise in MERN stack and cloud services",
  };

  // Scrape jobs from multiple sources
  // LinkedIn: ✅ Working (60 jobs/day)
  // Note: Naukri, Glassdoor - attempted various approaches but blocked by JS rendering requirements or bot detection
  const results = await Promise.all([
    linkedin().catch((e) => {
      console.warn("❌ LinkedIn scraping failed:", e.message);
      return [];
    }),
    naukriJobs().catch((e) => {
      console.warn("❌ Naukri scraping failed:", e.message);
      return [];
    }),
  ]);

  const allJobs = results.flat().slice(0, process.env.MAX_JOBS || 200);

  console.log(`📊 Scraped ${allJobs.length} jobs total`, allJobs);

  try {
    // Use Groq AI to match and rank jobs
    console.log("🤖 Using Groq AI to match jobs with your skills...");
    // let matchedJobs = await matchJobsWithGroq(
    //   allJobs,
    //   resumeContent,
    //   process.env.GROQ_API_KEY,
    // );
    let matchedJobs = await matchJobsWithOllama(
      allJobs,
      resumeContent,
      process.env.GROQ_API_KEY,
    );

    // Filter by relevance threshold
    const threshold = parseFloat(process.env.RELEVANCE_THRESHOLD || "0.6");
    const filteredJobs = matchedJobs.filter(
      (job) => job.relevanceScore >= threshold,
    );

    console.log(
      `✅ Found ${filteredJobs.length} relevant jobs (score >= ${threshold})`,
    );

    // Filter by date (past 7 days if available)
    const recentJobs = filterJobsByDate(
      filteredJobs,
      process.env.DAYS_BACK || 7,
    );

    // Send email with matched jobs
    if (recentJobs.length > 0) {
      await sendEmail(recentJobs);
    } else {
      console.log(
        "No recent jobs found matching your criteria in the past 7 days",
      );
    }
  } catch (error) {
    console.error("Error in job matching:", error.message);
    // Fallback: send unranked jobs if AI fails
    console.log("⚠️ AI matching failed, sending unranked jobs...");
    await sendEmail(allJobs.slice(0, 50));
  }
}

// Run immediately on startup
runJobFinder();

// Schedule to run daily at 9 AM
schedule("0 9 * * *", () => {
  console.log("⏰ Running scheduled job finder at 9 AM...");
  runJobFinder();
});
