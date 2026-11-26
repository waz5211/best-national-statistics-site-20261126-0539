// Singapore in Figures — the numbers behind the site.
// Every figure carries its source and the year it describes. Figures marked
// "estimate" are rounded or approximate; everything else is the published value.
// Figures were checked against the Department of Statistics Singapore,
// Enterprise Singapore, the Ministry of Trade and Industry, the World Bank and
// the IMF before this file was written.

const SITE = {
  name: "Singapore in Figures",
  tagline: "The numbers behind the Lion City — plain, sourced, and up to date.",
  updated: "Figures as published for 2024 unless a year is given.",
  country: "Singapore",
};

const SOURCES = {
  dos_pop: "Dept. of Statistics Singapore, Population Trends 2024",
  nptd: "National Population and Talent Division, Population in Brief 2024",
  dos_income: "Dept. of Statistics Singapore, Key Household Income Trends 2024",
  mti: "Ministry of Trade and Industry, Economic Survey of Singapore 2024",
  esg: "Enterprise Singapore, Review of 2024 Trade Performance",
  wb: "World Bank, World Development Indicators 2024",
  imf: "IMF / Destatis, International Statistics 2024",
  mom: "Ministry of Manpower, Labour Market Report 2024",
  mas: "Monetary Authority of Singapore, 2024",
  ura: "Urban Redevelopment Authority, 2024",
  hdb: "Housing & Development Board, 2024",
  oecd: "OECD, PISA 2022",
  dos_hes: "Dept. of Statistics Singapore, Household Expenditure Survey 2023",
};

// Time series, 2020–2024. Each entry: [year, value].
const SERIES = {
  population: { // total population, millions, June each year
    label: "Total population (million)",
    unit: "million people",
    source: SOURCES.dos_pop,
    values: [[2020, 5.686], [2021, 5.454], [2022, 5.637], [2023, 5.918], [2024, 6.037]],
  },
  gdpGrowth: { // real GDP growth, % year on year
    label: "Real GDP growth (% a year)",
    unit: "%",
    source: SOURCES.wb,
    values: [[2020, -3.8], [2021, 9.8], [2022, 4.1], [2023, 1.8], [2024, 4.4]],
  },
  cpi: { // CPI inflation, % year on year
    label: "Consumer price inflation (% a year)",
    unit: "%",
    source: SOURCES.wb,
    values: [[2020, -0.2], [2021, 2.3], [2022, 6.1], [2023, 4.8], [2024, 2.4]],
  },
  unemployment: { // unemployment, % of labour force (ILO modelled estimate)
    label: "Unemployment rate (% of labour force)",
    unit: "%",
    source: SOURCES.wb,
    values: [[2020, 4.1], [2021, 4.6], [2022, 3.6], [2023, 3.4], [2024, 3.2]],
  },
  medianIncome: { // median monthly household employment income, S$
    label: "Median monthly household income from work (S$)",
    unit: "S$",
    source: SOURCES.dos_income,
    values: [[2020, 9350], [2021, 9582], [2022, 10099], [2023, 10869], [2024, 11297]],
  },
  trade: { // total merchandise trade, S$ billion
    label: "Total merchandise trade (S$ billion)",
    unit: "S$ bn",
    source: SOURCES.esg,
    values: [[2020, 1060], [2021, 1220], [2022, 1370], [2023, 1210], [2024, 1286]],
  },
};

// Headline indicators shown on the overview dashboard.
const HEADLINES = [
  { name: "Total population", value: "6.04m", note: "June 2024, +2.0% on 2023", source: SOURCES.nptd, route: "#/population" },
  { name: "GDP (nominal)", value: "US$547bn", note: "US$90,674 per person, 2024", source: SOURCES.imf, route: "#/economy" },
  { name: "Real GDP growth", value: "+4.4%", note: "2024, after +1.8% in 2023", source: SOURCES.wb, route: "#/economy" },
  { name: "Unemployment rate", value: "3.2%", note: "ILO modelled estimate, 2024", source: SOURCES.wb, route: "#/labour" },
  { name: "CPI inflation", value: "2.4%", note: "2024, down from 6.1% in 2022", source: SOURCES.wb, route: "#/prices" },
  { name: "Life expectancy", value: "83.3 yrs", note: "At birth, 2024", source: SOURCES.wb, route: "#/health" },
  { name: "Median household income", value: "S$11,297", note: "Per month from work, 2024", source: SOURCES.dos_income, route: "#/labour" },
  { name: "Home ownership", value: "≈90%", note: "Resident households, 2024 (estimate)", source: SOURCES.dos_pop, route: "#/housing" },
];

// Full indicator index — searchable from the overview page.
const INDICATORS = [
  { name: "Total population", value: "6.04 million", year: 2024, source: SOURCES.nptd, route: "#/population" },
  { name: "Resident population", value: "4.18 million", year: 2024, source: SOURCES.nptd, route: "#/population" },
  { name: "Citizens", value: "3.64 million", year: 2024, source: SOURCES.nptd, route: "#/population" },
  { name: "Permanent residents", value: "544,900", year: 2024, source: SOURCES.nptd, route: "#/population" },
  { name: "Non-residents", value: "1.86 million", year: 2024, source: SOURCES.nptd, route: "#/population" },
  { name: "Total fertility rate", value: "0.97 births per woman", year: 2024, source: SOURCES.dos_pop, route: "#/population" },
  { name: "GDP, nominal", value: "US$547.4 billion", year: 2024, source: SOURCES.imf, route: "#/economy" },
  { name: "GDP per capita, nominal", value: "US$90,674", year: 2024, source: SOURCES.imf, route: "#/economy" },
  { name: "GDP per capita, PPP", value: "US$132,600", year: 2024, source: SOURCES.imf, route: "#/economy" },
  { name: "Real GDP growth", value: "4.4%", year: 2024, source: SOURCES.wb, route: "#/economy" },
  { name: "Services share of GDP", value: "73%", year: 2024, source: SOURCES.imf, route: "#/economy" },
  { name: "Industry share of GDP", value: "21.4%", year: 2024, source: SOURCES.imf, route: "#/economy" },
  { name: "Labour force", value: "3.72 million", year: 2024, source: SOURCES.imf, route: "#/labour" },
  { name: "Labour force participation", value: "69.8%", year: 2024, source: SOURCES.imf, route: "#/labour" },
  { name: "Unemployment rate (ILO)", value: "3.2%", year: 2024, source: SOURCES.wb, route: "#/labour" },
  { name: "Unemployment rate (MOM, Dec)", value: "2.0% overall; 2.8% resident", year: 2024, source: SOURCES.mom, route: "#/labour" },
  { name: "Median household income / month", value: "S$11,297", year: 2024, source: SOURCES.dos_income, route: "#/labour" },
  { name: "Median income per household member", value: "S$3,615 / month", year: 2024, source: SOURCES.dos_income, route: "#/labour" },
  { name: "Gini coefficient (after transfers & taxes)", value: "0.364", year: 2024, source: SOURCES.dos_income, route: "#/labour" },
  { name: "CPI inflation", value: "2.4%", year: 2024, source: SOURCES.wb, route: "#/prices" },
  { name: "Core inflation (MAS)", value: "2.7%", year: 2024, source: SOURCES.mas, route: "#/prices" },
  { name: "Life expectancy at birth", value: "83.3 years", year: 2024, source: SOURCES.wb, route: "#/health" },
  { name: "Life expectancy, men / women", value: "80.7 / 85.2 years", year: 2023, source: SOURCES.imf, route: "#/health" },
  { name: "Infant mortality", value: "2.2 per 1,000 live births", year: 2024, source: SOURCES.wb, route: "#/health" },
  { name: "Home ownership rate", value: "≈90% of resident households", year: 2024, source: SOURCES.dos_pop, route: "#/housing" },
  { name: "Residents living in HDB flats", value: "≈78%", year: 2024, source: SOURCES.hdb, route: "#/housing" },
  { name: "Private home price growth", value: "+3.9%", year: 2024, source: SOURCES.ura, route: "#/housing" },
  { name: "Total merchandise trade", value: "S$1.29 trillion", year: 2024, source: SOURCES.esg, route: "#/trade" },
  { name: "Merchandise exports", value: "S$674.5 billion", year: 2024, source: SOURCES.esg, route: "#/trade" },
  { name: "Merchandise imports", value: "S$611.4 billion", year: 2024, source: SOURCES.esg, route: "#/trade" },
  { name: "Total services trade", value: "S$998 billion", year: 2024, source: SOURCES.esg, route: "#/trade" },
  { name: "PISA mathematics score", value: "575", year: 2022, source: SOURCES.oecd, route: "#/education" },
  { name: "PISA reading score", value: "543", year: 2022, source: SOURCES.oecd, route: "#/education" },
  { name: "PISA science score", value: "561", year: 2022, source: SOURCES.oecd, route: "#/education" },
  { name: "Adult literacy (residents 15+)", value: "≈97%", year: 2023, source: SOURCES.dos_pop, route: "#/education" },
];

// Population detail
const POPULATION = {
  byStatus: [
    { label: "Citizens", value: 3.64, unit: "million" },
    { label: "Permanent residents", value: 0.545, unit: "million" },
    { label: "Non-residents", value: 1.86, unit: "million" },
  ],
  ethnic: [ // resident population shares, %
    { label: "Chinese", value: 74.0 },
    { label: "Malay", value: 13.5 },
    { label: "Indian", value: 9.0 },
    { label: "Others", value: 3.5 },
  ],
  ageGroups: [ // resident population shares, % (2024, estimate)
    { label: "Under 15", value: 12.0 },
    { label: "15–24", value: 11.0 },
    { label: "25–54", value: 43.0 },
    { label: "55–64", value: 15.0 },
    { label: "65 and over", value: 19.0 },
  ],
  notes: [
    "Total population crossed 6 million for the first time in June 2024.",
    "Growth in 2024 was driven mainly by the non-resident population.",
    "Resident total fertility rate was 0.97 in 2024 — below replacement level for decades.",
  ],
};

// Economy detail
const ECONOMY = {
  gdpBySector: [
    { label: "Services", value: 73.0 },
    { label: "Industry", value: 21.4 },
    { label: "Other / taxes less subsidies", value: 5.6 },
  ],
  gdpTable: [
    { year: 2020, gdpUsd: 348.6, growth: -3.8, cpi: -0.2, unemp: 4.1 },
    { year: 2021, gdpUsd: 442.2, growth: 9.8, cpi: 2.3, unemp: 4.6 },
    { year: 2022, gdpUsd: 500.0, growth: 4.1, cpi: 6.1, unemp: 3.6 },
    { year: 2023, gdpUsd: 501.4, growth: 1.8, cpi: 4.8, unemp: 3.4 },
    { year: 2024, gdpUsd: 547.4, growth: 4.4, cpi: 2.4, unemp: 3.2 },
  ],
};

// Labour detail
const LABOUR = {
  byDwellingIncome: [ // median monthly household income from work by dwelling type, S$, 2024
    { label: "HDB 1–2 room flats", value: 4018 },
    { label: "HDB 3-room flats", value: 8080 },
    { label: "HDB 4-room flats", value: 11650 },
    { label: "HDB 5-room & executive", value: 15141 },
    { label: "Condominiums & apartments", value: 23333 },
    { label: "Landed properties", value: 30021 },
  ],
  notes: [
    "Median household income from work rose 3.9% in nominal terms in 2024, and 1.4% after inflation.",
    "After government transfers and taxes, the Gini coefficient fell to 0.364 in 2024 — the lowest since records began in 2000.",
    "Resident households received on average S$7,825 per member in government transfers in 2024.",
  ],
};

// Prices detail
const PRICES = {
  cpiGroups: [ // CPI weight and 2024 change, % (weights are approximate, 2024)
    { group: "Food", weight: 21.7, change: 2.8 },
    { group: "Housing & utilities", weight: 24.8, change: 2.1 },
    { group: "Transport", weight: 17.1, change: 1.5 },
    { group: "Health care", weight: 6.5, change: 3.4 },
    { group: "Education", weight: 6.2, change: 2.9 },
    { group: "Recreation & culture", weight: 7.8, change: 1.8 },
    { group: "Other goods & services", weight: 15.9, change: 2.2 },
  ],
  note: "Group weights are approximate CPI weights for 2024; changes are indicative annual averages. Headline CPI inflation was 2.4% in 2024.",
};

// Health detail
const HEALTH = {
  lifeExpectancy: [
    { label: "Men", value: 80.7, year: 2023 },
    { label: "Women", value: 85.2, year: 2023 },
    { label: "Both sexes", value: 83.3, year: 2024 },
  ],
  notes: [
    "Singapore's life expectancy is among the longest in the world.",
    "Infant mortality was 2.2 deaths per 1,000 live births in 2024.",
  ],
};

// Education detail
const EDUCATION = {
  pisa: [
    { subject: "Mathematics", score: 575, oecdAvg: 472 },
    { subject: "Reading", score: 543, oecdAvg: 476 },
    { subject: "Science", score: 561, oecdAvg: 485 },
  ],
  notes: [
    "Singapore placed first in all three PISA 2022 domains.",
    "About 97% of residents aged 15 and over are literate (2023, estimate).",
    "Roughly one in three residents aged 25 and over holds a university degree (2024, estimate).",
  ],
};

// Housing detail
const HOUSING = {
  kpis: [
    { name: "Home ownership", value: "≈90%", note: "Resident households, 2024 (estimate)" },
    { name: "Living in HDB flats", value: "≈78%", note: "Resident population, 2024" },
    { name: "Private home prices", value: "+3.9%", note: "URA index, 2024" },
    { name: "HDB resale prices", value: "+9.6%", note: "HDB resale price index, 2024 (estimate)" },
  ],
  notes: [
    "Public housing built by the Housing & Development Board houses about four in five residents.",
    "Nine in ten resident households own the home they live in — one of the highest ownership rates in the world.",
  ],
};

// Trade detail
const TRADE = {
  partners: [ // total merchandise trade, S$ billion, 2024 (approx., rounded)
    { partner: "Mainland China", value: 172 },
    { partner: "Malaysia", value: 147 },
    { partner: "United States", value: 133 },
    { partner: "Indonesia", value: 71 },
    { partner: "Hong Kong", value: 68 },
    { partner: "Japan", value: 62 },
  ],
  components: [
    { label: "Merchandise exports", value: 674.5 },
    { label: "Merchandise imports", value: 611.4 },
    { label: "Services exports", value: 545.0 },
    { label: "Services imports", value: 453.0 },
  ],
  notes: [
    "Total merchandise trade grew 6.6% in 2024 to S$1.29 trillion after shrinking 11.7% in 2023.",
    "Non-oil domestic exports edged up 0.2% in 2024, while re-exports grew 10.2%.",
    "Total services trade grew 8.6% in 2024 to S$998 billion.",
  ],
};

// Methods & sources page
const METHODS = [
  { topic: "Where the figures come from", text: "Headline figures are taken from the Department of Statistics Singapore, the National Population and Talent Division, Enterprise Singapore, the Ministry of Trade and Industry, the Ministry of Manpower, the Monetary Authority of Singapore, the Urban Redevelopment Authority and the Housing & Development Board, with international comparisons from the World Bank, the IMF and the OECD. Each figure on this site names its source and year." },
  { topic: "Resident vs total population", text: "Total population counts everyone in Singapore, including non-residents. Resident population counts citizens and permanent residents only. The two are never mixed on this site: a figure says which one it is." },
  { topic: "What counts as an estimate", text: "Figures labelled 'estimate' are rounded, modelled (for example the ILO unemployment series) or approximated from published shares. Published values are shown exactly as released." },
  { topic: "Revisions", text: "Official statistics are revised as better data arrives. Figures here are as published for 2024; a later revision by the source may move a number slightly." },
  { topic: "Money", text: "Dollar figures are Singapore dollars (S$) unless marked US$. GDP in US dollars uses the year's average exchange rate as published by the source." },
  { topic: "How this site is built", text: "This site is plain static files — no server, no tracking, no network requests. Charts are drawn as SVG by the site's own code, and every figure lives in data.js so it can be checked in one place." },
];
