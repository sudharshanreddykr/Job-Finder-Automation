import parseResume from "./resumeParser.js";

async function generateKeywords() {
  const skills = await parseResume();

  const keywords = skills.map((skill) => `${skill} developer bangalore`);

  return keywords;
}

export default generateKeywords;
