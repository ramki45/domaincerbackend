const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const projectSchema = new mongoose.Schema({
    // id: { type: String, required: true },
	name: { type: String, required: true },
	details: { type: String, required: true },
	code: { type: String, required: true },
	postedBy: { type: String, required: true },
	appliedBy: { type: String, required: false },
});

projectSchema.methods.generateAuthToken = function () {
	const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
		expiresIn: "7d",
	});
	return token;
};

const Project = mongoose.model("project", projectSchema);

const validate = (data) => {
	const schema = Joi.object({
        // id: Joi.string().required().label("Id"),
		name: Joi.string().required().label("Name"),
		details: Joi.string().required().label("Details"),
		code: Joi.string().required().label("Code"),
		postedBy: Joi.string().required().label("PostedBy"),
		appliedBy: Joi.string().label("AppliedBy"),
	});
	return schema.validate(data);
};

module.exports = { Project, validate };