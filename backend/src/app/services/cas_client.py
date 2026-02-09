import os
import urllib.parse
import httpx
from typing import Optional, Dict


class CASClient:
    def __init__(self):
        self.cas_server_url = os.getenv("CAS_SERVER_URL", "https://cas.cosmos.esa.int/cas")
        self.service_url = os.getenv("CAS_SERVICE_URL")
        
    def get_login_url(self) -> str:
        """Generate the CAS login URL"""
        params = {"service": self.service_url}
        return f"{self.cas_server_url}/login?{urllib.parse.urlencode(params)}"
    
    def get_logout_url(self) -> str:
        """Generate the CAS logout URL"""
        params = {"service": os.getenv("APP_URL", "http://localhost")}
        return f"{self.cas_server_url}/logout?{urllib.parse.urlencode(params)}"
    
    async def validate_ticket(self, ticket: str) -> Optional[Dict]:
        """
        Validate a CAS ticket and return user information
        
        Returns:
            Dict with user info if valid, None otherwise
            Example: {"username": "john.doe", "attributes": {...}}
        """
        validate_url = f"{self.cas_server_url}/serviceValidate"
        params = {
            "service": self.service_url,
            "ticket": ticket
        }
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(validate_url, params=params)
                
            if response.status_code != 200:
                return None
            
            # Parse XML response
            xml_content = response.text
            
            # Check if authentication succeeded
            if "<cas:authenticationSuccess>" not in xml_content:
                return None
            
            # Extract username
            username = self._extract_xml_value(xml_content, "cas:user")
            
            if not username:
                return None
            
            # Extract attributes (name, email, etc.)
            attributes = {}
            
            # Common CAS attributes
            attributes["email"] = self._extract_xml_value(xml_content, "cas:mail") or \
                                 self._extract_xml_value(xml_content, "cas:email")
            attributes["firstname"] = self._extract_xml_value(xml_content, "cas:givenName") or \
                                     self._extract_xml_value(xml_content, "cas:firstName")
            attributes["lastname"] = self._extract_xml_value(xml_content, "cas:sn") or \
                                    self._extract_xml_value(xml_content, "cas:lastName")
            attributes["displayname"] = self._extract_xml_value(xml_content, "cas:displayName") or \
                                       self._extract_xml_value(xml_content, "cas:cn")
            
            return {
                "username": username,
                "attributes": {k: v for k, v in attributes.items() if v}
            }
            
        except Exception as e:
            print(f"Error validating CAS ticket: {e}")
            return None
    
    def _extract_xml_value(self, xml: str, tag: str) -> Optional[str]:
        """Extract value from XML tag"""
        start_tag = f"<{tag}>"
        end_tag = f"</{tag}>"
        
        start_idx = xml.find(start_tag)
        if start_idx == -1:
            return None
        
        start_idx += len(start_tag)
        end_idx = xml.find(end_tag, start_idx)
        
        if end_idx == -1:
            return None
        
        return xml[start_idx:end_idx].strip()


# Singleton instance
cas_client = CASClient()
