import os
from fastapi import Request
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware


class AuthMiddleware(BaseHTTPMiddleware):
    """Middleware to protect API routes with authentication"""
    
    # Routes that don't require authentication
    EXEMPT_PATHS = [
        "/auth/login",
        "/auth/callback",
        "/auth/me",
        "/auth/logout"
    ]
    
    async def dispatch(self, request: Request, call_next):
        # Check if path is exempt from authentication
        if any(request.url.path.startswith(path) for path in self.EXEMPT_PATHS):
            return await call_next(request)
        
        # For non-API routes, let them through (nginx handles static files)
        if not request.url.path.startswith("/api/"):
            return await call_next(request)
        
        # Check for session cookie
        cookie_name = os.getenv("SESSION_COOKIE_NAME", "euclid_session")
        session_id = request.cookies.get(cookie_name)
        
        if not session_id:
            return JSONResponse(
                status_code=401,
                content={"detail": "Authentication required"}
            )
        
        # Validate session
        from ..services.session import session_manager
        user = session_manager.get_session(session_id)
        
        if not user:
            return JSONResponse(
                status_code=401,
                content={"detail": "Session expired"}
            )
        
        # Add user to request state
        request.state.user = user
        
        response = await call_next(request)
        return response
