let modInfo = {
	name: "Falling Mountain's AlterPrestige",
	id: "stolenIdea",
	author: "Falling Mountain, original by Makiki99",
	pointsName: "points",
	modFiles: ["nano.js", "tree.js", "micro.js", "mini.js", "small.js", "partial.js", "achievements.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (0), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.3.1",
	name: "The Great Rebalance",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>Ping @Falling Mountain#4706 on discord to report bugs!</h3><br>
	<h3>v0.3.1</h3><br>
		Pre-Smallprestige:<br>
		- Upgrades have changed:
		- Most have reduced costs, and changed effects.
		- Buyables now have much different cost scalings.
		- 2nd (Nano) buyable now increases in power every time you gain an upgrade.
		- 3rd buyable buffed.
		- 4th buyable increases the power of the 3rd buyable.
		- Challenges can now be completed multiple times for extra rewards.
	<h3>v0.3b</h3><br>
		- Fixed upgrade problems from last hotfix.<br><br>
	<h3>v0.3a</h3><br>
		- Colors of Microprestige and Smallprestige changed to remove confusion with unpurchasable things<br>
		- Broken Microprestige starts with subtab of "preparation" open.<br>
		- Next update will deal with other complaints<br><br>
	<h3>v0.3</h3><br>
		- New Partial Prestige and Broken Microprestige layers.<br>
		- Current endgame at 1 Partial Prestige.<br>
		- New achievements<br>
		- New upgrades<br>
		- Fixed a bug where the bar showing progress to Broken Nanoprestige could only reach 99%<br>
		- Inflation... sorta?<br><br>
	<h3>v0.2.1 (Indev)</h3><br>
		- New layer added, Broken Nanoprestige.<br>
		- Current endgame at 2 Small Prestiges.<br>
		- 5 Small achievements<br>
		- 5 new Nano upgrades<br>
		- 2 new Nano buyables<br>
		- 7 new Micro upgrades<br>
		- 3 new Mini upgrades<br>
		- You can get a ton more Nanoprestiges now.<br><br>
	<h3>v0.2 (Indev)</h3><br>
		- Added new prestige layer, Small Prestiges.<br>
		- Current endgame at 1 Small Prestige.<br>
		- 4 normal achievements<br>
		- 16 Mini achievements<br>
		- 5 new Nano upgrades<br>
		- 1 new Nano buyable<br>
		- 3 new Micro upgrades<br>
		- 1 new Mini upgrade<br><br>
	<h3>v0.1 (Indev)</h3><br>
		- Added first 3 prestige layers.<br>
		- Current endgame at 3 Miniprestiges.`

let winText = `You've done enough prestiging for now. Why not take a break?`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(1)
	gain = gain.times(tmp.Nanoprestige.effect)
	if (hasUpgrade("Nanoprestige", 11)) gain = gain.times(7)
	if (hasUpgrade("Nanoprestige", 12)) gain = gain.times(7)
	if (hasUpgrade("Nanoprestige", 21)) gain = gain.times(7)
	if (hasUpgrade("Nanoprestige", 22)) gain = gain.times(7)
	if (hasUpgrade("Nanoprestige", 13)  && !inChallenge("Nanoprestige", 12)) gain = gain.times(buyableEffect("Nanoprestige", 11))
	if (hasUpgrade("Nanoprestige", 33)  && !inChallenge("Nanoprestige", 12)) gain = gain.times(buyableEffect("Nanoprestige", 12))
	if (hasUpgrade("Nanoprestige", 31)) gain = gain.times(7)
	if (hasUpgrade("Nanoprestige", 32)) gain = gain.times(7)
	if (hasUpgrade("Nanoprestige", 24)) gain = gain.times(7)
	if (hasUpgrade("Nanoprestige", 45)) gain = gain.times(7)
	if (hasUpgrade("Nanoprestige", 64)) gain = gain.times(upgradeEffect("Nanoprestige", 64))
	gain = gain.times(tmp.Microprestige.effect)
	if (hasUpgrade("Microprestige", 11)) gain = gain.times(7)
	if (hasUpgrade("Microprestige", 22)) gain = gain.times(upgradeEffect("Microprestige", 22))
	if (hasUpgrade("Microprestige", 23)) gain = gain.times(upgradeEffect("Microprestige", 23))
	if (hasUpgrade("Microprestige", 31)) gain = gain.times(7)
	if (hasUpgrade("Microprestige", 32)) gain = gain.times(2401)
	if (hasUpgrade("Microprestige", 33)) gain = gain.times(upgradeEffect("Microprestige", 33))
	if (hasUpgrade("Microprestige", 14)) gain = gain.times(buyableEffect("Microprestige", 11))
	gain = gain.times(tmp.Miniprestige.effect)
	if (hasAchievement("Miniprestige", 31)) gain = gain.times(7)
	if (hasAchievement("Miniprestige", 31)) gain = gain.times(7)
	if (hasAchievement("Smallprestige", 11)) gain = gain.times(Decimal.pow("1e25", player.Smallprestige.points.plus(1)))
	if (hasChallenge("Nanoprestige", 11)) gain = gain.pow(1.1)
	//if (hasChallenge("Nanoprestige", 21)) gain = gain.pow(1.1)
	if (hasUpgrade("Nanoprestige", 75)) gain = gain.pow(1.15)
	if (inChallenge("Nanoprestige", 11)) gain = gain.pow(0.1)
	if (gain.gte("1e10000")) {
		gain = gain.div("1e10000")
		gain = gain.pow(0.9)
		gain = gain.mul("1e10000")
	}
	if (gain.gte("1e50000")) {
		gain = gain.div("1e50000")
		gain = gain.pow(0.5)
		gain = gain.mul("1e50000")
	}
	if (gain.gte("1e100000")) {
		gain = gain.div("1e100000")
		gain = gain.pow(0.5)
		gain = gain.mul("1e100000")
	}
	if (gain.gte("1e150000")) {
		gain = gain.div("1e150000")
		gain = gain.pow(0.5)
		gain = gain.mul("1e150000")
	}
	if (gain.gte("1e200000")) {
		gain = gain.div("1e200000")
		gain = gain.pow(0.25)
		gain = gain.mul("1e200000")
	}
	if (gain.gte("1e250000")) {
		gain = gain.div("1e250000")
		gain = gain.pow(0.25)
		gain = gain.mul("1e250000")
	}
	if (gain.gte("1e300000")) {
		gain = gain.div("1e300000")
		gain = gain.pow(0.25)
		gain = gain.mul("1e300000")
	}
	if (gain.gte("1e350000")) {
		gain = gain.div("1e350000")
		gain = gain.pow(0.25)
		gain = gain.mul("1e350000")
	}
	if (gain.gte("1e400000")) {
		gain = gain.div("1e400000")
		gain = gain.pow(0.10)
		gain = gain.mul("1e400000")
	}
	if (gain.gte("1e450000")) {
		gain = gain.div("1e450000")
		gain = gain.pow(0.10)
		gain = gain.mul("1e450000")
	}
	if (gain.gte("1e500000")) {
		gain = gain.div("1e500000")
		gain = gain.pow(0.10)
		gain = gain.mul("1e500000")
	}
	if (gain.gte("1e550000")) {
		gain = gain.div("1e550000")
		gain = gain.pow(0.10)
		gain = gain.mul("1e550000")
	}
	if (gain.gte("1ee6")) {
		gain = gain.div("1ee6")
		gain = gain.pow(0.1)
		gain = gain.mul("1ee6")
	}
	if (gain.gte("1e2.5e6")) {
		gain = gain.div("1e2.5e6")
		gain = gain.pow(0.01)
		gain = gain.mul("1e2.5e6")
	}
	if (inChallenge("Microprestige", 11)) gain = gain.pow(0.01)
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [

]

// Determines when the game "ends"
function isEndgame() {
	return player.Miniprestige.points.gte(new Decimal(4))
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){

}