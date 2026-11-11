// Phone screenshots of the app as a teacher / an administrator sees it, against the fake demo API (made-up data only).
// Adapted from HafizTutorialVideo/learners/capture/shoot.mjs (the student and parent screens).
// node shoot.mjs <jobs.json> <outDir> [only-names,comma]
// A job: {name, role, path, w,h,dpr, wait, steps:[...], full, scroller, marks:{key:{text|sel, closest?, up?, nth?}}, ios, installable, ...}
// Writes <name>.png and <name>.json ({w, h, dpr, marks: {key: [x, y, w, h]}} in CSS px of the picture).
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';

const [jobsFile, outDir, only] = process.argv.slice(2);
const jobs = JSON.parse(fs.readFileSync(jobsFile, 'utf8')).filter((j) => !only || only.split(',').includes(j.name));
fs.mkdirSync(outDir, {recursive: true});
const BASE = process.env.UI || 'http://localhost:3059';
const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
const fakeToken = (role, id) => `${b64({alg: 'none', typ: 'JWT'})}.${b64({role, sub: id})}.demo`;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const UA_ANDROID = 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36';
const UA_IOS = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1';

const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
  args: ['--lang=ar', '--font-render-hinting=none', '--disable-features=Translate', '--hide-scrollbars', '--autoplay-policy=no-user-gesture-required'],
});

/** find an element in the page: {text, sel, closest, up, nth, within} → its rect in viewport CSS px */
const findRect = (page, q) =>
  page.evaluate((q) => {
    let els = [];
    if (q.sel) els = [...document.querySelectorAll(q.sel)];
    if (q.text) {
      const all = [...document.querySelectorAll('body *')].filter((e) => e.offsetParent !== null || e.tagName === 'svg');
      els = all.filter((e) => {
        const own = [...e.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join('').trim();
        return q.exact === false ? (e.textContent || '').includes(q.text) && e.children.length === 0 : own === q.text || (e.children.length === 0 && (e.textContent || '').trim() === q.text);
      });
    }
    els = els.filter((e) => {
      const r = e.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    });
    let el = els[q.nth ?? 0];
    if (!el) return null;
    if (q.closest) el = el.closest(q.closest) || el;
    for (let i = 0; i < (q.up || 0); i++) el = el.parentElement || el;
    // walk up to the first box at least this wide / tall (a card around a label)
    while ((q.minW && el.getBoundingClientRect().width < q.minW) || (q.minH && el.getBoundingClientRect().height < q.minH)) {
      if (!el.parentElement) break;
      el = el.parentElement;
    }
    if (q.scroll) el.scrollIntoView({block: 'nearest', inline: 'center'});
    const r = el.getBoundingClientRect();
    return [Math.round(r.x * 10) / 10, Math.round(r.y * 10) / 10, Math.round(r.width * 10) / 10, Math.round(r.height * 10) / 10];
  }, q);

const tapAt = async (page, x, y) => {
  await page.touchscreen.tap(x, y);
};

for (const job of jobs) {
  const page = await browser.newPage();
  const W = job.w || 390, H = job.h || 722, DPR = job.dpr || 2;
  await page.setViewport({width: W, height: H, deviceScaleFactor: DPR, isMobile: true, hasTouch: true, isLandscape: W > H});
  await page.setUserAgent(job.ios ? UA_IOS : UA_ANDROID);
  await page.emulateMediaFeatures([{name: 'prefers-color-scheme', value: job.theme === 'dark' ? 'dark' : 'light'}, {name: 'prefers-reduced-motion', value: 'no-preference'}]);
  if (job.orientation) await page.emulateMediaFeatures([{name: 'orientation', value: job.orientation}]).catch(() => {});
  const role = job.role || 'Admin';
  const uid = {Admin: 'adm-abdullah', Owner: 'adm-abdullah', Teacher: 'tch-mohammad'}[role] || 'adm-abdullah';
  const seed = {
    'hafiz-identity': JSON.stringify({userId: uid, role}),
    'hafiz-token': fakeToken(role, uid),
    'hafiz-language-new': 'ar',
    'hafiz-theme': job.theme || 'light',
    'hafiz-install-prompt': job.installPrompt ? null : JSON.stringify({dismissals: 1, lastDismissedAt: Date.now()}),
    [`Hafiz-channels-prompt-last-shown:${uid}`]: String(Date.now()),
    ...(job.storage || {}),
  };
  if (job.guest) {
    seed['hafiz-identity'] = null;
    seed['hafiz-token'] = null;
  }
  await page.evaluateOnNewDocument(
    (s, installable, standalone) => {
      if (!sessionStorage.getItem('__seeded')) {
        sessionStorage.setItem('__seeded', '1');
        for (const [k, v] of Object.entries(s)) {
          if (v === null) localStorage.removeItem(k);
          else localStorage.setItem(k, v);
        }
      }
      if (!installable) {
        // no install offer in ordinary pictures (headless Chrome fires a real one for this installable site)
        window.addEventListener('beforeinstallprompt', (e) => { e.stopImmediatePropagation(); e.preventDefault(); }, true);
      }
      if (installable) {
        // pretend Chrome offered the install (the real event never fires in a headless browser)
        window.addEventListener('DOMContentLoaded', () => {
          setTimeout(() => {
            const e = new Event('beforeinstallprompt', {cancelable: true});
            e.prompt = () => Promise.resolve();
            e.userChoice = Promise.resolve({outcome: 'dismissed', platform: 'web'});
            window.dispatchEvent(e);
          }, 50);
        });
      }
    },
    seed,
    !!job.installable,
  );
  page.on('pageerror', (e) => console.log(`  [${job.name}] pageerror: ${e.message.slice(0, 160)}`));
  await page.goto(BASE + job.path, {waitUntil: 'networkidle0', timeout: 60000}).catch((e) => console.log('  goto', e.message));
  await sleep(job.wait ?? 1500);
  for (const st of job.steps || []) {
    try {
      if (st.wait) await sleep(st.wait);
      if (st.click || st.clickText) {
        const r = await findRect(page, st.click ? {sel: st.click, nth: st.nth, scroll: true} : {text: st.clickText, nth: st.nth, closest: st.closest, exact: st.exact, scroll: true});
        if (!r) console.log(`  [${job.name}] not found: ${st.click || st.clickText}`);
        else await sleep(250), await tapAt(page, r[0] + r[2] / 2, r[1] + r[3] / 2);
      }
      if (st.press) {
        const r = await findRect(page, {sel: st.press, nth: st.nth});
        if (!r) console.log(`  [${job.name}] press target not found: ${st.press}`);
        else {
          const cx = r[0] + r[2] / 2, cy = r[1] + r[3] / 2;
          await page.mouse.move(cx, cy);
          await page.mouse.down();
          await sleep(st.hold || 800);
          await page.mouse.up();
        }
      }
      if (st.hold) {
        // a finger held on an element (a long press with touch events, as on a phone)
        const r = await findRect(page, {sel: st.hold, nth: st.nth});
        if (!r) console.log(`  [${job.name}] hold target not found: ${st.hold}`);
        else {
          await page.touchscreen.touchStart(r[0] + r[2] / 2, r[1] + r[3] / 2);
          await sleep(st.ms || 700);
          await page.touchscreen.touchEnd();
        }
      }
      if (st.tapXY) await tapAt(page, st.tapXY[0], st.tapXY[1]);
      if (st.type) await page.keyboard.type(st.type, {delay: 5});
      if (st.focus) await page.focus(st.focus);
      if (st.scrollTo !== undefined) {
        await page.evaluate((y, sel) => {
          const scrollable = (e) => e.scrollHeight > e.clientHeight + 20 && /(auto|scroll)/.test(getComputedStyle(e).overflowY);
          const root = sel && document.querySelector(sel);
          const el = root ? (scrollable(root) ? root : [...root.querySelectorAll('*')].find(scrollable)) : [...document.querySelectorAll('*')].find(scrollable);
          if (el) el.scrollTop = y;
        }, st.scrollTo, st.scroller);
      }
      if (st.eval) await page.evaluate(st.eval);
      await sleep(st.after ?? 700);
    } catch (e) {
      console.log(`  [${job.name}] step failed ${JSON.stringify(st).slice(0, 80)}: ${e.message.slice(0, 120)}`);
    }
  }
  if (job.full) {
    const h = await page.evaluate((sel) => {
      const el = (sel && document.querySelector(sel)) || [...document.querySelectorAll('*')].find((e) => e.scrollHeight > e.clientHeight + 20 && /(auto|scroll)/.test(getComputedStyle(e).overflowY));
      return el ? el.scrollHeight + (window.innerHeight - el.clientHeight) : document.body.scrollHeight;
    }, job.scroller);
    const HH = Math.min(Math.max(H, h), job.maxH || 3200);
    await page.setViewport({width: W, height: HH, deviceScaleFactor: DPR, isMobile: true, hasTouch: true});
    await sleep(1000);
  }
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  await sleep(job.settle ?? 500);
  const marks = {};
  for (const [k, q] of Object.entries(job.marks || {})) {
    marks[k] = await findRect(page, q);
    if (!marks[k]) console.log(`  [${job.name}] mark not found: ${k}`);
  }
  const vp = page.viewport();
  const file = path.join(outDir, `${job.name}.png`);
  await page.screenshot({path: file});
  fs.writeFileSync(path.join(outDir, `${job.name}.json`), JSON.stringify({w: vp.width, h: vp.height, dpr: DPR, marks}, null, 1));
  console.log(`saved ${job.name} ${vp.width}x${vp.height}`);
  await page.close();
}
await browser.close();
