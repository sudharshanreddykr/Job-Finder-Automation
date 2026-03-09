import axios from "axios";

async function matchJobsWithOllama(jobs, resumeContent) {
  const matchedJobs = [];

  for (const job of jobs) {
    try {
      const score = await scoreJobWithOllama(job, resumeContent);

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

  return matchedJobs.sort((a, b) => b.relevanceScore - a.relevanceScore);
}

async function scoreJobWithOllama(job, resumeContent) {
  const skillsText = resumeContent.skills.slice(0, 20).join(", ");

  const prompt = `You are a recruiter. Score how well this job matches the candidate's skills from 0 to 1.

Candidate Skills: ${skillsText}

Job Title: ${job.role}
Company: ${job.company}

Respond with ONLY a decimal number between 0 and 1 (example: 0.75)
`;

  const response = await axios.post("http://localhost:11434/api/generate", {
    model: "mistral",
    prompt: prompt,
    stream: false,
  });

  const responseText = response.data.response.trim();

  const score = parseFloat(responseText);

  if (isNaN(score)) {
    return 0.5;
  }

  return Math.min(1, Math.max(0, score));
}

export { matchJobsWithOllama };

//brew install ollama
//curl -fsSL https://ollama.com/install.sh | sh
//ollama serve
//ollama pull llama3
//ollama run llama3
//http://localhost:11434
// how to stop ollama server: ollama stop
//how to stop llama3 model: ollama stop llama3

//how to start ollama server: ollama serve
//how to start llama3 model: ollama run llama3

//curl -X POST http://localhost:11434/api/generate -H "Content-Type: application/json" -d '{"model":"mistral","prompt":"What is 2+2?","stream":false}
