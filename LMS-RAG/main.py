from dotenv import load_dotenv
load_dotenv()
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl
from typing import List, Optional
import os
from langchain_community.document_loaders import WebBaseLoader, PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_groq import ChatGroq
from langchain.prompts import PromptTemplate
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct, Filter, FieldCondition, MatchValue
from google import genai
import tempfile
import shutil
from pathlib import Path
import uuid
from datetime import datetime

# Initialize FastAPI app
app = FastAPI(title="RAG Backend API with Qdrant & Gemini", version="2.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Environment variables
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY", "")
qdrantclientapikey=os.getenv("qdrantclientapikey")

# Initialize Qdrant client

qdrant_client = QdrantClient(
    url="https://b33de8cb-0cc4-4400-b1bf-9689ec74812f.sa-east-1-0.aws.cloud.qdrant.io", 
    api_key=qdrantclientapikey,
)


# Initialize Gemini client
gemini_client = genai.Client(api_key=GOOGLE_API_KEY)

# Collection name
COLLECTION_NAME = "rag_documents"

# Pydantic models
class URLInput(BaseModel):
    urls: List[HttpUrl]

class QueryInput(BaseModel):
    question: str
    top_k: Optional[int] = 4
    source_type: Optional[str] = None  # "pdf", "web", or None for both

class Response(BaseModel):
    answer: str
    sources: List[dict]

class DocumentStats(BaseModel):
    total_documents: int
    pdf_documents: int
    web_documents: int

# Initialize text splitter
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200,
    length_function=len,
)

def initialize_collection():
    """Initialize Qdrant collection if it doesn't exist"""
    try:
        collections = qdrant_client.get_collections()
        collection_names = [col.name for col in collections.collections]
        
        if COLLECTION_NAME not in collection_names:
            # Gemini embeddings are 768 dimensional
            qdrant_client.create_collection(
                collection_name=COLLECTION_NAME,
                vectors_config=VectorParams(size=3072, distance=Distance.COSINE),
            )
            print(f"Created collection: {COLLECTION_NAME}")
        else:
            print(f"Collection {COLLECTION_NAME} already exists")
    except Exception as e:
        print(f"Error initializing collection: {str(e)}")
        raise

def get_embedding(text: str) -> List[float]:
    """Get embedding from Google Gemini"""
    try:
        result = gemini_client.models.embed_content(
            model="gemini-embedding-001",
            contents=text
        )
        return result.embeddings[0].values
    except Exception as e:
        print(f"Error getting embedding: {str(e)}")
        raise

def store_documents_in_qdrant(documents: List, source_type: str, source_name: str):
    """Store document chunks in Qdrant with metadata"""
    chunks = text_splitter.split_documents(documents)
    points = []
    
    for idx, chunk in enumerate(chunks):
        # Generate embedding
        embedding = get_embedding(chunk.page_content)
        
        # Create point with metadata
        point = PointStruct(
            id=str(uuid.uuid4()),
            vector=embedding,
            payload={
                "text": chunk.page_content,
                "source_type": source_type,  # "pdf" or "web"
                "source_name": source_name,
                "chunk_index": idx,
                "timestamp": datetime.utcnow().isoformat(),
                "metadata": chunk.metadata
            }
        )
        points.append(point)
    
    # Upload points to Qdrant
    qdrant_client.upsert(
        collection_name=COLLECTION_NAME,
        points=points
    )
    
    return len(chunks)

def search_similar_documents(query: str, top_k: int = 4, source_type: Optional[str] = None):
    """Search for similar documents in Qdrant"""
    # Get query embedding
    query_embedding = get_embedding(query)
    
    # Build filter if source_type is specified
    search_filter = None
    if source_type:
        search_filter = Filter(
            must=[
                FieldCondition(
                    key="source_type",
                    match=MatchValue(value=source_type)
                )
            ]
        )
    
    # Search in Qdrant
    search_results = qdrant_client.search(
        collection_name=COLLECTION_NAME,
        query_vector=query_embedding,
        limit=top_k,
        query_filter=search_filter
    )
    
    return search_results

def generate_answer(question: str, context_docs: List) -> str:
    """Generate answer using Groq LLM"""
    if not GROQ_API_KEY:
        raise ValueError("GROQ_API_KEY environment variable not set")
    
    # Initialize Groq LLM
    llm = ChatGroq(
        groq_api_key="",
        model_name="groq/compound-mini",
        temperature=0.2,
    )
    
    # Prepare context from retrieved documents
    context = "\n\n".join([doc.payload["text"] for doc in context_docs])
    
    # Create prompt
    prompt_template = """Use the following pieces of context to answer the question at the end. 
    If you don't know the answer, just say that you don't know, don't try to make up an answer.
    
    Context: {context}
    
    Question: {question}
    
    Answer: """
    
    prompt = prompt_template.format(context=context, question=question)
    
    # Generate answer
    response = llm.invoke(prompt)
    
    return response.content

@app.on_event("startup")
async def startup_event():
    """Initialize collection on startup"""
    try:
        initialize_collection()
    except Exception as e:
        print(f"Warning: Could not initialize collection: {str(e)}")

@app.get("/")
async def root():
    """Health check endpoint"""
    try:
        collections = qdrant_client.get_collections()
        collection_exists = COLLECTION_NAME in [col.name for col in collections.collections]
        
        return {
            "message": "RAG Backend API with Qdrant & Gemini",
            "status": "healthy",
            "collection_exists": collection_exists,
            "collection_name": COLLECTION_NAME
        }
    except Exception as e:
        return {
            "message": "RAG Backend API",
            "status": "error",
            "error": str(e)
        }

@app.post("/load-urls")
async def load_urls(url_input: URLInput):
    """Load documents from web URLs and store in Qdrant"""
    try:
        total_chunks = 0
        successful_urls = []
        failed_urls = []
        
        for url in url_input.urls:
            try:
                # Load document from URL
                loader = WebBaseLoader(str(url))
                documents = loader.load()
                
                if documents:
                    # Store in Qdrant with source_type="web"
                    num_chunks = store_documents_in_qdrant(
                        documents=documents,
                        source_type="web",
                        source_name=str(url)
                    )
                    total_chunks += num_chunks
                    successful_urls.append(str(url))
                else:
                    failed_urls.append(str(url))
                    
            except Exception as e:
                print(f"Error loading URL {url}: {str(e)}")
                failed_urls.append(str(url))
                continue
        
        if not successful_urls:
            raise HTTPException(
                status_code=400,
                detail="No documents could be loaded from provided URLs"
            )
        
        return {
            "message": "URLs loaded successfully",
            "successful_urls": successful_urls,
            "failed_urls": failed_urls,
            "total_chunks": total_chunks,
            "status": "success"
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading URLs: {str(e)}")

@app.post("/load-pdf")
async def load_pdf(file: UploadFile = File(...)):
    """Load PDF document and store in Qdrant"""
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    
    try:
        # Create temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp_file:
            shutil.copyfileobj(file.file, tmp_file)
            tmp_path = tmp_file.name
        
        try:
            # Load PDF
            loader = PyPDFLoader(tmp_path)
            documents = loader.load()
            
            if not documents:
                raise HTTPException(
                    status_code=400,
                    detail="No content could be extracted from PDF"
                )
            
            # Store in Qdrant with source_type="pdf"
            num_chunks = store_documents_in_qdrant(
                documents=documents,
                source_type="pdf",
                source_name=file.filename
            )
            
            return {
                "message": "PDF loaded successfully",
                "filename": file.filename,
                "num_pages": len(documents),
                "num_chunks": num_chunks,
                "status": "success"
            }
        
        finally:
            # Clean up temporary file
            Path(tmp_path).unlink(missing_ok=True)
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading PDF: {str(e)}")

@app.post("/query", response_model=Response)
async def query(query_input: QueryInput):
    """Query the RAG system with optional source type filtering"""
    try:
        # Validate source_type if provided
        if query_input.source_type and query_input.source_type not in ["pdf", "web"]:
            raise HTTPException(
                status_code=400,
                detail="source_type must be 'pdf', 'web', or null"
            )
        
        # Search for similar documents
        search_results = search_similar_documents(
            query=query_input.question,
            top_k=query_input.top_k,
            source_type=query_input.source_type
        )
        
        if not search_results:
            return Response(
                answer="I couldn't find any relevant documents to answer your question. Please load some documents first.",
                sources=[]
            )
        
        # Generate answer
        answer = generate_answer(query_input.question, search_results)
        
        # Extract unique sources with details
        sources = []
        seen_sources = set()
        
        for result in search_results:
            source_key = f"{result.payload['source_type']}:{result.payload['source_name']}"
            if source_key not in seen_sources:
                sources.append({
                    "type": result.payload['source_type'],
                    "name": result.payload['source_name'],
                    "score": result.score
                })
                seen_sources.add(source_key)
        
        return Response(
            answer=answer,
            sources=sources
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing query: {str(e)}")

@app.get("/stats", response_model=DocumentStats)
async def get_stats():
    """Get statistics about documents in the collection"""
    try:
        # Get collection info
        collection_info = qdrant_client.get_collection(COLLECTION_NAME)
        total_docs = collection_info.points_count
        
        # Count PDFs - scroll through all points
        pdf_count = 0
        web_count = 0
        
        # Use scroll to get all points (in batches)
        offset = None
        while True:
            results, offset = qdrant_client.scroll(
                collection_name=COLLECTION_NAME,
                limit=100,
                offset=offset,
                with_payload=True,
                with_vectors=False
            )
            
            if not results:
                break
            
            for point in results:
                if point.payload.get("source_type") == "pdf":
                    pdf_count += 1
                elif point.payload.get("source_type") == "web":
                    web_count += 1
            
            if offset is None:
                break
            total_docs = collection_info.get("points_count", 0)
        return {
            "total_documents": total_docs,
            "pdf_documents": pdf_count,
            "web_documents": web_count
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting stats: {str(e)}")

@app.delete("/reset")
async def reset_collection():
    """Delete and recreate the collection"""
    try:
        # Delete collection
        qdrant_client.delete_collection(COLLECTION_NAME)
        
        # Recreate collection
        initialize_collection()
        
        return {
            "message": "Collection reset successfully",
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error resetting collection: {str(e)}")

@app.get("/sources")
async def list_sources():
    """List all unique sources in the collection"""
    try:
        sources = {"pdf": [], "web": []}
        seen_sources = {"pdf": set(), "web": set()}
        
        # Scroll through all points
        offset = None
        while True:
            results, offset = qdrant_client.scroll(
                collection_name=COLLECTION_NAME,
                limit=100,
                offset=offset,
                with_payload=True,
                with_vectors=False
            )
            
            if not results:
                break
            
            for point in results:
                source_type = point.payload.get("source_type")
                source_name = point.payload.get("source_name")
                
                if source_type and source_name:
                    if source_name not in seen_sources[source_type]:
                        sources[source_type].append({
                            "name": source_name,
                            "timestamp": point.payload.get("timestamp")
                        })
                        seen_sources[source_type].add(source_name)
            
            if offset is None:
                break
        
        return {
            "pdf_sources": sources["pdf"],
            "web_sources": sources["web"],
            "total_pdf_sources": len(sources["pdf"]),
            "total_web_sources": len(sources["web"])
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error listing sources: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)