const createError = require("../utilis/createError");
const { validateUser } = require("../model/users");
const { validateProject } = require("../model/project");

const validateUserSchema = (req, res, next) => {
  const { error } = validateUser(req.body);
  if (error) throw createError(400, error.details[0].message);
  next();
};

const validateProjectSchema = (req, res, next) => {
  const { error } = validateProject(req.body);
  if (error) throw createError(400, error.details[0].message);
  next();
};

module.exports = { validateUserSchema, validateProjectSchema };
