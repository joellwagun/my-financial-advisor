from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models import Expense
from app.core.security import get_current_user
import ollama

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("")
def chat(body: dict, db: Session = Depends(get_db), user_id: str = Depends(get_current_user)):
    question = body.get("message")
    if not question:
        raise HTTPException(status_code=400, detail="message is required")

    # Fetch user's expenses
    expenses = db.query(Expense).filter(Expense.user_id == user_id).all()

    if not expenses:
        return {"reply": "You have no expenses recorded yet. Upload a receipt first!"}

    # Format as context
    context = "\n".join([
        f"- Vendor: {e.vendor}, Date: {e.date}, Category: {e.category}, Amount: {e.total_amount} {e.currency}"
        for e in expenses
    ])

    client = ollama.Client(host="http://host.docker.internal:11434")
    response = client.chat(
        model="gemma3:4b",
        messages=[{
            "role": "user",
            "content": f"""You are a personal finance assistant. 
Here are the user's expenses:
{context}

Answer this question in plain English: {question}"""
        }]
    )

    return {"reply": response['message']['content']}