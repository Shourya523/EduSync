# RAG Backend with Qdrant & Gemini Embeddings

A complete Retrieval-Augmented Generation (RAG) backend built with FastAPI, LangChain, Qdrant vector database, and Google Gemini embeddings. Features intelligent source differentiation between PDFs and web documents.

## Features

- 🌐 **Web Document Loader**: Load documents from multiple web URLs
- 📄 **PDF Document Loader**: Upload and process PDF files
- 🔍 **Qdrant Vector Search**: Cloud-based vector database with 768-dimensional Gemini embeddings
- 🏷️ **Source Differentiation**: Separate tracking for PDF and web sources
- 🎯 **Filtered Search**: Query specific source types (PDF only, web only, or both)
- 🤖 **Groq LLM Integration**: Fast inference using Mixtral-8x7b
- 📊 **Source Attribution**: Returns detailed source information with scores
- 🔄 **Persistent Storage**: Cloud-based Qdrant storage
- 🚀 **RESTful API**: Clean and documented endpoints

## Prerequisites

- Python 3.9+
- Groq API Key (get it from [console.groq.com](https://console.groq.com))
- Google API Key (get it from [ai.google.dev](https://ai.google.dev))
- Qdrant Cloud instance (configured in code)

## Installation

1. **Install dependencies**
```bash
pip install -r requirements.txt
```

2. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env and add your API keys:
# GROQ_API_KEY=your_groq_api_key
# GOOGLE_API_KEY=your_google_api_key
```

## Usage

### Start the Server

```bash
python main.py
```

The API will be available at `http://localhost:8000`

### API Documentation

Once running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## API Endpoints

### 1. Health Check
```http
GET /
```

Returns collection status and health information.

### 2. Load Web URLs
```http
POST /load-urls
Content-Type: application/json

{
  "urls": [
    "https://example.com/article1",
    "https://example.com/article2"
  ]
}
```

Response:
```json
{
  "message": "URLs loaded successfully",
  "successful_urls": ["https://example.com/article1"],
  "failed_urls": [],
  "total_chunks": 15,
  "status": "success"
}
```

### 3. Upload PDF
```http
POST /load-pdf
Content-Type: multipart/form-data

file: <PDF file>
```

Response:
```json
{
  "message": "PDF loaded successfully",
  "filename": "document.pdf",
  "num_pages": 10,
  "num_chunks": 25,
  "status": "success"
}
```

### 4. Query the RAG System
```http
POST /query
Content-Type: application/json

{
  "question": "What is the main topic discussed?",
  "top_k": 4,
  "source_type": null
}
```

**source_type options:**
- `null` - Search both PDFs and web documents (default)
- `"pdf"` - Search only PDF documents
- `"web"` - Search only web documents

Response:
```json
{
  "answer": "The main topic is...",
  "sources": [
    {
      "type": "web",
      "name": "https://example.com/article",
      "score": 0.85
    },
    {
      "type": "pdf",
      "name": "document.pdf",
      "score": 0.78
    }
  ]
}
```

### 5. Get Statistics
```http
GET /stats
```

Response:
```json
{
  "total_documents": 150,
  "pdf_documents": 75,
  "web_documents": 75
}
```

### 6. List Sources
```http
GET /sources
```

Response:
```json
{
  "pdf_sources": [
    {
      "name": "document1.pdf",
      "timestamp": "2024-01-15T10:30:00"
    }
  ],
  "web_sources": [
    {
      "name": "https://example.com/article",
      "timestamp": "2024-01-15T11:00:00"
    }
  ],
  "total_pdf_sources": 1,
  "total_web_sources": 1
}
```

### 7. Reset Collection
```http
DELETE /reset
```

Deletes all documents and recreates the collection.

## Example Usage with curl

```bash
# Load web URLs
curl -X POST "http://localhost:8000/load-urls" \
  -H "Content-Type: application/json" \
  -d '{"urls": ["https://en.wikipedia.org/wiki/Artificial_intelligence"]}'

# Upload a PDF
curl -X POST "http://localhost:8000/load-pdf" \
  -F "file=@document.pdf"

# Query all sources
curl -X POST "http://localhost:8000/query" \
  -H "Content-Type: application/json" \
  -d '{"question": "What is artificial intelligence?"}'

# Query only PDFs
curl -X POST "http://localhost:8000/query" \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What is artificial intelligence?",
    "source_type": "pdf"
  }'

# Query only web sources
curl -X POST "http://localhost:8000/query" \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What is artificial intelligence?",
    "source_type": "web"
  }'

# Get statistics
curl -X GET "http://localhost:8000/stats"

# List all sources
curl -X GET "http://localhost:8000/sources"
```

## Example Usage with Python

```python
import requests

BASE_URL = "http://localhost:8000"

# Load URLs
response = requests.post(
    f"{BASE_URL}/load-urls",
    json={"urls": ["https://example.com/article"]}
)
print(response.json())

# Upload PDF
with open("document.pdf", "rb") as f:
    response = requests.post(
        f"{BASE_URL}/load-pdf",
        files={"file": f}
    )
print(response.json())

# Query all sources
response = requests.post(
    f"{BASE_URL}/query",
    json={"question": "What is the main topic?"}
)
result = response.json()
print(f"Answer: {result['answer']}")
print(f"Sources: {result['sources']}")

# Query only PDFs
response = requests.post(
    f"{BASE_URL}/query",
    json={
        "question": "What is discussed in the PDFs?",
        "source_type": "pdf"
    }
)
print(response.json())

# Get statistics
response = requests.get(f"{BASE_URL}/stats")
print(response.json())

# List sources
response = requests.get(f"{BASE_URL}/sources")
print(response.json())
```

## Configuration

### Text Splitting
- **Chunk Size**: 1000 characters
- **Chunk Overlap**: 200 characters

### Embeddings
- **Model**: gemini-embedding-001
- **Dimension**: 768
- **Provider**: Google Generative AI

### Vector Store
- **Provider**: Qdrant Cloud
- **Distance Metric**: Cosine similarity
- **Collection**: rag_documents

### LLM Settings
- **Model**: mixtral-8x7b-32768
- **Temperature**: 0.2
- **Top K Documents**: 4 (configurable per query)

## Architecture

1. **Document Loading**: WebBaseLoader and PyPDFLoader extract content
2. **Text Splitting**: RecursiveCharacterTextSplitter creates chunks
3. **Source Tagging**: Each chunk is tagged with source_type ("pdf" or "web")
4. **Embeddings**: Google Gemini generates 768-dimensional vectors
5. **Vector Store**: Qdrant stores chunks with metadata
6. **Retrieval**: Filtered search by source type using Qdrant filters
7. **LLM**: Groq's Mixtral model generates contextual answers

## Metadata Structure

Each document chunk stores:
```python
{
    "text": "chunk content...",
    "source_type": "pdf" or "web",
    "source_name": "filename.pdf" or "https://url.com",
    "chunk_index": 0,
    "timestamp": "2024-01-15T10:30:00",
    "metadata": {...}  # original langchain metadata
}
```

## Source Differentiation Benefits

1. **Targeted Search**: Query specific document types
2. **Source Tracking**: Know which documents contributed to answers
3. **Analytics**: Track usage patterns by source type
4. **Quality Control**: Evaluate accuracy by source type

## Performance Tips

1. **Batch URL Loading**: Load multiple URLs in one request
2. **Source Type Filtering**: Use source_type to reduce search space
3. **Top K Tuning**: Adjust top_k based on your needs
4. **Cloud Benefits**: Qdrant Cloud handles scaling automatically

## Troubleshooting

### "GROQ_API_KEY environment variable not set"
- Ensure your `.env` file contains the API key
- Or set it: `export GROQ_API_KEY=your_key`

### "GOOGLE_API_KEY environment variable not set"
- Add your Google API key to `.env`
- Get one from [ai.google.dev](https://ai.google.dev)

### Qdrant connection errors
- Check your internet connection
- Verify the Qdrant URL and API key are correct
- Ensure your Qdrant cluster is running

### PDF loading fails
- Ensure the PDF is not encrypted
- Check if pypdf can handle the PDF format
- Try different PDF files

### Empty search results
- Verify documents were loaded successfully
- Check /stats endpoint for document counts
- Try broader queries

## Security Notes

⚠️ **Important**: The Qdrant credentials in the code are hardcoded for demonstration. In production:
- Store credentials in environment variables
- Use secrets management (AWS Secrets Manager, HashiCorp Vault, etc.)
- Implement authentication and authorization
- Use HTTPS for all API calls

## License

MIT License

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.