import axios from "axios";
import { load } from "cheerio";
import generateKeywords from "../keywordGenerator.js";

async function naukriJobs() {
  const keywords = await generateKeywords();
  const keyword = keywords[0];
  const url = `https://www.naukri.com/${encodeURIComponent(keyword)}-jobs-in-bangalore`;

  try {
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        Referer: "https://www.naukri.com/",
      },
      timeout: 15000,
    });

    const $ = load(data);
    const jobs = [];

    // Try multiple selectors for robustness
    const selectors = [
      '[data-automation="jobCard"]',
      "article.jobCard",
      ".srp-jobtuple-wrapper",
      ".styles_jobTuple__wrapper__VIzj4",
      "[class*='jobCard']",
    ];

    for (const selector of selectors) {
      const elements = $(selector);
      if (elements.length > 0) {
        elements.each((i, el) => {
          try {
            // Try different selectors for job details
            let role =
              $(el).find('[data-automation="jobTitle"]').text().trim() ||
              $(el).find(".jobTitle").text().trim() ||
              $(el).find("a[href*='/job-listings']").first().text().trim() ||
              "";

            let company =
              $(el).find('[data-automation="companyName"]').text().trim() ||
              $(el).find(".companyName").text().trim() ||
              $(el).find("[class*='company']").text().trim() ||
              "";

            let link =
              $(el).find('a[href*="/job-listings"]').attr("href") ||
              $(el).find("a").attr("href") ||
              "";

            if (role && company) {
              if (!link.startsWith("http")) {
                link = "https://www.naukri.com" + link;
              }
              jobs.push({
                role,
                company,
                location: "Bangalore",
                source: "Naukri",
                link,
              });
            }
          } catch (_error) {
            // Skip malformed cards
          }
        });

        if (jobs.length > 0) break;
      }
    }

    console.log(`Naukri: Found ${jobs.length} jobs`);
    return jobs;
  } catch (err) {
    console.log(
      "Error fetching jobs from Naukri:",
      err.message.substring(0, 100),
    );
    return [];
  }
}

export default naukriJobs;
