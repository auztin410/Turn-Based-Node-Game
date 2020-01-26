var inquirer = require('inquirer');
var abilities = require('./Json/abilities.json');

// Function files
var Prompts = require('./Json/prompts.json');
// var village = require("./functions/village");

// This is the Character object.
var character = {
	Name: '',
	Level: 1,
	Class: null,
	HP: 100,
	CurrentHP: 100,
	Abilities: [ 'Slash', 'Punch', 'Block', 'Kick' ],
	Items: [],
	Currency: [ 0, 5, 0, 0 ],
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
};

// Sum an array of numbers.
arrSum = function(arr) {
	return arr.reduce(function(a, b) {
		return a + b;
	}, 0);
};

// Simple d20 roll function as "i" is how many times to roll the die.
function d20(i) {
	var arr = [];
	var res;
	for (i > arr.length; i--; ) {
		res = Math.floor(Math.random() * 20) + 1;
		arr.push(res);
	}
	return arrSum(arr);
}

// This function will search the abilities.json for all abilities in the array to be replaced by string value.
function findAbilities(arr) {
	var skills = [];
	for (var i = 0; i < arr.length; i++) {
		var res = abilities.find((item) => {
			return item.Name === arr[i];
		});
		skills.push(res);
	}
	return skills;
}

// This function is for calculating DMG via the target's defensive stats.
function defenseCalc(action, target) {
	var times = action.Type.length;
	var skill = action.Type;
	var dmgReduction = 0;
	for (var i = 0; i < times; i++) {
		switch (skill[i]) {
			case 'Physical':
				dmgReduction = dmgReduction - target.Armor;
				break;
			case 'Magical':
				dmgReduction = dmgReduction - target.Resistance;
				break;
			case 'Blunt':
				if (target.ArmorType === 'Plate') {
					dmgReduction = dmgReduction - 1;
				}
				break;
			case 'Sharp':
				if (
					target.ArmorType === 'Plate' ||
					target.ArmorType === 'Chainmail' ||
					target.ArmorType === 'Leather'
				) {
					dmgReduction = dmgReduction - 1;
				}
				break;
			case 'Piercing':
				break;
		}
	}
	return dmgReduction;
}

// The base template for creates to build out additional ones with the constructor function.
function Creature(
	Name,
	Challenge,
	Strength,
	Dexterity,
	Constitution,
	Intelligence,
	Charisma,
	Wisdom,
	Speed,
	Armor,
	ArmorType,
	Resistance,
	Dodge,
	Parry,
	Block,
	Abilities
) {
	(this.Name = Name),
		(this.HP = Constitution * 10),
		(this.CurrentHP = this.HP),
		(this.Challenge = Challenge),
		this.Items,
		(this.Strength = Strength),
		(this.Dexterity = Dexterity),
		(this.Constitution = Constitution),
		(this.Intelligence = Intelligence),
		(this.Charisma = Charisma),
		(this.Wisdom = Wisdom),
		(this.Speed = Speed),
		(this.Armor = Armor),
		(this.ArmorType = ArmorType),
		(this.Resistance = Resistance),
		(this.Dodge = Dodge),
		(this.Parry = Parry),
		(this.Block = Block),
		(this.Abilities = Abilities),
		(this.Loot = function() {
			var result = d20(this.Challenge);
			// This is just to test the roll result, this needs to be completed to search the loot json and return an item of items.
			console.log(`The ${this.Name} has been slain and you roll a ${result} for loot.`);
		}),
		(this.Skills = function() {
			if (typeof this.Abilities[0] != 'object') {
				var result = findAbilities(this.Abilities);
				this.Abilities = result;
			}
		}),
		(this.Action = function(ability, target) {
			this.Skills();
			var action = this.Abilities.find((item) => {
				return item.Name === ability;
			});
			var dmgReduction = defenseCalc(action, target);
			var dmg;
			if (action != undefined) {
				dmg = action.BaseDMG + dmgReduction;
				if (dmg <= 0) {
					dmg = 0;
				}
				var atk = `The ${this.Name + ' ' + action.Text} dealing ${dmg} damage to you.`;
				return atk;
			} else {
				console.log("That ability can't be used.");
			}
		});
}

// Creating each creature with their stats.
var goblin = new Creature('Goblin', 1, 2, 4, 3, 1, 1, 1, 4, 2, 'None', 1, 1, 0, 0, [ 'Punch', 'Slash' ]);
var kobold = new Creature('Kobold', 1, 2, 3, 4, 2, 1, 2, 3, 0, 'None', 0, 0, 0, 0, [ 'Punch' ]);
var thief = new Creature('Thief', 1, 2, 4, 3, 3, 4, 3, 5, 2, 'Leather', 0, 1, 1, 0, [ 'Punch', 'Slash' ]);

// Putting all the creatures into an array to easily search for them later.
var allCreatures = [ goblin, kobold, thief ];

// Global Enemy variable
var enemy;

// Just a testing area for the moment to ensure functions are working properly.
// console.log(goblin.Abilities);
// kobold.Action("Punch");
// console.log(kobold.Action("Punch", goblin));

// Shuffle Array function
function shuffle(array) {
	array.sort(() => Math.random() - 0.5);
	return array;
}

// Base prompt and starting point of game
function basePrompt() {
	inquirer.prompt(Prompts.base).then(function(response) {
		switch (response.base) {
			// Battle option from base menu
			case 'Find a battle':
				battlePrompt();
				// More code required!
				break;

			// Village option from base menu
			case 'Go to nearest village':
				villagePrompt();
				break;

			// City option from base menu
			case 'Head to a city':
				console.log('Heading to the city!');
				cityPrompt();
				break;

			// Setup camp option from base menu
			case 'Setup camp':
				console.log('Setting up camp for the night!');
				setupCamp();
				break;

			case 'Character Info':
				characterInfo();
				break;
		}
	});
}

// Battle prompt function options
function battlePrompt() {
	console.log('Searching for a battle!');
	var result = allCreatures.filter((creature) => creature.Challenge === character.Level);
	var shuffled = shuffle(result);
	if (shuffled.length > 4) {
		shuffled.length = 4;
	}
	var creaturePrompt = [
		{
			type: 'list',
			choices: [],
			message: 'Choose your battle!',
			name: 'battle'
		}
	];
	for (i = 0; i < shuffled.length; i++) {
		var target = shuffled[i].Name;
		creaturePrompt[0].choices.push(shuffled[i].Name);
	}
	inquirer.prompt(creaturePrompt).then(function(response) {
		console.log(`You chose to fight ${response.battle}`);
		battle(response.battle);
	});
}

// Action prompt
var actionPrompt = [
	{
		type: 'list',
		choices: character.Abilities,
		message: 'What do you wish to do?',
		name: 'action'
	}
];

// Action prompt function
function action() {
<<<<<<< HEAD
	inquirer.prompt(actionPrompt).then(function(response) {
		console.log(`You use ${response.action}`);
		calculatePlayersAttack(response.action);
		if (enemy.CurrentHP > 0) {
			enemyAttack();
			if (character.CurrentHP <= 0) {
				console.log('You have been killed...');
				console.log('GAME OVER');
				return;
			}
			action();
		} else {
			console.log(`${enemy.Name} has been slain!`);
			basePrompt();
		}
	});
=======
    inquirer.prompt(actionPrompt).then(function(response) {
        console.log(`You use ${response.action}`);
        calculatePlayersAttack(response.action);
        if(enemy.CurrentHP > 0) {
            enemyAttack();
            if(character.CurrentHP <= 0) {
                console.log("You have been killed...");
                console.log("GAME OVER");
                return;
            }
            action();
        }
        else {
            console.log(`${enemy.Name} has been slain!`);
            experienceGain();
            basePrompt();
            // Experience gain function and level up function goes here!
        }
    });
>>>>>>> 8638df2021c7153615c8babc1588281b9e2eb1c7
}

// Calculate Players Attack DMG
function calculatePlayersAttack(a) {
	res = abilities.find(function(ability) {
		return ability.Name == a;
	});
	var dmg = calculateAttack(res);
	enemy.CurrentHP = enemy.CurrentHP - dmg;
	console.log(`${enemy.Name} has ${enemy.CurrentHP} HP left.`);
}

// Battle function
function battle(c) {
	enemy = allCreatures.find((creature) => creature.Name === c);
	action();
}

// Enemy Random Attack Function
function enemyAttack() {
	var attacks = enemy.Abilities;
	var attack = attacks[Math.floor(Math.random() * attacks.length)];
	var res = abilities.find(function(ability) {
		return ability.Name == attack;
	});
	var dmg = calculateAttack(res);
	character.CurrentHP = character.CurrentHP - dmg;
	console.log(`You have ${character.CurrentHP} HP left.`);
}

// Calculate attack
function calculateAttack(attack) {
	if (attack.Modifier[0] === true) {
		var stat = attack.Modifier[1];
		var dmg = attack.BaseDMG + enemy[stat];
		console.log(attack.Text + ' dealing ' + dmg + ' damage.');
		return dmg;
	}
}

// Add Experience and Check for Level Up and clearing enemy variable
function experienceGain() {
var challenge = enemy.Challenge;
var exp = challenge * 25;
console.log(`You have gained ${exp} from defeating the ${enemy.Name}`);
character.Experience = character.Experience + exp;
console.log(`You have a total of ${character.Experience} experience.`);
enemy.CurrentHP = enemy.HP;
enemy = null;
}

// Village function options
function villagePrompt() {
<<<<<<< HEAD
	console.log('Heading to nearby village.');
	inquirer.prompt(Prompts.village).then(function(response) {
		switch (response.village) {
			case 'Rest at the inn':
				console.log('Resting at the inn!');
				inquirer.prompt(Prompts.restAtInn).then(function(response) {
					switch (response.restAtInn) {
						case 'Yes':
							var check = currencyCheck('silver', 5);
							if (check === true) {
								console.log('You spend 5 silver to rent a room at the inn and rest of the night.');
								character.Currency[1] = character.Currency[1] - 5;
								character.CurrentHP = character.HP;
								villagePrompt();
							} else {
								console.log('You do not have 5 silver to rent a room!');
								villagePrompt();
							}
							break;
						case 'No':
							villagePrompt();
							break;
					}
				});
				break;

			case 'Restock supplies':
				console.log('Restocking supplies!');
				// More code required!
				// Need to design out a store front function and prompt setup.
				villagePrompt();
				break;

			case 'Talk to the innkeeper':
				console.log('Talking to innkeeper about quests and rumors!');
				// More code required!
				// Need to setup a quest function and prompt setup.
				villagePrompt();
				break;

			case 'Return to Adventuring':
				console.log('Returning to your Adventure');
				basePrompt();
		}
	});
=======
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
                            villagePrompt();
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
                villagePrompt();
                break;

            case "Talk to the innkeeper":
                console.log("Talking to innkeeper about quests and rumors!");
                // More code required!
                // Need to setup a quest function and prompt setup.
                villagePrompt();
                break;
            case "Return to adventuring":
                console.log("You leave the village and return to adventuring.");
                basePrompt();
        }
    })
>>>>>>> 8638df2021c7153615c8babc1588281b9e2eb1c7
}

// City function options
function cityPrompt() {
<<<<<<< HEAD
	console.log('Heading to the city!');
	inquirer.prompt(Prompts.city).then(function(response) {
		switch (response.city) {
			case 'Rest at the inn':
				console.log('Rest at the inn selected!');
				var check = currencyCheck('silver', 50);
				if (check === true) {
					character.Currency[1] = character.Currency[1] - 50;
					character.CurrentHP = character.HP;
				} else {
					console.log('You do not have 50 silver to rent a room.');
					cityPrompt();
				}
				break;
			case 'Restock supplies':
				console.log('Restock supplies selected!');
				break;
			case 'Talk to the innkeeper':
				console.log('Talk to the innkeeper selected!');
				break;
			case 'Go to the blacksmith':
				console.log('Go to the blacksmith selected!');
				break;
		}
	});
=======
    console.log("Heading to the city!");
    inquirer.prompt(Prompts.city).then(function(response) {
        switch(response.city) {
            case "Rest at the inn":
                var check = currencyCheck("silver", 5);
                if(check === true) {
                    character.Currency[1] = character.Currency[1] -5;
                    character.CurrentHP = character.HP;
                    console.log("You spend 5 silver to rent a room at the inn and rest of the night.")
                    cityPrompt();
                }
                else {
                    console.log("You do not have 5 silver to rent a room!");
                    cityPrompt();
                }
            break;
            case "Restock supplies":
                console.log("Restock supplies selected!");
                // More code goes here!
                cityPrompt();
            break;
            case "Talk to the innkeeper":
                console.log("Talk to the innkeeper selected!");
                // More code goes here!
                cityPrompt();
            break;
            case "Go to the blacksmith":
                console.log("Go to the blacksmith selected!");
                // More code goes here!
                cityPrompt();
            break;
        }
    });
>>>>>>> 8638df2021c7153615c8babc1588281b9e2eb1c7
}

// Setup a camp function options
function setupCamp() {
	var actions = 3;
	camp(actions);
}

// Camp function and options
function camp(actions) {
	if (actions > 0) {
		console.log(`You have ${actions} actions left`);
		inquirer.prompt(Prompts.camp).then(function(response) {
			switch (response.camp) {
				case 'Survival':
					// Survival prompts (building a fire, setting up traps/alarms, going hunting/fishing).
					actions--;
					camp(actions);
					break;
				case 'Training':
					// Training prompts (reading, training with a weapon, or skill).
					actions--;
					camp(actions);
					break;
				case 'Eat':
					// Eating something that you have prepared or ready to eat.
					actions--;
					camp(actions);
					break;
				case 'Equipment':
					// Equipment prompts (Sharpening/oiling your weapon, cleaning/removing your armor).
					actions--;
					camp(actions);
					break;
				case 'Rest':
					// Resting will end the night and give a bonus depending on remaining actions left.
					actions--;
					camp(actions);
					break;
			}
		});
	} else {
		console.log('You used up all your actions and fall asleep in your camp for the night.');
		// Trigger camp event function
	}
}

// Call to check if the player has enough of a given currency.
function currencyCheck(type, cost) {
	switch (type) {
		case 'bronze':
			if (character.Currency[0] >= cost) {
				return true;
			}
			return false;
		case 'silver':
			if (character.Currency[1] >= cost) {
				return true;
			}
			return false;
		case 'gold':
			if (character.Currency[2] >= cost) {
				return true;
			}
			return false;
		case 'platinum':
			if (character.Currency[3] >= cost) {
				return true;
			}
			return false;
	}
}

// Check character info function
function characterInfo() {
	console.log('Character Info');
	inquirer.prompt(Prompts.characterInfo).then(function(response) {
		switch (response.characterInfo) {
			case 'Stats':
				console.log(character);
				break;
			case 'Currency':
				console.log(character);
				break;
			case 'Inventory':
				console.log(character);
				break;
		}
	});
}

// Calling the base prompt to state the game.
basePrompt();
