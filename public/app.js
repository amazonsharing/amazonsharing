const form = document.getElementById('article-form');
const articlesList = document.getElementById('articles-list');

// Submit new article
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById('title').value;
  const content = document.getElementById('content').value;

  const response = await fetch('/add-article', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content })
  });

  if (response.ok) {
    alert('Article added!');
    form.reset();
    loadArticles();
  } else {
    alert('Error adding article.');
  }
});

// Load all articles
async function loadArticles() {
  const res = await fetch('/articles');
  const articles = await res.json();

  articlesList.innerHTML = '';
  articles.forEach(article => {
    const div = document.createElement('div');
    div.classList.add('article');
    div.innerHTML = `<h3>${article.title}</h3><p>${article.content}</p>`;
    articlesList.appendChild(div);
  });
}

// Load articles on page load
loadArticles();
