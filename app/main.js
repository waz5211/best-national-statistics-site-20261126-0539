// main.js — router and wiring for Singapore in Figures.
// Hash routes: #/ overview, #/population, #/economy, #/labour, #/prices,
// #/health, #/education, #/housing, #/trade, #/methods.
// Controls: metric switcher and year-range buttons redraw the chart in place;
// table headers sort; the overview search box filters the indicator index.

(function () {
  "use strict";

  var state = { metric: "population", range: "all" };
  var viewEl = document.getElementById("view");
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".site-nav a"));

  function route() {
    var hash = window.location.hash || "#/";
    var name = hash.replace(/^#\/?/, "").split("/")[0] || "overview";
    if (!VIEWS[name]) name = "overview";
    viewEl.innerHTML = VIEWS[name](state);
    navLinks.forEach(function (a) {
      var target = a.getAttribute("href").replace(/^#\/?/, "").split("/")[0] || "overview";
      if (target === name) {
        a.setAttribute("aria-current", "page");
      } else {
        a.removeAttribute("aria-current");
      }
    });
    window.scrollTo(0, 0);
    wireView();
  }

  function redraw() {
    var hash = window.location.hash || "#/";
    var name = hash.replace(/^#\/?/, "").split("/")[0] || "overview";
    if (!VIEWS[name]) name = "overview";
    viewEl.innerHTML = VIEWS[name](state);
    wireView();
  }

  function wireView() {
    // Metric switcher (overview chart).
    Array.prototype.forEach.call(viewEl.querySelectorAll("[data-metric]"), function (btn) {
      btn.addEventListener("click", function () {
        state.metric = btn.getAttribute("data-metric");
        redraw();
      });
    });
    // Year-range buttons.
    Array.prototype.forEach.call(viewEl.querySelectorAll("[data-range]"), function (btn) {
      btn.addEventListener("click", function () {
        state.range = btn.getAttribute("data-range");
        redraw();
      });
    });
    // Sortable tables: click a header to sort that column, toggling direction.
    Array.prototype.forEach.call(viewEl.querySelectorAll("table.sortable"), function (table) {
      Array.prototype.forEach.call(table.querySelectorAll("th"), function (th) {
        th.addEventListener("click", function () { sortTable(table, th); });
        th.style.cursor = "pointer";
      });
    });
    // Indicator search (overview).
    var search = document.getElementById("indicator-search");
    if (search) {
      search.addEventListener("input", function () {
        var q = search.value.trim().toLowerCase();
        var rows = viewEl.querySelectorAll("#indicator-index tbody tr");
        var shown = 0;
        Array.prototype.forEach.call(rows, function (row) {
          var hit = row.textContent.toLowerCase().indexOf(q) !== -1;
          row.style.display = hit ? "" : "none";
          if (hit) shown += 1;
        });
        var count = document.getElementById("index-count");
        if (count) count.textContent = shown + " indicator" + (shown === 1 ? "" : "s") + " listed.";
      });
    }
  }

  function sortTable(table, th) {
    var col = parseInt(th.getAttribute("data-col"), 10);
    var tbody = table.querySelector("tbody");
    var rows = Array.prototype.slice.call(tbody.querySelectorAll("tr"));
    var dir = th.getAttribute("data-dir") === "asc" ? -1 : 1;
    Array.prototype.forEach.call(table.querySelectorAll("th"), function (h) {
      h.removeAttribute("data-dir");
      var mark = h.querySelector(".sort-mark");
      if (mark) mark.textContent = "";
    });
    th.setAttribute("data-dir", dir === 1 ? "asc" : "desc");
    var mark = th.querySelector(".sort-mark");
    if (mark) mark.textContent = dir === 1 ? " ▲" : " ▼";
    rows.sort(function (a, b) {
      var av = a.cells[col].textContent.trim();
      var bv = b.cells[col].textContent.trim();
      var an = parseFloat(av.replace(/[^0-9.\-+]/g, ""));
      var bn = parseFloat(bv.replace(/[^0-9.\-+]/g, ""));
      if (!isNaN(an) && !isNaN(bn) && av !== "" && bv !== "") return (an - bn) * dir;
      return av.localeCompare(bv) * dir;
    });
    rows.forEach(function (row) { tbody.appendChild(row); });
  }

  // Mobile nav toggle.
  var toggle = document.getElementById("nav-toggle");
  var nav = document.querySelector(".site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.addEventListener("click", function (event) {
      if (event.target.tagName === "A") nav.classList.remove("open");
    });
  }

  window.addEventListener("hashchange", route);
  route();
})();
