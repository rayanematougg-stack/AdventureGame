/*
Adventure Game
[Description of the game]
*/
const readline = require("readline-sync");
let playerName = ""; //get player name using readline-sync
playerName = readline.question("What is your name, adventurer? ");
console.log(`Welcome, ${playerName}, to the Adventure Game!`);
console.log("Prepare yourself for an epic journey!");
//create variables for player stats
let playerHealth = 100;
let playerGold = 20;
let playerCurrentLocation = "village";
let gameRunning = true;
let inventory = [];
//Display welcome message and player stats
console.log(`\n--- ${playerName}'s Stats ---`);
console.log(`Health: ${playerHealth}`);
console.log(`Gold: ${playerGold}`);
console.log(`Location: ${playerCurrentLocation}`);
