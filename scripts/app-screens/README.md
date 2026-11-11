# The staff screens of the landing page

The row «في يد كل معلم وإداري» (`components/lp/staff.tsx`) shows real screens of the app (HalaqatUI) as a teacher and
an administrator see them on a phone. They are captured from the running app against a **fake API with made-up data**
(مدرسة النور, أ. محمد سالم, يوسف أحمد…, the tutorial films' world). Never point this at the real backend or use real
people's data. The student and parent screens of the other row come from
`HafizTutorialVideo/learners/capture` (same method).

1. Fake API (read-only, port 5397): `node mock-api.mjs 5397`. The role (Teacher / Admin) comes from the unsigned demo
   token the capture browser puts in localStorage. It reads the mushaf pages from `HalaqatUI/public/mushaf/pages` and
   the default wording of the automatic messages from `HalaqatBackend/Resources/SharedResource*.resx`.
2. The app on a test port (never the owner's own): best from a clean copy of the committed app, so unfinished work of
   other sessions does not end up in the pictures, e.g. `git -C ../HalaqatUI archive HEAD | tar -x -C <copy>`, link its
   `node_modules`, then in the copy
   `VITE_API_URL=http://localhost:5397/v1 VITE_COMMON_API_URL=http://localhost:5397/v1 npx vite --port 3059 --strictPort`.
   The mushaf fonts load from the files Worker, so the machine needs internet.
3. Captures: in a folder with `npm i puppeteer-core@24`, run `node shoot.mjs jobs.json <out>` (Chrome at
   `C:/Program Files/Google/Chrome/Application/chrome.exe`). Each job is a 390×722 phone screen at DPR 2: the frame's own
   proportions, so nothing is cropped on the page.
4. `python publish.py <out>` writes `public/lp/staff-*.webp` (540×1000, about 10–80 KB each).
5. Stop both servers afterwards (ports 5397 / 3059).

Dates in the fake data follow the day of the capture (the halaqa meets on Sunday, Tuesday and Thursday), so a new
capture shows current dates. The registration link in `staff-join` is written into the field by the job
(`portal.alhafiz.app/join/al-noor`), since the app would show the test address.
