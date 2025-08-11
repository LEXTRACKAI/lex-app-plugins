from fastapi import FastAPI
from models import ClauseRequest, ClauseResponse
from explainer import explain_clause

app = FastAPI()


@app.post("/explain", response_model=ClauseResponse)
def explain(request: ClauseRequest):
    explanation = explain_clause(request.clause)
    return ClauseResponse(explanation=explanation)
