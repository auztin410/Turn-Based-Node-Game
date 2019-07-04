var inquirer = require("inquirer");
var abilities = require("./Json/abilities.json");

// Function files
var Prompts = require("./Json/prompts.json");
// var village = require("./functions/village");

// This is the Character object.
var character = {
    Name: "",
    Level: 0,
    Class: null,
    Items: [],
    Currency: [0, 5, 0, 0],
    Experience: 0,
    Weapon: null,
    Shield: null,
    Armor: null,
    Strength: 0,
    Dexterity: 0,
    Constitution: 0,
    Intelligence: 0,
    Charisma: 0,
    Wisdom: 0,
    Speed: 0,
    Armor: 0,
    Resistance: 0,
    Dodge: 0,
    Parry: 0,
    Block: 0
}

// Sum an array of numbers.
arrSum = function(arr){
    return arr.reduce(function(a,b){
      return a + b
    }, 0);
  }

// Simple d20 roll function as "i" is how many times to roll the die.
function d20(i) {
    var arr = []
    var res;
    for(i > arr.length; i--;) {
        res = Math.floor(Math.random() * 20) + 1;
        arr.push(res);
    }
    return arrSum(arr);
}

// This function will search the abilities.json for all abilities in the array to be replaced by string value.
function findAbilities(arr) {
        var skills = [];
        for(var i = 0; i < arr.length; i++) {
            var res = abilities.find(item => {
                return item.Name === arr[i];
            });
            skills.push(res);
        }
        return skills;
}

// This function is for calculating DMG via the target's defensive stats.
function defenseCalc(action, target){
    var times = action.Type.length;
    var skill = action.Type
    var dmgReduction = 0;
    for(var i = 0; i < times; i++) {
        switch(skill[i]) {
            case "Physical":
                dmgReduction = dmgReduction - target.Armor;
                break;
            case "Magical":
                dmgReduction = dmgReduction - target.Resistance;
                break;
            case "Blunt":
                if(target.ArmorType === "Plate") {
                    dmgReduction = dmgReduction - 1;
                }
                break;
            case "Sharp":
                if(target.ArmorType === "Plate" || target.ArmorType === "Chainmail" || target.ArmorType === "Leather") {
                    dmgReduction = dmgReduction - 1;
                }
                break;
            case "Piercing":
                
                break;
        }
    }
    return dmgReduction;
}

// The base template for creates to build out additional ones with the constructor function.
function Creature(Name, Challenge, Strength, Dexterity, Constitution, Intelligence, Charisma, Wisdom, Speed, Armor, ArmorType, Resistance, Dodge, Parry, Block, Abilities){
    this.Name = Name,
    this.HP = Constitution*10,
    this.CurrentHP,
    this.Challenge = Challenge,
    this.Items,
    this.Strength = Strength,
    this.Dexterity = Dexterity,
    this.Constitution = Constitution,
    this.Intelligence = Intelligence,
    this.Charisma = Charisma,
    this.Wisdom = Wisdom,
    this.Speed = Speed,
    this.Armor = Armor,
    this.ArmorType = ArmorType,
    this.Resistance = Resistance,
    this.Dodge = Dodge,
    this.Parry = Parry,
    this.Block = Block,
    this.Abilities = Abilities,
    this.Loot = function() {
        var result = d20(this.Challenge);
        // This is just to test the roll result, this needs to be completed to search the loot json and return an item of items.
        console.log(`The ${this.Name} has been slain and you roll a ${result} for loot.`);
    },
    this.Skills = function() {
        if(typeof this.Abilities[0] != "object") {
            var result = findAbilities(this.Abilities);
            this.Abilities = result;
        }
    },
    this.Action = function(ability, target) {
            this.Skills();
            var action = this.Abilities.find(item => {return item.Name === ability});
            var dmgReduction = defenseCalc(action, target);
            var dmg;
            if(action != undefined) {
                dmg = action.BaseDMG + dmgReduction;
                if(dmg <= 0) {
                    dmg = 0;
                }
                var atk = `The ${this.Name + " " + action.Text} dealing ${dmg} damage to you.`;
                return atk;
            }
            else {
                console.log("That ability can't be used.");
            }
    }
}

// Creating each creature with their stats.
var goblin = new Creature("Goblin", 1, 2, 4, 3, 1, 1, 1, 4, 2, "None", 1, 1, 0, 0, ["Punch", "Slash"]);
var kobold = new Creature("Kobold", 1, 2, 3, 4, 2, 1, 2, 3, 0, "None", 0, 0, 0, 0, ["Punch"]);

// Putting all the creatures into an array to easily search for them later.
var allCreatures = [
    goblin, kobold
];


// Just a testing area for the moment to ensure functions are working properly.
// console.log(goblin.Abilities);
// kobold.Action("Punch");
// console.log(kobold.Action("Punch", goblin));




// Base prompt and starting point of game
function basePrompt() {
    inquirer.prompt(Prompts.base).then(function(response) {
        switch(response.base) {
    
            // Battle option from base menu
            case "Find a battle":
                console.log("Search for a battle!");
                // More code required!
                break;
    
            // Village option from base menu
            case "Go to nearest village":
                villagePrompt();
                break;
    
            // City option from base menu
            case "Head to a city":
                console.log("Heading to the city!");
                CityPrompt();
                break;
              
            // Setup camp option from base menu
            case "Setup camp":
                console.log("Setting up camp for the night!");
                // More code required!
                break;
        }
    });
    
}

// Village function options
function villagePrompt() {
    console.log("Heading to nearby village.");
    inquirer.prompt(Prompts.village).then(function(response) {
        switch(response.village) {

            case "Rest at the inn":
                console.log("Resting at the inn!");
                inquirer.prompt(Prompts.restAtInn).then(function(response) {
                    switch(response.restAtInn) {
                        case "Yes":
                            var check = currencyCheck("silver", 5);
                        if(check === true) {
                            console.log("You spend 5 silver to rent a room at the inn and rest of the night.");
                            character.Currency[1] = character.Currency[1] -5;
                            character.CurrentHP = character.HP;
                        }
                        else {
                            console.log("You do not have 5 silver to rent a room!");
                            villagePrompt();
                        }
                        break;
                        case "No":
                            villagePrompt();
                        break;
                    }
                })
                break;

            case "Restock supplies":
                console.log("Restocking supplies!");
                // More code required!
                // Need to design out a store front function and prompt setup.
                break;

            case "Talk to the innkeeper":
                console.log("Talking to innkeeper about quests and rumors!");
                // More code required!
                // Need to setup a quest function and prompt setup.
                break;
        }
    })
}

// City function options
function CityPrompt() {
    console.log("Heading to the city!");
    inquirer.prompt(Prompts.city).then(function(response) {
        switch(response.city) {
            case "Rest at the inn":
                console.log("Rest at the inn selected!");
            break;
            case "Restock supplies":
                console.log("Restock supplies selected!");
            break;
            case "Talk to the innkeeper":
                console.log("Talk to the innkeeper selected!");
            break;
            case "Go to the blacksmith":
                console.log("Go to the blacksmith selected!");
            break;
        }
    })
}

// Call to check if the player has enough of a given currency.
function currencyCheck(type, cost) {
    switch(type) {
        case "bronze":
            if(character.Currency[0] >= cost) {
                return true;
            }
            return false;
        case "silver":
            if(character.Currency[1] >= cost) {
                return true;
            }
            return false;
        case "gold":
            if(character.Currency[2] >= cost) {
                return true;
            }
            return false;
        case "platinum":
            if(character.Currency[3] >= cost) {
                return true;
            }
            return false;
    }
}



// Calling the base prompt to state the game.
basePrompt();


