const template = document.getElementById("promptTemplate").innerText;
const output = document.getElementById("promptOutput");
const badge = document.getElementById("statusBadge");

const getValue = (id) => document.getElementById(id).value.trim() || "Not specified";

function generatePrompt() {
  const data = {
    flowType: getValue("flowType"),
    screenCount: getValue("screenCount"),
    desiredAction: getValue("desiredAction"),
    constraints: getValue("constraints"),
    targetObject: getValue("targetObject"),
    outputFields: getValue("outputFields"),
    outputStyle: getValue("outputStyle"),
    notes: getValue("notes")
  };

  let prompt = template;

  Object.keys(data).forEach((key) => {
    const regex = new RegExp(`{${key}}`, "g");
    prompt = prompt.replace(regex, data[key]);
  });

  output.value = prompt;
  badge.innerText = "Generated";
}

function copyPrompt() {
  if (!output.value) return;
  navigator.clipboard.writeText(output.value);
  badge.innerText = "Copied";
}

function clearForm() {
  document.getElementById("promptForm").reset();
  output.value = "";
  badge.innerText = "Cleared";
}

function loadExample() {
  document.getElementById("flowType").value = "Screen Flow for Customer Intake";
  document.getElementById("screenCount").value = "3";
  document.getElementById("desiredAction").value = "Collect customer details, validate inputs, and create a record.";
  document.getElementById("constraints").value = "Email must be valid. Required fields cannot be empty. Handle duplicate records.";
  document.getElementById("targetObject").value = "Lead";
  document.getElementById("outputFields").value = "FirstName, LastName, Email, Company";
  document.getElementById("outputStyle").value = "Salesforce Flow XML";
  document.getElementById("notes").value = "Ensure naming conventions follow best practices.";

  badge.innerText = "Example loaded";
}


document.getElementById("generateBtn").addEventListener("click", generatePrompt);
document.getElementById("copyBtn").addEventListener("click", copyPrompt);
document.getElementById("clearBtn").addEventListener("click", clearForm);
document.getElementById("exampleBtn").addEventListener("click", loadExample);
