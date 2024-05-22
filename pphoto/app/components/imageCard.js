import { format } from "date-fns";

export default function ImageCard({ image }) {
  return (
    <div className="border rounded-lg p-4">
      <div className="w-full mb-4 overflow-hidden rounded-lg">
        <img
          src={image.selectedFile}
          alt={image.photoName}
          className="w-full h-auto"
        />
      </div>
      <h2 className="text-xl font-bold">{image.photoName}</h2>
      <p className="text-gray-700">{image.description}</p>
      <p className="text-gray-500 text-sm">
        {format(new Date(image.photoDate), "PPP")}
      </p>
      <div className="mt-2">
        {image.tags.map((tag) => (
          <span
            key={tag.id}
            className="text-xs bg-gray-200 rounded-full px-2 py-1 mr-2"
          >
            {tag.text}
          </span>
        ))}
      </div>
      <p className="mt-2 text-sm font-semibold">{image.photoType}</p>
    </div>
  );
}
