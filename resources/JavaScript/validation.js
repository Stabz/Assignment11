const { Client, logger } = require("camunda-external-task-client-js");
const { Variables } = require("camunda-external-task-client-js");

// configuration for the Client:
//  - 'baseUrl': url to the Process Engine
//  - 'logger': utility to automatically log important events
const config = { baseUrl: "http://localhost:8080/engine-rest", use: logger };

// create a Client instance with custom configuration
const client = new Client(config);

// susbscribe to the topic: 'Validation'
client.subscribe("Validation", async function ({ task, taskService }) {
  const name = task.variables.get("name");
  const annualIncome = task.variables.get("annual_income");
  const loanAmount = task.variables.get("loan_amount");
  const personalStatus = task.variables.get("personal_status");

  console.log("Name:", name);
  console.log("Annual Income:", annualIncome);
  console.log("Personal Status:", personalStatus);
  console.log("Loan amount:", loanAmount);

  //variables to send back
  const reply = new Variables();

  //check income and validate
  reply.set("validationVar", annualIncome > 0);

  // complete the task
  await taskService.complete(task, reply);
});
