import axios from "axios";
import { load } from "cheerio";
import generateKeywords from "../keywordGenerator.js";

async function glassdoorJobs() {
  const keywords = await generateKeywords();
  const keyword = keywords[0]; // Get the first generated keyword
  const url = `https://www.glassdoor.co.in/Job/${encodeURIComponent(keyword)}-jobs-SRCH_IL.0,9_IC2940587_KO10,27.htm`;

  try {
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    const $ = load(data);

    const jobs = [];

    $(".react-job-listing").each((i, el) => {
      const role = $(el).find("a.jobLink").text().trim();

      jobs.push({
        company: "Glassdoor Listing",
        role,
        location: "Bangalore",
        source: "Glassdoor",
        link: "https://glassdoor.co.in",
      });
    });

    return jobs;
  } catch (err) {
    console.log(
      "Error fetching jobs from Glassdoor",
      err.status || err.message,
    );
    return [];
  }
}

export default glassdoorJobs;
