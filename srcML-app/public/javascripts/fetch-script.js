const { response } = require("express");

async function postFormDataAsJson({ url, formData }) {
    //transforms a list of key-value pairs (formData) into an object .
	// const plainFormData = Object.fromEntries(formData.entries());
    //convert into JSON
	// const formDataJsonString = JSON.stringify(plainFormData);

	const fetchOptions = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
		},
		// body: formDataJsonString,
		body: formData,
		
	};

	const response = await fetch(url, fetchOptions);

	if (!response.ok) {
		const errorMessage = await response.text();
		throw new Error(errorMessage);
	}

	return response.json();
}


//read the values of all from fields.
async function handleFormSubmit(event) {
	//prevent page from reloading when form is submitted
	event.preventDefault();

	//element from which the listener trigger on.(form element)
	const form = event.currentTarget;
	// form action
	const url = form.action;

	try {
        // provides a way to easily construct a set of key/value pairs representing form fields and their values
		const formData = new FormData(form);

		const responseData = await postFormDataAsJson({ url, formData });

        // const form2 = document.getElementById("rawCode")
        // form2.append(responseData.inputcode)

		console.log(responseData);
	} catch (error) {
		console.log(error);
	}
}

// get the first form element
const webform1 = document.getElementById("webForm");

//event listener &b handler on the submit button
webform1.addEventListener("submit", handleFormSubmit);
