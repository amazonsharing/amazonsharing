const uploadForm = document.getElementById('uploadForm');
const articleList = document.getElementById('articleList');
const loadingSpinner = document.getElementById('loadingSpinner');

// Utility to show/hide spinner
const toggleSpinner = (show) => {
  loadingSpinner.style.display = show ? 'block' : 'none';
};

// Debounce utility
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

// Upload new article
uploadForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  toggleSpinner(true);

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
  } finally {
    toggleSpinner(false);
  }
});

// Load existing articles (debounced)
const loadArticles = debounce(async () => {
  toggleSpinner(true);
  try {
    articleList.innerHTML = ''; // Clear previous
    const res = await fetch('/api/articles');
    const articles = await res.json();

    // Sort by newest first
    articles.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Use DocumentFragment for efficient DOM updates
    const fragment = document.createDocumentFragment();
    articles.forEach((article) => {
      const div = document.createElement('div');
      div.className = 'article-item';
      div.innerHTML = `
        <h3>${article.title}</h3>
        <small>Uploaded on: ${new Date(article.createdAt).toLocaleString()}</small>
        <p>${article.content.substring(0, 100)}...</p>
        ${article.imageUrl ? `<img src="${article.imageUrl}" alt="Article Thumbnail" loading="lazy">` : ''}
        <br>
        <button class="delete-btn" onclick="deleteArticle('${article._id}')">Delete</button>
      `;
      fragment.appendChild(div);
    });
    articleList.appendChild(fragment);
  } catch (err) {
    console.error('Load error:', err);
    alert('Failed to load articles.');
  } finally {
    toggleSpinner(false);
  }
}, 300);

// Delete article
async function deleteArticle(id) {
  if (!confirm('Are you sure you want to delete this article?')) return;

  toggleSpinner(true);
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
    alert('Error deleting article.');
  } finally {
    toggleSpinner(false);
  }
}

// Preview article
function previewArticle() {
  const title = document.getElementById('title').value;
  const content = document.getElementById('content').value;
  const imageFile = document.getElementById('image').files[0];

  if (!title || !content) {
    alert('Please enter title and content for preview.');
    return;
  }

  document.getElementById('previewTitle').innerText = title;
  document.getElementById('previewContent').innerText = content;

  if (imageFile) {
    const reader = new FileReader();
    reader.onload = (e) => {
      document.getElementById('previewImage').src = e.target.result;
    };
    reader.readAsDataURL(imageFile);
  } else {
    document.getElementById('previewImage').src = '';
  }

  document.getElementById('previewModal').style.display = 'flex';
}

// Load articles on start
loadArticles();