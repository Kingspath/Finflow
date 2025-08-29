# BookKeeper.AI — AI Coder Instruction File

## Purpose
This file is designed to be consumed by an AI coder (developer assistant) to generate, scaffold, and implement the BookKeeper.AI web application. It contains the project overview, prioritized tasks, tech stack choices (enterprise + lean), OpenAPI stubs, database DDL, Next.js starter structure, Terraform snippet, ML training skeleton, unit test examples, and recommended prompts to guide an AI coder effectively.

---

## 1. Project Overview
**Name:** BookKeeper.AI  
**Primary Goal:** Ingest business bank statements (CSV, OFX, PDF), auto-classify transactions, produce SARS-ready artefacts (VAT201, EMP201 support), and provide a modern analytics dashboard for SA SMEs and accountants.

**MVP Scope**
- Tenant-based auth & RBAC
- Statement upload (CSV, OFX, PDF) + OCR
- Canonical transaction model + rules + ML fallback
- VAT201 builder & evidence pack export
- Transaction review UI, audit trail, basic dashboard

---

## 2. How the AI Coder Should Work
- Follow TDD-first approach: for each backend endpoint or core function, generate unit tests and implementation.
- Keep deterministic logic for financial calculations; LLMs may generate explanation text only.
- Commit frequently with clear messages. Use the branching strategy: `main` protected, `develop`, feature branches `feat/<ticket>`.

### Interaction Prompts (use these to guide the AI coder)
1. "Generate a FastAPI endpoint to accept multipart file uploads (CSV/OFX/PDF) and store in S3. Provide unit tests using pytest and a mock S3 client."
2. "Create a SQL migration for the transactions table (Postgres) with the fields: id, tenant_id, statement_id, value_date, amount, currency, normalized_description, hash, ml_category, ml_confidence, created_at."
3. "Write a worker job using RQ/BullMQ that takes an S3 path, runs Tesseract OCR on PDFs, extracts transaction tables, and writes parsed transactions to the DB. Include unit tests mocking OCR."
4. "Produce a LightGBM training script that reads labeled transactions from Postgres, vectorizes the description using TF-IDF, trains multi-class classifier, serializes the model, and includes an evaluation report."

---

## 3. Tech Stack (Recommended)
### Lean Startup (default)
- Frontend: Next.js (App Router) + TypeScript + Tailwind CSS
- Backend: FastAPI (Python) or NestJS (TypeScript) — **FastAPI preferred for ML integration**
- DB: Supabase (Postgres managed) or Neon
- Storage: Supabase Storage or Cloudflare R2
- Workers: Redis + RQ / Celery on small VM (Hetzner)
- ML: LightGBM + scikit-learn; SHAP for explainability
- OCR: Tesseract + LayoutParser
- Auth: Supabase Auth or Auth0
- CI/CD: GitHub Actions → Vercel (frontend) + Render/Fly (backend)

### Enterprise (scale later)
- Frontend: Next.js + Tailwind
- Backend: FastAPI or Django REST Framework
- DB: Aurora Postgres
- Storage: S3 + KMS
- Workers: Kubernetes (EKS) with Celery/BullMQ
- OCR: AWS Textract or Google Document AI
- ML infra: SageMaker or GCP AI Platform (optional)

---

## 4. Repo Structure (mono-repo recommended)
```
/repo
  /web (Next.js app)
  /api (FastAPI app)
  /ml (training, models, notebooks)
  /infra (terraform / supabase scripts)
  /tests
  /docs
  README.md
```

---

## 5. Minimal OpenAPI (save to `api/openapi.yaml`)
```yaml
openapi: 3.0.3
info:
  title: BookKeeper.AI API
  version: 0.1.0
servers:
  - url: https://api.example.com
components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
paths:
  /v1/auth/register:
    post:
      summary: Register tenant admin
      requestBody:
        required: true
      responses:
        '201':
          description: Created
  /v1/statements/upload:
    post:
      summary: Upload bank statement
      security:
        - bearerAuth: []
      requestBody:
        content:
          multipart/form-data:
            schema:
              type: object
              properties:
                file:
                  type: string
                  format: binary
      responses:
        '202':
          description: Accepted
  /v1/statements/{id}/parse:
    post:
      summary: Trigger parse job
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Parsing started
  /v1/transactions:
    get:
      summary: List transactions
      parameters:
        - name: period
          in: query
          schema:
            type: string
      responses:
        '200':
          description: OK
  /v1/vat/periods/{period}/summary:
    get:
      summary: VAT201 summary
      parameters:
        - name: period
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: VAT summary JSON
```

---

## 6. Database DDL (Postgres)
Save migration file `migrations/0001_create_core_tables.sql`:
```sql
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE tenants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  vat_number text,
  currency text DEFAULT 'ZAR',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  role text NOT NULL,
  password_hash text,
  mfa_enabled boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE statements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id),
  uploaded_by uuid REFERENCES users(id),
  original_filename text,
  raw_path text,
  status text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id),
  statement_id uuid REFERENCES statements(id),
  value_date date,
  posted_date date,
  amount numeric(18,2),
  currency text DEFAULT 'ZAR',
  direction text,
  counterparty_raw text,
  normalized_description text,
  hash text UNIQUE,
  ml_category text,
  ml_confidence numeric(5,4),
  rule_id text,
  status text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_transactions_tenant_date ON transactions (tenant_id, value_date);
```

---

## 7. Next.js Starter Structure (web)
Create `web` folder with the following layout:
```
/web
  /app
    /dashboard
      page.tsx
    /transactions
      page.tsx
      [id].tsx
    /api
      /upload/route.ts
  /components
    Header.tsx
    Sidebar.tsx
    DataTable.tsx
    FileUploader.tsx
  next.config.js
  package.json
  tailwind.config.js
```

### Example: `web/app/api/upload/route.ts`
```ts
import { NextResponse } from "next/server";
import { authMiddleware } from "@/lib/auth";
import { uploadToStorage, enqueueParseJob } from "@/lib/backend";

export async function POST(req: Request) {
  const user = await authMiddleware(req);
  const form = await req.formData();
  const file = form.get("file") as unknown as File;
  if (!file) return NextResponse.json({ error: "file required" }, { status: 400 });
  const path = await uploadToStorage(user.tenant_id, file);
  await enqueueParseJob({ tenant_id: user.tenant_id, path, uploaded_by: user.id });
  return NextResponse.json({ status: "accepted" }, { status: 202 });
}
```

---

## 8. Worker Job Skeleton (Python + RQ)
Save to `api/workers/parse_worker.py`:
```python
import os
from redis import Redis
from rq import Queue, Worker
from db import get_db_session
from ocr import ocr_extract_transactions
from storage import download_file, upload_file
from models import Statement, Transaction

redis_conn = Redis.from_url(os.getenv("REDIS_URL"))
q = Queue("default", connection=redis_conn)

def parse_statement_job(statement_id, s3_path):
    # download file
    local_path = download_file(s3_path)
    # if pdf -> run ocr -> extract table
    rows = ocr_extract_transactions(local_path)
    # write transactions to DB
    session = get_db_session()
    for r in rows:
        tx = Transaction(
            tenant_id = r["tenant_id"],
            statement_id = statement_id,
            value_date = r["date"],
            amount = r["amount"],
            normalized_description = r["desc"],
            hash = r["hash"]
        )
        session.add(tx)
    session.commit()
```

---

## 9. ML Training Script (ml/train.py)
```python
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
import lightgbm as lgb
from sklearn.model_selection import train_test_split
import joblib

def load_data():
    # connect to Postgres and load labeled transactions table
    pass

def train():
    df = load_data()
    tfidf = TfidfVectorizer(max_features=5000, ngram_range=(1,2))
    X_text = tfidf.fit_transform(df["normalized_description"].fillna(""))
    X_num = df[["abs_amount","weekday","day_of_month"]]
    from scipy.sparse import hstack
    X = hstack([X_text, X_num])
    y = df["category"]
    X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.2, stratify=y)
    dtrain = lgb.Dataset(X_train, label=y_train)
    dval = lgb.Dataset(X_val, label=y_val)
    params = {"objective":"multiclass", "num_class": len(y.unique()), "metric": "multi_logloss"}
    bst = lgb.train(params, dtrain, valid_sets=[dval], early_stopping_rounds=50)
    joblib.dump(bst, "models/cat_model.pkl")
    joblib.dump(tfidf, "models/tfidf.pkl")

if __name__ == '__main__':
    train()
```

---

## 10. Unit Test Example (pytest)
`tests/test_parse_csv.py`
```python
from api.parsers.csv_parser import parse_csv
def test_parse_simple_csv(tmp_path):
    csv = tmp_path / "bank.csv"
    csv.write_text("Date,Description,Amount
2025-06-01,ACME INV 001,1234.56
")
    rows = parse_csv(str(csv))
    assert len(rows) == 1
    assert rows[0]["amount"] == 1234.56
```

---

## 11. Terraform Snippet (infra/main.tf)
```hcl
provider "aws" {
  region = "af-south-1"
}

resource "aws_s3_bucket" "statements" {
  bucket = "bookkeeperai-statements-${var.env}"
  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm = "aws:kms"
        kms_master_key_id = aws_kms_key.statements.arn
      }
    }
  }
}
```

---

## 12. Recommended Commit Messages & Branching
- Branch: `feat/<ticket>-short-desc`, `fix/<ticket>`, `chore/<task>`
- Commits: `feat(api): add statements upload endpoint`, `test(api): add upload tests`

---

## 13. AI Coder Prompt Templates (exact prompts)
Use these templates for the AI coder to generate code:

### Prompt A — Endpoint + Tests
```
You are a senior backend developer. Create a FastAPI endpoint POST /v1/statements/upload that:
- accepts multipart/form-data with 'file'
- authenticates user via JWT (header Authorization: Bearer)
- saves file to S3 (mocked in tests)
- writes a 'statements' row to Postgres
Provide unit tests using pytest and a mocked S3 client. Use SQLAlchemy for DB models.
```

### Prompt B — Worker Job
```
Create a Python worker function parse_statement_job(statement_id, s3_path) that:
- downloads file from S3
- if PDF, runs Tesseract OCR to extract table rows
- normalizes rows and writes them to transactions table
- include error handling and idempotency (use transaction hash)
```

---

## 14. Deployment Checklist
- [ ] TLS certs (ACM / Let's Encrypt)
- [ ] KMS keys created
- [ ] DB encrypted and backups configured
- [ ] Sentry / monitoring set up
- [ ] POPIA DPA signed for pilot customers

---

## 15. Deliverables the AI coder should produce (one-by-one)
1. Repo skeleton with web + api + ml + infra directories
2. OpenAPI `openapi.yaml`
3. Postgres migrations
4. FastAPI backend with auth, statements upload, parse enqueue
5. Worker to parse statements (OCR + CSV)
6. Next.js frontend scaffold with upload UI and transactions grid
7. ML train script and model artifact
8. VAT201 generator and evidence pack exporter
9. Tests: unit + integration
10. Dockerfiles and basic Kubernetes manifests (or Render/Vercel configs)

---

## 16. License & Legal Notes
- Use permissive licenses for generated code (MIT).
- Include a `LICENSE.md` and `CONTRIBUTORS.md`.
- Ensure any third-party OCR or ML libraries' licenses are compatible with commercial use.

---

## 17. First Task for AI Coder (highest priority)
Implement the **statements upload endpoint** with:
- FastAPI app
- pytest unit tests (mock S3)
- SQLAlchemy models for tenants, users, statements
- Add GitHub Actions workflow to run tests on push

Use the prompt: *Prompt A — Endpoint + Tests* (from section 13).

---

## 18. File metadata
- Filename: `ai_coder_instructions.md`
- Purpose: Single-file spec + prompts + artifacts for AI code generation
- Location suggestion: root of repo as `/docs/ai_coder_instructions.md`

---

### Notes
This file deliberately balances prescriptive code-level requirements (DDL, OpenAPI, endpoints, tests) with high-level architecture and operational constraints (POPIA, SARS). Use as the canonical guide the AI coder refers to for generating code. Update iteratively as the project progresses.
