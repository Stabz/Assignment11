const { Client, logger } = require("camunda-external-task-client-js");
const { Variables } = require("camunda-external-task-client-js");

// configuration for the Client:
//  - 'baseUrl': url to the Process Engine
//  - 'logger': utility to automatically log important events
const config = { baseUrl: "http://localhost:8080/engine-rest", use: logger };

// create a Client instance with custom configuration
const client = new Client(config);

// susbscribe to the topic: 'Validation'
client.subscribe("Validation", async function({ task, taskService }) {
  
   const name = task.variables.get("name");
   const annualIncome = task.variables.get("income");
   const maritalStatus = task.variables.get("status");

   
   console.log(name + ' aninc: ' + annualIncome + ' marialstat_ ' + maritalStatus);

   //variables to send back
   const reply = new Variables();

   //check income and validate
   if(annualIncome>0){
     reply.set("validationVar", "passed");
    }else{
     reply.set("validationVar", "failed");
   }


   
  // complete the task
  await taskService.complete(task,reply);
  
});