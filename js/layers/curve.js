addLayer("c", {
	name: "curve", // This is optional, only used in a few places, If absent it just uses the layer id.
	symbol: "C", // This appears on the layer's node. Default is the id with the first letter capitalized
	position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
	startData() { return {
		unlocked: false,

		points: new Decimal(0),
		best: new Decimal(0),
		total: new Decimal(0),
	}},
	color: "#9526e0",
	requires() {
		req = new Decimal(15000);
		return req;
	},
	resource: "curves", // Name of prestige currency
	baseResource: "lines", // Name of resource prestige is based on
	baseAmount() { return player.l.points }, // Get the current amount of baseResource
	type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
	exponent: 0.5, // Prestige currency exponent
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
		{ key: "c", description: "C: Reset for curves", onPress() { if (canReset(this.layer)) doReset(this.layer) } },
	],
	branches: ['l'],
	layerShown() { return hasUpgrade('l', 34) || hasAchievement('a', 14) },
	resetDescription() { return `Bend <b>${formatWhole(player.l.points)}</b> lines to make ` },
	tabFormat: [
		'main-display',
		'prestige-button',
		'resource-display',
		'upgrades',
	],
	effect() {
		eff = new Decimal(1.5).add(1).pow(player.c.points.add(1));
		eff = softcap(eff, new Decimal(100), 0.5)
		if (player.c.total.eq(0)) eff = new Decimal(1);
		return eff;
	},
	effectDescription() { return `which are boosting point gain by ${format(tmp.c.effect)}x` },
	milestones: {

	},
	upgrades: {
		11: {
			title: 'Minicurves',
			description: 'Curves boost line gain',
			cost: new Decimal(1),
			effect() {
				eff = player[this.layer].points.plus(2).pow(1.2);
				eff = softcap(eff, new Decimal(25), 0.1);
				return eff;
			},
			effectDisplay() { return `${format(upgradeEffect('c', 11))}x` }
		},
		12: {
			title: 'Roundness',
			description: 'Curves boost line particle gain',
			cost: new Decimal(1),
			unlocked() { return hasUpgrade('c', 11) },
			effect() {
				eff = player[this.layer].points.plus(2).pow(1.5);
				eff = softcap(eff, new Decimal(25), 0.5);
				return eff;
			},
			effectDisplay() { return `${format(upgradeEffect('c', 12))}x` }
		},
		13: {
			title: 'Generaler Boost',
			description: 'Total curves boost point, line and line particle gain',
			cost: new Decimal(2),
			unlocked() { return hasUpgrade('c', 12) },
			effect() {
				eff = player[this.layer].total.plus(2).pow(0.5);
				return eff;
			},
			effectDisplay() { return `${format(upgradeEffect('c', 13))}x` }
		},
	},
});