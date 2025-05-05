const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const fsPromises = require('fs/promises');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// MongoDB Connection
mongoose.connect('mongodb+srv://amazonsharingfriends:RqmrnqZOHHEu34cM@newtest.iayjh2w.mongodb.net/?retryWrites=true&w=majority&appName=newtest')
  .then(() => console.log('Connected to MongoDB Atlas!'))
  .catch((err) => console.error('Error connecting to MongoDB Atlas', err));

// Create uploads folder if not exists
if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads');
}

// Article Model
const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  image: Buffer,
  imageType: String
}, { timestamps: true });

articleSchema.virtual('imageUrl').get(function () {
  if (this.image && this.imageType) {
    return `data:${this.imageType};base64,${this.image.toString('base64')}`;
  }
});

articleSchema.set('toJSON', { virtuals: true });

const Article = mongoose.model('Article', articleSchema);

// Multer setup for file uploads (memory storage for buffer)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// POST: Upload new article
app.post('/api/articles', upload.single('image'), async (req, res) => {
  try {
    const { title, content } = req.body;
    const image = req.file ? req.file.buffer : null;
    const imageType = req.file ? req.file.mimetype : null;

    const article = new Article({ title, content, image, imageType });
    await article.save();

    res.status(201).json({ message: 'Article added successfully' });
  } catch (err) {
    console.error('Error adding article:', err);
    res.status(500).json({ error: 'Failed to add article' });
  }
});

// GET: Fetch all articles (newest first)
app.get('/api/articles', async (req, res) => {
  try {
    const articles = await Article.find().sort({ createdAt: -1 });
    res.json(articles);
  } catch (err) {
    console.error('Error fetching articles:', err);
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
});

// DELETE: Delete article by ID
app.delete('/api/articles/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const article = await Article.findById(id);

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    await Article.findByIdAndDelete(id);
    res.status(200).json({ message: 'Article deleted successfully' });
  } catch (err) {
    console.error('Error deleting article:', err);
    res.status(500).json({ error: 'Failed to delete article' });
  }
});

// Start Server
const PORT = 30000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
