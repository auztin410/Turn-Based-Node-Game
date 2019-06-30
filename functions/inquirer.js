var inquirer = require("inquirer");

module.exports = {
    base: function(){
        inquirer.prompt([
    {
        type: "list",
        choices: ["Find a battle", "Go to nearest village", "Head to a city", "Setup camp"],
        message: "What do you want to do?",
        name: "base"
    }
]).then(function(inquirerResponse) {
    return inquirerResponse.base;
});
    }
}