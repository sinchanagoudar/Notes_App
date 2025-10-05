from fastapi import APIRouter, HTTPException, status
from passlib.context import CryptContext
from app.schemas.user import UserCreate, UserLogin, Token, UserResponse
from app.models.user import User
from app.database import users_collection
from app.utils.jwt_handler import create_access_token
from pymongo.errors import PyMongoError

router = APIRouter(prefix="/auth", tags=["Authentication"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def signup(user_data: UserCreate):
    # Check if user already exists
    try:
        existing_user = users_collection.find_one({"user_email": user_data.user_email})
    except PyMongoError:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Database unavailable")

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Hash password
    hashed_password = pwd_context.hash(user_data.password)
    
    # Create user
    user = User(
        user_name=user_data.user_name,
        user_email=user_data.user_email,
        password=hashed_password
    )
    
    # Insert to database
    try:
        users_collection.insert_one(user.dict())
    except PyMongoError:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Database unavailable")
    
    return UserResponse(
        user_id=user.user_id,
        user_name=user.user_name,
        user_email=user.user_email,
        created_on=user.created_on
    )

@router.post("/signin", response_model=Token)
async def signin(user_data: UserLogin):
    # Find user
    try:
        user = users_collection.find_one({"user_email": user_data.user_email})
    except PyMongoError:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Database unavailable")

    if not user or not pwd_context.verify(user_data.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Create access token
    access_token = create_access_token(data={"sub": user["user_email"]})
    
    return Token(access_token=access_token, token_type="bearer")