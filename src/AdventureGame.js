// ===========================================
// The Dragon's Quest - Text Adventure Game
// A progression-based learning project
// ===========================================

// Use Node.js built-in readline instead of readline-sync
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Helper function to replace readline.question
function askQuestion(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

// Player stats - Item flags
let playerName = "";
let playerHealth = 100;
let playerGold = 20;
let currentLocation = "village";
let gameRunning = true;
let isFirstVisit = true;

// Weapon damage-Combat-related values
let weaponDamage = 0;
let monsterDefense = 5;
let healingPotionValue = 30;

// =========================================
// START Lab: Inventory System
// =========================================
const healthPotion = {
  name: "Health Potion",
  type: "potion",
  value: 5,
  effect: 30,
  description: "Restore 30 health points",
};
const sword = {
  name: "Sword",
  type: "weapon",
  value: 10,
  effect: 10,
  description: "A sturdy blade for combat",
};
const steelSword = {
  name: "Steel Sword",
  type: "weapon",
  value: 25,
  effect: 20,
  description: "A sharp, well-forged blade dealing heavy damage",
};
const shield = {
  name: "Wooden Shield",
  type: "armor",
  value: 8,
  effect: 5,
  description: "Reduces damage taken in combat",
};
const ironShield = {
  name: "Iron Shield",
  type: "armor",
  value: 20,
  effect: 12,
  description: "A sturdy shield offering strong protection",
};

let inventory = []; // Will store all player items

// ---------- Functions ----------

function showStatus() {
  console.log(`\n--- ${playerName}'s Stats ---`);
  console.log(`Health: ${playerHealth}`);
  console.log(`Gold: ${playerGold}`);
  console.log(`Location: ${currentLocation}`);

  console.log("Inventory :");
  if (inventory.length === 0) {
    console.log("Nothing in inventory");
  } else {
    inventory.forEach((item, index) => {
      console.log("" + (index + 1) + "." + item.name);
    });
  }
}

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
    console.log("1: Buy Sword (" + sword.value + " gold)");
    console.log("2: Buy Steel Sword (" + steelSword.value + " gold)");
    console.log("3: Return to village");
    console.log("4: Check status");
    console.log("5: Use Item");
    console.log("6: Help");
    console.log("7: Quit Game");
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
      "The forest is dark and foreboding. You hear strange noises all around you. ",
    );
    console.log("\nWhat would you like to do?");
    console.log("1: Return to village");
    console.log("2: Check status");
    console.log("3: Use Item");
    console.log("4: Help");
    console.log("5: Quit Game");
  }
}

function move(playerChoiceNum) {
  let validMove = false;
  if (currentLocation === "village") {
    if (playerChoiceNum === 1) {
      currentLocation = "blacksmith";
      console.log("\nYou enter the blacksmith's shop");
      validMove = true;
    } else if (playerChoiceNum === 2) {
      currentLocation = "market";
      console.log("\nYou enter the market");
      validMove = true;
    } else if (playerChoiceNum === 3) {
      currentLocation = "forest";
      validMove = true;

      if (hasGoodEquipment()) {
        console.log("\nDeep in the forest, you sense a powerful presence...");
        console.log("The dragon has emerged from its lair!");
        if (!handleCombat(true)) {
          currentLocation = "village";
        } else {
          gameRunning = false; // player won the game!
          console.log(
            "\n🏆 You have completed your quest! Thanks for playing!",
          );
        }
      } else {
        console.log("\nYou entered the forest...");
        console.log("\nA monster appears!");
        if (!handleCombat(false)) {
          currentLocation = "village";
        }
      }
    }
  } else if (currentLocation === "blacksmith") {
    if (playerChoiceNum === 3) {
      currentLocation = "village";
      console.log("\nYou enter the village");
      validMove = true;
    }
  } else if (currentLocation === "market") {
    if (playerChoiceNum === 2) {
      currentLocation = "village";
      console.log("\nYou return to the village");
      validMove = true;
    }
  } else if (currentLocation === "forest") {
    if (playerChoiceNum === 1) {
      currentLocation = "village";
      console.log("\nYou return to the village");
      validMove = true;
    }
  }
  return validMove;
}

function hasItemType(type) {
  return inventory.some((item) => item.type === type);
}

function handleCombat(isDragon = false) {
  let monsterDamage = isDragon ? 20 : 10;
  let monsterHealth = isDragon ? 50 : 20;

  if (isDragon) {
    console.log("\n🐉 The DRAGON rises before you! This is the final battle!");
  } else {
    console.log("\nA monster appears!");
  }

  let bestWeapon = getBestItem("weapon");
  let bestArmor = getBestItem("armor");

  if (bestWeapon) {
    console.log(
      "You ready your " +
        bestWeapon.name +
        " (damage: " +
        bestWeapon.effect +
        ")",
    );
  } else {
    console.log("You have no weapon!");
  }

  if (bestArmor) {
    console.log(
      "You brace behind your " +
        bestArmor.name +
        " (protection: " +
        bestArmor.effect +
        ")",
    );
  } else {
    console.log("You have no armor!");
  }

  if (
    isDragon &&
    (!bestWeapon || bestWeapon.name !== "Steel Sword" || !bestArmor)
  ) {
    console.log("\nYour equipment isn't strong enough to face the dragon!");
    console.log("Without a weapon, you must retreat!");
    updateHealth(-monsterDamage);
    return false;
  }

  if (!bestWeapon) {
    console.log("Without a weapon, you must retreat!");
    updateHealth(-monsterDamage);
    return false;
  }

  let armorReduction = bestArmor ? bestArmor.effect : 0;
  let damageTaken = monsterDamage - armorReduction;
  if (damageTaken < 1) {
    damageTaken = 1;
  }

  console.log("\nYou attack with your " + bestWeapon.name + "!");
  console.log("You deal " + bestWeapon.effect + " damage!");

  if (bestArmor) {
    console.log(
      "Your " + bestArmor.name + " absorbs " + armorReduction + " damage!",
    );
  }
  console.log("You take " + damageTaken + " damage from the monster!");

  updateHealth(-damageTaken);

  if (isDragon) {
    console.log("\n🎉 VICTORY! You have defeated the dragon!");
    playerGold += 100;
  } else {
    console.log("\nVictory! You found 10 gold!");
    playerGold += 10;
  }

  return true;
}

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

async function useItem() {
  if (inventory.length === 0) {
    console.log("\nYou have no items!");
    return false;
  }

  console.log("\n=== Inventory ===");
  inventory.forEach((item, index) => {
    console.log(index + 1 + ". " + item.name);
  });

  let choice = await askQuestion("Use which item? (number or 'cancel'): ");
  if (choice === "cancel") return false;

  let index = parseInt(choice) - 1;
  if (index >= 0 && index < inventory.length) {
    let item = inventory[index];

    if (item.type === "potion") {
      console.log("\nYou drink the " + item.name + ".");
      updateHealth(item.effect);
      inventory.splice(index, 1);
      console.log("Health restored to: " + playerHealth);
      return true;
    } else if (item.type === "weapon") {
      console.log("\nYou ready your " + item.name + " for battle.");
      return true;
    }
  } else {
    console.log("\nInvalid item number!");
  }
  return false;
}

function checkInventory() {
  console.log("\n=== INVENTORY ===");
  if (inventory.length === 0) {
    console.log("You're inventory is empty");
    return;
  }
  inventory.forEach((item, index) => {
    console.log("" + (index + 1) + "" + item.name);
  });
}

function buyFromBlacksmith(weaponType) {
  let itemToBuy = weaponType === "steel" ? steelSword : sword;

  if (playerGold >= itemToBuy.value) {
    console.log("\nBlacksmith : 'A fine blade for a brave adventurer !' ");
    playerGold -= itemToBuy.value;
    inventory.push({ ...itemToBuy });
    console.log(
      "You bought a " + itemToBuy.name + " for " + itemToBuy.value + " gold!",
    );
    console.log("Gold Remaining " + playerGold);
  } else {
    console.log("\nBlacksmith : 'come back when you have more gold ! ' ");
  }
}

function buyFromMarket() {
  if (playerGold >= healthPotion.value) {
    console.log("\nMerchant : 'This portion will heal your wounds !'");
    playerGold -= healthPotion.value;
    inventory.push({ ...healthPotion });
    console.log(
      "You bought a " +
        healthPotion.name +
        " for " +
        healthPotion.value +
        " gold!",
    );
    console.log("Gold remaining : " + playerGold);
  } else {
    console.log("\nMerchant:'No gold , no potion !'");
  }
}

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

function getItemsByType(type) {
  return inventory.filter((item) => item.type === type);
}

function getBestItem(type) {
  let items = getItemsByType(type);
  if (items.length === 0) {
    return null;
  }

  let best = items[0];
  for (let i = 1; i < items.length; i++) {
    if (items[i].effect > best.effect) {
      best = items[i];
    }
  }
  return best;
}

function hasGoodEquipment() {
  let bestWeapon = getBestItem("weapon");
  let hasArmorPiece = getItemsByType("armor").length > 0;
  let hasSteelSword = bestWeapon !== null && bestWeapon.name === "Steel Sword";
  return hasSteelSword && hasArmorPiece;
}

//====================================
// ---------- Main game loop ----------
//====================================

async function mainGameLoop() {
  console.log("=================================");
  console.log("       The Dragon's Quest        ");
  console.log("=================================");
  console.log("\nYour quest: Defeat the dragon in the mountains!");

  // Get player's name
  playerName = await askQuestion("\nWhat is your name, adventurer? ");
  console.log(`Welcome, ${playerName}, to the Adventure Game!`);
  console.log("Prepare yourself for an epic journey!");

  while (gameRunning) {
    showLocation();

    let validChoice = false;
    while (!validChoice) {
      try {
        let choice = await askQuestion("\nEnter choice number: ");

        // Handle the autograder running out of inputs
        if (choice === undefined || choice === null) {
          gameRunning = false;
          break;
        }

        if (choice.trim() === "") {
          throw "Please enter a number!";
        }

        let playerChoiceNum = parseInt(choice);
        if (isNaN(playerChoiceNum)) {
          throw "That's not a number! Please enter a number.";
        }

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
            await useItem();
          } else if (playerChoiceNum === 6) {
            showHelp();
          } else if (playerChoiceNum === 7) {
            gameRunning = false;
            console.log("\nThanks for playing!");
          }
        } else if (currentLocation === "blacksmith") {
          if (playerChoiceNum < 1 || playerChoiceNum > 7) {
            throw "Please enter a number between 1 and 7.";
          }

          validChoice = true;

          if (playerChoiceNum === 1) {
            buyFromBlacksmith("sword");
          } else if (playerChoiceNum === 2) {
            buyFromBlacksmith("steel");
          } else if (playerChoiceNum === 3) {
            move(playerChoiceNum);
          } else if (playerChoiceNum === 4) {
            showStatus();
          } else if (playerChoiceNum === 5) {
            await useItem();
          } else if (playerChoiceNum === 6) {
            showHelp();
          } else if (playerChoiceNum === 7) {
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
            await useItem();
          } else if (playerChoiceNum === 5) {
            showHelp();
          } else if (playerChoiceNum === 6) {
            gameRunning = false;
            console.log("\nThanks for playing!");
          }
        } else if (currentLocation === "forest") {
          if (playerChoiceNum < 1 || playerChoiceNum > 5) {
            throw "Please enter a number between 1 and 5.";
          }

          validChoice = true;

          if (playerChoiceNum === 1) {
            move(playerChoiceNum);
          } else if (playerChoiceNum === 2) {
            showStatus();
          } else if (playerChoiceNum === 3) {
            await useItem();
          } else if (playerChoiceNum === 4) {
            showHelp();
          } else if (playerChoiceNum === 5) {
            gameRunning = false;
            console.log("\nThanks for playing!");
          }
        }
      } catch (error) {
        console.log("\nError: " + error);
        console.log("Please try again!");
      }
    }

    if (playerHealth <= 0) {
      console.log("\nGame Over! Your health reached 0.");
      gameRunning = false;
    }
  }

  rl.close(); // Close the readline interface when done
}

// Start the game
mainGameLoop();
