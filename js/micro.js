
addLayer("Microprestige", {
    name: "Microprestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "μ", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#1B8045",
    requires: new Decimal(2), // Can be a function that takes requirement increases into account
    resource: "Microprestiges", // Name of prestige currency
    baseResource: "Nanoprestiges", // Name of resource prestige is based on
    baseAmount() {return player.Nanoprestige.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1, // Prestige currency exponent
    base: 2,
    effect() {
        return player.Microprestige.points.plus(1)
    },
    effectDescription() {
        var desc;
        desc = "which are multiplying Point gain by "
        desc += format(tmp.Microprestige.effect) + "x"
        return desc
    },
    branches: ["Nanoprestige"],
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade("Nanoprestige", 24)) mult = mult.div(2)
        if (hasUpgrade("Nanoprestige", 34)) mult = mult.div(buyableEffect("Nanoprestige", 13))
        if (hasUpgrade("Nanoprestige", 43)) mult = mult.div(buyableEffect("Nanoprestige", 21))
        if (hasUpgrade("Nanoprestige", 15)) mult = mult.div(upgradeEffect("Nanoprestige", 15))
        if (hasAchievement("Miniprestige", 31)) mult = mult.div(2)
        if (hasUpgrade("Miniprestige", 13)) mult = mult.div(10)
        if (hasUpgrade("BrokenNano", 11)) mult = mult.div(buyableEffect("Nanoprestige", 31))
        if (hasUpgrade("Nanoprestige", 91)) mult = mult.div(upgradeEffect("Nanoprestige", 91))
        if (hasUpgrade("Microprestige", 52)) mult = mult.div(upgradeEffect("Nanoprestige", 91))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        mult = new Decimal(1)
        if (challengeCompletions("Nanoprestige", 11) >= 3) mult = mult.times(1.3)
        if (hasUpgrade("Nanoprestige", 53)) mult = mult.times(1.3)
        if (hasUpgrade("Microprestige", 24)) mult = mult.times(1.5)
        if (hasUpgrade("Nanoprestige", 65)) mult = mult.times(1.5)
        if (hasUpgrade("Microprestige", 41)) mult = mult.times(new Decimal(1).plus(Decimal.mul(0.02, player.Nanoprestige.upgrades.length)))
        if (hasUpgrade("BrokenNano", 21)) mult = mult.times(1.5)
        if (hasChallenge("Microprestige", 11)) mult = mult.times(1.5)
        if (hasUpgrade("Miniprestige", 22)) mult = mult.times(1.5)
        if (hasUpgrade("Nanoprestige", 86)) mult = mult.times(2)
        mult = mult.times(tmp.BrokenMicro.effect)
        return new Decimal(mult)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: ",", description: ",: Reset for Microprestiges", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    buyables: {
        11: {
            cost(x) {
                var cost
                cost = new Decimal("60").plus(Decimal.mul("5", x))
                if (x.gte(25)) cost = cost.times(Decimal.pow(1.03, Decimal.sub(x, 25)))
                if (x.gte(70)) cost = cost.times(Decimal.pow(1.05, Decimal.sub(x, 2)))
                if (x.gte(25)) cost = cost.pow(1.08)
                if (hasUpgrade("Microprestige",43)) cost = cost.div(buyableEffect("Microprestige", 12))
                if (hasUpgrade("BrokenNano",13)) cost = cost.div(buyableEffect("Nanoprestige", 13))
                return cost;
            },
            title() { return "Microbuff"},
            display() {
                var display;
                display = "Divide Nano scaling by " + format(this.effect())+"<br><br>"
                display += "Cost: "+format(this.cost()) + " Microprestiges."
                return display;
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                if (hasUpgrade("Microprestige",14)) {
                    return true
                } else return false

            },
            effect() {
                var base = new Decimal(1.06)
                if (hasUpgrade("Microprestige",34)) base = base.plus(0.03)
                let eff = new Decimal(base).pow(player[this.layer].buyables[this.id])
                return eff
            },
            
        },
        12: {
            cost(x) {
                var cost
                cost = new Decimal("340").plus(Decimal.mul("5", x))
                if (x.gte(5)) cost = cost.times(Decimal.pow(1.03, Decimal.sub(x, 5)))
                if (x.gte(10)) cost = cost.times(Decimal.pow(1.05, Decimal.sub(x, 10)))
                if (x.gte(25)) cost = cost.pow(1.08)
                return cost;
            },
            title() { return "Micromuscle"},
            display() {
                var display;
                display = "Divide buyable costs by " + format(this.effect())+"<br><br>"
                display += "Cost: "+format(this.cost()) + " Microprestiges."
                display += "<br> This buyable does not work on Nanomuscle."
                return display;
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                if (hasUpgrade("Microprestige", 43)) {
                    return true
                } else return false

            },
            effect() {
                var base = new Decimal(1.03)
                let eff = new Decimal(base).pow(player[this.layer].buyables[this.id])
                return eff
            },
            
        },
        13: {
            cost(x) {
                var cost
                cost = new Decimal("100000").plus(Decimal.mul("50000", x))
                if (x.gte(25)) cost = cost.times(Decimal.pow(1.03, Decimal.sub(x, 25)))
                if (x.gte(70)) cost = cost.times(Decimal.pow(1.05, Decimal.sub(x, 2)))
                if (x.gte(25)) cost = cost.pow(1.08)
                if (hasUpgrade("Microprestige",43)) cost = cost.div(buyableEffect("Microprestige", 12))
                if (hasUpgrade("BrokenNano",13)) cost = cost.div(buyableEffect("Nanoprestige", 13))
                return cost;
            },
            title() { return "Microgains"},
            display() {
                var display;
                display = "Multiply Nanoprestige Point gain by " + format(this.effect())+"<br><br>"
                display += "Cost: "+format(this.cost()) + " Microprestiges."
                return display;
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                if (hasUpgrade("Miniprestige", 21)) {
                    return true
                } else return false

            },
            effect() {
                var base = new Decimal(10)
                let eff = new Decimal(base).pow(player[this.layer].buyables[this.id])
                return eff
            },
            
        },
        21: {
            cost(x) {
                var cost
                cost = new Decimal("1e15").plus(Decimal.mul("5e14", x))
                cost = cost.times(Decimal.pow(1.13, x))
                if (x.gte(75)) cost = cost.times(Decimal.pow(1.12,x))
                if (hasUpgrade("Microprestige",43)) cost = cost.div(buyableEffect("Microprestige", 12))
                if (hasUpgrade("BrokenNano",13)) cost = cost.div(buyableEffect("Nanoprestige", 13))
                return cost;
            },
            title() { return "Microfracture"},
            display() {
                var display;
                display = "Multiply Microprestige Point gain by " + format(this.effect())+"<br><br>"
                display += "Cost: "+format(this.cost()) + " Microprestiges."
                return display;
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                if (player.BrokenMicro.buyables[11].plus(player.BrokenMicro.buyables[12]).plus(player.BrokenMicro.buyables[21]).plus(player.BrokenMicro.buyables[22]).gte(100)) {
                    return true
                } else return false

            },
            effect() {
                var base = new Decimal(1.25)
                let eff = new Decimal(base).pow(player[this.layer].buyables[this.id])
                return eff
            },
            
        },

    },
    challenges:{
        11: {
            name: "Microblock",
            challengeDescription: "Point gain is raised to ^1/100. Please note that entering this challenge also resets Nano upgrades, buyables, and challenges.",
            goalDescription: "2e239 points",
            canComplete: function() {return player.points.gte("2e239")},
            rewardDescription: "Nano, Micro, and Mini cost scaling are reduced. Keep Challenges and Buyables on Mini resets.",
            unlocked() {return hasUpgrade("Microprestige", 35)},
            onEnter() {
                player.Nanoprestige.upgrades = []
                player.Nanoprestige.buyables[11] = new Decimal(0)
                player.Nanoprestige.buyables[12] = new Decimal(0)
                player.Nanoprestige.buyables[13] = new Decimal(0)
                player.Nanoprestige.buyables[21] = new Decimal(0)
                player.Nanoprestige.buyables[22] = new Decimal(0)
                player.Nanoprestige.buyables[23] = new Decimal(0)
                player.Nanoprestige.buyables[31] = new Decimal(0)
                player.Nanoprestige.challenges[11] = 0
                player.Nanoprestige.challenges[12] = 0
                player.Nanoprestige.challenges[21] = 0
                player.Nanoprestige.challenges[22] = 0
            },
        },


    },
    upgrades: {
        11: {
            name: "Micropoint",
            title: "Micropoint",
            description: "Point gain is multiplied by 7.",
            cost: new Decimal(5),
            effect() {
                return player[this.layer].points.add(1);

            },
            unlocked() {return hasAchievement("Unlockers", 11)},
        },
        12: {
            name: "Micropush",
            title: "Micropush",
            description: "Nanoprestige cost is divided by 3.",
            cost: new Decimal(5),
            unlocked() {return hasAchievement("Unlockers", 11)},
        },
        13: {
            name :"Micromint",
            title: "Micromint",
            description: "Nanoprestige cost divided by Nanoprestige's effect.",
            cost: new Decimal(6),
            
            effect() {
                return tmp.Nanoprestige.effect;
            },
            effectDisplay() {return "/"+format(tmp.Nanoprestige.effect)},
            unlocked() {return hasAchievement("Unlockers", 11)},
        },
        14: {
            name:"Microhelp",
            title: "Microrecharge",
            description: "Unlock a Microprestige buyable.",
            cost: new Decimal(84),
            unlocked() {return hasUpgrade("Miniprestige", 11)}
        },
        21: {
            name:"Microgesture",
            title:"Microgesture",
            description: "Unlock a new set of Nano upgrades, and Nanoprestige effect increased ^2",
            cost: new Decimal(7),
            unlocked() {return hasAchievement("Unlockers", 13)}
        },
        22: {
            name:"Microagression",
            title:"Microagression",
            description: "Microprestiges give a bigger boost to point gain, and increase the base of Nanobuff.",
            cost: new Decimal(10),
            unlocked() {return hasAchievement("Unlockers", 15)},
            effect() {
                var eff = new Decimal(10).pow(player.Microprestige.points.plus(1))
                if (hasUpgrade("Microprestige", 31)) eff = eff.pow(2)
                if (hasUpgrade("Miniprestige", 12)) eff = eff.pow(2)
                if (eff.gte("1e1000")) {
                    eff = eff.div("1e1000")
                    eff = eff.pow(0.1)
                    eff = eff.mul("1e1000")
                }
                return eff;
            },
            effectDisplay() {
                var eff = new Decimal(10).pow(player.Microprestige.points.plus(1))
                if (hasUpgrade("Microprestige", 31)) eff = eff.pow(2)
                if (hasUpgrade("Miniprestige", 12)) eff = eff.pow(2)
                if (eff.gte("1e1000")) {
                    eff = eff.div("1e1000")
                    eff = eff.pow(0.1)
                    eff = eff.mul("1e1000")
                }
                return "x" + format(eff) + " to points";
            },

        },
        23: {
            name: "Microstrawman",
            title: "Microstrawman",
            description: "Miniprestiges give a bigger boost to point gain, and unlock new Nanoprestige upgrades.",
            cost: new Decimal(18),
            unlocked() {return hasAchievement("Unlockers", 15)},
            effect() { 
                var eff = new Decimal(1e10).pow(player.Miniprestige.points.plus(1))
                if (hasUpgrade("Microprestige", 32)) eff = eff.pow(1.3)
                if (hasUpgrade("Miniprestige", 12)) eff = eff.pow(2)
                if (hasUpgrade("Nanoprestige", 62)) eff = eff.pow(3)
                return eff;
            },
            effectDisplay() {
                var eff = new Decimal(1e10).pow(player.Miniprestige.points.plus(1))
                if (hasUpgrade("Microprestige", 32)) eff = eff.pow(1.3)
                if (hasUpgrade("Miniprestige", 12)) eff = eff.pow(2)
                return "x" + format(eff);
            }

        },
        24: {
            name: "Microexpo",
            title: "Microexpo",
            description: "Automatically Microprestige. Microprestige scaling decreased.",
            cost: new Decimal(91),
            unlocked() {return hasAchievement("Smallprestige", 12)}

        },
        31: {
            name: "Microlove",
            title: "Microlove",
            description: "Raise Microagression to ^2.",
            cost: new Decimal(30),
            unlocked() {return hasAchievement("Unlockers", 22)},
        },
        32: {
            name: "Microhate",
            title: "Microhate",
            description: "Raise Microstrawman to ^1.3, and multiply Point gain by 2401.",
            cost: new Decimal(42),
            unlocked() {return hasAchievement("Unlockers", 22)}
        },
        33: {
            name: "Microshove",
            title: "Microshove",
            description: "Multiply point gain based on Micro upgrades gained. Add new Nano upgrades.",
            cost: new Decimal(43),
            unlocked() {return hasAchievement("Unlockers", 22)},
            effect() {return new Decimal(1e3).pow(player.Microprestige.upgrades.length)},
            effectDisplay() {return "x" + format(new Decimal(1e3).pow(player.Microprestige.upgrades.length))}
        },
        34: {
            name: "Micronano",
            title: "Micronano",
            description: "Nanoprestiges no longer reset anything, gives 33% progress to breaking Nano, and improves Microbuff.",
            cost: new Decimal(152),
            unlocked() {return hasAchievement("Smallprestige", 12)}
        },
        41: {
            name: "Microfracture",
            title: "Microfracture",
            description: "Microprestige scaling is decreased based on total Nanoprestige upgrades bought. Nano is 33% more broken.",
            cost: new Decimal(164),
            unlocked() {return hasAchievement("Smallprestige", 12)}
        },
        42: {
            name: "Microshatter",
            title: "Microshatter",
            description: "Nano. Nano? N̡̅anō͙. N̠̍ā͎͔̠͉̪̉̀̕͞n̢͓̘̗̐̈̆̋͟͡ò̡̢̇.",
            cost: new Decimal(275),
            unlocked() {return hasUpgrade("Miniprestige", 12)}
        },
        43: {
            name: "Microreduction",
            title: "Microreduction",
            description: "Unlock a new buyable.",
            cost: new Decimal(349),
            unlocked() {return hasUpgrade("Miniprestige", 12)}
        },
        44: {
            name: "Microplummet",
            title: "Microplummet",
            description: "Divide Nanoprestige cost by 1e5000.",
            cost: new Decimal(829),
            unlocked() {return hasUpgrade("Miniprestige", 13)}
        },
        15: {
            name: "Microlife",
            title: "Microlife",
            description: "Improve Nanoprestige Points' formula by a small amount,.",
            cost: new Decimal(1480),
            unlocked() {return hasUpgrade("Miniprestige", 21)}
        },
        25: {
            name: "Microdeath",
            title: "Microdeath",
            description: "Unlock more Broken Nanoprestige upgrades, and multiply Nanoprestige Point gain by 1000x.",
            cost: new Decimal(1170),
            unlocked() {return hasUpgrade("Microprestige", 15)}
        },
        35: {
            name: "Micronerf",
            title: "Micronerf",
            description: "Unlock a Microprestige challenge.",
            cost: new Decimal(1972),
            unlocked() {return hasUpgrade("Microprestige", 25)}
        },
        45: {
            name: "Micron",
            title: "Micron",
            description: "Unlock new Nanoprestige upgrades. Also slightly increases Nanoprestige Point effect.",
            cost: new Decimal(3375),
            unlocked() {return hasUpgrade("Microprestige", 25)}
        },
        51: {
            name: "MicroI",
            title: "MicroI",
            description: "Divide Miniprestige cost by log(Nanoprestige Points)^1.5",
            cost: new Decimal(7967),
            unlocked() {return hasUpgrade("Miniprestige", 22)},
            effect() {
                return player.BrokenNano.points.plus(1).log10().plus(1).pow(1.5)
            },
            effectDisplay() {return format(upgradeEffect("Microprestige", 51)) + "x"}
        },
        52:  {
            name: "MicroII",
            title: "MicroII",
            description: "NanoXVI applies to Miniprestiges as well. Unlock an additional column of Nanoprestige upgrades.",
            cost: new Decimal(10035),
            unlocked() {return hasUpgrade("Miniprestige", 22)},
        },
        53: {
            name: "MicroIII",
            title: "MicroIII",
            description: "Microprestige Points boost Nanoprestige Point gain.",
            cost: new Decimal(125000),
            effect() {
                return player.BrokenMicro.points.pow(10)
            },
            effectDisplay() {return format(upgradeEffect("Microprestige", 53)) + "x"},
            unlocked() {return hasMilestone("BrokenMicro", 1)},
        },
        54: {
            name: "MicroIV",
            title: "MicroIV",
            description: "Microprestiges boost Microprestige Point gain.",
            cost: new Decimal(150000),
            effect() {
                return player.Microprestige.points.pow(1/4).plus(1)
            },
            effectDisplay() {return format(upgradeEffect("Microprestige", 54)) + "x"},
            unlocked() {return hasMilestone("BrokenMicro", 1)},
        },
        55: {
            name: "MicroV",
            title: "MicroV",
            description: "Microprestige Points increase the power of Nanoprestige Points.",
            cost: new Decimal(550000),
            effect() {
                return player.BrokenMicro.points.plus(2).log10().div(25)
            },
            effectDisplay() {return "+"+format(upgradeEffect("Microprestige", 55))},
            unlocked() {return hasMilestone("BrokenMicro", 1)},
        },
    },
    doReset(layer) {
        let keep = [];
        if (layer.row == this.row) return
        else if (layer == "Miniprestige") {
            if (hasAchievement("Miniprestige", 41)) keep.push("upgrades")
            if (hasUpgrade("Miniprestige", 11)) keep.push("upgrades")
            if (hasChallenge("Microprestige", 11)) keep.push("challenges")
            if (hasChallenge("Microprestige", 11)) keep.push("buyables")
            if (hasAchievement("Smallprestige", 21)) keep.push("upgrades")
            layerDataReset(this.layer, keep)
        } else if (layer == "Smallprestige") {
            if (hasUpgrade("Miniprestige", 11)) keep.push("upgrades")
            if (hasAchievement("Smallprestige", 21)) keep.push("upgrades")
            layerDataReset(this.layer, keep)

        }
    },
    autoPrestige() {
        return hasUpgrade("Microprestige", 24)
    },
    canBuyMax() {
        return hasUpgrade("Microprestige", 24)
    },
    automate() {
        if (hasUpgrade("Miniprestige", 21)) buyBuyable("Microprestige", 11)
        if (hasUpgrade("Miniprestige", 21)) buyBuyable("Microprestige", 12)
        if (hasUpgrade("Miniprestige", 21)) buyBuyable("Microprestige", 13)
        if (hasUpgrade("Miniprestige", 21) && player.BrokenMicro.buyables[11].plus(player.BrokenMicro.buyables[12]).plus(player.BrokenMicro.buyables[21]).plus(player.BrokenMicro.buyables[22]).gte(100)) buyBuyable("Microprestige", 21)
    },
    resetsNothing() {return hasUpgrade("Miniprestige", 22)},
    tabFormat: {
        "Upgrades": {
            content: ["main-display", "resource-display", "prestige-button", "upgrades"],
            unlocked() {return player.Miniprestige.points.gte(1)}
        },
        "Buyables": {
            content: ["main-display", "resource-display", "prestige-button", "buyables"],
            unlocked() {return hasUpgrade("Microprestige", 14)}          
        },
        "Challenges": {
            content: ["main-display", "resource-display", "prestige-button", "challenges"],
            unlocked() {return hasUpgrade("Microprestige", 35)}

        }




    },
    layerShown(){return true}
})

addLayer("BrokenMicro", {
    name: "BrokenMicro", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "Bμ", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
		points: new Decimal(0),
    }},
    color: "#FF9B55",
    requires: new Decimal(25000), // Can be a function that takes requirement increases into account
    resource: "Microprestige Points", // Name of prestige currency
    baseResource: "Microprestiges", // Name of resource prestige is based on
    baseAmount() {return player.Microprestige.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 2, // Prestige currency exponent
    passiveGeneration() {
        return 1   
    },
    effect() {
        var pow = new Decimal(2)
        if (hasMilestone("BrokenMicro", 2)) pow = pow.plus(0.2)
        return new Decimal(1).plus(Decimal.mul(0.01, player.BrokenMicro.points.plus(1).ln().pow(pow)))
    },
    effectDescription() {
        var desc;
        desc = "which are reducing Microprestige<br> cost scaling by "
        desc += format(tmp.BrokenMicro.effect) + "x"
        return desc
    },
    branches: ["Microprestige", "BrokenNano"],
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (player.BrokenMicro.buyables[11].plus(player.BrokenMicro.buyables[12]).plus(player.BrokenMicro.buyables[21]).plus(player.BrokenMicro.buyables[22]).lt(100)) mult = new Decimal(0)
        mult = mult.times(buyableEffect("Microprestige", 21))
        if (hasUpgrade("Microprestige", 54)) mult = mult.mul(upgradeEffect("Microprestige", 54))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        mult = new Decimal(1)
        return new Decimal(mult)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    tabFormat: {
        "Preparation": {
            content: ["main-display", ["bar", "break"], "buyables"],
            unlocked() {return player.BrokenMicro.buyables[11].plus(player.BrokenMicro.buyables[12]).plus(player.BrokenMicro.buyables[21]).plus(player.BrokenMicro.buyables[22]).lt(100)}

        },
        "Upgrades": {
            content: ["main-display", "resource-display", ["bar", "break"], "milestones", "upgrades"],
            unlocked() {return player.BrokenMicro.buyables[11].plus(player.BrokenMicro.buyables[12]).plus(player.BrokenMicro.buyables[21]).plus(player.BrokenMicro.buyables[22]).gte(100)}
        },
    },
    bars: {
        break: {
            direction: RIGHT,
            width:200,
            height:10,
            progress() {
                var prog = new Decimal(0)
                prog = prog.plus(buyableEffect("BrokenMicro", 11))
                prog = prog.plus(buyableEffect("BrokenMicro", 12))
                prog = prog.plus(buyableEffect("BrokenMicro", 21))
                prog = prog.plus(buyableEffect("BrokenMicro", 22))
                return prog;
            },
            unlocked() {return hasAchievement("Smallprestige", 41)}
        }
    },
    doReset(layer) {
        let keep = [];
        keep.push("buyables")
        if (layer.row == this.row) return
        else if (layer == "Miniprestige") {
            if (hasMilestone("BrokenMicro", 0)) keep.push("milestones")
            if (hasMilestone("BrokenMicro", 0)) keep.push("points")
            if (hasMilestone("BrokenMicro", 1)) keep.push("upgrades")
            layerDataReset(this.layer, keep)

        } else if (layer == "Smallprestige") {
            layerDataReset(this.layer, keep)


        }
    },
    milestones:{
        0: {
            requirementDescription: "1250 Microprestige Points",
            done() {return player.BrokenMicro.points.gte(1250)},
            effectDescription: "Keep Broken Microprestige milestones and points on Mini resets."
        },
        1: {
            requirementDescription: "15,000 Microprestige Points",
            done() {return player.BrokenMicro.points.gte(15000)},
            effectDescription: "Unlock a new Nanoprestige buyable, but it doesn't autobuy."
        },
        2: {
            requirementDescription: "1e30 Microprestige Points",
            done() {return player.BrokenMicro.points.gte(1e30)},
            effectDescription: "Slightly increase the power of Microprestige Points."
        }
        
    },
    buyables: {
        11: {
            cost(x) {
                var cost
                cost = new Decimal("11").pow(x)
                return cost;
            },
            title() { return "Nanoprestige Influence"},
            display() {
                var display;
                display = "Break Microprestige by " + format(this.effect().times(100))+"%<br><br>"
                display += "Cost: "+format(this.cost()) + " Nanoprestiges."
                return display;
            },
            canAfford() { return player.Nanoprestige.points.gte(this.cost()) },
            buy() {
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                if (hasAchievement("Smallprestige", 41)) {
                    return true
                } else return false

            },
            effect() {
                return new Decimal(0.01).mul(player[this.layer].buyables[this.id])
            },
            
        },
        12: {
            cost(x) {
                var cost
                cost = new Decimal("1e100").pow(x)
                return cost;
            },
            title() { return "Nanoprestige Point Influence"},
            display() {
                var display;
                display = "Break Microprestige by " + format(this.effect().times(100))+"%<br><br>"
                display += "Cost: "+format(this.cost()) + " Nanoprestige Points."
                return display;
            },
            canAfford() { return player.BrokenNano.points.gte(this.cost()) },
            buy() {
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                if (hasAchievement("Smallprestige", 41)) {
                    return true
                } else return false

            },
            effect() {
                return new Decimal(0.01).mul(player[this.layer].buyables[this.id])
            },
            
        },
        21: {
            cost(x) {
                var cost
                cost = new Decimal("3").pow(x)
                return cost;
            },
            title() { return "Microprestige Influence"},
            display() {
                var display;
                display = "Break Microprestige by " + format(this.effect().times(100))+"%<br><br>"
                display += "Cost: "+format(this.cost()) + " Microprestiges."
                return display;
            },
            canAfford() { return player.Microprestige.points.gte(this.cost()) },
            buy() {
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                if (hasAchievement("Smallprestige", 41)) {
                    return true
                } else return false

            },
            effect() {
                return new Decimal(0.01).mul(player[this.layer].buyables[this.id])
            },
            
        },
        22: {
            cost(x) {
                var cost
                cost = new Decimal("2").pow(x)
                return cost;
            },
            title() { return "Miniprestige Influence"},
            display() {
                var display;
                display = "Break Microprestige by " + format(this.effect().times(100))+"%<br><br>"
                display += "Cost: "+format(this.cost()) + " Miniprestiges."
                return display;
            },
            canAfford() { return player.Miniprestige.points.gte(this.cost()) },
            buy() {
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                if (hasAchievement("Smallprestige", 41)) {
                    return true
                } else return false

            },
            effect() {
                return new Decimal(0.01).mul(player[this.layer].buyables[this.id])
            },
            
        },
    },
    layerShown(){
        return hasAchievement("Smallprestige", 41)}
})