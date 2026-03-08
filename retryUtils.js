// Retry utility with exponential backoff
async function retryWithBackoff(
  fn,
  maxRetries = 12,
  retryIntervalMs = 600000, // 10 minutes
) {
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`[Attempt ${attempt}/${maxRetries}] Executing task...`);
      return await fn();
    } catch (error) {
      lastError = error;
      console.error(
        `[Attempt ${attempt}/${maxRetries}] Failed: ${error.message}`,
      );

      // If this is the last attempt, don't wait
      if (attempt < maxRetries) {
        console.log(
          `Retrying in 10 minutes (at ${new Date(Date.now() + retryIntervalMs).toLocaleString()})...`,
        );
        await new Promise((resolve) => setTimeout(resolve, retryIntervalMs));
      }
    }
  }

  // All retries exhausted
  throw new Error(
    `Task failed after ${maxRetries} attempts. Last error: ${lastError.message}`,
  );
}

export { retryWithBackoff };
