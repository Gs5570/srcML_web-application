const express = require("express");
//import body-parser
const bodyParser = require("body-parser");
const app = express();
const path = require("path");

//import multer for files upload
const multer = require("multer");
//control where the uploaded file will be saved and the name
const fileStorage = multer.diskStorage({
	//desination path of the file upoloaded
	destination: (req, file, cb) => {
		cb(null, "public/");
	},
	//rename uploaded file.
	filename: (req, file, cb) => {
		cb(null, Date.now() + "--" + file.originalname);
	},
});
// Set multer file storage folder
const upload = multer({ storage: fileStorage });

//import morgan logger
const morgan = require("morgan");
const { fstat } = require("fs");
//import fs to read file
const fs = require("fs");

//import spawn
const { spawn } = require("child_process");

// view engine
app.set("view engine", "ejs");

const PORT = process.env.PORT || 8000;

//middleware

app.use(express.static("public")); // return static file
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
// app.use(upload.array());
app.use(morgan("dev"));
// app.use(formidableMiddleware());

//routes
app.get("/", (req, res) => {
	res.render("index");
});
app.post("/form", upload.single("upload"), (req, res) => {

	var srcMLCommand = `srcml`;
 
	console.log(req.body);
	console.log(req.file);

	// const createSrcMlForCodePasted = spawn(srcMLCommand, [req.body.codeinput]);

	if (req.body.codeinput !== "") {
		// code entered by user in the form
		let inputCodeBox = json.toString(req.body.codeinput);

		console.log(inputCodeBox);
		const srcMLForText= spawn(srcMLCommand, [`-t love`]);

		srcMLForText.stdout.on("data", (data) => {
			fileOuput = data;
			console.log(`stdout: ${data}`);

		});
		// res.render("index", { output: info, error: false });

		// createSrcMlForCodePasted.stdout.on("data", (data) => {
		// 	fileOuput = data;
		// 	console.log(`stdout: ${data}`);

		// 	res.render("index", { output: data });
		// });

		// createSrcMlForCodePasted.stderr.on("data", (data) => {
		// 	console.log(`stderr: ${data}`);
		// });

		// createSrcMlForCodePasted.on("close", (code) => {
		// 	console.log(`child_process exist with code ${code}`);
		// });
	}else {
		// console.log(req.files)
		let fileUploadedPath = req.file.path;
		// var fileOuput;

		//set up srcMLCommands for file upload and code pasted
		
		const createSrcMl = spawn(srcMLCommand, [fileUploadedPath]);

		createSrcMl.stdout.on("data", (data) => {
			fileOuput = data;
			console.log(`stdout: ${data}`);

			res.render("index", { output: data });
		});

		createSrcMl.stderr.on("data", (data) => {
			console.log(`stderr: ${data}`);
		});

		createSrcMl.on("close", (code) => {
			console.log(`child_process exist with code ${code}`);
		});
	}
});

app.listen(PORT, () => {
	console.log(`server running on port ${PORT}`);
});
