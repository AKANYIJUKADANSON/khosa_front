import { useMemo } from "react"

export const SplitTime = (timeStri) => {
  return useMemo(() => {
    if (!timeStri) return "Please provide the time to split";

    // Normalise lowercase and add space before am or pm if missing
    const cleanedTime = timeStri.trim().toLowerCase().replace(/([ap]m)$/i, ' $1');
    // get a regular explation that captures the h: (1 - 12), m: (00 - 49) and p: (am / pm)
    const match_time = cleanedTime.match(/^(\d{1,2}):(\d{2})\s*(am|pm)$/i);
    if (! match_time) return "No match found";

    const [, h, m, p] = match_time;
    const hour = Number(h);
    const minute = Number(m);
    const period = p.toLowerCase();

    // validation
    if (hour < 1 || hour > 12 || minute > 59) return "The time values provided are not in valid time range";

    return {hour, minute, period};
  }, [timeStri]);
}
