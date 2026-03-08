# Setup Groq AI Job Matcher

This automation uses **Groq** (free tier) to intelligently match jobs with your resume and skills.

## 🚀 Quick Setup (2 minutes)

### Step 1: Get Your Free Groq API Key

1. Go to https://console.groq.com
2. Sign up with your email (free account)
3. Go to **API Keys** section (left sidebar)
4. Click **Create API Key**
5. Copy the key (starts with `gsk_`)

### Step 2: Update .env File

Edit `.env` in your project folder and replace `gsk_xxxxx` with your actual key:

```env
GROQ_API_KEY=gsk_your_actual_key_here
RELEVANCE_THRESHOLD=0.6
```

### Step 3: Restart the Job Finder

```bash
pm2 restart job-finder
```

That's it! 🎉

---

## 📊 How It Works

1. **Scrapes jobs** from LinkedIn, Naukri, Instahyre, Glassdoor, and Wellfound
2. **Extracts your skills** from resumeParser.js
3. **Uses Groq AI** to score each job (0-1 scale) based on:
   - How many of your skills match the job
   - Job title relevance
   - Company match
4. **Filters jobs** with score ≥ 0.6 (configurable)
5. **Sends daily email at 9 AM** with ranked jobs

---

## ⚙️ Configuration

Edit these in `.env` to customize:

```env
# Relevance threshold (0.0 to 1.0)
# Only jobs scoring above this are included
RELEVANCE_THRESHOLD=0.6

# Max jobs to scrape (higher = more time but more options)
MAX_JOBS=100

# Email time (cron format: "0 9 * * *" = 9 AM daily)
# Leave scheduler.js schedule("0 9 * * *") as is
```

### Adjust Job Relevance:

- **0.5** = More liberal (includes borderline matches)
- **0.6** = Balanced (recommended)
- **0.7** = Strict (only highly relevant)
- **0.8** = Very strict (only perfect matches)

---

## 💰 Cost

**Groq Free Tier:**

- 100 API requests per day
- Perfect for this use case (you need ~50/day)
- **Zero cost** ✅

---

## 📝 Files in This Setup

- `scheduler.js` - Main orchestrator with Groq integration
- `groqMatcher.js` - Groq AI job matching logic
- `resumeParser.js` - Your resume skills
- `jobFilter.js` - Date filtering
- `emailSender.js` - Email formatting and sending
- `retryUtils.js` - Retry logic on failures

---

## 🔍 Monitoring

Check job finder status and logs:

```bash
# See if it's running
pm2 status

# View real-time logs
pm2 logs job-finder

# View last 50 lines
pm2 logs job-finder --lines 50
```

---

## ⚠️ Troubleshooting

### "GROQ_API_KEY not found"

- Check `.env` file has the correct key
- Restart: `pm2 restart job-finder`
- Check logs: `pm2 logs job-finder`

### "No jobs found"

- Lower `RELEVANCE_THRESHOLD` to 0.5
- Check if job sites are blocking scraping
- Verify Groq API is working: Check logs for API errors

### No email received

- Check spam folder
- Verify `EMAIL_TO` in `.env` is correct
- Check email credentials
- View logs: `pm2 logs job-finder`

---

## 🎯 Next Steps

1. Add your Groq API key to `.env`
2. Run: `pm2 restart job-finder`
3. Wait for 9 AM (or the next scheduled time)
4. Check your email!

The system will:

- ✅ Run your automation daily at 9 AM
- ✅ Auto-restart on crashes (every 10 mins, max 12 times)
- ✅ Auto-restart on system reboot
- ✅ Score jobs intelligently using AI
- ✅ Email you only the best matches

Enjoy! 🚀
