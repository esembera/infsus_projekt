"use client";
// pages/index.js
import { useState, useEffect } from "react";
import ImageFeed from "./components/imageFeed";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Home() {
  const [images, setImages] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPhotoType, setSelectedPhotoType] = useState("all");

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
          selectedFile: "https://lorempicsum.com/futurama/300/300", // Lorem Picsum
        },
      ];
      setImages(fetchedImages);
    };

    fetchImages();
  }, []);

  // Filter images based on search query and selected photo type
  const filteredImages = images.filter(
    (image) =>
      image.photoName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedPhotoType === "all" || image.photoType === selectedPhotoType)
  );

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="container max-w-screen-md mx-auto px-4 py-8">
        <div className="flex space-x-4 mb-4">
          <Input
            type="text"
            placeholder="Search images..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Select
            onValueChange={setSelectedPhotoType}
            value={selectedPhotoType}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="portrait">Portrait</SelectItem>
              <SelectItem value="landscape">Landscape</SelectItem>
              <SelectItem value="macro">Macro</SelectItem>
              <SelectItem value="street">Street</SelectItem>
              <SelectItem value="screenshot">Screenshot</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <ImageFeed images={filteredImages} />
      </div>
    </main>
  );
}
