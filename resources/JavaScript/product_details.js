const { Client, logger } = require("camunda-external-task-client-js");
const { Variables } = require("camunda-external-task-client-js");


// configuration for the Client:
//  - 'baseUrl': url to the Process Engine
//  - 'logger': utility to automatically log important events
const config = { baseUrl: "http://localhost:8080/engine-rest", use: logger };

// create a Client instance with custom configuration
const client = new Client(config);

const paybackPeriod = 48;
const apr = 0.05 // 5 percent annual percentage rate

client.subscribe("ProductDetails", async function ({ task, taskService }) {

    const loanAmount = task.variables.get("loan_amount");
    const totalcost = calculateTotalCost(loanAmount);
    const monthlyPayment = calculateMonthlyPayment(totalcost);
    
    //variables to send back
    const reply = new Variables();

    reply.set("totalcost", totalcost);
    reply.set("monthly_payment", monthlyPayment);
    reply.set("apr", apr);
    reply.set("payback_period", paybackPeriod);

    // complete the task
    await taskService.complete(task, reply);
})

calculateTotalCost = (loanAmount) => {
    // four years with percent rate of five (0.05)
    return loanAmount * Math.pow((1 + apr), 4);
}

calculateMonthlyPayment = (totalcost) => {
    return totalcost / paybackPeriod;
} 