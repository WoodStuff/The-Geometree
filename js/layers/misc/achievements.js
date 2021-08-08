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
	achievementPopups: true,
	achievements: {
		11: {
			name: 'Success',
			done() { return player.l.points.gte(1) },
			goalTooltip: 'Get 1 line', // Shows when achievement is not completed
			doneTooltip: 'Get 1 line', // Showed when the achievement is completed
		},
		12: {
			name: 'Lots of Power',
			done() { return hasUpgrade('l', 33) },
			goalTooltip: 'Start generating ???', // Shows when achievement is not completed
			doneTooltip: 'Start generating line particles', // Showed when the achievement is completed
		},
	},
});