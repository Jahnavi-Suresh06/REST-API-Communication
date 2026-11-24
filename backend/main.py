
from datetime import datetime, timezone

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(
    title="REST API Communication Demo",
    description="Simple sender and receiver communication using REST API",
    version="1.0.0"
)

# Allow communication from the sender dashboard
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Temporary message storage
messages = []


# Message format
class MessageRequest(BaseModel):
    sender: str = "Jahnavi"
    message: str = Field(..., min_length=1)


# Home endpoint
@app.get("/")
def home():
    return {
        "status": "running",
        "application": "REST API Communication Demo"
    }


# Receive message from sender
@app.post("/api/messages")
def receive_message(data: MessageRequest):

    received_message = {
        "id": len(messages) + 1,
        "sender": data.sender,
        "message": data.message,
        "received_at": datetime.now(timezone.utc).isoformat()
    }

    messages.append(received_message)

    return {
        "status": "success",
        "message": "Message received successfully",
        "data": received_message
    }


# Retrieve all received messages
@app.get("/api/messages")
def get_messages():
    return {
        "total_messages": len(messages),
        "messages": messages
    }
