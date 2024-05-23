import { NextResponse } from "next/server";
import { db } from "@/firebaseConfig";
import { doc, updateDoc, getDoc } from "firebase/firestore";

export async function POST(req) {
  try {
    const { id, comment } = await req.json();
    const docRef = doc(db, "pictures", id);
    const pictureDoc = await getDoc(docRef);
    const pictureData = pictureDoc.data();
    const updatedComments = [...pictureData.comments, comment];

    await updateDoc(docRef, { comments: updatedComments });
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
