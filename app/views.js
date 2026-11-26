// views.js — one render function per page. Each returns an HTML string for
// the #view element. Charts come from charts.js; figures come from data.js.

function esc(text) {
  return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function sourceNote(text) {
  return '<p class="source">Source: ' + esc(text) + '</p>';
}

function kpiCard(h) {
  return '<a class="kpi" href="' + h.route + '"><span class="kpi-name">' + esc(h.name) + '</span>' +
    '<span class="kpi-value">' + esc(h.value) + '</span>' +
    '<span class="kpi-note">' + esc(h.note) + '</span>' +
    '<span class="kpi-src">' + esc(h.source) + '</span></a>';
}

function chartCard(title, subtitle, chartHtml, source) {
  return '<section class="card chart-card"><h2>' + esc(title) + '</h2>' +
    (subtitle ? '<p class="card-sub">' + esc(subtitle) + '</p>' : "") +
    '<div class="chart">' + chartHtml + '</div>' + sourceNote(source) + '</section>';
}

function sortableTable(headers, rows, caption) {
  let html = '<table class="sortable"><caption>' + esc(caption) + '</caption><thead><tr>';
  headers.forEach(function (h, i) {
    html += '<th data-col="' + i + '" data-key="' + esc(h.key) + '">' + esc(h.label) + ' <span class="sort-mark" aria-hidden="true"></span></th>';
  });
  html += '</tr></thead><tbody>';
  rows.forEach(function (row) {
    html += '<tr>' + row.map(function (cell) { return '<td>' + esc(cell) + '</td>'; }).join("") + '</tr>';
  });
  html += '</tbody></table>';
  return html;
}

function rangeButtons(state) {
  const ranges = [
    { id: "all", label: "2020–2024" },
    { id: "2020-2022", label: "2020–2022" },
    { id: "2022-2024", label: "2022–2024" },
  ];
  return '<div class="controls" role="group" aria-label="Year range">' +
    ranges.map(function (r) {
      return '<button type="button" class="chip' + (state.range === r.id ? ' active' : '') + '" data-range="' + r.id + '">' + r.label + '</button>';
    }).join("") + '</div>';
}

function seriesInRange(series, range) {
  if (range === "2020-2022") return series.filter(function (p) { return p[0] <= 2022; });
  if (range === "2022-2024") return series.filter(function (p) { return p[0] >= 2022; });
  return series;
}

function renderOverview(state) {
  const metrics = [
    { id: "population", label: "Population" },
    { id: "gdpGrowth", label: "GDP growth" },
    { id: "cpi", label: "Inflation" },
    { id: "unemployment", label: "Unemployment" },
    { id: "medianIncome", label: "Household income" },
    { id: "trade", label: "Trade" },
  ];
  const series = SERIES[state.metric];
  const sliced = seriesInRange(series.values, state.range);
  const decimals = state.metric === "population" ? 2 : (state.metric === "medianIncome" || state.metric === "trade" ? 0 : 1);
  let html = '<section class="hero"><h1>Singapore in figures</h1>' +
    '<p class="lede">Six million people, one small island, and an economy that trades more than twice its own output. ' +
    'This site gathers the headline numbers — population, economy, work, prices, health, schooling, housing and trade — ' +
    'each with its source and year, so you can check it yourself.</p>' +
    '<p class="meta">' + esc(SITE.updated) + ' All figures are for Singapore unless a page says otherwise.</p></section>';

  html += '<section class="kpi-grid" aria-label="Headline indicators">' +
    HEADLINES.map(kpiCard).join("") + '</section>';

  html += '<section class="card chart-card"><h2>Five years at a glance</h2>' +
    '<p class="card-sub">Pick a measure, then pick the years. The chart redraws itself.</p>' +
    '<div class="controls" role="group" aria-label="Measure">' +
    metrics.map(function (m) {
      return '<button type="button" class="chip' + (state.metric === m.id ? ' active' : '') + '" data-metric="' + m.id + '">' + m.label + '</button>';
    }).join("") + '</div>' +
    rangeButtons(state) +
    '<div class="chart">' + lineChart(sliced, { decimals: decimals, unit: series.unit === "%" ? "%" : "" }) + '</div>' +
    '<p class="card-sub"><strong>' + esc(series.label) + '.</strong> ' + esc(series.source) + '</p></section>';

  html += '<section class="card"><h2>Indicator index</h2>' +
    '<p class="card-sub">Every headline figure on this site, in one list. Type to filter it, or click a column heading to sort.</p>' +
    '<label class="search-label" for="indicator-search">Search indicators</label>' +
    '<input id="indicator-search" type="search" placeholder="Try “income”, “trade” or “life expectancy”…" autocomplete="off">' +
    '<div class="table-wrap"><table class="sortable" id="indicator-index"><caption>Headline indicators, latest year available</caption>' +
    '<thead><tr><th data-col="0">Indicator <span class="sort-mark"></span></th><th data-col="1">Value <span class="sort-mark"></span></th><th data-col="2">Year <span class="sort-mark"></span></th><th data-col="3">Source <span class="sort-mark"></span></th></tr></thead><tbody>' +
    INDICATORS.map(function (d) {
      return '<tr><td><a href="' + d.route + '">' + esc(d.name) + '</a></td><td>' + esc(d.value) + '</td><td>' + d.year + '</td><td>' + esc(d.source) + '</td></tr>';
    }).join("") + '</tbody></table></div>' +
    '<p class="card-sub" id="index-count">' + INDICATORS.length + ' indicators listed.</p></section>';

  html += '<section class="card"><h2>Start exploring</h2><div class="link-grid">' +
    '<a href="#/population">Population — who lives here, and how the mix is changing</a>' +
    '<a href="#/economy">Economy — output, growth and what the economy is made of</a>' +
    '<a href="#/labour">Labour &amp; income — jobs, pay and the income gap</a>' +
    '<a href="#/prices">Prices — what inflation did, and what it cost</a>' +
    '<a href="#/health">Health — how long people live, and how healthy the start is</a>' +
    '<a href="#/education">Education — how students score, and who can read</a>' +
    '<a href="#/housing">Housing — who owns, who rents, and what it costs</a>' +
    '<a href="#/trade">Trade — what Singapore buys, sells, and with whom</a>' +
    '<a href="#/methods">Methods &amp; sources — how every number was counted</a>' +
    '</div></section>';

  // A short reading guide: what changed most in 2024, in one place.
  html += '<section class="card"><h2>The year in one paragraph</h2>' +
    '<p>2024 was a recovery year with a cooling cost of living. The economy grew 4.4% after a slow 2023, ' +
    'inflation fell from 6.1% in 2022 to 2.4%, and the typical household earned more after inflation for the first time in a while. ' +
    'At the same time the population passed 6 million, fertility fell to 0.97, and trade bounced back to S$1.29 trillion. ' +
    'Every claim in that paragraph is a figure on this site, with its source next to it.</p></section>';
  return html;
}

function renderPopulation(state) {
  const sliced = seriesInRange(SERIES.population.values, state.range);
  let html = '<section class="hero"><h1>Population</h1>' +
    '<p class="lede">Singapore passed 6 million people in June 2024. Two in three residents are citizens, ' +
    'one in eight is a permanent resident, and nearly a third of everyone on the island is a non-resident — ' +
    'the mix that keeps the workforce and the city growing.</p></section>';
  html += '<section class="kpi-grid">' +
    kpiCard({ name: "Total population", value: "6.04m", note: "June 2024, +2.0% on 2023", source: SOURCES.nptd, route: "#/population" }) +
    kpiCard({ name: "Residents", value: "4.18m", note: "Citizens 3.64m + permanent residents 0.54m", source: SOURCES.nptd, route: "#/population" }) +
    kpiCard({ name: "Non-residents", value: "1.86m", note: "30.7% of the total population", source: SOURCES.nptd, route: "#/population" }) +
    kpiCard({ name: "Total fertility rate", value: "0.97", note: "Births per woman, 2024", source: SOURCES.dos_pop, route: "#/population" }) +
    '</section>';
  html += chartCard("Total population, 2020–2024", "Millions of people at June each year. Use the year buttons to zoom in.",
    rangeButtons(state) + '<div class="chart">' + lineChart(sliced, { decimals: 2 }) + '</div>', SOURCES.dos_pop);
  html += '<section class="card duo"><div>' + chartCard("Who lives here", "Share of the total population, June 2024",
    '<div class="chart">' + donutChart(POPULATION.byStatus.map(function (d) { return { label: d.label, value: d.value / 6.037 * 100 }; }), { centreLabel: "6.04m people" }) + '</div>' +
    legendList(POPULATION.byStatus.map(function (d) { return { label: d.label, value: d.value / 6.037 * 100 }; })), SOURCES.nptd) +
    '</div><div>' + chartCard("Resident population by ethnic group", "Share of residents, 2024",
    '<div class="chart">' + barChart(POPULATION.ethnic, { decimals: 1, unit: "%" }) + '</div>', SOURCES.dos_pop) + '</div></section>';
  html += '<section class="card"><h2>Age structure</h2><p class="card-sub">Resident population by age band, 2024 (estimate). The 65-and-over band is now nearly a fifth of residents.</p>' +
    '<div class="chart">' + barChart(POPULATION.ageGroups, { decimals: 0, unit: "%" }) + '</div>' + sourceNote(SOURCES.dos_pop + " (age shares are estimates)") + '</section>';
  html += '<section class="card"><h2>What the numbers say</h2><ul class="notes">' +
    POPULATION.notes.map(function (n) { return '<li>' + esc(n) + '</li>'; }).join("") + '</ul></section>';
  return html;
}

function renderEconomy(state) {
  const sliced = seriesInRange(SERIES.gdpGrowth.values, state.range);
  let html = '<section class="hero"><h1>Economy</h1>' +
    '<p class="lede">Singapore\'s economy was worth about US$547 billion in 2024 — roughly US$90,700 per person. ' +
    'It grew 4.4% in real terms after a slow 2023, powered by trade, finance and electronics, ' +
    'with services producing nearly three quarters of everything the country makes.</p></section>';
  html += '<section class="kpi-grid">' +
    kpiCard({ name: "GDP, nominal", value: "US$547bn", note: "2024, current prices", source: SOURCES.imf, route: "#/economy" }) +
    kpiCard({ name: "GDP per person", value: "US$90,674", note: "Nominal, 2024", source: SOURCES.imf, route: "#/economy" }) +
    kpiCard({ name: "GDP per person (PPP)", value: "US$132,600", note: "Purchasing power parity, 2024", source: SOURCES.imf, route: "#/economy" }) +
    kpiCard({ name: "Real GDP growth", value: "+4.4%", note: "2024, after +1.8% in 2023", source: SOURCES.wb, route: "#/economy" }) +
    '</section>';
  html += chartCard("Real GDP growth, 2020–2024", "Annual change in real GDP, %. The 2021 rebound followed the 2020 pandemic contraction.",
    rangeButtons(state) + '<div class="chart">' + lineChart(sliced, { decimals: 1, unit: "%" }) + '</div>', SOURCES.wb);
  html += '<section class="card duo"><div>' + chartCard("What the economy is made of", "Share of GDP by sector, 2024",
    donutChart(ECONOMY.gdpBySector, { centreLabel: "of GDP" }) + legendList(ECONOMY.gdpBySector), SOURCES.imf) +
    '</div><div><h2>Five years of growth</h2><p class="card-sub">Click a column heading to sort the table.</p>' +
    '<div class="table-wrap">' + sortableTable(
      [{ key: "year", label: "Year" }, { key: "gdp", label: "GDP (US$ bn)" }, { key: "growth", label: "Growth (%)" }, { key: "cpi", label: "CPI (%)" }, { key: "unemp", label: "Unemployment (%)" }],
      ECONOMY.gdpTable.map(function (r) { return [String(r.year), r.gdpUsd.toFixed(1), (r.growth > 0 ? "+" : "") + r.growth.toFixed(1), r.cpi.toFixed(1), r.unemp.toFixed(1)]; }),
      "GDP, growth, inflation and unemployment, 2020–2024") + '</div>' + sourceNote(SOURCES.wb + "; " + SOURCES.imf) + '</div></section>';
  return html;
}

function renderLabour(state) {
  const sliced = seriesInRange(SERIES.medianIncome.values, state.range);
  let html = '<section class="hero"><h1>Labour &amp; income</h1>' +
    '<p class="lede">About 3.7 million people work in Singapore, and seven in ten residents of working age are in the labour force. ' +
    'The typical household earned S$11,297 a month from work in 2024 — up 1.4% after inflation — ' +
    'and government transfers pushed inequality to its lowest recorded level.</p></section>';
  html += '<section class="kpi-grid">' +
    kpiCard({ name: "Labour force", value: "3.72m", note: "2024 estimate", source: SOURCES.imf, route: "#/labour" }) +
    kpiCard({ name: "Participation rate", value: "69.8%", note: "Residents aged 15+, 2024", source: SOURCES.imf, route: "#/labour" }) +
    kpiCard({ name: "Unemployment (ILO)", value: "3.2%", note: "Modelled estimate, 2024", source: SOURCES.wb, route: "#/labour" }) +
    kpiCard({ name: "Median household income", value: "S$11,297", note: "Per month from work, 2024", source: SOURCES.dos_income, route: "#/labour" }) +
    '</section>';
  html += chartCard("Median monthly household income from work, 2020–2024", "Singapore dollars per month, resident employed households, including employer CPF contributions.",
    rangeButtons(state) + '<div class="chart">' + lineChart(sliced, { decimals: 0 }) + '</div>', SOURCES.dos_income);
  html += '<section class="card duo"><div>' + chartCard("Unemployment, 2020–2024", "% of the labour force (ILO modelled estimate).",
    '<div class="chart">' + lineChart(SERIES.unemployment.values, { decimals: 1, unit: "%", color: "#e0654a" }) + '</div>', SOURCES.wb) +
    '</div><div><h2>Pay depends on where you live</h2><p class="card-sub">Median monthly household income from work by dwelling type, S$, 2024. Click a column heading to sort.</p>' +
    '<div class="table-wrap">' + sortableTable(
      [{ key: "dwelling", label: "Dwelling type" }, { key: "income", label: "Median income (S$)" }],
      LABOUR.byDwellingIncome.map(function (d) { return [d.label, d.value.toLocaleString("en-SG")]; }),
      "Median household income by dwelling type, 2024") + '</div>' + sourceNote(SOURCES.dos_income) + '</div></section>';
  html += '<section class="card"><h2>What the numbers say</h2><ul class="notes">' +
    LABOUR.notes.map(function (n) { return '<li>' + esc(n) + '</li>'; }).join("") + '</ul></section>';
  return html;
}

function renderPrices() {
  let html = '<section class="hero"><h1>Prices</h1>' +
    '<p class="lede">Inflation ran hot in 2022 at 6.1%, then cooled fast: 4.8% in 2023 and 2.4% in 2024. ' +
    'Food and housing still rose faster than the average in 2024, while transport price growth eased.</p></section>';
  html += '<section class="kpi-grid">' +
    kpiCard({ name: "CPI inflation", value: "2.4%", note: "2024, down from 4.8% in 2023", source: SOURCES.wb, route: "#/prices" }) +
    kpiCard({ name: "Core inflation (MAS)", value: "2.7%", note: "Excludes accommodation and private transport, 2024", source: SOURCES.mas, route: "#/prices" }) +
    kpiCard({ name: "Peak inflation", value: "6.1%", note: "2022 — the highest in over a decade", source: SOURCES.wb, route: "#/prices" }) +
    kpiCard({ name: "2020 inflation", value: "-0.2%", note: "Prices fell slightly in the pandemic year", source: SOURCES.wb, route: "#/prices" }) +
    '</section>';
  html += chartCard("Consumer price inflation, 2020–2024", "Annual change in the consumer price index, %.",
    '<div class="chart">' + lineChart(SERIES.cpi.values, { decimals: 1, unit: "%", color: "#e0654a" }) + '</div>', SOURCES.wb);
  html += '<section class="card"><h2>Where prices moved in 2024</h2>' +
    '<p class="card-sub">Approximate CPI group weights and indicative annual price changes. Click a column heading to sort.</p>' +
    '<div class="table-wrap">' + sortableTable(
      [{ key: "group", label: "Spending group" }, { key: "weight", label: "Weight in CPI (%)" }, { key: "change", label: "Price change 2024 (%)" }],
      PRICES.cpiGroups.map(function (g) { return [g.group, g.weight.toFixed(1), "+" + g.change.toFixed(1)]; }),
      "CPI groups, weights and 2024 price changes") + '</div>' + sourceNote(PRICES.note + " " + SOURCES.dos_pop) + '</section>';
  return html;
}

function renderHealth() {
  let html = '<section class="hero"><h1>Health</h1>' +
    '<p class="lede">A baby born in Singapore in 2024 can expect to live 83.3 years — among the longest lives on earth. ' +
    'Women outlive men by about four and a half years, and only about two babies in a thousand do not reach their first birthday.</p></section>';
  html += '<section class="kpi-grid">' +
    kpiCard({ name: "Life expectancy", value: "83.3 yrs", note: "At birth, both sexes, 2024", source: SOURCES.wb, route: "#/health" }) +
    kpiCard({ name: "Life expectancy, men", value: "80.7 yrs", note: "At birth, 2023", source: SOURCES.imf, route: "#/health" }) +
    kpiCard({ name: "Life expectancy, women", value: "85.2 yrs", note: "At birth, 2023", source: SOURCES.imf, route: "#/health" }) +
    kpiCard({ name: "Infant mortality", value: "2.2", note: "Deaths per 1,000 live births, 2024", source: SOURCES.wb, route: "#/health" }) +
    '</section>';
  html += chartCard("Life expectancy at birth", "Years. Women live longer than men by roughly four and a half years.",
    '<div class="chart">' + barChart(HEALTH.lifeExpectancy.map(function (d) { return { label: d.label + " (" + d.year + ")", value: d.value }; }), { decimals: 1, color: "#0f766e" }) + '</div>',
    SOURCES.wb + "; " + SOURCES.imf);
  html += '<section class="card"><h2>What the numbers say</h2><ul class="notes">' +
    HEALTH.notes.map(function (n) { return '<li>' + esc(n) + '</li>'; }).join("") + '</ul></section>';
  return html;
}

function renderEducation() {
  let html = '<section class="hero"><h1>Education</h1>' +
    '<p class="lede">Singapore\'s 15-year-olds topped the world in the 2022 PISA tests — first in mathematics, reading and science. ' +
    'Nearly everyone can read, and about a third of adults over 25 holds a university degree.</p></section>';
  html += '<section class="kpi-grid">' +
    kpiCard({ name: "PISA mathematics", value: "575", note: "OECD average 472, 2022", source: SOURCES.oecd, route: "#/education" }) +
    kpiCard({ name: "PISA reading", value: "543", note: "OECD average 476, 2022", source: SOURCES.oecd, route: "#/education" }) +
    kpiCard({ name: "PISA science", value: "561", note: "OECD average 485, 2022", source: SOURCES.oecd, route: "#/education" }) +
    kpiCard({ name: "Adult literacy", value: "≈97%", note: "Residents aged 15+, 2023 (estimate)", source: SOURCES.dos_pop, route: "#/education" }) +
    '</section>';
  html += '<section class="card duo"><div>' + chartCard("PISA 2022 scores vs the OECD average", "Singapore vs the average of OECD countries.",
    '<div class="chart">' + barChart(EDUCATION.pisa.map(function (p) { return { label: p.subject, value: p.score, color: "#0f766e" }; }), { decimals: 0 }) + '</div>', SOURCES.oecd) +
    '</div><div><h2>Singapore vs the OECD average</h2><p class="card-sub">PISA 2022 mean scores. Click a column heading to sort.</p>' +
    '<div class="table-wrap">' + sortableTable(
      [{ key: "subject", label: "Subject" }, { key: "sg", label: "Singapore" }, { key: "oecd", label: "OECD average" }, { key: "gap", label: "Gap" }],
      EDUCATION.pisa.map(function (p) { return [p.subject, String(p.score), String(p.oecdAvg), "+" + (p.score - p.oecdAvg)]; }),
      "PISA 2022 scores, Singapore and OECD average") + '</div>' + sourceNote(SOURCES.oecd) + '</div></section>';
  html += '<section class="card"><h2>What the numbers say</h2><ul class="notes">' +
    EDUCATION.notes.map(function (n) { return '<li>' + esc(n) + '</li>'; }).join("") + '</ul></section>';
  return html;
}

function renderHousing() {
  let html = '<section class="hero"><h1>Housing</h1>' +
    '<p class="lede">Nine in ten resident households own their home, and about four in five residents live in a flat built by the Housing &amp; Development Board. ' +
    'Private home prices rose 3.9% in 2024, while resale public flat prices climbed faster, at about 9.6%.</p></section>';
  html += '<section class="kpi-grid">' +
    HOUSING.kpis.map(function (k) {
      return kpiCard({ name: k.name, value: k.value, note: k.note, source: SOURCES.hdb, route: "#/housing" });
    }).join("") + '</section>';
  html += chartCard("Median household income by dwelling type, 2024", "Singapore dollars per month from work. Homes track incomes closely: landed properties earn about seven times what a one-room flat household does.",
    '<div class="chart">' + barChart(LABOUR.byDwellingIncome, { decimals: 0, color: "#14324a" }) + '</div>', SOURCES.dos_income);
  html += '<section class="card"><h2>What the numbers say</h2><ul class="notes">' +
    HOUSING.notes.map(function (n) { return '<li>' + esc(n) + '</li>'; }).join("") + '</ul></section>';
  return html;
}

function renderTrade(state) {
  const sliced = seriesInRange(SERIES.trade.values, state.range);
  let html = '<section class="hero"><h1>Trade</h1>' +
    '<p class="lede">Singapore buys and sells far more than it makes: total merchandise trade reached S$1.29 trillion in 2024, ' +
    'more than one and three-quarter times GDP. Add services and the island traded nearly S$2.3 trillion with the world in a single year.</p></section>';
  html += '<section class="kpi-grid">' +
    kpiCard({ name: "Merchandise trade", value: "S$1.29tn", note: "2024, +6.6% on 2023", source: SOURCES.esg, route: "#/trade" }) +
    kpiCard({ name: "Merchandise exports", value: "S$674.5bn", note: "2024", source: SOURCES.esg, route: "#/trade" }) +
    kpiCard({ name: "Merchandise imports", value: "S$611.4bn", note: "2024", source: SOURCES.esg, route: "#/trade" }) +
    kpiCard({ name: "Services trade", value: "S$998bn", note: "2024, +8.6% on 2023", source: SOURCES.esg, route: "#/trade" }) +
    '</section>';
  html += chartCard("Total merchandise trade, 2020–2024", "S$ billion. Trade fell in 2023, then recovered in 2024.",
    rangeButtons(state) + '<div class="chart">' + lineChart(sliced, { decimals: 0 }) + '</div>', SOURCES.esg);
  html += '<section class="card duo"><div>' + chartCard("Biggest trading partners, 2024", "Total merchandise trade, S$ billion (rounded).",
    '<div class="chart">' + barChart(TRADE.partners.map(function (p) { return { label: p.partner, value: p.value }; }), { decimals: 0, color: "#0f766e" }) + '</div>',
    SOURCES.esg + " (partner values are rounded approximations)") +
    '</div><div><h2>What Singapore trades</h2><p class="card-sub">Goods and services, S$ billion, 2024. Click a column heading to sort.</p>' +
    '<div class="table-wrap">' + sortableTable(
      [{ key: "component", label: "Component" }, { key: "value", label: "S$ billion" }],
      TRADE.components.map(function (c) { return [c.label, c.value.toFixed(1)]; }),
      "Trade components, 2024") + '</div>' + sourceNote(SOURCES.esg + " (services split is an approximation)") + '</div></section>';
  html += '<section class="card"><h2>What the numbers say</h2><ul class="notes">' +
    TRADE.notes.map(function (n) { return '<li>' + esc(n) + '</li>'; }).join("") + '</ul></section>';
  return html;
}

function renderMethods() {
  let html = '<section class="hero"><h1>Methods &amp; sources</h1>' +
    '<p class="lede">A number is only useful if you know how it was counted. This page says where every figure on the site came from, ' +
    'what the words mean, and where the numbers are rounded or approximate.</p></section>';
  html += '<section class="card"><dl class="methods">' +
    METHODS.map(function (m) {
      return '<div><dt>' + esc(m.topic) + '</dt><dd>' + esc(m.text) + '</dd></div>';
    }).join("") + '</dl></section>';
  html += '<section class="card"><h2>Sources used on this site</h2><ul class="notes">' +
    Object.keys(SOURCES).map(function (k) { return '<li>' + esc(SOURCES[k]) + '</li>'; }).join("") +
    '</ul><p class="card-sub">Figures are quoted as published; where a source later revises a number, this site shows the figure as it stood when the page was written. ' +
    'This site is an independent, original work. It is not affiliated with, or endorsed by, any government body or statistics office.</p></section>';
  return html;
}

const VIEWS = {
  overview: renderOverview,
  population: renderPopulation,
  economy: renderEconomy,
  labour: renderLabour,
  prices: renderPrices,
  health: renderHealth,
  education: renderEducation,
  housing: renderHousing,
  trade: renderTrade,
  methods: renderMethods,
};
