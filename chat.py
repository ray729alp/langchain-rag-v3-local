from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma
from langchain_ollama import ChatOllama
from langchain.chains import ConversationalRetrievalChain
from langchain.memory import ConversationBufferMemory
import os
import re
from urllib.parse import urlparse, quote, urlunparse
from pathlib import Path

class ChatBot:
    def __init__(self):
        self.embeddings = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2"
        )
        
        # Match categories with create_database.py
        self.databases = {
            "accreditation": None,
            "framework": None,
            "qualifications": None,
            "recognition": None,
            "equivalency": None,
            "apel": None,
            "faq": None
        }
        
        self.qa_chains = {}
        self.memory = ConversationBufferMemory(
            memory_key="chat_history",
            return_messages=True,
            output_key='answer'
        )
        self._initialize_databases()
    
    def _initialize_databases(self):
        # Get the absolute path to chroma directory
        base_dir = Path(__file__).parent
        chroma_dir = base_dir / "chroma"
        
        print(f"Looking for databases in: {chroma_dir}")
        
        for category in self.databases.keys():
            db_path = chroma_dir / category
            
            if db_path.exists():
                try:
                    print(f"Loading database from: {db_path}")
                    self.databases[category] = Chroma(
                        persist_directory=str(db_path),
                        embedding_function=self.embeddings
                    )
                    
                    # Test if database has documents
                    test_docs = self.databases[category].get()
                    doc_count = len(test_docs['ids']) if 'ids' in test_docs else 0
                    print(f"✓ Loaded {category} with {doc_count} documents")
                    
                    # Only initialize QA chain if we have documents
                    if doc_count > 0:
                        self._initialize_qa_chain(category)
                    else:
                        print(f"⚠ No documents in {category} database")
                        self.qa_chains[category] = None
                        
                except Exception as e:
                    print(f"✗ Error loading database for {category}: {str(e)}")
                    self.databases[category] = None
                    self.qa_chains[category] = None
            else:
                print(f"⚠ Database directory not found: {db_path}")
                self.databases[category] = None
                self.qa_chains[category] = None

    def _initialize_qa_chain(self, category):
        try:
            # Initialize LLM with better error handling
            llm = ChatOllama(
                model="llama3:8b",
                temperature=0.1,
                timeout=60
            )
            
            # Test if LLM is working
            try:
                test_response = llm.invoke("Hello")
                print(f"✓ LLM connection successful for {category}")
            except Exception as e:
                print(f"✗ LLM connection failed for {category}: {str(e)}")
                # Fallback to a simple chain without LLM
                self.qa_chains[category] = None
                return
            
            self.qa_chains[category] = ConversationalRetrievalChain.from_llm(
                llm,
                self.databases[category].as_retriever(
                    search_kwargs={"k": 3}
                ),
                memory=ConversationBufferMemory(
                    memory_key="chat_history",
                    return_messages=True,
                    output_key='answer'
                ),
                return_source_documents=True,
                verbose=False,
                chain_type="stuff"
            )
            print(f"✓ QA chain initialized for {category}")
            
        except Exception as e:
            print(f"✗ Error initializing QA chain for {category}: {str(e)}")
            self.qa_chains[category] = None

    def _sanitize_url(self, url):
        """Sanitize and validate URLs to prevent about:blank#blocked errors"""
        if not url:
            return None
        
        # Ensure URL has proper scheme
        if not url.startswith(('http://', 'https://')):
            url = 'https://' + url
        
        try:
            # Parse and reconstruct URL to ensure it's valid
            parsed = urlparse(url)
            if not parsed.netloc:  # No domain found
                return None
            
            # Reconstruct URL with proper encoding
            sanitized_url = urlunparse((
                parsed.scheme,
                parsed.netloc,
                quote(parsed.path),
                quote(parsed.params),
                quote(parsed.query),
                quote(parsed.fragment)
            ))
            
            return sanitized_url
        except Exception:
            return None
    
    def _format_response(self, answer):
        """Format the response with proper HTML formatting and safe clickable links"""
        if not answer:
            return "No answer generated. Please try again."
        
        # First, extract and preserve URLs before any other formatting
        url_pattern = r'(https?://[^\s<>"\'\)]+|www\.[^\s<>"\'\)]+)'
        urls = re.findall(url_pattern, answer)
        
        # Replace URLs with placeholders temporarily
        url_placeholders = {}
        for i, url in enumerate(urls):
            placeholder = f"__URL_PLACEHOLDER_{i}__"
            url_placeholders[placeholder] = url
            answer = answer.replace(url, placeholder)
        
        # Convert numbered lists with proper line breaks
        formatted_answer = answer.replace('\n', '<br>')
        
        # Add proper spacing for common phrases
        formatted_answer = formatted_answer.replace('Additionally,', '<br><br>Additionally,')
        formatted_answer = formatted_answer.replace('Furthermore,', '<br><br>Furthermore,')
        formatted_answer = formatted_answer.replace('Moreover,', '<br><br>Moreover,')
        formatted_answer = formatted_answer.replace('However,', '<br><br>However,')
        
        # Restore URLs with proper HTML link format
        for placeholder, original_url in url_placeholders.items():
            sanitized_url = self._sanitize_url(original_url)
            if sanitized_url:
                link_html = f'<a href="{sanitized_url}" target="_blank" rel="noopener noreferrer" style="color: #1a3e8c; text-decoration: underline; font-weight: 600;">{original_url}</a>'
                formatted_answer = formatted_answer.replace(placeholder, link_html)
            else:
                # If URL is invalid, just show the text
                formatted_answer = formatted_answer.replace(placeholder, original_url)
        
        return formatted_answer
    
    def _get_fallback_answer(self, query, category):
        """Provide fallback answers when RAG fails"""
        fallback_responses = {
            "accreditation": "For accreditation inquiries, please visit the MQA accreditation portal or contact accreditation@mqa.gov.my. You can find more information at https://www.mqa.gov.my.",
            "framework": "The Malaysian Qualifications Framework (MQF) is available on the official MQA website. Visit https://www.mqa.gov.my for detailed information about MQF levels and standards.",
            "qualifications": "For qualification standards and program development guidelines, please refer to the MQF handbook available at https://www.mqa.gov.my or contact qualifications@mqa.gov.my.",
            "recognition": "For recognition of qualifications, please contact recognition@mqa.gov.my or visit https://www.mqa.gov.my/recognition for application procedures.",
            "equivalency": "For qualification equivalency assessments, please visit https://www.mqa.gov.my/equivalency or contact equivalency@mqa.gov.my.",
            "apel": "For APEL (Accreditation of Prior Experiential Learning) inquiries, please visit https://www.mqa.gov.my/apel or contact apel@mqa.gov.my.",
            "faq": "For frequently asked questions, please check the MQA FAQ section at https://www.mqa.gov.my/faq or contact enquiry@mqa.gov.my for specific inquiries."
        }
        
        return fallback_responses.get(category, "I apologize, but I'm having trouble accessing the specific information right now. Please contact MQA directly at enquiry@mqa.gov.my or visit https://www.mqa.gov.my for assistance.")
    
    def chat(self, query: str, category: str = None):
        if not category or category not in self.databases:
            return {
                "answer": "Please select a valid category first from the available options.",
                "sources": []
            }
        
        # Check if database is loaded
        if not self.databases.get(category):
            return {
                "answer": f"Database not available for {category}. Please try another category.",
                "sources": []
            }
        
        # Check if QA chain is initialized
        if not self.qa_chains.get(category):
            return {
                "answer": self._get_fallback_answer(query, category),
                "sources": []
            }
        
        try:
            print(f"Processing query: '{query}' for category: {category}")
            
            # Format the query with context
            formatted_query = f"Regarding MQA {category.replace('_', ' ').title()}: {query}"
            
            # Use invoke for newer LangChain versions
            result = self.qa_chains[category].invoke({
                "question": formatted_query, 
                "chat_history": []
            })
            
            # Extract source document information safely
            sources = []
            source_docs = result.get('source_documents', [])
            
            for doc in source_docs:
                if hasattr(doc, 'metadata'):
                    source_name = os.path.basename(doc.metadata.get('source', 'Unknown Document'))
                    page_info = f"Page {doc.metadata.get('page', 'N/A')}" if doc.metadata.get('page') else ""
                    sources.append(f"{source_name} {page_info}".strip())
            
            # Ensure we have a proper answer
            answer = result.get('answer', 'No answer generated. Please try again.')
            if not answer or answer.strip() == '' or "I don't know" in answer.lower() or "I cannot" in answer.lower():
                answer = self._get_fallback_answer(query, category)
            else:
                answer = self._format_response(answer)
            
            print(f"Final answer prepared for {category}")
            
            return {
                "answer": answer,
                "sources": sources
            }
            
        except Exception as e:
            print(f"Error processing query: {str(e)}")
            import traceback
            traceback.print_exc()
            
            return {
                "answer": self._get_fallback_answer(query, category),
                "sources": []
            }

# For testing the chatbot directly
if __name__ == "__main__":
    print("Testing MQA ChatBot...")
    chatbot = ChatBot()
    
    # Test with a sample query
    test_query = "How to file a complaint and what is the website?"
    test_category = "faq"
    
    print(f"\nTesting query: '{test_query}' in category: {test_category}")
    response = chatbot.chat(test_query, test_category)
    
    print(f"\nResponse:")
    print(f"Answer: {response['answer']}")
    print(f"Sources: {response['sources']}")