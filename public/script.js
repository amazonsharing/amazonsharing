const newsContainer = document.getElementById('articlesContainer');
const modal = document.getElementById('articleModal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalContent = document.getElementById('modalContent');

// Fetch and display articles
if (newsContainer) {
  async function fetchArticles() {
    try {
      const res = await fetch('/api/articles');
      const articles = await res.json();

      articles.forEach(article => {
        const div = document.createElement('div');
        div.className = 'news-card';
        div.innerHTML = `
          ${article.imageUrl ? `<img src="${article.imageUrl}" alt="Article Image">` : ''}
          <div class="content">
            <h3>${article.title}</h3>
            <small>Published on: ${new Date(article.createdAt).toLocaleString()}</small>
            <p>${article.content.slice(0, 100)}...</p>
          </div>
        `;
        div.addEventListener('click', () => openModal(article));
        newsContainer.appendChild(div);
      });
    } catch (error) {
      console.error('Error loading articles:', error);
    }
  }

  fetchArticles();
}

// Open Popup Modal
function openModal(article) {
  modal.style.display = "block";
  modalImage.src = article.imageUrl || '';
  modalTitle.innerText = article.title;
  modalContent.innerText = article.content;
}

// Close Popup Modal
function closeModal() {
  document.getElementById('articleModal').style.display = "none";
}

// Close popup when clicking outside modal-content
window.onclick = function(event) {
  const modal = document.getElementById('articleModal');
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

// Close popup on ESC key
document.addEventListener('keydown', function(event) {
  if (event.key === "Escape") {
    document.getElementById('articleModal').style.display = "none";
  }
});
