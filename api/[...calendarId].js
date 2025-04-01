const windowsToIana = {
  "Dateline Standard Time": "Etc/GMT+12",
  "UTC-11": "Etc/GMT+11",
  "Hawaiian Standard Time": "Pacific/Honolulu",
  "Alaskan Standard Time": "America/Anchorage",
  "Pacific Standard Time": "America/Los_Angeles",
  "Mountain Standard Time": "America/Denver",
  "Central Standard Time": "America/Chicago",
  "Eastern Standard Time": "America/New_York",
  "Atlantic Standard Time": "America/Halifax",
  "Newfoundland Standard Time": "America/St_Johns",
  "Argentina Standard Time": "America/Argentina/Buenos_Aires",
  UTC: "Etc/UTC",
  "GMT Standard Time": "Europe/London",
  "W. Europe Standard Time": "Europe/Berlin",
  "Romance Standard Time": "Europe/Paris",
  "Central European Standard Time": "Europe/Budapest",
  "E. Europe Standard Time": "Europe/Bucharest",
  "South Africa Standard Time": "Africa/Johannesburg",
  "Israel Standard Time": "Asia/Jerusalem",
  "Arab Standard Time": "Asia/Riyadh",
  "Russian Standard Time": "Europe/Moscow",
  "Turkey Standard Time": "Europe/Istanbul",
  "Arabian Standard Time": "Asia/Dubai",
  "India Standard Time": "Asia/Kolkata",
  "Bangladesh Standard Time": "Asia/Dhaka",
  "SE Asia Standard Time": "Asia/Bangkok",
  "China Standard Time": "Asia/Shanghai",
  "Tokyo Standard Time": "Asia/Tokyo",
  "Korea Standard Time": "Asia/Seoul",
  "AUS Eastern Standard Time": "Australia/Sydney",
  "New Zealand Standard Time": "Pacific/Auckland",
};

export default async function handler(req, res) {
  console.log("Request hit with calendarId:", req.query.calendarId);
  const { calendarId } = req.query;
  const calendarKey = Array.isArray(calendarId)
    ? calendarId.join("/")
    : calendarId;

  try {
    const externalUrl = `https://outlook.office365.com/owa/calendar/${encodeURIComponent(
      calendarKey
    )}.ics`;
    const fetchRes = await fetch(externalUrl);
    if (!fetchRes.ok) {
      throw new Error(`Failed to fetch calendar data for ID "${calendarKey}"`);
    }
    let icsData = await fetchRes.text();

    for (const [winTz, ianaTz] of Object.entries(windowsToIana)) {
      const regex = new RegExp(`TZID:${winTz}`, "g");
      icsData = icsData.replace(regex, `TZID:${ianaTz}`);
    }

    res.setHeader("Content-Type", "text/calendar; charset=utf-8");
    res.setHeader("Content-Disposition", 'attachment; filename="calendar.ics"');
    res.status(200).send(icsData);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating calendar");
  }
}
