import { handleAddComment, handleDeleteComment } from "../../../controllers/picturesController";

export async function POST(req) {
  return handleAddComment(req);
}

export async function DELETE(req) {
  return handleDeleteComment(req);
}
