import axios from "axios";
import { load } from "cheerio";
import generateKeywords from "../keywordGenerator.js";

async function glassdoorJobs() {
  const keywords = await generateKeywords();
  const keyword = keywords[0];
  const url = `https://www.glassdoor.co.in/Job-Search/Results/${encodeURIComponent(keyword)}-jobs-SRCH_IL.0,9_IC2940587.htm?fromage=7`;

  try {
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        Referer: "https://www.glassdoor.co.in/",
      },
      timeout: 15000,
    });

    const $ = load(data);
    const jobs = [];

    // Try multiple selectors
    const selectors = [
      '[data-test="job-card-base"]',
      "[class*='JobCard']",
      "[class*='jobCard']",
      "li[data-job-id]",
      ".jobCardContainer",
    ];

    for (const selector of selectors) {
      const elements = $(selector);
      if (elements.length > 0) {
        elements.each((i, el) => {
          try {
            // Try different selectors
            let role =
              $(el).find('[data-test="job-title"]').text().trim() ||
              $(el).find("[class*='JobTitle']").text().trim() ||
              $(el).find("a[data-test*='job']").text().trim() ||
              $(el).find("a").first().text().trim() ||
              "";

            let company =
              $(el).find('[data-test="employer-name"]').text().trim() ||
              $(el).find("[class*='EmployerName']").text().trim() ||
              $(el).find("[class*='companyName']").text().trim() ||
              "";

            let link =
              $(el).find('a[href*="glassdoor"]').attr("href") ||
              $(el).find("a").attr("href") ||
              "";

            if (role && company) {
              if (!link.startsWith("http")) {
                link = "https://www.glassdoor.co.in" + link;
              }
              jobs.push({
                role,
                company,
                location: "Bangalore",
                source: "Glassdoor",
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

    console.log(`Glassdoor: Found ${jobs.length} jobs`);
    return jobs;
  } catch (err) {
    console.log(
      "Error fetching jobs from Glassdoor:",
      err.message.substring(0, 100),
    );
    return [];
  }
}

export default glassdoorJobs;
