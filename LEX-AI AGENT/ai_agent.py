import os
from dotenv import load_dotenv  
load_dotenv()                   

from langchain_groq import ChatGroq
from langchain_openai import ChatOpenAI
from langchain_tavily import TavilySearch
from langgraph.prebuilt import create_react_agent
from langchain_core.messages.ai import AIMessage
from langchain_core.messages import HumanMessage, SystemMessage

GROQ_API_KEY = os.environ.get("GROQ_API_KEY")
TAVILY_API_KEY = os.environ.get("TAVILY_API_KEY")
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")

def get_response_from_ai_agent(llm_id, query, allow_search, system_prompt, provider):
    if provider == "Groq":
        llm = ChatGroq(model=llm_id, temperature=0)
    elif provider == "OpenAI":
        llm = ChatOpenAI(model=llm_id, temperature=0)
    else:
        raise ValueError("Unsupported provider")

    tools = [TavilySearch(k=2)] if allow_search else []

    messages = [SystemMessage(content=system_prompt)]

    for msg in query:
        if msg.role == "user":
            messages.append(HumanMessage(content=msg.content))
        elif msg.role == "system":
            messages.append(SystemMessage(content=msg.content))
        else:
            raise ValueError(f"Unknown message role: {msg.role}")

    state = {"messages": messages}

    agent = create_react_agent(model=llm, tools=tools)
    response = agent.invoke(state)

    ai_messages = [
        msg.content for msg in response.get("messages", [])
        if isinstance(msg, AIMessage)
    ]

    return ai_messages[-1] if ai_messages else "No response generated."
