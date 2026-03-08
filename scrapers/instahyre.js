// Instahyre job scraper
import axios from "axios";
import { load } from "cheerio";
import generateKeywords from "../keywordGenerator.js";

async function instahyreJobs() {
  const keywords = await generateKeywords();
  const keyword = keywords[0]; // Get the first generated keyword
  const url = `https://www.instahyre.com/jobs?search=${encodeURIComponent(keyword)}&location=${encodeURIComponent("Bangalore")}`;

  try {
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    const $ = load(data);

    const jobs = [];

    $(".job-card").each((i, el) => {
      const role = $(el).find(".job-title").text().trim();
      const company = $(el).find(".company-name").text().trim();
      const link = "https://www.instahyre.com" + $(el).find("a").attr("href");

      jobs.push({
        company,
        role,
        location: "Bangalore",
        source: "Instahyre",
        link,
      });
    });

    return jobs;
  } catch (err) {
    console.log(
      "Error fetching jobs from Instahyre",
      err.status || err.message,
    );
    return [];
  }
}

export default instahyreJobs;
