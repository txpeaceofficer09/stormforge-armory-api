let guildMembers = 0;

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

async function getCharacterReputations(realmName, characterName) {
	$.ajax({
		url: 'api.php',
		type: 'POST',
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
				const name = data.response.tname ?? data.response.name;

				$('h2').text(`${name} <${data.response.guildName}>`);
				$('#playerData').text(`Level ${data.response.level} ${genderMap[data.response.gender]} ${raceMap[data.response.race]} ${classMap[data.response.class]}`);

				$.each(reputationList, function(index, reputation) {
					const formattedPercent = parseFloat(reputation.standings.percent).toFixed(2);
					$('tbody').append(`<tr data-rank="${reputation.standings.rank}" data-percent="${reputation.standings.percent}"><td title="${reputation.descr}">${reputation.name}</td><td>${reputation.standings.rank_name}</td><td>${reputation.standings.rep} / ${reputation.standings.max}</td><td><div class="progress-bar-container d-flex overflow-hidden position-relative"><span class="progress-bar fw-bold d-block bar-${reputation.standings.rank_name}" style="width: ${reputation.standings.percent}%;">&nbsp;</span><span class="position-absolute w-100 h-100 top-0 left-0 text-white text-center progress-bar-text">${formattedPercent}%</span></div></td></tr>`);
				});

				var tbody = $('tbody');
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
				$('.overlay').addClass('d-none').removeClass('d-flex');
			} else {
				console.error("API Error: " + data.errorstring);
			}
		},
		error: function(xhr) {
			console.error("Connection Error: " + xhr.status);
		}
	});
}

async function getCharacterAchievements(realmName, characterName) {
	$.ajax({
		url: 'api.php',
		type: 'POST',
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

				$('#money').html(`Guild Bank Funds: ${gold}<img src="img/gold.webp"> ${silver}<img src="img/silver.webp"> ${copper}<img src="img/copper.webp">`);
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
				const classIcon = '<img class="wow-icon" src="img/' + classMap[data.response.class].toLowerCase().replace(/\s+/g, '') + '.gif" title="' + classMap[data.response.class] + '">' || '';
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
						// const cleanName = prof.name.toLowerCase().replace(/\s+/g, "");
						// const iconUrl = `https://wow.zamimg.com/images/wow/icons/small/ui_profession_${cleanName}.jpg`;
						const titleText = `${prof.value} / ${prof.max} ${prof.name}`;
						// professions += `<img src="${iconUrl}" class="wow-icon ms-${margin}" title="${titleText}"><span class="d-none">${prof.name}</span>`;
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
						// talents += '<span class="d-none">' + specName + '</span><img src="' + classMap[data.response.class].toLowerCase().replace(/\s+/g, '') + '_' + specName.toLowerCase().replace(/\s+/g, '') + '.jpg" height="24" class="ms-' + num + '" title="' + specName + ' (' + specBuild + ')">';
						// talents += '<span class="d-none">' + specName + '</span><img src="spec.php?class=' + classMap[data.response.class].toLowerCase().replace(/\s+/g, '') + '&spec=' + specName.toLowerCase().replace(/\s+/g, '') + '" height="24" class="ms-' + num + '" title="' + specName + ' (' + specBuild + ')">';
						talents += '<span class="d-none">' + specName + '</span><img src="image.php?name=' + data.response[`treeIcon_${num}`] + '" class="wow-icon ms-' + num + '" title="' + specName + ' (' + specBuild + ')">';
					}
				});

				getCharacterAchievements(realmName, characterName);

				$('tbody').append('<tr><td>' + factionIcon + '</td><td>' + raceIcon + '<span class="d-none">' + genderMap[data.response.gender] + '</span><span class="d-none">' + raceMap[data.response.race] + '</span></td><td>' + classIcon + '<span class="d-none">' + classMap[data.response.class] + '</span></td><td><a href="https://logs.stormforge.gg/en/character/' + realmName + '/' + data.response.name + '" target="_new">' + name + '</a></td><td>' + level + '</td><td>' + ilvl + '</td><td>' + gearscore + '</td><td>' + talents + '</td><td>' + hk + '</td><td class="text-nowrap">' + professions + '</td><td>' + guildRank + '</td><td id="' + characterName + '_AchievementPoints"></td></tr>');
				// $('tbody').append('<tr><td>' + factionIcon + '</td><td>' + raceIcon + '<span class="d-none">' + genderMap[data.response.gender] + '</span><span class="d-none">' + raceMap[data.response.race] + '</span></td><td>' + classIcon + '<span class="d-none">' + classMap[data.response.class] + '</span></td><td><a href="https://logs.stormforge.gg/en/character/' + realmName + '/' + data.response.name + '" target="_new">' + name + '</a></td><td>' + level + '</td><td>' + ilvl + '</td><td>' + gearscore + '</td><td>' + talents + '</td><td>' + hk + '</td><td class="text-nowrap">' + professions + '</td><td>' + guildRank + '</td><td>' + points + '</td></tr>');
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

	if ( $('.overlay').length != 1 ) {
		$('body').append('<div class="overlay position-fixed top-0 start-0 w-100 h-100 justify-content-center align-items-center d-none"><div class="content-box"><span class="loader me-2"></span>Loading...</div></div>');
	}
});
