const router = require("express").Router();
const { Project, validate } = require("../models/project");

router.post("/", async (req, res) => {
	try {
		const { error } = validate(req.body);
		if (error)
			return res.status(400).send({ message: error.details[0].message });

		const project = await Project.findOne({ name: req.body.name });
		if (project)
			return res
				.status(409)
				.send({ message: "Project with given name already Exist!" });

		 const salt = await bcrypt.genSalt(Number(process.env.SALT));
		 const hashPassword = await bcrypt.hash(req.body.password, salt);

		await new Project({ ...req.body}).save();
		res.status(201).send({ message: "Project created successfully" });
	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}
});

router.get("/", async (req,res) => {
    

    try{
        Project.find({}, function(err, projects) {
            var projectMap = {};
        
            projects.forEach(function(project) {
              projectMap[project._id] = project;
            });
        
            res.send(projectMap);  
          });
    } catch (error) {

    }
});


router.get("/:name", async (req,res) => {
    try{
        Project.find({ name: req.params.name}, function (err, project) {
            res.send(project);
        });
    } catch (error) {

    }
});

router.put("/apply/:name/:user", async (req,res) => {
    try{

        await Project.updateOne({
            name: req.params.name
        }, { appliedBy: req.params.user }, { upsert: true });

        res.status(201).send({ message: "Project updated successfully" });
       
    } catch (error) {

    }
});



module.exports = router;