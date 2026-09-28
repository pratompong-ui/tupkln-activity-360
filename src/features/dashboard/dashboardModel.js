const DAY_MS = 864e5;

export function addDays(date, amount) {
  const value = new Date(`${date}T00:00:00`);
  value.setDate(value.getDate() + amount);
  return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}`;
}

const lastDay = (activity) => activity.dateEnd && activity.dateEnd > activity.date
  ? activity.dateEnd
  : activity.date;

const isOpenDoc = (doc) => doc.status !== "done" && doc.status !== "skip";

export function buildDashboardModel(data, myUnit, today) {
  const activities = data?.activities || [];
  const docs = data?.docs || [];
  const scopedActivities = myUnit ? activities.filter((item) => item.unitId === myUnit) : activities;
  const scopedDocs = myUnit ? docs.filter((item) => item.unitId === myUnit) : docs;
  const inSevenDays = addDays(today, 7);

  const todayActivities = scopedActivities
    .filter((item) => item.date && item.date <= today && lastDay(item) >= today)
    .sort((a, b) => (a.time || "99:99").localeCompare(b.time || "99:99"));

  const upcomingActivities = scopedActivities
    .filter((item) => item.date && item.date > today && item.date <= inSevenDays)
    .sort((a, b) => a.date.localeCompare(b.date) || (a.time || "99:99").localeCompare(b.time || "99:99"));

  const overdueTasks = scopedActivities.flatMap((activity) => (activity.tasks || [])
    .filter((task) => !activity.closed && !task.done && task.due && task.due < today)
    .map((task) => ({ ...task, activity }))
  ).sort((a, b) => a.due.localeCompare(b.due));

  const overdueDocs = scopedDocs
    .filter((doc) => isOpenDoc(doc) && doc.due && doc.due < today)
    .sort((a, b) => a.due.localeCompare(b.due));

  const followUps = scopedActivities
    .filter((item) => item.name && !item.closed && item.date && lastDay(item) < today)
    .sort((a, b) => lastDay(b).localeCompare(lastDay(a)));

  const myWork = myUnit ? {
    activities: scopedActivities
      .filter((item) => item.name && (!item.date || lastDay(item) >= today) && !item.closed)
      .sort((a, b) => (a.date || "9999-12-31").localeCompare(b.date || "9999-12-31")),
    tasks: scopedActivities.flatMap((activity) => (activity.tasks || [])
      .filter((task) => !task.done)
      .map((task) => ({ ...task, activity })))
      .sort((a, b) => (a.due || "9999-12-31").localeCompare(b.due || "9999-12-31")),
    docs: scopedDocs.filter(isOpenDoc)
      .sort((a, b) => (a.due || "9999-12-31").localeCompare(b.due || "9999-12-31")),
  } : { activities: [], tasks: [], docs: [] };

  return {
    todayActivities,
    upcomingActivities,
    overdueTasks,
    overdueDocs,
    followUps,
    myWork,
    inSevenDays,
    isScoped: Boolean(myUnit),
    summary: {
      today: todayActivities.length,
      nextSevenDays: upcomingActivities.length,
      myWork: myWork.activities.length + myWork.tasks.length + myWork.docs.length,
      attention: followUps.length + overdueTasks.length + overdueDocs.length,
    },
  };
}

export function daysOverdue(due, today) {
  return Math.max(0, Math.round((new Date(`${today}T00:00:00`) - new Date(`${due}T00:00:00`)) / DAY_MS));
}
