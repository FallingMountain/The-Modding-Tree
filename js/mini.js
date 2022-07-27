
addLayer("Miniprestige", {
    name: "Miniprestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "M", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
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
        if (hasUpgrade("Miniprestige", 21)) mult = mult.div(buyableEffect("Microprestige", 13))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        mult = new Decimal(1)
        return new Decimal(mult)
    },
    directMult() {
        mult = new Decimal(1)
        if (hasMilestone("BNCapital", 0)) mult = mult.times(Decimal.min(2, new Decimal(1.22).pow(player.BNCapital.points)))
        if (hasUpgrade("Microprestige", 54)) mult = mult.times(upgradeEffect("Microprestige", 54))
        if (hasUpgrade("Smallprestige", 11)) mult = mult.times(tmp.Smallprestige.smallForcePow)
        return mult
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "m", description: "m: Reset for Miniprestiges", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    buyables: {
        11: {
            cost(x) {
                var cost = new Decimal("1000").plus(Decimal.pow("1.5", Decimal.pow(x, 1.3)))
                if (hasUpgrade("Microprestige", 55)) cost = new Decimal("1000").plus(Decimal.pow("1.43", Decimal.pow(x, 1.28)))
                return Decimal.floor(cost);
            },
            title() { return "Minibuff"},
            display() {
                var display;
                display = "Multiply Microprestige gain by " + format(this.effect())+"<br><br>"
                display += "Cost: "+format(this.cost()) + " Miniprestiges."
                return display;
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                if (hasAchievement("Unlockers",45)) {
                    return true
                } else return false

            },
            effect() {
                var base = new Decimal(player.Miniprestige.resetTime).pow(1.2).plus(1)
                let eff = new Decimal(base).pow(player[this.layer].buyables[this.id])
                if (hasUpgrade("Miniprestige", 14)) eff = new Decimal(base).pow(new Decimal(1.3).pow(player[this.layer].buyables[this.id]))
                return eff
            },
            
        },



    },
    upgrades: {
        11: {
            name: "Minirelax",
            title: "Minirelax",
            description: "You no longer lose Nanoprestige upgrades on Small resets. Nanoprestige buyable autobuyers unlocked.",
            cost: new Decimal(4),
            unlocked() {return hasAchievement("Unlockers", 24)}
        },
        12: {
            name: "Miniforce",
            title: "Miniforce",
            description: "Square Microagression and Microstrawman.",
            cost: new Decimal(5),
            unlocked() {return hasAchievement("Unlockers", 24)}
        },
        13: {
            name: "Minishark",
            title: "Minishark",
            description: "Unlock some Broken Nanoprestige upgrades. Change the log10()s in Nano upgrade 64 to log2()s",
            cost: new Decimal(9),
            unlocked() {return hasUpgrade("Microprestige", 42)}
        },
        21: {
            name: "Miniplead",
            title: "Miniplead",
            description: "Autobuy Microprestige buyables, and unlock a new one.",
            cost: new Decimal(32),
            unlocked() {return hasAchievement("Unlockers", 35)}
        },
        22: {
            name: "Minirelief",
            title: "Minirelief",
            description: "Capitals exponentiate multiplier to Nanoprestige gain.",
            effect() {
                return new Decimal(1).plus(new Decimal(0.01).times(player.BNCapital.points))
            },
            effectDisplay() {return "^"+format(upgradeEffect("Miniprestige", 22))},
            cost: new Decimal(265),
            unlocked() {return hasAchievement("Unlockers", 35)}
        },
        23: {
            name: "Miniexplode",
            title: "Miniexplode",
            description: "Break Constant is multiplied based on communals & time since last Communal.",
            effect() {
                var addOns = player.BNCommunal.points
                if (hasUpgrade("Microprestige", 53)) addOns = addOns.plus(player.BNCapital.points.plus(1))
                var effect = new Decimal(player.BNCommunal.resetTime).plus(1).pow(new Decimal(1).plus(addOns))
                if (hasUpgrade("Microprestige", 51)) effect = effect.pow(2401)
                return effect
            },
            effectDisplay() {return format(upgradeEffect("Miniprestige", 23))+"x"},
            cost: new Decimal(418),
            unlocked() {return hasAchievement("Unlockers", 35)}
        },
        14:{
            name: "Minifigure",
            title: "Minifigure",
            description: "Each level of Minibuff increases the effect more exponentially.",
            cost: new Decimal(20000),
            unlocked() {return hasAchievement("Unlockers", 45)}
        },
        /*
        24:{
            name: "Miniscule",
            title: "Miniscule",
            description: "Microprestige Fragments boost Break Constant and vice versa",
            effect() {
                return Decimal.log10(player.BrokenMicro.points.plus(10)).plus(1)
            },
            effectDisplay() {return "^"+format(upgradeEffect("Miniprestige", 24))+" & x"+ format(player.BrokenNano.points.plus(2).log2().plus(2).log2().plus(1))},
            cost: new Decimal(200000),
            unlocked() {return hasAchievement("Unlockers", 45)}
        },
        */
    },
    achievements:{
        11: {
            name: "To begin (for real this time)",
            done() {return player.Miniprestige.points.gte(1)},
            tooltip: "Miniprestige for the first time. Unlocks the Upgrade subtab on all layers.",
            image() {
                if (hasAchievement("Miniprestige", 11)) return "js/images/Miniprestige/mini11.png"
                else return "js/images/unearn.png"
            },
            style: {
                width:"128px",
                height:"128px"
            }
        },
        12: {
            name: "Dynamic Upgraing",
            done() {return player.Microprestige.points.gte(6)},
            tooltip: "Get 6 Microprestiges. Microprestige no longer resets Nanoprestige upgrades.",
            image() {
                if (hasAchievement("Miniprestige", 12)) return "js/images/Miniprestige/mini12.png"
                else return "js/images/unearn.png"
            },
            style: {
                width:"128px",
                height:"128px"
            }
        },
        13: {
            name: "Buy, buy again",
            done() {return hasUpgrade("Nanoprestige", 33)},
            tooltip: "Unlock 2 buyables.",
            image() {
                if (hasAchievement("Miniprestige", 13)) return "js/images/Miniprestige/mini13.png"
                else return "js/images/unearn.png"
            },
            style: {
                width:"128px",
                height:"128px"
            }
        },
        14: {
            name: "Close enough for comfort",
            done() {return player.Microprestige.points.gte(8)},
            tooltip: "Get 8 Microprestiges.",
            image() {
                if (hasAchievement("Miniprestige", 14)) return "js/images/Miniprestige/mini14.png"
                else return "js/images/unearn.png"
            },
            style: {
                width:"128px",
                height:"128px"
            }
        },
        31: {
            name: "Put in the effort",
            done() {return player.Miniprestige.points.gte(2)},
            tooltip: "Get 2 Miniprestiges. Multiplies point gain by 49, divides Microprestige requirement by 2, and adds new upgrades.",
            image() {
                if (hasAchievement("Miniprestige", 31)) return "js/images/Miniprestige/mini31.png"
                else return "js/images/unearn.png"
            },
            style: {
                width:"128px",
                height:"128px"
            }
        },
        32: {
            name: "Stacked",
            done() {return player.Nanoprestige.buyables[21].gte(1)},
            tooltip: "Purchase Nanopierce at least once.",
            image() {
                if (hasAchievement("Miniprestige", 32)) return "js/images/Miniprestige/mini32.png"
                else return "js/images/unearn.png"
            },
            style: {
                width:"128px",
                height:"128px"
            }
        },
        33: {
            name: "Gilded Age",
            done() {return hasChallenge("Nanoprestige", 12)},
            tooltip: "Complete Muckraking for the first time.",
            image() {
                if (hasAchievement("Miniprestige", 33)) return "js/images/Miniprestige/mini33.png"
                else return "js/images/unearn.png"
            },
            style: {
                width:"128px",
                height:"128px"
            }
        },
        34: {
            name: "Shen Bapiro",
            done() {return hasUpgrade("Microprestige", 23)},
            tooltip: "Purchase Microstrawman.",
            image() {
                if (hasAchievement("Miniprestige", 34)) return "js/images/Miniprestige/mini34.png"
                else return "js/images/unearn.png"
            },
            style: {
                width:"128px",
                height:"128px"
            }
        },
        41: {
            name: "Prefacing conclusions",
            done() {return player.Miniprestige.points.gte(3)},
            tooltip: "Get 3 Miniprestiges. You now keep Micro upgrades on Miniprestige.",
            image() {
                if (hasAchievement("Miniprestige", 41)) return "js/images/Miniprestige/mini41.png"
                else return "js/images/unearn.png"
            },
            style: {
                width:"128px",
                height:"128px"
            }
        },
        42: {
            name: "Stacked II",
            done() {return challengeCompletions("Nanoprestige", 12) >= 3},
            tooltip: "Complete Muckraking 3 times.",
            image() {
                if (hasAchievement("Miniprestige", 42)) return "js/images/Miniprestige/mini42.png"
                else return "js/images/unearn.png"
            },
            style: {
                width:"128px",
                height:"128px"
            }

        },
        43: {
            name: "Leg Day",
            done() {return player.Nanoprestige.buyables[11].gte(125)},
            tooltip: "Buy Nanobuff 125 times.",
            image() {
                if (hasAchievement("Miniprestige", 43)) return "js/images/Miniprestige/mini43.png"
                else return "js/images/unearn.png"
            },
            style: {
                width:"128px",
                height:"128px"
            }
        },
        44: {
            name: "Triple Threat",
            done() {return hasChallenge("Nanoprestige", 22)},
            tooltip: "Complete Nanofuse.",
            image() {
                if (hasAchievement("Miniprestige", 44)) return "js/images/Miniprestige/mini44.png"
                else return "js/images/unearn.png"
            },
            style: {
                width:"128px",
                height:"128px"
            }
        }
        
    },
    canBuyMax() {
        return hasAchievement("Smallprestige", 21)
    },
    tabFormat: {
        "Upgrades": {
            content: ["main-display", "resource-display", "prestige-button", "upgrades"],
            unlocked() {return hasAchievement("Unlockers", 11)}
        },
        "Buyables": {
            content: ["main-display", "resource-display", "prestige-button", "buyables"],
            unlocked() {return hasAchievement("Unlockers", 45)}          
        },
        "Challenges": {
            content: ["main-display", "resource-display", "prestige-button", "challenges"],
            unlocked() {return false}

        },
        "Achievements": {
            content: ["main-display", "resource-display", "achievements"],
            unlocked() {return hasAchievement("Unlockers", 11)}

        }
    },
    doReset(layer) {
        let keep = [];
        keep.push("achievements")
        if (layer.row == this.row) return
        else if (layer == "Smallprestige") {
            if (hasAchievement("Partialprestige", 13)) keep.push("upgrades")
            layerDataReset(this.layer, keep)
        }
        else if (layer == "Partialprestige") {
            layerDataReset(this.layer, keep)
        }
    },
    layerShown(){
        return player.Microprestige.best.gte(1) || player.Miniprestige.best.gte(1) || player. Smallprestige.best.gte(1)}
})
