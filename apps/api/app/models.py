from sqlalchemy import Column, String, Numeric, Date, Text, ForeignKey, TIMESTAMP, Boolean, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.session import Base


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    email = Column(String(255), unique=True, nullable=False)
    hashed_password = Column(Text, nullable=False)
    full_name = Column(String(255))
    is_active = Column(Boolean, default=True)
    created_at = Column(TIMESTAMP, server_default=text("now()"))
    updated_at = Column(TIMESTAMP, server_default=text("now()"))

    expenses = relationship("Expense", back_populates="user")


class Expense(Base):
    __tablename__ = "expenses"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"))
    vendor = Column(String(255))
    date = Column(Date)
    total_amount = Column(Numeric(10, 2))
    currency = Column(String(10))
    category = Column(String(50))
    raw_text = Column(Text)
    created_at = Column(TIMESTAMP, server_default=text("now()"))

    user = relationship("User", back_populates="expenses")
    items = relationship("ExpenseItem", back_populates="expense")


class ExpenseItem(Base):
    __tablename__ = "expense_items"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    expense_id = Column(UUID(as_uuid=True), ForeignKey("expenses.id", ondelete="CASCADE"))
    name = Column(String(255))
    amount = Column(Numeric(10, 2))

    expense = relationship("Expense", back_populates="items")