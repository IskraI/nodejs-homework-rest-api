import { HttpError } from "../helpers/index.js";

const isEmptyBody = (req, res, next) => {
  const isEmptyBody = Object.keys(req.body).length === 0;

  const pathReq = `/${req.params.contactId}/favorite`;
  const isUpdateFavorite = pathReq === req.path;

  if (isEmptyBody && isUpdateFavorite)
    next(HttpError(400, "missing field favorite"));

  if (isEmptyBody) next(HttpError(400, "missing fields"));

  next();
};

export default isEmptyBody;
