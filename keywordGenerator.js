import parseResume from "./resumeParser.js";

async function generateKeywords() {
  const skills = await parseResume();

  // Multiple city variations for better search coverage
  const cityVariations = [
    "bangalore",
    "bengaluru",
    "banglore",
    "blr",
    "bangalore india",
  ];

  const keywords = [];
  skills.forEach((skill) => {
    cityVariations.forEach((city) => {
      keywords.push(`${skill} ${city}`);
    });
  });

  return keywords;
}

export default generateKeywords;
