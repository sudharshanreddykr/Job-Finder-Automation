import axios from "axios";

/**
 * Job matching using Groq AI (Free tier - 100 requests/day)
 */
async function matchJobsWithGroq(jobs, resumeContent, groqApiKey) {
  if (!groqApiKey) {
    console.warn(
      "GROQ_API_KEY not found in environment variables. Skipping AI matching.",
    );
    return jobs; // Return unranked jobs
  }

  const matchedJobs = [];

  for (const job of jobs) {
    try {
      const score = await scoreJobWithGroq(job, resumeContent, groqApiKey);
      matchedJobs.push({
        ...job,
        relevanceScore: score,
      });
    } catch (error) {
      console.error(`Error matching job: ${error.message}`);
      matchedJobs.push({
        ...job,
        relevanceScore: 0.5,
      });
    }
  }

  // Sort by relevance score (highest first)
  return matchedJobs.sort((a, b) => b.relevanceScore - a.relevanceScore);
}

async function scoreJobWithGroq(job, resumeContent, groqApiKey) {
  const skillsText = resumeContent.skills.slice(0, 20).join(", ");

  const prompt = `You are a recruiter. Score how well this job matches the candidate's skills (0-1).
  
Candidate Skills: ${skillsText}
Job Title: ${job.role}
Company: ${job.company}

Respond with ONLY a single decimal number between 0 and 1 (e.g., 0.75).`;

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 10,
        temperature: 0.3,
      },
      {
        headers: {
          Authorization: `Bearer ${groqApiKey}`,
          "Content-Type": "application/json",
        },
      },
    );

    const responseText = response.data.choices[0].message.content.trim();
    const score = parseFloat(responseText);

    if (isNaN(score)) {
      console.warn(`Invalid score from Groq: ${responseText}`);
      return 0.5;
    }

    return Math.min(1, Math.max(0, score));
  } catch (error) {
    console.error("Groq API error:", error.response?.data || error.message);
    throw error;
  }
}

export { matchJobsWithGroq };
