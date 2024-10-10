from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel
import os
import logging

app = FastAPI()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = os.getenv("SECRET_KEY", "your_secret_key")
ALGORITHM = "HS256"

# Configure centralized logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s %(levelname)s %(name)s %(threadName)s : %(message)s',
    handlers=[
        logging.FileHandler("backend.log"),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

# Replace print statements with logger
# Example:
# print("Connected to MongoDB")
logger.info("Connected to MongoDB")

# Dummy user data for demonstration
fake_users_db = {
    "admin": {
        "username": "admin",
        "hashed_password": pwd_context.hash("adminpassword"),
        "role": "admin"
    }
}

class Token(BaseModel):
    access_token: str
    token_type: str

def authenticate_user(username: str, password: str):
    user = fake_users_db.get(username)
    if not user:
        return False
    if not pwd_context.verify(password, user["hashed_password"]):
        return False
    return user

@app.post("/token", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    access_token = jwt.encode({"sub": user["username"], "role": user["role"]}, SECRET_KEY, algorithm=ALGORITHM)
    return {"access_token": access_token, "token_type": "bearer"}