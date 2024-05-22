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
import { db } from "@/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

export default function Home() {
  const [images, setImages] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPhotoType, setSelectedPhotoType] = useState("all");

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "pictures"));
        const fetchedImages = querySnapshot.docs.map((doc) => {
          return { id: doc.id, ...doc.data() };
        });
        setImages(fetchedImages);
      } catch (error) {
        console.error("Error fetching images: ", error);
      }
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
