
/* addLayer("Partialprestige", {
    name: "Partialprestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#FE5E41",
    requires: new Decimal(5), // Can be a function that takes requirement increases into account
    resource: "Partial prestiges", // Name of prestige currency
    baseResource: "Small prestiges", // Name of resource prestige is based on
    baseAmount() {return player.Smallprestige.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1, // Prestige currency exponent
    base: 5,
    branches: ["Smallprestige"],
    effect() {
        var eff = player.Partialprestige.points.plus(1)
        return eff
    },
    effectDescription() {
        var desc;
        desc = "which are multiplying Point gain by "
        desc += format(tmp.Partialprestige.effect) + "x"
        return desc
    },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 4, // Row the layer is in on the tree (0 is the first row)
    layerShown(){
        return player.Smallprestige.best.gte(4) || player.Partialprestige.best.gte(1)}
})
*/
addLayer("nanoCube1", {
    name:"nanoCube1",
    symbol:"NC1",
    position: -2,
    color: "#ffffff",
    resource: "activations",
    startData() {return {
        unlocked: true,
        points:new Decimal(0),
    }},
    type: "static", 
    prestigeButtonText() {return "PUSH FORWARD"},
    baseResource: "Square Tokens",
    baseAmount() {
        let sqAmt = new Decimal(hasAchievement("nanoExtra", 61) + hasAchievement("nanoExtra", 62) + hasAchievement("nanoExtra", 63) + hasAchievement("nanoExtra", 64) + hasAchievement("nanoExtra", 65) + hasAchievement("nanoExtra", 66))
        sqAmt = sqAmt.minus(player.nanoCube1.points).minus(player.nanoCube2.points).minus(player.nanoCube3.points).minus(player.nanoCube4.points).minus(player.nanoCube5.points).minus(player.nanoCube6.points)
        return new Decimal(sqAmt)
    },
    requires: new Decimal(1),
    base: 10,
    row:0,
    exponent: 50,
    layerShown() {return false},
    doReset(layer) {
        return
    },
    
    resetsNothing:true,
    milestones: {
        0: {
            requirementDescription: "Base Effect",
            done() {return player.nanoExtra.points.gte(1000) && player.nanoCube1.points.gte(1)},
            effectDescription() {return "Multiply Point gain by Nanoprestige effect, exponentiate Point gain by Microprestige effect, dilate Point gain by Miniprestige effect, and so on, ^" + format(tmp.nanoCube1.milestones[0].effect)},
            effect() {
                return softcap(player.nanoExtra.points.log10().div(50).times(player.nanoExtra.points.pow(1/10)), 1, 0.5)

            },

        },
        1: {
            requirementDescription: "Unlock: What's the Point completion 2",
            done() {return false && player.nanoCube1.points.gte(1)},
            effectDescription: "Increase the Cascade Rate and Exchange Rate of CM by 1 for every 1e3 renown."
        },
        3: {
            requirementDescription: "1e65 Renown",
            done() {return player.nanoExtra.points.gte(1e65) && player.nanoCube1.points.gte(1)},
            effectDescription: "The 5000 renown bonus works in the <em> What's the Point? </em> challenge, at a greatly reduced rate."
        },
    },
},)

addLayer("nanoCube2", {
    name:"nanoCube2",
    symbol:"NC1",
    position: -2,
    color: "#ffffff",
    layerShown() {return false},
    startData() {return {
        unlocked: true,
        points:new Decimal(0),
    }},
    type: "static", 
    prestigeButtonText() {return "DOUBLE DOWN"},
    baseResource: "Square Tokens",
    baseAmount() {
        let sqAmt = new Decimal(hasAchievement("nanoExtra", 61) + hasAchievement("nanoExtra", 62) + hasAchievement("nanoExtra", 63) + hasAchievement("nanoExtra", 64) + hasAchievement("nanoExtra", 65) + hasAchievement("nanoExtra", 66))
        sqAmt = sqAmt.minus(player.nanoCube1.points).minus(player.nanoCube2.points).minus(player.nanoCube3.points).minus(player.nanoCube4.points).minus(player.nanoCube5.points).minus(player.nanoCube6.points)
        return sqAmt
    },
    requires: new Decimal(1),
    base: 10,
    row:0,
    exponent: 50,
    resetsNothing:true,
    milestones: {
        0: {
            requirementDescription: "1000 Renown",
            done() {return player.nanoExtra.points.gte(1000) && player.nanoCube2.points.gte(1)},
            effect() {
                return player.nanoExtra.points.log10().div(50).times(player.nanoExtra.points.pow(1/10)).plus(1)

            },
            effectDescription() { return "Buyables gain a bonus to effect each time they are bought, +" + format(tmp.nanoCube2.milestones[0].effect.minus(1).times(100)) +"% each."},
            
        },
        1: {
            requirementDescription: "1e8 Renown",
            done() {return false && player.nanoCube2.points.gte(1)},
            effectDescription: "Increase the Cascade Rate and Exchange Rate of CM by 1 for every 1e3 renown."
        },
        3: {
            requirementDescription: "1e10 Renown",
            done() {return player.nanoExtra.points.gte(1e100) && player.nanoCube2.points.gte(1)},
            effectDescription: "The 5000 renown bonus works in the <em> What's the Point? </em> challenge, at a greatly reduced rate."
        },
    },
},)

addLayer("nanoCube3", {
    name:"nanoCube3",
    symbol:"NC3",
    position: -2,
    color: "#ffffff",
    layerShown() {return false},
    startData() {return {
        unlocked: true,
        points:new Decimal(0),
    }},
    type: "static", 
    prestigeButtonText() {return "FLOW PRESSURE"},
    baseResource: "Square Tokens",
    baseAmount() {
        let sqAmt = new Decimal(hasAchievement("nanoExtra", 61) + hasAchievement("nanoExtra", 62) + hasAchievement("nanoExtra", 63) + hasAchievement("nanoExtra", 64) + hasAchievement("nanoExtra", 65) + hasAchievement("nanoExtra", 66))
        sqAmt = sqAmt.minus(player.nanoCube1.points).minus(player.nanoCube2.points).minus(player.nanoCube3.points).minus(player.nanoCube4.points).minus(player.nanoCube5.points).minus(player.nanoCube6.points)
        return sqAmt
    },
    requires: new Decimal(1),
    base: new Decimal(10),
    row:0,
    exponent: new Decimal(50),
    resetsNothing:true,
    milestones: {
        0: {
            requirementDescription: "5000 Renown",
            done() {return player.nanoExtra.points.gte(5000) && player.nanoCube3.points.gte(1)},
            effectDescription: "Raise all bonus levels to any Nano related buyables ^1.10."
        },
        1: {
            requirementDescription: "1e6 Renown",
            done() {return player.nanoExtra.points.gte(1e6) && player.nanoCube3.points.gte(1)},
            effectDescription: "Increase the Cascade Rate and Exchange Rate of CM by 1 for every 1e3 renown."
        },
        3: {
            requirementDescription: "1e10 Renown",
            done() {return player.nanoExtra.points.gte(1e6) && player.nanoCube3.points.gte(1)},
            effectDescription: "The 5000 renown bonus works in the <em> What's the Point? </em> challenge, at a greatly reduced rate."
        },
    },
},)
addLayer("nanoCube4", {
    name:"nanoCube4",
    symbol:"NC4",
    position: -2,
    layerShown() {return false},
    color: "#ffffff",
    startData() {return {
        unlocked: true,
        points:new Decimal(0),
    }},
    type: "static", 
    prestigeButtonText() {return "PRESSURE COOKER"},
    baseResource: "Square Tokens",
    baseAmount() {
        let sqAmt = new Decimal(hasAchievement("nanoExtra", 61) + hasAchievement("nanoExtra", 62) + hasAchievement("nanoExtra", 63) + hasAchievement("nanoExtra", 64) + hasAchievement("nanoExtra", 65) + hasAchievement("nanoExtra", 66))
        sqAmt = sqAmt.minus(player.nanoCube1.points).minus(player.nanoCube2.points).minus(player.nanoCube3.points).minus(player.nanoCube4.points).minus(player.nanoCube5.points).minus(player.nanoCube6.points)
        return sqAmt
    },
    requires: new Decimal(1),
    base: new Decimal(10),
    row:0,
    exponent: new Decimal(50),
    resetsNothing:true,
    milestones: {
        0: {
            requirementDescription: "5000 Renown",
            done() {return player.nanoExtra.points.gte(5000) && player.nanoCube4.points.gte(1)},
            effectDescription: "Each Nanoprestige upgrade bought increases Nanoprestige gain, ^1.10."
        },
        1: {
            requirementDescription: "1e6 Renown",
            done() {return player.nanoExtra.points.gte(1e6) && player.nanoCube4.points.gte(1)},
            effectDescription: "Increase the Cascade Rate and Exchange Rate of CM by 1 for every 1e3 renown."
        },
        3: {
            requirementDescription: "1e10 Renown",
            done() {return player.nanoExtra.points.gte(1e6) && player.nanoCube4.points.gte(1)},
            effectDescription: "The 5000 renown bonus works in the <em> What's the Point? </em> challenge, at a greatly reduced rate."
        },
    },
},)
addLayer("nanoCube5", {
    name:"nanoCube5",
    symbol:"NC5",
    position: -2,
    color: "#ffffff",
    layerShown() {return false},
    startData() {return {
        unlocked: true,
        points:new Decimal(0),
    }},
    type: "static", 
    prestigeButtonText() {return "FORCED BUMP"},
    baseResource: "Square Tokens",
    baseAmount() {
        let sqAmt = new Decimal(hasAchievement("nanoExtra", 61) + hasAchievement("nanoExtra", 62) + hasAchievement("nanoExtra", 63) + hasAchievement("nanoExtra", 64) + hasAchievement("nanoExtra", 65) + hasAchievement("nanoExtra", 66))
        sqAmt = sqAmt.minus(player.nanoCube1.points).minus(player.nanoCube2.points).minus(player.nanoCube3.points).minus(player.nanoCube4.points).minus(player.nanoCube5.points).minus(player.nanoCube6.points)
        return sqAmt
    },
    requires: new Decimal(1),
    base: new Decimal(10),
    row:0,
    exponent: new Decimal(50),
    resetsNothing:true,
    milestones: {
        0: {
            requirementDescription: "5000 Renown",
            done() {return player.nanoExtra.points.gte(5000) && player.nanoCube5.points.gte(1)},
            effectDescription: "Boost constant raised ^1.10^2."
        },
        1: {
            requirementDescription: "1e6 Renown",
            done() {return player.nanoExtra.points.gte(1e6) && player.nanoCube5.points.gte(1)},
            effectDescription: "Increase the Cascade Rate and Exchange Rate of CM by 1 for every 1e3 renown."
        },
        3: {
            requirementDescription: "1e10 Renown",
            done() {return player.nanoExtra.points.gte(1e6) && player.nanoCube5.points.gte(1)},
            effectDescription: "The 5000 renown bonus works in the <em> What's the Point? </em> challenge, at a greatly reduced rate."
        },
    },
},)
addLayer("nanoCube6", {
    name:"nanoCube6",
    symbol:"NC6",
    position: -2,
    color: "#ffffff",
    layerShown() {return false},
    startData() {return {
        unlocked: true,
        points:new Decimal(0),
    }},
    type: "static", 
    prestigeButtonText() {return "OUT OF DATE"},
    baseResource: "Square Tokens",
    baseAmount() {
        let sqAmt = new Decimal(hasAchievement("nanoExtra", 61) + hasAchievement("nanoExtra", 62) + hasAchievement("nanoExtra", 63) + hasAchievement("nanoExtra", 64) + hasAchievement("nanoExtra", 65) + hasAchievement("nanoExtra", 66))
        sqAmt = sqAmt.minus(player.nanoCube1.points).minus(player.nanoCube2.points).minus(player.nanoCube3.points).minus(player.nanoCube4.points).minus(player.nanoCube5.points).minus(player.nanoCube6.points)
        return sqAmt
    },
    requires: new Decimal(1),
    base: new Decimal(10),
    row:0,
    exponent: new Decimal(50),
    resetsNothing:true,
    milestones: {
        0: {
            requirementDescription: "5000 Renown",
            done() {return player.nanoExtra.points.gte(5000) && player.nanoCube6.points.gte(1)},
            effectDescription: "All buyables gain bonus levels based on the amount of levels they would have if they were uncapped, ^1.10."
        },
        1: {
            requirementDescription: "1e6 Renown",
            done() {return player.nanoExtra.points.gte(1e6) && player.nanoCube6.points.gte(1)},
            effectDescription: "Increase the Cascade Rate and Exchange Rate of CM by 1 for every 1e3 renown."
        },
        3: {
            requirementDescription: "1e10 Renown",
            done() {return player.nanoExtra.points.gte(1e6) && player.nanoCube6.points.gte(1)},
            effectDescription: "The 5000 renown bonus works in the <em> What's the Point? </em> challenge, at a greatly reduced rate."
        },
    },
},)

addLayer("nanoExtra", {
    name: "nanoExtra", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "NX", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: -1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
        points:new Decimal(0),
        upgradeMult: [new Decimal(1), new Decimal(1), new Decimal(1), new Decimal(1), new Decimal(1), new Decimal(1)]
    }},
    color: "#47a1e6",
    resource: "Renown",
    requires: new Decimal(1),
    effect() {
        var eff = player.nanoExtra.points.pow(0.1).div(10).plus(1)
        if (hasAchievement("nanoExtra", 19)) eff = eff.pow(1.1)
        return eff
    },
    effectDescription() {
        var desc;
        desc = "which dilates Nanoprestige gain to "
        desc += format(tmp.nanoExtra.effect.times(100)) + "%, but only outside of minigames."
        return desc
    },
    type: "normal",
    base: new Decimal(2),
    exponent: new Decimal(2),
    passiveGeneration() {
       if (hasUpgrade("Nanoprestige", 101)) return new Decimal(0.01)
       else return new Decimal(0)
    },
    baseResource: "Nanocheivements",
    baseAmount() {return new Decimal(player.nanoExtra.achievements.length)},
    row:0,
    achievementPopups() {
        return hasUpgrade("CMEnlarge", 61)
    },
    
    clickables: {
        11: {
            title() {return "Click!"},
            canClick() {return true}
        }
    },
    upgrades: {
        11: {
            name: "Parallel",
            title: "Parallel",
            description: "Unlock the first Minigame, <em> What's The Point? </em>",
            cost: new Decimal(10000),
            unlocked() {return true}            

        }
    },
    infoboxes: {
        nanoAchieve: {
            title: "Nanochievements",
            body() {
                var naLore = "Congratulations on unlocking the Extras for the Nanoprestige layer. "
                naLore += "Once you buy NanoXXI, you passively gain RENOWN based on your NANOCHIEVEMENTS. "
                naLore += "RENOWN is used to power up certain COLUMNAL UPGRADES, gotten by spending SQUARE TOKENS in the many COLUMNAL SETS. "
                naLore += "At base, you gain " + format(new Decimal(player.nanoExtra.achievements.length).pow(2).div(100)) + " RENOWN per second.<br> <br>"
                naLore += "This is then multiplied by your UPGRADE multiplier, giving +0.01x for each 1x1 square of upgrades, +0.02x for each 2x2 square, and so on. This works in three dimensions!<br>"
                naLore += "Your UPGRADE multiplier is currently " + format(player.nanoExtra.upgradeMult[0]) + "x * " + format(player.nanoExtra.upgradeMult[1]) + "x * " + format(player.nanoExtra.upgradeMult[2]) + "x * "
                naLore += format(player.nanoExtra.upgradeMult[3]) + "x * " + format(player.nanoExtra.upgradeMult[4]) + "x = " + format(player.nanoExtra.upgradeMult[5]) + "x."
                return naLore;
            },

        }
    },
    gainMult() {
        var mult = new Decimal(1)
        if (!hasUpgrade("CMEnlarge", 61)) mult = new Decimal(0)
        if (hasAchievement("nanoExtra", 59)) mult = mult.times(2)
        if (hasAchievement("nanoExtra", 19)) mult = mult.times(2)
        mult = mult.times(tmp.Minigames.calculateWTPRenownMult)
        mult = mult.times(player.nanoExtra.upgradeMult[5])
        return mult
    },
    achievements: {
        
        11: {
            done() {return player.Nanoprestige.best.gte(new Decimal("ee10,000"))},
            tooltip: "ee10,000 Nanoprestiges",
            name:"0",
            style: {
                width:"64px",
                height:"64px"
            }
        },
        12: {
            done() {return player.Nanoprestige.best.gte(new Decimal("ee15,000"))},
            tooltip: "ee15,000 Nanoprestiges",
            name:"1",
            style: {
                width:"64px",
                height:"64px"
            }
        },
        13: {
            done() {return player.Nanoprestige.best.gte(new Decimal("ee20,000"))},
            tooltip: "ee20,000 Nanoprestiges",
            name:"2",
            style: {
                width:"64px",
                height:"64px"
            }
        },
        14: {
            done() {return player.Nanoprestige.best.gte(new Decimal("ee25,000"))},
            tooltip: "ee25,000 Nanoprestiges",
            name:"10",
            style: {
                width:"64px",
                height:"64px"
            }
        },
        15: {
            done() {return player.Nanoprestige.best.gte(new Decimal("ee30,000"))},
            tooltip: "ee30,000 Nanoprestiges",
            name:"11",
            style: {
                width:"64px",
                height:"64px"
            }
        },
        16: {
            done() {return player.Nanoprestige.best.gte(new Decimal("ee35,000"))},
            tooltip: "ee35,000 Nanoprestiges",
            name:"12",
            style: {
                width:"64px",
                height:"64px"
            }
        },
        17: {
            done() {return player.Nanoprestige.best.gte(new Decimal("ee40,000"))},
            tooltip: "ee40,000 Nanoprestiges",
            name:"21",
            style: {
                width:"64px",
                height:"64px"
            }
        },
        18: {
            done() {return player.Nanoprestige.best.gte(new Decimal("ee45,000"))},
            tooltip: "ee45,000 Nanoprestiges",
            name:"11",
            style: {
                width:"64px",
                height:"64px"
            }
        },
        19: {
            done() {return hasAchievement("nanoExtra", 18)},
            tooltip: "Large Number Repository. COMPLETION BONUS: 2x Renown gain, Renown effect ^1.10",
            name:"22",
            style: {
                width:"64px",
                height:"64px"
            }
        },
        21: {
            done() {return player.BrokenNano.best.gte(new Decimal("ee20,000"))},
            tooltip: "ee20,000 Nanoprestige Fragments",
            name:"100",
            style: {
                width:"64px",
                height:"64px"
            }
        },
        22: {
            done() {return player.BrokenNano.best.gte(new Decimal("ee25,000"))},
            tooltip: "ee25,000 Nanoprestige Fragments",
            name:"101",
            style: {
                width:"64px",
                height:"64px"
            }
        },
        23: {
            done() {return player.BrokenNano.best.gte(new Decimal("ee30,000"))},
            tooltip: "ee30,000 Nanoprestige Fragments",
            name:"102",
            style: {
                width:"64px",
                height:"64px"
            }
        },
        24: {
            done() {return player.BrokenNano.best.gte(new Decimal("ee40,000"))},
            tooltip: "ee40,000 Nanoprestige Fragments",
            name:"110",
            style: {
                width:"64px",
                height:"64px"
            }
        },
        25: {
            done() {return player.BrokenNano.best.gte(new Decimal("ee50,000"))},
            tooltip: "ee50,000 Nanoprestige Fragments",
            name:"111",
            style: {
                width:"64px",
                height:"64px"
            }
        },
        26: {
            done() {return player.BrokenNano.best.gte(new Decimal("ee62,500"))},
            tooltip: "ee62,500 Nanoprestige Fragments",
            name:"112",
            style: {
                width:"64px",
                height:"64px"
            }
        },
        27: {
            done() {return player.BrokenNano.best.gte(new Decimal("ee75,000"))},
            tooltip: "ee75,000 Nanoprestige Fragments",
            name:"120",
            style: {
                width:"64px",
                height:"64px"
            }
        },
        28: {
            done() {return player.BrokenNano.best.gte(new Decimal("ee100,000"))},
            tooltip: "ee100,000 Nanoprestige Fragments",
            name:"121",
            style: {
                width:"64px",
                height:"64px"
            }
        },
        29: {
            done() {return hasAchievement("nanoExtra", 28)},
            tooltip: "Broken Number Repository <br> REWARD: x2 Renown, and Boost Constant increases based on total Nanoprestige Fragments",
            name:"122",
            style: {
                width:"64px",
                height:"64px"
            }
        },
        31: {
            done() {return tmp.Nanoprestige.buyables[31].totalAmount.plus(tmp.Nanoprestige.buyables[32].totalAmount).gte(350)},
            tooltip: "350 of row 3 Nano buyables",
            name:"200",
            style: {
                width:"64px",
                height:"64px"
            }
        },
        32: {
            done() {return tmp.Nanoprestige.buyables[31].totalAmount.plus(tmp.Nanoprestige.buyables[32].totalAmount).gte(400)},
            tooltip: "400 of row 3 Nano buyables",
            name:"201",
            style: {
                width:"64px",
                height:"64px"
            }
        },
        33: {
            done() {return tmp.Nanoprestige.buyables[31].totalAmount.plus(tmp.Nanoprestige.buyables[32].totalAmount).gte(450)},
            tooltip: "450 of row 3 Nano buyables",
            name:"202",
            style: {
                width:"64px",
                height:"64px"
            }
        },
        34: {
            done() {return tmp.Nanoprestige.buyables[31].totalAmount.plus(tmp.Nanoprestige.buyables[32].totalAmount).gte(500)},
            tooltip: "500 of row 3 Nano buyables",
            name:"210",
            style: {
                width:"64px",
                height:"64px"
            }
        },
        35: {
            done() {return tmp.Nanoprestige.buyables[31].totalAmount.plus(tmp.Nanoprestige.buyables[32].totalAmount).gte(600)},
            tooltip: "600 of row 3 Nano buyables",
            name:"211",
            style: {
                width:"64px",
                height:"64px"
            }
        },
        36: {
            done() {return tmp.Nanoprestige.buyables[31].totalAmount.plus(tmp.Nanoprestige.buyables[32].totalAmount).gte(700)},
            tooltip: "700 of row 3 Nano buyables",
            name:"212",
            style: {
                width:"64px",
                height:"64px"
            }
        },
        37: {
            done() {return tmp.Nanoprestige.buyables[31].totalAmount.plus(tmp.Nanoprestige.buyables[32].totalAmount).gte(850)},
            tooltip: "850 of row 3 Nano buyables",
            name:"220",
            style: {
                width:"64px",
                height:"64px"
            }
        },
        38: {
            done() {return tmp.Nanoprestige.buyables[31].totalAmount.plus(tmp.Nanoprestige.buyables[32].totalAmount).gte(1000)},
            tooltip: "1000 of row 3 Nano buyables",
            name:"221",
            style: {
                width:"64px",
                height:"64px"
            }
        },
        39: {
            done() {return hasAchievement("nanoExtra", 38)},
            tooltip: "Buyable Repository <br> REWARD: 2x Renown, & Raise buyable levels ^1.1",
            name:"222",
            style: {
                width:"64px",
                height:"64px"
            }
        },
        41: {
            done() {return tmp.BrokenNano.buyables[11].totalAmount.gte("1e75")},
            tooltip: "1e75 total BREAK I.",
            name:"1000",
            style: {
                width:"64px",
                height:"64px"
            }
        },
        42: {
            done() {return tmp.BrokenNano.buyables[11].totalAmount.gte("1e80")},
            tooltip: "1e80 total BREAK I.",
            name:"1001",
            style: {
                width:"64px",
                height:"64px"
            }
        },
        43: {
            done() {return tmp.BrokenNano.buyables[11].totalAmount.gte("1e100")},
            tooltip: "1e90 total BREAK I.",
            name:"1002",
            style: {
                width:"64px",
                height:"64px"
            }
        },
        44: {
            done() {return tmp.BrokenNano.buyables[11].totalAmount.gte("1e250")},
            tooltip: "1e250 total BREAK I.",
            name:"1010",
            style: {
                width:"64px",
                height:"64px"
            }
        },
        45: {
            done() {return tmp.BrokenNano.buyables[11].totalAmount.gte("1e1000")},
            tooltip: "1e1000 total BREAK I.",
            name:"1011",
            style: {
                width:"64px",
                height:"64px"
            }
        },
        46: {
            done() {return tmp.BrokenNano.buyables[11].totalAmount.gte("1e2000")},
            tooltip: "1e2000 total BREAK I.",
            name:"1012",
            style: {
                width:"64px",
                height:"64px"
            }
        },
        47: {
            done() {return tmp.BrokenNano.buyables[11].totalAmount.gte("1e3000")},
            tooltip: "1e3000 total BREAK I.",
            name:"1020",
            style: {
                width:"64px",
                height:"64px"
            }
        },
        48: {
            done() {return tmp.BrokenNano.buyables[11].totalAmount.gte("1e10000")},
            tooltip: "1e10000 total BREAK I.",
            name:"1021",
            style: {
                width:"64px",
                height:"64px"
            }
        },
        49: {
            done() {return hasAchievement("nanoExtra", 48)},
            tooltip: "Breaking Cycle <br> REWARD: x2 Renown, & All Nano buyables level ^1.1",
            name:"1022",
            style: {
                width:"64px",
                height:"64px"
            }
        },
        51: {
            done() {return player.points.gte("ee75000") && inChallenge("Nanoprestige", 22)},
            tooltip: "ee75000 points in Nanofuse",
            name:"1100",
            style: {
                width:"64px",
                height:"64px"
            }
        },
        52: {
            done() {return player.points.gte("1ee100000") && inChallenge("Nanoprestige", 22)},
            tooltip: "ee100,000 points in Nanofuse",
            name:"1101",
            style: {
                width:"64px",
                height:"64px"
            }
        },
        53: {
            done() {return player.points.gte("5ee5e5") && inChallenge("Nanoprestige", 22)},
            tooltip: "5ee5e5 points in Nanofuse",
            name:"1102",
            style: {
                width:"64px",
                height:"64px"
            }
        },
        54: {
            done() {return player.points.gte("1eee6") && inChallenge("Nanoprestige", 22)},
            tooltip: "1eee6 points in Nanofuse",
            name:"1110",
            style: {
                width:"64px",
                height:"64px"
            }
        },
        55: {
            done() {return player.points.gte("1eee7") && inChallenge("Nanoprestige", 22)},
            tooltip: "1eee7 points in Nanofuse",
            name:"1111",
            style: {
                width:"64px",
                height:"64px"
            }
        },
        56: {
            done() {return player.points.gte("1eee8") && inChallenge("Nanoprestige", 22)},
            tooltip: "1eee8 points in Nanofuse",
            name:"1112",
            style: {
                width:"64px",
                height:"64px"
            }
        },
        57: {
            done() {return player.points.gte("1ee1e9") && inChallenge("Nanoprestige", 22)},
            tooltip: "1eee9 points in Nanofuse",
            name:"1120",
            style: {
                width:"64px",
                height:"64px"
            }
        },
        58: {
            done() {return player.points.gte("1ee1e10") && inChallenge("Nanoprestige", 22)},
            tooltip: "1eee10 points in Nanofuse",
            name:"1121",
            style: {
                width:"64px",
                height:"64px"
            }
        },
        59: {
            done() {return hasAchievement("nanoExtra", 58)},
            tooltip: "Challenge Accepted <br> REWARD: x2 Renown, and a sense of disappointment",
            name:"1122",
            style: {
                width:"64px",
                height:"64px"
            }
        },
        61: {
            done() {return player.Nanoprestige.upgrades.length >= 25},
            tooltip: "25 Nanoprestige upgrades. Reward: 1 Square Token",
            name:"1200",
            style: {
                width:"64px",
                height:"64px"
            }
        },
        62: {
            done() {return player.Nanoprestige.upgrades.length >= 50},
            tooltip: "50 Nanoprestige upgrades. Reward: 1 Square Token",
            name:"1201",
            style: {
                width:"64px",
                height:"64px"
            }
        },
        63: {
            done() {return player.Nanoprestige.upgrades.length >= 75},
            tooltip: "75 Nanoprestige upgrades. Reward: 1 Square Token",
            name:"1202",
            style: {
                width:"64px",
                height:"64px"
            }
        },
        64: {
            done() {return player.Nanoprestige.upgrades.length >= 100},
            tooltip: "100 Nanoprestige upgrades. Reward: 1 Square Token",
            name:"1210",
            style: {
                width:"64px",
                height:"64px"
            }
        },
        65: {
            done() {return player.Nanoprestige.upgrades.length >= 125},
            tooltip: "All 125 Nanoprestige upgrades. Reward: 1 Square Token",
            name:"1211",
            style: {
                width:"64px",
                height:"64px"
            }
        },
        66: {
            done() {return false},
            tooltip: "Complete <em> What's the Point </em> for the tenth time. Reward: 1 Square Token",
            name:"1212",
            style: {
                width:"64px",
                height:"64px"
            }
        },
    },
    
    tabFormat: {
        "Nanochievements": {
            content: ["main-display", "resource-display",["infobox", "nanoAchieve"], "upgrades", "achievements"],
        },
        "Push Forward (F)": {
            unlocked() {return hasAchievement("Unlockers", 62)},
            embedLayer: "nanoCube1"
        },
        "Double Down (B)": {
            unlocked() {return hasAchievement("Unlockers", 67)},
            embedLayer: "nanoCube2"
        },
        "Flow Pressure (R)": {
            unlocked() {return hasAchievement("Unlockers", 67)},
            embedLayer: "nanoCube3"
        },
        "Pressure Cooker (L)": {
            unlocked() {return hasAchievement("Unlockers", 67)},
            embedLayer: "nanoCube4"
        },
        "Forced Bump (U)": {
            unlocked() {return hasAchievement("Unlockers", 67)},
            embedLayer: "nanoCube5"
        },
        "Up to Date (D)": {
            unlocked() {return hasAchievement("Unlockers", 67)},
            embedLayer: "nanoCube6"
        }

    },
    resetsNothing: true,
    doReset(layer) {
        return
    },
    layerShown(){return hasUpgrade("CMEnlarge", 61)}
})

function setNanoUpgradeMultiplier() {
	player.nanoExtra.upgradeMult[0] = new Decimal(1).plus(Decimal.div(player.Nanoprestige.upgrades.length, 100))
	player.nanoExtra.upgradeMult[1] = new Decimal(1)
	for (var h = 0; h <= 4; h++) {
		for (var i = 1 + (5*h); i <= 4 + (5*h); i++) {
			for (var j = 1; j <= 4; j++) {
				if (hasUpgrade("Nanoprestige", i*10 + j) && hasUpgrade("Nanoprestige", (i+1)*10 + j) && hasUpgrade("Nanoprestige", i*10 + (j+1)) && hasUpgrade("Nanoprestige", (i+1)*10 + j + 1)) player.nanoExtra.upgradeMult[1] = player.nanoExtra.upgradeMult[1].plus(0.02)
			}
		}
	}
	for (var h = 0; h <= 3; h++) {
		for (var i = 1 + (5*h); i <= 4 + (5*h); i++) {
			for (var j = 1; j <= 5; j++) {
				if (hasUpgrade("Nanoprestige", i*10 + j) && hasUpgrade("Nanoprestige", (i+1)*10 + j) && hasUpgrade("Nanoprestige", (i+5)*10 + j) && hasUpgrade("Nanoprestige", (i+1+5)*10 + j)) player.nanoExtra.upgradeMult[1] = player.nanoExtra.upgradeMult[1].plus(0.02)
			}
		}
	}
	for (var h = 0; h <= 3; h++) {
		for (var i = 1 + (5*h); i <= 5 + (5*h); i++) {
			for (var j = 1; j <= 4; j++) {
				if (hasUpgrade("Nanoprestige", i*10 + j) && hasUpgrade("Nanoprestige", (i)*10 + (j+1)) && hasUpgrade("Nanoprestige", (i+5)*10 + j) && hasUpgrade("Nanoprestige", (i+5)*10 + (j+1))) player.nanoExtra.upgradeMult[1] = player.nanoExtra.upgradeMult[1].plus(0.02)
			}
		}
	}
	player.nanoExtra.upgradeMult[2] = new Decimal(1)
    for (var h = 0; h <= 4; h++) {
		for (var i = 1 + (5*h); i <= 3 + (5*h); i++) {
			for (var j = 1; j <= 3; j++) {
                let verification = 1;
                for (var k = 0; k <= 2; k++) {
                    for (var l = 0; l <= 2; l++) {
				        verification = verification * hasUpgrade("Nanoprestige", (i+k)*10 + (j+l)) 
                    }
                }
                if (verification == true) player.nanoExtra.upgradeMult[2] = player.nanoExtra.upgradeMult[2].plus(0.03)
			}
		}
    }
    player.nanoExtra.upgradeMult[3] = new Decimal(1)
    for (var h = 0; h <= 4; h++) {
		for (var i = 1 + (5*h); i <= 2 + (5*h); i++) {
			for (var j = 1; j <= 2; j++) {
                let verification = 1;
                for (var k = 0; k <= 3; k++) {
                    for (var l = 0; l <= 3; l++) {
					    verification = verification * hasUpgrade("Nanoprestige", (i+k)*10 + (j+l)) 
                    }
                }
                if (verification == true) player.nanoExtra.upgradeMult[3] = player.nanoExtra.upgradeMult[3].plus(0.04)
			}
		}
    }
    player.nanoExtra.upgradeMult[4] = new Decimal(1)
        for (var h = 0; h <= 4; h++) {
			for (var i = 1 + (5*h); i <= 1 + (5*h); i++) {
				for (var j = 1; j <= 1; j++) {
                    let verification = 1;
                    for (var k = 0; k <= 4; k++) {
                        for (var l = 0; l <= 4; l++) {
					     verification = verification * hasUpgrade("Nanoprestige", (i+k)*10 + (j+l)) 
                        }
                    }
                    if (verification == true) player.nanoExtra.upgradeMult[4] = player.nanoExtra.upgradeMult[4].plus(0.05)
				}
			}
        }
    
        player.nanoExtra.upgradeMult[5] = new Decimal(1).times(player.nanoExtra.upgradeMult[0]).times(player.nanoExtra.upgradeMult[1]).times(player.nanoExtra.upgradeMult[2]).times(player.nanoExtra.upgradeMult[3]).times(player.nanoExtra.upgradeMult[4])

}