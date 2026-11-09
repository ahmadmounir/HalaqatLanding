// Turns the open landing page (/ar, /en or /tr, 1440 px wide, animations finished) into the 1200 × 630 share card
// #og-card: the hero's logo, eyebrow, headline and product preview, plus the address. See share-images.md.
(() => {
  const hero = document.querySelector("main > section");
  const grid = hero.querySelector(".grid");
  const visual = grid.children[1].cloneNode(true);
  const watermark = hero.querySelector(":scope > svg")?.cloneNode(true);
  const logo = document.querySelector("header a").cloneNode(true);
  const eyebrow = hero.querySelector(".eyebrow").cloneNode(true);
  const h1 = hero.querySelector("h1").cloneNode(true);
  const rtl = document.documentElement.dir === "rtl";

  document.body.innerHTML = "";
  document.body.style.margin = "0";
  document.body.style.overflow = "hidden";

  const card = document.createElement("div");
  card.id = "og-card";
  Object.assign(card.style, {
    position: "relative", width: "1200px", height: "630px", overflow: "hidden", background: "var(--paper)",
    display: "flex", alignItems: "center", gap: "44px", padding: "0 60px", boxSizing: "border-box",
  });

  if (watermark) {
    watermark.removeAttribute("class");
    Object.assign(watermark.style, {
      position: "absolute", insetInlineEnd: "-170px", top: "-120px", width: "760px", height: "760px",
      color: "rgb(13 52 41 / 0.022)", pointerEvents: "none",
    });
    card.appendChild(watermark);
  }

  const text = document.createElement("div");
  Object.assign(text.style, { position: "relative", flex: "0 0 470px", display: "flex", flexDirection: "column" });
  Object.assign(logo.style, {
    transform: "scale(1.25)", transformOrigin: rtl ? "right center" : "left center", alignSelf: "flex-start",
    marginBottom: "44px",
  });
  Object.assign(h1.style, { fontSize: "54px", lineHeight: "1.12", marginTop: "18px" });
  text.append(logo, eyebrow, h1);

  const address = document.createElement("div");
  address.dir = "ltr";
  address.textContent = "alhafiz.app";
  Object.assign(address.style, {
    alignSelf: "flex-start", marginTop: "34px", padding: "10px 20px", borderRadius: "999px", background: "var(--ink)",
    color: "#fff", fontSize: "20px", fontWeight: "600", display: "inline-flex", alignItems: "center", gap: "10px",
    fontFamily: "var(--font-plex), sans-serif",
  });
  const dot = document.createElement("span");
  Object.assign(dot.style, { width: "9px", height: "9px", borderRadius: "50%", background: "var(--gold)" });
  address.prepend(dot);
  text.appendChild(address);

  const holder = document.createElement("div");
  Object.assign(holder.style, {
    position: "relative", flex: "1 1 auto", display: "flex", justifyContent: "center", alignItems: "center",
  });
  Object.assign(visual.style, { width: "540px", flex: "0 0 540px" });
  holder.appendChild(visual);

  card.append(text, holder);
  document.body.appendChild(card);
})();
