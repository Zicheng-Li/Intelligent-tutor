import os
# from langchain import hub
from langchain_chroma import Chroma
from langchain_community.document_loaders import WebBaseLoader
from langchain_community.document_loaders import PyPDFLoader
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
# from langchain_openai import OpenAIEmbeddings
from pydantic import BaseModel
from langchain_cohere import CohereEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_cohere.llms import Cohere
# from langchain_openai import OpenAI
from langchain_core.prompts import PromptTemplate
from langchain_cohere import ChatCohere
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv
from operator import itemgetter
from langchain_groq import ChatGroq

# Load environment variables from .env file
load_dotenv()

# Access the API keys
# os.environ["COHERE_API_KEY"] = getpass.getpass()
# api_key = os.getenv('API_KEY')
# secret_key = os.getenv('SECRET_KEY')


# Load, chunk and index the contents of the blog.


loader = PyPDFLoader("network.pdf")
docs = loader.load()
    



text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
splits = text_splitter.split_documents(docs)


llm = ChatCohere(model="command-r-plus")
# llm = ChatGroq(model="llama3-70b-8192")


vectorstore = Chroma.from_documents(documents=splits, embedding=CohereEmbeddings(model="embed-english-v3.0"))



# Retrieve and generate using the relevant snippets of the blog.
retriever = vectorstore.as_retriever(
    search_type="similarity",
    search_kwargs={"k": 5}
)
    



# prompt = hub.pull("rlm/rag-prompt")

# Open the file and read its contents into a variable
with open('quiz_prompt.txt', 'r') as file:
    template = file.read()
    
topic = "Adjacency matricies and their powers."    
   
# llm = ChatCohere(model="command-r-plus") 

prompt = ChatPromptTemplate.from_template(template)

print(template)

rag_chain = (
      prompt
    | llm
    | StrOutputParser()
)

# docs = load_pdf("network.pdf")
# print("docs loaded")
# splits = split_files(docs)
# print("docs split")
# vectorstore = vector_db_store(splits)
# print("vectors loaded")
# retriever = retrieve_from_vector_db(vectorstore)
# print("info retrieved")
print("============================================")

def format_docs(docs):
    print("\n\n".join(doc.page_content for doc in docs))



topic = "Dynamics and mechanics"
num_questions = 3
print(rag_chain.invoke({"context": retriever | format_docs, "num_questions" : num_questions, "topic" : topic}))