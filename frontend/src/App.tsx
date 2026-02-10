import { useEffect, useState } from "react";
import { Card, CardContent } from "./components/Card";
import { Button } from "./components/Button";
import { Input } from "./components/Input";
import { DarkModeToggle } from "./components/DarkModeToggle";
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
    <div className="min-h-screen p-8">  
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <img
            src="/Euclid_consortium_logo.png"
            alt="Euclid Consortium Logo"
            className="h-18 w-auto flex-shrink-0"
          />

          <h1 
            className="text-3xl font-bold text-center flex-1 mx-4 truncate"
            style={{ color: 'var(--text-primary)' }}
          >
            Euclid Pretty Pics Portal
          </h1>

          <div className="flex items-center gap-4">
            <DarkModeToggle />
            <img
              src="/Euclid_logo.png"
              alt="Euclid Logo"
              className="h-20 w-auto flex-shrink-0"
            />
          </div>
        </motion.div>

        {/* Upload form */}
        <Card 
          className="shadow-lg rounded-2xl border"
          style={{ 
            backgroundColor: 'var(--bg-card)', 
            borderColor: 'var(--border-color)' 
          }}
        >
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <label 
                htmlFor="file-input" 
                className="block text-sm font-medium"
                style={{ color: 'var(--text-primary)' }}
              >
                File
              </label>
              <Input
                id="file-input"
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                style={{ 
                  backgroundColor: 'var(--bg-secondary)', 
                  color: 'var(--text-primary)', 
                  borderColor: 'var(--border-color)' 
                }}
              />

              <label 
                htmlFor="source-input" 
                className="block text-sm font-medium"
                style={{ color: 'var(--text-primary)' }}
              >
                Source
              </label>
              <Input
                id="source-input"
                placeholder="Source"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                style={{ 
                  backgroundColor: 'var(--bg-secondary)', 
                  color: 'var(--text-primary)', 
                  borderColor: 'var(--border-color)' 
                }}
              />

              <label 
                htmlFor="copyright-input" 
                className="block text-sm font-medium"
                style={{ color: 'var(--text-primary)' }}
              >
                Copyright
              </label>
              <Input
                id="copyright-input"
                placeholder="Copyright"
                value={copyright}
                onChange={(e) => setCopyright(e.target.value)}
                style={{ 
                  backgroundColor: 'var(--bg-secondary)', 
                  color: 'var(--text-primary)', 
                  borderColor: 'var(--border-color)' 
                }}
              />

              <Button
                type="submit"
                className=" w-full rounded 
                  bg-gradient-to-r from-blue-300 to-indigo-300
                  hover:from-blue-400 hover:to-indigo-400
                  text-white font-semibold py-2.5 shadow-md
                  hover:shadow-lg
                  transition-all duration-200 active:scale-[0.98]">
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
              <Card 
                className="overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition border"
                style={{ 
                  backgroundColor: 'var(--bg-card)', 
                  borderColor: 'var(--border-color)' 
                }}
              >
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
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Source: {image.source}
                  </p>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
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