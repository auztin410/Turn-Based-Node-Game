var inquirer = require("inquirer");

module.exports = {
    village: function(){
        console.log("Village prompt");
        inquirer.prompt([
            {
                type: "list",
                choices: ["Rest at inn", "Restock supplies", "Talk to innkeeper"],
                message: "What do you want in the village?",
                name: "village"
            }
        ]).then(function(inquirerResponse) {
            villageSwitch(inquirerResponse.village);
        });
    }
}

function villageSwitch(choice) {
    switch(choice) {
        case "Rest at inn":
            restAtInn();
            break;
    }
}

function restAtInn() {
    inquirer.prompt([
        {
            type: "list",
            choices: ["Yes", "No"],
            message: "Resting at the inn will cost 5 silver",
            name: "inn"
        }
    ]).then(function(inquirerResponse) {
        switch(inquirerResponse.inn) {
            case "Yes":
                console.log("You pay the innkeeper 5 silver to rent a room and rest for the night.");
                break;
            case "No":
                village();
        }
    })
}