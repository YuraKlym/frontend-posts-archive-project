import { BASE_POSTS } from "./data.js";

let currentPosts = [...BASE_POSTS];
const postsContainer = document.getElementById("posts-container");
const viewToggle = document.querySelector(".view-toggle");
const gridBtn = document.querySelector('[data-view="grid"]');
const listBtn = document.querySelector('[data-view="list"]');
const calendarPopup = document.getElementById("calendar-popup");
const calendarDays = document.getElementById("calendar-days");
const calendarMonthLabel = document.getElementById("calendar-month-label");
const dateFromInput = document.getElementById("date-from");
const dateToInput = document.getElementById("date-to");
const loadMoreBtn = document.getElementById("load-more");

let currentView = "list";
let activeDateTarget = "from";
let calendarMonth = 11;
let calendarYear = 2016;
const ITEMS_PER_PAGE = 8;
let visibleCount = ITEMS_PER_PAGE;

const RANGE_DAYS = [2, 9, 16, 23, 30];
const SELECTED_DAY = 9;

function icon(name) {
  return `<svg width="18" height="18" aria-hidden="true"><use href="#icon-${name}"></use></svg>`;
}

function statItem(value, type) {
  return `<span class="post-card__stat">${icon(type)}<span>${value}</span></span>`;
}

function renderListCard(post) {
  return `
    <article class="post-card" data-id="${post.id}">
      <img class="post-card__thumb" src="${post.image}" alt="" width="86" height="86" loading="lazy" />
      <div class="post-card__body">
        <div class="post-card__row-top">
          <span class="post-card__label">${post.label}</span>
          <span class="post-card__date-primary">${post.datePrimary}</span>
          <span class="post-card__type">${post.type}</span>
        </div>
        <div class="post-card__row-bottom">
          <div class="post-card__stats-group">
            ${statItem(post.likesTop, "heart")}
            ${statItem(post.commentsTop, "comment")}
          </div>
          <div class="post-card__stats-group post-card__stats-group--center">
            ${statItem(post.likesBottom, "heart")}
            ${statItem(post.commentsBottom, "comment")}
          </div>
          <div class="post-card__meta-right">
            <time class="post-card__date-secondary" datetime="${post.dateSecondary}">${post.dateSecondary}</time>
          </div>
        </div>
      </div>
    </article>
  `;
}

function renderGridCard(post) {
  return `
    <article class="post-card" data-id="${post.id}">
      <div class="post-card__thumb-wrap">
        <img class="post-card__thumb" src="${post.image}" alt="" width="203" height="203" loading="lazy" />
      </div>
      <div class="post-card__body">
        <div class="post-card__row-top">
        
          <span class="post-card__label">${post.label}</span>
          <span class="post-card__date-primary">${post.datePrimary}</span>
        </div>
        <div class="post-card__stats-main">
          ${statItem(post.likesTop, "heart")}
          ${statItem(post.commentsTop, "comment")}
        </div>
        <div class="post-card__stats-side">
          ${statItem(post.likesBottom, "heart")}
          ${statItem(post.commentsBottom, "comment")}
        </div>
        <div class="post-card__row-bottom">
          <span class="post-card__type">${post.type}</span>
          <time class="post-card__date-secondary" datetime="${post.dateSecondary}">${post.dateSecondary}</time>
        </div>
      </div>
    </article>
  `;
}

function renderPosts() {
  const visiblePosts = currentPosts.slice(0, visibleCount);

  const html = visiblePosts
    .map((post) =>
      currentView === "list" ? renderListCard(post) : renderGridCard(post)
    )
    .join("");

  postsContainer.innerHTML = html;

  postsContainer.classList.toggle("posts--list", currentView === "list");
  postsContainer.classList.toggle("posts--grid", currentView === "grid");
  postsContainer.dataset.view = currentView;

  // SHOW/HIDE LOAD MORE BUTTON
  if (loadMoreBtn) {
    loadMoreBtn.style.display =
      visibleCount < currentPosts.length ? "block" : "none";
  }
}

function setView(view) {
  if (view === currentView) return;
  currentView = view;

  gridBtn.classList.toggle("is-active", view === "grid");
  listBtn.classList.toggle("is-active", view === "list");
  gridBtn.setAttribute("aria-pressed", view === "grid");
  listBtn.setAttribute("aria-pressed", view === "list");
  viewToggle.dataset.active = view;

  postsContainer.style.opacity = "0";
  postsContainer.style.transform = "translateY(6px)";

  requestAnimationFrame(() => {
    visibleCount = ITEMS_PER_PAGE;
    renderPosts();
    requestAnimationFrame(() => {
      postsContainer.style.transition = "opacity 0.25s ease, transform 0.25s ease";
      postsContainer.style.opacity = "1";
      postsContainer.style.transform = "translateY(0)";
    });
  });
}

// Helper function to parse date string dd/mm/yyyy to Date object
function parseDateString(dateStr) {
  const [day, month, year] = dateStr.split('/').map(Number);
  return new Date(year, month - 1, day);
}

// Helper function to convert Date to YYYY-MM-DD string format for comparison
function dateToISO(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function filterPostsByDateRange() {
  const dateFromStr = dateFromInput.value;
  const dateToStr = dateToInput.value;

  let filteredPosts = [...BASE_POSTS];
  visibleCount = ITEMS_PER_PAGE;
  if (dateFromStr) {
    const startISO = dateToISO(parseDateString(dateFromStr));

    filteredPosts = filteredPosts.filter(
      (post) => post.postDate >= startISO
    );
  }

  if (dateToStr) {
    const endISO = dateToISO(parseDateString(dateToStr));

    filteredPosts = filteredPosts.filter(
      (post) => post.postDate <= endISO
    );
  }

  currentPosts = filteredPosts;
  renderPostsWithTransition();
}

// Render posts with fade transition animation
function renderPostsWithTransition() {
  postsContainer.style.opacity = "0";
  postsContainer.style.transform = "translateY(6px)";

  requestAnimationFrame(() => {
    renderPosts();
    requestAnimationFrame(() => {
      postsContainer.style.transition = "opacity 0.25s ease, transform 0.25s ease";
      postsContainer.style.opacity = "1";
      postsContainer.style.transform = "translateY(0)";
    });
  });
}
function loadMore() {
  visibleCount += ITEMS_PER_PAGE;

  if (visibleCount > currentPosts.length) {
    visibleCount = currentPosts.length;
  }

  renderPostsWithTransition();
}
gridBtn.addEventListener("click", () => setView("grid"));
listBtn.addEventListener("click", () => setView("list"));
loadMoreBtn?.addEventListener("click", loadMore);
viewToggle.dataset.active = "list";

function initFlatpickr() {
  const common = {
    dateFormat: "d/m/Y",
    allowInput: false,
    disableMobile: true,
    defaultDate: "09/08/2016",
    clickOpens: true,
  };

  const fpFrom = flatpickr(dateFromInput, {
    ...common,
    onChange(selectedDates) {
      if (selectedDates[0]) {
        calendarMonth = selectedDates[0].getMonth();
        calendarYear = selectedDates[0].getFullYear();
        renderCustomCalendar();
        filterPostsByDateRange();
      }
    },
  });

  const fpTo = flatpickr(dateToInput, {
    ...common,
    onChange(selectedDates) {
      if (selectedDates[0]) {
        filterPostsByDateRange();
      }
    },
  });

  dateFromInput.addEventListener("click", () => fpFrom.open());
  dateToInput.addEventListener("click", () => fpTo.open());
}

function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function firstWeekday(year, month) {
  return new Date(year, month, 1).getDay();
}

function renderCustomCalendar() {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  calendarMonthLabel.textContent = `${monthNames[calendarMonth]} ${calendarYear}`;

  const totalDays = daysInMonth(calendarYear, calendarMonth);
  const startOffset = firstWeekday(calendarYear, calendarMonth);
  const cells = [];

  for (let i = 0; i < startOffset; i += 1) {
    cells.push(
      `<button type="button" class="calendar-popup__day" disabled aria-hidden="true"></button>`
    );
  }

  for (let day = 1; day <= totalDays; day += 1) {
    let className = "calendar-popup__day";
    if (RANGE_DAYS.includes(day)) className += " calendar-popup__day--range";
    if (day === SELECTED_DAY) className += " calendar-popup__day--selected";
    if (day === 25) className += " calendar-popup__day--muted";

    cells.push(
      `<button type="button" class="${className}" data-day="${day}">${day}</button>`
    );
  }

  calendarDays.innerHTML = cells.join("");

  calendarDays.querySelectorAll(".calendar-popup__day[data-day]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const day = btn.dataset.day.padStart(2, "0");
      const month = String(calendarMonth + 1).padStart(2, "0");
      const formatted = `${day}/${month}/${calendarYear}`;

      if (activeDateTarget === "from") {
        dateFromInput.value = formatted;
        dateFromInput._flatpickr?.setDate(formatted, true);
      } else {
        dateToInput.value = formatted;
        dateToInput._flatpickr?.setDate(formatted, true);
      }

      filterPostsByDateRange();

      calendarDays
        .querySelectorAll(".calendar-popup__day--selected")
        .forEach((el) => el.classList.remove("calendar-popup__day--selected"));
      btn.classList.add("calendar-popup__day--selected");
    });
  });
}

function toggleCalendar(open, target = "from") {
  activeDateTarget = target;
  const isOpen = open ?? !calendarPopup.classList.contains("is-open");

  calendarPopup.classList.toggle("is-open", isOpen);
  calendarPopup.setAttribute("aria-hidden", String(!isOpen));

  document
    .querySelectorAll("[data-datepicker]")
    .forEach((btn) => btn.setAttribute("aria-expanded", "false"));

  if (isOpen) {
    const trigger = document.querySelector(`[data-datepicker="${target}"]`);
    trigger?.setAttribute("aria-expanded", "true");
    renderCustomCalendar();
  }
}

document.querySelectorAll("[data-datepicker]").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const target = btn.dataset.datepicker;
    const willOpen = !calendarPopup.classList.contains("is-open") || activeDateTarget !== target;
    toggleCalendar(willOpen, target);
  });
});

document.getElementById("calendar-prev")?.addEventListener("click", () => {
  calendarMonth -= 1;
  if (calendarMonth < 0) {
    calendarMonth = 11;
    calendarYear -= 1;
  }
  renderCustomCalendar();
});

document.getElementById("calendar-next")?.addEventListener("click", () => {
  calendarMonth += 1;
  if (calendarMonth > 11) {
    calendarMonth = 0;
    calendarYear += 1;
  }
  renderCustomCalendar();
});

document.addEventListener("click", (e) => {
  if (
    !calendarPopup.contains(e.target) &&
    !e.target.closest("[data-datepicker]")
  ) {
    toggleCalendar(false);
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") toggleCalendar(false);
});
// Reset "from" date
document
  .querySelector(".date-field--from .date-field__addon--close")
  ?.addEventListener("click", () => {
    dateFromInput.value = "";
    dateFromInput._flatpickr?.clear();
    filterPostsByDateRange();
  });

// Reset "to" date
document
  .querySelector(".date-field--to .date-field__addon--close")
  ?.addEventListener("click", () => {
    dateToInput.value = "";
    dateToInput._flatpickr?.clear();
    filterPostsByDateRange();
  });
renderPosts();
renderCustomCalendar();
initFlatpickr();
