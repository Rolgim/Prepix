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
      if (!res.ok) throw new Error("Failed request");

      const data: Image[] = await res.json();
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
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");

      setFile(null);
      setSource("");
      setCopyright("");
      await fetchImages();
    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto space-y-8">
      <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between max-w-5xl mx-auto px-4"
    >
      <img
        src="/Euclid_consortium_logo.png"
        alt="Left Logo"
        className="h-18 w-auto flex-shrink-0"
      />

      <h1 className="text-3xl font-bold text-center flex-1 mx-1 truncate">
        Euclid Pretty Pics Portal
      </h1>

      <img
        src="/Euclid_logo.png"
        alt="Right Logo"
        className="h-20 w-auto flex-shrink-0"
      />
    </motion.div>

        <Card className="shadow-lg rounded-2xl">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* File input */}
              <label htmlFor="file-input">File</label>
              <Input
                id="file-input"
                type="file"
                placeholder="Choose file"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />

              {/* Source input */}
              <label htmlFor="source-input">Source</label>
              <Input
                id="source-input"
                placeholder="Source"
                value={source}
                onChange={(e) => setSource(e.target.value)}
              />

              {/* Copyright input */}
              <label htmlFor="copyright-input">Copyright</label>
              <Input
                id="copyright-input"
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

        {/* Gallery */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <motion.div
              key={image.filename}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card className="overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition">
                {image.filename.match(/\.(mp4|webm|ogg|mov)$/i) ? (
                  <video
                    src={`/uploads/${image.filename}`}
                    controls
                    aria-label={image.filename}
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
                  <p className="text-sm text-gray-600">Source: {image.source}</p>
                  <p className="text-sm text-gray-600">Copyright: {image.copyright}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
