from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db.session import get_db
from app.models import Expense, ExpenseItem
from app.core.security import get_current_user
from uuid import UUID

router = APIRouter(prefix="/expenses", tags=["expenses"])


@router.get("")
def get_expenses(db: Session = Depends(get_db), user_id: str = Depends(get_current_user)):
    expenses = db.query(Expense).filter(Expense.user_id == user_id).order_by(Expense.created_at.desc()).all()
    return [
        {
            "id": str(e.id),
            "vendor": e.vendor,
            "date": str(e.date) if e.date else None,
            "total_amount": float(e.total_amount) if e.total_amount else None,
            "currency": e.currency,
            "category": e.category,
            "created_at": str(e.created_at),
        }
        for e in expenses
    ]


@router.get("/summary")
def get_summary(db: Session = Depends(get_db), user_id: str = Depends(get_current_user)):
    expenses = db.query(Expense).filter(Expense.user_id == user_id).all()

    total_spent = sum(float(e.total_amount) for e in expenses if e.total_amount)
    count = len(expenses)

    # By category
    by_category = {}
    for e in expenses:
        if e.category and e.total_amount:
            by_category[e.category] = by_category.get(e.category, 0) + float(e.total_amount)

    return {
        "total_spent": total_spent,
        "total_receipts": count,
        "by_category": by_category,
    }


@router.get("/monthly")
def get_monthly(db: Session = Depends(get_db), user_id: str = Depends(get_current_user)):
    expenses = db.query(Expense).filter(
        Expense.user_id == user_id,
        Expense.date.isnot(None),
        Expense.total_amount.isnot(None)
    ).all()

    monthly = {}
    for e in expenses:
        key = e.date.strftime("%Y-%m")
        monthly[key] = monthly.get(key, 0) + float(e.total_amount)

    # Sort by month
    sorted_monthly = dict(sorted(monthly.items()))
    return {"monthly": sorted_monthly}


@router.get("/{expense_id}")
def get_expense(expense_id: UUID, db: Session = Depends(get_db), user_id: str = Depends(get_current_user)):
    expense = db.query(Expense).filter(
        Expense.id == expense_id,
        Expense.user_id == user_id
    ).first()

    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")

    return {
        "id": str(expense.id),
        "vendor": expense.vendor,
        "date": str(expense.date) if expense.date else None,
        "total_amount": float(expense.total_amount) if expense.total_amount else None,
        "currency": expense.currency,
        "category": expense.category,
        "created_at": str(expense.created_at),
        "items": [
            {"id": str(i.id), "name": i.name, "amount": float(i.amount) if i.amount else None}
            for i in expense.items
        ]
    }


@router.delete("/{expense_id}")
def delete_expense(expense_id: UUID, db: Session = Depends(get_db), user_id: str = Depends(get_current_user)):
    expense = db.query(Expense).filter(
        Expense.id == expense_id,
        Expense.user_id == user_id
    ).first()

    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")

    db.delete(expense)
    db.commit()
    return {"message": "Deleted successfully"}