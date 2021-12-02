const { Client, logger } = require("camunda-external-task-client-js");
const { Variables } = require("camunda-external-task-client-js");

// configuration for the Client:
//  - 'baseUrl': url to the Process Engine
//  - 'logger': utility to automatically log important events
const config = { baseUrl: "http://localhost:8080/engine-rest", use: logger };

// create a Client instance with custom configuration
const client = new Client(config);

// susbscribe to the topic: 'Notification'
client.subscribe("Notification", async function({ task, taskService }) {

  const reason = task.variables.get("rejection_message");
  const name = task.variables.get("name");
   
  let message = "Dear " + name + ", \n" + 
                "We are sorry to inform you that your loan application has been rejected.\n\n";

  if(reason) {
    message += "The reason given from the Bank Agent is: \n" + String(reason) + "\n\n";
  }

  message += "Best regards\nThe Super Bank";



   console.log(message);
   
  // complete the task
  await taskService.complete(task);
  
});