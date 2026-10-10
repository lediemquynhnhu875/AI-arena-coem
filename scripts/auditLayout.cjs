const puppeteer = require("puppeteer");

async function runAudit() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
  });

  const viewports = [
    { name: "Điện thoại (390px)", width: 390, height: 844 },
    { name: "Máy tính (1280px)", width: 1280, height: 800 },
  ];

  const screens = [
    "gate",
    "que_nha",
    "s2",
    "s3",
    "s4",
    "gui_ky_uc",
    "tham_tu",
    "ban_do",
    "dong_thoi_gian",
    "soi_chi_chung",
    "cho_phien"
  ];
  const allResults = {};

  for (const vp of viewports) {
    allResults[vp.name] = {};
    const page = await browser.newPage();
    await page.setViewport({ width: vp.width, height: vp.height });

    // Đặt localStorage để bỏ qua chao_ban intro nếu cần
    await page.goto("http://localhost:3000/?guard=1", { waitUntil: "domcontentloaded" });
    await page.evaluate(() => {
      localStorage.setItem("vpr:has_seen_chao_ban", "1");
    });

    for (const screen of screens) {
      await page.goto(`http://localhost:3000/?guard=1&screen=${screen}`, {
        waitUntil: "networkidle0",
      });

      // Chờ ResizeObserver và layout hoàn tất
      await new Promise((r) => setTimeout(r, 1000));

      const overlaps = await page.evaluate(() => {
        if (typeof window.__vprAudit === "function") {
          return window.__vprAudit();
        }
        return [];
      });

      allResults[vp.name][screen] = overlaps;
    }

    await page.close();
  }

  await browser.close();
  console.log("AUDIT_RESULTS_JSON:" + JSON.stringify(allResults, null, 2));
}

runAudit().catch((err) => {
  console.error("Audit error:", err);
  process.exit(1);
});
