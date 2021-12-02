const { Client, logger } = require("camunda-external-task-client-js");
const { Variables } = require("camunda-external-task-client-js");


// configuration for the Client:
//  - 'baseUrl': url to the Process Engine
//  - 'logger': utility to automatically log important events
const config = { baseUrl: "http://localhost:8080/engine-rest", use: logger };

// create a Client instance with custom configuration
const client = new Client(config);

client.subscribe("SendCopyOfDraft", async function ({ task, taskService }) {

    const variables = task.variables.getAll();

    let contract_draft = "Dear " + variables.name + "\n" + 
                            "Your loan request have been approved!\n" + 
                            "You have to respond before: " + calculateDateString() + 
                            "\n\n" + 
                            "Loan amount: " + variables.loan_amount + "\n" + 
                            "With an annual percentage rate of " + variables.apr * 100 + "% " + 
                            "the total payback amount will be " + variables.totalcost + " \n" + 
                            "You will have to pay the loan back in " + variables.payback_period + " month" + 
                            "therefore you will have to pay " + variables.monthly_payment + " /month in " + variables.payback_period + " month";

    console.log(contract_draft);
    
    //variables to send back
    const reply = new Variables();

    reply.set("contract_draft", contract_draft);

    // complete the task
    await taskService.complete(task, reply);
})


calculateDateString = () => {
    var targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 2);

    const dd = targetDate.getDate();
    const mm = targetDate.getMonth() + 1; // January is 0
    const yyyy = targetDate.getFullYear();
    const hour = targetDate.getHours();
    const min = targetDate.getMinutes();

    return dateString = dd + "/" + mm + "/" + yyyy + " at " + ("0" + hour).slice(-2)  + ":" + ("0" + min).slice(-2);
}
