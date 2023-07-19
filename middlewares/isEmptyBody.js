import { HttpError } from "../helpers/index.js";

const isEmptyBody = (req, res, next) => {
  const isEmptyBody = Object.keys(req.body).length === 0;

  if (isEmptyBody) next(HttpError(400, "missing fields"));

  next();
};

export default isEmptyBody;
