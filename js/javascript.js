let guildMembers = 0;
let itemsData = {};
let items = [];

let repFactionMap = {
	1119: "The Sons of Hodir",
	1098: "Knights of the Ebon Blade",
	1106: "Argent Crusade",
	1091: "The Wyrmrest Accord",
	1090: "Kirin Tor"
};

const statTypeMap = {
	0: "Mana",
	1: "Health",
	3: "Agility",
	4: "Strength",
	5: "Intellect",
	6: "Spirit",
	7: "Stamina",
	13: "Dodge Rating",
	14: "Parry Rating",
	31: "Hit Rating",
	32: "Critical Strike Rating",
	36: "Haste Rating",
	38: "Attack Power",
	45: "Spell Power"
}

const classMap = {
	1: 'Warrior',
	2: 'Paladin',
	3: 'Hunter',
	4: 'Rogue',
	5: 'Priest',
	6: 'Death Knight',
	7: 'Shaman',
	8: 'Mage',
	9: 'Warlock',
	11: 'Druid'
};

const classIcons = {
	1: 'ability_warrior_offensivestance',
	2: 'ability_paladin_shieldofthetemplar',
	3: 'ability_hunter_beasttaming',
	4: 'ability_rogue_shadowstep',
	5: 'spell_holy_holybolt',
	6: 'spell_deathknight_classicon',
	7: 'spell_nature_bloodlust',
	8: 'ability_mage_arcanebarrage',
	9: 'spell_nature_faeriefire',
	11: 'ability_druid_maul',
}

const raceMap = {
	1: "Human",
	2: "Orc",
	3: "Dwarf",
	4: "Night Elf",
	5: "Undead",
	6: "Tauren",
	7: "Gnome",
	8: "Troll",
	9: "Goblin",
	10: "Blood Elf",
	11: "Draenei"
};

const genderMap = {
	0: "Male",
	1: "Female"
};

const factionMap = {
	0: 'Alliance',
	1: 'Horde'
};

const rankMap = {
	0: "0 - Guild Master",
	1: "1 - Officer",
	2: "2 - Raider",
	3: "3 - Member",
	4: "4 - Alt",
	5: "5 - Initiate"
};

const reputationMap = {
	0: "Hated",
	1: "Hostile",
	2: "Unfriendly",
	3: "Neutral",
	4: "Friendly",
	5: "Honored",
	6: "Revered",
	7: "Exalted"
};

const tierMap = {
	// TIER 1 (Molten Core)
	"Might": 1, "Nightslayer": 1, "Giantstalker": 1, "Cenarion": 1, "Earthfury": 1,
	"Arcanist": 1, "Prophecy": 1, "Felheart": 1, "Lawbringer": 1,

	// TIER 2 (Blackwing Lair)
	"Wrath": 2, "Bloodfang": 2, "Dragonstalker": 2, "Stormrage": 2, "Ten Storms": 2,
	"Netherwind": 2, "Transcendence": 2, "Nemesis": 2, "Judgement": 2,

	// TIER 3 (Original Naxxramas - often shares names with T7)
	// Note: If you are strictly WotLK, T3 is usually inaccessible, but names are:
	// Dreadnaught, Bonescythe, Cryptstalker, Dreamwalker, Earthshatter, 
	// Frostfire, Faith, Plagueheart, Redemption.

	// TIER 4 (Karazhan / Gruul / Magtheridon)
	"Warbringer": 4, "Netherblade": 4, "Demon Stalker": 4, "Malorne": 4, "Cyclone": 4,
	"Aldor": 4, "Incarnate": 4, "Voidheart": 4, "Justicar": 4,

	// TIER 5 (SSC / The Eye)
	"Destroyer": 5, "Deathmantle": 5, "Rift Stalker": 5, "Nordrassil": 5, "Cataclysm": 5,
	"Tirisfal": 5, "Avatar": 5, "Corruptor": 5, "Crystalforge": 5,

	// TIER 6 (Hyjal / BT / Sunwell)
	"Onslaught": 6, "Slayer": 6, "Gronnstalker": 6, "Thunderheart": 6, "Skyshatter": 6,
	"Tempest": 6, "Absolution": 6, "Malefic": 6, "Lightbringer": 6,

	// TIER 7 (WotLK: Naxxramas / Obsidian Sanctum)
	"Dreadnaught": 7, "Scourgeborne": 7, "Redemption": 7, "Cryptstalker": 7,
	"Earthshatter": 7, "Bonescythe": 7, "Dreamwalker": 7, "Frostfire": 7,
	"Faith": 7, "Plagueheart": 7,

	// TIER 8 (WotLK: Ulduar)
	"Siegebreaker": 8, "Darkruned": 8, "Aegis": 8, "Scourgestalker": 8,
	"Worldbreaker": 8, "Terrorblade": 8, "Nightsong": 8, "Kirin Tor": 8,
	"Sanctification": 8, "Deathbringer": 8,

	// TIER 9 (WotLK: Trial of the Crusader - Alliance / Horde)
	"Wrynn": 9, "Hellscream": 9, "Thassarian": 9, "Koltira": 9, "Turalyon": 9,
	"Liadrin": 9, "Windrunner": 9, "Nobundo": 9, "Thrall": 9, "VanCleef": 9,
	"Garona": 9, "Malfurion": 9, "Hamuul": 9, "Khadgar": 9, "Sunstrider": 9,
	"Velen": 9, "Zabra": 9, "Gul'dan": 9, "Kel'Thuzad": 9,

	// TIER 10 (WotLK: Icecrown Citadel)
	"Ymirjar Lord": 10, "Scourgelord": 10, "Lightsworn": 10, "Ahn'Kahar Blood Hunter": 10,
	"Frost Witch": 10, "Shadowblade": 10, "Lasherweave": 10, "Bloodmage": 10,
	"Crimson Acolyte": 10, "Dark Coven": 10
};

$('#search').on('keyup', function() {
	var value = $(this).val().toLowerCase();

	$('tbody tr').filter(function() {
		$(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
	});
});

async function filterList(value) {
	$('#search').val(value);

	value = value.toLowerCase();

	$('tbody tr').filter(function() {
		$(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
	});
}

function formatWoWMoney(totalCopper) {
	// if ( totalCopper == 0 ) return "0c";

	const gold = Math.floor(totalCopper / 10000);
	const silver = Math.floor((totalCopper % 10000) / 100);
	const copper = totalCopper % 100;

	let result = [];
	if ( gold > 0 ) result.push(`<span class="gold">${gold}</span>`);
	if ( silver > 0 ) result.push(`<span class="silver">${silver}</span>`);
	if ( copper > 0 || result.length === 0 ) result.push(`<span class="copper">${copper}</span>`);

	return result.join(" ");
}

function buildTooltipHTML(item) {
	if (!item) return "Item not found";

	// Map quality numbers to CSS classes or colors
	const qualityColors = {
		0: '#9d9d9d', // Poor
		1: '#ffffff', // Common
		2: '#1eff00', // Uncommon
		3: '#0070dd', // Rare
		4: '#a335ee', // Epic
		5: '#ff8000', // Legendary
		7: '#e6cc80'  // Heirloom (your example is 7)
	};

	const color = qualityColors[item.Quality] || '#fff';

	let html = `<div style="min-width: 200px; font-family: sans-serif; font-size: 13px; line-height: 1.4;">`;

	// Header: Name
	html += `<div style="color: ${color}; font-size: 16px; font-weight: bold;">${item.name}</div>`;

	if ( item.ItemSetInfo && item.ItemSetInfo.base ) {
		let tier = '?';
		for (let setBaseName in tierMap) {
			// Create a case-insensitive regex for the base set name
			let regex = new RegExp(setBaseName, "i");

			if ( regex.test(item.ItemSetInfo.base.name) ) {
				tier = tierMap[setBaseName];
			}
		}
		if ( tier == 7 && item.ItemLevel < 100 ) tier = 3;
		let heroic = item.is_heroic !== 0 ? ' Heroic' : '';
		html += `<div style="color: #00ff00;">Tier ${tier}${heroic}</div>`;
	} else if ( item.is_heroic != 0 ) html += `<div style="color: #00ff00;">Heroic</div>`;

	// Item Level
	if (item.ItemLevel > 0) {
		html += `<div style="color: #ffd100;">Item Level ${item.ItemLevel}</div>`;
	}

	html += `<div style="color: #ffd100;">Item ID ${item.ID}</div>`;

	// Bonding (Binds to account, etc.)
	if (item.bonding) {
		html += `<div>${item.bonding}</div>`;
	}

	if ( item.ItemStat && item.ItemStat.length > 0 ) {
		$.each(item.ItemStat, function(index, stat) {
			const statName = statTypeMap[stat.type];

			if ( statName && stat.value !== 0 ) {
				const prefix = stat.value > 0 ? "+" : "";
				const statColor = stat.type >= 31 ? "#00ff00" : "#fff";

				html += `<div style="color: ${statColor};">${prefix}${stat.value} ${statName}</div>`;
			}
		});
	}

	if ( item.races.length > 0 ) {
		html += `<div style="color: #fff;">Races: ${item.races}</div>`;
	}

	if ( item.classes.length > 0 ) {
		html += `<div style="color: #fff;">Classes: ${item.classes}</div>`;
	}

	if ( item.ItemSetInfo && item.ItemSetInfo.length !== 0 && item.ItemSetInfo.base && item.ItemSetInfo.base.length !== 0 ) {
		let total = item.ItemSetInfo.base.Items.length;

		$.each(itemsData, function(key, dataItem) {
			if ( dataItem.ItemSetInfo && dataItem.ItemSetInfo.base ) {
				if ( dataItem.ItemSetInfo.base.name === item.ItemSetInfo.base.name ) {
					$.each(item.ItemSetInfo.base.Items, function(a, setPiece) {
						if ( setPiece.invType === dataItem.InventoryType ) {
							setPiece.name = dataItem.name;
							setPiece.have = true;
						}
					});
				}
			}
		});
		let count = item.ItemSetInfo.base.Items.filter(i => i.have).length;

		html += `<div class="mt-2 fw-bold mb-2" style="color: #edd991;">${item.ItemSetInfo.base.name} (${count}/${total})</div>`;

		$.each(item.ItemSetInfo.base.Items, function(a,b) {
			const bold = b.have ? 'fw-bold' : '';
			const beige = b.have ? '#edd991' : '#cccccc';
			html += `<div class="${bold}" style="color: ${beige};">${b.name}</div>`;
		});

		html += '<div class="mt-2">';
		$.each(item.ItemSetInfo.base.Spells, function(a,b) {
			const green = count >= b.threshold ? '#00ff00' : '#cccccc';
			html += `<div style="color: ${green}">${b.spell}</div>`;
		});
		html += '</div>';
		// html += item.itemsetInfo;
	}

	// Spells / Description (The "Use" text)
	if (item.SpellId && item.SpellId[0]) {
		// Replace newlines with <br> for HTML
		const spellText = item.SpellId[0].replace(/\n/g, '<br>');
		let used = "";
		if ( item.InventoryType == 12 ) used = item.UsedProprerty !== 0 ? 'Use: ' : 'Equip: ';

		html += `<div style="color: #00ff00; margin-top: 8px;">${used}${spellText}</div>`;
	}

	// Requirements
	if (item.RequiredLevel > 0) {
		html += `<div style="margin-top: 4px;">Requires Level ${item.RequiredLevel}</div>`;
	}

	if (item.RequiredReputationFaction) {
		html += `<div style="color: #fff;">Requires ${repFactionMap[item.RequiredReputationFaction]} ${reputationMap[item.RequiredReputationRank]}</div>`;
	}

	if ( item.BuyPrice > 0 ) {
		html += '<div>Buy: ' + formatWoWMoney(item.BuyPrice) + '</div>';
	}

	if ( item.SellPrice > 0 ) {
		html += '<div>Sell: ' + formatWoWMoney(item.SellPrice) + '</div>';
	}

	html += `</div>`;
	return html;
}

async function getItemTooltips(realmName, items) {
	$.ajax({
		url: 'api.php',
		type: 'POST',
		data: {
			url: 'item-tooltip',
			params: {
				r: realmName,
				e: items
			}
		},
		dataType: 'json',
		success: function(data) {
			if ( data.success ) {
				itemsData = data.response;
				$.each(itemsData, function(a,b) {
					if ( b.Quality ) {
						$('.item-icon[data-id=' + a + ']').addClass('border-quality-' + b.Quality);
					}
				});
			} else {
				console.error("API Error: " + data.errorstring);
			}
		},
		error: function(xhr) {
			console.error("Connection Error: " + xhr.status);
		}
	});
}

async function getItemTooltip(realmName, ItemID) {
	$.ajax({
		url: 'api.php',
		type: 'POST',
		data: {
			url: 'item-tooltip',
			params: {
				r: realmName,
				e: ItemID
			}
		},
		dataType: 'json',
		success: function(data) {
			if ( data.success ) {
				let text = '<div class="fw-bold">' + data.response.name + '</div>';

				$('#tooltip').html(text);
			} else {
				console.error("API Error: " + data.errorstring);
			}
		},
		error: function(xhr) {
			console.error("Connection Error: " + xhr.status);
		}
	});
}

async function getCharacterItems(realmName, characterName) {
	/*
	try {
		$('.overlay').removeClass('d-none').addClass('d-flex');

		const data = await $.ajax({
			url: 'api.php',
			type: 'POST',
			data: {
				url: 'character-sheet',
				params: {
					r: realmName,
					n: characterName
				}
			},
			dataType: 'json'
		});

		if ( data.success ) {
			const gearList = data.response.characterItems;
			const name = data.response.tname !== '' ? data.response.tname : data.response.name;

			$('h2').text(`${name} <${data.response.guildName}`);
			$('#playerData').text(`Level ${data.response.level} ${genderMap[data.response.gender]} ${raceMap[data.response.race]} ${classMap[data.response.class]}`);

			$('#gearTable tbody').empty();

			for ( const item of gearList ) {
				if ( item.entry === 0 ) continue;

				const gemPromises = item.gems.map(gem =>
					$.ajax({
						url: 'api.php',
						type: 'POST',
						data: {
							url: 'item-tooltip',
							params: {
								r: realmName,
								e: gem.id
							}
						},
						dataType: 'json'
					}).catch(() => ({ success: false })));
				const gemDetails = await Promise.all(gemPromises);

				let gems = '';
				gemDetails.forEach((res, i) => {
					const gemData = item.gems[i];
					const rarity = res.success ? res.response.rarity : '1';
					gems += `<img src="image.php?name=${gemData.icon}" class="wow-icon ms-${i} border-quality-${rarity}">`;
				});
				$('#playerData').text(`Level ${data.response.level} ${genderMap[data.response.gender]} ${raceMap[data.response.race]} ${classMap[data.response.class]}`);
			}
			$('#gearTable table').append(`<tfoot><tr><th colspan="4" class="text-end">Total</th><th>${data.response.avgitemlevel}</th><th>${data.response.gearscore_335}</th></tr>`);
		}
	} catch (e) {
		console.error("Critical Flow Error: ", e);
	} finally {
		$('.overlay').addClass('d-none').removeClass('d-flex');
	}
	*/

	$.ajax({
		url: 'api.php',
		type: 'POST',
		headers: {
			'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
		},
		data: {
			url: 'character-sheet',
			params: {
				r: realmName,
				n: characterName
			}
		},
		dataType: 'json',
		beforeSend: function() {
			$('.overlay').removeClass('d-none').addClass('d-flex');
		},
		success: function(data) {
			if ( data.success ) {
				const gearList = data.response.characterItems;
				const name = data.response.tname !== '' ? data.response.tname : data.response.name;

				$('h2').text(`${name} <${data.response.guildName}>`);
				$('#playerData').text(`Level ${data.response.level} ${genderMap[data.response.gender]} ${raceMap[data.response.race]} ${classMap[data.response.class]}`);

				$.each(gearList, function(index, item) {
					let gems = '';
					$.each(item.gems, function(i, gem) {
						gems += `<img src="image.php?name=${gem.icon}" class="wow-icon item-icon ms-${i}" data-id="${gem.id}">`;
						if ( !items.includes(gem.id) ) items.push(gem.id);
					});

					let enchant = '';
					if ( item.ench.icon ) {
						enchant = `<img src="image.php?name=${item.ench.icon}" class="wow-icon item-icon" data-id="${item.ench.entry}">`;
						if ( !items.includes(item.ench.entry) ) items.push(item.ench.entry);
					}

					if ( item.entry !== 0 ) {
						$('#gearTable').find('tbody').append('<tr><td><img src="image.php?name=' + item.icon + '" class="wow-icon item-icon border-quality-' + item.rarity + '" data-id="' + item.entry + '"></td><td>' + item.name + '</td><td>' + enchant + '</td><td>' + gems + '</td><td>' + item.ilevel + '</td><td>' + item.itemscore_335 + '</td></tr>');
						if ( !items.includes(item.entry) ) items.push(item.entry);
					}
				});

				$('#gearTable').find('table').append('<tfoot><th colspan="4" class="text-end">Total</th><th>' + data.response.avgitemlevel + '</th><th>' + data.response.gearscore_335 + '</th></tr></tfoot>')
			} else {
				console.error("API Error: " + data.errorstring);
			}
		},
		error: function(xhr) {
			console.error("Connection Error: " + xhr.status);
		},
		complete: function() {
			$('.overlay').addClass('d-none').removeClass('d-flex');

			getItemTooltips(realmName, items);
		}
	});
}

async function getCharacterReputations(realmName, characterName) {
	$.ajax({
		url: 'api.php',
		type: 'POST',
		headers: {
			'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
		},
		data: {
			url: 'character-reputation',
			params: {
				r: realmName,
				n: characterName
			}
		},
		dataType: 'json',
		beforeSend: function() {
			$('.overlay').removeClass('d-none').addClass('d-flex');
		},
		success: function(data) {
			if ( data.success ) {
				const reputationList = data.response.characterReputation;
				/*
				const name = data.response.tname ?? data.response.name;

				$('h2').text(`${name} <${data.response.guildName}>`);
				$('#playerData').text(`Level ${data.response.level} ${genderMap[data.response.gender]} ${raceMap[data.response.race]} ${classMap[data.response.class]}`);
				*/

				$.each(reputationList, function(index, reputation) {
					const formattedPercent = parseFloat(reputation.standings.percent).toFixed(2);
					$('#reputationTable').find('tbody').append(`<tr data-rank="${reputation.standings.rank}" data-percent="${reputation.standings.percent}"><td title="${reputation.descr}">${reputation.name}</td><td>${reputation.standings.rank_name}</td><td>${reputation.standings.rep} / ${reputation.standings.max}</td><td><div class="progress-bar-container d-flex overflow-hidden position-relative"><span class="progress-bar fw-bold d-block bar-${reputation.standings.rank_name}" style="width: ${reputation.standings.percent}%;">&nbsp;</span><span class="position-absolute w-100 h-100 top-0 left-0 text-white text-center progress-bar-text">${formattedPercent}%</span></div></td></tr>`);
				});

				var tbody = $('#reputationTable').find('tbody');
				var rows = tbody.find('tr').detach(); // Remove from DOM temporarily

				rows.sort(function(a, b) {
					let rankA = $(a).data('rank');
					let rankB = $(b).data('rank');

					if ( rankA !== rankB ) {
						return rankB - rankA;
					}

					let percentA = $(a).data('percent');
					let percentB = $(b).data('percent');

					return percentB - percentA;
				});

				tbody.append(rows); // Put them back all at once
			} else {
				console.error("API Error: " + data.errorstring);
			}
		},
		error: function(xhr) {
			console.error("Connection Error: " + xhr.status);
		},
		complete: function() {
			$('.overlay').addClass('d-none').removeClass('d-flex');
		}
	});
}

async function getCharacterAchievements(realmName, characterName) {
	$.ajax({
		url: 'api.php',
		type: 'POST',
		headers: {
			'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
		},
		data: {
			url: 'character-achievements',
			params: {
				r: realmName,
				n: characterName
			}
		},
		dataType: 'json',
		success: function(data) {
			if ( data.success ) {
				let points = 0;
				const achievementList = data.response.Achievements;

				$.each(achievementList, function(id, achievement) {
					points += achievement.points;
				});

				$('#' + characterName + '_AchievementPoints').text(points);
			} else {
				console.error("API Error: " + data.errorstring);
			}
		},
		error: function(xhr) {
			console.error("Connection Error: " + xhr.status);
		}
	});
}

async function getGuildMoney(realmName, guildName) {
	$.ajax({
		url: 'api.php',
		type: 'POST',
		headers: {
			'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
		},
		data: {
			url: 'guild-bank-contents',
			params: {
				r: realmName,
				gn: guildName
			}
		},
		dataType: 'json',
		success: function(data) {
			if (data.success) {
				const money = data.response.GuildBankMoney || [];
				const gold = money.gold || 0;
				const silver = money.silver || 0;
				const copper = money.copper || 0;

				const gmotd = data.response.guildMotd.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_new">$1</a>');
				const ginfo = data.response.guildInfoText.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_new">$1</a>');

				$('#gmotd').html('Guild Message of the Day: ' + gmotd);
				$('#ginfo').html(ginfo);

				$('#money').html(`Guild Bank Funds: ${gold}<img src="image.php?name=inv_misc_coin_01" class="wow-coin-icon"> ${silver}<img src="image.php?name=inv_misc_coin_03" class="wow-coin-icon"> ${copper}<img src="image.php?name=inv_misc_coin_05" class="wow-coin-icon">`);
			} else {
				console.error("API Error: " + data.errorstring);
			}
		},
		error: function(xhr) {
			console.error("Connection Error: " + xhr.status);
		}
	});
}

async function getCharacterData(realmName, characterName, faction, rank) {
	$.ajax({
		url: 'api.php',
		type: 'POST',
		headers: {
			'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
		},
		data: {
			url: 'character-sheet', // Doesn't return achievement data
			// url: 'character-achievements', // Doesn't return profession data
			params: {
				r: realmName,
				n: characterName
			}
		},
		dataType: 'json',
		success: function(data) {
			if (data.success) {
				const name = data.response.tname || data.response.name;
				const classIcon = '<img class="wow-icon" src="image.php?name=' + classIcons[data.response.class] + '" title="' + classMap[data.response.class] + '">' || '';
				const raceIcon = '<img class="wow-icon" title="' + genderMap[data.response.gender] + ' ' + raceMap[data.response.race] + '" src="race.php?img=race_' + raceMap[data.response.race].toLowerCase().replace(/undead/g, "scourge").replace(/\s+/g, "") + '_' + genderMap[data.response.gender].toLowerCase() + '.jpg">';
				const factionIcon = '<img class="wow-icon" title="' + factionMap[faction] + '" src="faction.php?name=' + factionMap[faction].toLowerCase() + '" />' || '';
				const level = data.response.level || '';
				const ilvl = data.response.avgitemlevel || 0;
				const gearscore = data.response.gearscore_335 || 0;
				const hk = data.response.playerHonorKills || 0;
				const guildRank = rankMap[rank] || '';
				const activeSpec = data.response.activeSpec > 0 ? 1 : 0;
				const dualSpec = data.response.dualSpec == true ? 1 : 0;
				const spec0 = data.response.treeName_0 + ' (' + data.response.talents_builds_0.replace(/ /g, '') + ')';
				const spec1 = data.response.treeName_1 + ' (' + data.response.talents_builds_1.replace(/ /g, '') + ')';

				let professions = '';

				[1, 2].forEach(num => {
					const prof = data.response[`primary_trade_skill_${num}`];

					if (prof && prof.name) {
						const margin = num - 1;
						const titleText = `${prof.value} / ${prof.max} ${prof.name}`;
						professions += `<img src="image.php?name=${prof.icon}" class="wow-icon ms-${margin}" title="${titleText}"><span class="d-none">${prof.name}</span>`;
					}
				});

				let talents = "";

				[0, 1].forEach(num => {
					let specName = data.response[`treeName_${num}`];
					const specBuild = data.response[`talents_builds_${num}`].replace(/\s+/g, '');

					if (specName && specName != "") {
						if ( specName == "Feral Combat" && Number(data.response[`talents_${num}`].charAt(32)) > 0 ) {
							specName = "Guardian";
						}
						talents += '<span class="d-none">' + specName + '</span><img src="image.php?name=' + data.response[`treeIcon_${num}`] + '" class="wow-icon ms-' + num + '" title="' + specName + ' (' + specBuild + ')">';
					}
				});

				getCharacterAchievements(realmName, characterName);

				$('tbody').append('<tr><td>' + factionIcon + '</td><td>' + raceIcon + '<span class="d-none">' + genderMap[data.response.gender] + '</span><span class="d-none">' + raceMap[data.response.race] + '</span></td><td>' + classIcon + '<span class="d-none">' + classMap[data.response.class] + '</span></td><td><a href="character.php?realm=' + realmName + '&name=' + data.response.name + '">' + name + '</a></td><td>' + level + '</td><td>' + ilvl + '</td><td>' + gearscore + '</td><td>' + talents + '</td><td>' + hk + '</td><td class="text-nowrap">' + professions + '</td><td>' + guildRank + '</td><td id="' + characterName + '_AchievementPoints"></td></tr>');
			} else {
				console.error("API Error: " + data.errorstring);
			}

			if ( guildMembers == $('tbody').children('tr').length ) {
				$('.overlay').addClass('d-none').removeClass('d-flex');
			}
		},
		error: function(xhr) {
			console.error("Connection Error: " + xhr.status);
		}
	});
}

async function getGuildData(realmName, guildName) {
	$.ajax({
		url: 'api.php',
		type: 'POST',
		headers: {
			'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
		},
		data: {
			url: 'guild-info',
			params: {
				r: realmName,
				gn: guildName
			}
		},
		dataType: 'json',
		beforeSend: function() {
			$('.overlay').removeClass('d-none').addClass('d-flex');
		},
		success: function(data) {
			if (data.success) {
				const guildList = data.response.guildList;
				const emblemData = JSON.parse(data.response.guildEmblemObject);

				void new GuildTabard("guild-emblem", emblemData).init();

				guildMembers = data.response.guildMembersCount || 0;

				$('#guildName').html('<a href="https://logs.stormforge.gg/en/guild/' + realmName + '/' + data.response.guildName + '" target="_new">&lt;' + data.response.guildName + '&gt;</a>');
				$('#members').text('Members: ' + data.response.guildMembersCount);

				let classList = {}

				$.each(guildList, function(guid, character) {
					classList[classMap[character.class]] = ( classList[classMap[character.class]] || 0 ) + 1;

					getCharacterData(realmName, character.name, character.faction, character.rank);
				});

				$.each(classList, function(index, value) {
					// if ( value != 1 ) index = index + 's';
					$('#classList').append(`<li class="nav-item"><a class="nav-link" href="javascript:void(0);" onClick="filterList('${index}');">${value} ${index}</a></li>`);
				});
			} else {
				console.error("API Error: " + data.errorstring);
			}
		},
		error: function(xhr) {
			console.error("Connection Error: " + xhr.status);
		}
	});
}

function comparer(index) {
	return function(a, b) {
		var valA = getCellValue(a, index),
		valB = getCellValue(b, index);
		return $.isNumeric(valA) && $.isNumeric(valB) ? valA - valB : valA.toString().localeCompare(valB);
	};
}

function getCellValue(row, index) {
	return $(row).children('td').eq(index).text();
}

function GuildTabard(n, t) {
    function h(n, t) {
        var r = Math.abs(n),
            u = Math.max(0, t - Math.floor(r).toString().length),
            i = Math.pow(10, u).toString().substr(1);
        return n < 0 && (i = "-" + i), i + r;
    }
    function y(n) {
        return n >= o.length
            ? void p(0)
            : void $.ajax({
                  url: o[n],
                  beforeSend: function () {
                      y(n + 1);
                  },
              });
    }
    function p(n) {
        var t = new Image(),
            r = new Image();
        c[n].src = o[n];
        c[n].onload = function () {
            t.src = f.toDataURL("image/png");
        };
        t.onload = function () {
            f.width = 1;
            f.width = i;
            e.drawImage(c[n], l[n][0], l[n][1], l[n][2], l[n][3]);
            "undefined" != typeof s[n] && null !== s[n] && w(s[n][0], s[n][1], s[n][2]);
            r.src = f.toDataURL("image/png");
            e.drawImage(t, 0, 0, i, v);
        };
        r.onload = function () {
            e.drawImage(r, 0, 0, i, v);
            n++;
            n < o.length ? p(n) : $(f).animate({ opacity: 1 }, 250);
        };
    }
    function w(n, t, r) {
        var h = e.getImageData(0, 0, i, v),
            u = h.data,
            f = u.length,
            s = 19,
            o = 1 / 3,
            c = n / s + n * o,
            l = t / s + t * o,
            a = r / s + r * o,
            y = n / 255 + o,
            p = t / 255 + o,
            w = r / 255 + o;
        do 0 !== u[f + 3] && ((u[f] = u[f] * y + c), (u[f + 1] = u[f + 1] * p + l), (u[f + 2] = u[f + 2] * w + a));
        while ((f -= 4));
        e.putImageData(h, 0, 0);
    }
    function a(n) {
        return !isNaN(parseFloat(n)) && isFinite(n) ? n % 1 == 0 : !1;
    }
    var b = this,
        f = document.getElementById(n),
        e = null,
        u = "crest.php?img=",
        i = f.width,
        v = f.height,
        o = [],
        c = [],
        r = [],
        s = [],
        l = [];
    b.init = function () {
        return null !== f &&
            document.createElement("canvas").getContext &&
            a(t.bg[0]) &&
            a(t.border[0]) &&
            a(t.emblem[0])
            ? ((r = [
                  null,
                  null,
                  [
                      [215, 32, 112],
                      [171, 0, 76],
                      [87, 0, 0],
                      [225, 105, 26],
                      [180, 56, 0],
                      [133, 11, 0],
                      [237, 151, 22],
                      [205, 110, 0],
                      [155, 61, 0],
                      [239, 207, 20],
                      [207, 162, 0],
                      [158, 113, 0],
                      [226, 216, 20],
                      [183, 177, 0],
                      [133, 128, 0],
                      [206, 209, 24],
                      [159, 161, 3],
                      [112, 115, 0],
                      [153, 206, 27],
                      [108, 154, 3],
                      [65, 108, 0],
                      [30, 210, 96],
                      [4, 157, 63],
                      [0, 110, 11],
                      [29, 206, 169],
                      [4, 152, 122],
                      [0, 107, 74],
                      [33, 177, 214],
                      [3, 109, 139],
                      [0, 81, 111],
                      [72, 125, 193],
                      [38, 85, 145],
                      [0, 39, 98],
                      [188, 75, 195],
                      [145, 42, 155],
                      [108, 8, 128],
                      [202, 17, 191],
                      [173, 0, 162],
                      [124, 0, 116],
                      [219, 30, 160],
                      [149, 0, 97],
                      [121, 0, 68],
                      [160, 108, 44],
                      [108, 66, 15],
                      [53, 16, 0],
                      [15, 26, 31],
                      [117, 124, 120],
                      [136, 145, 139],
                      [156, 166, 159],
                      [211, 211, 198],
                      [229, 107, 140],
                  ],
                  null,
                  [
                      [97, 42, 44],
                      [109, 69, 46],
                      [119, 101, 36],
                      [118, 114, 36],
                      [108, 118, 36],
                      [85, 108, 48],
                      [76, 109, 48],
                      [48, 108, 66],
                      [48, 105, 107],
                      [48, 80, 108],
                      [55, 60, 100],
                      [87, 54, 100],
                      [100, 55, 76],
                      [103, 51, 53],
                      [153, 159, 149],
                      [38, 46, 38],
                      [155, 94, 28],
                  ],
                  [
                      [102, 0, 32],
                      [103, 35, 0],
                      [103, 69, 0],
                      [103, 86, 0],
                      [98, 102, 0],
                      [80, 102, 0],
                      [54, 102, 0],
                      [0, 102, 30],
                      [0, 102, 86],
                      [0, 72, 102],
                      [9, 42, 94],
                      [86, 9, 94],
                      [93, 10, 79],
                      [84, 54, 10],
                      [177, 183, 176],
                      [16, 20, 22],
                      [221, 163, 90],
                  ],
              ]),
              (l = [
                  [0, 0, (216 * i) / 240, (216 * i) / 240],
                  [(18 * i) / 240, (27 * i) / 240, (179 * i) / 240, (216 * i) / 240],
                  [(18 * i) / 240, (27 * i) / 240, (179 * i) / 240, (210 * i) / 240],
                  [(18 * i) / 240, (27 * i) / 240, (179 * i) / 240, (210 * i) / 240],
                  [(31 * i) / 240, i / 6, (147 * i) / 240, (159 * i) / 240],
                  [(33 * i) / 240, (57 * i) / 240, (125 * i) / 240, (125 * i) / 240],
                  [(18 * i) / 240, (27 * i) / 240, (179 * i) / 240, (32 * i) / 240],
              ]),
              r[2][t.bg[1]] && r[4][t.border[1]] && r[5][t.emblem[1]]
                  ? ((o = [
                        u + "ring-" + t.ring + ".png",
                        u + "shadow_" + h(t.bg[0], 2) + ".png",
                        u + "bg_" + h(t.bg[0], 2) + ".png",
                        u + "overlay_" + h(t.bg[0], 2) + ".png",
                        u + "border_" + h(t.border[0], 2) + ".png",
                        u + "emblem_" + h(t.emblem[0], 2) + ".png",
                        u + "hooks.png",
                    ]),
                    (s = [
                        null,
                        null,
                        [r[2][t.bg[1]][0], r[2][t.bg[1]][1], r[2][t.bg[1]][2]],
                        null,
                        [r[4][t.border[1]][0], r[4][t.border[1]][1], r[4][t.border[1]][2]],
                        [r[5][t.emblem[1]][0], r[5][t.emblem[1]][1], r[5][t.emblem[1]][2]],
                        null,
                    ]),
                    (c = [new Image(), new Image(), new Image(), new Image(), new Image(), new Image(), new Image()]))
                  : ((o = [
                        u + "ring-" + t.ring + ".png",
                        u + "shadow_00.png",
                        u + "bg_00.png",
                        u + "overlay_00.png",
                        u + "hooks.png",
                    ]),
                    (c = [new Image(), new Image(), new Image(), new Image(), new Image()])),
              $(f).css({ opacity: 0 }),
              (e = f.getContext("2d")),
              y(0),
              !0)
            : !1;
    };
    this.init();
}

$(document).ready(function() {
	$('th').click(function() {
		var table = $(this).parents('table').eq(0);
		var rows = table.find('tr:gt(0)').toArray().sort(comparer($(this).index()));

		this.asc = !this.asc;

		if (!this.asc) {
			rows = rows.reverse();
		}

		for (var i = 0; i < rows.length; i++) {
			table.append(rows[i]);
		}
	});

	$(document).on('mouseenter', '.item-icon', function(e) {
		$('#tooltip').css({
			top: e.pageY + 10,
			left: e.pageX + 10
		}).show().text('Loading...');

		let tooltip = itemsData[$(this).attr('data-id')];

		$('#tooltip').html(buildTooltipHTML(tooltip));
	});

	$(document).on('mousemove', '.item-icon', function(e) {
		$('#tooltip').css({
			top: e.pageY + 10,
			left: e.pageX + 10
		});
	});

	$(document).on('mouseleave', '.item-icon', function() {
		$('#tooltip').hide();
	});

	if ( $('#tooltip').length != 1 ) {
		$('body').append('<div id="tooltip" style="display:none; position:absolute; background:#333; color:#fff; padding:8px; border-radius:4px; z-index:1000;">Loading...</div>');
	}

	if ( $('.overlay').length != 1 ) {
		$('body').append('<div class="overlay position-fixed top-0 start-0 w-100 h-100 justify-content-center align-items-center d-none"><div class="content-box"><span class="loader me-2"></span>Loading...</div></div>');
	}
});
