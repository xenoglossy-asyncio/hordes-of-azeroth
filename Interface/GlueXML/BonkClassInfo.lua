BONK_CLASS_INFO = {
	WARRIOR = {
		blurb = VanillaBonkLocale.L("Fights in the thick of the horde. Every swing hits all around you, and there is no Rage to manage."),
		starter = { name = VanillaBonkLocale.L("Bloodthirst"), icon = "Interface\\Icons\\Spell_Nature_BloodLust", line = VanillaBonkLocale.L("Strikes 3 enemies and heals you"), tip = VanillaBonkLocale.L("Strikes the 3 nearest enemies within 8 yards for damage and heals you for 0.5% of your maximum health per enemy hit, up to 2.5%. Critical strikes Enrage you: 25% Haste for 4 sec.") },
		shared = {
			{ name = VanillaBonkLocale.L("Cleave"), icon = "Interface\\Icons\\Ability_Warrior_Cleave", line = VanillaBonkLocale.L("Strikes every enemy within 8 yards"), tip = VanillaBonkLocale.L("Strikes all enemies within 8 yards of you for damage.") },
		},
		specs = {
			{ name = VanillaBonkLocale.L("Arms"), icon = "Interface\\Icons\\Ability_Warrior_SavageBlow", text = VanillaBonkLocale.L("Stack Bleed on the pack, then cash it in with Mortal Strike."), spells = {
				{ name = VanillaBonkLocale.L("Rend"), icon = "Interface\\Icons\\Ability_Gouge", line = VanillaBonkLocale.L("Makes the 3 nearest enemies Bleed"), tip = VanillaBonkLocale.L("Wounds the 3 nearest enemies within 10 yards with 3 stacks of Bleed.") },
				{ name = VanillaBonkLocale.L("Deep Wounds"), icon = "Interface\\Icons\\Ability_BackStab", line = VanillaBonkLocale.L("Your critical strikes make enemies Bleed"), tip = VanillaBonkLocale.L("Your critical strikes wound the enemy with 2 stacks of Bleed, at most once every 0.5 sec per enemy.") },
				{ name = VanillaBonkLocale.L("Mortal Strike"), icon = "Interface\\Icons\\Ability_Warrior_SavageBlow", line = VanillaBonkLocale.L("Hits harder for each stack of Bleed"), tip = VanillaBonkLocale.L("Strikes all enemies within 8 yards of you for damage, 8% more per stack of Bleed on the target, up to 30 stacks.") },
			} },
			{ name = VanillaBonkLocale.L("Fury"), icon = "Interface\\Icons\\Ability_Warrior_InnerRage", text = VanillaBonkLocale.L("Critical strikes and kills Enrage you, and Enrage makes you strike faster."), spells = {
				{ name = VanillaBonkLocale.L("Bloodthirst"), icon = "Interface\\Icons\\Spell_Nature_BloodLust", line = VanillaBonkLocale.L("Strikes 3 enemies and heals you"), tip = VanillaBonkLocale.L("Strikes the 3 nearest enemies within 8 yards for damage and heals you for 0.5% of your maximum health per enemy hit, up to 2.5%. Critical strikes Enrage you: 25% Haste for 4 sec.") },
				{ name = VanillaBonkLocale.L("Execute"), icon = "Interface\\Icons\\INV_Sword_48", line = VanillaBonkLocale.L("Slays normal enemies below 20% health"), tip = VanillaBonkLocale.L("Strikes all enemies within 8 yards of you for damage. Normal enemies below 20% health die instantly; elites and bosses below 20% take triple damage. Kills Enrage you: 25% Haste for 4 sec.") },
				{ name = VanillaBonkLocale.L("Whirlwind"), icon = "Interface\\Icons\\Ability_Whirlwind", line = VanillaBonkLocale.L("Spins through the pack, twice when Enraged"), tip = VanillaBonkLocale.L("Spins, striking all enemies within 8 yards of you for damage. Spins twice while you are Enraged.") },
			} },
			{ name = VanillaBonkLocale.L("Protection"), icon = "Interface\\Icons\\INV_Shield_06", text = VanillaBonkLocale.L("Get hit, absorb it with your Shield, and punish it."), spells = {
				{ name = VanillaBonkLocale.L("Shield Block"), icon = "Interface\\Icons\\Ability_Defend", line = VanillaBonkLocale.L("A Shield that soaks damage, stacking up"), tip = VanillaBonkLocale.L("Adds a Shield of 10% of your maximum health that lasts until it absorbs damage, stacking up to 50%.") },
				{ name = VanillaBonkLocale.L("Thunder Clap"), icon = "Interface\\Icons\\Ability_ThunderClap", line = VanillaBonkLocale.L("Blasts nearby enemies and slows their attacks"), tip = VanillaBonkLocale.L("Blasts all enemies within 8 yards of you for damage. Enemies hit attack 20% slower for 6 sec.") },
				{ name = VanillaBonkLocale.L("Revenge"), icon = "Interface\\Icons\\Ability_Warrior_Revenge", line = VanillaBonkLocale.L("Strikes back when you are hit"), tip = VanillaBonkLocale.L("When you are struck, strikes all enemies within 6 yards of you for damage, at most once every 2 sec.") },
				{ name = VanillaBonkLocale.L("Shield Slam"), icon = "Interface\\Icons\\INV_Shield_05", line = VanillaBonkLocale.L("Hits harder the bigger your Shield"), tip = VanillaBonkLocale.L("Slams all enemies within 6 yards of you for damage, 2% more for each 1% of your maximum health in your Shield, up to 200% more.") },
			} },
		},
	},
	PALADIN = {
		blurb = VanillaBonkLocale.L("Seals change every strike and Judgement releases them. Holy light burns all around you, and hammers finish the wounded."),
		starter = { name = VanillaBonkLocale.L("Crusader Strike"), icon = "Interface\\Icons\\Spell_Holy_HolySmite", line = VanillaBonkLocale.L("Heavy strike with splash damage"), tip = VanillaBonkLocale.L("Strikes the nearest enemy for heavy damage and 30% of it to enemies within 5 yards of the target.") },
		shared = {
		},
		specs = {
			{ name = VanillaBonkLocale.L("Holy"), icon = "Interface\\Icons\\Spell_Holy_HolyBolt", text = VanillaBonkLocale.L("Holy strikes from afar: Exorcism, falling hammers and light that heals with every strike."), spells = {
				{ name = VanillaBonkLocale.L("Exorcism"), icon = "Interface\\Icons\\Spell_Holy_Excorcism_02", line = VanillaBonkLocale.L("Heavy Holy strike on the strongest enemy"), tip = VanillaBonkLocale.L("Strikes the strongest enemy within 30 yards for heavy Holy damage. Undead and Demons take triple damage, elites and bosses double. Another Paladin spell's critical strike makes it strike at once, at most once a sec.") },
				{ name = VanillaBonkLocale.L("Seal of Light"), icon = "Interface\\Icons\\Spell_Holy_HealingAura", line = VanillaBonkLocale.L("Your strikes heal you"), tip = VanillaBonkLocale.L("Every strike from your other Paladin spells heals you for 0.5% of your maximum health, at most 6 times a sec.") },
				{ name = VanillaBonkLocale.L("Light's Hammer"), icon = "Interface\\Icons\\Spell_Holy_FistOfJustice", line = VanillaBonkLocale.L("Hammers of light fall on the pack"), tip = VanillaBonkLocale.L("Hammers of light fall on 3 random enemies within 25 yards, each dealing Holy damage to every enemy within 5 yards.") },
			} },
			{ name = VanillaBonkLocale.L("Protection"), icon = "Interface\\Icons\\Spell_Holy_DevotionAura", text = VanillaBonkLocale.L("Holy ground and auras burn whoever comes close, while Divine Shield blocks the big hits."), spells = {
				{ name = VanillaBonkLocale.L("Consecration"), icon = "Interface\\Icons\\Spell_Holy_InnerFire", line = VanillaBonkLocale.L("Holy ground that burns enemies on it"), tip = VanillaBonkLocale.L("Consecrates the ground beneath you for 8 sec, dealing Holy damage every sec to enemies on it. You deal 15% more damage while standing on it.") },
				{ name = VanillaBonkLocale.L("Divine Shield"), icon = "Interface\\Icons\\Spell_Holy_DivineIntervention", line = VanillaBonkLocale.L("A bubble that blocks the next big hit"), tip = VanillaBonkLocale.L("A golden bubble forms around you and blocks the next enemy hit that would take more than 5% of your maximum health.") },
				{ name = VanillaBonkLocale.L("Retribution Aura"), icon = "Interface\\Icons\\Spell_Holy_AuraOfLight", line = VanillaBonkLocale.L("Burns every enemy close to you"), tip = VanillaBonkLocale.L("Burns every enemy within 10 yards of you with holy light, dealing Holy damage every sec. Enemies that strike you take double.") },
				{ name = VanillaBonkLocale.L("Hammer of Justice"), icon = "Interface\\Icons\\Spell_Holy_SealOfMight", line = VanillaBonkLocale.L("Stuns the strongest enemy"), tip = VanillaBonkLocale.L("Hurls a hammer at the strongest enemy within 20 yards, dealing Holy damage and stunning it for 2 sec. Bosses are not stunned.") },
			} },
			{ name = VanillaBonkLocale.L("Retribution"), icon = "Interface\\Icons\\Spell_Holy_AuraOfLight", text = VanillaBonkLocale.L("Crusader Strike and Seals on every swing, released by Judgement, with hammers for the wounded."), spells = {
				{ name = VanillaBonkLocale.L("Crusader Strike"), icon = "Interface\\Icons\\Spell_Holy_HolySmite", line = VanillaBonkLocale.L("Heavy strike with splash damage"), tip = VanillaBonkLocale.L("Strikes the nearest enemy for heavy damage and 30% of it to enemies within 5 yards of the target.") },
				{ name = VanillaBonkLocale.L("Judgement"), icon = "Interface\\Icons\\Spell_Holy_RighteousFury", line = VanillaBonkLocale.L("Hammers 3 enemies and releases your Seals"), tip = VanillaBonkLocale.L("Slams the 3 strongest enemies within 20 yards with a hammer of light for Holy damage, with double critical strike chance. Releases your Seals: Righteousness adds 50% damage, Command hits enemies within 5 yards of each target for half, Light heals you for 1% of your maximum health per enemy hit.") },
				{ name = VanillaBonkLocale.L("Seal of Command"), icon = "Interface\\Icons\\Ability_Warrior_InnerRage", line = VanillaBonkLocale.L("Every 3rd strike bursts with light"), tip = VanillaBonkLocale.L("Every 3rd strike from your other Paladin spells releases a burst of light, dealing Holy damage to the target and every enemy within 5 yards of it.") },
				{ name = VanillaBonkLocale.L("Seal of Righteousness"), icon = "Interface\\Icons\\Ability_ThunderBolt", line = VanillaBonkLocale.L("Your hits deal extra Holy damage"), tip = VanillaBonkLocale.L("Every hit from your other Paladin spells, splash and area hits included, deals 20% extra as Holy damage.") },
				{ name = VanillaBonkLocale.L("Divine Storm"), icon = "Interface\\Icons\\Spell_Holy_SealOfWrath", line = VanillaBonkLocale.L("Holy burst around you that heals"), tip = VanillaBonkLocale.L("Holy light bursts around you, dealing Holy damage to every enemy within 10 yards and healing you for 0.5% of your maximum health per enemy hit, up to 3%.") },
				{ name = VanillaBonkLocale.L("Hammer of Wrath"), icon = "Interface\\Icons\\Ability_ThunderClap", line = VanillaBonkLocale.L("Slays wounded enemies"), tip = VanillaBonkLocale.L("Hurls hammers at up to 3 enemies below 20% health within 30 yards. Normal enemies are slain; elites and bosses take heavy Holy damage.") },
			} },
		},
	},
	HUNTER = {
		blurb = VanillaBonkLocale.L("Shoots from range while pets fight at your side. Marks, stings and traps set up the kill."),
		starter = { name = VanillaBonkLocale.L("Arcane Shot"), icon = "Interface\\Icons\\Ability_ImpalingBolt", line = VanillaBonkLocale.L("Shoots the nearest enemy"), tip = VanillaBonkLocale.L("Shoots the nearest enemy for Arcane damage.") },
		shared = {
		},
		specs = {
			{ name = VanillaBonkLocale.L("Beast Mastery"), icon = "Interface\\Icons\\Ability_Hunter_BeastTaming", text = VanillaBonkLocale.L("Pets do the fighting: your cat bleeds the pack and the spirit wolf leads it."), spells = {
				{ name = VanillaBonkLocale.L("Call Pet"), icon = "Interface\\Icons\\Ability_Hunter_BeastCall", line = VanillaBonkLocale.L("Your cat fights for you"), tip = VanillaBonkLocale.L("Summons your cat to fight for you. Its Claw applies Bleed.") },
				{ name = VanillaBonkLocale.L("Pack Leader"), icon = "Interface\\Icons\\Spell_Nature_SpiritWolf", line = VanillaBonkLocale.L("A spirit wolf that empowers your pets"), tip = VanillaBonkLocale.L("A spirit wolf fights for you, biting for damage. Every 15 sec it howls, and your other pets deal double damage to all enemies in front for 6 sec.") },
			} },
			{ name = VanillaBonkLocale.L("Marksmanship"), icon = "Interface\\Icons\\Ability_Marksmanship", text = VanillaBonkLocale.L("Shots, volleys and piercing arrows, with Hunter's Mark on the biggest group."), spells = {
				{ name = VanillaBonkLocale.L("Arcane Shot"), icon = "Interface\\Icons\\Ability_ImpalingBolt", line = VanillaBonkLocale.L("Shoots the nearest enemy"), tip = VanillaBonkLocale.L("Shoots the nearest enemy for Arcane damage.") },
				{ name = VanillaBonkLocale.L("Multi-Shot"), icon = "Interface\\Icons\\Ability_UpgradeMoonGlaive", line = VanillaBonkLocale.L("3 arrows in a cone"), tip = VanillaBonkLocale.L("Fires 3 arrows in a cone in front of you, dealing damage.") },
				{ name = VanillaBonkLocale.L("Volley"), icon = "Interface\\Icons\\Ability_Marksmanship", line = VanillaBonkLocale.L("Rains arrows on the largest group"), tip = VanillaBonkLocale.L("Rains arrows on the largest group of enemies for 3 sec, dealing damage, 5% more for each different debuff on the target.") },
				{ name = VanillaBonkLocale.L("Aimed Shot"), icon = "Interface\\Icons\\INV_Spear_07", line = VanillaBonkLocale.L("A shot that pierces a whole line"), tip = VanillaBonkLocale.L("Fires a shot that pierces every enemy in a line, dealing damage. Aims at the Marked group, or else the largest group.") },
				{ name = VanillaBonkLocale.L("Hunter's Mark"), icon = "Interface\\Icons\\Ability_Hunter_SniperShot", line = VanillaBonkLocale.L("Marked enemies take more damage"), tip = VanillaBonkLocale.L("Marks every enemy within 10 yards of the largest group for 8 sec. Marked enemies take 15% more damage.") },
			} },
			{ name = VanillaBonkLocale.L("Survival"), icon = "Interface\\Icons\\Ability_Hunter_SwiftStrike", text = VanillaBonkLocale.L("Poison stings, and traps that burn or slow whatever walks in."), spells = {
				{ name = VanillaBonkLocale.L("Serpent Sting"), icon = "Interface\\Icons\\Ability_Hunter_Quickshot", line = VanillaBonkLocale.L("Poisons the nearest enemies"), tip = VanillaBonkLocale.L("Stings the nearest enemy and 2 enemies near it with 3 stacks of Poison.") },
				{ name = VanillaBonkLocale.L("Explosive Trap"), icon = "Interface\\Icons\\Spell_Fire_SelfDestruct", line = VanillaBonkLocale.L("A trap that explodes and burns the ground"), tip = VanillaBonkLocale.L("Places a fire trap that explodes when an enemy comes close, dealing damage and burning the ground for 4 sec, applying Burning.") },
				{ name = VanillaBonkLocale.L("Frost Trap"), icon = "Interface\\Icons\\Spell_Frost_FreezingBreath", line = VanillaBonkLocale.L("A trap that slows the pack"), tip = VanillaBonkLocale.L("Places a frost trap that goes off when an enemy comes close, slowing normal enemies inside by 60% for 6 sec. They take 5% more damage.") },
			} },
		},
	},
	ROGUE = {
		blurb = VanillaBonkLocale.L("The fastest single-target attacks in the game. Every stab carries a poison or an opener."),
		starter = { name = VanillaBonkLocale.L("Sinister Strike"), icon = "Interface\\Icons\\Spell_Shadow_RitualOfSacrifice", line = VanillaBonkLocale.L("Fast stabs on the nearest enemy"), tip = VanillaBonkLocale.L("Stabs the nearest enemy for damage.") },
		shared = {
		},
		specs = {
			{ name = VanillaBonkLocale.L("Assassination"), icon = "Interface\\Icons\\Ability_Rogue_Eviscerate", text = VanillaBonkLocale.L("Poison on every hit, then Envenom the most poisoned enemy."), spells = {
				{ name = VanillaBonkLocale.L("Mutilate"), icon = "Interface\\Icons\\Ability_BackStab", line = VanillaBonkLocale.L("Two poisoned stabs on the nearest enemy"), tip = VanillaBonkLocale.L("Stabs the nearest enemy with both daggers for damage, each stab applying 1 stack of Poison. Deals 30% more to Poisoned enemies.") },
				{ name = VanillaBonkLocale.L("Deadly Poison"), icon = "Interface\\Icons\\Ability_Rogue_DualWeild", line = VanillaBonkLocale.L("Your hits apply Poison"), tip = VanillaBonkLocale.L("Your other abilities apply 1 stack of Poison with every hit.") },
				{ name = VanillaBonkLocale.L("Fan of Knives"), icon = "Interface\\Icons\\INV_ThrowingKnife_04", line = VanillaBonkLocale.L("Knives in every direction"), tip = VanillaBonkLocale.L("Throws knives in every direction, striking all enemies within 10 yards for damage and applying 2 stacks of Poison. Every knife carries your poisons and openers.") },
				{ name = VanillaBonkLocale.L("Envenom"), icon = "Interface\\Icons\\Ability_Creature_Poison_06", line = VanillaBonkLocale.L("Strikes the most poisoned enemy"), tip = VanillaBonkLocale.L("Strikes the enemy with the most Poison for Nature damage, and your hits apply 2 more stacks of Poison for 5 sec.") },
			} },
			{ name = VanillaBonkLocale.L("Combat"), icon = "Interface\\Icons\\Ability_BackStab", text = VanillaBonkLocale.L("Fast blades: Blade Flurry, Eviscerate and Killing Spree through the pack."), spells = {
				{ name = VanillaBonkLocale.L("Sinister Strike"), icon = "Interface\\Icons\\Spell_Shadow_RitualOfSacrifice", line = VanillaBonkLocale.L("Fast stabs on the nearest enemy"), tip = VanillaBonkLocale.L("Stabs the nearest enemy for damage.") },
				{ name = VanillaBonkLocale.L("Blade Flurry"), icon = "Interface\\Icons\\Ability_Warrior_PunishingBlow", line = VanillaBonkLocale.L("Your hits strike 4 more enemies"), tip = VanillaBonkLocale.L("Your single-target hits also strike 4 more enemies within 8 yards at 50% damage for 8 sec. The extra hits carry your poisons and openers.") },
				{ name = VanillaBonkLocale.L("Eviscerate"), icon = "Interface\\Icons\\Ability_Rogue_Eviscerate", line = VanillaBonkLocale.L("Heavy strike with double crit chance"), tip = VanillaBonkLocale.L("Guts the nearest enemy for heavy damage, with double critical strike chance.") },
				{ name = VanillaBonkLocale.L("Killing Spree"), icon = "Interface\\Icons\\Ability_Rogue_SliceDice", line = VanillaBonkLocale.L("8 strikes on random enemies"), tip = VanillaBonkLocale.L("Strikes 8 times over 2 sec, each strike hitting a random enemy within 10 yards for damage and carrying your poisons and openers.") },
			} },
			{ name = VanillaBonkLocale.L("Subtlety"), icon = "Interface\\Icons\\Ability_Stealth", text = VanillaBonkLocale.L("Ambush every new enemy you hit, and Shadow Dance to do it again."), spells = {
				{ name = VanillaBonkLocale.L("Shuriken Toss"), icon = "Interface\\Icons\\INV_ThrowingAxe_06", line = VanillaBonkLocale.L("Shurikens at fresh enemies"), tip = VanillaBonkLocale.L("Throws shurikens at the 3 nearest enemies within 20 yards, ones you have not hit yet first, dealing damage.") },
				{ name = VanillaBonkLocale.L("Ambush"), icon = "Interface\\Icons\\Ability_Rogue_Ambush", line = VanillaBonkLocale.L("Your first hit on each enemy ambushes it"), tip = VanillaBonkLocale.L("Your first hit on each enemy with your other abilities is followed by an Ambush for heavy damage, with double critical strike chance.") },
				{ name = VanillaBonkLocale.L("Shadow Dance"), icon = "Interface\\Icons\\Spell_Shadow_Charm", line = VanillaBonkLocale.L("More damage, and Ambush again"), tip = VanillaBonkLocale.L("Your hits deal 30% more damage for 4 sec and can set off Ambush again, once a sec per enemy.") },
				{ name = VanillaBonkLocale.L("Evasion"), icon = "Interface\\Icons\\Spell_Shadow_ShadowWard", line = VanillaBonkLocale.L("Dodge far more attacks for a while"), tip = VanillaBonkLocale.L("You dodge 50% more attacks for 5 sec.") },
			} },
		},
	},
	PRIEST = {
		blurb = VanillaBonkLocale.L("Healing that overflows into damage, a ring of light that hits far, and Decay that spreads from mind to mind."),
		starter = { name = VanillaBonkLocale.L("Smite"), icon = "Interface\\Icons\\Spell_Holy_HolySmite", line = VanillaBonkLocale.L("Smites the 2 nearest enemies"), tip = VanillaBonkLocale.L("Smites the 2 nearest enemies for Holy damage. Each Smite takes 1 sec off Holy Word: Chastise.") },
		shared = {
		},
		specs = {
			{ name = VanillaBonkLocale.L("Discipline"), icon = "Interface\\Icons\\Spell_Holy_WordFortitude", text = VanillaBonkLocale.L("Shields, fear and binding, while Penance punishes whoever strikes you."), spells = {
				{ name = VanillaBonkLocale.L("Power Word: Shield"), icon = "Interface\\Icons\\Spell_Holy_PowerWordShield", line = VanillaBonkLocale.L("A shield that makes you faster"), tip = VanillaBonkLocale.L("Shields you for 10% of your maximum health; each cast tops it back up instead of stacking. You move 10% faster while shielded.") },
				{ name = VanillaBonkLocale.L("Penance"), icon = "Interface\\Icons\\Spell_Holy_HolyBolt", line = VanillaBonkLocale.L("Holy bolts at whoever struck you"), tip = VanillaBonkLocale.L("Fires 3 holy bolts at the enemies that struck you last, or the nearest enemies, each dealing Holy damage and healing you for 0.5% of your maximum health. Healing past full health becomes Shield.") },
				{ name = VanillaBonkLocale.L("Psychic Scream"), icon = "Interface\\Icons\\Spell_Shadow_PsychicScream", line = VanillaBonkLocale.L("Nearby enemies flee in fear"), tip = VanillaBonkLocale.L("Normal enemies within 8 yards flee in fear for 2 sec and take Shadow damage every sec. Elites, mini-bosses and bosses do not flee.") },
				{ name = VanillaBonkLocale.L("Shackle"), icon = "Interface\\Icons\\Spell_Nature_Slow", line = VanillaBonkLocale.L("Binds the strongest enemy"), tip = VanillaBonkLocale.L("Binds the strongest enemy nearby, elites first, for 2 sec. It takes Holy damage when bound and every sec while bound. Bosses and mini-bosses cannot be bound but still take the first hit.") },
			} },
			{ name = VanillaBonkLocale.L("Holy"), icon = "Interface\\Icons\\Spell_Holy_PrayerOfHealing02", text = VanillaBonkLocale.L("Heals that overflow into damage, and Holy Word strikes the strongest enemy."), spells = {
				{ name = VanillaBonkLocale.L("Smite"), icon = "Interface\\Icons\\Spell_Holy_HolySmite", line = VanillaBonkLocale.L("Smites the 2 nearest enemies"), tip = VanillaBonkLocale.L("Smites the 2 nearest enemies for Holy damage. Each Smite takes 1 sec off Holy Word: Chastise.") },
				{ name = VanillaBonkLocale.L("Renew"), icon = "Interface\\Icons\\Spell_Holy_Renew", line = VanillaBonkLocale.L("Heals you, then smites at full health"), tip = VanillaBonkLocale.L("Heals you for 1% of your maximum health every sec. At full health, each tick smites the nearest enemy within 30 yards for Holy damage instead.") },
				{ name = VanillaBonkLocale.L("Halo"), icon = "Interface\\Icons\\Spell_Holy_PrayerOfHealing02", line = VanillaBonkLocale.L("A ring of light that heals you"), tip = VanillaBonkLocale.L("A ring of light hits every enemy within 16 yards of you for Holy damage and heals you for 0.5% of your maximum health per enemy hit, up to 2%.") },
				{ name = VanillaBonkLocale.L("Holy Word: Chastise"), icon = "Interface\\Icons\\Spell_Holy_Excorcism_02", line = VanillaBonkLocale.L("Heavy Holy strike on the strongest enemy"), tip = VanillaBonkLocale.L("The Light strikes the strongest enemy nearby, elites first, for heavy Holy damage. Each Smite or Halo cast takes 1 sec off its cooldown.") },
			} },
			{ name = VanillaBonkLocale.L("Shadow"), icon = "Interface\\Icons\\Spell_Shadow_ShadowWordPain", text = VanillaBonkLocale.L("Plant Decay on the far edge of the horde and spread it from mind to mind."), spells = {
				{ name = VanillaBonkLocale.L("Shadow Word: Pain"), icon = "Interface\\Icons\\Spell_Shadow_ShadowWordPain", line = VanillaBonkLocale.L("Plants Decay on far enemies"), tip = VanillaBonkLocale.L("Afflicts the 3 enemies farthest from you within 35 yards with 6 stacks of Decay.") },
				{ name = VanillaBonkLocale.L("Mind Flay"), icon = "Interface\\Icons\\Spell_Shadow_SiphonMana", line = VanillaBonkLocale.L("Flays the nearest enemy until it dies"), tip = VanillaBonkLocale.L("Flays the nearest enemy within 20 yards, dealing Shadow damage, applying 1 stack of Decay and slowing it by 30%. Keeps flaying it until it dies or leaves range.") },
				{ name = VanillaBonkLocale.L("Mind Blast"), icon = "Interface\\Icons\\Spell_Shadow_UnholyFrenzy", line = VanillaBonkLocale.L("Spreads Decay from the most decayed enemy"), tip = VanillaBonkLocale.L("Blasts the enemy with the most Decay for Shadow damage. Every enemy within 8 yards of it gains as many Decay stacks as it has, up to 10.") },
				{ name = VanillaBonkLocale.L("Shadowfiend"), icon = "Interface\\Icons\\Spell_Shadow_GatherShadows", line = VanillaBonkLocale.L("A Shadowfiend that heals you"), tip = VanillaBonkLocale.L("Summons a Shadowfiend whose attacks apply Decay and heal you for 0.5% of your maximum health.") },
			} },
		},
	},
	SHAMAN = {
		blurb = VanillaBonkLocale.L("Lightning that builds Static, Windfury bursts in melee, and totems that hold the ground."),
		starter = { name = VanillaBonkLocale.L("Lightning Bolt"), icon = "Interface\\Icons\\Spell_Nature_Lightning", line = VanillaBonkLocale.L("Lightning that bounces once"), tip = VanillaBonkLocale.L("Hurls lightning at the nearest enemy, bouncing to 1 more, dealing Nature damage and 1 stack of Static to each.") },
		shared = {
			{ name = VanillaBonkLocale.L("Lightning Shield"), icon = "Interface\\Icons\\Spell_Nature_LightningShield", line = VanillaBonkLocale.L("Zaps enemies that strike you"), tip = VanillaBonkLocale.L("Surrounds you with up to 3 lightning charges. An enemy that strikes you is zapped for Nature damage and 1 stack of Static. One charge returns every 3 sec.") },
		},
		specs = {
			{ name = VanillaBonkLocale.L("Elemental"), icon = "Interface\\Icons\\Spell_Nature_Lightning", text = VanillaBonkLocale.L("Lightning builds Static on the pack, and shocks cash it in."), spells = {
				{ name = VanillaBonkLocale.L("Lightning Bolt"), icon = "Interface\\Icons\\Spell_Nature_Lightning", line = VanillaBonkLocale.L("Lightning that bounces once"), tip = VanillaBonkLocale.L("Hurls lightning at the nearest enemy, bouncing to 1 more, dealing Nature damage and 1 stack of Static to each.") },
				{ name = VanillaBonkLocale.L("Chain Lightning"), icon = "Interface\\Icons\\Spell_Nature_ChainLightning", line = VanillaBonkLocale.L("Lightning that jumps to 4 more"), tip = VanillaBonkLocale.L("Hurls lightning at the nearest enemy, jumping to 4 more, dealing Nature damage and 1 stack of Static to each.") },
				{ name = VanillaBonkLocale.L("Flame Shock"), icon = "Interface\\Icons\\Spell_Fire_FlameShock", line = VanillaBonkLocale.L("Burns the strongest enemy"), tip = VanillaBonkLocale.L("Shocks the strongest enemy nearby, elites first, dealing Fire damage and applying 6 stacks of Burning.") },
				{ name = VanillaBonkLocale.L("Earth Shock"), icon = "Interface\\Icons\\Spell_Nature_EarthShock", line = VanillaBonkLocale.L("Discharges Static on the pack"), tip = VanillaBonkLocale.L("Shocks the enemy with the most Static for Nature damage, 50% more per Static stack. Consumes the stacks in a discharge that also hits up to 3 nearby enemies.") },
			} },
			{ name = VanillaBonkLocale.L("Enhancement"), icon = "Interface\\Icons\\Spell_Nature_LightningShield", text = VanillaBonkLocale.L("Windfury swings in melee, and every 5th hit hurls free lightning."), spells = {
				{ name = VanillaBonkLocale.L("Windfury Weapon"), icon = "Interface\\Icons\\Spell_Nature_Cyclone", line = VanillaBonkLocale.L("Swings with Windfury bursts"), tip = VanillaBonkLocale.L("Swings at the nearest enemy for damage. Every 3rd swing calls Windfury: 2 extra swings that also hit enemies within 4 yards of the target.") },
				{ name = VanillaBonkLocale.L("Stormstrike"), icon = "Interface\\Icons\\Spell_Holy_SealOfMight", line = VanillaBonkLocale.L("Two strikes that build Static"), tip = VanillaBonkLocale.L("Strikes the nearest enemy within 12 yards twice, with weapon and lightning, for damage, applying 2 stacks of Static and 2 stacks of Nature Vulnerability.") },
				{ name = VanillaBonkLocale.L("Maelstrom Weapon"), icon = "Interface\\Icons\\Spell_Nature_StormReach", line = VanillaBonkLocale.L("Every 5th hit hurls free lightning"), tip = VanillaBonkLocale.L("Every 5th melee hit hurls a free Lightning Bolt at the nearest enemy, or a Chain Lightning if you have it, dealing Nature damage. Melee hits are Windfury Weapon swings, Stormstrike and Feral Spirit bites.") },
				{ name = VanillaBonkLocale.L("Feral Spirit"), icon = "Interface\\Icons\\Spell_Nature_SpiritWolf", line = VanillaBonkLocale.L("2 spirit wolves fight for you"), tip = VanillaBonkLocale.L("Summons 2 spirit wolves whose bites apply Static.") },
			} },
			{ name = VanillaBonkLocale.L("Totemic"), icon = "Interface\\Icons\\Spell_Nature_MagicImmunity", text = VanillaBonkLocale.L("Totems at your feet burn the pack and heal you while you hold the ground."), spells = {
				{ name = VanillaBonkLocale.L("Searing Totem"), icon = "Interface\\Icons\\Spell_Fire_SearingTotem", line = VanillaBonkLocale.L("A totem that hurls fire"), tip = VanillaBonkLocale.L("Plants a Searing Totem at your feet that hurls fire at an enemy within 20 yards, applying Burning. It is replanted when you move away.") },
				{ name = VanillaBonkLocale.L("Magma Totem"), icon = "Interface\\Icons\\Spell_Fire_SelfDestruct", line = VanillaBonkLocale.L("A totem that pulses fire around you"), tip = VanillaBonkLocale.L("Plants a Magma Totem at your feet that pulses fire every 2 sec, dealing Fire damage and 1 stack of Burning to enemies within 8 yards.") },
				{ name = VanillaBonkLocale.L("Healing Stream Totem"), icon = "Interface\\Icons\\INV_Spear_04", line = VanillaBonkLocale.L("A totem that heals you"), tip = VanillaBonkLocale.L("Plants a Healing Stream Totem at your feet that heals you for 1% of your maximum health every sec while you stay within 15 yards.") },
			} },
		},
	},
	MAGE = {
		blurb = VanillaBonkLocale.L("Frost controls and shatters, Fire burns and nukes, and Arcane blinks through the horde."),
		starter = { name = VanillaBonkLocale.L("Frostbolt"), icon = "Interface\\Icons\\Spell_Frost_FrostBolt02", line = VanillaBonkLocale.L("Shatters frozen enemies"), tip = VanillaBonkLocale.L("Launches a bolt of frost at the nearest enemy, dealing Frost damage and applying 1 stack of Chill. Deals 50% more to Frozen enemies, and your Frost spells always critically strike them.") },
		shared = {
			{ name = VanillaBonkLocale.L("Summon Elemental"), icon = "Interface\\Icons\\Spell_Frost_SummonWaterElemental", line = VanillaBonkLocale.L("An elemental fights for you"), tip = VanillaBonkLocale.L("Summons an elemental to fight for you, following the school most of your spells belong to.") },
		},
		specs = {
			{ name = VanillaBonkLocale.L("Arcane"), icon = "Interface\\Icons\\Spell_Holy_MagicalSentry", text = VanillaBonkLocale.L("Blink through the horde. Every Blink sets off Arcane Explosion and Missiles."), spells = {
				{ name = VanillaBonkLocale.L("Blink"), icon = "Interface\\Icons\\Spell_Arcane_Blink", line = VanillaBonkLocale.L("Your dash teleports and explodes"), tip = VanillaBonkLocale.L("Your dash becomes Blink, teleporting you, with 1 more charge and 30% faster recharge. Each Blink sets off an Arcane Explosion where you leave, dealing Arcane damage to enemies within 10 yards. Takes a spell slot.") },
				{ name = VanillaBonkLocale.L("Arcane Explosion"), icon = "Interface\\Icons\\Spell_Nature_WispSplode", line = VanillaBonkLocale.L("Arcane blast around you"), tip = VanillaBonkLocale.L("Blasts all enemies within 10 yards of you with arcane energy, dealing Arcane damage. Also goes off where you land after each Blink.") },
				{ name = VanillaBonkLocale.L("Arcane Missiles"), icon = "Interface\\Icons\\Spell_Nature_StarFall", line = VanillaBonkLocale.L("5 missiles at the nearest enemy"), tip = VanillaBonkLocale.L("Launches 5 Arcane Missiles at the nearest enemy over 1 sec, each dealing Arcane damage. After each Blink, it fires all 5 at once.") },
			} },
			{ name = VanillaBonkLocale.L("Fire"), icon = "Interface\\Icons\\Spell_Fire_FireBolt02", text = VanillaBonkLocale.L("Burn everything, then nuke the most burning enemies."), spells = {
				{ name = VanillaBonkLocale.L("Fireball"), icon = "Interface\\Icons\\Spell_Fire_FlameBolt", line = VanillaBonkLocale.L("Fire bolt that leaves enemies Burning"), tip = VanillaBonkLocale.L("Hurls a fiery ball at the nearest enemy, dealing Fire damage and applying 2 stacks of Burning.") },
				{ name = VanillaBonkLocale.L("Flamestrike"), icon = "Interface\\Icons\\Spell_Fire_SelfDestruct", line = VanillaBonkLocale.L("A pillar of fire on the largest group"), tip = VanillaBonkLocale.L("Calls down a pillar of fire on the largest group of enemies, dealing Fire damage and applying 2 stacks of Burning.") },
				{ name = VanillaBonkLocale.L("Pyroblast"), icon = "Interface\\Icons\\Spell_Fire_Fireball02", line = VanillaBonkLocale.L("Huge fireball on elites and bosses"), tip = VanillaBonkLocale.L("Hurls a huge fireball at an elite or boss, or else the largest group, dealing heavy Fire damage to the target and 35% of it to enemies within 6 yards.") },
				{ name = VanillaBonkLocale.L("Fire Blast"), icon = "Interface\\Icons\\Spell_Fire_Fireball", line = VanillaBonkLocale.L("Blasts the most burning enemies"), tip = VanillaBonkLocale.L("Blasts the 3 enemies with the most Burning, dealing Fire damage, 10% more per Burning stack, up to 30 stacks.") },
			} },
			{ name = VanillaBonkLocale.L("Frost"), icon = "Interface\\Icons\\Spell_Frost_FrostBolt02", text = VanillaBonkLocale.L("Chill and freeze the pack, then shatter frozen enemies with Frostbolt."), spells = {
				{ name = VanillaBonkLocale.L("Frostbolt"), icon = "Interface\\Icons\\Spell_Frost_FrostBolt02", line = VanillaBonkLocale.L("Shatters frozen enemies"), tip = VanillaBonkLocale.L("Launches a bolt of frost at the nearest enemy, dealing Frost damage and applying 1 stack of Chill. Deals 50% more to Frozen enemies, and your Frost spells always critically strike them.") },
				{ name = VanillaBonkLocale.L("Blizzard"), icon = "Interface\\Icons\\Spell_Frost_IceStorm", line = VanillaBonkLocale.L("Ice shards on the largest group"), tip = VanillaBonkLocale.L("Ice shards pelt the largest group of enemies for 4 sec, dealing Frost damage and applying 1 stack of Chill every sec.") },
				{ name = VanillaBonkLocale.L("Frost Nova"), icon = "Interface\\Icons\\Spell_Frost_FrostNova", line = VanillaBonkLocale.L("Frost blast around you"), tip = VanillaBonkLocale.L("Blasts all enemies within 10 yards of you with frost, dealing Frost damage and applying 3 stacks of Chill.") },
			} },
		},
	},
	WARLOCK = {
		blurb = VanillaBonkLocale.L("A crew of demons at your side, afflictions that grow with time, and fel fire that rains on the pack."),
		starter = { name = VanillaBonkLocale.L("Shadow Bolt"), icon = "Interface\\Icons\\Spell_Shadow_ShadowBolt", line = VanillaBonkLocale.L("Kills fire more Shadow Bolts"), tip = VanillaBonkLocale.L("Fires a Shadow Bolt at the nearest enemy, dealing damage. Nightfall: enemies that die with your afflictions on them fire a free bolt, at most 1 a sec.") },
		shared = {
		},
		specs = {
			{ name = VanillaBonkLocale.L("Affliction"), icon = "Interface\\Icons\\Spell_Shadow_DeathCoil", text = VanillaBonkLocale.L("Corruption and Curse of Agony grow with time while Drain Life keeps you alive."), spells = {
				{ name = VanillaBonkLocale.L("Corruption"), icon = "Interface\\Icons\\Spell_Shadow_AbominationExplosion", line = VanillaBonkLocale.L("Decay that grows on the nearest enemies"), tip = VanillaBonkLocale.L("Corrupts the 2 nearest enemies with 1 stack of Decay, or 2 on an enemy without Decay.") },
				{ name = VanillaBonkLocale.L("Curse of Agony"), icon = "Interface\\Icons\\Spell_Shadow_CurseOfSargeras", line = VanillaBonkLocale.L("Agony on the healthiest enemies"), tip = VanillaBonkLocale.L("Curses the 2 enemies with the most health with 1 stack of Agony, or 2 on an uncursed enemy.") },
				{ name = VanillaBonkLocale.L("Drain Life"), icon = "Interface\\Icons\\Spell_Shadow_LifeDrain02", line = VanillaBonkLocale.L("Drains life while you move"), tip = VanillaBonkLocale.L("Drains the nearest enemy within 16 yards, dealing damage every sec and healing you for 0.2% of your maximum health per enemy drained.") },
			} },
			{ name = VanillaBonkLocale.L("Demonology"), icon = "Interface\\Icons\\Spell_Shadow_Metamorphosis", text = VanillaBonkLocale.L("A crew of demons out at once: Imp, Voidwalker, Succubus and Felhunter."), spells = {
				{ name = VanillaBonkLocale.L("Imp"), icon = "Interface\\Icons\\Spell_Shadow_SummonImp", line = VanillaBonkLocale.L("An Imp that hurls fire"), tip = VanillaBonkLocale.L("Summons an Imp that hurls 2 Firebolts at a time at enemies within 30 yards, leaving them burning.") },
				{ name = VanillaBonkLocale.L("Voidwalker"), icon = "Interface\\Icons\\Spell_Shadow_SummonVoidWalker", line = VanillaBonkLocale.L("A Voidwalker that bursts in a void nova"), tip = VanillaBonkLocale.L("Summons a Voidwalker that consumes enemies dying near it. After 8 it bursts in a void nova that hits every enemy around it.") },
				{ name = VanillaBonkLocale.L("Succubus"), icon = "Interface\\Icons\\Spell_Shadow_SummonSuccubus", line = VanillaBonkLocale.L("A Succubus that lashes a wide arc"), tip = VanillaBonkLocale.L("Summons a Succubus whose Lash of Pain strikes all enemies in a wide arc in front of her and applies Shadow Vulnerability.") },
				{ name = VanillaBonkLocale.L("Felhunter"), icon = "Interface\\Icons\\Spell_Shadow_SummonFelHunter", line = VanillaBonkLocale.L("A Felhunter that bites afflicted enemies"), tip = VanillaBonkLocale.L("Summons a Felhunter whose Shadow Bite deals 10% more damage per affliction on the target and interrupts spells. Every 10 sec it removes a harmful effect from you.") },
			} },
			{ name = VanillaBonkLocale.L("Destruction"), icon = "Interface\\Icons\\Spell_Shadow_RainOfFire", text = VanillaBonkLocale.L("Fel fire: Shadow Bolt, Immolate, Hellfire and Rain of Fire on the pack."), spells = {
				{ name = VanillaBonkLocale.L("Shadow Bolt"), icon = "Interface\\Icons\\Spell_Shadow_ShadowBolt", line = VanillaBonkLocale.L("Kills fire more Shadow Bolts"), tip = VanillaBonkLocale.L("Fires a Shadow Bolt at the nearest enemy, dealing damage. Nightfall: enemies that die with your afflictions on them fire a free bolt, at most 1 a sec.") },
				{ name = VanillaBonkLocale.L("Immolate"), icon = "Interface\\Icons\\Spell_Fire_Immolation", line = VanillaBonkLocale.L("Fire that leaves enemies Burning"), tip = VanillaBonkLocale.L("Strikes the 2 nearest enemies with fire, dealing damage and applying 2 stacks of Burning.") },
				{ name = VanillaBonkLocale.L("Hellfire"), icon = "Interface\\Icons\\Spell_Fire_Incinerate", line = VanillaBonkLocale.L("Fire burns everything around you"), tip = VanillaBonkLocale.L("Fire burns every enemy within 8 yards of you, dealing damage.") },
				{ name = VanillaBonkLocale.L("Rain of Fire"), icon = "Interface\\Icons\\Spell_Shadow_RainOfFire", line = VanillaBonkLocale.L("Fire rains on the largest group"), tip = VanillaBonkLocale.L("Rains fire on the largest group of enemies for 4 sec, dealing damage and applying 1 stack of Burning every sec.") },
			} },
		},
	},
	DRUID = {
		blurb = VanillaBonkLocale.L("A shapeshifter that changes between Moonkin, Cat, Bear and Tree of Life. Every spell works in every form, and the right form makes it 30% stronger."),
		starter = { name = VanillaBonkLocale.L("Shapeshift"), icon = "Interface\\Icons\\Ability_Druid_CatForm", line = VanillaBonkLocale.L("Press 'R' to change form"), tip = VanillaBonkLocale.L("Shapeshift (R) shifts you into your next form. Each form attacks on its own; Druid spells deal and heal 30% more in their own form.|n|n|cffffffffMoonkin Form:|r Hurls Wrath at the nearest enemy, splashing 45% on enemies within 5 yards. Every 3 sec, Starfall strikes 3 different enemies with Moonfire.|n|n|cffffffffCat Form:|r Claws the nearest enemy, splashing 40% on enemies within 5 yards, and applies 1 stack of Bleed. You move 15% faster, and your critical strikes apply 1 stack of Bleed.|n|n|cffffffffBear Form:|r Mauls the nearest enemy, splashing 10% on enemies within 5 yards. You take 35% less damage, and your spells of other forms deal 20% less. Swipe deals 8% more per enemy within 8 yards, up to 64%. Every 6 sec, a roar Dazes enemies within 10 yards; they deal 25% less damage for 4 sec.|n|n|cffffffffTree of Life:|r Vines lash 3 enemies, splashing 20% on enemies within 5 yards, and each hit heals you 0.3% of your maximum health. Calls 1 additional Treant, and Rejuvenation blooms 50% faster.") },
		shared = {
		},
		specs = {
			{ name = VanillaBonkLocale.L("Balance"), icon = "Interface\\Icons\\Spell_Nature_StarFall", text = VanillaBonkLocale.L("Moonkin form. Starlight on the strongest enemy, Moonfire on the pack and storms on the crowd."), spells = {
				{ name = VanillaBonkLocale.L("Starfire"), icon = "Interface\\Icons\\Spell_Arcane_StarFire", line = VanillaBonkLocale.L("Starlight on the strongest enemy"), tip = VanillaBonkLocale.L("Calls down starlight on the strongest enemy within 30 yards for heavy Arcane damage. Empowered in Moonkin Form.") },
				{ name = VanillaBonkLocale.L("Moonfire"), icon = "Interface\\Icons\\Spell_Nature_StarFall", line = VanillaBonkLocale.L("Moonfire on the nearest enemies"), tip = VanillaBonkLocale.L("Burns the 2 nearest enemies with moonlight for Arcane damage and 1 stack of Moonfire, choosing enemies without Moonfire first. Empowered in Moonkin Form.") },
				{ name = VanillaBonkLocale.L("Hurricane"), icon = "Interface\\Icons\\Spell_Nature_Cyclone", line = VanillaBonkLocale.L("A storm on the largest group"), tip = VanillaBonkLocale.L("A storm rages over the largest group of enemies for 4 sec, dealing Nature damage every sec to enemies within 8 yards and leaving them Dazed. Empowered in Moonkin Form.") },
			} },
			{ name = VanillaBonkLocale.L("Feral"), icon = "Interface\\Icons\\Ability_Racial_BearForm", text = VanillaBonkLocale.L("Cat and Bear form. Bleed the pack, Shred the deepest bleeder, and shift to Bear when you are hurt."), spells = {
				{ name = VanillaBonkLocale.L("Rake"), icon = "Interface\\Icons\\Ability_Druid_Disembowel", line = VanillaBonkLocale.L("Makes the 3 nearest enemies Bleed"), tip = VanillaBonkLocale.L("Rakes the 3 nearest enemies within 10 yards for damage and 2 stacks of Bleed. Empowered in Cat Form.") },
				{ name = VanillaBonkLocale.L("Shred"), icon = "Interface\\Icons\\Spell_Shadow_VampiricAura", line = VanillaBonkLocale.L("Strikes the enemy with the most Bleed stacks"), tip = VanillaBonkLocale.L("Shreds the enemy within 10 yards with the most stacks of Bleed for damage, 3% more per stack of Bleed on it, up to 30 stacks. Empowered in Cat Form.") },
				{ name = VanillaBonkLocale.L("Swipe"), icon = "Interface\\Icons\\INV_Misc_MonsterClaw_03", line = VanillaBonkLocale.L("Hits every enemy within 10 yards"), tip = VanillaBonkLocale.L("Swipes every enemy within 10 yards for damage. Empowered in Bear Form.") },
				{ name = VanillaBonkLocale.L("Frenzied Regeneration"), icon = "Interface\\Icons\\Ability_BullRush", line = VanillaBonkLocale.L("Heals you for each enemy close by"), tip = VanillaBonkLocale.L("Heals you for 0.25% of your maximum health per enemy within 8 yards, up to 5 enemies. Empowered in Bear Form.") },
			} },
			{ name = VanillaBonkLocale.L("Restoration"), icon = "Interface\\Icons\\Spell_Nature_HealingTouch", text = VanillaBonkLocale.L("Tree of Life. Heals that hurt, while Treants and roots hold the crowd."), spells = {
				{ name = VanillaBonkLocale.L("Rejuvenation"), icon = "Interface\\Icons\\Spell_Nature_Rejuvenation", line = VanillaBonkLocale.L("Heals you and lashes nearby enemies"), tip = VanillaBonkLocale.L("Heals you for 0.3% of your maximum health, and its thorny bloom lashes the 3 nearest enemies within 10 yards for Nature damage. Empowered in Tree of Life.") },
				{ name = VanillaBonkLocale.L("Force of Nature"), icon = "Interface\\Icons\\Spell_Nature_NatureTouchGrow", line = VanillaBonkLocale.L("2 Treants fight at your side"), tip = VanillaBonkLocale.L("Summons 2 Treants that fight at your side. Their swings apply 1 stack of Moonfire, and every 6 sec a Treant's strike roots its target and normal enemies within 5 yards for 2 sec. Empowered in Tree of Life, which also calls 1 additional Treant.") },
				{ name = VanillaBonkLocale.L("Entangling Roots"), icon = "Interface\\Icons\\Spell_Nature_StrangleVines", line = VanillaBonkLocale.L("Roots the 3 nearest enemies"), tip = VanillaBonkLocale.L("Roots grasp the 3 nearest enemies within 25 yards for Nature damage and root normal enemies for 2 sec. Empowered in Tree of Life.") },
				{ name = VanillaBonkLocale.L("Tranquility"), icon = "Interface\\Icons\\Spell_Nature_Tranquility", line = VanillaBonkLocale.L("Pulses that hurt enemies and heal you"), tip = VanillaBonkLocale.L("Calms the air around you for 4 sec. Every sec, deals Nature damage to every enemy within 10 yards and heals you for 0.5% of your maximum health. Empowered in Tree of Life.") },
				{ name = VanillaBonkLocale.L("Thorns"), icon = "Interface\\Icons\\Spell_Nature_Thorns", line = VanillaBonkLocale.L("Enemies that strike you take damage"), tip = VanillaBonkLocale.L("Enemies that strike you take Nature damage, at most 5 times a sec. Empowered in Bear Form.") },
			} },
		},
	},
};
