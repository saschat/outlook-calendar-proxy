module.exports = {
  async rewrites() {
    return [
      {
        // Match any path ending in ".ics"
        source: "/:calendarId*.ics",
        destination: "/api/calendar/:calendarId*", // Route to our catch-all API
      },
    ];
  },
};
