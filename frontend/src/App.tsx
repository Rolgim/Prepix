// frontend/src/App.tsx
import { useEffect, useState } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { motion } from "framer-motion";

interface Image {
  filename: string;
  source: string;
  copyright: string;
}

interface User {
  username: string;
  email?: string;
  firstname?: string;
  lastname?: string;
  displayname: string;
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [source, setSource] = useState("");
  const [copyright, setCopyright] = useState("");
  const [images, setImages] = useState<Image[]>([]);

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/auth/me");
      
      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
        fetchImages();
      } else {
        // Not authenticated, redirect to CAS login
        window.location.href = "/api/auth/login";
      }
    } catch (err) {
      console.error("Auth check failed", err);
      window.location.href = "/api/auth/login";
    } finally {
      setLoading(false);
    }
  };

  const fetchImages = async () => {
    try {
      const res = await fetch("/api/images");
      const data = await res.json();
      setImages(data);
    } catch (err) {
      console.error("Failed to fetch images", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("source", source);
    formData.append("copyright", copyright);

    try {
      await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      setFile(null);
      setSource("");
      setCopyright("");
      fetchImages();
    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });
      
      if (res.ok) {
        const data = await res.json();
        // Redirect to CAS logout
        window.location.href = data.logout_url;
      }
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Redirecting to login...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header with user info */}
        <div className="flex justify-between items-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold"
          >
            Euclid Pretty Pics Portal
          </motion.h1>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-gray-600">Welcome,</div>
              <div className="font-semibold">{user.displayname}</div>
            </div>
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="bg-red-50 hover:bg-red-100"
            >
              Logout
            </Button>
          </div>
        </div>

        {/* Upload form */}
        <Card className="shadow-lg rounded-2xl">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="file"
                accept="image/*,video/*"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />

              <Input
                placeholder="Source"
                value={source}
                onChange={(e) => setSource(e.target.value)}
              />

              <Input
                placeholder="Copyright"
                value={copyright}
                onChange={(e) => setCopyright(e.target.value)}
              />

              <Button type="submit" className="w-full">
                Upload
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Media grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card className="overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition">
                {image.filename.match(/\.(mp4|webm|ogg|mov)$/i) ? (
                  <video 
                    src={`/uploads/${image.filename}`} 
                    controls 
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <img
                    src={`/uploads/${image.filename}`}
                    alt={image.filename}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <p className="text-sm text-gray-600">
                    Source: {image.source}
                  </p>
                  <p className="text-sm text-gray-600">
                    Copyright: {image.copyright}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
