// charts.js — small SVG chart helpers, written for this site.
// No library: each function takes plain data and returns an SVG string.
// Colours come from the site palette (see style.css): ink #14324a, teal #0f766e,
// coral #e0654a, sand #f4ead8, sky #7fb3d5.

const PALETTE = ["#0f766e", "#e0654a", "#14324a", "#7fb3d5", "#d9a441", "#6a8caf"];

function fmt(value, decimals) {
  const d = decimals === undefined ? 1 : decimals;
  return Number(value).toFixed(d);
}

function escapeXml(text) {
  return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Vertical bar chart. data: [{label, value}], options: {height, color, decimals, unit}
function barChart(data, options) {
  const opt = options || {};
  const width = 640;
  const height = opt.height || 280;
  const padL = 46;
  const padB = 34;
  const padT = 14;
  const max = Math.max.apply(null, data.map(function (d) { return d.value; }));
  const min = Math.min(0, Math.min.apply(null, data.map(function (d) { return d.value; })));
  const span = max - min || 1;
  const plotH = height - padT - padB;
  const plotW = width - padL - 12;
  const slot = plotW / data.length;
  const barW = Math.min(64, slot * 0.62);
  const zeroY = padT + ((max - 0) / span) * plotH;
  const color = opt.color || PALETTE[0];
  let out = '<svg viewBox="0 0 ' + width + ' ' + height + '" role="img" aria-label="Bar chart">';
  // gridlines
  const steps = 4;
  for (let i = 0; i <= steps; i++) {
    const v = min + (span * i) / steps;
    const y = padT + ((max - v) / span) * plotH;
    out += '<line x1="' + padL + '" y1="' + y.toFixed(1) + '" x2="' + (width - 12) + '" y2="' + y.toFixed(1) + '" stroke="#e3e8ec" stroke-width="1"/>';
    out += '<text x="' + (padL - 6) + '" y="' + (y + 4).toFixed(1) + '" text-anchor="end" font-size="11" fill="#5b6b78">' + fmt(v, opt.decimals === undefined ? 0 : opt.decimals) + '</text>';
  }
  out += '<line x1="' + padL + '" y1="' + zeroY.toFixed(1) + '" x2="' + (width - 12) + '" y2="' + zeroY.toFixed(1) + '" stroke="#9fb0bd" stroke-width="1"/>';
  data.forEach(function (d, i) {
    const x = padL + slot * i + (slot - barW) / 2;
    const y = d.value >= 0 ? padT + ((max - d.value) / span) * plotH : zeroY;
    const h = Math.abs(d.value) / span * plotH;
    const fill = d.color || color;
    out += '<rect x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + barW.toFixed(1) + '" height="' + Math.max(h, 1).toFixed(1) + '" rx="3" fill="' + fill + '"/>';
    out += '<text x="' + (x + barW / 2).toFixed(1) + '" y="' + (y - 6).toFixed(1) + '" text-anchor="middle" font-size="12" font-weight="600" fill="#14324a">' + fmt(d.value, opt.decimals === undefined ? 1 : opt.decimals) + (opt.unit ? opt.unit : "") + '</text>';
    out += '<text x="' + (x + barW / 2).toFixed(1) + '" y="' + (height - 12) + '" text-anchor="middle" font-size="11" fill="#5b6b78">' + escapeXml(d.label) + '</text>';
  });
  out += "</svg>";
  return out;
}

// Line chart over a time series. series: [[year, value], ...]
// options: {height, color, decimals, unit, fill}
function lineChart(series, options) {
  const opt = options || {};
  const width = 640;
  const height = opt.height || 280;
  const padL = 52;
  const padR = 16;
  const padB = 34;
  const padT = 18;
  const values = series.map(function (p) { return p[1]; });
  let max = Math.max.apply(null, values);
  let min = Math.min.apply(null, values);
  if (max === min) { max += 1; min -= 1; }
  const pad = (max - min) * 0.12;
  max += pad;
  min -= pad;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;
  const color = opt.color || PALETTE[0];
  function px(i) { return padL + (plotW * i) / (series.length - 1); }
  function py(v) { return padT + ((max - v) / (max - min)) * plotH; }
  let out = '<svg viewBox="0 0 ' + width + ' ' + height + '" role="img" aria-label="Line chart">';
  const steps = 4;
  for (let i = 0; i <= steps; i++) {
    const v = min + ((max - min) * i) / steps;
    const y = py(v);
    out += '<line x1="' + padL + '" y1="' + y.toFixed(1) + '" x2="' + (width - padR) + '" y2="' + y.toFixed(1) + '" stroke="#e3e8ec" stroke-width="1"/>';
    out += '<text x="' + (padL - 6) + '" y="' + (y + 4).toFixed(1) + '" text-anchor="end" font-size="11" fill="#5b6b78">' + fmt(v, opt.decimals === undefined ? 1 : opt.decimals) + '</text>';
  }
  let area = "M " + px(0).toFixed(1) + " " + py(series[0][1]).toFixed(1);
  let line = area;
  series.forEach(function (p, i) {
    if (i > 0) {
      line += " L " + px(i).toFixed(1) + " " + py(p[1]).toFixed(1);
      area += " L " + px(i).toFixed(1) + " " + py(p[1]).toFixed(1);
    }
  });
  area += " L " + px(series.length - 1).toFixed(1) + " " + (padT + plotH).toFixed(1) + " L " + px(0).toFixed(1) + " " + (padT + plotH).toFixed(1) + " Z";
  if (opt.fill !== false) {
    out += '<path d="' + area + '" fill="' + color + '" opacity="0.10"/>';
  }
  out += '<path d="' + line + '" fill="none" stroke="' + color + '" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>';
  series.forEach(function (p, i) {
    out += '<circle cx="' + px(i).toFixed(1) + '" cy="' + py(p[1]).toFixed(1) + '" r="4" fill="#ffffff" stroke="' + color + '" stroke-width="2.5"/>';
    out += '<text x="' + px(i).toFixed(1) + '" y="' + (py(p[1]) - 12).toFixed(1) + '" text-anchor="middle" font-size="12" font-weight="600" fill="#14324a">' + fmt(p[1], opt.decimals === undefined ? 1 : opt.decimals) + (opt.unit ? opt.unit : "") + '</text>';
    out += '<text x="' + px(i).toFixed(1) + '" y="' + (height - 12) + '" text-anchor="middle" font-size="11" fill="#5b6b78">' + p[0] + '</text>';
  });
  out += "</svg>";
  return out;
}

// Donut chart with a legend. data: [{label, value}] where values are shares (%).
function donutChart(data, options) {
  const opt = options || {};
  const size = opt.size || 240;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 14;
  const inner = r * 0.62;
  const total = data.reduce(function (s, d) { return s + d.value; }, 0);
  let angle = -Math.PI / 2;
  let out = '<svg viewBox="0 0 ' + size + ' ' + size + '" role="img" aria-label="Donut chart">';
  data.forEach(function (d, i) {
    const frac = d.value / total;
    const a0 = angle;
    const a1 = angle + frac * Math.PI * 2;
    angle = a1;
    const large = frac > 0.5 ? 1 : 0;
    const x0 = cx + r * Math.cos(a0);
    const y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1);
    const y1 = cy + r * Math.sin(a1);
    const xi1 = cx + inner * Math.cos(a1);
    const yi1 = cy + inner * Math.sin(a1);
    const xi0 = cx + inner * Math.cos(a0);
    const yi0 = cy + inner * Math.sin(a0);
    const fill = d.color || PALETTE[i % PALETTE.length];
    out += '<path d="M ' + x0.toFixed(1) + ' ' + y0.toFixed(1) + ' A ' + r + ' ' + r + ' 0 ' + large + ' 1 ' + x1.toFixed(1) + ' ' + y1.toFixed(1) + ' L ' + xi1.toFixed(1) + ' ' + yi1.toFixed(1) + ' A ' + inner + ' ' + inner + ' 0 ' + large + ' 0 ' + xi0.toFixed(1) + ' ' + yi0.toFixed(1) + ' Z" fill="' + fill + '"/>';
  });
  out += '<text x="' + cx + '" y="' + (cy - 4) + '" text-anchor="middle" font-size="22" font-weight="700" fill="#14324a">' + fmt(total, 0) + (opt.totalUnit || "%") + '</text>';
  out += '<text x="' + cx + '" y="' + (cy + 16) + '" text-anchor="middle" font-size="11" fill="#5b6b78">' + escapeXml(opt.centreLabel || "total") + '</text>';
  out += "</svg>";
  return out;
}

// Legend list for a donut or bar chart.
function legendList(data) {
  return '<ul class="legend">' + data.map(function (d, i) {
    const fill = d.color || PALETTE[i % PALETTE.length];
    return '<li><span class="swatch" style="background:' + fill + '"></span>' + escapeXml(d.label) + ' — <strong>' + fmt(d.value, 1) + '%</strong></li>';
  }).join("") + "</ul>";
}
