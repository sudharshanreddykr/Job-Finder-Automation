# Job Finder Automation

An automated job scraper that searches for developer jobs across multiple platforms and sends daily email summaries.

## Overview

This application scrapes job listings from various job portals and sends you an email with matching jobs based on your skills. It runs on a schedule using PM2 process manager.

**Supported Job Portals:**

- LinkedIn
- Naukri
- Wellfound (AngelList)
- Glassdoor
- Instahyre

## Prerequisites

- **Node.js**: v18+ (tested with v20.15.1)
- **npm**: Latest version
- **PM2**: Global installation (`npm install -g pm2`)

## Configuration

### Environment Variables

Create a `.env` file in the project root directory with the following variables:

```env
# Email Configuration
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-app-password
EMAIL_TO=recipient@example.com

# Optional: Configure skills for job search
# SKILLS=react,nodejs,typescript
```

**Gmail Setup:**

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password at https://myaccount.google.com/apppasswords
3. Use the generated 16-character password as `EMAIL_PASS`

### Skills Configuration

Edit `resumeParser.js` to define the skills you want to search for:

```javascript
const skills = [
  "react",
  "node",
  "express",
  "nextjs",
  "typescript",
  "postgresql",
  "mongodb",
];
```

### Job Search Keywords

Keywords are automatically generated from your skills by appending "developer bangalore". To modify locations, edit the scraper files in the `scrapers/` directory.

## Installation

1. **Clone or navigate to the project directory:**

```bash
cd job-finder-automation
```

2. **Install dependencies:**

```bash
npm install
```

3. **Create `.env` file:**

```bash
cp .env.example .env
# Edit .env with your email credentials
nano .env
```

4. **Verify installation:**

```bash
npm list
```

## Usage with PM2

### Start the Application

**First time startup:**

```bash
pm2 start scheduler.js --name job-find
```

**Options:**

- `--name job-find` - Names the process for easy reference
- `--cron "0 9 * * *"` - Optional: Run at 9 AM daily (already set in code)
- `--watch` - Auto-restart on file changes (development only)

**Example with logging:**

```bash
pm2 start scheduler.js --name job-find --log "logs/job-find.log"
```

### View Logs

**Real-time logs:**

```bash
pm2 logs 0          # View process 0 (default)
pm2 logs job-find   # View by name
pm2 logs            # View all processes
```

**Last 15 lines:**

```bash
pm2 logs 0 --lines 15
```

**Separate logs (recommended):**

```bash
# Standard output
tail -f ~/.pm2/logs/job-find-out.log

# Error output
tail -f ~/.pm2/logs/job-find-error.log
```

### Restart the Application

**Standard restart:**

```bash
pm2 restart 0
```

**Force restart (clears module cache):**

```bash
pm2 restart 0 --force
```

**Restart all processes:**

```bash
pm2 restart all
```

### Stop the Application

```bash
pm2 stop 0
pm2 stop job-find
pm2 stop all
```

### Delete the Application

**Remove from PM2:**

```bash
pm2 delete 0
pm2 delete job-find
```

**Completely remove and clear:**

```bash
pm2 delete 0 && pm2 save
```

## PM2 Commands Reference

| Command                  | Description                  |
| ------------------------ | ---------------------------- |
| `pm2 start <file>`       | Start a new process          |
| `pm2 restart <id\|name>` | Restart a process            |
| `pm2 stop <id\|name>`    | Stop a running process       |
| `pm2 delete <id\|name>`  | Remove a process             |
| `pm2 list`               | Show all running processes   |
| `pm2 logs <id\|name>`    | View process logs            |
| `pm2 save`               | Save current process list    |
| `pm2 startup`            | Enable PM2 on system startup |
| `pm2 resurrect`          | Restore saved process list   |

## Process Management

### View All Processes

```bash
pm2 list
pm2 monit          # Real-time monitoring
```

### Save Current State

```bash
pm2 save
```

This saves the current process list so PM2 can restore it after system restart.

### Auto-start on System Boot

```bash
pm2 startup
# Follow the instructions printed to the console

# Then save your processes
pm2 save
```

## Troubleshooting

### Process won't start

1. **Check logs:**

```bash
pm2 logs 0
pm2 logs 0 --lines 50
```

2. **Verify dependencies:**

```bash
npm install
```

3. **Check Node version:**

```bash
node --version  # Should be v18+
```

4. **Force clean restart:**

```bash
pm2 delete all
pm2 install
npm install
pm2 start scheduler.js --name job-find
```

### Email not sending

1. **Verify `.env` file exists** and has correct credentials
2. **Check Gmail App Password** - Should be 16 characters with spaces removed
3. **View error logs:**

```bash
tail -f ~/.pm2/logs/job-find-error.log
```

### Scraper not finding jobs

- Some websites may block scraping due to Cloudflare protection
- Email will still send, but may contain fewer results
- Try updating User-Agent headers in scraper files if blocking increases

## Project Structure

```
job-finder-automation/
├── scheduler.js              # Main entry point (runs on schedule)
├── scraper.js               # Generic job scraper
├── emailSender.js           # Email sending logic
├── keywordGenerator.js      # Generates search keywords from skills
├── resumeParser.js          # Returns skills list
├── package.json             # Dependencies
├── .env                     # Environment variables (create this)
└── scrapers/               # Site-specific scrapers
    ├── linkedin.js
    ├── naukri.js
    ├── wellfound.js
    ├── glassdoor.js
    └── instahyre.js
```

## Schedule

The application runs daily at **9 AM** (can be modified in `scheduler.js`):

```javascript
schedule("0 9 * * *", () => {
  runJobFinder();
});
```

**Cron Format:** `minute hour day month day-of-week`

## Features

- ✅ Scrapes multiple job portals simultaneously
- ✅ Filters results based on your skills
- ✅ Sends formatted HTML email with job listings
- ✅ Runs on a daily schedule
- ✅ Graceful error handling (skips failed scrapers)
- ✅ PM2 process management and auto-restart

## Development

### Running manually (not on schedule):

```bash
node scheduler.js
```

### Watch mode (auto-restart on changes):

```bash
pm2 start scheduler.js --name job-find --watch
```

### Debug mode:

```bash
node --inspect scheduler.js
```

Then open `chrome://inspect` in Chrome.

## License

ISC

## Support

For issues or improvements, check the logs and verify all environment variables are correctly set.
