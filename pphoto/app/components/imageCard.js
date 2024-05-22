import { useState, useEffect } from "react";
import { format } from "date-fns";

export default function ImageCard({ image }) {
  // Generate a unique ID based on the photoName and photoDate
  const uniqueId = `${image.photoName}-${image.photoDate}`;

  const [likes, setLikes] = useState(image.likes || 0);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState(image.comments || []);
  const [newComment, setNewComment] = useState("");
  const [username, setUsername] = useState("");

  // Use effect to initialize liked status from local storage
  useEffect(() => {
    const storedLiked = localStorage.getItem(`liked-${uniqueId}`);
    if (storedLiked) {
      setLiked(JSON.parse(storedLiked));
    }
  }, [uniqueId]);

  // Function to handle like button click
  const handleLike = () => {
    if (liked) {
      setLikes((prevLikes) => prevLikes - 1);
      // Future Firebase logic to decrease like count will be added here
    } else {
      setLikes((prevLikes) => prevLikes + 1);
      // Future Firebase logic to increase like count will be added here
    }
    setLiked(!liked);
    localStorage.setItem(`liked-${uniqueId}`, JSON.stringify(!liked));
  };

  // Function to handle adding a new comment
  const handleAddComment = () => {
    if (newComment.trim() && username.trim()) {
      const comment = {
        text: newComment,
        username,
        date: new Date().toISOString(),
      };
      setComments([...comments, comment]);
      setNewComment("");
      setUsername("");
      // Future Firebase logic to add comment will be added here
    }
  };

  return (
    <div className="border rounded-lg p-4">
      <div className="w-full mb-4 overflow-hidden rounded-lg">
        {image.selectedFileUrl ? (
          <img
            src={image.selectedFileUrl}
            alt={image.photoName}
            className="w-full h-auto"
          />
        ) : (
          <div className="w-full h-auto bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">No image available</span>
          </div>
        )}
      </div>
      <h2 className="text-xl font-bold">{image.photoName}</h2>
      <p className="text-gray-700">{image.description}</p>
      <p className="text-gray-500 text-sm">
        {format(new Date(image.photoDate), "PPP")}
      </p>
      <div className="mt-2">
        {image.tags &&
          image.tags.map((tag) => (
            <span
              key={tag.id}
              className="text-xs bg-gray-200 rounded-full px-2 py-1 mr-2"
            >
              {tag.text}
            </span>
          ))}
      </div>
      <p className="mt-2 text-sm font-semibold">{image.photoType}</p>
      <div className="mt-4 flex items-center">
        <button
          onClick={handleLike}
          className={`px-4 py-2 rounded-lg ${
            liked ? "bg-red-500 text-white" : "bg-gray-200 text-black"
          }`}
        >
          {liked ? "Unlike" : "Like"}
        </button>
        <span className="ml-4 text-lg">
          {likes} {likes === 1 ? "like" : "likes"}
        </span>
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-bold mb-2">Comments</h3>
        <div className="space-y-2 mb-4">
          {comments.map((comment, index) => (
            <div key={index} className="border rounded-lg p-2">
              <p className="text-sm">
                <strong>{comment.username}:</strong> {comment.text}
              </p>
              <p className="text-xs text-gray-500">
                {format(new Date(comment.date), "PPP p")}
              </p>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-2 py-1 border rounded-lg"
          />
          <textarea
            placeholder="Add a comment"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full px-2 py-1 border rounded-lg"
          />
          <button
            onClick={handleAddComment}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Add Comment
          </button>
        </div>
      </div>
    </div>
  );
}
