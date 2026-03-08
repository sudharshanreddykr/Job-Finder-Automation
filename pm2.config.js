// PM2 Startup Command (Safe - only deletes if job-finder exists):
// pm2 list | grep -q "job-finder" && pm2 delete job-finder || echo "No job-finder process found"; pm2 start pm2.config.js && sudo env PATH=$PATH:/Users/sudharshanreddykr/.nvm/versions/node/v20.15.1/bin /Users/sudharshanreddykr/.nvm/versions/node/v20.15.1/lib/node_modules/pm2/bin/pm2 startup launchd -u sudharshanreddykr --hp /Users/sudharshanreddykr && pm2 save

module.exports = {
  apps: [
    {
      name: "job-finder",
      script: "scheduler.js",
      watch: true,
      instances: 1,
      autorestart: true,
      max_restarts: 10,
      min_uptime: "10s",
      error_file: "./logs/error.log",
      out_file: "./logs/output.log",
    },
  ],
};

//
