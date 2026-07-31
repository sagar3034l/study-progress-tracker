export const studiedData = [
  { date: "Jun 27", hours: 0 },
  { date: "Jun 28", hours: 0 },
  { date: "Jun 29", hours: 1.5 },
  { date: "Jun 30", hours: 2 },
  { date: "Jul 01", hours: 0 },
  { date: "Jul 02", hours: 3 },
  { date: "Jul 03", hours: 1 },
  { date: "Jul 04", hours: 2.5 },
  { date: "Jul 05", hours: 0 },
  { date: "Jul 06", hours: 4 },
  { date: "Jul 07", hours: 2 },
  { date: "Jul 08", hours: 1.5 },
  { date: "Jul 09", hours: 3.5 },
  { date: "Jul 10", hours: 0 },
  { date: "Jul 11", hours: 2.5 },
  { date: "Jul 12", hours: 5 },
  { date: "Jul 13", hours: 1 },
  { date: "Jul 14", hours: 2 },
  { date: "Jul 15", hours: 0 },
  { date: "Jul 16", hours: 3 },
  { date: "Jul 17", hours: 2 },
  { date: "Jul 18", hours: 4.5 },
  { date: "Jul 19", hours: 0 },
  { date: "Jul 20", hours: 1.5 },
  { date: "Jul 21", hours: 2.5 },
  { date: "Jul 22", hours: 4 },
  { date: "Jul 23", hours: 1 },
  { date: "Jul 24", hours: 0 },
  { date: "Jul 25", hours: 3 },
  { date: "Jul 26", hours: 2 },
];

export function getStandardChartData(chartData = []) {
  const normalizedChartData = Array.isArray(chartData) ? chartData : [];
  const today = new Date();
  const Data = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
 
    const isoDate = d.toISOString().split("T")[0];

    const found = normalizedChartData.find((item) => item.date === isoDate);

    Data.push({
      date: d.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
      }),
      hours: found?.totalStudyHour ?? found?.hours ?? 0,
    });
  }
  return Data;
}
