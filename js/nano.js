addLayer("Nanoprestige", {
    name: "Nanoprestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "N", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
        hiddenRows: 0,
    }},
    color: "#5BCEFA",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "Nanoprestiges", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1, // Prestige currency exponent
    effect() {
        var eff = player.Nanoprestige.points.plus(1)
        if (hasUpgrade("Microprestige", 21)) eff = eff.pow(2)
        if (hasUpgrade("Nanoprestige", 42)) eff = eff.pow(2)
        if (challengeCompletions("Nanoprestige", 11) >= 1) eff = eff.pow(2)
        if (challengeCompletions("Nanoprestige", 11) >= 2) eff = eff.pow(2)
        if (inChallenge("Nanoprestige", 21)) eff = 1
        return eff
    },
    effectDescription() {
        var desc;
        desc = "which are multiplying Point gain by "
        desc += format(tmp.Nanoprestige.effect) + "x"
        return desc
    },
    base() {
        base = 1.5
        if (hasUpgrade("Nanoprestige", 35)) base = 1.46
        return base
    } ,
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade("Microprestige", 12)) mult = mult.div(3)
        if (hasUpgrade("Microprestige", 13)) mult = mult.div(upgradeEffect("Microprestige", 13))
        if (hasUpgrade("Microprestige", 44)) mult = mult.div("1e5000")
        if (hasUpgrade("BrokenNano", 11)) mult = mult.div(buyableEffect("Nanoprestige", 31))
        if (hasUpgrade("BrokenNano", 22)) mult = mult.div(upgradeEffect("BrokenNano", 22))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        mult = new Decimal(1)
        if (hasChallenge("Nanoprestige", 21)) mult = mult.times(1.3)
        if (hasUpgrade("Nanoprestige", 51)) mult = mult.times(1.1)
        if (hasUpgrade("Nanoprestige", 55)) mult = mult.times(1.2)
        if (hasUpgrade("Nanoprestige", 65)) mult = mult.times(3.1)
        if (hasUpgrade("Microprestige",14)) mult = mult.times(buyableEffect("Microprestige", 11))
        if (hasUpgrade("Microprestige", 42)) mult = mult.times(tmp.BrokenNano.effect)
        if (hasChallenge("Microprestige", 11)) mult = mult.times(10)
        return mult
    },
    directMult() {
        mult = new Decimal(1)
        if(hasUpgrade("Nanoprestige", 71)) mult = mult.times(upgradeEffect("Nanoprestige", 71))
        if(hasUpgrade("Nanoprestige", 84)) mult = mult.times(upgradeEffect("Nanoprestige", 84))
        if(hasUpgrade("Nanoprestige", 16)) mult = mult.times(upgradeEffect("Nanoprestige", 16))
        if(hasUpgrade("Nanoprestige", 26)) mult = mult.times(upgradeEffect("Nanoprestige", 26))
        return mult

    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "n", description: "N: Reset for Nanoprestiges", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    buyables: {
        11: {
            cost(x) {
                var cost
                var base2 = new Decimal(1.12)
                var expo = new Decimal(1.2)
                if (hasUpgrade("Nanoprestige", 41)) expo = 1.1
                if (hasUpgrade("Nanoprestige", 35)) base2 = 1.1
                cost = new Decimal("35").plus(x.pow(1/2).mul(Decimal.pow(base2, x.pow(expo))))
                if (hasUpgrade("Nanoprestige", 14)) cost = cost.div(2)
                if (hasUpgrade("Nanoprestige", 34) && !inChallenge("Nanoprestige", 12)) cost = cost.div(buyableEffect("Nanoprestige", 13))
                if (hasUpgrade("Microprestige",43)) cost = cost.div(buyableEffect("Microprestige", 12))
                if (challengeCompletions("Nanoprestige", 11) >= 4) cost = cost.div(Decimal.pow(1.25, challengeCompletions("Nanoprestige", 11)))
                return Decimal.ceil(cost)
            },
            title() { return "Nanobuff"},
            display() {
                var base = new Decimal(3)
                var base2 = new Decimal(1.12)
                var expo = new Decimal(1.2)
                if (hasUpgrade("Nanoprestige", 41)) expo = 1.1
                if (hasUpgrade("Nanoprestige", 35)) base2 = 1.1
                if (hasUpgrade("Microprestige", 22)) base = base.plus(0.5)
                base = base.plus(buyableEffect("Nanoprestige", 22))
                if (hasUpgrade("Nanoprestige", 55)) base = base.plus(buyableEffect("Nanoprestige", 22))
                if (challengeCompletions("Nanoprestige", 12) >= 1) base = base.plus(1)
                if (hasUpgrade("Nanoprestige", 25)) base = base.times(player.points.plus(10).log10().log10().plus(1))
                if (challengeCompletions("Nanoprestige", 12) >= 3) base = base.times(Decimal.mul(challengeCompletions("Nanoprestige", 12), 1).plus(1))
                var display;
                display = "Multiply Point gain by " + format(this.effect())+"x<br>"
                display += "Formula: "+ format(base) + "^x<br><br>"
                display += "Cost: "+format(this.cost()) + " Nanoprestiges.<br>"
                display += "Cost formula: 35 + √(x)*" + format(base2) +"^(x^" + format(expo) + ")"
                return display;
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                if (!hasUpgrade("Nanoprestige", 34)) player[this.layer].points = player[this.layer].points.sub(this.cost(player.Nanoprestige.buyables[11]))
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                if (hasUpgrade("Nanoprestige",13)) {
                    return true
                } else return false

            },
            effect() {
                var base = new Decimal(3)
                if (hasUpgrade("Microprestige", 22)) base = base.plus(0.5)
                if (challengeCompletions("Nanoprestige", 12) >= 1) base = base.plus(1)
                base = base.plus(buyableEffect("Nanoprestige", 22))
                if (hasUpgrade("Nanoprestige", 25)) base = base.times(player.points.plus(10).log10().log10().plus(1))
                if (challengeCompletions("Nanoprestige", 12) >= 3) base = base.times(Decimal.mul(challengeCompletions("Nanoprestige", 12), 1).plus(1))
                
                var eff = new Decimal(base).pow(player[this.layer].buyables[this.id])
                if (inChallenge("Nanoprestige", 12)) eff = new Decimal(1)
                return eff
            },
            
        },
        12: {
            cost(x) {
                var cost;
                cost = new Decimal("70").plus(Decimal.mul(10, Decimal.pow(1.25, x.pow(1.1))))
                if (hasUpgrade("Nanoprestige", 14)) cost = cost.div(2)
                if (hasUpgrade("Nanoprestige", 34) && !inChallenge("Nanoprestige", 11)) cost = cost.div(buyableEffect("Nanoprestige", 13))
                if (hasUpgrade("Microprestige",43)) cost = cost.div(buyableEffect("Microprestige", 12))
                if (challengeCompletions("Nanoprestige", 11) >= 4) cost = cost.div(Decimal.pow(1.25, challengeCompletions("Nanoprestige", 11)))
                return Decimal.ceil(cost)
            
            },
            title() { return "Nanogains"},
            display() {
                var display;
                var base = Decimal.mul(player.Nanoprestige.upgrades.length, 1/2.5).plus(1)
                if (challengeCompletions("Nanoprestige", 12) >= 1) base = base.plus(Decimal.mul(player.Nanoprestige.upgrades.length, 1/5))
                if (hasUpgrade("Nanoprestige", 55)) base = base.plus(buyableEffect("Nanoprestige", 22))
                if (challengeCompletions("Nanoprestige", 12) >= 2) base = base.times(Decimal.mul(challengeCompletions("Nanoprestige", 12), 0.5).plus(1))
                display = "Multiply Point gain by " + format(this.effect())+"x<br>"
                display += "Formula: " + format(base) +"^x<br><br>"
                display += "Cost: "+format(this.cost()) + " Nanoprestiges.<br>"
                display += "Cost formula:"
                display += " 70 + 15*1.25^(x^1.1)"
                return display;
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                if (!hasUpgrade("Nanoprestige", 34)) player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                if (hasUpgrade("Nanoprestige",33)) {
                    return true
                } else return false

            },
            effect() {
                var base = Decimal.mul(player.Nanoprestige.upgrades.length, 1/2.5).plus(1)
                if (challengeCompletions("Nanoprestige", 12) >= 1) base = base.plus(Decimal.mul(player.Nanoprestige.upgrades.length, 1/5))
                if (hasUpgrade("Nanoprestige", 55)) base = base.plus(buyableEffect("Nanoprestige", 22).times(2))
                if (challengeCompletions("Nanoprestige", 12) >= 2) base = base.times(Decimal.mul(challengeCompletions("Nanoprestige", 12), 0.5).plus(1))
                var eff = new Decimal(base).pow(player[this.layer].buyables[this.id])
                if (inChallenge("Nanoprestige", 12)) eff = new Decimal(1)
                return eff
            }
        },
        13: {
            title() {return "Nanomuscle"},
            cost(x) {
                var cost = new Decimal("150").times(Decimal.pow(1.5, x.pow(1.1)))
                if (challengeCompletions("Nanoprestige", 11) >= 4) cost = cost.div(Decimal.pow(1.25, challengeCompletions("Nanoprestige", 11)))
                return cost
            
            },
            display() {
            var display;
                display = "Divide buyable and Microprestige requirements by " + format(this.effect()) +"<br>"
                display += "Effect: /"
                base = new Decimal(1.2)
                base = base.plus(buyableEffect("Nanoprestige", 21))
                if (challengeCompletions("Nanoprestige", 12) >= 1) base = base.plus(new Decimal(1))
                display += format(base) + "<br><br>"
                display += "Cost: "+format(this.cost()) + " Nanoprestiges.<br>"
                display += "Cost formula: 1.5^(x^1.1)"
                return display;
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                if (!hasUpgrade("Nanoprestige", 34)) player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                if (hasUpgrade("Nanoprestige",34)) {
                    return true
                } else return false
            },
            effect() {
                var base = new Decimal(1.2)
                base = base.plus(buyableEffect("Nanoprestige", 21))
                if (challengeCompletions("Nanoprestige", 12) >= 1) base = base.plus(new Decimal(1))
                var eff = new Decimal(base).pow(player[this.layer].buyables[this.id])
                if (inChallenge("Nanoprestige", 12)) eff = new Decimal(1)
                return eff;
            }
        },
        21: {
            title() {return "Nanopierce"},
            cost(x) {
                var cost;
                cost = new Decimal("650").plus(Decimal.pow("1.5", Decimal.pow(x, 1.3)))
                if (hasUpgrade("Nanoprestige", 34) && !inChallenge("Nanoprestige", 11)) cost = cost.div(buyableEffect("Nanoprestige", 13))
                if (hasUpgrade("Microprestige",43)) cost = cost.div(buyableEffect("Microprestige", 12))
                if (challengeCompletions("Nanoprestige", 11) >= 4) cost = cost.div(Decimal.pow(1.25, challengeCompletions("Nanoprestige", 11)))
                return Decimal.ceil(cost)
                
            },
            display() {
                var display;
                var base = new Decimal(0.1)
                var costBase = "650 + 1.5^(x^1.3)"
                display = "Increase the effect of Nanomuscle by " + format(this.effect()) +"<br>"
                display += "Effect: +" + format(base) + "<br><br>"
                display += "Cost: "+format(this.cost()) + " Nanoprestiges.<br>"
                display += "Cost formula: " + costBase
                return display;
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                if (!hasUpgrade("Nanoprestige", 34)) player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                if (hasUpgrade("Nanoprestige",43)) {
                    return true
                } else return false
            },
            effect() {
                var base = new Decimal(0.1)
                if (hasUpgrade("Nanoprestige", 45)) base = base.plus(0.02)
                if (hasChallenge("Nanoprestige", 21)) base = base.plus(0.02)
                var eff = base.times((player[this.layer].buyables[this.id]))
                if (inChallenge("Nanoprestige", 12)) eff = new Decimal(0)
                return eff;
            }
        },
        22: {
            title() {return "Nanophase"},
            cost(x) {
                var cost;
                cost = new Decimal("3.5e7").plus(new Decimal("1e6").times(Decimal.pow(1.25, x.pow(1.2))))
                if (hasUpgrade("Nanoprestige", 34) && !inChallenge("Nanoprestige", 11)) cost = cost.div(buyableEffect("Nanoprestige", 13))
                if (hasUpgrade("Microprestige", 43)) cost = cost.div(buyableEffect("Microprestige", 12))
                if (challengeCompletions("Nanoprestige", 11) >= 4) cost = cost.div(Decimal.pow(1.25, challengeCompletions("Nanoprestige", 11)))
                return cost
            },
            display() {
                var display;
                display = "Increase power of Nanobuff by +" + format(this.effect()) +"<br>"
                display += "Effect: +0.25x <br><br>"
                display += "Cost: "+format(this.cost()) + " Nanoprestiges.<br>"
                display += "Cost scaling: 3.5e7 + 1e6*1.25^(x^1.2)"
                return display;
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                if (!hasUpgrade("Nanoprestige", 34)) player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                if (hasUpgrade("Nanoprestige",52)) {
                    return true
                } else return false
            },
            effect() {
                var base = new Decimal(0.25)
                if (hasChallenge("Nanoprestige", 21)) base = base.plus(0.05)
                var eff = new Decimal(base).times(player[this.layer].buyables[this.id])
                if (inChallenge("Nanoprestige", 12)) eff = new Decimal(0)
                return eff;
            }
        },
        23: {
            title() {return "Nanofracture"},
            cost(x) {
                var cost;
                cost = new Decimal("4500000").plus(Decimal.mul("1500000", x))
                if (hasUpgrade("Nanoprestige", 34) && !inChallenge("Nanoprestige", 11)) cost = cost.div(buyableEffect("Nanoprestige", 13))
                if (hasUpgrade("Microprestige",43)) cost = cost.div(buyableEffect("Microprestige", 12))
                if (x.gte(2)) cost = cost.times(Decimal.pow(1.05, Decimal.sub(x, 2)))
                if (x.gte(50)) cost = cost.times(Decimal.pow(1.1, Decimal.sub(x, 50)))
                if (x.gte(10)) cost = cost.pow(1.05)
                return cost
            },
            display() {
                var display;
                display = "Increase Nanoprestige point gain by " + format(this.effect()) +"x.<br><br>"
                display += "Cost: "+format(this.cost()) + " Nanoprestiges."
                return display;
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                if (!hasUpgrade("Nanoprestige", 34)) player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                if (hasUpgrade("Nanoprestige",61)) {
                    return true
                } else return false
            },
            effect() {
                var base = new Decimal(1.25)
                if (hasUpgrade("Nanoprestige", 63)) base = base.plus(0.25)
                if (hasUpgrade("Nanoprestige", 72)) base = base.plus(0.25)
                if (hasUpgrade("Nanoprestige", 75)) base = base.plus(0.75)
                var eff = new Decimal(base).pow(player[this.layer].buyables[this.id])
                if (inChallenge("Nanoprestige", 12)) eff = new Decimal(1)
                return eff;
            }

        },
        31: {
            title() {return "Nanoskewer"},
            cost(x) {
                var cost;
                cost = new Decimal("10000000000").plus(Decimal.mul("2500000000", x))
                if (x.gte(2)) cost = cost.times(Decimal.pow(1.05, Decimal.sub(x, 2)))
                if (x.gte(50)) cost = cost.times(Decimal.pow(1.1, Decimal.sub(x, 50)))
                if (hasUpgrade("Nanoprestige", 34) && !inChallenge("Nanoprestige", 11)) cost = cost.div(buyableEffect("Nanoprestige", 13))
                if (hasUpgrade("Microprestige",43)) cost = cost.div(buyableEffect("Microprestige", 12))
                if (x.gte(10)) cost = cost.pow(1.05)
                if (x.gte(200)) cost = cost.pow(1.5)
                return cost
            },
            display() {
                var display;
                display = "Divide Nano and Micro, and Miniprestige requirements by " + format(this.effect()) +"<br><br>"
                display += "Cost: "+format(this.cost()) + " Nanoprestiges."
                return display;
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                if (!hasUpgrade("Nanoprestige", 34)) player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                if (hasUpgrade("BrokenNano", 11)) {
                    return true
                } else return false
            },
            effect() {
                var base = new Decimal(1.13)
                if (hasUpgrade("BrokenNano", 12)) base = base.plus(0.03)
                if (hasUpgrade("Nanoprestige", 73)) base = base.plus(0.05)
                if (hasUpgrade("Nanoprestige", 75)) base = base.plus(0.01654)
                if (hasAchievement("Smallprestige", 31)) base = base.plus(0.03346)
                var eff = new Decimal(base).pow(player[this.layer].buyables[this.id])
                if (inChallenge("Nanoprestige", 12)) eff = new Decimal(1)
                return eff;
            }
        },
        32: {
            title() {return "Nanoultraboost"},
            cost(x) {
                var cost;
                cost = new Decimal("1e50").plus(Decimal.mul("2e54", x))
                cost = cost.times(Decimal.pow(new Decimal(10).plus(new Decimal(x).times(2)), x))
                if (x.gte(5)) cost = cost.times(100)
                if (hasUpgrade("Nanoprestige", 34) && !inChallenge("Nanoprestige", 11)) cost = cost.div(buyableEffect("Nanoprestige", 13))
                if (hasUpgrade("Microprestige",43)) cost = cost.div(buyableEffect("Microprestige", 12))
                return cost
            },
            display() {
                var display;
                display = "Increase the power of Nanoprestige Points by " + format(this.effect()) +"<br><br>"
                display += "Cost: "+format(this.cost()) + " Nanoprestiges."
                return display;
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                if (!hasUpgrade("Nanoprestige", 34)) player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                if (hasMilestone("BrokenMicro", 1)) {
                    return true
                } else return false
            },
            effect() {
                var base = new Decimal(0.2)
                if (hasMilestone("BrokenNano", 7)) base = base.plus(0.007)
                var eff = new Decimal(base).times(player[this.layer].buyables[this.id])
                if (inChallenge("Nanoprestige", 12)) eff = new Decimal(0)
                return eff;
            }
        },
    },
    upgrades: {
        11: {
            name: "Nanopoint",
            title: "Nanopoint",
            description: "Point gain is multiplied by 7.",
            cost: new Decimal(13),
            effect() {
                return player[this.layer].points.add(1);

            },
            unlocked() {return hasAchievement("Unlockers", 11)},
        },
        12: {
            name: "Nanopush",
            title: "Nanopush",
            description: "Point gain is multiplied by 7.",
            cost: new Decimal(18),
            unlocked() {return hasAchievement("Unlockers", 11)},
        },
        13: {
            name: "Nanobuy",
            title: "Nanobuy",
            description: "Unlock a Nanoprestige buyable.",
            cost: new Decimal(42),
            unlocked() {return hasAchievement("Unlockers", 12)},

        },
        14: {
            name: "Nanorecharge",
            title: "Nanorecharge",
            description: "Divide buyable requirement by 2, and buyables no longer reset on Microprestige",
            cost: new Decimal(168),
            unlocked() {return hasAchievement("Unlockers", 14)}
        
        },
        15: {
            name: "Nanohelp",
            title: "Nanohelp",
            description: "Divide Microprestige requirement based on Miniprestiges, and you keep challenges on Micro resets",
            cost: new Decimal(1728),
            unlocked() {return hasAchievement("Unlockers", 21)},
            effect() {return player.Miniprestige.points.pow(2).plus(1)},
            effectDisplay() {return format(player.Miniprestige.points.pow(2).plus(1))}
        },
        21: {
            name: "Nanoclick",
            title: "Nanoclick",
            description: "Point gain is multiplied by 7.",
            cost: new Decimal(24),
            unlocked() {return hasAchievement("Unlockers", 11)},
        },
        22: {
            name: "Nanoshove",
            title: "Nanoshove",
            description: "Point gain is multiplied by 7.",
            cost: new Decimal(30),
            unlocked() {return hasAchievement("Unlockers", 11)},

        },
        23: {
            name: "Nanosell",
            title: "Nanosell",
            description: "Automatically buy Nanoprestiges, and you can buy max Nanoprestiges.",
            cost: new Decimal(48),
            unlocked() {
                return hasAchievement("Unlockers", 12)
            },

        },
        24: {
            name: "Nanodecharge",
            title: "Nanodecharge",
            description: "Divide Microprestige requirement by 2, and multiply point gain by 7.",
            cost: new Decimal(200),
            unlocked() {return hasAchievement("Unlockers", 14)}
        
        },
        25: {
            name: "Nanoretain",
            title: "Nanoretain",
            description: "Increase power of Nanobuff by log(log(points))/3.",
            cost: new Decimal(1820),
            unlocked() {return hasAchievement("Unlockers", 21)},
        },
        31: {
            name: "Nanolove",
            title: "Nanolove",
            description: "Point gain is multiplied by 7.",
            cost: new Decimal(90),
            unlocked() {
                return hasAchievement("Unlockers", 13)
            }

        },
        32: {
            name: "Nanohate",
            title: "Nanohate",
            description: "Point gain is multiplied by 7.",
            cost: new Decimal(97),
            unlocked() {
                return hasAchievement("Unlockers", 13)
            }

        },
        33: {
            name: "Nanonull",
            title: "Nanonull",
            description: "Unlock another Nanoprestige buyable.",
            cost: new Decimal(103),
            unlocked() {
                return hasAchievement("Unlockers", 13)
            }

        },
        34: {
            name: "Nanocharge",
            title: "Nanocharge",
            description: "Buyables no longer cost anything, and unlock a new one",
            cost: new Decimal(209),
            unlocked() {return hasAchievement("Unlockers", 14)}
        
        },
        35: {
            name: "Nanoupward",
            title: "Nanoupward",
            description: "Change the 1.12 in Nanobuff's cost formula to a 1.1.",
            cost: new Decimal(2121),
            unlocked() {return hasAchievement("Unlockers", 21)},
        },
        41: {
            name: "NanoI",
            title: "NanoI",
            description: "Reduce the ^1.2 in Nanobuff's cost formula to a ^1.1.",
            cost: new Decimal(323),
            unlocked() {return hasAchievement("Unlockers", 16)}
        },
        42: {
            name: "NanoII",
            title: "NanoII",
            description: "Square the Nanoprestige formula again.",
            cost: new Decimal(350),
            unlocked() {return hasAchievement("Unlockers", 16)}
        },
        43: {
            name: "NanoIII",
            title: "NanoIII",
            description: "Unlock another Nanoprestige buyable.",
            cost: new Decimal(432),
            unlocked() {return hasAchievement("Unlockers", 16)}

        },
        44: {
            name: "NanoIV",
            title: "NanoIV",
            description: "Unlock 2 Nanoprestige challenges",
            cost: new Decimal(500),
            unlocked() {return hasAchievement("Unlockers", 16)}
        },
        45: {
            name: "NanoV",
            title: "NanoV",
            description: "Slightly increase power of Nanopierce.",
            cost: new Decimal(2422),
            unlocked() {return hasAchievement("Unlockers", 21)},
        },
        51: {
            name: "Nanoscale",
            title: "Nanoscale",
            description: "Slightly reduce Nanoprestige cost scaling.",
            cost: new Decimal(3878),
            unlocked() {return hasAchievement("Unlockers", 23)}
        },
        52: {
            name: "Nanobalance",
            title: "Nanobalance",
            description: "Unlock a new Nanoprestige buyable.",
            cost: new Decimal(4295),
            unlocked() {return hasAchievement("Unlockers", 23)}

        },
        53: {
            name: "Nanomass",
            title: "Nanomass",
            description: "Slightly reduce Microprestige cost scaling.",
            cost: new Decimal(4540),
            unlocked() {return hasAchievement("Unlockers", 23)}

        },
        54: {
            name: "Nanoweight",
            title: "Nanoweight",
            description: "Unlock 2 new Nanoprestige challenges.",
            cost: new Decimal(5087),
            unlocked() {return hasAchievement("Unlockers", 23)}
        },
        55: {
            name: "Nanofinale",
            title: "Nanofinale",
            description: "Makes Nanophase work on Nanogains, and double its power. Also reduce Nano cost scaling.",
            cost: new Decimal(7050),
            unlocked() {return hasChallenge("Nanoprestige", 22)}
        },
        61: {
            name: "Nanofracture",
            title: "Nanofracture",
            description: "Welcome to post-Break nano. Check on your buyables.",
            cost: new Decimal(1000000),
            unlocked() {return hasUpgrade("Microprestige", 42)}
        },
        62: {
            name: "Nanostrawman",
            title: "Nanostrawman",
            description: "Cube Microstrawman.",
            cost: new Decimal(1.7e6),
            unlocked() {return (hasMilestone("BrokenNano", 2))}
        },
        63: {
            name: "Nanoagain",
            title: "Nanoagain",
            description: "Nanofracture's effect is increased.",
            cost: new Decimal(3333333),
            unlocked() {return (hasMilestone("BrokenNano", 3))}
        },
        64: {
            name: "Nanowrimo",
            title: "Nanowrimo",
            description: "Nanoprestige Points boost Point gain.",
            cost: new Decimal(1e7),
            unlocked() {return (hasMilestone("BrokenNano", 5))},
            effect() {
                return player.BrokenNano.points.plus(1).pow(3);
            },
            effectDisplay() {return format(upgradeEffect("Nanoprestige", 64))+"x"}
        },
        65: {
            name: "Nanofinale2",
            title: "Nanofinale 2",
            description: "Reduce base scaling for Nano, Micro, and Mini.",
            cost: new Decimal(1.4e7),
            unlocked() {return hasMilestone("BrokenNano", 6)},
        },
        71: {
            name: "NanoNew",
            title: "NanoVI",
            description: "Multiply Nanoprestige gain by log2(log2(points)).",
            cost: new Decimal(1.5e16),
            unlocked() {return hasUpgrade("Microprestige", 45)},
            effect() {
                return player.points.log2().log2()
            },
            effectDisplay() {return format(upgradeEffect("Nanoprestige", 71)) + "x"}
        },
        72: {
            name: "NanoVII",
            title: "NanoVII",
            description: "Increase the power of Nanofracture.",
            unlocked() {return hasUpgrade("Microprestige", 45)},
            cost: new Decimal(1.25e18),
        },
        73: {
            name: "NanoVIII",
            title: "NanoVIII",
            description: "Increase the power of Nanoskewer.",
            unlocked() {return hasUpgrade("Microprestige", 45)},
            cost: new Decimal(2.1e18),
        },
        74: {
            name: "NanoIX",
            title: "NanoIX",
            description: "Increase the power of Nanomuscle.",
            unlocked() {return hasUpgrade("Microprestige", 45)},
            cost: new Decimal(3.34e18),
        },
        75: {
            name:"NanoX",
            title: "NanoX",
            description: "Increase the power of Nanofracture again.",
            unlocked() {return hasUpgrade("Microprestige", 45)},
            cost: new Decimal(5.00e18)
        },
        81: {
            name:"NanoXI",
            title: "NanoXI",
            description: "The power of the 25 million Nanoprestige Point milestone is squared.",
            unlocked() {return hasUpgrade("Miniprestige", 22)},
            cost: new Decimal(8.22e19)
        },
        82: {
            name:"NanoXII",
            title: "NanoXII",
            description: "Nanoprestige point gain increased ^1.25.",
            unlocked() {return hasUpgrade("Miniprestige", 22)},
            cost: new Decimal(8.67e19)
        },
        83: {
            name:"NanoXIII",
            title: "NanoXIII",
            description: "Nanoprestige point effect is increased again.",
            unlocked() {return hasUpgrade("Miniprestige", 22)},
            cost: new Decimal(1.87e20)
        },
        84: {
            name:"NanoXIV",
            title: "NanoXIV",
            description: "Nanoprestige gain is multiplied by log(Nanoprestige points)^3/4.",
            unlocked() {return hasUpgrade("Miniprestige", 22)},
            cost: new Decimal(1.87e21),
            effect() {
                return player.BrokenNano.points.plus(1).log10().pow(3/4).plus(1)
            },
            effectDisplay() {return format(upgradeEffect("Nanoprestige", 84)) + "x"}
        },
        85: {
            name:"NanoXV",
            title: "NanoXV",
            description: "Nanoprestige point gain increased ^1.25 again.",
            unlocked() {return hasUpgrade("Miniprestige", 22)},
            cost: new Decimal(9.35e23)
        },
        91: {
            name:"NanoXVI",
            title: "NanoXVI",
            description: "Microprestige cost is divided by log2(Nanoprestige Points)^2",
            unlocked() {return hasUpgrade("Microprestige", 51)},
            cost: new Decimal(4.3e24),
            effect() {
                return player.BrokenNano.points.plus(2).log2().pow(2)
            },
            effectDisplay() {return format(upgradeEffect("Nanoprestige", 91)) + "x"}
        },
        92: {
            name: "NanoXVII",
            title: "NanoXVII",
            description: "Nanoprestige Point gain increased based on Microprestiges",
            unlocked() {return hasUpgrade("Microprestige", 51)},
            cost: new Decimal(4.75e24),
            effect() {
                return player.Microprestige.points.plus(1).pow(2).plus(1)
            },
            effectDisplay() {return format(upgradeEffect("Nanoprestige", 92)) + "x"}
        },
        93: {
            name: "NanoXVIII",
            title: "NanoXVIII",
            description: "Nanoprestige Points boost their own effect",
            unlocked() {return hasUpgrade("Microprestige", 51)},
            cost: new Decimal(5.97e24),
            effect() {
                return player.BrokenNano.points.plus(1).log2().log10().div(10)
            },
            effectDisplay() {return "+" + format(upgradeEffect("Nanoprestige", 93))}
        },
        94: {
            name: "NanoXIX",
            title: "NanoXIX",
            description: "Nanoprestige Points boost their own gain",
            unlocked() {return hasUpgrade("Microprestige", 51)},
            cost: new Decimal(1.63e26),
            effect() {
                return player.BrokenNano.points.plus(2).log2().pow(5)
            },
            effectDisplay() {return format(upgradeEffect("Nanoprestige", 94))+"x"}
        },
        95: {
            name: "NanoXX",
            title: "NanoXX",
            description: "Nanoprestige Points boost their own gain",
            unlocked() {return hasUpgrade("Microprestige", 51)},
            cost: new Decimal(2.35e26),
            effect() {
                return player.BrokenNano.points.plus(2).log2().log2().div(20).plus(1)
            },
            effectDisplay() {return "^"+format(upgradeEffect("Nanoprestige", 95))}
        },
        101: {
            name: "NanoXXI",
            title: "NanoXXI",
            description: "Multiply Nanoprestige gain by log2(Microprestiges)",
            unlocked() {return hasUpgrade("Microprestige", 52)},
            cost: new Decimal(7.4e27),
            effect() {
                return player.Microprestige.points.plus(2).log2().plus(1)
            },
            effectDisplay() {return format(upgradeEffect("Nanoprestige", 16))+"x"}
        },
        102: {
            name: "NanoXXII",
            title: "NanoXXII",
            description: "Multiply Nanoprestige gain by log10(Points)^1/2",
            unlocked() {return hasUpgrade("Microprestige", 52)},
            cost: new Decimal(5e29),
            effect() {
                return player.points.plus(2).log10().plus(1).pow(1/2)
            },
            effectDisplay() {return format(upgradeEffect("Nanoprestige", 26))+"x"}
        },
        103: {
            name: "NanoXXIII",
            title: "NanoXXIII",
            description: "Nanoprestige points boost their own effect again, but more this time.",
            unlocked() {return hasUpgrade("Microprestige", 52)},
            cost: new Decimal(6.16e33),
            effect() {
                return player.BrokenNano.points.plus(1).log2().log2().div(20)
            },
            effectDisplay() {return "+"+format(upgradeEffect("Nanoprestige", 36))}
        },
        104: {
            name: "NanoXXIV",
            title: "NanoXXIV",
            description: "Nanoprestige points boost their own gain again, but more this time.",
            unlocked() {return hasUpgrade("Microprestige", 52)},
            cost: new Decimal(4.3e36),
            effect() {
                return player.BrokenNano.points.plus(2).log2().log2().div(15).plus(1).pow(1.15)
            },
            effectDisplay() {return "^"+format(upgradeEffect("Nanoprestige", 46))}
        },
        105: {
            name: "NanoXXV",
            title: "NanoXXV",
            description: "Reduce Miniprestige cost scaling.",
            unlocked() {return hasUpgrade("Microprestige", 52)},
            cost: new Decimal(2.39e39),
        },
        111: {
            name: "NanoXXVI",
            title: "NanoXXVI",
            description: "Multiply Nanoprestige Point gain by 1e100",
            unlocked() {return hasUpgrade("Microprestige", 52)},
            cost: new Decimal(8.17e39)
        },
        112: {
            name: "NanoXXVII",
            title: "NanoXXVII",
            description: "Multiply Nanoprestige Point gain based on Microprestiges. Hardcaps at 1e250x",
            unlocked() {return hasUpgrade("Microprestige", 52)},
            cost: new Decimal(4.74e40),
            effect() {
                return Decimal.min("1e250", Decimal.pow(1.005, player.Microprestige.points.plus(1)))
            },
            effectDisplay() {return format(upgradeEffect("Nanoprestige", 76))+"x"}
        },
        113: {
            name: "NanoXXVII",
            title: "NanoXXVII",
            description: "Slightly reduce Microprestige cost scaling",
            unlocked() {return hasUpgrade("Microprestige", 52)},
            cost: new Decimal(7.88e40)
        },
        114: {
            name: "Nanofinale 3",
            title: "Nanofinale 3",
            description: "Multiply Nanoprestige Point gain by 1e50",
            unlocked() {return hasUpgrade("Microprestige", 52)},
            cost: new Decimal(6.96e41)
        },
    },
    challenges: {
        11: {
            name: "Nanoblock",
            challengeDescription: "Point gain is raised to ^0.1.",
            goalDescription() {
                var goal = new Decimal(10).pow(new Decimal(10).times(new Decimal(2).pow(new Decimal(challengeCompletions("Nanoprestige", 11)))))
                return format(goal) + " points (" + challengeCompletions("Nanoprestige", 11) + "/5)"
            },
            canComplete() {
                return player.points.gte(new Decimal(10).pow(new Decimal(10).times(new Decimal(2).pow(challengeCompletions("Nanoprestige", 11)))))
            },
            rewardDescription() {
                if (challengeCompletions("Nanoprestige", 11) == 0) return "Raises Point gain to ^1.1, and increases the power of Nanoprestiges."
                if (challengeCompletions("Nanoprestige", 11) == 1) return "Increases the power of Nanoprestiges again."
                if (challengeCompletions("Nanoprestige", 11) == 2) return "Reduce Microprestige cost scaling by a small amount."
                if (challengeCompletions("Nanoprestige", 11) == 3) return "Reduce buyable costs based on completions of this challenge."
            },
            unlocked() {return hasUpgrade("Nanoprestige", 44)},
            completionLimit: 5
        },
        12: {
            name: "Muckraking",
            challengeDescription: "Buyables do not do anything.",
            goalDescription() {
                var goal = new Decimal(1e57).pow(Decimal.pow(2, challengeCompletions("Nanoprestige", 12)))
                return format(goal) + " points (" + challengeCompletions("Nanoprestige", 12) + "/5)"
            },
            canComplete() {return player.points.gte(new Decimal(1e57).pow(Decimal.pow(2, challengeCompletions("Nanoprestige", 12))))},
            rewardDescription() {
                if (challengeCompletions("Nanoprestige", 12) == 0) return "The first row of buyables has increased power. You keep Challenges on Micro resets."
                if (challengeCompletions("Nanoprestige", 12) == 1) return "Multiply the power of Nanogains based on this challenge's completions."
                if (challengeCompletions("Nanoprestige", 12) == 2) return "Multiply the power of Nanobuff based on this challenge's completions."
            },
            unlocked() {return hasUpgrade("Nanoprestige", 44)},
            completionLimit: 5
        },
        21: {
            name: "Nanocore",
            challengeDescription: "Nanoblock, but Nanoprestige points have no effect.",
            goalDescription() {
                var goal = new Decimal(1e63).pow(Decimal.pow(2, challengeCompletions("Nanoprestige", 21)))
                return format(goal) + " points (" + challengeCompletions("Nanoprestige", 21) + "/3)"
            },
            canComplete() {return player.points.gte(new Decimal(1e63).pow(Decimal.pow(2, challengeCompletions("Nanoprestige", 21))))},
            rewardDescription() {
                if (challengeCompletions("Nanoprestige", 21) == 0) return "Increase the power of the second row of Nano buyables."
            },
            unlocked() {return hasUpgrade("Nanoprestige", 54)},
            countsAs: [11],
            completionLimit: 3
        },
        22: {
            name: "Nanofuse",
            challengeDescription: "All previous challenges at once.",
            goalDescription: "1e27 points",
            canComplete: function() {return player.points.gte("1e27")},
            rewardDescription: "Unlock the final Nanoprestige upgrade (before Small Prestige resets).",
            unlocked() {return hasUpgrade("Nanoprestige", 54)},
            countsAs: [11, 12, 21],
            completionLimit: 1
        },

    },
    clickables: {
        11: {
            title: "Hide the top row",
            unlocked() {return hasAchievement("Smallprestige", 11)},
            canClick() {return true},
            onclick() {
                player.Nanoprestige.hiddenRows ++;
            }
        },
        12: {
            title: "Show one row above",
            unlocked() {return hasAchievement("Smallprestige", 11)},
            canClick() {return true},
            onclick() {
                player.Nanoprestige.hiddenRows --;
            }
        }

    },
    autoPrestige() {
        return hasUpgrade("Nanoprestige", 23)
    },
    automate() {
        if (hasUpgrade("Miniprestige",11)) buyBuyable("Nanoprestige", 11)
        if (hasUpgrade("Miniprestige",11)) buyBuyable("Nanoprestige", 12)
        if (hasUpgrade("Miniprestige",11)) buyBuyable("Nanoprestige", 13)
        if (hasUpgrade("Miniprestige",11)) buyBuyable("Nanoprestige", 21)
        if (hasUpgrade("Miniprestige",11)) buyBuyable("Nanoprestige", 22)
        if (hasUpgrade("Miniprestige",11) && hasUpgrade("Nanoprestige", 61)) buyBuyable("Nanoprestige", 23)
        if (hasUpgrade("Miniprestige",11) && hasUpgrade("BrokenNano", 11)) buyBuyable("Nanoprestige", 31)
    },
    doReset(layer) {
        let keep = [];
        if (layer.row == this.row) return
        else if (layer == "Microprestige") {
            if (hasAchievement("Miniprestige", 21)) keep.push("upgrades")
            if (hasAchievement("Miniprestige", 21)) keep.push("hiddenRows")
            if (hasUpgrade("Nanoprestige", 14) || hasUpgrade("Nanoprestige", 41)) keep.push("buyables")
            if (hasChallenge("Nanoprestige", 12)) keep.push ("challenges")
            layerDataReset(this.layer, keep)
        } else if (layer == "Miniprestige") {
            if (hasUpgrade("Nanoprestige", 41) || (hasUpgrade("Miniprestige", 11))) {
                keep.push("upgrades")
                keep.push("buyables")
                keep.push("hiddenRows")
            }
                if (hasMilestone("BrokenNano", 0)) keep.push("challenges")

            if (hasAchievement("Smallprestige", 21)) keep.push("upgrades")
            layerDataReset(this.layer, keep)

        } else if (layer == "Smallprestige") {
            if (hasUpgrade("Miniprestige", 11)) keep.push("upgrades")
            if (hasAchievement("Smallprestige", 21)) keep.push("upgrades")
            layerDataReset(this.layer, keep)


        }
    },
    canBuyMax() {
        return hasUpgrade("Nanoprestige", 23) || player.Smallprestige.best.gte(1)
    },
    bars: {
        break: {
            direction: RIGHT,
            width:200,
            height:10,
            progress() {
                var prog = 0
                if (hasUpgrade("Microprestige",34)) prog += 0.33
                if (hasUpgrade("Microprestige",41)) prog += 0.33
                if (hasUpgrade("Miniprestige", 12)) prog += 0.33
                if (hasUpgrade("Microprestige",42)) prog += 0.01
                return prog;
            },
            unlocked() {return hasUpgrade("Microprestige", 34)}
        }
    },
    resetsNothing() {return hasUpgrade("Microprestige", 34)},
    tabFormat: {
        "Upgrades": {
            content: ["main-display", "resource-display", "prestige-button", ["bar", "break"], "clickables", "upgrades"],
            unlocked() {return player.Miniprestige.points.gte(1)}
        },
        "Buyables": {
            content: ["main-display", "resource-display", "prestige-button", "buyables"],
            unlocked() {return hasUpgrade("Nanoprestige",13)}          
        },
        "Challenges": {
            content: ["main-display", "resource-display", "prestige-button", "challenges"],
            unlocked() {return hasUpgrade("Nanoprestige", 44)}

        }




    },
    layerShown(){return true}
})
addLayer("BrokenNano", {
    name: "BrokenNano", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "BN", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        points: new Decimal(0),
        redFragments: new Decimal(0),
        blueFragments: new Decimal(0),
        greenFragments: new Decimal(0)
    }},
    color: "#D62900",
    requires: new Decimal(350000), // Can be a function that takes requirement increases into account
    resource: "Nanoprestige Points", // Name of prestige currency
    baseResource: "Nanoprestiges", // Name of resource prestige is based on
    baseAmount() {return player.Nanoprestige.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.9, // Prestige currency exponent
    passiveGeneration() {
        return 30   
    },
    effect() {
        var pow = new Decimal(2)
        if (hasUpgrade("Microprestige", 15)) pow = pow.plus(0.25)
        if (hasUpgrade("Microprestige", 45)) pow = pow.plus(0.25)
        if (hasUpgrade("Nanoprestige", 83)) pow = pow.plus(0.25)
        if (hasUpgrade("Nanoprestige", 93)) pow = pow.plus(upgradeEffect("Nanoprestige", 93))
        if (hasUpgrade("Nanoprestige", 36)) pow = pow.plus(upgradeEffect("Nanoprestige", 36))
        if (hasUpgrade("Microprestige", 55)) pow = pow.plus(upgradeEffect("Microprestige", 55))
        if (hasMilestone("BrokenMicro", 1)) pow = pow.plus(buyableEffect("Nanoprestige", 32))
        return new Decimal(1).plus(Decimal.mul(0.02, player.BrokenNano.points.plus(1).ln().pow(pow)))
    },
    effectDescription() {
        var desc;
        desc = "which are reducing Nanoprestige<br> cost scaling by "
        desc += format(tmp.BrokenNano.effect) + "x"
        return desc
    },
    branches: ["Nanoprestige"],
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade("Nanoprestige", 61)) mult = mult.mul(buyableEffect("Nanoprestige", 23))
        if (hasMilestone("BrokenNano", 2)) mult = mult.mul(2)
        if (hasMilestone("BrokenNano", 4)) mult = mult.mul(player.Nanoprestige.points.pow(1/8))
        if (hasUpgrade("Nanoprestige", 81)) mult = mult.mul(player.Nanoprestige.points.pow(1/6))
        if (hasUpgrade("BrokenNano", 12)) mult = mult.mul(player.Microprestige.points)
        if (hasAchievement("Smallprestige", 21)) mult = mult.mul(achievementEffect("Smallprestige", 21))
        if (hasUpgrade("Nanoprestige", 92)) mult = mult.mul(upgradeEffect("Nanoprestige", 92))
        if (hasUpgrade("Microprestige", 25)) mult = mult.mul(1000)
        if (hasUpgrade("BrokenNano", 23)) mult = mult.mul(upgradeEffect("BrokenNano", 23))
        if (hasUpgrade("Nanoprestige", 94)) mult = mult.mul(upgradeEffect("Nanoprestige", 94))
        if (hasUpgrade("Nanoprestige", 66)) mult = mult.mul("1e100")
        if (hasUpgrade("Nanoprestige", 76)) mult = mult.mul(upgradeEffect("Nanoprestige", 76))
        if (hasUpgrade("Microprestige", 53)) mult = mult.mul(upgradeEffect("Microprestige", 53))
        if (hasUpgrade("Nanoprestige", 96)) mult = mult.mul("1e50")
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade("Nanoprestige", 82)) mult = mult.mul(1.25)
        if (hasUpgrade("Nanoprestige", 85)) mult = mult.mul(1.25)
        if (hasUpgrade("Nanoprestige", 95)) mult = mult.mul(upgradeEffect("Nanoprestige", 95))
        if (hasUpgrade("Nanoprestige", 46)) mult = mult.mul(upgradeEffect("Nanoprestige", 46))
        if (hasUpgrade("Miniprestige", 23)) mult = mult.mul(Decimal.add(1, upgradeEffect("Microprestige", 55)))
        return new Decimal(mult)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    
    upgrades: {
        11: {
            name: "broken1",
            title: "falsify?",
            cost: new Decimal(5e20),
            description: "add the skewer, and buy again",
            unlocked() {return hasUpgrade("Miniprestige", 13)}
        },
        12: {
            name: "broken2",
            title: "retaliate.",
            cost: new Decimal(1e21),
            description: "boost the broken.",
            unlocked() {return hasUpgrade("Miniprestige", 13)}
        },
        13: {
            name: "broken3",
            title: "retroact.",
            cost: new Decimal(2e26),
            description: "use the muscle on micro buyables.",
            unlocked() {return hasUpgrade("Miniprestige", 13)}
        },
        21: {
            name: "broken4",
            title: "twenty one",
            cost: new Decimal(1e50),
            description: "scale down the micro",
            unlocked() {return hasUpgrade("Microprestige", 25)}
        },
        22: {
            name: "broken5",
            title: "¿quieres?",
            cost: new Decimal(1e53),
            description: "cost must reduce, no matter how nano",
            unlocked() {return hasUpgrade("Microprestige", 25)},
            effect() {
                return new Decimal("1e1000").pow(player.Miniprestige.points)
            }
        },
        23: {
            name: "broken6",
            title: ".png",
            cost: new Decimal(3e55),
            description: "points helping points",
            unlocked() {return hasUpgrade("Microprestige", 25)},
            effect() {
                return Decimal.log10(player.points)
            }
        },
    },
    milestones:{
        0: {
            requirementDescription: "2500 Nanoprestige Points",
            done() {return player.BrokenNano.points.gte(2500)},
            effectDescription: "Keep Broken Nanoprestige milestones and Nano challenges on Mini and Micro resets."
        },
        1: {
            requirementDescription: "10,000 Nanoprestige Points",
            done() {return player.BrokenNano.points.gte(10000)},
            effectDescription: "Keep Nanoprestige points on Micro resets."
        },
        2: {
            requirementDescription: "100,000 Nanoprestige Points",
            done() {return player.BrokenNano.points.gte(100000)},
            effectDescription: "Unlock a new Nanoprestige upgrade."
        },
        3: {
            requirementDescription: "1,000,000 Nanoprestige Points",
            done() {return player.BrokenNano.points.gte(1000000)},
            effectDescription: "Unlock a new Nanoprestige upgrade."
        },
        4: {
            requirementDescription: "25,000,000 Nanoprestige Points",
            done() {return player.BrokenNano.points.gte(25000000)},
            effectDescription: "Nanoprestiges boost Nanoprestige Point gain."
        },
        5: {
            requirementDescription: "1,000,000,000 Nanoprestige Points",
            done() {return player.BrokenNano.points.gte(1e9)},
            effectDescription: "Unlock a new Nanoprestige upgrade."
        },
        6: {
            requirementDescription: "10,000,000,000 Nanoprestige Points",
            done() {return player.BrokenNano.points.gte(1e10)},
            effectDescription: "Unlock a new Nanoprestige upgrade."
        },
        7: {
            requirementDescription: "1e40,000 Nanoprestige Points",
            done() {return player.BrokenNano.points.gte("1e40,000")},
            effectDescription: "Slightly increase the power of Nanoultraboost."
        },
        
    },
    achievements: {

    },
    tabFormat: {
        "Upgrades": {
            content: ["main-display", "resource-display", "milestones", "upgrades"],
            unlocked() {return true}
        },
    },
    doReset(layer) {
        let keep = [];
        if (layer.row == this.row) return
        else if (layer == "Microprestige") {
            if (hasMilestone("BrokenNano", 0)) keep.push("milestones")
            if (hasMilestone("BrokenNano", 1)) keep.push("points")
            if (hasMilestone("BrokenNano", 1)) keep.push("upgrades")
            layerDataReset(this.layer, keep)
        } else if (layer == "Miniprestige") {
            if (hasMilestone("BrokenNano", 0)) keep.push("milestones")
            if (hasMilestone("BrokenNano", 1)) keep.push("upgrades")
            layerDataReset(this.layer, keep)

        } else if (layer == "Smallprestige") {
            layerDataReset(this.layer, keep)


        }
    },
    layerShown(){
        return hasUpgrade("Microprestige", 42)}
})