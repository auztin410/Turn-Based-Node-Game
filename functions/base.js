var inquirer = require("inquirer");

// Import other prompts
var Village = require("./village");

module.exports = {
    basePrompt: function(){
inquirer.prompt([
    {
        type: "list",
        choices: ["Find a battle", "Go to nearest village", "Head to a city", "Setup camp"],
        message: "What do you want to do?",
        name: "base"
    }
]).then(function(inquirerResponse) {
    baseSwitch(inquirerResponse.base);
});
    }
}

function baseSwitch(choice) {
    switch(choice) {
        case "Go to nearest village":
            Village.village();
            break;        
    }
}