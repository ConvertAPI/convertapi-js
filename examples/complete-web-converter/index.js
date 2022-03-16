// Set your secret key here
const convertApiSecret = "<your-secret-here>";
// DOM element selectors
const uploadArea = document.querySelector("#uploadArea");
const workArea = document.querySelector("#workArea");
const loadingText = document.querySelector("#loadingText");
const fileInput = document.querySelector("#fileInput");
const downloadPanel = document.querySelector("#downloadPanel");
const toolTipData = document.querySelector(".upload-area__tooltip-data");
const resultDownloadLink = document.querySelector("#resultDownload");
const resultFileName = document.querySelector("#resultFileName");
const destinationFormatBtn = document.querySelectorAll(
  ".select-converter .grid a"
);
const convertAgainBtn = document.querySelector(".convert-again");

// Accepted document types
const documentTypes = [
  "pdf",
  "doc",
  "docx",
  "odt",
  "xls",
  "xlsx",
  "ppt",
  "pptx",
  "key",
  "numbers",
  "slides",
  "odt",
  "txt",
  "rtf",
  "jpeg",
  "png"
];

// Append doc types to array for the tooltip data
toolTipData.innerHTML = [...documentTypes].join(", .");

// When (work-area) has (dragover) event
workArea.addEventListener("dragover", function (event) {
  event.preventDefault();
  workArea.classList.add("work-area--over");
});

// When (work-area) has (dragleave) event
workArea.addEventListener("dragleave", function (event) {
  workArea.classList.remove("work-area--over");
});

// When (work-area) has (drop) event
workArea.addEventListener("drop", function (event) {
  event.preventDefault();
  workArea.classList.remove("work-area--over");
  uploadFile(event.dataTransfer.files[0]);
});

// When (work-area) has (click) event
workArea.addEventListener("click", function (event) {
  // if file not uploaded
  if (!workArea.classList.contains("work-area--Uploaded")) fileInput.click();
});

// When (fileInput) has (change) event
fileInput.addEventListener("change", function (event) {
  const file = event.target.files[0];
  uploadFile(file);
});

// reload on Convert again click
convertAgainBtn.addEventListener("click", function (event) {
  // prevent file download
  event.preventDefault();
  // reload the page
  location.reload();
});

// add event listeners for destination format buttons
for (let i = 0; i < destinationFormatBtn.length; i++) {
  destinationFormatBtn[i].addEventListener("click", function (event) {
    // call uploadFile function again with correct destination format
    uploadFile(fileInput.files[0], event.target.innerHTML);
    // hide the destination select buttons
    workArea.classList.remove("work-area--Select-destination");
  });
}

// File upload function
function uploadFile(file, destination = "pdf") {
  // get file extension
  const extension = file.name.split(".").pop();
  // get file size
  const fileSize = file.size;
  // If uploaded document is PDF and destination is not set
  if (
    extension === "pdf" &&
    !workArea.classList.contains("work-area--Select-destination")
  ) {
    // show destination extension buttons
    workArea.className += " work-area--Select-destination work-area--Uploaded";
  } else {
    // Check if file is valid
    if (fileValidate(extension, fileSize)) {
      // Add class (work-area--Uploaded) on (work-area)
      workArea.classList.add("work-area--Uploaded");
      // Show loading text and cursor
      loadingText.style.display = "block";
      // Attempt to convert a file
      convertFile(file, extension, destination);
    } else {
      // in case invalid file was uploaded - reset form
      location.reload();
    }
  }
}

function convertFile(file, extension, destination) {
  // Initialize ConvertAPI with your secret key
  let convertApi = ConvertApi.auth({ secret: convertApiSecret });
  // Create conversion parameters object
  let params = convertApi.createParams();
  // set uploaded file as one of the parameters
  params.add("file", file);
  // execute the conversion
  convertApi.convert(extension, destination, params).then(
    (x) => {
      let result = x.dto;
      // check if success
      if (result.Files) {
        // Hide loading-text (please-wait) element
        loadingText.style.display = "none";
        // Set result file download URL
        resultDownloadLink.setAttribute("href", result.Files[0].Url);
        // Set result file name
        resultFileName.innerHTML = result.Files[0].FileName;
        // Show download panel
        downloadPanel.style.display = "block";
        workArea.classList.add("show-result");
      } else {
        // handle error
        if (result.Code === 4010)
          loadingText.innerHTML =
            'Please enter your ConvertAPI secret key in index.js file. You can find the API secret in your <a href="https://www.convertapi.com/a" target="_blank">account dashboard</a>.';
        else loadingText.textContent = `Ooops! ${result.Message}`;
        loadingText.classList.add("error-message");
      }
    },
    (error) => {
      // Throw a network-related error here
      throw error;
    }
  );
}

// File validation function
function fileValidate(fileType, fileSize) {
  // File type validation
  let isDocument = documentTypes.filter(
    (type) => fileType.indexOf(type) !== -1
  );
  // If uploaded file is a valid document
  if (isDocument.length !== 0) {
    // Check if file size is 2MB or less
    if (fileSize <= 2000000) {
      return true;
    } else {
      // Show the file size validation error
      return alert("Max file size is 2 MB");
    }
  } else {
    // Show the file type validation error
    return alert(
      `Please make sure to upload a document. Supported formats are:\r\n.${[
        ...documentTypes
      ].join(", .")}.`
    );
  }
}
