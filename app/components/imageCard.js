import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faTrash } from '@fortawesome/free-solid-svg-icons';

export default function ImageCard({ image }) {
  const uniqueId = image.id;

  const [likes, setLikes] = useState(image.likes || 0);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState(image.comments || []);
  const [newComment, setNewComment] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedLiked = localStorage.getItem(`liked-${uniqueId}`);
    if (storedLiked) {
      setLiked(JSON.parse(storedLiked));
    }
  }, [uniqueId]);

  const handleLike = async () => {
    const updatedLikes = liked ? likes - 1 : likes + 1;
    setLikes(updatedLikes);
    setLiked(!liked);
    localStorage.setItem(`liked-${uniqueId}`, JSON.stringify(!liked));

    try {
      const response = await fetch("/api/pictures/likes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: uniqueId, likes: updatedLikes }),
      });

      if (!response.ok) {
        throw new Error("Failed to update likes");
      }
    } catch (error) {
      console.error("Error updating likes:", error);
    }
  };

  const handleAddComment = async () => {
    if (newComment.trim() && username.trim()) {
      const comment = {
        id: Date.now().toString(),
        text: newComment,
        username,
        timestamp: new Date().toISOString(),
      };
      const updatedComments = [...comments, comment];
      setComments(updatedComments);
      setNewComment("");
      setUsername("");

      try {
        const response = await fetch("/api/pictures/comments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: uniqueId, comment }),
        });

        if (!response.ok) {
          throw new Error("Failed to add comment");
        }
      } catch (error) {
        console.error("Error adding comment:", error);
      }
    }
  };

  const handleDeleteComment = async (cId) => {
    try {
      const response = await fetch("/api/pictures/comments", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ docId: uniqueId, commentId: cId }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete comment");
      }

      setComments(comments.filter((comment) => comment.id !== cId));
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <div className="relative w-full mb-4 overflow-hidden rounded-lg">
        {image.selectedFileUrl ? (
          <img
            src={image.selectedFileUrl}
            alt={image.photoName}
            className="w-full h-auto object-cover"
          />
        ) : (
          <div className="w-full h-auto bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">No image available</span>
          </div>
        )}
        <a
          href={image.selectedFileUrl}
          target="_blank"
          download
          className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-lg download-button"
        >
          <FontAwesomeIcon icon={faDownload} />
        </a>
      </div>
      <h2 className="text-2xl font-bold mb-2">{image.photoName}</h2>
      <p className="text-gray-700 mb-2">{image.description}</p>
      <p className="text-gray-500 text-sm mb-2">
        {image.username ? `Photographed by @${image.username} on ` : ""}
        {format(new Date(image.photoDate), "PPP")}
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {image.tags &&
          image.tags.map((tag) => (
            <span
              key={tag.id}
              className="text-xs bg-gray-200 rounded-full px-2 py-1"
            >
              {tag.text}
            </span>
          ))}
      </div>
      <p className="mt-2 text-sm font-semibold">{image.photoType}</p>
      <div className="mt-4 flex items-center space-x-4">
        <button
          onClick={handleLike}
          className={`px-4 py-2 rounded-lg transition ${
            liked ? "bg-gray-500 text-white" : "bg-gray-200 text-black"
          }`}
        >
          {liked ? "Unlike" : "Like"}
        </button>
        <span className="text-lg">
          {likes} {likes === 1 ? "like" : "likes"}
        </span>
      </div>
      <div className="mt-6 border-t pt-4">
        <h3 className="text-lg font-bold mb-2">Comments</h3>
        <div className="space-y-2 mb-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="border rounded-lg p-2 bg-gray-50 flex justify-between items-start"
            >
              <div>
                <p className="text-sm">
                  <strong>{comment.username}:</strong> {comment.text}
                </p>
                <p className="text-xs text-gray-500">
                  {format(new Date(comment.timestamp), "PPP p")}
                </p>
              </div>
              <button
                onClick={() => handleDeleteComment(comment.id)}
                className="text-red-500 hover:text-red-700"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          />
          <textarea
            placeholder="Add a comment"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          />
          <button
            onClick={handleAddComment}
            className="px-3 py-2 bg-blue-500 text-white rounded-lg"
          >
            Add Comment
          </button>
        </div>
      </div>
    </div>
  );
}
