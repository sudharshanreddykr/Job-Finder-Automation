import axios from "axios";

async function fetchJobs() {
  const jobs = [];

  const keywords = [
    "nodejs developer bangalore",
    "react developer bangalore",
    "full stack developer node react bangalore",
  ];

  for (const keyword of keywords) {
    const url = `https://www.indeed.com/jobs?q=${encodeURIComponent(keyword)}&l=Bangalore`;

    try {
      const { data } = await axios.get(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      });

      const matches = data.match(/jobTitle":"(.*?)"/g) || [];

      matches.slice(0, 15).forEach((m, i) => {
        const title = m.replace('jobTitle":"', "").replace('"', "");

        jobs.push({
          company: "Various",
          role: title,
          location: "Bangalore",
          link: url,
        });
      });
    } catch (err) {
      console.log("Error fetching jobs", err.message);
    }
  }

  return jobs.slice(0, 50);
}

export default fetchJobs;
