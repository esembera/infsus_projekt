"use client";
import { useState, useEffect } from "react";
import ImageFeed from "./components/imageFeed";
import { Input } from "@/components/ui/input";

export default function Home() {
  const [images, setImages] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Mocked data fetching
  useEffect(() => {
    const fetchImages = async () => {
      // Simulating a fetch from Firebase
      const fetchedImages = [
        {
          id: 1,
          photoName: "Sunset",
          description: "Beautiful sunset over the mountains",
          photoDate: new Date(),
          tags: [
            { id: "1", text: "sunset" },
            { id: "2", text: "nature" },
          ],
          photoType: "landscape",
          selectedFile: "https://source.unsplash.com/random/300x300", // Unsplash
        },
        {
          id: 2,
          photoName: "City Life",
          description: "Street view of the city",
          photoDate: new Date(),
          tags: [
            { id: "1", text: "city" },
            { id: "2", text: "street" },
          ],
          photoType: "street",
          selectedFile: "https://picsum.photos/300", // Picsum.photos
        },
        {
          id: 3,
          photoName: "Mountain",
          description: "Snowy mountain range",
          photoDate: new Date(),
          tags: [
            { id: "1", text: "mountain" },
            { id: "2", text: "snow" },
          ],
          photoType: "landscape",
          selectedFile: "https://via.placeholder.com/300", // Placeholder.com
        },
        {
          id: 4,
          photoName: "Macro Flower",
          description: "Close-up of a beautiful flower",
          photoDate: new Date(),
          tags: [
            { id: "1", text: "flower" },
            { id: "2", text: "macro" },
          ],
          photoType: "macro",
          selectedFile: "https://via.placeholder.com/300", // Lorem Picsum
        },
      ];
      setImages(fetchedImages);
    };

    fetchImages();
  }, []);

  // Filter images based on search query
  const filteredImages = images.filter((image) =>
    image.photoName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="container mx-auto px-4 py-8">
        <Input
          type="text"
          placeholder="Search images..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mb-4"
        />
        <ImageFeed images={filteredImages} />
      </div>
    </main>
  );
}
