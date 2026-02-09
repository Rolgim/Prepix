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

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [source, setSource] = useState("");
  const [copyright, setCopyright] = useState("");
  const [images, setImages] = useState<Image[]>([]);

  const fetchImages = async () => {
    try {
      const res = await fetch("/api/images");
      const data = await res.json();
      setImages(data);
    } catch (err) {
      console.error("Failed to fetch images", err);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

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

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-center"
        >
          Euclid Pretty Pics Portal
        </motion.h1>

        <Card className="shadow-lg rounded-2xl">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="file"
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