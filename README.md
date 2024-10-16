## Inspiration
The inspiration for the IntelligentTutor project stems from a challenge familiar to many students—needing assistance with course material when professors or TAs aren’t readily available. As students, we often have urgent questions that can lead to stress, and waiting for answers can disrupt our learning process. IntelligentTutor was designed to address these doubts instantly, offering timely support to students whenever they need it, helping them feel more confident and less anxious about their studies. Additionally, with over 2.19 million university students in Canada alone grinding through coursework year-round (and 200 million worldwide), many still miss out on key topics due to time constraints. IntelligentTutor aims to provide them with quick and easy access to essential learning materials, ensuring no one falls behind.

## What it does
IntelligentTutor 📚 is here to make studying easier and smarter. After signing up with your email, GitHub, or Google account, you can add all your courses to a personalized dashboard. For each course, upload your textbooks, notes, or any other materials in PDF format—just once. From then on, IntelligentTutor does the heavy lifting.

Our AI-powered chatbot 🤖 is trained specifically on your course content. Whenever you have an exam, test, or quiz coming up, just ask questions like “Explain Topic A” or “Summarize Topic B” and get immediate, detailed responses based on your uploaded materials—no need to search through files or specify file names - bot knows exactly where to pull the information from. It's that simple!

✨ But that’s not all! Once you've reviewed a topic, IntelligentTutor lets you test yourself instantly 📝 by generating quizzes on the fly. This way, you can check your knowledge and get real-time feedback, helping you stay on top of your studies.

With IntelligentTutor, you get personalized support 24/7, saving time and reducing stress 🎯, so you can focus on mastering your courses and boosting your confidence. Get instant explanations, quiz yourself, and study any topic you need—without the hassle of digging through countless PDFs. It’s all about making your learning experience stress-free and efficient 📚.

## How we built it
We built IntelligentTutor using a combination of cutting-edge technologies to ensure a seamless and personalized learning experience.

- Frontend: The user interface is built with Next.js and TailwindCSS providing a responsive and interactive dashboard where students can easily manage their courses and materials.

- Backend: Our backend is powered by Typescript and Python, and manages user authentication with Clerk.

- AI & NLP: To provide intelligent responses, we integrated LangChain and OpenAI’s GPT model. To create high-quality questions from answers, we are using Groq which leverages the Llama3 model. These tools enable the chatbot to understand questions and generate answers based on the course-specific PDFs uploaded by students. 

- Database: We leveraged ChromaDB, a vector database, and Prisma to store the embedded representations of the course content and ensure that the chatbot only responds with material from the correct documents. This was made possible with Cohere embeddings which we were able to use due to the $150 credit (we embedded really big files).

## Challenges we ran into
- Integrating multiple LLM models and databases into a cohesive platform was more complex than anticipated, but we worked through it!
- Ensuring that the chatbot delivers course-specific responses with high accuracy while handling diverse student queries was a challenging yet rewarding task.

## Accomplishments that we're proud of
-User-Friendly Frontend: We created a highly intuitive and responsive interface, making it easy for students to navigate and manage their courses.
- Multiple LLMs in Action: Successfully integrated several powerful LLM models to provide insightful, course-specific answers.
- Knowledge Base Integration: We achieved seamless integration of a large knowledge base, allowing the tutor to expertly handle content from various sources.
- Creative Prompt Engineering: By crafting thoughtful prompts, we achieved highly accurate and relevant responses from the AI, enhancing the user experience.

## What we learned
- Retrieval-Augmented Generation (RAG): Implementing RAG for more accurate and relevant information retrieval was a valuable lesson.
- Personalized Multi-User Services: We learned how to create a multi-user application where each student receives personalized support based on their course material.
- LLM Behavior: Gained insights into the behaviour and performance of different LLM models, allowing us to optimize for various learning contexts.

## What's next for IntelligentTutor
- Expanding Question Types: We're excited to develop more question formats for quizzes, including interactive options like math problems, flashcards, and more!
- Enhanced Learning Tools: We plan to add features such as detailed topic explanations, study plans, and additional AI-powered tools to help students prepare better for their exams.