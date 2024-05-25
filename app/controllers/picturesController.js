import { NextResponse } from "next/server";
import {
  getAllPictures,
  addPicture,
  updateLikes,
  addComment,
} from "../models/pictureModel";

export async function handleGetPictures(req) {
  try {
    const pictures = await getAllPictures();
    return NextResponse.json(pictures, { status: 200 });
  } catch (error) {
    console.error("Error fetching images: ", error);
    return NextResponse.json(
      { error: "Error fetching images" },
      { status: 500 }
    );
  }
}

export async function handleAddPicture(req) {
  try {
    const data = await req.json();
    if (!data.selectedFileUrl || !data.photoName || !data.photoType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    const id = await addPicture(data);
    return NextResponse.json(
      { success: "Document successfully written!", id },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error writing document:", error);
    return NextResponse.json(
      { error: "Error writing document" },
      { status: 400 }
    );
  }
}

export async function handleUpdateLikes(req) {
  try {
    const { id, likes } = await req.json();
    await updateLikes(id, likes);
    return NextResponse.json(
      { success: "Likes updated successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating likes:", error);
    return NextResponse.json(
      { error: "Error updating likes" },
      { status: 500 }
    );
  }
}

export async function handleAddComment(req) {
  try {
    const { id, comment } = await req.json();
    await addComment(id, comment);
    return NextResponse.json(
      { success: "Comment added successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding comment:", error);
    return NextResponse.json(
      { error: "Error adding comment" },
      { status: 500 }
    );
  }
}
