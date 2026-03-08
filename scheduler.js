import { schedule } from "node-cron";

import linkedin from "./scrapers/linkedin.js";
import instahyre from "./scrapers/instahyre.js";
import wellfound from "./scrapers/wellfound.js";
import naukri from "./scrapers/naukri.js";
import glassdoor from "./scrapers/glassdoor.js";

import sendEmail from "./emailSender.js";

async function runJobFinder() {
  const results = await Promise.all([
    linkedin(),
    wellfound(),
    naukri(),
    glassdoor(),
  ]);

  const jobs = results.flat().slice(0, 50);

  await sendEmail(jobs);
}

runJobFinder();

schedule("0 9 * * *", () => {
  runJobFinder();
});
