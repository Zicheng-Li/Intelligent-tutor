from langchain_chroma import Chroma
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain_cohere import CohereEmbeddings
from langchain_cohere import ChatCohere
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv
from langchain_groq import ChatGroq
import chromadb

# Load environment variables from .env file
load_dotenv()

llm = ChatCohere(model="command-r-plus")
# llm = ChatGroq(model="llama3-70b-8192")

persistent_client = chromadb.PersistentClient(path="./chroma_data")

vectorstore = Chroma(  
    client=persistent_client,
    collection_name="user_2lu5aqxzH8dTqjm1sJ0oPSTd3iN_cm12559sz0001komzb9ke7ymo",
    embedding_function=CohereEmbeddings(model="embed-english-v3.0"),
)

retriever = vectorstore.as_retriever(
    search_type="similarity",
    search_kwargs={"k": 10}
)
    
topic = "micriophones and the different types"    
   
# Open the file and read its contents into a variable
with open('quiz_prompt.txt', 'r') as file:
    template = file.read()

prompt = ChatPromptTemplate.from_template(template)
topic = "micriophones and the different types"    

retriever = retrieve_from_vector_db()
print("info retrieved")
print("============================================")

def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)

rag_chain = (
    {"context": retriever | format_docs, "topic" : RunnablePassthrough()}
    | prompt
    | llm
    | Json
)

topic = "micriophones and the different types"   
num_questions = 3
print(rag_chain.invoke(topic))