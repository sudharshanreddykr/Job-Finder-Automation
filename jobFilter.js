// Filter jobs by date (past N days)
function filterJobsByDate(jobs, daysBack = 7) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysBack);

  // Filter jobs - keep those without dates, filter those with dates
  return jobs.filter((job) => {
    if (!job.date) return true; // Include jobs without explicit dates
    return new Date(job.date) >= cutoffDate;
  });
}

// Filter jobs by keywords
function filterJobsByKeywords(jobs, keywords) {
  if (!keywords || keywords.length === 0) {
    return jobs;
  }

  return jobs.filter((job) => {
    const jobText = `${job.role} ${job.company}`.toLowerCase();
    return keywords.some((keyword) => jobText.includes(keyword.toLowerCase()));
  });
}

export { filterJobsByKeywords, filterJobsByDate };
