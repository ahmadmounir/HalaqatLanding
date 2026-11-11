// Fake Hafiz API for the landing page's staff screens (teachers and administrators): made-up demo data only,
// read-only, on its own port. Never talks to the real backend or database. Usage: node mock-api.mjs [port]
// The made-up world is the tutorial films' one: مدرسة النور, the teacher أ. محمد سالم, the student يوسف أحمد…
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import os from 'node:os';

const PORT = Number(process.argv[2] || 5397);
const HERE = path.dirname(fileURLToPath(import.meta.url));
const HAFIZ = process.env.HAFIZ_ROOT || 'D:/Ahmad/Work/Hafiz';
const PAGES = `${HAFIZ}/HalaqatUI/public/mushaf/pages`;
const RESX = `${HAFIZ}/HalaqatBackend/Resources`;
const LOG = fs.createWriteStream(process.env.MOCK_LOG || path.join(os.tmpdir(), 'hafiz-app-screens-requests.log'), {flags: 'a'});

/* ------------------------------------------------------------------ helpers */
const ok = (data, paging) => ({success: true, statusCode: 200, message: null, data, ...(paging ? {paging} : {})});
const paged = (items, q, size0 = 20) => {
  const size = Number(q.get('pageSize') || size0), idx = Number(q.get('pageIndex') || 1);
  const start = (idx - 1) * size;
  return ok(items.slice(start, start + size), {pageIndex: idx, pageSize: size, totalItems: items.length, totalPages: Math.max(1, Math.ceil(items.length / size)), hasPrevious: idx > 1, hasNext: start + size < items.length});
};
const DAY = 86400e3;
const today = new Date(new Date().toISOString().slice(0, 10) + 'T00:00:00Z');
const iso = (d) => d.toISOString().slice(0, 10);
const daysAgo = (n) => iso(new Date(today.getTime() - n * DAY));
const hoursAgo = (h) => new Date(Date.now() - h * 3600e3).toISOString();
const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const page = (n) => JSON.parse(fs.readFileSync(`${PAGES}/page-${String(n).padStart(3, '0')}.json`, 'utf8'));
const wordsOf = (n) => page(n).lines.filter((l) => l.type === 'words').flatMap((l) => l.words).filter((w) => !w.end);
const marksOn = (n, picks) => {
  const w = wordsOf(n);
  return picks.map(([i, type]) => ({wordId: w[i].id, location: `${w[i].surah}:${w[i].ayah}:${w[i].pos}`, type}));
};

/** The backend's own default wording of the automatic messages (SharedResource.*.resx), never made up here. */
const resx = (lang) => {
  const file = `${RESX}/SharedResource${lang === 'en' ? '' : '.' + lang}.resx`;
  const out = {};
  for (const m of fs.readFileSync(file, 'utf8').matchAll(/<data name="(AutoMessage\w+?)(Male|Female)"[^>]*>\s*<value>([\s\S]*?)<\/value>/g)) {
    (out[m[1]] ??= {})[m[2].toLowerCase()] = m[3].replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
  }
  return out;
};
const RES = {ar: resx('ar'), en: resx('en'), tr: resx('tr')};

/* ------------------------------------------------------------------ people */
const TENANT = 'مدرسة النور';
const SEASON = 'الفصل الأول 2026';
let ROLE = 'Admin';
const settings = {enableSmartMushaf: true, allowTeachersManageStudents: true, allowStudentsViewGroupMembers: true, enableStudentSubscriptions: false};
const PROFILES = {
  Admin: {userId: 'adm-abdullah', role: 'Admin', firstName: 'عبد الله', lastName: 'حسن', email: 'admin@example.com', emailVerified: true,
    phone: '+905000000010', gender: 'Male', hasTelegram: true, notificationChannels: ['telegram', 'webpush'], advisorId: null,
    tenantId: 'demo', tenantName: TENANT, tenantCountryCode: 'TR', tenantSettings: settings},
  Teacher: {userId: 'tch-mohammad', role: 'Teacher', firstName: 'محمد', lastName: 'سالم', email: 'mohammad.salem@example.com', emailVerified: true,
    phone: '+905000000003', gender: 'Male', hasTelegram: true, notificationChannels: ['telegram', 'webpush'], advisorId: null,
    tenantId: 'demo', tenantName: TENANT, tenantCountryCode: 'TR', tenantSettings: settings},
};

const TEACHERS = [
  ['tch-mohammad', 'محمد', 'سالم', 'Male'], ['tch-fatima', 'فاطمة', 'علي', 'Female'], ['tch-khaled', 'خالد', 'العمر', 'Male'],
  ['tch-aisha', 'عائشة', 'حسن', 'Female'], ['tch-abdulrahman', 'عبد الرحمن', 'يوسف', 'Male'], ['tch-sumayya', 'سمية', 'خالد', 'Female'],
];
const tName = (id) => {
  const t = TEACHERS.find((x) => x[0] === id);
  return t ? `أ. ${t[1]} ${t[2]}` : null;
};

// Halaqat: [id, name, color, teacher, days, label, type]
const GROUPS_RAW = [
  ['grp-fajr', 'حلقة الفجر', '#0f766e', 'tch-mohammad', ['Sunday', 'Tuesday', 'Thursday'], 'lbl-boys', 'memorization'],
  ['grp-noor', 'حلقة النور', '#b45309', 'tch-fatima', ['Saturday', 'Monday', 'Wednesday'], 'lbl-girls', 'memorization'],
  ['grp-itqan', 'حلقة الإتقان', '#1d4ed8', 'tch-khaled', ['Sunday', 'Tuesday', 'Thursday'], 'lbl-boys', 'memorization'],
  ['grp-tibyan', 'حلقة التبيان', '#7c3aed', 'tch-aisha', ['Saturday', 'Monday', 'Wednesday'], 'lbl-girls', 'memorization'],
  ['grp-huda', 'حلقة الهدى', '#be123c', 'tch-abdulrahman', ['Saturday', 'Monday', 'Wednesday'], 'lbl-boys', 'memorization'],
  ['grp-bayan', 'حلقة البيان', '#0369a1', 'tch-sumayya', ['Sunday', 'Tuesday', 'Thursday'], 'lbl-girls', 'tilawa'],
];
const LABELS = [
  {id: 'lbl-boys', name: 'قسم البنين', createdAt: '2026-08-20T10:00:00Z'},
  {id: 'lbl-girls', name: 'قسم البنات', createdAt: '2026-08-20T10:00:00Z'},
];
const labelName = (id) => LABELS.find((l) => l.id === id)?.name ?? null;

// Students: [id, first, last, gender, group, avg score, pages, absences, completed today?]
const STUDENTS_RAW = [
  ['stu-yusuf', 'يوسف', 'أحمد', 'Male', 'grp-fajr', 96.4, 34, 1, false],
  ['stu-omar', 'عمر', 'خالد', 'Male', 'grp-fajr', 98.2, 41, 0, true],
  ['stu-salman', 'سلمان', 'علي', 'Male', 'grp-fajr', 94.8, 27, 2, true],
  ['stu-zaid', 'زيد', 'محمود', 'Male', 'grp-fajr', 93.1, 22, 1, false],
  ['stu-anas', 'أنس', 'سعيد', 'Male', 'grp-fajr', 97.0, 36, 0, true],
  ['stu-hamza', 'حمزة', 'يوسف', 'Male', 'grp-fajr', 95.5, 30, 1, true],
  ['stu-bilal', 'بلال', 'عمر', 'Male', 'grp-fajr', 89.6, 15, 4, false],
  ['stu-ibrahim', 'إبراهيم', 'سامر', 'Male', 'grp-fajr', 91.9, 19, 2, true],
  ['stu-maryam', 'مريم', 'أحمد', 'Female', 'grp-noor', 98.1, 21, 0, true],
  ['stu-sara', 'سارة', 'محمود', 'Female', 'grp-noor', 97.6, 29, 0, true],
  ['stu-layan', 'ليان', 'عمر', 'Female', 'grp-noor', 96.9, 24, 1, true],
  ['stu-huda', 'هدى', 'سليم', 'Female', 'grp-tibyan', 95.2, 18, 1, true],
  ['stu-ruqayya', 'رقية', 'حسن', 'Female', 'grp-tibyan', 97.3, 33, 0, true],
  ['stu-abdullah', 'عبد الله', 'ماهر', 'Male', 'grp-itqan', 97.8, 52, 0, true],
  ['stu-khalid', 'خالد', 'وليد', 'Male', 'grp-itqan', 94.1, 38, 1, true],
  ['stu-mustafa', 'مصطفى', 'رامي', 'Male', 'grp-huda', 92.4, 20, 3, false],
  ['stu-ahmad', 'أحمد', 'ياسر', 'Male', 'grp-huda', 88.7, 12, 5, false],
  ['stu-jana', 'جنى', 'فادي', 'Female', 'grp-bayan', 96.0, 26, 1, true],
];
const groupOf = (id) => GROUPS_RAW.find((g) => g[0] === id);
const STUDENTS = STUDENTS_RAW.map(([id, first, last, gender, grp, score, pages, abs, done]) => ({id, first, last, gender, grp, score, pages, abs, done, name: `${first} ${last}`}));
const byScore = [...STUDENTS].sort((a, b) => b.score - a.score);

/* ------------------------------------------------------------------ seasons */
const SEASONS = [
  {id: 's-2026a', name: SEASON, startDate: '2026-09-01', endDate: '2027-01-31', isCurrent: true, createdAt: '2026-08-20T10:00:00Z', status: 'running', isOpenForRecords: true, isFrozen: false},
  {id: 's-2026b', name: 'الفصل الثاني 2027', startDate: '2027-02-14', endDate: '2027-06-30', isCurrent: false, createdAt: '2026-10-02T10:00:00Z', status: 'upcoming', isOpenForRecords: false, isFrozen: false},
  {id: 's-2025b', name: 'الفصل الثاني 2026', startDate: '2026-02-15', endDate: '2026-06-30', isCurrent: false, createdAt: '2026-01-25T10:00:00Z', status: 'closed', isOpenForRecords: false, isFrozen: true},
  {id: 's-2025a', name: 'الفصل الأول 2025', startDate: '2025-09-01', endDate: '2026-01-31', isCurrent: false, createdAt: '2025-08-15T10:00:00Z', status: 'closed', isOpenForRecords: false, isFrozen: true},
];
const statSeason = (s) => ({id: s.id, name: s.name, startDate: s.startDate, endDate: s.endDate, isFrozen: !!s.isFrozen, dataQuality: 'Exact', frozenAt: s.isFrozen ? s.endDate + 'T23:00:00Z' : null});

/* ------------------------------------------------------------------ statistics */
const metrics = (o = {}) => {
  const m = {studentsCount: 1, activeStudentsCount: 1, logsTotal: 30, logsCompleted: 28, completionRate: 93.3, hifzPages: 12, revPages: 54, totalPages: 66,
    hifzScore: 96, revScore: 95, extraPoints: 2, totalScore: 2890, avgScore: 95.5, expectedDays: 30, absentDays: 1, attendanceRate: 96.7,
    hifzMistakes: 3, hifzMinorMistakes: 5, hifzReminders: 18, revMistakes: 4, revMinorMistakes: 6, revReminders: 21, totalMistakes: 57, mistakesPerPage: 0.86, ...o};
  return m;
};
const studentStat = (s, rank) => {
  const g = groupOf(s.grp);
  const logs = 30 - s.abs;
  const m = metrics({avgScore: s.score, hifzScore: s.score + 0.4, revScore: s.score - 0.5, hifzPages: Math.round(s.pages / 3), revPages: s.pages * 2, totalPages: Math.round(s.pages / 3) + s.pages * 2,
    logsTotal: 30, logsCompleted: logs, completionRate: +((logs / 30) * 100).toFixed(1), absentDays: s.abs, attendanceRate: +(((30 - s.abs) / 30) * 100).toFixed(1),
    totalScore: Math.round(s.score * logs), extraPoints: s.score > 97 ? 3 : 1});
  return {studentId: s.id, name: s.name, gender: s.gender, groupId: g[0], groupName: g[1], groupColor: g[2], labelId: g[5], labelName: labelName(g[5]),
    advisorName: tName(g[3]), isActive: true, rank, metrics: m, bySeason: [{seasonId: 's-2026a', metrics: m}]};
};
const STUDENT_STATS = byScore.map((s, i) => studentStat(s, i + 1));
const groupStat = (g) => {
  const kids = STUDENTS.filter((s) => s.grp === g[0]);
  const extra = {'grp-fajr': 14, 'grp-noor': 16, 'grp-itqan': 12, 'grp-tibyan': 15, 'grp-huda': 13, 'grp-bayan': 18}[g[0]];
  const avg = {'grp-fajr': 96.1, 'grp-noor': 97.4, 'grp-itqan': 95.8, 'grp-tibyan': 96.6, 'grp-huda': 92.3, 'grp-bayan': 94.9}[g[0]];
  const m = metrics({studentsCount: extra, activeStudentsCount: extra, avgScore: avg, totalScore: Math.round(avg * extra * 28), logsTotal: extra * 30, logsCompleted: Math.round(extra * 28.4),
    completionRate: 94.6, hifzPages: extra * 4, revPages: extra * 17, totalPages: extra * 21});
  return {groupId: g[0], name: g[1], color: g[2], isDefault: false, halaqaType: g[6], labelId: g[5], labelName: labelName(g[5]), adminName: tName(g[3]),
    teachers: [{id: g[3], name: tName(g[3])}], recitationDays: g[4], membersLimit: 20, studentsCount: extra, capacityUsage: extra * 5,
    maleStudents: g[5] === 'lbl-boys' ? extra : 0, femaleStudents: g[5] === 'lbl-girls' ? extra : 0, metrics: m, bySeason: [{seasonId: 's-2026a', metrics: m}],
    _kids: kids.length};
};
const GROUP_STATS = GROUPS_RAW.map(groupStat).map(({_kids, ...g}) => g);
const GROUPS = GROUPS_RAW.map((g, i) => ({groupId: g[0], name: g[1], color: g[2], recitationDays: g[4], isDefault: false, membersLimit: 20,
  studentsCount: GROUP_STATS[i].studentsCount, adminId: g[3], adminName: tName(g[3]), labelId: g[5], labelName: labelName(g[5]), halaqaType: g[6], createdAt: '2026-08-25T10:00:00Z'}));

// The last 14 days of recitations: each halaqa meets three days a week (none on Friday)
const ACTIVITY = Array.from({length: 14}, (_, i) => {
  const d = new Date(today.getTime() - (13 - i) * DAY);
  const wd = WEEKDAYS[d.getUTCDay()];
  if (wd === 'Friday') return {day: wd, date: iso(d), completed: 0, notCompleted: 0};
  const base = ['Sunday', 'Tuesday', 'Thursday'].includes(wd) ? 44 : 42;
  const done = base - ((i * 7) % 5) - (i === 13 ? 9 : 0);
  return {day: wd, date: iso(d), completed: done, notCompleted: base + 2 - done};
});
const DAILY = ACTIVITY.map((a) => ({date: a.date, logsTotal: a.completed + a.notCompleted, logsCompleted: a.completed, pages: a.completed * 3}));

const lbStudent = (s) => ({id: s.id, name: s.name, gender: s.gender, totalPages: String(Math.round(s.pages / 3) + s.pages * 2), totalPoints: Math.round(s.score * (30 - s.abs)), score: s.score});
const struggling = STUDENTS.filter((s) => s.abs >= 3).map((s) => ({id: s.id, name: s.name, advisorName: tName(groupOf(s.grp)[3]), logsCount: 30 - s.abs, absenceCount: s.abs}));

const ADMIN_DASH = {
  overallStats: {totalStudents: 88, totalTeachers: 6, totalGroups: 6, activeSeason: SEASON, totalPages: '1,846'},
  leaderboards: {
    groups: [...GROUP_STATS].sort((a, b) => b.metrics.avgScore - a.metrics.avgScore).map((g) => ({id: g.groupId, name: g.name, color: g.color, adminName: g.adminName, avgScore: g.metrics.avgScore, totalScore: g.metrics.totalScore, studentsCount: g.studentsCount})),
    students: byScore.slice(0, 10).map(lbStudent),
  },
  activities: {students: struggling, teachers: TEACHERS.map((t, i) => ({name: tName(t[0]), servedStudentsCount: [14, 16, 12, 15, 13, 18][i]}))},
  chart: {recitationActivity: ACTIVITY},
};

const fajr = STUDENTS.filter((s) => s.grp === 'grp-fajr');
const TEACHER_DASH = {
  teacherProfile: {name: 'أ. محمد سالم', groupsCount: 1, studentsCount: fajr.length, totalPages: '412'},
  achievement: {logsCompleted: 214, myStudents: fajr.map((s) => ({id: s.id, name: s.name, score: Math.round(s.score * (30 - s.abs)), avgScore: s.score.toFixed(1), absenceCount: s.abs, hasNextRecitLog: !s.done}))},
  adminGroupStudentsLeaderboard: [...fajr].sort((a, b) => b.score - a.score).map(lbStudent),
  myGroupsStats: [{name: 'حلقة الفجر', avgScore: 96.1, absenceCount: 11, students: fajr.map((s) => ({id: s.id, name: s.name, completed: s.done}))}],
  activities: {students: struggling.filter((s) => fajr.some((f) => f.id === s.id))},
};

const OVERVIEW = {
  season: statSeason(SEASONS[0]), seasonsCount: 4, hasApproximateData: false, studentsCount: 88, activeStudentsCount: 85, teachersCount: 6, groupsCount: 6, labelsCount: 2,
  maleStudents: 39, femaleStudents: 49,
  metrics: metrics({studentsCount: 88, activeStudentsCount: 85, logsTotal: 2640, logsCompleted: 2497, completionRate: 94.6, hifzPages: 352, revPages: 1494, totalPages: 1846, avgScore: 95.9, attendanceRate: 95.8, expectedDays: 30, absentDays: 112}),
  daily: DAILY,
  seasonComparison: [SEASONS[3], SEASONS[2], SEASONS[0]].map((s, i) => ({season: statSeason(s), metrics: metrics({avgScore: [93.8, 95.0, 95.9][i], totalPages: [2210, 2580, 1846][i], completionRate: [90.2, 93.1, 94.6][i], attendanceRate: [92.4, 94.7, 95.8][i]})})),
  topStudents: STUDENT_STATS.slice(0, 5),
  strugglingStudents: STUDENT_STATS.filter((s) => s.metrics.absentDays >= 3),
  topGroups: [...GROUP_STATS].sort((a, b) => b.metrics.avgScore - a.metrics.avgScore).slice(0, 3),
};

/* ------------------------------------------------------------------ join link and requests */
const JOIN_FORM = {
  slug: 'al-noor', isOpen: true, title: 'التسجيل في مدرسة النور', description: 'املأ النموذج، ونتواصل معك لتحديد الحلقة المناسبة.', updatedAt: '2026-10-28T09:00:00Z',
  fields: [
    {id: 'f-age', type: 'number', label: 'العمر', required: true, min: 6, max: 60},
    {id: 'f-level', type: 'radio', label: 'مقدار الحفظ الحالي', required: true, options: [{id: 'o1', label: 'أقل من جزء'}, {id: 'o2', label: 'من جزء إلى خمسة أجزاء'}, {id: 'o3', label: 'أكثر من خمسة أجزاء'}]},
    {id: 'f-time', type: 'checkboxes', label: 'الأوقات المناسبة', required: false, options: [{id: 't1', label: 'بعد الفجر'}, {id: 't2', label: 'بعد العصر'}, {id: 't3', label: 'بعد المغرب'}]},
    {id: 'f-parent', type: 'short_text', label: 'اسم ولي الأمر', required: false},
  ],
};
const JOIN_REQ = [
  ['jr-1', 'عبد الرحمن', 'فؤاد', 'Male', 2, 'pending'], ['jr-2', 'نور', 'سامي', 'Female', 5, 'pending'], ['jr-3', 'ياسين', 'مازن', 'Male', 20, 'pending'],
  ['jr-4', 'تسنيم', 'وائل', 'Female', 27, 'pending'], ['jr-5', 'معاذ', 'عادل', 'Male', 46, 'accepted'], ['jr-6', 'شهد', 'نبيل', 'Female', 70, 'accepted'],
].map(([id, firstName, lastName, gender, h, status], i) => ({id, status, firstName, lastName, email: `${id}@example.com`, phone: `+90500000010${i}`, gender,
  submittedAt: hoursAgo(h), reviewedAt: status === 'pending' ? null : hoursAgo(h - 3), groupId: status === 'pending' ? null : 'grp-fajr', groupName: status === 'pending' ? null : 'حلقة الفجر'}));
const joinDetails = (r) => ({...r, preferredLanguage: 'ar', studentId: null, rejectionReason: null, reviewedByName: null,
  answers: [
    {fieldId: 'f-age', label: 'العمر', type: 'number', values: ['12'], display: ['12']},
    {fieldId: 'f-level', label: 'مقدار الحفظ الحالي', type: 'radio', values: ['o2'], display: ['من جزء إلى خمسة أجزاء']},
    {fieldId: 'f-time', label: 'الأوقات المناسبة', type: 'checkboxes', values: ['t2', 't3'], display: ['بعد العصر', 'بعد المغرب']},
    {fieldId: 'f-parent', label: 'اسم ولي الأمر', type: 'short_text', values: ['فؤاد عبد الله'], display: ['فؤاد عبد الله']},
  ]});

/* ------------------------------------------------------------------ automatic messages */
const KINDS = [
  ['recitation_ready', 'Student', false, 'AutoMessageRecitationReady', ['name', 'day', 'assignment']],
  ['recitation_tomorrow', 'Student', false, 'AutoMessageRecitationTomorrow', ['name', 'day', 'assignment']],
  ['parent_result', 'Parent', false, 'AutoMessageParentResult', ['name', 'child', 'score', 'details'], true],
  ['recitation_late', 'Student', false, 'AutoMessageRecitationLate', ['name', 'day']],
  ['plan_missing', 'Teacher', false, 'AutoMessagePlanMissing', ['name', 'day', 'students', 'count']],
  ['parent_missed', 'Parent', false, 'AutoMessageParentMissed', ['name', 'child', 'day'], true],
  ['revision_due', 'Student', true, 'AutoMessageRevisionDue', ['name', 'surahs', 'count']],
  ['goal_behind', 'Student', true, 'AutoMessageGoalBehind', ['name', 'pages']],
  ['recap_ready', 'Student', true, 'AutoMessageRecapReady', ['name', 'season']],
];
const AUTO = {
  enabledForOrganization: true, sendHour: 19,
  items: KINDS.map(([kind, audience, subscribersOnly, key, variables, byChildGender]) => {
    const texts = Object.fromEntries(['ar', 'en', 'tr'].map((l) => [l, {male: RES[l][key]?.male ?? '', female: RES[l][key]?.female ?? ''}]));
    return {kind, audience, byChildGender: !!byChildGender, subscribersOnly, isEnabled: kind !== 'goal_behind', variables, texts, defaults: texts, updatedAt: null};
  }),
};
const LOGROWS = [
  ['recitation_ready', 'Telegram', 'يوسف أحمد', 'Student', 0.3], ['parent_result', 'WebPush', 'أحمد سعيد', 'Parent', 0.5], ['parent_result', 'Telegram', 'سعيد خالد', 'Parent', 0.6],
  ['recitation_ready', 'InApp', 'زيد محمود', 'Student', 1.2], ['plan_missing', 'Telegram', 'أ. محمد سالم', 'Teacher', 20], ['recitation_tomorrow', 'Telegram', 'مريم أحمد', 'Student', 21],
  ['recitation_tomorrow', 'WebPush', 'سارة محمود', 'Student', 21], ['parent_missed', 'Telegram', 'ياسر أحمد', 'Parent', 22],
].map(([kind, channel, receiverName, receiverRole, h], i) => ({id: `ml-${i}`, kind, sentAt: hoursAgo(h), status: 'Sent', channel, errorMessage: null, message: null, receiverId: null, receiverName, receiverRole, senderName: null}));

/* ------------------------------------------------------------------ inbox */
const INBOX = [
  {id: 'n1', kind: 'message', body: 'تم قبول طلاب الدفعة الجديدة في حلقة الفجر، بارك الله فيكم.', senderName: 'إدارة مدرسة النور', isRead: false, createdAt: hoursAgo(2)},
  {id: 'n2', kind: 'plan_missing', body: 'غدًا موعد الحلقة، وطالبان بلا مقرر تسميع: زيد محمود، بلال عمر.', senderName: null, isRead: false, createdAt: hoursAgo(20)},
];

/* ------------------------------------------------------------------ teacher: students and recitation logs */
const studentRow = (s) => {
  const g = groupOf(s.grp);
  return {studentId: s.id, userId: `u-${s.id}`, firstName: s.first, lastName: s.last, email: `${s.id}@example.com`, hasTelegram: s.abs < 3,
    notificationChannels: s.abs < 3 ? ['telegram', 'webpush'] : ['webpush'], parentsCount: 1, phone: null, gender: s.gender, groupId: g[0], groupName: g[1],
    info: '', advisorId: g[3], advisorName: tName(g[3]), joinedOn: '2025-09-01', isHafiz: false};
};
const range = (type, from, to, surah) => ({type, from, to, ...(surah ? {surah} : {})});
const at = (d) => `${d}T00:00:00`;
const recLog = (o) => ({studentId: 'stu-yusuf', teacherId: 'tch-mohammad', teacherName: 'أ. محمد سالم', createdByName: 'أ. محمد سالم', groupId: 'grp-fajr', completed: true,
  hifzContent: null, hifzAssignments: null, hifzPageCount: 0, hifzReminders: 0, hifzMistakes: 0, hifzMinorMistakes: 0, hifzCompleted: true, hifzFinalScore: 0, hifzMistakesDetails: null,
  revContent: null, revAssignments: null, revPageCount: 0, revReminders: 0, revMistakes: 0, revMinorMistakes: 0, revCompleted: true, revFinalScore: 0, revMistakesDetails: null,
  seasonId: 's-2026a', isLocked: false, isHafizLog: false, isTilawaLog: false, extraPoint: 0, notes: null, createdAt: hoursAgo(30), ...o});
const cnt = (m, t) => m.filter((x) => x.type === t).length;
// The halaqa meets on Sunday, Tuesday and Thursday: the days of its recitations, counted from today
const FAJR_DAYS = ['Sunday', 'Tuesday', 'Thursday'];
const meetDays = (n, dir) => {
  const out = [];
  for (let i = dir > 0 ? 1 : 0; out.length < n; i++) {
    const d = new Date(today.getTime() + dir * i * DAY);
    if (FAJR_DAYS.includes(WEEKDAYS[d.getUTCDay()])) out.push(iso(d));
  }
  return out;
};
const [nextDay] = meetDays(1, 1);
const past = meetDays(4, -1);
// The recitation the teacher is grading in the mushaf: Al-Mulk 1-12 (page 562), half marked
const mulkNow = marksOn(562, [[7, 'reminder'], [26, 'minor'], [44, 'reminder'], [63, 'mistake'], [88, 'reminder'], [101, 'minor']]);
const GRADING = recLog({id: 'log-grade', date: at(iso(today)), completed: false, hifzCompleted: false, revCompleted: false,
  hifzContent: 'سورة الملك 1 - 12', hifzAssignments: [range('ayah', 1, 12, 67)], hifzPageCount: 1,
  hifzReminders: cnt(mulkNow, 'reminder'), hifzMinorMistakes: cnt(mulkNow, 'minor'), hifzMistakes: cnt(mulkNow, 'mistake'), hifzMistakesDetails: mulkNow,
  revContent: 'سورة عبس', revAssignments: [range('surah', 80, 80)], revPageCount: 2});
// Yusuf's record: the next recitation is prepared, the past ones are graded
const LOGS = [
  recLog({id: 'log-next', date: at(nextDay), completed: false, hifzCompleted: false, revCompleted: false,
    hifzContent: 'سورة الملك 13 - 30', hifzAssignments: [range('ayah', 13, 30, 67)], hifzPageCount: 2,
    revContent: 'سورة التكوير', revAssignments: [range('surah', 81, 81)], revPageCount: 1}),
  recLog({id: 'log-1', date: at(past[0]), hifzContent: 'سورة النبأ 31 - 40', hifzAssignments: [range('ayah', 31, 40, 78)], hifzPageCount: 1, hifzReminders: 1, hifzFinalScore: 99,
    revContent: 'سورة الانفطار', revAssignments: [range('surah', 82, 82)], revPageCount: 1, revReminders: 2, revFinalScore: 98}),
  recLog({id: 'log-2', date: at(past[1]), hifzContent: 'سورة النبأ 1 - 30', hifzAssignments: [range('ayah', 1, 30, 78)], hifzPageCount: 1, hifzReminders: 1, hifzMinorMistakes: 1, hifzFinalScore: 97,
    revContent: 'سورة المطففين', revAssignments: [range('surah', 83, 83)], revPageCount: 2, revFinalScore: 100}),
  recLog({id: 'log-3', date: at(past[2]), hifzContent: 'سورة النازعات 27 - 46', hifzAssignments: [range('ayah', 27, 46, 79)], hifzPageCount: 1, hifzReminders: 2, hifzFinalScore: 98,
    revContent: 'سورة الانشقاق', revAssignments: [range('surah', 84, 84)], revPageCount: 1, revMinorMistakes: 2, revFinalScore: 96}),
  recLog({id: 'log-4', date: at(past[3]), hifzContent: 'سورة النازعات 1 - 26', hifzAssignments: [range('ayah', 1, 26, 79)], hifzPageCount: 1, hifzFinalScore: 100,
    revContent: 'سورة البروج', revAssignments: [range('surah', 85, 85)], revPageCount: 1, revReminders: 1, revFinalScore: 99}),
];

/* ------------------------------------------------------------------ routes */
function route(method, p, q) {
  if (p === '/students') {
    const gid = q.get('groupId');
    const pool = ROLE === 'Teacher' ? fajr : STUDENTS;
    return paged((gid ? pool.filter((s) => s.grp === gid) : pool).map(studentRow), q, 50);
  }
  const sm = p.match(/^\/students\/([^/]+)(\/recitation-logs(?:\/([^/]+))?)?$/);
  if (sm) {
    const s = STUDENTS.find((x) => x.id === sm[1]) ?? STUDENTS[0];
    if (!sm[2]) return ok(studentRow(s));
    if (sm[3]) return ok(sm[3] === GRADING.id ? GRADING : LOGS.find((l) => l.id === sm[3]) ?? LOGS[0]);
    const size = Number(q.get('pageSize') || 20);
    return ok({absentCount: '1', achievementRate: '96.7', recitationLogs: LOGS.slice(0, size)}, {pageIndex: 1, pageSize: size, totalItems: LOGS.length, totalPages: 1, hasPrevious: false, hasNext: false});
  }
  const gm = p.match(/^\/groups\/([^/]+)$/);
  if (gm) return ok(GROUPS.find((g) => g.groupId === gm[1]) ?? GROUPS[0]);
  if (p === '/profile') return ok(PROFILES[ROLE] ?? PROFILES.Admin);
  if (p === '/inbox/unread-count') return ok({count: 2});
  if (p === '/inbox') return paged(INBOX, q);
  if (p.startsWith('/inbox/')) return ok(null);
  if (p === '/join-requests/count') return ok(4);
  if (p === '/push/config') return ok({available: true, publicKey: 'BFakeKeyForDemoOnly', devices: 1});
  if (p === '/telegram/status') return ok({hasTelegram: true, isVerified: true});
  if (p === '/countries/list') return ok([]);
  if (p === '/seasons') return ok(SEASONS);
  if (p === '/seasons/current') return ok(SEASONS[0]);
  if (p.startsWith('/seasons/')) return ok(SEASONS.find((s) => s.id === p.split('/').pop()) ?? SEASONS[0]);
  if (p === '/dashboard/admin') return ok(ADMIN_DASH);
  if (p === '/dashboard/teacher') return ok(TEACHER_DASH);
  if (p === '/groups') return ok(ROLE === 'Teacher' ? GROUPS.filter((g) => g.adminId === 'tch-mohammad') : GROUPS);
  if (p === '/labels') return ok(LABELS);
  if (p === '/users') {
    const role = q.get('role');
    const users = TEACHERS.map(([userId, firstName, lastName, gender]) => ({userId, firstName, lastName, gender, email: `${userId}@example.com`, role: 'Teacher', hasTelegram: true, notificationChannels: ['telegram'], joinedOn: '2026-08-25'}));
    return paged(role && role !== 'Teacher' ? [] : users, q, 100);
  }
  if (p === '/statistics/overview') return ok(OVERVIEW);
  if (p === '/statistics/groups') return ok(GROUP_STATS);
  if (p === '/statistics/students') return paged(ROLE === 'Teacher' ? STUDENT_STATS.filter((s) => s.groupId === 'grp-fajr') : STUDENT_STATS, q, 50);
  if (p.startsWith('/statistics/students/')) {
    const s = STUDENT_STATS.find((x) => x.studentId === p.split('/').pop()) ?? STUDENT_STATS[0];
    return ok({studentId: s.studentId, name: s.name, gender: s.gender, advisorName: s.advisorName, isActive: true, overall: s.metrics,
      seasons: [{season: statSeason(SEASONS[0]), advisorName: s.advisorName, wasActive: true, metrics: s.metrics, groups: [{groupId: s.groupId, groupName: s.groupName, groupColor: s.groupColor, isPrimary: true, metrics: s.metrics}]}]});
  }
  if (p === '/statistics/deductions') return ok({seasonId: 's-2026a', seasonName: SEASON, available: true, items: []});
  if (p === '/join-requests/form') return ok(JOIN_FORM);
  if (p === '/join-requests') {
    const st = q.get('status');
    return paged(st ? JOIN_REQ.filter((r) => r.status === st) : JOIN_REQ, q);
  }
  if (p.startsWith('/join-requests/')) return ok(joinDetails(JOIN_REQ.find((r) => r.id === p.split('/').pop()) ?? JOIN_REQ[0]));
  if (p === '/join/al-noor') return ok({organizationName: TENANT, title: JOIN_FORM.title, description: JOIN_FORM.description, isOpen: true, fields: JOIN_FORM.fields});
  if (p === '/auto-messages') return ok(AUTO);
  if (p === '/notifications/log') return paged(LOGROWS, q, 50);
  if (p === '/notifications/reach') return ok({students: {total: 88, telegram: 64, webPush: 52, none: 0}, staff: {total: 7, telegram: 7, webPush: 5, none: 0}});
  return null;
}

export function start() {
  http.createServer((req, res) => {
    const url = new URL(req.url, `http://localhost:${PORT}`);
    const p = url.pathname.replace(/^\/v1/, '');
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept-Language');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    if (req.method === 'OPTIONS') { res.writeHead(204); return res.end(); }
    // the role comes from the fake (unsigned) demo token the screenshot browser puts in localStorage
    try {
      const tok = (req.headers.authorization || '').replace('Bearer ', '');
      ROLE = JSON.parse(Buffer.from(tok.split('.')[1], 'base64url').toString()).role || 'Admin';
    } catch { ROLE = 'Admin'; }
    const out = method_guard(req.method, p) ?? route(req.method, p, url.searchParams);
    LOG.write(`${new Date().toISOString()} ${ROLE} ${req.method} ${p}${url.search} -> ${out ? 'ok' : 'MISSING'}\n`);
    res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
    res.end(JSON.stringify(out ?? ok(null)));
  }).listen(PORT, () => console.log(`staff mock api on ${PORT}`));
}

/** Writes are accepted and forgotten: the screens are pictures, nothing is saved. */
const method_guard = (method, p) => (method !== 'GET' && !['/profile'].includes(p) ? ok(null) : null);

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) start();
