import {
  handleGetPictures,
  handleAddPicture,
} from "../../controllers/picturesController";

export async function GET(req) {
  return handleGetPictures(req);
}

export async function POST(req) {
  return handleAddPicture(req);
}
