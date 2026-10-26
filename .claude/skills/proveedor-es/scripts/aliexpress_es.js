// Busca en AliExpress España solo artículos con envío desde España (filtro shipFromCountry=ES).
// Uso: node aliexpress_es.js "termino 1" "termino 2"   (requiere playwright; usa el Chromium de /opt/pw-browsers si existe, CHROMIUM_PATH si lo defines, o el que instala `npx playwright install chromium`; usa HTTPS_PROXY solo si está definido)
const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const exe = process.env.CHROMIUM_PATH || (fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined);
  const opts = { headless: false, args: ['--headless=new','--disable-blink-features=AutomationControlled'] };
  if (exe) opts.executablePath = exe;
  if (process.env.HTTPS_PROXY) opts.proxy = { server: process.env.HTTPS_PROXY };
  const b = await chromium.launch(opts);
  const ctx = await b.newContext({ locale: 'es-ES', timezoneId: 'Europe/Madrid', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36' });
  await ctx.addCookies([{ name: 'aep_usuc_f', value: 'site=esp&c_tp=EUR&region=ES&b_locale=es_ES', domain: '.aliexpress.com', path: '/' }]);
  const out = {};
  for (const q of process.argv.slice(2)) {
    const p = await ctx.newPage();
    const url = `https://es.aliexpress.com/w/wholesale-${encodeURIComponent(q.replace(/ /g,'-'))}.html?shipFromCountry=ES&SortType=total_tranpro_desc`;
    try {
      await p.goto(url, { timeout: 40000, waitUntil: 'domcontentloaded' });
      await p.waitForTimeout(6000);
      if (p.url().includes('punish')) { out[q] = 'CAPTCHA'; await p.close(); continue; }
      out[q] = await p.evaluate(() => {
        const items = []; const seen = new Set();
        const walk = (o) => { if (!o || typeof o !== 'object') return;
          if (o.productId && o.prices && !seen.has(o.productId)) { seen.add(o.productId); items.push(o); return; }
          for (const k in o) walk(o[k]); };
        walk(window._dida_config_ && window._dida_config_._init_data_);
        return items.slice(0, 8);
      });
    } catch (e) { out[q] = 'ERR ' + e.message.split('\n')[0]; }
    await p.close();
  }
  for (const [q, items] of Object.entries(out)) {
    console.log(`\n### ${q}`);
    if (typeof items === "string") { console.log(items); continue; }
    for (const it of items) {
      const tags = (it.sellingPoints || []).map(s => s.tagContent && s.tagContent.tagText).filter(t => t && !/monedas/.test(t));
      console.log(`- https://es.aliexpress.com/item/${it.productId}.html | ${it.prices.salePrice.minPrice} € | ${(it.trade || {}).tradeDesc || "-"} | ${(it.evaluation || {}).starRating || "-"}★ | ${it.title.displayTitle.slice(0, 80)} | ${tags.join(" · ")}`);
    }
  }
  await b.close();
})();
