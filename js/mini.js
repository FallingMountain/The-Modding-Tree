
addLayer("Miniprestige", {
    name: "Miniprestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "M", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#FFFFFF",
    requires: new Decimal(3), // Can be a function that takes requirement increases into account
    resource: "Miniprestiges", // Name of prestige currency
    baseResource: "Microprestiges", // Name of resource prestige is based on
    baseAmount() {return player.Microprestige.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1, // Prestige currency exponent
    base: 3,
    effect() {
        return player.Miniprestige.points.plus(1)
    },
    effectDescription() {
        var desc;
        desc = "which are multiplying Point gain by "
        desc += format(tmp.Miniprestige.effect) + "x"
        return desc
    },
    branches: ["Microprestige"],
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade("BrokenNano", 11)) mult = mult.div(buyableEffect("Nanoprestige", 31))
        if (hasUpgrade("Microprestige", 51)) mult = mult.div(upgradeEffect("Microprestige", 51))
        if (hasUpgrade("Microprestige", 52)) mult = mult.div(upgradeEffect("Nanoprestige", 91))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade("Nanoprestige", 65)) mult = mult.times(1.2)
        if (hasChallenge("Microprestige", 11)) mult = mult.times(1.2)
        if (hasUpgrade("Nanoprestige", 56)) mult = mult.times(1.47189)
        return new Decimal(mult)
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "m", description: "m: Reset for Miniprestiges", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    
    upgrades: {
        11: {
            name: "Minirelax",
            title: "Minirelax",
            description: "You no longer lose Nanoprestige upgrades on Small resets. Nanoprestige buyable autobuyers unlocked.",
            cost: new Decimal(4),
            unlocked() {return hasAchievement("Smallprestige",11)}
        },
        12: {
            name: "Miniforce",
            title: "Miniforce",
            description: "Square Microagression and Microstrawman. Break Nano by an additional 33%.",
            cost: new Decimal(5),
            unlocked() {return hasAchievement("Smallprestige", 11)}
        },
        13: {
            name: "Minishark",
            title: "Minishark",
            description: "Unlock some Broken Nanoprestige upgrades. Divide Microprestige cost by 10.",
            cost: new Decimal(7),
            unlocked() {return hasUpgrade("Microprestige", 42)}
        },
        21: {
            name: "Miniplead",
            title: "Miniplead",
            description: "Autobuy Microprestige buyables, and unlock a new one.",
            cost: new Decimal(17),
            unlocked() {return hasAchievement("Smallprestige", 21)}
        },
        22: {
            name: "Minirelief",
            title: "Minirelief",
            description: "Microprestige no longer resets anything, and its scaling is decreased.",
            cost: new Decimal(71),
            unlocked() {return hasAchievement("Smallprestige", 31)}
        },
        23: {
            name: "Miniexplode",
            title: "Miniexplode",
            description: "MicroV also boosts the Nanoprestige Point gain exponent.",
            cost: new Decimal(511),
            unlocked() {return hasMilestone("BrokenMicro", 1)}
        }
    },
    achievements:{
        11: {
            name: "To begin (for real this time)",
            done() {return player.Miniprestige.points.gte(1)},
            tooltip: "Miniprestige for the first time. Unlocks the Upgrade subtab on all layers."
        },
        12: {
            name: "Possibly capitalism",
            done() {return hasUpgrade("Nanoprestige", 11)},
            tooltip: "Get the first Nanoprestige upgrade."
        },
        13: {
            name: "Upgrade after upgrade",
            done() {return hasUpgrade("Nanoprestige", 22)},
            tooltip: "Get the fourth Nanoprestige upgrade."
        },
        14: {
            name: "Definitely capitalism",
            done() {return hasUpgrade("Nanoprestige", 13)},
            tooltip: "Unlock the first Nanoprestige buyable."
        },
        21: {
            name: "Dynamic upgrades",
            done() {return hasUpgrade("Microprestige", 13)},
            tooltip: "Get the third Microprestige upgrade. You now keep Nanoprestige upgrades on Microprestige resets."
        },
        23: {
            name: "Not so nano",
            done() {return hasUpgrade("Nanoprestige", 34)},
            tooltip: "Get the 12th Nanoprestige upgrade."
        },
        22: {
            name: "3x3",
            done() {return hasUpgrade("Nanoprestige", 33)},
            tooltip: "Get the first 9 Nanoprestige upgrades.",

        },
        24: {
            name: "μ's",
            done() {return player.Microprestige.points.gte(9)},
            tooltip: "Get 9 Microprestiges."
        },
        31: {
            name: "Put in the effort",
            done() {return player.Miniprestige.points.gte(2)},
            tooltip: "Get 2 Miniprestiges. Multiplies point gain by 49, divides Microprestige requirement by 2, and adds new upgrades."
        },
        32: {
            name: "Effortless",
            done() {return hasUpgrade("Microprestige", 22)},
            tooltip: "Buy the fifth Microprestige upgrade. This achievement used to be harder to get, but I had to remove some Miniprestige upgrades."
        },
        34: {
            name: "Not so micro",
            done() {return hasUpgrade("Microprestige", 23)},
            tooltip: "Buy the sixth Microprestige upgrade."
        },
        33: {
            name: "Slightly challenged",
            done() {return hasChallenge("Nanoprestige", 12)},
            tooltip: "Complete Muckraking"
        },
        41: {
            name: "Prefacing conclusions",
            done() {return player.Miniprestige.points.gte(3)},
            tooltip: "Get 3 Miniprestiges. You now keep Micro upgrades on Miniprestige."

        },
        43: {
            name: "Buy and rebuy",
            done() {return player.Nanoprestige.points.gte(4000)},
            tooltip: "Get 4000 Nanoprestiges."
        },
        44: {
            name: "Life, the Universe, and Everything",
            done() {return player.Microprestige.points.gte(42)},
            tooltip: "Get 42 Microprestiges."
        },
        42: {
            name: "Infinity?",
            done() {return player.points.gte("1.79e308")},
            tooltip: "Get over 1.79e308 points."
        },
    },
    canBuyMax() {
        return hasAchievement("Smallprestige", 41)
    },
    tabFormat: {
        "Upgrades": {
            content: ["main-display", "resource-display", "prestige-button", "upgrades"],
            unlocked() {return player.Miniprestige.points.gte(1)}
        },
        "Buyables": {
            content: ["main-display", "resource-display", "prestige-button", "buyables"],
            unlocked() {return false}          
        },
        "Challenges": {
            content: ["main-display", "resource-display", "prestige-button", "challenges"],
            unlocked() {return false}

        },
        "Achievements": {
            content: ["main-display", "resource-display", "achievements"],
            unlocked() {return player.Miniprestige.points.gte(1)}

        }
    },
    doReset(layer) {
        let keep = [];
        keep.push("achievements")
        if (layer.row == this.row) return
        else if (layer == "Smallprestige") {
            if (hasUpgrade("Smallprestige", 21)) keep.push("upgrades")
            layerDataReset(this.layer, keep)
        }
        else if (layer == "Partialprestige") {
            layerDataReset(this.layer, keep)
        }
    },
    layerShown(){
        return player.Microprestige.best.gte(1) || player.Miniprestige.best.gte(1) || player. Smallprestige.best.gte(1)}
})
