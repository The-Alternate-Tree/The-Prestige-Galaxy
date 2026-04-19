// code shortcuts:
eff = upgradeEffect;
hu = hasUpgrade;
hm = hasMilestone;
hc = hasChallenge;
ha = hasAchievement;
ic = inChallenge;
be = buyableEffect;
// layers:
addLayer("p", {
  name: "prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
  symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
  position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
  startData() {
    return {
      unlocked: true,
      points: new Decimal(0),
      best: new Decimal(0),
      total: new Decimal(0),
      time: new Decimal(),
    };
  },
  infoboxes: {
    layer1info: {
      title: "Welcome To The Prestige Galaxy!",
      body: "Hello! Welcome to The Prestige Galaxy. This game will have lots of upgrades to boost progression. If you ever get stuck, check achievements, as some have rewards that will help or be required for progression. Also, if you havent already, you should play The Incremental Tree before playing this game, as this is ment to be a sequal.",
    },
  },
  passiveGeneration() {
    return 0;
  },
  doReset(resettingLayer) {
    let keep = [];

    if (layers[resettingLayer].row > this.row) layerDataReset("p", keep);
  },
  color: "#0ded16",
  requires: new Decimal(10), // Can be a function that takes requirement increases into account
  resource: "prestige points", // Name of prestige currency
  baseResource: "points", // Name of resource prestige is based on
  baseAmount() {
    return player.points;
  }, // Get the current amount of baseResource
  type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
  exponent: 0.5, // Prestige currency exponent
  gainMult() {
    // Calculate the multiplier for main currency from bonuses
    mult = new Decimal(1);
    if (hu("p", 22)) mult = mult.times(3);
    if (hu("s", 11)) mult = mult.times(3);
    if (hu("s", 13)) mult = mult.times(4);

    return mult;
  },
  gainExp() {
    // Calculate the exponent on main currency from bonuses
    exp = new Decimal(1);
    return exp;
  },
  row: 1, // Row the layer is in on the tree (0 is the first row)
  hotkeys: [
    {
      key: "p",
      description: "P: Reset for prestige points",
      onPress() {
        if (canReset(this.layer)) doReset(this.layer);
      },
    },
  ],
  layerShown() {
    return true;
  },
  tabFormat: {
    upgrades: {
      content: [
        ["infobox", "layer1info"],
        "main-display",
        "prestige-button",
        "resource-display",
        ["blank", "5px"], // Height

        "upgrades",
      ],
    },
  },
  upgrades: {
    11: {
      title: "More Points",
      description:
        "For your first upgrade, double point gain. I know, very orginal.",
      cost: new Decimal(1),
      unlocked() {
        return player[this.layer].unlocked;
      }, // The upgrade is only visible when this is true
    },
    12: {
      title: "Prestiged Points",
      description: "Prestige points now boost point gain.",
      cost: new Decimal(3),
      unlocked() {
        return hu("p", 11);
      }, // The upgrade is only visible when this is true
      effect() {
        // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
        let ret = player.p.points.add(1).pow(0.4);
        if (ret.gte("1e30")) ret = ret.sqrt().times("1e15");
        return ret;
      },
      effectDisplay() {
        return format(this.effect()) + "x";
      }, // Add formatting to the effect
    },
    13: {
      title: "Small Boost",
      description: "Multiply point gain by 1.6x.",
      cost: new Decimal(10),
      unlocked() {
        return hu("p", 12);
      }, // The upgrade is only visible when this is true
      effect() {
        // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
        let ret = new Decimal(1.6);
        if (hu("p", 23)) ret = new Decimal(2);
        if (hu("p", 24)) ret = new Decimal(2.3);
        if (hu("p", 25)) ret = new Decimal(2.6);

        if (hu("p", 15)) ret = ret.pow(eff("p", 15));
        return ret;
      },
      effectDisplay() {
        return format(this.effect()) + "x";
      }, // Add formatting to the effect
    },
    14: {
      title: "Repetition...",
      description: "Prestige pointss boost points, but more, and caps at 500x.",
      cost: new Decimal(25),
      unlocked() {
        return hu("p", 13);
      }, // The upgrade is only visible when this is true
      effect() {
        // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
        let ret = player.p.points.add(1).pow(0.5);
        if (ret.gte("500")) ret = new Decimal(500);
        return ret;
      },
      effectDisplay() {
        return format(this.effect()) + "x";
      }, // Add formatting to the effect
    },
    15: {
      title: "Boost The Boost!",
      description:
        "Wait, that's used in TPTR. Anyways, raise <b>Small Boost</b>'s effect based on prestige upgrades.",
      cost: new Decimal(250),
      unlocked() {
        return hu("p", 14);
      }, // The upgrade is only visible when this is true
      effect() {
        // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
        let ret = new Decimal(player.p.upgrades.length).pow(0.75);
        if (ha("ach", 14)) ret = ret.times(1.2);
        if (ha("ach", 21)) ret = ret.times(1.25);

        return ret;
      },
      effectDisplay() {
        return "^" + format(this.effect()) + "";
      }, // Add formatting to the effect
    },
    21: {
      title: "Even More Points",
      description: "Gain 4x as many points.",
      cost: new Decimal(1000),
      unlocked() {
        return hu("p", 15);
      }, // The upgrade is only visible when this is true
    },
    22: {
      title: "More Prestige",
      description: "Triple prestige point gain.",
      cost: new Decimal(10000),
      unlocked() {
        return hu("p", 21);
      }, // The upgrade is only visible when this is true
    },
    23: {
      title: "Big Boost",
      description: "<b>Small Boost</b>'s effect base is 2.",
      cost: new Decimal(100000),
      unlocked() {
        return hu("p", 22);
      }, // The upgrade is only visible when this is true
    },
    24: {
      title: "Biggest Boost",
      description:
        "<b>Small Boost</b>'s effect base is 2.3. I couldn't think of anything okay?",
      cost: new Decimal(350000),
      unlocked() {
        return hu("p", 23);
      }, // The upgrade is only visible when this is true
    },
    25: {
      title: "The Last One",
      description:
        "Unlock super prestige and <b>Small Boost</b>'s effect base is 2.6.",
      cost: new Decimal(1e6),
      unlocked() {
        return hu("p", 24);
      }, // The upgrade is only visible when this is true
    },
  },
});
addLayer("s", {
  name: "super prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
  symbol: "SP", // This appears on the layer's node. Default is the id with the first letter capitalized
  position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
  startData() {
    return {
      unlocked: false,
      points: new Decimal(0),
      best: new Decimal(0),
      total: new Decimal(0),
      time: new Decimal(),
    };
  },
  infoboxes: {},
  color: "#3d7cf7",
  requires: new Decimal(10e6), // Can be a function that takes requirement increases into account
  resource: "super prestige points", // Name of prestige currency
  baseResource: "prestige points", // Name of resource prestige is based on
  baseAmount() {
    return player.p.points;
  }, // Get the current amount of baseResource
  type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
  exponent: 0.52, // Prestige currency exponent
  gainMult() {
    // Calculate the multiplier for main currency from bonuses
    mult = new Decimal(1);
    if (hu("s", 13)) mult = mult.times(2);

    return mult;
  },
  gainExp() {
    // Calculate the exponent on main currency from bonuses
    exp = new Decimal(1);
    return exp;
  },
  row: 2, // Row the layer is in on the tree (0 is the first row)
  hotkeys: [
    {
      key: "s",
      description: "S: Reset for super prestige points",
      onPress() {
        if (canReset(this.layer)) doReset(this.layer);
      },
    },
  ],
  layerShown() {
    return hu("p", 25) || player.s.unlocked;
  },
  tabFormat: {
    upgrades: {
      content: [
        "main-display",
        "prestige-button",
        "resource-display",
        ["blank", "5px"], // Height

        "upgrades",
      ],
    },
  },
  passiveGeneration() {
    return 0;
  },
  doReset(resettingLayer) {
    let keep = [];

    if (layers[resettingLayer].row > this.row) layerDataReset("s", keep);
  },
  branches: ["p"],
  upgrades: {
    11: {
      title: "Super Boost",
      description: "Gain 5x more points and 3x more prestige points.",
      cost: new Decimal(1),
      unlocked() {
        return player[this.layer].unlocked;
      }, // The upgrade is only visible when this is true
    },
    12: {
      title: "Just Another Upgrade",
      description: "X10 point gain.",
      cost: new Decimal(4),
      unlocked() {
        return hu("s", 11);
      }, // The upgrade is only visible when this is true
    },
    13: {
      title: "So Many Boosts",
      description:
        "X8 point gain, x4 prestige point gain, and x2 super prestige point gain.",
      cost: new Decimal(10),
      unlocked() {
        return hu("s", 12);
      }, // The upgrade is only visible when this is true
    },
  },
});
addLayer("ach", {
  name: "achievements", // This is optional, only used in a few places, If absent it just uses the layer id.
  symbol: "A", // This appears on the layer's node. Default is the id with the first letter capitalized
  position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
  startData() {
    return {
      unlocked: true,
    };
  },
  infoboxes: {
    achievementInfo: {
      title: "Achievements",
      body: "These are achievements. Some are just for flexing, and others are very important. Sometimes achievements can give <b>rewards</b>, so check them when you feel stuck. Achievements are only reset on <b>hard resets</b>, so you'll never lose them. This layer also contains a progress bar that shows how close you are to the endgame.",
    },
  },
  color: "yellow",

  type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have

  row: "side", // Row the layer is in on the tree (0 is the first row)

  layerShown() {
    return true;
  },
  tabFormat: {
    achievements: {
      content: [
        ["infobox", "achievementInfo"],
        "main-display",

        ["blank", "5px"], // Height
        ["bar", "progress"],
        ["blank", "5px"], // Height

        "achievements",
      ],
    },
  },
  bars: {
    progress: {
      fillStyle: { "background-color": "yellow" },
      baseStyle: { "background-color": "white" },
      textStyle: { color: "black" },
      borderStyle() {
        return {};
      },
      direction: RIGHT,
      width: 600,
      height: 30,
      progress() {
        return new Decimal(player.ach.achievements.length).div(8);
      },
      display() {
        return (
          "You have completed " +
          formatWhole(player.ach.achievements.length) +
          " / 8 achievements"
        );
      },
      unlocked: true,
    },
  },
  achievements: {
    11: {
      name: "First Reset",
      done() {
        return player.p.points.gte(1);
      }, // This one is a freebie
      tooltip: "Get a prestige point.",
    },
    12: {
      name: "The Achievement Galaxy",
      done() {
        return hu("p", 12);
      }, // This one is a freebie
      tooltip: "Buy 2 prestige upgrades.",
    },
    13: {
      name: "Repeting Things? Already?",
      done() {
        return hu("p", 14);
      }, // This one is a freebie
      tooltip: "Buy 4 prestige upgrades.",
    },
    14: {
      name: "Point City",
      done() {
        return player.points.gte(50000);
      }, // This one is a freebie
      tooltip:
        "get 50,000 points. <br> Reward: <b>Boost The Boost</b> is 20% stronger.",
    },
    15: {
      name: "One Layer Down",
      done() {
        return hu("p", 25);
      }, // This one is a freebie
      tooltip: "Unlock super prestige.",
    },
    21: {
      name: "Almost There...",
      done() {
        return player.p.points.gte(2.5e6);
      }, // This one is a freebie
      tooltip:
        "Get 2,500,000 prestige points. <br> Reward: <b>Boost The Boost</b>'s effect is 25% stronger.",
    },
    22: {
      name: "Super Reset",
      done() {
        return player.s.points.gte(1);
      }, // This one is a freebie
      tooltip: "Super prestige.",
    },
    23: {
      name: "These Upgrades Are Super",
      done() {
        return hu("s", 13);
      }, // This one is a freebie
      tooltip: "Buy super prestige upgrade 3.",
    },
  },
});
