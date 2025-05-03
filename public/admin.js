const uploadForm = document.getElementById('uploadForm');
const articleList = document.getElementById('articleList');

// Upload new article
uploadForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append('title', document.getElementById('title').value);
  formData.append('content', document.getElementById('content').value);
  formData.append('image', document.getElementById('image').files[0]);

  try {
    const response = await fetch('/api/articles', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      alert('Article uploaded successfully!');
      uploadForm.reset();
      loadArticles();
    } else {
      alert('Failed to upload article');
    }
  } catch (err) {
    console.error('Upload error:', err);
    alert('Error uploading article.');
  }
});

// Load existing articles
async function loadArticles() {
  try {
    articleList.innerHTML = ''; // Clear previous
    const res = await fetch('/api/articles');
    const articles = await res.json();

    // Sort by newest first
    articles.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    articles.forEach(article => {
      const div = document.createElement('div');
      div.className = 'article-item';
      div.innerHTML = `
        <h3>${article.title}</h3>
        <small>Uploaded on: ${new Date(article.createdAt).toLocaleString()}</small>
        <p>${article.content.substring(0, 100)}...</p>
        <button class="delete-btn" onclick="deleteArticle('${article._id}')">Delete</button>
      `;
      articleList.appendChild(div);
    });
  } catch (err) {
    console.error('Load error:', err);
  }
}

// Delete article
async function deleteArticle(id) {
  if (confirm('Are you sure you want to delete this article?')) {
    try {
      const res = await fetch(`/api/articles/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        alert('Article deleted successfully!');
        loadArticles();
      } else {
        alert('Failed to delete article');
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  }
}

// Load articles on page start
loadArticles();







// Form Toggle
document.querySelector('.toggle-form').addEventListener('click', function() {
  const formCard = document.querySelector('.form-card');
  formCard.classList.toggle('collapsed');
  this.textContent = formCard.classList.contains('collapsed') ? '+' : '−';
});

// Real-time Search
document.getElementById('search').addEventListener('input', function(e) {
  const query = e.target.value.toLowerCase();
  document.querySelectorAll('.article-item').forEach(item => {
    const title = item.querySelector('h3').textContent.toLowerCase();
    item.style.display = title.includes(query) ? 'block' : 'none';
  });
});

// Expandable Articles (assumes articles have .article-item with h3, p, small)
document.getElementById('articleList').addEventListener('click', function(e) {
  const item = e.target.closest('.article-item');
  if (item) item.classList.toggle('expanded');
});

// Example: Form Validation (add to existing form submission logic)
document.getElementById('uploadForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const title = document.getElementById('title').value;
  const content = document.getElementById('content').value;
  if (title && content) {
    // Add your article submission logic here
    alert('Article published!');
    this.reset();
  }
});
