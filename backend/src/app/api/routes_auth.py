from fastapi import APIRouter, Request, Response
from fastapi.responses import RedirectResponse, JSONResponse
import os


router = APIRouter()


# Import services (will be added to backend)
from ..services.cas_client import cas_client
from ..services.session import session_manager
from ..services.user_storage import user_storage


@router.get("/auth/login")
async def login():
    """Redirect to CAS login page"""
    cas_login_url = cas_client.get_login_url()
    return RedirectResponse(url=cas_login_url)


@router.get("/auth/callback")
async def auth_callback(request: Request, response: Response, ticket: str = None):
    """Handle CAS callback after authentication"""
    
    if not ticket:
        # No ticket provided, redirect to login
        return RedirectResponse(url="/auth/login")
    
    # Validate the ticket with CAS server
    user_info = await cas_client.validate_ticket(ticket)
    
    if not user_info:
        # Invalid ticket, redirect to login
        return RedirectResponse(url="/auth/login")
    
    username = user_info["username"]
    attributes = user_info.get("attributes", {})
    
    # Prepare user data
    user_data = {
        "username": username,
        "email": attributes.get("email"),
        "firstname": attributes.get("firstname"),
        "lastname": attributes.get("lastname"),
        "displayname": attributes.get("displayname") or username
    }
    
    # Save user to storage
    user_storage.save_user(username, user_data)
    
    # Create session
    session_id = session_manager.create_session(user_data)
    
    # Set session cookie
    cookie_name = os.getenv("SESSION_COOKIE_NAME", "euclid_session")
    max_age = int(os.getenv("SESSION_MAX_AGE", "86400"))
    
    response = RedirectResponse(url="/")
    response.set_cookie(
        key=cookie_name,
        value=session_id,
        max_age=max_age,
        httponly=True,
        samesite="lax",
        secure=False  # Set to True in production with HTTPS
    )
    
    return response


@router.get("/auth/me")
async def get_current_user(request: Request):
    """Get current authenticated user"""
    cookie_name = os.getenv("SESSION_COOKIE_NAME", "euclid_session")
    session_id = request.cookies.get(cookie_name)
    
    if not session_id:
        return JSONResponse(
            status_code=401,
            content={"detail": "Not authenticated"}
        )
    
    user = session_manager.get_session(session_id)
    
    if not user:
        return JSONResponse(
            status_code=401,
            content={"detail": "Session expired"}
        )
    
    return user


@router.post("/auth/logout")
async def logout(request: Request, response: Response):
    """Logout user and redirect to CAS logout"""
    cookie_name = os.getenv("SESSION_COOKIE_NAME", "euclid_session")
    session_id = request.cookies.get(cookie_name)
    
    if session_id:
        session_manager.delete_session(session_id)
    
    # Get CAS logout URL
    cas_logout_url = cas_client.get_logout_url()
    
    response = JSONResponse(content={"logout_url": cas_logout_url})
    response.delete_cookie(cookie_name)
    
    return response
