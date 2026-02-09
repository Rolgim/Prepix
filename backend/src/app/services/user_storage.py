import os
import json
from pathlib import Path
from typing import Dict, Optional
from datetime import datetime


class UserStorage:
    def __init__(self):
        storage_path = os.getenv("USER_STORAGE_PATH", "/app/data/users.json")
        self.storage_file = Path(storage_path)
        self.storage_file.parent.mkdir(parents=True, exist_ok=True)
        
        # Initialize file if it doesn't exist
        if not self.storage_file.exists():
            self._save_data({})
    
    def _load_data(self) -> Dict:
        """Load users from JSON file"""
        try:
            with open(self.storage_file, 'r') as f:
                return json.load(f)
        except Exception as e:
            print(f"Error loading user data: {e}")
            return {}
    
    def _save_data(self, data: Dict):
        """Save users to JSON file"""
        try:
            with open(self.storage_file, 'w') as f:
                json.dump(data, f, indent=2)
        except Exception as e:
            print(f"Error saving user data: {e}")
    
    def save_user(self, username: str, user_data: Dict):
        """Save or update user information"""
        users = self._load_data()
        
        # Add timestamp
        user_data["last_login"] = datetime.utcnow().isoformat()
        
        # Create or update user
        if username not in users:
            user_data["created_at"] = datetime.utcnow().isoformat()
        
        users[username] = user_data
        self._save_data(users)
    
    def get_user(self, username: str) -> Optional[Dict]:
        """Get user information"""
        users = self._load_data()
        return users.get(username)
    
    def get_all_users(self) -> Dict:
        """Get all users"""
        return self._load_data()


# Singleton instance
user_storage = UserStorage()
