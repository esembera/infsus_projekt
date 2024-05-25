import { handleUpdateLikes } from "../../../controllers/picturesController";

export async function POST(req) {
  return handleUpdateLikes(req);
}
