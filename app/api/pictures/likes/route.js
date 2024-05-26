import { handleUpdateLikes } from "../../../controllers/picturesController";

export async function PATCH(req) {
  return handleUpdateLikes(req);
}
