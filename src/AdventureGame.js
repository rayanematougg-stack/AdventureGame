// ===========================================
// The Dragon's Quest - Text Adventure Game
// A progression-based learning project
// ===========================================

//Include redlinefor player input
const readline = require("readline-sync");

// Player stats - Item flags
let playerName = "";
let playerHealth = 100;
let playerGold = 20;
let currentLocation = "village";
let gameRunning = true;
let hasWeapon = false;
let hasPotion = false;
let hasArmor = false;
let isFirstVisit = true;

// Weapon damage-Combat-related values
let weaponDamage = 0;
let monsterDefense = 5;
let healingPotionValue = 30;

// ---------- Functions ----------

/**
 *Show the player current stats
 *Displays the health , gold ,and current location
 */

function showStatus() {
  console.log(`\n--- ${playerName}'s Stats ---`);
  console.log(`Health: ${playerHealth}`);
  console.log(`Gold: ${playerGold}`);
  console.log(`Location: ${currentLocation}`);
}

// Show the currentlocation's description and available choices

function showLocation() {
  console.log("\n=== " + currentLocation.toUpperCase() + " ===");

  if (currentLocation === "village") {
    console.log(
      "You're in a bustling village. The blacksmith and market are nearby.",
    );
    console.log("\nWhat would you like to do?");
    console.log("1: Go to blacksmith");
    console.log("2: Go to market");
    console.log("3: Enter forest");
    console.log("4: Check status");
    console.log("5: Use Item");
    console.log("6: Help");
    console.log("7: Quit Game");

    if (isFirstVisit) {
      console.log(
        "\nVillager: 'Welcome, adventurer! Rumor has it there's a dragon in the mountains...'",
      );
      isFirstVisit = false;
    }
  } else if (currentLocation === "blacksmith") {
    console.log(
      "The heat from the forge fills the air. Weapons and armor line the walls.",
    );
    console.log("\nWhat would you like to do?");
    console.log("1: Return to village");
    console.log("2: Check status");
    console.log("3: Use Item");
    console.log("4: Help");
    console.log("5: Quit Game");
  } else if (currentLocation === "market") {
    console.log(
      "Merchants sell their wares from colorful stalls. A potion seller catches your eye.",
    );
    console.log("\nWhat would you like to do?");
    console.log("1: Buy potion (" + healthPotion.value + " gold) ");
    console.log("2: Return to village");
    console.log("3: Check status");
    console.log("4: Use Item");
    console.log("5: Help");
    console.log("6: Quit Game");
  } else if (currentLocation === "forest") {
    console.log(
      "The forest is dark and foreboding. You hear starange noises all around you. ",
    );
    console.log("\nWhat would you like to do?");
    console.log("1: Return to village");
    console.log("2: Check status");
    console.log("3: Use Item");
    console.log("4: Help");
    console.log("5: Quit Game");
  }
}

//============
//Movement Functions
//Functions that handlesplayer movement
//===========
/**
 *Handles movement between locations
 */

function move(playerChoiceNum) {
  let validMove = false;
  if (currentLocation === "village") {
    if (playerChoiceNum === 1) {
      currentLocation = "blacksmith";
      console.log("\nTou enter the blacksmith's shop");
      validMove = true;
    } else if (playerChoiceNum === 2) {
      currentLocation = "market";
      console.log("\nYou enter the market");
      validMove = true;
    } else if (playerChoiceNum === 3) {
      currentLocation = "forest";
      console.log("\nYou entered the forest...");
      validMove = true;
      //Trigger combat when entering forest
      console.log("\nA monster appears !");
      if (!handlCombat()) {
        currentLocation = "village";
      }
    }
  } else if (currentLocation === "blacksmith") {
    if (playerChoiceNum === 2) {
      currentLocation = "village";
      console.log("\nYou enter the village");
      validMove = true;
    }
  } else if (currentLocation === "market") {
    currentLocation === "village";
    console.log("\nYou return to the village");
    validMove = true;
  } else if (currentLocation === "forest") {
    if (playerChoiceNum === 1) {
      currentLocation = "village";
      console.log("\nYou return to the village");
      validMove = true;
    }
  }
  return validMove;
}

//=========
//Combat Function's
//Functions that hundle battles and health
//========

/**
 *Handles montster battles
 *checks if player has a weapon and manages combat results
 */

function handlCombat() {
  if (hasWeapon) {
    console.log("You have a sword! You attack!");
    console.log("Victory! You found 10 gold!");
    playerGold += 10;
    return true;
  } else {
    console.log("Without a weapon, you must retreat!");
    updateHealth(-20);
    return false;
  }
}

/**
 *Update player health, keeping it between 0 and 100
 */

function updateHealth(amount) {
  playerHealth += amount;

  if (playerHealth > 100) {
    playerHealth = 100;
    console.log("you're at full health!");
  }
  if (playerHealth < 0) {
    playerHealth = 0;
    console.log("You're gravely wounded!");
  }
  console.log("Health is now :" + playerHealth);
  return playerHealth;
}
//========
//Item Functions
//Functions that handle item usageand inventory
//========

/**
 *Handles using itemslike potions
 */
function useItem() {
  if (hasPotion) {
    console.log("You drink the healing potion ");
    updateHealth(30);
    hasPotion = false;
    return true;
  }
  console.log("You don't have any usable items !");
  return false;
}
/**
 *Displays the player's inventory
 */

function checkInventory() {
  console.log("\n=== INVENTORY ===");
  if (!hasArmor && !hasPotion && !hasWeapon) {
    console.log("You're inventory is empty");
    return;
  }
  if (hasWeapon) console.log("-sword");
  if (hasPotion) console.log("-Health Portion");
  if (hasArmor) console.log("-Shield");
}
//========================
//Shopping Functions
//Function that handle buying items
//================
/**
 *Handles purchasing items at the blacksmit
 */
function buyFromBlacksmith() {
  if (playerGold >= 10) {
    console.log("\nBlacksmith : 'A fine blade for a brave adventurer !' ");
    playerGold -= 10;
    hasWeapon = true;
    console.log("You bought a sword for 10 gold!");
    console.log("Gold Remaining " + playerGold);
  } else {
    console.log("\nBlacksmith : 'come back when you have more gold ! ' ");
  }
} /**
 * Handle buy from market
 */
function buyFromMarket() {
  if (playerGold >= 5) {
    console.log("\nMerchant : 'This portion will heal your wounds !'");
    playerGold -= 5;
    hasPotion = true;
    console.log("You bought a health potion for 5 gold");
    console.log("Gold remaining : " + playerGold);
  } else {
    console.log("\nMerchant:'No gold , no potion !'");
  }
}
//Help system
//===============

/**
 *Show all available game commands and how to use them
 */
function showHelp() {
  console.log("\n=== AVAILABLE COMMANDS ===");

  console.log("\nMovement Commands:");
  console.log("- In the village, choose 1-3 to travel to different locations");
  console.log(
    "- In other locations, choose the return option to go back to the village",
  );

  console.log("\nBattle Information:");
  console.log("- You need a sword to win battles");
  console.log("- Monsters appear in the forest");
  console.log("- Without a weapon, you'll lose health when retreating");

  console.log("\nItem Usage:");
  console.log("- Health potions restore 30 health");
  console.log("- You can buy potions at the market for 5 gold");
  console.log("- You can buy a sword at the blacksmith for 10 gold");

  console.log("\nOther Commands:");
  console.log("- Choose the status option to see your health and gold");
  console.log("- Choose the help option to see this message again");
  console.log("- Choose the quit option to end the game");

  console.log("\nTips:");
  console.log("- Keep healing potions for dangerous areas");
  console.log("- Defeat monsters to earn gold");
  console.log("- Health can't go above 100");
}

//====================================
// ---------- Main game loop ----------
//Controlsthe flow of the game
//====================================

console.log("=================================");
console.log("       The Dragon's Quest        ");
console.log("=================================");
console.log("\nYour quest: Defeat the dragon in the mountains!");

// Get player's name
playerName = readline.question("\nWhat is your name, adventurer? ");
console.log(`Welcome, ${playerName}, to the Adventure Game!`);
console.log("Prepare yourself for an epic journey!");

while (gameRunning) {
  //Show current location and choices
  showLocation();

  //Get and validate player choice
  let validChoice = false;
  while (!validChoice) {
    try {
      let choice = readline.question("\nEnter choice number: ");

      //Check for empty input
      if (choice.trim() === "") {
        throw "Please enter a number!";
      }

      //Convert to number and check if it's valid number
      let playerChoiceNum = parseInt(choice);
      if (isNaN(playerChoiceNum)) {
        throw "That's not a number! Please enter a number.";
      }

      //Handle choices based on location

      if (currentLocation === "village") {
        if (playerChoiceNum < 1 || playerChoiceNum > 7) {
          throw "Please enter a number between 1 and 7.";
        }
        validChoice = true;

        if (playerChoiceNum <= 3) {
          move(playerChoiceNum);
        } else if (playerChoiceNum === 4) {
          showStatus();
        } else if (playerChoiceNum === 5) {
          useItem();
        } else if (playerChoiceNum === 6) {
          showHelp();
        } else if (playerChoiceNum === 7) {
          gameRunning = false;
          console.log("\nThanks for playing!");
        }
      } else if (currentLocation === "blacksmith") {
        if (playerChoiceNum < 1 || playerChoiceNum > 6) {
          throw "Please enter a number between 1 and 6.";
        }

        validChoice = true;

        if (playerChoiceNum === 1) {
          buyFromBlacksmith();
        } else if (playerChoiceNum === 2) {
          move(playerChoiceNum);
        } else if (playerChoiceNum === 3) {
          showStatus();
        } else if (playerChoiceNum === 4) {
          useItem();
        } else if (playerChoiceNum === 5) {
          showHelp();
        } else if (playerChoiceNum === 6) {
          gameRunning = false;
          console.log("\nThanks for playing!");
        }
      } else if (currentLocation === "market") {
        if (playerChoiceNum < 1 || playerChoiceNum > 6) {
          throw "Please enter a number between 1 and 6.";
        }

        validChoice = true;

        if (playerChoiceNum === 1) {
          buyFromMarket();
        } else if (playerChoiceNum === 2) {
          move(playerChoiceNum);
        } else if (playerChoiceNum === 3) {
          showStatus();
        } else if (playerChoiceNum === 4) {
          useItem();
        } else if (playerChoiceNum === 5) {
          showHelp();
        } else if (playerChoiceNum === 6) {
          gameRunning = false;
          console.log("\nThanks for playing!");
        }
      } else if (currentLocation === "forest") {
        if (choiceNum < 1 || choiceNum > 5) {
          throw "Please enter a number between 1 and 5.";
        }

        validChoice = true;

        if (choiceNum === 1) {
          move(choiceNum);
        } else if (choiceNum === 2) {
          showStatus();
        } else if (choiceNum === 3) {
          useItem();
        } else if (choiceNum === 4) {
          showHelp();
        } else if (choiceNum === 5) {
          gameRunning = false;
          console.log("\nThanks for playing!");
        }
      }
    } catch (error) {
      console.log("\nError: " + error);
      console.log("Please try again!");
    }
  }

  //Check if player died
  if (playerHealth <= 0) {
    console.log("\nGame Over! Your health reached 0.");
    gameRunning = false;
  }
}
