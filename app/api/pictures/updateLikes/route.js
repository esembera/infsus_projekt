import { NextResponse } from "next/server";
import { db } from "@/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";

export async function POST(req) {
  try {
    const { id, likes } = await req.json();
    const docRef = doc(db, "pictures", id);
    await updateDoc(docRef, { likes });
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
