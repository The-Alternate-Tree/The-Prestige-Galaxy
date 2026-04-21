let modInfo = {
  name: "The Prestige Galaxy",
  id: "TPG",
  author: "liam",
  pointsName: "points",
  modFiles: ["layers.js", "tree.js"],

  discordName: "",
  discordLink: "https://discord.gg/GrMEPW7JZT",
  initialStartPoints: new Decimal(0), // Used for hard resets and new players
  offlineLimit: 0, // In hours
};

// Set your version in num and name
let VERSION = {
  num: "1.01",

  name: "Achievement Rework",
};

let changelog = `<h1>Changelog:</h1><br>
<h3><br><br>v1.01 - Achievement Rework - 4/21/2026</h3><br>
		
		- Achievements layer now has no subtab in it <br>
		- Added colored borders to some achievements <br>
		- Remade the achievement info <br>
		- Fixed the achievement layer tooltip saying "0 undefined" <br>


<h3><br><br>v1.00 - Base Game - 4/19/2026</h3><br>
		- Added 2 layers <br>
		- Added 13 upgrades <br>
		- Added 8 achievements <br>

	<h3><br><br>v0.0</h3><br>
		- Added things.<br>
		- Added stuff.`;

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`;

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"];

function getStartPoints() {
  return new Decimal(modInfo.initialStartPoints);
}

// Determines if it should show points/sec
function canGenPoints() {
  return true;
}

// Calculate points/sec!
function getPointGen() {
  if (!canGenPoints()) return new Decimal(0);
  base = new Decimal(1);
  mult = new Decimal(1);
  exp = new Decimal(1);
  eff = upgradeEffect;
  hu = hasUpgrade;
  hm = hasMilestone;
  hc = hasChallenge;
  ha = hasAchievement;
  ic = inChallenge;
  be = buyableEffect;

  if (hu("p", 11)) mult = mult.times(2);
  if (hu("p", 12)) mult = mult.times(eff("p", 12));
  if (hu("p", 13)) mult = mult.times(eff("p", 13));
  if (hu("p", 14)) mult = mult.times(eff("p", 14));
  if (hu("p", 21)) mult = mult.times(4);
  if (hu("s", 11)) mult = mult.times(5);
  if (hu("s", 12)) mult = mult.times(10);
  if (hu("s", 13)) mult = mult.times(8);

  return base.times(mult).pow(exp);
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() {
  return {};
}

// Display extra things at the top of the page
var displayThings = [];

// Determines when the game "ends"
function isEndgame() {
  return player.points.gte(new Decimal("e280000000"));
}

// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {};

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
  return 3600; // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion) {}
