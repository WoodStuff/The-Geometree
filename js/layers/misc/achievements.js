addLayer('a', {
	startData() { return {
		unlocked: true,
		points: new Decimal(0),
	}},
	color: 'yellow',
	resource: 'achievements', 
	row: 'side',
    position: 0,
	tooltip() { // Optional, tooltip displays when the layer is locked
		return 'Achievements';
	},
	update() {
		player.a.points = new Decimal(player.a.achievements.length);
	},
    tabFormat: [
        'main-display',
        ['display-text', 'Warning: those contain spoilers. For row 2 and beyond, generally the 5 achievements after your furthest one are spoiler-free.'],
        'achievements',
    ],
	achievementPopups: true,
	achievements: {
		11: {
			name: 'Success',
			done() { return player.l.points.gte(1) },
			tooltip: 'Get 1 line', // Showed when the achievement is completed
		},
		12: {
			name: 'Generation time!',
			done() { return hasUpgrade('l', 33) },
			tooltip: 'Start generating line particles', // Showed when the achievement is completed
		},
        13: {
			name: 'Maxed out',
			done() { return hasUpgrade('l', 51) && hasUpgrade('l', 52) && hasUpgrade('l', 53) },
			tooltip: 'Get 6 particle upgrades', // Showed when the achievement is completed
		},
        14: {
			name: 'Circulated',
			done() { return player.c.points.gte(1) },
			tooltip: 'Get 1 curve', // Showed when the achievement is completed
		},
		15: {
			name: 'Megagon',
			done() { return player.points.gte('1e6') },
			tooltip: 'Get 1 million points', // Showed when the achievement is completed
		},
	},
});