import { NextResponse } from 'next/server';
import { db } from '@/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

export async function POST(req) {
  try {
    const data = await req.json();

    if (!data.selectedFileUrl || !data.photoName || !data.photoType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const docRef = await addDoc(collection(db, 'pictures'), data);
    return NextResponse.json(
      { success: 'Document successfully written!', id: docRef.id },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error writing document:', error);
    let errorMessage = 'Error writing document';
    if (error.code === 'failed-precondition') {
      errorMessage = 'Firestore API is not available in Datastore mode';
    }

    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}
