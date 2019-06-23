var inquirer = require("inquirer");

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

function Creature(Name, Items, Strength, Dexterity, Constitution, Intelligence, Charisma, Wisdom, Speed, Armor, Resistance, Dodge, Parry, Block){
    this.Name = Name,
    this.HP = Constitution*10,
    this.Items = Items,
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
    this.Block = Block
}

var goblin = new Creature("Goblin", null, 2, 4, 3, 1, 1, 1, 4, 2, 1, 1, 0, 0);

console.log(goblin);