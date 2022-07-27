addLayer("Smallprestige", {
    name: "Smallprestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "S", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
        smallForce: new Decimal(0),
		points: new Decimal(0),
        smallAutobuyer: 0,
    }},
    color: "#1c4582",
    requires: new Decimal(4), // Can be a function that takes requirement increases into account
    resource: "Small prestiges", // Name of prestige currency
    baseResource: "Miniprestiges", // Name of resource prestige is based on
    baseAmount() {return player.Miniprestige.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1, // Prestige currency exponent
    base: 4,
    branches: ["Miniprestige"],
    effectDescription() {
        if (!hasUpgrade("Smallprestige", 11)) return "which boosts Point gain by " +format(tmp.Smallprestige.effect)
        else return "and " + format(player.Smallprestige.smallForce) + " Small Force, which multiplies Miniprestige and exponentiates Nanoprestige gain by " + format(tmp.Smallprestige.smallForcePow)

    },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasMilestone("CMEnlarge", 3)) mult = mult.div(1.3).pow(player.CMEnlarge.points)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal(1)
        if (hasUpgrade("CMEnlarge", 33)) exp = exp.times(new Decimal(1.02).pow(player.CMEnlarge.upgrades.length))
        return exp
    },
    directMult() {
        mult = new Decimal(1)
        
        return mult
    },
    canBuyMax() {return hasAchievement("Partialprestige", 14)},
    row: 3, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "S", description: "S: Reset for Small Prestiges", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    smallForceGen() {
        if (player.Smallprestige.points.gte(1) && hasUpgrade("Smallprestige", 11)) {
            var genAmount = new Decimal(1)
            genAmount = genAmount.times(new Decimal(1.25).pow(player.Smallprestige.points))
            genAmount = genAmount.times(buyableEffect("Smallprestige", 11))
            genAmount = genAmount.times(buyableEffect("Smallprestige", 12))
            if (hasUpgrade("Smallprestige", 12)) genAmount = genAmount.times(7)
            if (hasUpgrade("Smallprestige", 13)) genAmount = genAmount.times(Decimal.pow(3, player.Smallprestige.milestones.length))
            if (hasMilestone("Smallprestige", 2)) genAmount = genAmount.times(Decimal.pow(3, player.Smallprestige.milestones.length))
            if (hasUpgrade("Smallprestige", 14)) genAmount = genAmount.times(Decimal.pow(2, player.Smallprestige.upgrades.length))
            player.Smallprestige.smallForce = player.Smallprestige.smallForce.plus(genAmount.div(20))
        }
    },
    smallForcePow() {
        if (player.Smallprestige.smallForce.lt("1e10")) return player.Smallprestige.smallForce.plus(1).pow(1/10)
        else pow = player.Smallprestige.smallForce
        pow = pow.div(1e10).plus(2)
        pow = pow.log2()
        pow = pow.times(1e10)
        pow = pow.plus(1).pow(1/10)
        return pow
    },
    smallForceBuy() {
        player.Smallprestige.smallAutobuyer++;
        var autoMax = 20
        if (hasUpgrade("Smallprestige", 15)) autoMax = 10
        if (player.Smallprestige.smallAutobuyer >= autoMax) {
            player.Smallprestige.smallAutobuyer = 0
            if (hasMilestone("Smallprestige", 3)) buyBuyable("Smallprestige", 11)
            if (hasMilestone("Smallprestige", 4)) buyBuyable("Smallprestige", 12)
        }

    },
    upgrades: {
        11: {
            name:"Small I",
            title: "Small I",
            description: "Unlock the Small Force minigame, generating boosts based on Small Prestiges.",
            unlocked() {return hasAchievement("Unlockers", 53)},
            cost: new Decimal("9")
        },
        12: {
            name:"Small II",
            title: "Small II",
            description: "Multiply Small Force gain by 7.",
            fullDisplay() {
                var display = "<h3> Small II </h3> <br>"
                display += "Multiply Small Force gain by 7.<br><br>"
                display += "Cost: 7,500 Small Force"
                return display
            },
            canAfford() {
                return player.Smallprestige.smallForce.gte(7500)
            },
            pay() {
                player.Smallprestige.smallForce = player.Smallprestige.smallForce.minus(7500)
            },
            unlocked() {return hasAchievement("Unlockers", 53)},
        },
        13: {
            fullDisplay() {
                var display = "<h3> Small III </h3> <br>"
                display += "Unlock Smallprestige milestones, and per milestone multiply Small Force gain by 3.<br><br>"
                display += "Cost: 5.00e6 Small Force"
                return display
            },
            canAfford() {
                return player.Smallprestige.smallForce.gte(5e6)
            },
            pay() {
                player.Smallprestige.smallForce = player.Smallprestige.smallForce.minus(5e6)
            },
            unlocked() {return hasAchievement("Unlockers", 53)},
        },
        14: {
            name:"Small IV",
            title: "Small IV",
            description: "Multiply Small Force gain by 3x per upgrade.",
            unlocked() {return hasAchievement("Unlockers", 53)},
            cost: new Decimal("12")
        },
        15: {
            fullDisplay() {
                var display = "<h3> Small V </h3> <br>"
                display += "Autobuy speed increased 2x, automerge speed decreased -2s, and gain double levels from Milestone 5<br><br>"
                display += "Cost: 1e60 Small Force"
                return display
            },
            canAfford() {
                return player.Smallprestige.smallForce.gte("1e60")
            },
            pay() {
                player.Smallprestige.smallForce = player.Smallprestige.smallForce.minus("1e60")
            },
            unlocked() {return hasAchievement("Unlockers", 53)},
        },
    },

    buyables: {
        11: {
            title: "Small Force I",
            cost(x) {
                if (player.CMEnlarge.upgradeOrder[1] = "33") var cost = new Decimal(10)
                return cost.times(new Decimal(2).pow(x))
            },
            display() {
                var display;
                display = "Increase Small Force gain by " + format(this.effect()) +"<br>"
                display += "Effect: 1.5^x<br><br>"
                display += "Cost: "+format(this.cost()) + " Small Force.<br>"
                display += "Cost formula: 2^x"
                display += "<br>Levels: " + format(player[this.layer].buyables[this.id]) + "+" + format(tmp[this.layer].buyables[this.id].totalAmount.minus(player[this.layer].buyables[this.id]))
                return display;
            },
            totalAmount() {
                return player[this.layer].buyables[this.id]

            },
            canAfford() {
                return player[this.layer].smallForce.gte(this.cost())
            },
            buy() {
                player[this.layer].smallForce = player[this.layer].smallForce.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {
                return new Decimal(1.5).pow(player[this.layer].buyables[this.id])
            }
        },
        12: {
            title: "Small Force II",
            cost(x) {
                if (player.CMEnlarge.upgradeOrder[1] = "33") var cost = new Decimal(1e14)
                return cost.times(new Decimal(12).pow(x))
            },
            display() {
                var display;
                display = "Increase Small Force gain by " + format(this.effect()) +"<br>"
                display += "Effect: 2.5^x<br><br>"
                display += "Cost: "+format(this.cost()) + " Small Force.<br>"
                display += "Cost formula: 12^x"
                display += "<br>Levels: " + format(player[this.layer].buyables[this.id]) + "+" + format(tmp[this.layer].buyables[this.id].totalAmount.minus(player[this.layer].buyables[this.id]))
                return display;
            },
            totalAmount() {
                return player[this.layer].buyables[this.id]

            },
            unlocked() {
                return hasMilestone("Smallprestige", 3)
            },
            canAfford() {
                return player[this.layer].smallForce.gte(this.cost())
            },
            buy() {
                player[this.layer].smallForce = player[this.layer].smallForce.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {
                return new Decimal(2.5).pow(player[this.layer].buyables[this.id])
            }
        },


    },
    milestones: {
        0: {
            requirementDescription: "5e6 Small Force (1)",
            done() {return player.Smallprestige.smallForce.gte(5e6) && hasUpgrade("Smallprestige", 13)},
            effectDescription: "Add 5 to CASCADE 11 cap, and subtract 5s from its cost.",
            unlocked() {return hasUpgrade("Smallprestige", 13)},
        },
        1: {
            requirementDescription: "5e7 Small Force (2)",
            done() {return player.Smallprestige.smallForce.gte(5e7)},
            effectDescription: "Keep one Broken Nano upgrade on Smallprestige per milestone.",
            unlocked() {return hasUpgrade("Smallprestige", 13)},
        },
        2: {
            requirementDescription: "1e9 Small Force (3)",
            done() {return player.Smallprestige.smallForce.gte(1e9)},
            effectDescription: "Per milestone multiply Small Force gain by 2, and add 2 to CASCADE 22 cap.",
            unlocked() {return hasUpgrade("Smallprestige", 13)},
        },
        3: {
            requirementDescription: "2.5e13 Small Force (4)",
            done() {return player.Smallprestige.smallForce.gte(2.5e13)},
            effectDescription: "Keep Micro buyables on Small resets, unlock Small Force II, and autobuy Small Force I once per second.",
            unlocked() {return hasUpgrade("Smallprestige", 13)},
        },
        4: {
            requirementDescription: "1e40 Small Force (5)",
            done() {return player.Smallprestige.smallForce.gte(1e40)},
            effectDescription: "Autobuy Small Force II once per second, reduce CASCADE 11 cost scaling by 0.05s, and the square root of Small Force's effect adds to all CASCADE caps.",
            unlocked() {return hasUpgrade("Smallprestige", 13)},
        },


    },
    achievements: {
        11: {
            name: "Not so impossible",
            done() {return player.Smallprestige.points.gte(1)},
            tooltip: "Small Prestige for the first time. You can now get Broken layers. Also multiplies point gain more based on Smallprestiges.",
            effect() {
                return Decimal.pow("1e25", player.Smallprestige.points.plus(1));
            },
            image() {
                if (hasAchievement("Smallprestige", 11)) return "js/images/Smallprestige/small11.png"
                else return "js/images/unearn.png"
            },
            style: {
                width:"128px",
                height:"128px"
            }
        },
        12: {
            name: "Static Multiplier",
            done() {return tmp.Nanoprestige.directMult.gte(1.75)},
            tooltip: "Have over a 1.75x multiplier to Nanoprestige gain.",
            image() {
                if (hasAchievement("Smallprestige", 12)) return "js/images/Smallprestige/small12.png"
                else return "js/images/unearn.png"
            },
            style: {
                width:"128px",
                height:"128px"
            }
        },
        13: {
            name: "Snap",
            done() {return player.BrokenNano.points.gte(1)},
            tooltip: "Begin generation of Nanoprestige Fragments.",
            image() {
                if (hasAchievement("Smallprestige", 13)) return "js/images/Smallprestige/small13.png"
                else return "js/images/unearn.png"
            },
            style: {
                width:"128px",
                height:"128px"
            }
        },
        14: {
            name: "Critique of Political Economy",
            done() {return player.BNCapital.points.gte(1)},
            tooltip: "Get a Capital.",
            image() {
                if (hasAchievement("Smallprestige", 14)) return "js/images/Smallprestige/small14.png"
                else return "js/images/unearn.png"
            },
            style: {
                width:"128px",
                height:"128px"
            }
        },
        21: {
            name: "Slight inflation",
            done() {return player.Smallprestige.points.gte(2)},
            tooltip: "Small Prestige for the second time. Multiplies Nanoprestige Fragment gain based on Microprestige and Miniprestige effects.",
            effect() {
                return tmp.Microprestige.effect.pow(2).times(tmp.Miniprestige.effect.pow(2));
            },
            image() {
                if (hasAchievement("Smallprestige", 21)) return "js/images/Smallprestige/small21.png"
                else return "js/images/unearn.png"
            },
            style: {
                width:"128px",
                height:"128px"
            }
        },
        22: {
            name: "Not so static",
            done() {return tmp.Nanoprestige.directMult.gte("1e1000")},
            tooltip: "Have over a 1e1000x multiplier to Nanoprestige gain.",
            image() {
                if (hasAchievement("Smallprestige", 22)) return "js/images/Smallprestige/small22.png"
                else return "js/images/unearn.png"
            },
            style: {
                width:"128px",
                height:"128px"
            }
        },
        23: {
            name: "Microeconomics",
            done() {return hasUpgrade("Miniprestige", 21)},
            tooltip: "Unlock the third Micro buyable.",
            image() {
                if (hasAchievement("Smallprestige", 23)) return "js/images/Smallprestige/small23.png"
                else return "js/images/unearn.png"
            },
            style: {
                width:"128px",
                height:"128px"
            }
        },
        24: {
            name: "One secondary smile",
            done() {return hasMilestone("Nanoprestige", 0)},
            tooltip: "Get a Nanoprestige milestone.",
            image() {
                if (hasAchievement("Smallprestige", 24)) return "js/images/Smallprestige/small24.png"
                else return "js/images/unearn.png"
            },
            style: {
                width:"128px",
                height:"128px"
            }
        },
        31: {
            name: "It got even worse",
            done() {return player.Smallprestige.points.gte("3")},
            tooltip: "Small prestige for the third time. Unlocks the second set of Broken Nano upgrades, and divide Capital costs by 1.2",
            image() {
                if (hasAchievement("Smallprestige", 31)) return "js/images/Smallprestige/small31.png"
                else return "js/images/unearn.png"
            },
            style: {
                width:"128px",
                height:"128px"
            }
        },
        32: {
            name: "Ethical Consumption",
            done() {return player.BrokenNano.buyables[21].gte(1)},
            tooltip: "Get a level of Boost IV.",
            image() {
                if (hasAchievement("Smallprestige", 32)) return "js/images/Smallprestige/small32.png"
                else return "js/images/unearn.png"
            },
            style: {
                width:"128px",
                height:"128px"
            }
        },
        33: {
            name: "Remorse",
            done() {return player.BrokenNano.points.gte("1e20000")},
            tooltip: "Get 1e20,000 Nanoprestige fragments.",
            image() {
                if (hasAchievement("Smallprestige", 33)) return "js/images/Smallprestige/small33.png"
                else return "js/images/unearn.png"
            },
            style: {
                width:"128px",
                height:"128px"
            }
        },
        34: {
            name: "Cascade",
            done() {return hasUpgrade("BrokenNano", 23)},
            tooltip: "Buy Stack V.",
            image() {
                if (hasAchievement("Smallprestige", 34)) return "js/images/Smallprestige/small34.png"
                else return "js/images/unearn.png"
            },
            style: {
                width:"128px",
                height:"128px"
            }
        },
        41: {
            name: "It got worse again",
            done() {return player.Smallprestige.points.gte("4")},
            tooltip: "Small Prestige for the fourth time. Nanoprestige Fragment gain is increased based on Smallprestige resets, ^1.01 per reset. Caps at ^1.2",
            image() {
                if (hasAchievement("Smallprestige", 41)) return "js/images/Smallprestige/small41.png"
                else return "js/images/unearn.png"
            },
            style: {
                width:"128px",
                height:"128px"
            }
        },
        42: {
            name: "Considerably less static",
            done() {return tmp.Nanoprestige.directMult.gte("1e1000000")},
            tooltip: "Have over a 1e1,000,000x multiplier to Nanoprestige gain.",
            image() {
                if (hasAchievement("Smallprestige", 42)) return "js/images/Smallprestige/small42.png"
                else return "js/images/unearn.png"
            },
            style: {
                width:"128px",
                height:"128px"
            }
        },
        43: {
            name: "Workers of the world",
            done() {return player.BNCommunal.points.gte(1)},
            tooltip: "Get a Communal.",
            image() {
                if (hasAchievement("Smallprestige", 43)) return "js/images/Smallprestige/small43.png"
                else return "js/images/unearn.png"
            },
            style: {
                width:"128px",
                height:"128px"
            }
        },
        44: {
            name: "Pointer",
            done() {return player.points.gte("1ee10")},
            tooltip: "Get 1ee10 points.",
            image() {
                if (hasAchievement("Smallprestige", 44)) return "js/images/Smallprestige/small44.png"
                else return "js/images/unearn.png"
            },
            style: {
                width:"128px",
                height:"128px"
            }
        },
    },
    tabFormat: {
        "Upgrades": {
            content: ["main-display", "resource-display", "prestige-button", "upgrades"],
            unlocked() {return true}
        },
        "Buyables": {
            content: ["main-display", "resource-display", "prestige-button", "buyables"],
            unlocked() {return false}          
        },
        "Challenges": {
            content: ["main-display", "resource-display", "prestige-button", "challenges"],
            unlocked() {return false}

        },
        "Small Force": {
            unlocked () {return hasUpgrade("Smallprestige", 11)},
            content: ["main-display", "resource-display", ["buyable", ["11"]], ["buyable", ["12"]]]
        },
        "Milestones": {
            unlocked () {return hasUpgrade("Smallprestige", 13)},
            content: ["main-display", "resource-display", "prestige-button", "milestones"]
        },
        "Achievements": {
            content: ["main-display", "resource-display", "achievements"],
            unlocked() {return true}

        }
    },
    doReset(layer) {
        let keep = [];
        keep.push("achievements")
        if (layer.row == this.row) return
        else if (layer == "Partialprestige") {
            layerDataReset(this.layer, keep)
        }

    },
    layerShown(){
        return player.Miniprestige.best.gte(3) || player.Smallprestige.best.gte(1) || hasAchievement("Unlockers", 24)}
})