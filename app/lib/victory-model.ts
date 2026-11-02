export type Habit = { id: string; title: string; goal: string; category: string };
export type Emotion = { energy?: string; hunger?: string; mood?: string; rest?: string; victory?: string; difficulty?: string };
export type Week = { habits: Habit[]; checks: Record<string, boolean>; emotions: Record<string, Emotion>; comment: string };
export type Records = Record<string, Week>;
export type Schedule = Record<string, { from: string; habits: Habit[] }[]>;
export type VictoryData = { records: Records; schedules: Schedule };
export function emptyWeek(): Week { return { habits: [], checks: {}, emotions: {}, comment: '' }; }
export function habitsFor(schedules: Schedule, client: string, week: string): Habit[] {
 return [...(schedules[client] || [])].sort((a,b)=>b.from.localeCompare(a.from)).find(v=>v.from<=week)?.habits || [];
}
export function weekFor(data: VictoryData, client: string, week: string): Week {
 return data.records[`${client}::${week}`] || { ...emptyWeek(), habits: habitsFor(data.schedules,client,week) };
}
// Preserve every existing weekly record while adopting its latest habits as defaults.
export function migrate(records: Records, today: string): VictoryData {
 const schedules: Schedule = {};
 const clients = new Set(Object.keys(records).map(key=>key.split('::')[0]));
 for(const client of clients) {
  const dates=Object.keys(records).filter(key=>key.startsWith(client+'::')).map(key=>key.split('::')[1]).filter(date=>date<=today).sort();
  if(dates.length) schedules[client]=[{from:dates[dates.length-1],habits:records[`${client}::${dates[dates.length-1]}`].habits.map(h=>({...h}))}];
 }
 return {records,schedules};
}
export function setDefaults(data: VictoryData, client: string, from: string, habits: Habit[]): VictoryData {
 const records={...data.records};
 // Freeze previous weeks before replacing the active defaults. Old weekly responses remain intact.
 for(const [key,record] of Object.entries(records)) {
  if(key.startsWith(client+'::')&&key.split('::')[1]>=from) {
   const ids=new Set(habits.map(h=>h.id));
   records[key]={...record,habits:habits.map(h=>({...h})),checks:Object.fromEntries(Object.entries(record.checks).filter(([key])=>ids.has(key.slice(0,key.lastIndexOf(':')))))};
  }
 }
 return {records,schedules:{...data.schedules,[client]:[...(data.schedules[client]||[]).filter(v=>v.from<from),{from,habits:habits.map(h=>({...h}))}]}};
}
