# 📧 Multiple Recipients & Gmail Organization Setup

## 🎯 Adding Multiple Email Recipients

### Single Recipient (Default)

```env
EMAIL_RECIPIENTS=sudharshanreddykr@gmail.com|Sudharshan Reddy K R
```

### Multiple Recipients

```env
EMAIL_RECIPIENTS=user1@gmail.com|John Doe,user2@gmail.com|Jane Smith,user3@gmail.com|Alex Johnson
```

**Format:** `email|Name,email|Name,email|Name`

### Examples

**2 Recipients:**

```env
EMAIL_RECIPIENTS=john@example.com|John,jane@example.com|Jane
```

**3+ Recipients:**

```env
EMAIL_RECIPIENTS=dev1@company.com|Alice Dev,dev2@company.com|Bob Dev,pm@company.com|Project Manager
```

## 📁 Setting Up Gmail Labels/Folders

Gmail doesn't have traditional folders, but uses **Labels** instead. Here's how to auto-organize job finder emails:

### Method 1: Gmail Filters (Automatic, No Code Needed)

1. Go to Gmail → **Settings** ⚙️
2. Click **Filters and Blocked Addresses**
3. Click **Create a new filter**
4. In the "From" field, type: `sudharshanreddykr@gmail.com`
5. In the "Subject" field, type: `Jobs for You`
6. Click **Create filter**
7. Check ✅ **Apply label** and select or create: `Job Opportunities`
8. Check ✅ **Skip the Inbox** (optional - archives the email)
9. Click **Create filter**

### Result:

- All job finder emails will automatically get the label "Job Opportunities"
- Emails won't clutter your main inbox
- Easy to find and review all job emails in one place

### Method 2: Multiple Labels by Recipient

Create different labels for different recipients:

```
1. Create filter:
   - From: sudharshanreddykr@gmail.com
   - Subject: contains "Jobs for You"
   - Apply label: "Jobs - Archive"
   - Skip inbox: ✓

2. Create filter for replies/follow-ups:
   - From: @example.com
   - Apply label: "Job Applications"
```

## 🚀 Advanced: Gmail API Integration (Optional)

For programmatic label management, you can integrate Gmail API:

### Setup (Advanced - Not Required)

```bash
npm install googleapis google-auth-library
```

### Usage

```javascript
// In emailSender.js, after sending:
await labelEmailInGmail(email.id, "Job-Opportunities");
```

**Note:** This requires OAuth2 authentication setup - only recommended if you want automatic labeling beyond Gmail filters.

## 📝 Configuration Template

Here's a complete example setup:

```env
# Email Configuration
EMAIL_USER=sudharshan@company.com
EMAIL_PASS=app_specific_password_here

# Multiple Recipients
EMAIL_RECIPIENTS=sudharshan@company.com|Sudharshan,john@company.com|John,recruiter@company.com|Recruiter

# Job Settings
JOB_TYPE=Full-Stack
RELEVANCE_THRESHOLD=0.5
MAX_JOBS=200

# Gmail Label (for reference - set up filter manually)
GMAIL_LABEL=Job-Opportunities

# AI Configuration
GROQ_API_KEY=your_groq_api_key_here
```

## ✅ Verification

After setting up multiple recipients:

1. Check the logs:

   ```bash
   pm2 logs job-finder | grep "Email sent to"
   ```

2. You should see:

   ```
   📧 Email sent to 3 recipients: user1@gmail.com, user2@gmail.com, user3@gmail.com
   ```

3. Check Gmail:
   - All recipients receive the email
   - Email appears in the "Job Opportunities" label (if filter is set up)

## 🔧 Troubleshooting

### Issue: Multiple recipients not working

- **Check:** `.env` file format is correct (comma-separated with pipe)
- **Check:** No spaces around email addresses
- **Verify:** Run `node -e "console.log(process.env.EMAIL_RECIPIENTS)"`

### Issue: Emails going to spam

- **Add Gmail filter:** From my own email, always mark as important
- **Check:** Email is not being flagged by Gmail's security

### Issue: Gmail filter not working

- **Check:** Filter criteria matches the email exactly
- **Try:** Create multiple filters with OR conditions
- **Verify:** Label exists and is spelled correctly

## 📊 Example Output

With 3 recipients configured:

```
📧 Email sent to 3 recipients: john@example.com, jane@example.com, alex@example.com
```

Each recipient gets:

- Personalized greeting with their name
- Same job listings
- Same match percentages
- Professional HTML email

## 🎓 Best Practices

1. **Keep recipient list updated** - Remove inactive emails
2. **Use descriptive names** - Makes emails more professional
3. **Test before adding** - Send one test email to verify format
4. **Archive old emails** - Use Gmail filters to auto-archive
5. **Create multiple filters** - For different job types/teams

## 📞 Support

For issues with:

- **Email delivery:** Check SMTP credentials in `.env`
- **Gmail filters:** Visit https://support.google.com/mail/answer/6579
- **Multiple recipients:** Verify `.env` syntax above
