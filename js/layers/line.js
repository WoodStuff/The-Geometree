addLayer("l", {
	name: "line", // This is optional, only used in a few places, If absent it just uses the layer id.
	symbol: "L", // This appears on the layer's node. Default is the id with the first letter capitalized
	position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
	startData() { return {
		unlocked: true,

		points: new Decimal(0),
		best: new Decimal(0),
		total: new Decimal(0),

		particles: new Decimal(0),
		pps: new Decimal(1),
		options: [
			false,
		],
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
		if (hasUpgrade('l', 51)) mult = mult.times(upgradeEffect('l', 51));
		if (hasUpgrade('l', 34)) mult = mult.times(upgradeEffect('l', 34));

		if (hasUpgrade('c', 11)) mult = mult.times(upgradeEffect('c', 11));
		if (hasUpgrade('c', 13)) mult = mult.times(upgradeEffect('c', 13));

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
	doReset(reset) {
		keep = [];
		if (layers[reset].row > this.row) layerDataReset('l', keep);
		if (hasMilestone('c', 0) && (reset == 'c' || reset == 'r')) player.l.upgrades.push(33);
	},
	tabFormat: {
		'Main': {
			content() {
				return [
					'main-display',
					'prestige-button',
					'resource-display',
					hasUpgrade('l', 33) ? 'blank' : '',
					hasUpgrade('l', 33) ? ['display-text', `<span>You have <h3 style="color: ${layers.l.color};">${format(player.l.particles)}</h3> line particles, which are multiplying point gain by ${format(player.l.particles.add(1).pow(0.15))}</span>`] : '',
					hasUpgrade('l', 33) ? 'blank' : '',
					['upgrades', [1, 2, 3]],
				];
			},
		},
		'Particles': {
			unlocked() { return hasUpgrade('l', 33) },
			content() {
				return [
					'main-display',
					'prestige-button',
					'blank',
					['display-text', `<span>You have <h3 style="color: ${layers.l.color};">${format(player.l.particles)}</h3> line particles, which are multiplying point gain by ${format(player.l.particles.add(1).pow(0.15))}x</span>`],
					['display-text', `You are making ${format(player.l.pps)} line particles per second`],
					'blank',
					['display-text', '<h2>Particle Upgrades</h2>'],
					['upgrades', [4, 5]],
					'blank',
					hasUpgrade('l', 43) ? ['display-text', 'You can only have one option selected at a time'] : '',
					'clickables',
				];
			},
		},
	},
	update(diff) {
		if (!hasUpgrade('l', 33)) return;

		ps = new Decimal(1);
		if (hasUpgrade('l', 41)) ps = ps.times(upgradeEffect('l', 41));
		if (hasUpgrade('l', 42)) ps = ps.times(3);
		if (hasUpgrade('l', 43)) ps = ps.times(1.1);
		if (hasUpgrade('l', 14)) ps = ps.times(upgradeEffect('l', 14));

		if (hasUpgrade('c', 12)) ps = ps.times(upgradeEffect('c', 12));
		if (hasUpgrade('c', 13)) ps = ps.times(upgradeEffect('c', 13));

		if (player.l.options[0]) ps = ps.times(0);
		if (player.l.options[1]) ps = ps.times(3);

		// add the particles
		player.l.pps = ps;
		player.l.particles = player.l.particles.plus(player.l.pps.times(diff));
	},
	upgrades: {
		11: {
			title: 'Supercharge',
			description: 'Gain more points based on lines',
			cost: new Decimal(1),
			//tooltip: 'Lines are supercharged, increasing point production whenever a point lies on them', // lore
			effect() {
				eff = player[this.layer].points.plus(2).pow(0.5);
				if (hasUpgrade('l', 31)) eff = eff.times(upgradeEffect('l', 31));
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
				if (hasUpgrade('l', 32)) eff = eff.times(upgradeEffect('l', 32));
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
		14: {
			title: 'Slight Addition',
			description: 'Particle generation is boosted by points',
			cost: new Decimal(1500),
			unlocked() { return hasUpgrade('l', 41) && hasUpgrade('l', 42) && hasUpgrade('l', 43) },
			effect() {
				eff = player.points.plus(2).pow(0.1);
				return eff;
			},
			effectDisplay() { return `${format(upgradeEffect('l', 14))}x` }
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
		24: {
			title: 'Polygonable',
			description: 'Points boost line gain',
			cost: new Decimal(7500),
			unlocked() { return hasUpgrade('l', 14) && hasUpgrade('l', 51) && hasUpgrade('l', 52) && hasUpgrade('l', 53) },
			effect() {
				eff = player.points.plus(2).pow(0.075);
				return eff;
			},
			effectDisplay() { return `${format(upgradeEffect('l', 24))}x` }
		},
		31: {
			title: 'Overcharge',
			description: 'Supercharge is more powerful based on lines',
			cost: new Decimal(100),
			unlocked() { return hasUpgrade('l', 21) && hasUpgrade('l', 22) && hasUpgrade('l', 23) },
			effect() {
				eff = player[this.layer].points.plus(2).pow(0.1);
				return eff;
			},
			effectDisplay() { return `${format(upgradeEffect('l', 31))}x` },
		},
		32: {
			title: 'Self-Self-Synergy',
			description: 'Self-Synergy is more powerful based on lines',
			cost: new Decimal(100),
			unlocked() { return hasUpgrade('l', 31) },
			effect() {
				eff = player[this.layer].points.plus(2).pow(0.05);
				return eff;
			},
			effectDisplay() { return `${format(upgradeEffect('l', 32))}x` }
		},
		33: {
			title: 'Acceleration',
			description: 'Begin generating Line Particles',
			cost: new Decimal(100),
			unlocked() { return hasUpgrade('l', 32) },
		},
		34: {
			title: 'Zoom Out',
			description: 'Lines boost themselves',
			cost: new Decimal(6000),
			unlocked() { return hasUpgrade('l', 24) },
			effect() {
				eff = player.l.points.plus(2).pow(0.1);
				return eff;
			},
			effectDisplay() { return `${format(upgradeEffect('l', 34))}x` }
		},
		41: {
			title: 'Production',
			description: 'Particle production is boosted based on your amount of lines',
			cost: new Decimal(5),
			currencyDisplayName: 'line particles',
			currencyLocation() { return player.l },
			currencyInternalName: 'particles',
			effect() {
				eff = player[this.layer].points.plus(1).pow(0.15);
				return eff;
			},
			effectDisplay() { return `${format(upgradeEffect('l', 41))}x` },
		},
		42: {
			title: 'Beginner Boost',
			description: 'Triple particle production',
			cost: new Decimal(30),
			currencyDisplayName: 'line particles',
			currencyLocation() { return player.l },
			currencyInternalName: 'particles',
		},
		43: {
			title: 'Strategize',
			description: 'Unlock production options and particle production x1.1',
			cost: new Decimal(100),
			currencyDisplayName: 'line particles',
			currencyLocation() { return player.l },
			currencyInternalName: 'particles',
		},
		51: {
			title: 'Larvae',
			description: 'Particles boost line gain',
			cost: new Decimal(175),
			currencyDisplayName: 'line particles',
			currencyLocation() { return player.l },
			currencyInternalName: 'particles',
			unlocked() { return hasUpgrade('l', 41) && hasUpgrade('l', 42) && hasUpgrade('l', 43) },
			effect() {
				eff = player[this.layer].particles.plus(1).pow(0.15);
				return eff;
			},
			effectDisplay() { return `${format(upgradeEffect('l', 51))}x` },
		},
		52: {
			title: 'Faster Transformation',
			description: 'Point Transform gives 2.5x point gain instead of 1.5x',
			cost: new Decimal(300),
			currencyDisplayName: 'line particles',
			currencyLocation() { return player.l },
			currencyInternalName: 'particles',
			unlocked() { return hasUpgrade('l', 41) && hasUpgrade('l', 42) && hasUpgrade('l', 43) },
		},
		53: {
			title: 'Secondary Power',
			description: 'Line gain is multiplied by number of line upgrades you have (including particle upgrades)',
			cost: new Decimal(500),
			currencyDisplayName: 'line particles',
			currencyLocation() { return player.l },
			currencyInternalName: 'particles',
			unlocked() { return hasUpgrade('l', 41) && hasUpgrade('l', 42) && hasUpgrade('l', 43) },
			effect() {
				eff = new Decimal(player[this.layer].upgrades.length).plus(1).pow(0.35);
				return eff;
			},
			effectDisplay() { return `${format(upgradeEffect('l', 53))}x` },
		},
	},
	clickables: {
		11: {
			display() { return `<h2>Point Transform</h2><br>Particle production is 0, but ${hasUpgrade('l', 52) ? '2.5' : '1.5'}x point gain.<br>Formula may change.<br><br><h3>${player.l.options[0] ? 'Active' : 'Inactive'}</h3>` },
			unlocked() { return hasUpgrade('l', 43) || hasMilestone('c', 0) },
			canClick: true,
			onClick() {
				opt = player.l.options[0];
				setAll(player.l.options, false);
				player.l.options[0] = !opt;
			},
			style() { return {
				'width': '200px',
				'height': '200px',
				'background-color': player.l.options[0] ? 'hsl(245deg 75% 65%)' : layers.l.color,
			}; },
		},
		12: {
			display() { return `<h2>Magnification</h2><br>Square root point production, but line particle gain is 3x.<br>Formula may change.<br><br><h3>${player.l.options[1] ? 'Active' : 'Inactive'}</h3>` },
			unlocked() { return hasMilestone('c', 0) },
			canClick: true,
			onClick() {
				opt = player.l.options[1];
				setAll(player.l.options, false);
				player.l.options[1] = !opt;
			},
			style() { return {
				'width': '200px',
				'height': '200px',
				'background-color': player.l.options[1] ? 'hsl(245deg 75% 65%)' : layers.l.color,
			}; },
		},
	},
});