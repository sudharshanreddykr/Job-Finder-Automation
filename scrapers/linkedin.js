import axios from "axios";
import { load } from "cheerio";
import generateKeywords from "../keywordGenerator.js";

async function linkedinJobs() {
  const keywords = await generateKeywords();
  const keyword = keywords[0]; // Get the first generated keyword
  const url = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(keyword)}&location=Bengaluru`;

  try {
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    const $ = load(data);

    const jobs = [];

    $(".base-card").each((i, el) => {
      const title = $(el).find(".base-search-card__title").text().trim();
      const company = $(el).find(".base-search-card__subtitle").text().trim();
      const link = $(el).find("a").attr("href");

      if (title)
        jobs.push({
          company,
          role: title,
          location: "Bangalore",
          source: "LinkedIn",
          link,
        });
    });

    return jobs;
  } catch (err) {
    console.log("Error fetching jobs from LinkedIn", err.status || err.message);
    return [];
  }
}

export default linkedinJobs;
