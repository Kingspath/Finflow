from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
import pandas as pd
from ..database import get_db
from .. import models, auth

router = APIRouter()

@router.post("/upload-statement")
async def upload_statement(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user=Depends(auth.get_current_user)
):
    try:
        # Read CSV or Excel
        if file.filename.endswith(".csv"):
            df = pd.read_csv(file.file)
        elif file.filename.endswith(".xlsx"):
            df = pd.read_excel(file.file)
        else:
            raise HTTPException(status_code=400, detail="Unsupported file type")

        # Normalize and save transactions
        for _, row in df.iterrows():
            tx = models.Transaction(
                user_id=user.id,
                date=str(row.get("date")),
                description=row.get("description"),
                category=row.get("category", "Uncategorized"),
                amount=float(row.get("amount", 0)),
                type=row.get("type", "expense")  # income/expense
            )
            db.add(tx)
        db.commit()

        return {"status": "success", "count": len(df)}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
