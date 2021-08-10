addLayer("r", {
	name: "rectangle", // This is optional, only used in a few places, If absent it just uses the layer id.
	symbol: "R", // This appears on the layer's node. Default is the id with the first letter capitalized
	position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
	startData() { return {
		unlocked: false,

		points: new Decimal(0),
		best: new Decimal(0),
		total: new Decimal(0),
	}},
	color: "#13d5d5",
	requires() {
		req = new Decimal('1e9');
		return req;
	},
	resource: "rectangles", // Name of prestige currency
	baseResource: "lines", // Name of resource prestige is based on
	baseAmount() { return player.l.points }, // Get the current amount of baseResource
	type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
	exponent: 1.5, // Prestige currency exponent
	base: 5,
	gainMult() { // Calculate the multiplier for main currency from bonuses
		mult = new Decimal(1);
		return mult;
	},
	gainExp() { // Calculate the exponent on main currency from bonuses
		exp = new Decimal(1);
		return exp;
	},
	row: 1, // Row the layer is in on the tree (0 is the first row)
	hotkeys: [
		{ key: "r", description: "R: Reset for rectangles", onPress() { if (canReset(this.layer)) doReset(this.layer) } },
	],
	branches: ['l'],
	layerShown() { return hasAchievement('a', 14) },
	resetDescription() { return `Arrange <b>${formatWhole(player.l.points)}</b> lines to make ` },
	tabFormat: [
		'main-display',
		'prestige-button',
		'resource-display',
		'upgrades',
	],
});