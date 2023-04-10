var express = require("express");
var router = express.Router();

const bodyParser = require("body-parser");
//import spawn to launch a new process
const { spawn } = require("child_process");
const { log } = require("console");
//import fs to read and write files
const fs = require("fs");

//import multer for file upload
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

/* GET home page. */
router.get("/", (req, res, next) => {
	// res.render("index");
	// res.json({message: "hello from server"})
});

/** form route */

router.post("/form", upload.single("uploadedFile"), (req, res) => {
	console.log(req.body);
	console.log('file uploaded:');
	console.log(req.file.path);

	var srcMLCommand = `srcml`;
	var srcMLArgs;
	var srcMlOptions;
	var sourceCodePasted = req.body.pastedSourceCode;
	var filePath;

	if (req.body.languageOptions == "java") {
		filePath = __dirname + "/../public/files/data.java";

		try {
			fs.writeFileSync(filePath, sourceCodePasted);
			// file written successfully
		} catch (err) {
			console.error(err);
		}

		srcMLArgs = filePath;

		const srcMlConversion = spawn(srcMLCommand, [srcMLArgs]);

		srcMlConversion.stdout.on("data", (data) => {
			//convert the data to string and then json
			return res.json(data.toString());
			// res.render('index.ejs',{output: data} )
			console.log(`stdout: ${data}`);
		});

		srcMlConversion.stderr.on("data", (data) => {
			console.error(`stderr: ${data}`);
		});

		srcMlConversion.on("close", (code) => {
			console.log(`child process exited with code ${code}`);
		});
	} else if (req.body.languageOptions == "c++") {
		filePath = __dirname + "/../public/files/data.cpp";

		try {
			fs.writeFileSync(filePath, sourceCodePasted);
			// file written successfully
		} catch (err) {
			console.error(err);
		}

		srcMLArgs = filePath;

		const srcMlConversion = spawn(srcMLCommand, [srcMLArgs]);

		srcMlConversion.stdout.on("data", (data) => {
			return res.json(data.toString());
			// res.render("index.ejs", { output: data });
			console.log(`stdout: ${data}`);
		});

		srcMlConversion.stderr.on("data", (data) => {
			console.error(`stderr: ${data}`);
		});

		srcMlConversion.on("close", (code) => {
			console.log(`child process exited with code ${code}`);
		});
	} else if (req.body.languageOptions === "c#") {
		filePath = __dirname + "/../public/files/data.cs";

		try {
			fs.writeFileSync(filePath, sourceCodePasted);
			// file written successfully
		} catch (err) {
			console.error(err);
		}

		srcMLArgs = filePath;

		const srcMlConversion = spawn(srcMLCommand, [srcMLArgs]);

		srcMlConversion.stdout.on("data", (data) => {
			return res.json(data.toString());
			// res.render("index.ejs", { output: data });
			console.log(`stdout: ${data}`);
		});

		srcMlConversion.stderr.on("data", (data) => {
			console.error(`stderr: ${data}`);
		});

		srcMlConversion.on("close", (code) => {
			console.log(`child process exited with code ${code}`);
		});
	} else {
		console.log(req.file.path);
		console.log(req.body);

		let fileUploadedPath = req.file.path;
		console.log(fileUploadedPath);
		var fileOuput;

		//set up srcMLCommands for file upload and code pasted

		const createSrcMl = spawn(srcMLCommand, [fileUploadedPath]);

		createSrcMl.stdout.on("data", (data) => {
			fileOuput = data;
			console.log(`stdout: ${data}`);

			//try catch block to catch error in res.send & prevent server from crashing
			try {
				return res.json(fileOuput.toString());
			} catch (error) {
				console.error(`Error in res.send | ${error.code} | ${error.message} | ${res.stack}`)
			}
			
		});

		createSrcMl.stderr.on("data", (data) => {
			console.error(`stderr: ${data}`);
		});

		createSrcMl.on("close", (code) => {
			console.log(`child_process exist with code ${code}`);
		});
	}
});
// router.post("/form", upload.single("upload"), (req, res) => {
// 	var srcMLCommand = `srcml`;

// 	  const ls = spawn('ls', ['-lh', '/usr']);
// 	  ls.stdout.on('data', (data) => {
// 		console.log(`stdout: ${data}`);
// 	  });

// 	  ls.stderr.on('data', (data) => {
// 		console.error(`stderr: ${data}`);
// 	  });

// 	  ls.on('close', (code) => {
// 		console.log(`child process exited with code ${code}`);
// 	  });

// 		const createSrcMlForCodePasted = spawn(srcMLCommand, [req.body.codeinput]);

// 		if (req.body.codeinput) {
// 		// data pasted in the text area tuned into a json
// 		let inputCodeBox = JSON.toString(req.body.codeinput);

// 		console.log(req.body);
// 		console.log(createSrcMlForCodePasted);

// 		console.log(inputCodeBox);
// 		const srcMLForText = spawn(srcMLCommand, [`-t love`]);
// 		console.log(srcMLForText);

// 		srcMLForText.stdout.on("data", (data) => {
// 			fileOuput = data;
// 			// console.log(`stdout: ${data}`);
// 			});
// 		}
// 		else {
// 		let fileUploadedPath = req.file.path;
// 		var fileOuput;

// 		set up srcMLCommands for file upload and code pasted

// 		const createSrcMl = spawn(srcMLCommand, [fileUploadedPath]);

// 		createSrcMl.stdout.on("data", (data) => {
// 			fileOuput = data;
// 			console.log(`stdout: ${data}`);

// 			res.render("index", { output: data });
// 		});

// 		createSrcMl.stderr.on("data", (data) => {
// 			console.log(`stderr: ${data}`);
// 		});

// 		createSrcMl.on("close", (code) => {
// 			console.log(`child_process exist with code ${code}`);
// 		});
// 	}
// });

module.exports = router;
