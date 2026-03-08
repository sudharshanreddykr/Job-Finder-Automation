import axios from "axios";
import { load } from "cheerio";
import generateKeywords from "../keywordGenerator.js";

async function wellfoundJobs() {
  const keywords = await generateKeywords();
  const keyword = keywords[0]; // Get the first generated keyword
  const url = `https://wellfound.com/jobs?query=${encodeURIComponent(keyword)}&location=${encodeURIComponent("bengaluru")}`;

  try {
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    const $ = load(data);

    const jobs = [];

    $("a.job-link").each((i, el) => {
      const role = $(el).text().trim();

      jobs.push({
        company: "Startup",
        role,
        location: "Bangalore",
        source: "Wellfound",
        link: "https://wellfound.com" + $(el).attr("href"),
      });
    });

    return jobs;
  } catch (err) {
    console.log(
      "Error fetching jobs from Wellfound",
      err.status || err.message,
    );
    return [];
  }
}

export default wellfoundJobs;
