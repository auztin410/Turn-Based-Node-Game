var inquirer = require("inquirer");
var abilities = require("./abilities.json");

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

arrSum = function(arr){
    return arr.reduce(function(a,b){
      return a + b
    }, 0);
  }

function d20(i) {
    var arr = []
    var res;
    for(i > arr.length; i--;) {
        res = Math.floor(Math.random() * 20) + 1;
        arr.push(res);
    }
    return arrSum(arr);
}

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

function Creature(Name, Challenge, Strength, Dexterity, Constitution, Intelligence, Charisma, Wisdom, Speed, Armor, Resistance, Dodge, Parry, Block, Abilities){
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
        var result = findAbilities(this.Abilities);
        this.Abilities = result;
    }
}

var goblin = new Creature("Goblin", 1, 2, 4, 3, 1, 1, 1, 4, 2, 1, 1, 0, 0, ["Punch", "Slash"]);
var kobold = new Creature("Kobold", 1, 2, 3, 4, 2, 1, 2, 3, 0, 0, 0, 0, 0, ["Punch"]);

var allCreatures = [
    goblin, kobold
];

goblin.Skills();

console.log(goblin.Abilities);