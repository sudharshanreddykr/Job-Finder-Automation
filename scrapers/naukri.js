import axios from "axios";
import { load } from "cheerio";
import generateKeywords from "../keywordGenerator.js";

async function naukriJobs() {
  const keywords = await generateKeywords();
  const keyword = keywords[0]; // Get the first generated keyword
  const url = `https://www.naukri.com/${encodeURIComponent(keyword)}-jobs-in-bangalore`;

  try {
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    const $ = load(data);

    const jobs = [];

    $(".jobTuple").each((i, el) => {
      const role = $(el).find(".title").text().trim();
      const company = $(el).find(".companyInfo").text().trim();
      const link = $(el).find(".title").attr("href");

      jobs.push({
        company,
        role,
        location: "Bangalore",
        source: "Naukri",
        link,
      });
    });

    return jobs;
  } catch (err) {
    console.log("Error fetching jobs from Naukri", err.status || err.message);
    return [];
  }
}

export default naukriJobs;
