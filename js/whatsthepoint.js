addLayer("wtpNano", {
    name: "wtpNano", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "N", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
        hiddenRows: 0,
        corruptionTick:new Decimal(0),
        corruption:0,
        pageNumber:new Decimal(1),
    }},
    color: "#5BCEFA",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "Nanoprestige Points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.666, // Prestige currency exponent
    passiveGeneration() {
        if (hasUpgrade("wtpNano", 23)) return 0.01
        else return 0

    },
    effect() {
        var eff = player.wtpNano.points.plus(1)
        if (eff.gt("1e5")) {
            eff = eff.div("1e5").pow(1/2).times("1e5")
        }
        if (eff.gt("1e25")) {
            eff = eff.div("1e25").pow(1/2).times("1e25")
        }
        return eff
    },
    effectDescription() {
        var desc;
        desc = "which are multiplying Point gain by "
        desc += format(tmp.wtpNano.effect) + "x"

        return desc
    },
    base() {
        base = 1.5
        return base
    } ,
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade("wtpMicro", 12)) mult = mult.times(3)
        if (hasUpgrade("wtpMicro", 21)) mult = mult.times(upgradeEffect("wtpMicro", 21))
        if (hasUpgrade("wtpNano", 33)) mult = mult.times(upgradeEffect("wtpNano", 33))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        mult = new Decimal(1)

        return mult
    },
    directMult() {
        mult = new Decimal(1)
        
        return mult

    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    upgrades: {
        11: {
            name: "Nanopoint",
            title: "Nanopoint",
            description: "Point gain is multiplied by 7.",
            cost: new Decimal(13),
            unlocked() {return hasAchievement("Unlockers", 11)},
            
        },
        12: {
            name: "Nanopush",
            title: "Nanopush",
            description: "Point gain is multiplied by 7.",
            cost: new Decimal(90),
            unlocked() {return hasAchievement("Unlockers", 11)},
        },
        13: {
            name: "Nanobuy",
            title: "Nanobuy",
            description: "Unlock a Nanoprestige buyable.",
            cost: new Decimal(1e7),
            unlocked() {return hasAchievement("Unlockers", 12)},

        },
        21: {
            name: "Nanoclick",
            title: "Nanoclick",
            description: "Point gain is multiplied by 7.",
            cost: new Decimal(48500),
            unlocked() {
                if (hasUpgrade("Microprestige", 34) && player.Nanoprestige.corruption >= 0.9) return false
                else return hasAchievement("Unlockers", 11) && (player.Nanoprestige.pageNumber.equals(1) || player.tab != "Nanoprestige")
            
            },
        },
        22: {
            name: "Nanoshove",
            title: "Nanoshove",
            description: "Point gain is multiplied by 7.",
            cost: new Decimal(1200000),
            unlocked() {return hasAchievement("Unlockers", 11) && (player.Nanoprestige.pageNumber.equals(1) || player.tab != "Nanoprestige")},

        },
        23: {
            name: "Nanosell",
            title: "Nanosell",
            description: "You gain 1% of the Nanoprestige Point gain on reset per second.",
            cost: new Decimal(5e8),
            unlocked() {
                if (hasUpgrade("Microprestige", 34) && player.Nanoprestige.corruption >= 0.6) return false
                else return hasAchievement("Unlockers", 12) && (player.Nanoprestige.pageNumber.equals(1) || player.tab != "Nanoprestige")
            },

        },
        31: {
            name: "nano love",
            title: "nano love",
            description: "multiply point gain by log10(7) + 1 for every unlocker you have",
            cost: new Decimal(1e14),
            effect() {
                return Decimal.pow(1.84, player.Unlockers.achievements.length)
            },
            effectDisplay() {return format(upgradeEffect("wtpNano", 31)) + "x"},
            unlocked() {
                return hasAchievement("Unlockers", 64)
            },
        },
        32: {
            name: "Gravitation",
            title: "Gravitation",
            description: "Increase base of Nanobuff based on how many Unlockers you have, & buy it automagically",
            cost: new Decimal(1e50),
            effect() {
                return Decimal.mul(0.01, player.Unlockers.achievements.length)
            },
            effectDisplay() {return "+" + format(upgradeEffect("wtpNano", 32))},
            unlocked() {
                return hasAchievement("Unlockers", 64)
            },
        },
        33: {
            name: "Stasis",
            title: "Stasis",
            description: "Increase Nanoprestige Point gain based on Microprestige effect",
            cost: new Decimal(1e65),
            effect() {
                return Decimal.pow(tmp.wtpMicro.effect, 1/1.75)
            },
            effectDisplay() {return format(upgradeEffect("wtpNano", 33)) + "x"},
            unlocked() {
                return hasAchievement("Unlockers", 64)
            },
        },
    },
    automate() {
        if (hasUpgrade("wtpNano",32)) buyBuyable("wtpNano", 11)
    },
    buyables: {
        11: {
            cost(x) {
                var cost;
                cost = new Decimal(3500).times(Decimal.pow(1.3, x.pow(1.45)))
                return cost
            },
            title() { return "Nanobuff"},
            display() {
                var display;
                display = "Multiply Point gain by " + format(tmp.wtpNano.buyables[11].effect)+"x<br>"
                display += "Cost: "+ format(tmp.wtpNano.buyables[11].cost)
                return display;
            },
            canAfford() { 
                return (player[this.layer].points.gte(this.cost()) && player.wtpNano.buyables[11].lt(5000))
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost(player.wtpNano.buyables[11]))
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                if (hasUpgrade("wtpNano",13)) {
                    return true
                } else return false

            },
            effect() {
                var base = new Decimal(1.4)
                if (hasUpgrade("wtpNano", 32)) base = base.plus(upgradeEffect("wtpNano", 32))
                var eff = new Decimal(base).pow(player.wtpNano.buyables[11])
                return eff
            },
        }
    },
    layerShown() { return inChallenge("Minigames", 11)
    }
});
addLayer("wtpMicro", {
    name: "wtpMicro", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "μ", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
    }},
    color: "#1B8045",
    requires: new Decimal("1e9"), // Can be a function that takes requirement increases into account
    resource: "Microprestige Points", // Name of prestige currency
    baseResource: "Nanoprestige Points", // Name of resource prestige is based on
    baseAmount() {return player.wtpNano.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: new Decimal(1).div(9), // Prestige currency exponent
    passiveGeneration() {
        return 0

    },
    effect() {
        var eff = player.wtpMicro.points.plus(1)
        if (hasUpgrade("wtpMicro", 22)) eff = eff.pow(upgradeEffect("wtpMicro", 22))
        if (eff.gt("1e20")) {
            eff = eff.div("1e20").pow(1/2).times("1e20")
        }
        return eff
    },
    effectDescription() {
        var desc;
        desc = "which are multiplying Point gain by "
        desc += format(tmp.wtpMicro.effect) + "x"

        return desc
    },
    base() {
        base = 1.5
        return base
    } ,
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)

        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    directMult() {
        mult = new Decimal(1)
        return mult

    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    branches: ["wtpNano"],
    upgrades: {
        11: {
            name: "Micropoint",
            title: "Micropoint",
            description: "Point gain is multiplied by 343.",
            cost: new Decimal(2),
            unlocked() {return hasAchievement("Unlockers", 11)},
            
        },
        12: {
            name: "Micropush",
            title: "Micropush",
            description: "Nanoprestige Point gain is multiplied by 3.",
            cost: new Decimal(3),
            unlocked() {return hasAchievement("Unlockers", 11)},
        },
        21: {
            name: "Microbuy",
            title: "Microbuy",
            description: "Multiply Nanoprestige Point gain based on Nanoprestige effect.",
            effect() {
                return tmp.wtpNano.effect.pow(1/2);
            },
            cost: new Decimal(55),
            unlocked() {return hasAchievement("Unlockers", 12)},
            effectDisplay() {return format(upgradeEffect("wtpMicro", 21)) + "x"},

        },
        22: {
            name: "Microleash",
            title: "Microleash",
            description: "Raise Microprestige power based on the current Cascade Rate outside of WTP.",
            effect() {
                return player.BrokenMicro.cascadeRate.plus(1);
            },
            cost: new Decimal(20000),
            unlocked() {return hasAchievement("Unlockers", 12)},
            effectDisplay() {return format(upgradeEffect("wtpMicro", 22)) + "x"},

        },
        
    },
    milestones: {



    },
    buyables: {
        
    },
    layerShown() { return inChallenge("Minigames", 11)
    }
});