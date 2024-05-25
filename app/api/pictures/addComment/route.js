import { handleAddComment } from "../../../controllers/picturesController";

export async function POST(req) {
  return handleAddComment(req);
}
