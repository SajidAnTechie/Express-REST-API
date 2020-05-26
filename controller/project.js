const { Project } = require("../model/project");
const { User } = require("../model/users");
const createError = require("../utilis/createError");

const getAllProjects = async (req, res, next) => {
  try {
    const Allprojects = await Project.find().populate("userId", {
      username: 1,
      email: 1,
    });

    res.status(200).send({ status: "success", payload: Allprojects });
  } catch (error) {
    next(error);
  }
};

const getProjectById = async (req, res, next) => {
  try {
    const getProjectById = await Project.findById(req.params.id);

    res.status(200).send({ status: "success", payload: getProjectById });
  } catch (error) {
    next(error);
  }
};

const createProject = async (req, res, next) => {
  try {
    const user = await User.findById(req.token.id);

    if (!user) throw createError(404, "Token is missing");

    const newProject = await Project.create({ ...req.body, userId: user.id });

    user.projects = user.projects.concat(newProject._id);

    await user.save();

    res.status(201).send({ status: "success", payload: newProject });
  } catch (error) {
    next(error);
  }
};

const deleteProject = async (req, res, next) => {
  try {
    const ProjectOwner = await Project.findByIdAndDelete(req.params.id);

    const user = await User.findById(ProjectOwner.userId);

    const filterUserProject = await user.projects.filter((projectId, index) => {
      return !req.params.id.includes(projectId);
    });

    user.projects = filterUserProject;

    await user.save();

    res.status(204).send({ status: "success", payload: {} });
  } catch (error) {
    next(error);
  }
};

const updateProject = async (req, res, next) => {
  try {
    const editProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body
    );

    res.status(204).send({ status: "success", payload: editProject });
  } catch (error) {
    next(error);
  }
};

const approveProject = async (req, res, next) => {
  try {
    if (!req.token.isAdmin)
      throw createError(401, "Unauthorize Access or Project not found");

    const approveProjectById = await Project.findByIdAndUpdate(req.params.id, {
      verified: true,
    });

    if (!approveProject) throw createError(404, "No such project found");

    const approveProject = await Project.findById(req.params.id);

    res.status(200).send({ status: "success", payload: approveProjects });
  } catch (error) {
    next(error);
  }
};

const rejectProject = async (req, res, next) => {
  try {
    if (!req.token.isAdmin)
      throw createError(401, "Unauthorize Access or Project not found");

    const rejectProjectById = await Project.findByIdAndUpdate(req.params.id, {
      verified: false,
    });

    const rejectProject = await Project.findById(req.params.id);

    res.status(200).send({ status: "success", payload: rejectProject });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  createProject,
  deleteProject,
  getAllProjects,
  getProjectById,
  approveProject,
  rejectProject,
  updateProject,
};
