from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session
from app.ocr import extract_text, parse_receipt, parse_receipt_llm
from app.db.session import get_db
from app.models import Expense, ExpenseItem
from datetime import datetime
import tempfile
import os

router = APIRouter(prefix="/ocr", tags=["OCR"])


@router.post("/extract")
async def extract_text_from_image(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name
    try:
        text = extract_text(tmp_path)
        return {"filename": file.filename, "extracted_text": text, "char_count": len(text)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        os.unlink(tmp_path)


@router.post("/extract/receipt")
async def extract_receipt(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name
    try:
        text = extract_text(tmp_path)
        parsed = parse_receipt(text)
        return {"filename": file.filename, "raw_text": text, "parsed": parsed}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        os.unlink(tmp_path)


@router.post("/extract/receipt/llm")
async def extract_receipt_llm(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name
    try:
        text = extract_text(tmp_path)
        parsed = parse_receipt_llm(text)
        return {"filename": file.filename, "raw_text": text, "parsed": parsed}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        os.unlink(tmp_path)


@router.post("/extract/receipt/llm/save")
async def extract_and_save(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name
    try:
        text = extract_text(tmp_path)
        parsed = parse_receipt_llm(text)

        # Parse date safely
        date = None
        if parsed.get("date"):
            try:
                date = datetime.strptime(parsed["date"], "%Y-%m-%d").date()
            except ValueError:
                date = None

        # Save expense
        expense = Expense(
            vendor=parsed.get("vendor"),
            date=date,
            total_amount=parsed.get("total_amount"),
            currency=parsed.get("currency"),
            category=parsed.get("category"),
            raw_text=text,
        )
        db.add(expense)
        db.flush()  # get expense.id before committing

        # Save items
        for item in parsed.get("items", []):
            db.add(ExpenseItem(
                expense_id=expense.id,
                name=item.get("name"),
                amount=item.get("amount"),
            ))

        db.commit()
        db.refresh(expense)

        return {
            "message": "Saved successfully",
            "expense_id": str(expense.id),
            "parsed": parsed
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        os.unlink(tmp_path)