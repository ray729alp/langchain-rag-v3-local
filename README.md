# MQA Chatbot 🤖

A sophisticated AI-powered chatbot for the Malaysian Qualifications Agency (MQA) that provides instant answers about accreditation, qualifications, frameworks, and other MQA services using Retrieval-Augmented Generation (RAG) technology.

## 🌟 Features

- **Multi-Category Support**: 7 main categories with specialized knowledge
- **Smart Document Processing**: Handles PDF, DOCX, TXT, and other formats
- **Real-time Responses**: Powered by Ollama and LangChain
- **Beautiful UI**: Modern, responsive chat interface
- **Persistent Memory**: Remembers conversation history
- **Export Conversations**: Download chat logs for reference
- **Fallback System**: Predefined answers when AI is unavailable

## 📋 Categories Available

1. **Accreditation Process & Status** - Institution and program accreditation
2. **MQA Framework** - Malaysian Qualifications Framework (MQF)
3. **Qualification Standards** - Program development guidelines
4. **Recognition of Qualification** - Foreign qualification recognition
5. **Equivalency of Qualification** - Qualification equivalency assessments
6. **APEL** - Accreditation of Prior Experiential Learning
7. **Frequently Asked Questions** - General MQA information

## 🚀 Quick Start Guide

### Step 0: Prerequisites

Before you begin, make sure you have:

- **Python 3.8+** installed
- **Git** installed
- Basic command line knowledge
- At least 4GB of free disk space

### Step 1: Clone the Repository

```bash
# Copy the project to your computer
git clone https://github.com/your-username/mqa-chatbot.git
cd mqa-chatbot
```

### Step 2: Install Python Dependencies

```bash
# Install required Python packages
pip install -r requirements.txt
```

**If you don't have a `requirements.txt` file, install these packages manually:**

```bash
pip install flask langchain-huggingface langchain-chroma langchain-ollama langchain-community torch
```

### Step 3: Install Ollama

Ollama is the AI engine that powers the chatbot.

#### For Windows:
1. Download from [ollama.ai](https://ollama.ai)
2. Run the installer
3. Open Command Prompt and run:
```bash
ollama pull llama3:8b
```

#### For Mac/Linux:
```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Download the AI model
ollama pull llama3:8b
```

### Step 4: Set Up Document Folders

```bash
# Create the folder structure for your documents
python create_directories.py
```

This creates these folders:
```
data/
├── accreditation/     # Put accreditation documents here
├── framework/         # MQF framework documents
├── qualifications/    # Qualification standards
├── recognition/       # Recognition of qualifications
├── equivalency/       # Equivalency documents
├── apel/             # APEL documents
└── faq/              # Frequently asked questions
```

### Step 5: Add Your Documents

Place your MQA documents in the appropriate folders:

- **Supported formats**: PDF, DOCX, DOC, TXT, MD
- **Organize by category**: Each folder corresponds to a chatbot category
- **Example**: Put accreditation-related PDFs in `data/accreditation/`

### Step 6: Create the Knowledge Database

```bash
# This processes your documents and creates the AI knowledge base
python create_database.py
```

**You should see output like:**
```
🚀 Starting vector store creation for MQA categories...
📂 Processing ACCREDITATION documents...
   📄 Loaded 5 PDF files
   💾 Saved 120 chunks to chroma/accreditation
✅ Vector store creation completed!
```

### Step 7: Start the Chatbot

```bash
# Start the web application
python app.py
```

**Expected output:**
```
Starting MQA Chatbot Server...
Available categories: ['accreditation', 'framework', 'qualifications', 'recognition', 'equivalency', 'apel', 'faq']
 * Running on http://127.0.0.1:5000
```

### Step 8: Use the Chatbot

1. Open your web browser
2. Go to: `http://127.0.0.1:5000`
3. Click the chat icon in the bottom-right corner
4. Select a category and start asking questions!

## 📁 Project Structure

```
mqa-chatbot/
├── data/                  # Your document folders (create these)
│   ├── accreditation/
│   ├── framework/
│   └── ...
├── chroma/               # AI knowledge databases (auto-created)
├── static/
│   ├── images/           # Category icons and logos
│   ├── style.css         # Chatbot styling
│   └── app.js            # Frontend functionality
├── templates/
│   └── base.html         # Main webpage
├── app.py               # Flask web server
├── chat.py              # AI chatbot brain
├── create_database.py   # Document processing script
├── create_directories.py # Folder setup script
└── README.md            # This file
```

## 🛠️ Customization

### Adding New Categories

1. Edit `create_database.py`:
```python
CATEGORIES = {
    "your_new_category": "data/your_new_category",
    # ... existing categories
}
```

2. Update `chat.py`:
```python
self.databases = {
    "your_new_category": None,
    # ... existing categories
}
```

3. Update `app.js`:
```javascript
// Add to categoryImages
this.categoryImages = {
    "your_new_category": "custom-image.png",
    // ... existing images
}

// Add to predefinedAnswers
this.predefinedAnswers = {
    "your_new_category": {
        "Question 1": "Answer 1",
        "Question 2": "Answer 2"
    }
    // ... existing answers
}
```

### Changing the AI Model

Edit `chat.py`:
```python
llm = ChatOllama(
    model="llama3:8b",  # Change to other models like "mistral" or "codellama"
    temperature=0.1,
    timeout=60
)
```

## ❓ Troubleshooting

### Common Issues

**1. "Ollama connection failed"**
- Make sure Ollama is running: `ollama serve`
- Check if model is downloaded: `ollama list`

**2. "No documents found"**
- Check if documents are in the correct `data/category/` folders
- Verify file formats (PDF, DOCX, TXT, DOC)

**3. "Port 5000 already in use"**
- Change port in `app.py`: `app.run(..., port=5001)`
- Or kill existing process: `npx kill-port 5000`

**4. "Module not found" errors**
- Reinstall requirements: `pip install -r requirements.txt`
- Or install missing packages individually

**5. Chatbot not loading in browser**
- Check if server is running: `python app.py`
- Visit `http://localhost:5000` (not 127.0.0.1)
- Clear browser cache and reload

### Debug Mode

For detailed error information, run in debug mode:

```bash
# Stop the current server (Ctrl+C)
# Restart with debug mode
python app.py
```

Check the console output for specific error messages.

## 🔧 Advanced Configuration

### Environment Variables

Create a `.env` file for configuration:

```env
FLASK_ENV=development
OLLAMA_MODEL=llama3:8b
CHROMA_PERSIST_DIR=./chroma
```

### Using Different Embedding Models

Edit `chat.py`:
```python
self.embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-mpnet-base-v2"  # More accurate but slower
)
```

## 📊 Performance Tips

- **For better accuracy**: Use `all-mpnet-base-v2` embedding model
- **For faster responses**: Use `all-MiniLM-L6-v2` (default)
- **For large documents**: Increase `chunk_size` in `create_database.py`
- **For better search**: Adjust `search_kwargs={"k": 5}` in `chat.py`

## 🤝 Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Getting Help

If you encounter issues:

1. Check the troubleshooting section above
2. Look at the console output for error messages
3. Ensure all prerequisites are installed
4. Verify document locations and formats
5. Create an issue on GitHub with:
   - Your operating system
   - Python version
   - Error messages
   - Steps to reproduce the issue

## 🎯 Usage Examples

### For MQA Staff:
```bash
# Add your accreditation guidelines to data/accreditation/
# Add MQF documents to data/framework/
# Add program standards to data/qualifications/
python create_database.py
python app.py
```

### For Developers:
```bash
# Customize categories and responses
# Modify app.js for UI changes
# Update chat.py for AI behavior
# Add new document types in create_database.py
```

---

**Happy Chatbot Building!** 🚀

If this project helps you, please give it a ⭐ on GitHub!
