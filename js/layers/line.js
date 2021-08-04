addLayer("l", {
	name: "line", // This is optional, only used in a few places, If absent it just uses the layer id.
	symbol: "L", // This appears on the layer's node. Default is the id with the first letter capitalized
	position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
	startData() { return {
		unlocked: true,
		points: new Decimal(0),
		best: new Decimal(0),
		total: new Decimal(0),
	}},
	color: "#5b26e0",
	requires() {
		req = new Decimal(10);
		if (hasUpgrade('l', 13)) req = req.div(2);
		return req;
	}, // Can be a function that takes requirement increases into account
	resource: "lines", // Name of prestige currency
	baseResource: "points", // Name of resource prestige is based on
	baseAmount() { return player.points }, // Get the current amount of baseResource
	type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
	exponent: 0.5, // Prestige currency exponent
	gainMult() { // Calculate the multiplier for main currency from bonuses
		mult = new Decimal(1);
		if (hasUpgrade('l', 22)) mult = mult.times(2);
		if (hasUpgrade('l', 23)) mult = mult.times(1.25);
		return mult;
	},
	gainExp() { // Calculate the exponent on main currency from bonuses
		exp = new Decimal(1);
		return exp;
	},
	row: 0, // Row the layer is in on the tree (0 is the first row)
	hotkeys: [
		{ key: "ctrl+s", description: "Ctrl+S: Save the game", onPress() { save(true) } },
		{ key: "l", description: "L: Reset for lines", onPress() { if (canReset(this.layer)) doReset(this.layer) } },
	],
	layerShown() { return true },
	resetDescription() { return `<b>${formatWhole(player.points)}</b> points will make ` },
	upgrades: {
		11: {
			title: 'Supercharge',
			description: 'Gain more points based on lines',
			cost: new Decimal(1),
			//tooltip: 'Lines are supercharged, increasing point production whenever a point lies on them', // lore
			effect() {
				eff = player[this.layer].points.plus(2).pow(0.5);
				return eff;
			},
			effectDisplay() { return `${format(upgradeEffect('l', 11))}x` }
		},
		12: {
			title: 'Self-Synergy',
			description: 'Gain more points based on points',
			cost: new Decimal(1),
			//tooltip: 'Points generate their own kind, but pretty slowly', // lore
			unlocked() { return hasUpgrade('l', 11) },
			effect() {
				eff = player.points.plus(2).pow(0.15);
				return eff;
			},
			effectDisplay() { return `${format(upgradeEffect('l', 12))}x` }
		},
		13: {
			title: 'Easier Lines',
			description: 'Halve the line requirement',
			cost: new Decimal(3),
			//tooltip: 'You realize you can make straight lines with less points', // lore
			unlocked() { return hasUpgrade('l', 12) },
		},
		21: {
			title: 'Point Boost',
			description: 'Point generation x2',
			cost: new Decimal(10),
			unlocked() { return hasUpgrade('l', 13) },
		},
		22: {
			title: 'Line Boost',
			description: 'Line production x2',
			cost: new Decimal(10),
			unlocked() { return hasUpgrade('l', 13) },
		},
		23: {
			title: 'General Boost',
			description: 'Point and line production x1.25',
			cost: new Decimal(10),
			unlocked() { return hasUpgrade('l', 13) },
		},
	},
});