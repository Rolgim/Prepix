import os
import json
import secrets
import hashlib
from datetime import datetime, timedelta
from typing import Optional, Dict
from pathlib import Path


class SessionManager:
    def __init__(self):
        self.sessions: Dict[str, Dict] = {}
        self.secret_key = os.getenv("SESSION_SECRET_KEY", "change-me-in-production")
        self.cookie_name = os.getenv("SESSION_COOKIE_NAME", "euclid_session")
        self.max_age = int(os.getenv("SESSION_MAX_AGE", "86400"))  # 24 hours
        
    def create_session(self, user_data: Dict) -> str:
        """Create a new session and return session ID"""
        session_id = secrets.token_urlsafe(32)
        
        self.sessions[session_id] = {
            "user": user_data,
            "created_at": datetime.utcnow().isoformat(),
            "expires_at": (datetime.utcnow() + timedelta(seconds=self.max_age)).isoformat()
        }
        
        return session_id
    
    def get_session(self, session_id: str) -> Optional[Dict]:
        """Get session data if valid"""
        if not session_id or session_id not in self.sessions:
            return None
        
        session = self.sessions[session_id]
        
        # Check if expired
        expires_at = datetime.fromisoformat(session["expires_at"])
        if datetime.utcnow() > expires_at:
            del self.sessions[session_id]
            return None
        
        return session["user"]
    
    def delete_session(self, session_id: str):
        """Delete a session"""
        if session_id in self.sessions:
            del self.sessions[session_id]


# Singleton instance
session_manager = SessionManager()
