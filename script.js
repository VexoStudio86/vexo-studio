let isAdmin = false;
let selectedStars = 0;

const reviews = JSON.parse(localStorage.getItem("reviews")) || [];

function adminLogin() {
  const pw = prompt("Admin Passwort:");
  if (pw === "vexo123") {
    isAdmin = true;
    document.body.classList.add("admin");
    alert("Admin Modus aktiviert");
    renderReviews();
  } else {
    alert("Falsches Passwort");
  }
}

// Sterne Eingabe
const starInput = document.getElementById("star-input");
for (let i = 1; i <= 5; i++) {
  const star = document.createElement("span");
  star.innerHTML = "★";
  star.classList.add("star");
  star.onclick = () => selectStars(i);
  starInput.appendChild(star);
}

function selectStars(count) {
  selectedStars = count;
  document.querySelectorAll("#star-input .star").forEach((s, i) => {
    s.classList.toggle("active", i < count);
  });
}

function submitReview() {
  const text = document.getElementById("review-text").value;
  if (!text || selectedStars === 0) {
    alert("Bitte Sterne & Text ausfüllen");
    return;
  }

  reviews.push({ stars: selectedStars, text });
  localStorage.setItem("reviews", JSON.stringify(reviews));
  selectedStars = 0;
  document.getElementById("review-text").value = "";
  renderReviews();
}

function renderReviews() {
  const list = document.getElementById("review-list");
  list.innerHTML = "";

  let totalStars = 0;

  reviews.forEach((r, index) => {
    totalStars += r.stars;

    const div = document.createElement("div");
    div.className = "review";

    const stars = "★".repeat(r.stars) + "☆".repeat(5 - r.stars);

    div.innerHTML = `
      <div style="color:gold;">${stars}</div>
      <p>${r.text}</p>
      <span class="delete-btn" onclick="deleteReview(${index})">🗑️</span>
    `;
    list.appendChild(div);
  });

  updateSummary(totalStars);
}

function deleteReview(index) {
  if (!confirm("Bewertung wirklich löschen?")) return;
  reviews.splice(index, 1);
  localStorage.setItem("reviews", JSON.stringify(reviews));
  renderReviews();
}

function updateSummary(totalStars) {
  const avg = reviews.length
    ? (totalStars / reviews.length).toFixed(1)
    : "0.0";

  document.getElementById("avg-rating").innerText = avg;
  document.getElementById("rating-count").innerText =
    `${reviews.length} Bewertungen`;

  const stars = document.getElementById("avg-stars");
  stars.innerHTML = "";

  for (let i = 1; i <= 5; i++) {
    const s = document.createElement("span");
    s.innerHTML = "★";
    s.className = "star";
    if (i <= Math.round(avg)) s.classList.add("active");
    stars.appendChild(s);
  }
}

renderReviews();
