import ImageCard from "./imageCard";

export default function ImageFeed({ images }) {
  return (
    <div className="space-y-4">
      {images.map((image) => (
        <ImageCard key={image.id} image={image} />
      ))}
    </div>
  );
}
