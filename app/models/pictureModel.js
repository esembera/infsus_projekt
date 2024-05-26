import { db } from "@/firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  getDoc,
} from "firebase/firestore";

const picturesCollection = collection(db, "pictures");

export async function getAllPictures() {
  const querySnapshot = await getDocs(picturesCollection);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function addPicture(data) {
  const docRef = await addDoc(picturesCollection, data);
  return docRef.id;
}

export async function updateLikes(id, likes) {
  const docRef = doc(db, "pictures", id);
  await updateDoc(docRef, { likes });
}

export async function addComment(id, comment) {
  const docRef = doc(db, "pictures", id);
  const pictureDoc = await getDoc(docRef);
  const pictureData = pictureDoc.data();
  const updatedComments = [...pictureData.comments, comment];
  await updateDoc(docRef, { comments: updatedComments });
}

export async function deleteComment(id, commentId) {
  const docRef = doc(db, "pictures", id);
  const document = await getDoc(docRef);
  const data = document.data();
  const arrayField = data.comments;
  const updatedArray = arrayField.filter(item => item.id !== commentId);
  await updateDoc(docRef, {
    comments: updatedArray
  });
}
