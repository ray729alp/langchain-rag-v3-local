import os
import shutil
from typing import List
from langchain_community.document_loaders import (
    DirectoryLoader,
    TextLoader,
    PyPDFLoader,
    Docx2txtLoader,
    UnstructuredWordDocumentLoader
)
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.schema import Document
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma

# Map chatbot categories to data folder names
CATEGORIES = {
    "accreditation": "data/accreditation",
    "framework": "data/framework",
    "qualifications": "data/qualifications", 
    "recognition": "data/recognition",
    "equivalency": "data/equivalency",
    "apel": "data/apel",
    "faq": "data/faq"
}

EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"

def create_vector_stores():
    """Create vector stores for all categories with multiple file format support"""
    
    # Check and install required packages
    install_required_packages()
    
    embeddings = HuggingFaceEmbeddings(
        model_name=EMBEDDING_MODEL,
        model_kwargs={"device": "cpu"},
        encode_kwargs={"normalize_embeddings": True}
    )
    
    print("🚀 Starting vector store creation for MQA categories...")
    print("=" * 60)
    
    for category, data_path in CATEGORIES.items():
        if not os.path.exists(data_path):
            print(f"⚠ Skipping {category}: Data directory '{data_path}' not found")
            continue
            
        print(f"\n📂 Processing {category.upper()} documents...")
        print(f"   Data path: {data_path}")
        
        documents = load_documents(data_path)
        if not documents:
            print(f"   No documents found in {data_path}")
            continue
            
        chunks = split_text(documents)
        save_to_chroma(chunks, f"chroma/{category}", embeddings)
    
    print("\n" + "=" * 60)
    print("✅ Vector store creation completed!")

def load_documents(data_path: str) -> List[Document]:
    """Load documents from various file formats"""
    
    loaders = {
        '.txt': (TextLoader, {}),
        '.md': (TextLoader, {}),
        '.pdf': (PyPDFLoader, {}),
        '.docx': (Docx2txtLoader, {}),
        '.doc': (UnstructuredWordDocumentLoader, {})
    }
    
    all_docs = []
    total_files = 0
    
    for ext, (loader_class, loader_kwargs) in loaders.items():
        try:
            pattern = f"**/*{ext}"
            loader = DirectoryLoader(
                data_path, 
                glob=pattern,
                loader_cls=loader_class,
                loader_kwargs=loader_kwargs,
                use_multithreading=True,
                silent_errors=True
            )
            
            docs = loader.load()
            if docs:
                print(f"   📄 Loaded {len(docs)} {ext.upper()} files")
                all_docs.extend(docs)
                total_files += len(docs)
                
        except Exception as e:
            print(f"   ❌ Error loading {ext} files: {str(e)}")
    
    print(f"   📊 Total documents loaded: {total_files}")
    return all_docs

def split_text(documents: List[Document]) -> List[Document]:
    """Split documents into chunks for processing"""
    
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len,
        add_start_index=True,
    )
    
    chunks = text_splitter.split_documents(documents)
    print(f"   ✂️  Split into {len(chunks)} chunks")
    return chunks

def save_to_chroma(chunks: List[Document], chroma_path: str, embeddings):
    """Save processed chunks to ChromaDB"""
    
    # Clear existing database if it exists
    if os.path.exists(chroma_path):
        shutil.rmtree(chroma_path)
        print(f"   ♻️  Cleared existing database")
    
    try:
        # Create Chroma database - it automatically persists
        db = Chroma.from_documents(
            documents=chunks,
            embedding=embeddings,
            persist_directory=chroma_path
        )
        
        # Test if database was created successfully
        test_docs = db.get()
        print(f"   💾 Saved {len(test_docs['ids'])} chunks to {chroma_path}")
        
        return db
        
    except Exception as e:
        print(f"   ❌ Error saving to Chroma: {str(e)}")
        return None

def install_required_packages():
    """Install required packages for document processing"""
    
    required_packages = [
        "unstructured",
        "pypdf",
        "docx2txt",
        "unstructured[local-inference]",
        "pdf2image",
        "pytesseract"
    ]
    
    import subprocess
    import sys
    import importlib
    
    print("🔍 Checking required packages...")
    
    for package in required_packages:
        package_name = package.split('[')[0]
        try:
            importlib.import_module(package_name)
            print(f"   ✓ {package_name} already installed")
        except ImportError:
            print(f"   📦 Installing {package}...")
            try:
                subprocess.check_call([sys.executable, "-m", "pip", "install", package])
                print(f"   ✓ Successfully installed {package}")
            except subprocess.CalledProcessError:
                print(f"   ❌ Failed to install {package}")

def check_data_directories():
    """Check if data directories exist and create them if missing"""
    
    print("📁 Checking data directories...")
    
    for category, data_path in CATEGORIES.items():
        if not os.path.exists(data_path):
            os.makedirs(data_path, exist_ok=True)
            print(f"   📂 Created directory: {data_path}")
        else:
            # Check if directory has files
            file_count = len([f for f in os.listdir(data_path) if os.path.isfile(os.path.join(data_path, f))])
            print(f"   ✓ Directory exists: {data_path} ({file_count} files)")

def verify_databases():
    """Verify that databases were created successfully"""
    
    print("\n🔍 Verifying database creation...")
    
    for category in CATEGORIES.keys():
        db_path = f"chroma/{category}"
        if os.path.exists(db_path):
            try:
                # Try to load the database
                embeddings = HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL)
                db = Chroma(persist_directory=db_path, embedding_function=embeddings)
                doc_count = len(db.get()['ids'])
                print(f"   ✅ {category}: {doc_count} documents")
            except Exception as e:
                print(f"   ❌ {category}: Error loading - {str(e)}")
        else:
            print(f"   ❌ {category}: Database not created")

if __name__ == "__main__":
    # Check and create data directories
    check_data_directories()
    
    # Create vector stores
    create_vector_stores()
    
    # Verify databases
    verify_databases()
    
    print("\n🎉 Setup completed!")
    print("\n📋 Category Mapping:")
    for category, path in CATEGORIES.items():
        db_path = f"chroma/{category}"
        if os.path.exists(db_path):
            try:
                embeddings = HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL)
                db = Chroma(persist_directory=db_path, embedding_function=embeddings)
                doc_count = len(db.get()['ids'])
                print(f"   ✅ {category}: {doc_count} documents in database")
            except:
                print(f"   ⚠ {category}: Database exists but cannot verify content")
        else:
            print(f"   ❌ {category}: No database created - add documents to {path}/")
    
    print("\nNext steps:")
    print("1. Add your documents to the appropriate data folders:")
    for category, path in CATEGORIES.items():
        print(f"   - {category}: {path}/")
    print("2. Supported formats: .txt, .md, .pdf, .doc, .docx")
    print("3. Run this script again to update the vector stores")