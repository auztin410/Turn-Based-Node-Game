var inquirer = require("inquirer");
var abilities = require("./abilities.json");

// Function files
var Inquirer = require("./functions/inquirer");

// This is the Character object.
var character = {
    Name: "",
    Level: 0,
    Class: null,
    Items: [],
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


var choice = Inquirer.base();

switch(choice) {
    case "Go to nearest village":
        Village.village();
        break;
}

