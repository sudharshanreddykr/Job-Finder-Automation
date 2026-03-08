module.exports = {
  apps: [
    {
      name: "resume-parser",
      script: "index.js",
      watch: true,
      instances: 1,
      autorestart: true,
    },
  ],
};
