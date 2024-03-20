# !! IMPORTANT !!

The `lancer-data` npm package is now available under `@massif/lancer-data`. The `lancer-data` package will no longer be updated, and will be removed in the future. Please update your dependencies accordingly. It is published from this repo, so everything else will stay the same otherwise.

# About

JSON data for Massif Press' LANCER TTRPG

# Overview

This guide is primarily meant as documentation for authors of custom LANCER content who want to provide their players with associated COMP/CON content packages.

If you are interested in submitting your content package to be included in the directory within COMP/CON, please check the [LANCER Community Content Packs](#LANCER-Community-Content-Packs) section

A working example of custom data can be found [here](https://github.com/massif-press/long-rim-data), in the Long Rim player data repository. Additionally, all item data for the Core book can be found within this repository.

If you have any additional questions after reading this document, please contact me at @Beeftime#0558 in the `#comp-con-homebrew` channel on [the official LANCER Discord](https://discord.gg/Qu3C4te)

## Adding Content to COMP/CON

COMP/CON comes with the Core book data already loaded, but other data (official and otherwise) must be loaded via a Lancer Content Package (.lcp) file, a renamed .zip archive.

### LCP Structure

Your content package is contained in a single-level folder that, at minimum, contains an [lcp_manifest.json](#lcp_manifestjson) file that looks, at minimum, like this:

```json
{
  "name": "My content package name",
  "author": "My name or organization",
  "description": "A short description of my LCP <i>HTML-enabled</i>",
  "version": "1.0"
}
```

A working, but content-less, folder structure would look like this:

```
my homebrew folder
│   lcp_manifest.json
```

additional data will be included in the folder on the same level as the `info.json` file. _Content folders should not have any depth_.

Optionally, you can include the following fields in your manifest:

```json
  "item_prefix": "example_prefix_",
  "image_url": "URL to a thumbnail image",
  "website": "Website URL to my LCP's source"
  "dependencies": LcpDependency[] // see below
```

#### LCP Dependencies

LCPs can declare dependencies: other LCPs required for it to function. These dependencies are declared in the `dependencies` field of the LCP manifest, and are an array of `LcpDependency` objects:

```ts
{
  "name": string, // name of the dependency
  "version": string, // version of the dependency
  "link"?: string // link to the dependency's website
}
```

The `name` field must **exactly match** the `name` field of the dependency's manifest.

The `version` field must be a [semver](https://semver.org/) version string, and must match the dependency's version. COMP/CON defaults to "this version or later", for example, if the user has already installed dependency version `2.0.0` and the dependency required is `1.0.1`, COMP/CON will accept it. COMP/CON will not accept a dependency of `0.5.0` or `1.0.0`. However, there are two special characters that can modify this behavior:

- `*` will accept any version of the dependency, as long as the name matches.
- `=X.X.X` will only accept the exact version of the dependency (X.X.X), and will not accept any other version. For example, if the version string is `=1.0.0`, COMP/CON will only accept version `1.0.0` of the dependency, not `1.0.1`, or `2.0.0`.

The `link` field is optional, and if provided will be displayed in the Content Pack Manager to help users find and download the required content packs. While this is not a required field, it's strongly recommended to include it.

COMP/CON will automatically sort and load LCPs in order based on required dependencies, and will not load an LCP if it has an unsatisfied dependency. The user will be notified of any missing dependencies in the Content Pack Manager.

### Troubleshooting

Most of the time, issues related to LCPs come from malformed LCP data.

Further questions can be answered in the #comp-con-homebrew channel in the LANCER Discord.

# LANCER Community Content Packs

If you'd like to submit your content pack for inclusion within COMP/CON, there are a few requirements:

- Compatible with the new item regime, as described by this document.
- Downloadable through an itch.io page (free or paid)
- Nominated by the community as a good asset, even for people that aren't on the Discord or otherwise tied in to the greater Lancer community (ie: has been playtested, doesn't require other assets, only references already-published material, etc)
- Does not contain any questionable or illegal content, nor any content not owned by the author.
- Passes a final content and code pass

If these standards are acceptable, please contact me at @Beeftime#0558 in [the official LANCER Discord](https://discord.gg/Qu3C4te), ideally within the #comp-con-homebrew channel.

## Extending COMP/CON Code

COMP/CON is an open-source project and may be forked freely. However, if you want to submit code for novel features to support your content packs (or otherwise), that's totally acceptable. Please notify me at @Beeftime#0558 in [the official LANCER Discord](https://discord.gg/Qu3C4te), in the #comp-con channel and we can discuss the details.

Additionally, I am available for commissioned work to develop COMP/CON features at your direction (outside of currently-planned features, etc.). Please contact me on the Discord for rates, timeframe, and further information.

# Structure

COMP/CON's LANCER data is stored as JSON data that is then parsed on app load to hydrate an item database. Lancer Content Packs (LCPs) with additional content can be parsed by C/C provided they follow the schema detailed below. These content packs will be **appended** to the core content in this repo (meaning it is impossible to overwrite a piece of core equipment, even if they share an ID).

Content packs must follow the same folder and naming conventions as the `lib` folder in this repo: for example, to add a custom background in my LCP, I must include a `backgrounds.json` that contains a single array with objects containing `id`, `name`, and `description` fields, as described here. LCPs are .zip files with a renamed extension (though C/C will be able to parse .zips), and an update to the LCP authoring tools is underway. LCPs must contain, at minimum, a `lcp_manifest.json` with the fields described below.

If this document is insufficient, please use the core data files in the `lib` folder as reference. If you have a further question or suggestion, please contact me in #comp-con or #comp-con-homebrew in the LANCER Discord.

## JSON

Editing or creating COMP/CON homebrew requires a working knowledge of JavaScript Object Notation, or JSON. Information about JSON structure and writing JSON is outside the scope of this document, but the Mozilla MDN web docs contain excellent resources on the subject: https://www.json.org/json-en.html

### Schema Notation

In this document, data object properties are notated with name and type. Many COMP/CON data objects allow, but do not require, certain properties, and may be safely omitted. These are marked below with a `?`

Example notation:

```ts
{
  "required_property": string,
  "required_sub_object": IObject,
  "optional_enum"?: EnumeratedType
  "optional_property"?: number
}
```

Omitting one or both of the optional properties would allow C/C to correctly parse this object. Omitting any of the required properties would cause C/C to fail to load the LCP correctly.

## Item IDs

COMP/CON, whenever it can, references item data by ID. This means two very important things:

1. IDs must be unique for data to be referenced correctly. If there are two items with the same ID there's no guarantee as to which one will be referenced, so it's in your best interests to have longer, specific IDs. Consider the following format: `my-lcp-prefix_data-type-prefix_my_item_name`. Long IDs will not perceptibly slow down item references.

2. If you change and item ID, user data that references that item will break (in one form or another). To the extent possible, ensure that item IDs stay the same through future versions of your LCP

## Enums

Where possible, C/C tends to use enums for sets of distinct values that won't change (short of some future LANCER expansion), and type strings where more variability is required. A list of the valid enum string values can be found at the end of this document. These can be recognized in code snippets as any nonstandard typing that's not an Interface (ie not named like `IFooData`)

## Interfaces

Interfaces are denoted with an `I`- (and usually -`Data`), such as in `IActionData`, and are described in this document in the first instance they appear (or ar linked to the relevant documentation). Definitions can be found by following the link or searching for the interface name.

# Actions (actions.json)

Actions in `actions.json` define the basic actions every player has access to in Active Mode (for both Combat and Downtime).

```ts
{
  "id": string,
  "name": string,
  "detail": string, // v-html
  "activation": ActivationType,
  "terse"?: string, // terse text used in the action menu. The fewer characters the better.
  "pilot"?: boolean
  "mech"?: boolean
  "synergy_locations"?: string[]
  "confirm"?: string[]
  "log"?: string
  "ignore_used"?: boolean
  "heat_cost"?: boolean
}
```

Actions marked with `pilot` are available when the character is UNMOUNTED.

Actions marked with `mech` are available when the character is MOUNTED.

Actions marked with neither `mech` nor `pilot` are defaulted to `mech` only.

`synergy_locations` will cause Synergies to be collected and displayed for that location on the action's Active Mode action panel, eg. by adding the synergy location `'ram'` to an action, synergies that would display on the Ram Quick Action panel will _also_ show up on your action.

`confirm` is an optional string array of flavor text that will be shown in the UI when a player commits the action. If omitted, it will only display `ACTIVATION CONFIRMED.`

`log` is an optional string that will be written to the pilot's combat log when the player commits the action.

`ignore_used` will prevent the action from ever being marked as "used" in Active Mode.

C/C will try to calculate the heat cost of item actions based on item tags, but this can be overridden with the `heat_cost` field. For items that have a heat tag and multiple associated actions but only one that incurs the heat cost (such as the Saladin's Support Shield), the `heat_cost` for the non-heat-incurring action can be set to `0`

# Backgrounds (backgrounds.json)

```ts
{
  "id": string,
  "name": string,
  "description": string, // v-html
  "skills"?: string[] // Use ids from skills.json
}
```
The `skills` field is an optional array of skill IDs from `skills.json`, used to present example skill triggers for a background. Upon selection of a background, if a pilot currently has no skill trigger points assigned, C/C will attempt to auto-populate the pilot with 1 point in each of the example skill triggers.

# CORE Bonuses (core_bonuses.json)

Many of the CORE Bonus effects are hardcoded, which is something to keep in mind when writing LCPs that contain CORE Bonuses with unique mechanics. Either make the rules explicit in the description, or submit a PR with the relevant logic.

```ts
{
  "id": string,
  "name": string,
  "source": string, // must be the same as the Manufacturer ID to sort correctly
  "effect": string, // v-html
  "description": string, // v-html
  "mounted_effect"?: string
  "actions"?: IActionData[],
  "bonuses"?: IBonusData[]
  "synergies"?: ISynergyData[]
  "deployables"?: IDeployableData[],
  "counters"?: ICounterData[],
  "integrated"?: string[]
  "special_equipment"?: string[]
}
```

`effect` is used in the Bonus description in the CB browser/selector, and `mounted_effect` furnishes the mount prepend panel when a mount-related CORE Bonus is installed. `description` is used for flavor details.

# Environments (environments.json)

```ts
{
  "id": string,
  "name": string,
  "description": string // v-html"
}
```

# Factions (factions.json)

FACTIONS are an upcoming feature that is not yet implemented within COMP/CON. This document will be updated when that changes.

# Frames (frames.json)

```ts
{
  "id": string,
  "license_level": number, // set to zero for this item to be available to a LL0 character
  "license_id": string, // reference to the Frame id of the associated license; used to link variant frames to the main license
  "variant": string, // optional; name of the main frame license for which this frame is a variant
  "source": string, // must be the same as the Manufacturer ID to sort correctly
  "name": string,
  "mechtype": string[], // can be customized
  "specialty": boolean | IPrerequisite // see below
  "description": string, // v-html
  "mounts": MountType[],
  "stats": {
    "size": number, // see note below
    "structure": number,
    "stress": number,
    "armor": number,
    "hp": number,
    "evasion": number,
    "edef": number,
    "heatcap": number,
    "repcap": number,
    "sensor_range": number,
    "tech_attack": number,
    "save": number,
    "speed": number,
    "sp": number
  },
  "traits": IFrameTraitData[],
  "core_system": ICoreSystemData,
  "image_url"?: string
  "y_pos"?: number, // used for vertical alignment of the mech in banner views (like in the new mech selector)
},
```

Frame sizes can be any integer or **0.5**, which will be correctly rendered as 1/2 in the app. No other fractional size is recognized. All other number values must be integers.

The `specialty` field is used to denote nonstandard, frameless licenses in homebrew, expansions, etc. This may take a boolean that, if true, will hide the associated frame and mark the license with a "Specialty" flag, but may also take an IPrerequisite object:

```ts
{
  "source": string,
  "min_rank": number
  "cumulative"?: boolean
}
```

Where `source` is a Manufacturer ID and `min_rank` indicates the minimum rank of one of that Manufacturer's licenses the Pilot must have unlocked to get access to this license.
If the `cumulative` flag is set, the Pilot must have at least a `min_rank` of that manufacturer's licenses, similar to how CORE Bonuses are gated.

For further information, see Kai Tave's "Field Guide to Suldan" supplement.

## IFrameTraitData

```ts
{
  "name": string,
  "description": string, // v-html
  "use"?: 'Turn' | 'Next Turn' | 'Round' | 'Next Round' | 'Scene' | 'Encounter' | 'Mission',
  "actions"?: IActionData[],
  "bonuses"?: IBonusData[]
  "synergies"?: ISynergyData[]
  "deployables"?: IDeployableData[],
  "counters"?: ICounterData[],
  "integrated"?: string[]
  "special_equipment"?: string[]
},
```

Including a `use` value will give it a button in the Player Active Mode that will appear on the Active Sheet as well as in the "Other" Action Menu. This will log the action and prevent its reuse (until the specified step). `Scene` and `Encounter` are handled the same. Any other value will cause the button to render and the trait usage to be logged, but will not disable the button on use.

## ICoreSystemData

```ts
{
  "name": string,
  "active_name": string,
  "active_effect": string, // v-html
  "activation": ActivationType,
  "description"?: string, // v-html
  "deactivation"?: ActivationType,
  "use"?: 'Round' | 'Next Round' | 'Scene' | 'Encounter' | 'Mission',
  "active_actions"?: IActionData[],
  "active_bonuses"?: IBonusData[],
  "active_synergies"?: ISynergyData[],
  "passive_name"?: string,
  "passive_effect"?: string, // v-html,
  "passive_actions"?: IActionData[],
  "passive_bonuses"?: IActionData[],
  "passive_synergies": ISynergyData[],
  "deployables"?: IDeployableData[],
  "counters"?: ICounterData[],
  "integrated"?: string[]
  "special_equipment"?: string[]
  "tags"?: ITagData[]
}
```

The `use` value in the CORE System data relates to how long the `active_effect` text is shown as part of the CORE Power Engaged UI element. For example, if set to `Next Round`, the CORE Power Engaged UI element will disappear after the player ends the round **after** the round in which the player activated the system. If set to `Mission`, it will only disappear after the player presses the confirmation button on the End Mission modal. If there is no `use` value, the CORE System remains activated for the remainder of the mission, or until the `deactivation` action is taken, whichever comes first.

`active_actions`, `active_bonuses, and `active_synergies`are only available from when the CORE System is activated (action type dictated by the`activation` value) until it is deactivated (`deactivation`action type) or the`use` condition is met, as described above.

`passive_actions`, `passive_bonuses`, and `passive_synergies`, on the other hand, persist as if they were granted by normally installed systems.

# Glossary (glossary.json - NOT YET IMPLEMENTED)

The glossary is meant to collect common game terms for quick user reference. If your LCP contains new mechanics with important keywords, it's a good idea to include them in a `glossary.js` file

This has not yet been implemented. This document will be updated when it has.

```ts
{
  "name": string,
  "description": string // v-html
},
```

# Info (lcp_manifest.json)

The `info.json` file found within this repository is only used in the app to reference the rules release version. Homebrew content should instead include a `lcp_manifest.json`, as detailed below:

## lcp_manifest.json

```ts
{
  "name": string,
  "author": string,
  "description": string, // v-html
  "item_prefix"?: string,
  "version": string,
  "image_url"?: string, // .jpg or .png preferred
  "website"?: string // url
}
```

# Manufacturers (manufacturers.json)

Any homebrew content from a new manufacturer requires a manufacturer item in `manufacturers.json`. Please take note of the Manufacturer ID detail below:

```ts
{
  "id": string, // see note below
  "name": string,
  "logo": string, // see note below
  "logo_url": string,
  "light": string, // hex color code
  "dark": string, // hex color code
  "quote": string // v-html
},
```

The `light` color will be used for UI themes that use the 'light' base (such as GMS Default) and the `dark` color will be used for UI themes that use the 'dark' base (such as MSMC Solarized).

The `logo` field is used for core LANCER manufacturer logos, when building your own LCPs, supply a url for a logo image (.svg is strongly encouraged) via `logo_url`

## Manufacturer ID

The manufacturer ID should be acronym/abbreviated form of the manufacturer name (eg. GMS for General Massive Systems). This is often used in `Source` fields for licensed equipment. When making your own LCPs, take care to choose a unique manufacturer ID for homebrew manufacturers.

# Mods (mods.json)

Weapon mods are handled separately in C/C than in Lancer (where they're just tagged Systems), and have a set of mod-specific fields that modify where and how they are applied.

```ts
{
  "id": string,
  "name": string,
  "source": string, // Manufacturer ID
  "license": string, // Frame Name
  "license_id": string, // reference to the Frame id of the associated license
  "license_level": number, // set to 0 to be available to all Pilots
  "sp"?: number,
  "description"?: string, // v-html
  "effect"?: string, // v-html
  "tags"?: ITagData[], // tags related to the mod itself
  "allowed_types"?: WeaponType[], // weapon types the mod CAN be applied to
  "allowed_sizes"?: WeaponSize[], // weapon sizes the mod CAN be applied to
  "restricted_types"?: WeaponType[], // weapon types the mod CAN NOT be applied to
  "restricted_sizes"?: WeaponSize[], // weapon sizes the mod CAN NOT be applied to
  "added_tags"?: ITagData[] // tags propagated to the weapon the mod is installed on
  "added_damage"?: IDamageData[] // damage added to the weapon the mod is installed on, see note
  "added_range"?: IRangeData[] // damage added to the weapon the mod is installed on, see note
  "actions"?: IActionData[],
  "bonuses"?: IBonusData[], // these bonuses are applied to the pilot, not parent weapon
  "synergies"?: ISynergyData[],
  "deployables"?: IDeployableData[],
  "counters"?: ICounterData[],
  "integrated"?: string[]
  "special_equipment"?: string[]
}
```

For `added_damage` and `added_range`, Damage and Range types that are found on the base weapon will be summed (eg 1d6 and 2d6 kinetic damage will sum to 3d6 kinetic), and new types will be appended (eg 1d6 explosive and 2d6 kinetic damage will result in "1d6 Explosive Damage, 2d6 Kinetic Damage")

Any combination of allowed/restricted values can be used to narrow a mod's application range. Omitting an "allowed" will allow everything in that field (as if every type/size were added to the array). Eg. a mod with no `allowed_types` or `allowed_sizes` will be allowed on any weapon.
In any case, `restricted` values take precedence over `allowed` values. A mod that both allows and restricts Superheavy Weapons will ultimately restrict installation on Superheavies.

## System Mods (Experimental -- NOT YET IMPLEMENTED) (system_mods.json)

This is currently unsupported in the LANCER Core Book (or any Massif material at the time of this writing), but will be made available for use in homebrew development. This document will be updated when System Mods are available for use.

```ts
{
  "id": string,
  "name": string,
  "sp": number,
  "allowed_types"?: SystemType[], // system types the mod CAN be applied to
  "restricted_types"?: SystemType[], // system types the mod CAN NOT be applied to
  "source": string, // Manufacturer ID
  "license": string, // Frame Name
  "license_level": number, // set to 0 to be available to all Pilots
  "effect": string, // v-html
  "tags": ITagData[], // tags related to the mod itself
  "added_tags": ITagData[] // tags propagated to the system the mod is installed on
  "actions"?: IActionData[],
  "bonuses"?: IBonusData[], // these bonuses are applied to the pilot, not parent system
  "synergies"?: ISynergyData[],
  "deployables"?: IDeployableData[],
  "counters"?: ICounterData[],
  "integrated"?: string[]
  "special_equipment"?: string[]
}
```

Any combination of allowed/restricted values can be used to narrow a mod's application range. Omitting an "allowed" will allow everything in that field (as if every type were added to the array). Eg. a mod with no `allowed_types` will be allowed on any system.
In any case, `restricted` values take precedence over `allowed` values. A mod that both allows and restricts Drone Systems will ultimately restrict installation on Drones.

# Pilot Gear (pilot_gear.json)

For brevity's sake, Pilot Gear/Equipment is collected in one file and is differentiated by a `type` field:

## Pilot Weapons

```ts
{
  "id": string,
  "name": string, // v-html
  "type": "Weapon",
  "description"?: string,
  "effect"?: string,
  "tags"?: ITagData[],
  "range"?: IRangeData[],
  "damage"?: IDamageData[],
  "actions"?: IActionData[], // these are only available to UNMOUNTED pilots
  "bonuses"?: IBonusData[], // these bonuses are applied to the pilot, not parent system
  "synergies"?: ISynergyData[],
  "deployables"?: IDeployableData[], // these are only available to UNMOUNTED pilots
}
```

## Pilot Armor

```ts
{
  "id": string,
  "name": string, // v-html
  "type": "Armor",
  "description"?: string,
  "tags"?: ITagData[],
  "actions"?: IActionData[], // these are only available to UNMOUNTED pilots
  "bonuses"?: IBonusData[], // these bonuses are applied to the pilot, not parent system
  "synergies"?: ISynergyData[],
  "deployables"?: IDeployableData[], // these are only available to UNMOUNTED pilots
},
```

## Pilot Gear

```ts
{
  "id": string,
  "name": string, // v-html
  "type": "Gear",
  "description"?: string,
  "tags"?: ITagData[],
  "actions"?: IActionData[], // these are only available to UNMOUNTED pilots
  "bonuses"?: IBonusData[], // these bonuses are applied to the pilot, not parent system
  "synergies"?: ISynergyData[],
  "deployables"?: IDeployableData[], // these are only available to UNMOUNTED pilots
},
```

Pilot Equipment actions and deployables will always be available **unless** they are marked with the `pilot` flag, in which case they will only be available when the pilot it **unmounted**

# Reserves (reserves.json)

```ts
{
  "id": string,
  "name": string,
  "type": "Mech" | "Tactical" | "Resource" | "Bonus",
  "label": string,
  "description"?: string, // v-html
  "consumable"?: boolean // defaults to false
  "actions"?: IActionData[],
  "bonuses"?: IBonusData[]
  "synergies"?: ISynergyData[]
  "deployables"?: IDeployableData[],
  "counters"?: ICounterData[],
  "integrated"?: string[]
  "special_equipment"?: string[]
},
```

A character with a reserve will always have its associated action/bonus/synergy/deployable/counter available until the player manually disables (marks "Used") or deletes the reserve item. If the reserve is marked with `consumable`, the reserve will be automatically disabled when any of the associated actions or deployables are used in the Active Mode.

# Rules (rules.json)

The rules file sets some of the base values of the game, but as of this writing additional values for the core rules are not recognized in LCPs.

# Sitreps (sitreps.json)

```ts
{
  "id": string,
  "name": string,
  "description": string, // v-html
  "pcVictory"?: string, // v-html
  "enemyVictory"?: string, // v-html
  "noVictory"?: string, // v-html
  "deployment"?: string, // v-html
  "objective"?: string, // v-html
  "extraction"?: string, // v-html
}
```

# Skill Triggers (skills.json)

```ts
{
  "id": string,
  "name": string,
  "description": string, // terse, prefer fewest characters
  "detail": string, // v-html
  "family": "str" | "con" | "dex" | "int" | "cha"
}
```

## Skill Family

The "skill family" ("str", "con", "dex", "int", "cha") only determines _where_ on the Skill Trigger list the item appears, and has no mechanical effect. This is useful for arranging new skills with similar ones.

# Statuses and Conditions (statuses.json)

```ts
  {
    "name": string,
    "icon_url": string
    "type": "Status" | "Condition",
    "effects": string // v-html
    "terse"?: string, // prefer fewest characters
    "exclusive"?: "Mech" | "Pilot",
  },
```

# Systems (systems.json)

```ts
  {
    "id": string,
    "name": string,
    "source": string, // must be the same as the Manufacturer ID to sort correctly
    "license": string, // reference to the Frame name of the associated license
    "license_id": string, // reference to the Frame id of the associated license
    "license_level": number, // set to zero for this item to be available to a LL0 character
    "effect"?: string, // v-html
    "type"?: SystemType
    "sp"?: number,
    "description"?: string, // v-html
    "tags"?: ITagData[],
    "actions"?: IActionData[],
    "bonuses"?: IBonusData[]
    "synergies"?: ISynergyData[],
    "deployables"?: IDeployableData[],
    "counters"?: ICounterData[],
    "integrated"?: string[]
    "special_equipment"?: string[]
  },
```

If `type` is omitted, the system is given the type `"System"`

# Tables (tables.json)

`tables.js` is an object containing string arrays for the following rollable tables:

| Object Key        | CC Location                                                    |
| ----------------- | -------------------------------------------------------------- |
| `pilot_names`     | Pilot names, rollable on the first Create New Pilot screen     |
| `pilot_callsigns` | Pilot callsigns, rollable on the first Create New Pilot screen |
| `mech_names`      | Mech names, rollable on the Add New Mech to Hangar screen      |
| `quirks`          | Rollable Quirks table for Flash Cloned pilots                  |

# Tags (tags.json)

```ts
{
  "id": string,
  "name": string,
  "description": string, // v-html, see note below
  "hidden"?: boolean
  "filter_ignore"?: boolean
}
```

`hidden` is used to render app UI features and cannot be added to - however - these hidden tags can be given to custom content:
Tag ID|Behavior
---|---
`tg_set_max_uses`| Set item maximum uses
`tg_set_damage_type`| Set item damage type
`tg_set_damage_value`| Set item damage value

`filter_ignore` will prevent this tag from appearing in equipment filters. Mostly this is used to avoid redundancies in the filter menu (eg, tagged range types), but may be useful in other circumstances.

## {VAL}

Tag descriptions may include the string "`{VAL}`", a token that will be replaced with any `val` parameter passed to the ITagData object of tagged equipment. For example, the following tag:

```ts
{
  "id": "tg_my_tag",
  "name": "My Tag",
  "description": "The value is: {VAL}"
}
```

provided with the following ITagData:

```ts
{
  "id": "tg_my_tag",
  "val" "Hello World!"
}
```

will render in COMP/CON as:

```
The value is: Hello World!
```

It's important to keep in mind that all `val` passed to the description will be rendered as a string, so eg. `2 + 2` will render as "2 + 2" and not "`4`"

## ITagData

```ts
{
  "id": string,
  "val" string | number
}
```

Tags related to item type and activation costs will be automatically applied by COMP/CON (such as eg. `tg_quick_action` or `tg_drone`)

# Talents (talents.json)

The talent object collects the general detail about a Pilot Talent and serves as a container for `IRankData`, which contains the Talent mechanics:

```ts
{
  "id": string,
  "name": string,
  "description": string, // v-html
  "ranks": IRankData[]
  "icon_url"?: string // Must be .svg
  "terse"?: string, // terse text used in short descriptions. The fewer characters the better
}
```

Use `icon_url` if you're adding new Talents in an LCP, otherwise the talent will be given a "generic Talent" icon.

Currently, only Talents with three (and exactly three) ranks have been tested. More or less _should_ work properly, but there's always the chance it breaks something. If this is the case with your LCP, please open a ticket.

## IRankData

IRankData contains the synergies, actions, and talent items granted through ranks in the talent:

```ts
{
  "name": string,
  "description": string, // v-html
  "exclusive"?: boolean // see below
  "actions"?: IActionData[],
  "bonuses"?: IBonusData[]
  "synergies"?: ISynergyData[]
  "deployables"?: IDeployableData[],
  "counters"?: ICounterData[],
  "integrated"?: string[]
}
```

The `exclusive` field determines if _only_ the `bonuses`, `deployables`, `counters`, and `integrated` equipment from the highest unlocked rank will be equipped, or _all_ unlocked ranks. For example, the system granted by Walking Armory is upgraded every rank. In C/C this is rendered by changing the granted system. Because the player is equipped with the "latest" system, based on talent rank, the `talent_items` in the Walking Armory ranks are all set to `true`.

There is not a talent like this in the core book, but if Walking Armory gave a _different_ system each rank, and a player could have all rank systems equipped at the same time, the `exclusive` fields would be set to `false`

# Weapons (weapons.json)

Weapons are essentially mounted systems that furnish the "Skirmish" and "Barrage" actions. They can take `damage` and `range` data, and must take `MountType` and `WeaponType` properties. Weapons added as "integrated" weapons from anywhere (including other weapons) are assigned unmodifiable Integrated Mounts.

```ts
{
  "id": string,
  "name": string,
  "source": string, // must be the same as the Manufacturer ID to sort correctly
  "license": string, // reference to the Frame name of the associated license
  "license_id": string, // reference to the Frame id of the associated license
  "license_level": number, // set to zero for this item to be available to a LL0 character
  "mount": MountType,
  "type": WeaponType,
  "cost"?: number
  "barrage"?: boolean,
  "skirmish"?: boolean,
  "no_attack"?: boolean,
  "no_mods"?: boolean,
  "no_core_bonus"?: boolean,
  "damage"?: IDamageData[],
  "range"?: IRangeData[],
  "tags"?: ITagData[],
  "sp"?: number,
  "description": string, // v-html
  "effect"?: string // v-html
  "on_attack"?: string // v-html
  "on_hit"?: string // v-html
  "on_crit"?: string // v-html
  "actions"?: IActionData[],
  "bonuses"?: IBonusData[]
  "no_bonus"?: boolean
  "synergies"?: ISynergyData[],
  "no_synergy"?: boolean,
  "deployables"?: IDeployableData[],
  "counters"?: ICounterData[],
  "integrated"?: string[]
  "special_equipment"?: string[]
  "profiles"?: IWeaponProfile[] //see note below
}
```

`cost` refers to the usage cost per attack with this weapon. It defaults to 1.

`barrage` denotes that this weapon can be fired as part of a barrage, and `skirmish` denotes that this weapon can be fired as part of a skirmish. If neither of these flags are set, `barrage` will be set to `true` by default for all weapons, and `skirmish` will be set to `true` by default for all **non-Superheavy** weapons.

`no_attack` suppresses creation of Skirmish/Barrage actions for this weapon, intended for use with special or weapon-mounted systems (eg. the Goblin's Autopod)

`no_bonus` and `no_synergy` inhibit the collection and display of `Bonuses` and `Synergies` respectively (eg. the Pegasus Autogun)

`no_mods` inhibits the addition of mods to this weapon (eg. Pegasus Mimic Gun)

`no_core_bonus` inhibits the display of mount-sensitive core bonuses, when making attacks with this weapon (eg. Pegasus Mimic Gun)

## Weapon Effects

Effects are equipment abilities that **do not** grant the player a new Action but **do** add or modify gameplay mechanics. The field should be used for "usage notes" (for lack of a better term) that have game-mechanical properties that cannot be modeled with Actions or Deployables, or may include representation elsewhere but involve player notes/choices that can't be modeled there (like the Hydra's Ghast Nexus), or any other sort of mechanically important detail that is unsuited for inclusion (like the rules for the Pegasus' Mimic Gun). An item takes only one effect.

On Attack/Hit/Crit effects (like the Blackbeard's Chain Axe), are modeled in separate fields. A weapon may be given any combination of `on_attack`, `on_hit`, `on_crit`, and `effect` fields.

## Profiled Weapons

Weapon profiles are stored as an array of abbreviated `IWeaponData` data as an optional property of a weapon. C/C won't look for or render profile data _within_ profiles, so it's not possible to nest a profile more than one deep.

Actions, Effects, and Synergies will only be available to the player _while_ the profile is active.

For a weapon with multiple profiles, the default profile will be the **first** (index 0) item in the profile array, and will be used for things like damage sorting.

### IWeaponProfile

```ts
  "name": string
  "effect"?: string
  "skirmish"?: boolean
  "barrage"?: boolean
  "cost"?: number
  "on_attack"?: string
  "on_hit"?: string
  "on_crit"?: string
  "damage"?: IDamageData[]
  "range"?: IRangeData[]
  "actions"?: IActionData[]
  "bonuses"?: IBonusData[]
  "synergies"?: ISynergyData[]
  "deployables"?: IDeployableData[]
  "counters"?: ICounterData[]
  "integrated"?: string[]
  "special_equipment"?: string[]
```

All Weapon Profile fields are equivalent to their base Weapon representations.

Note that, aside from the `name` field, all fields on a profile are optional. If a field is not provided, a Weapon Profile will fall back to whatever is in container weapon data.

### Example

```ts
{
  "id": "mw_my_profiled_weapon",
  "name": "My Profiled Weapon",
  "mount": "Heavy",
  "type": "Cannon",
  "source": "GMS",
  "license_level": 0,
  "profiles": [{
      "name": "Profile A",
      "damage": [{
        "type": "kinetic",
        "val": "1d6"
      }],
      "range": [{
        "type": "Range",
        "val": 10
      }],
      "effect": "This effect is only applicable in Profile A",
      "actions": [{
        "name": "Profile A Action",
        "activation": "Quick",
        "detail": "This action will only appear in Active Mode is Profile A is active"
      }],
      "tags": [{
        "id": "tg_heat_self",
        "val": 1
      }]
    },
    {
      "name": "Profile B",
      "damage": [{
        "type": "kinetic",
        "val": 10
      }],
      "range": [{
        "type": "Range",
        "val": 8
      }],
      "effect": "This Bonus will only be applied if Profile B is active",
      "bonuses": [{
        "id": "hp",
        "val": 5,
      }],
      "tags": [{
        "id": "tg_reliable",
        "val": 3
      }]
    }
  ],
  "description": "This description will appear regardless of which profile is active."
}
```

---

# Item Actions

**NB:** Base and Downtime actions are supplied through `actions.json`, and can be expanded in LCP content as shown in the Actions section above.

Actions encompass any distinct move a player can make -- mostly this will be system activations, and also Reactions and Protocols granted from Systems, Traits, Talents, etc. This also includes Invasion options. These add to or modify player actions in the Active Mode, and also furnish various UI elements. Items that can take an `actions` field include: `CORE Bonuses`, `Frame Traits`, `CORE Powers`, `Talent Ranks`, `Weapons`, and `Systems`:

```ts
"actions": IActionData[]
```

`IActionData` is not differentiated in the code, but many action types have different required fields. The generic data object is as follows:

```ts
{
  "name"?: string,
  "activation": ActivationType,
  "detail": string, // v-html
  "cost"?: number
  "pilot"?: boolean
  "synergy_locations"?: string[]
  "tech_attack"?: boolean
  "log"?: string[]
}
```

If not given a `name` field, the Item Action button will be titled "Activate ITEM NAME"

`cost` will deduct its value from the parent system's limited item uses, if it is a limited-tagged item. If `cost` is omitted and the item is limited, `cost` will be automatically set to `1`

`pilot` actions will only be available in Active Mode when a character is UNMOUNTED

`synergy_locations` will cause Synergies to be collected and displayed for that location on the item's generated Active Mode action panel, eg. by adding the synergy location `'ram'` to an action, synergies that would display on the Ram Quick Action panel will _also_ show up on your action.

`log` is an optional string array of flavor text that will be shown when a player commits an action. If omitted, it will only display `ACTIVATION CONFIRMED.`

### Protocols

Protocols are distinct from Free Actions only in that C/C will collect them separately for the purposes of checking if they're the first used action(s) on a turn.

### Charges

Charge-style equipment is usually broken into two possible actions (throw grenade/deploy mine) and should be rendered as follows:

```ts
"actions": [
  {
    "name": "my grenade",
    "activation": "Quick",
    "range"?: IRangeData[],
    "damage"?: IDamageData[],
    "detail": "equipment details, which can be distinct from the item effect, if desired",
    "cost": 1
  },
],
"deployables": [
  {
    "name": "my mine",
    "type": "Mine"  // this is for UI furnishing only
    "range"?: IRangeData[],
    "damage"?: IDamageData[],
    "activation": "Quick",
    "detail": "equipment details, which can be distinct from the item effect, if desired"
    "cost": 1
  }
]
```

Note that they are just fundamentally regular actions with a few additional fields. `range` and `damage` will be rendered in the UI but will not be considered when applying bonuses.

### Quick/Full Tech

These Actions will populate the Tech Attack Active Mode menu, instead of the Quick/Full Action menus

### Invade

"Invade" Actions add to the Active Mode Tech Attack Invade options, rather than creating a new menu item (unlike Quick/Full Tech)

### Reactions

Reactions take an additional set of mandatory fields: `frequency` (how often the Reaction can be used, see below), and `trigger`. It may also take an optional `init` string to describe any preconditions that must be true for the reaction to be used (eg. Valiant Aid requiring the Exemplar's Mark).

```ts
{
  "name": string,
  "activation": "Reaction",
  "frequency": string, // see below
  "init"?: string, // v-html
  "trigger": string, // v-html
  "detail": string // v-html
}
```

#### Frequency

The `frequency` field is not an enum but does evaluate some magic strings for Active Mode. They are as follows:
|||
---|---
`Unlimited`|Never prohibit this Action from being used as a Reaction
`X/round`|Action may only be used once per Player turn as a Reaction
`X/scene`|Action may only be used once per Active Mode Encounter (ie, a 'Start Combat' click) as a Reaction
`X/encounter`|Same behavior as `X/scene`
`X/mission`|Action may only be used once per Active Mode Mission (ie. between a 'Start Mission' and 'End Mission' click) as a Reaction

Where X is a positive integer.

anything else will appear in the UI on the "Frequency" line but will be treated as if it were `Unlimited`

# Deployables

Deployables encompass anything that can and should be tracked in the Player's Deployable Tracker, specifically Deployable and Drone-tagged equipment. The `deployables` field takes an array of the `IDeployableData` object as follows:

```ts
"deployables": IDeployableData[]
```

IDeployableData (note that this does not have an `id` field, this is generated unique per instance):

```ts
{
  "name": string
  "type" string // this is for UI furnishing only
  "detail": string
  "size": number // not required for Mines
  "activation"?: ActivationType,
  "deactivation"?: ActivationType,
  "recall"?: ActivationType,
  "redeploy"?: ActivationType,
  "instances"?: number,
  "cost"?: number
  "armor"?: number,
  "hp"?: number,
  "evasion"?: number,
  "edef"?: number,
  "heatcap"?: number,
  "repcap"?: number,
  "sensor_range"?: number,
  "tech_attack"?: number,
  "save"?: number,
  "speed"?: number,
  "pilot"?: boolean,
  "mech"?: boolean,
  "actions"?: IActionData[],
  "bonuses"?: IBonusData[]
  "synergies"?: ISynergyData[],
  "counters"?: ICounterData[],
  "tags"?: ITagData[],
}
```

Deployables will automatically generate a Deploy action on their parent item. Deployables without an `activation` value will default to a Quick action.
By default, deployables have an `instances` value of `1`, which is how many copies of the deployable are spawned per activation.

Note that most of these fields are optional, but their inclusion will cause the relevant UI features to render.

Actions, Bonuses, and Synergies on the Deployable will only be active/available only for as long as the Deployable is deployed.

Counters will only be available in the body of the Deployable UI element, and will be removed when the deployable is removed or destroyed.

A `recall` value will generate a recall action, removing the deployable from the user's Deployables list and refunding the system the `cost` value in charges. `deactivation` does the same as `recall` but does not refund the charge cost.

A `redeploy` value will generate a redeploy action.

`cost` will deduct its value from the parent system's limited item uses, if it is a limited-tagged item. If `cost` is omitted and the item is limited, `cost` will be automatically set to `1`

`tags` in the context of a deployable, are for the deployed equipment only, and not the governing system.

`pilot` and `mech` refer to this item's deployment action availability. `pilot` deployables are available when the pilot is **unmounted** and vice versa. If neither are provided, deployables are by default available only when **mounted**

# Synergies

Synergies are used to convey hint text regarding talent rank or equipment interaction. They are available on `Talent Ranks`, `Frame Traits`, `Core Systems`, and `Equipment` as an array of `ISynergyData`

```ts
"synergies": ISynergyData[]
```

The `ISynergyData` object contains two mandatory and three optional fields. Location and detail - are mandatory and contain the display location for the synergy hint (see below) and the text (`detail`) of the synergy hint. `weapon_types` and `weapon_sizes` are optional filters for displaying synergies on weapons, and take `WeaponType` and `WeaponSize` enum values, respectively. Omitting these fields on weapons will cause them to be set to `any` -- useful if you are looking for a synergy hint on eg. a Melee weapon of any size, or a Superheavy weapon of any type.
Similarly `system_types` will filter system synergy hints to a specific type (eg. `Drone`) and will appear on all Systems if omitted (set to `any`).

```ts
{
  "locations": string[] // see below,
  "detail": string // v-html
  "weapon_types"?: WeaponType[]
  "system_types"?: SystemType[]
  "weapon_sizes"?: WeaponSize[]
}
```

## Synergy Locations

The following is a list of currently implemented synergy hint locations and their ID strings. To appear, a synergy must take at least one of these location IDs:

| ID                | Location                                                                                                  |
| ----------------- | --------------------------------------------------------------------------------------------------------- |
| active_effects    | The Active Effects panel near the top of the Active Mode view                                             |
| rest              | A panel near the top of the Active Mode:Rest view                                                         |
| weapon            | The body of the equipped weapon item panel in a loadout, as well as in the Skirmish/Barrage action modals |
| system            | The body of the equipped system item panel in a loadout, as well as in the Activation Action modals       |
| deployable        | Deployment action for deployable, deployable panel body                                                   |
| drone             | Deployment action for drone, drone panel body                                                             |
| move              | Next to the move pip bar, also within the Move menu/move Action tab                                       |
| boost             | Next to the Boost button, within the Boost Action modal                                                   |
| structure         | Next to the structure pip tracker in the Active Mode: Combat view                                         |
| armor             | Next to the armor pip tracker in the Active Mode: Combat view                                             |
| hp                | Next to the HP pip tracker in the Active Mode: Combat view                                                |
| overshield        | Next to the overshield pip tracker in the Active Mode: Combat view                                        |
| stress            | Next to the reactor stress pip tracker in the Active Mode: Combat view                                    |
| heat              | Next to the heat pip tracker in the Active Mode: Combat view                                              |
| repair            | Next to the repair capacity pip tracker in the Active Mode: Combat view                                   |
| core_power        | Next to the CORE power pip tracker in the Active Mode: Combat view                                        |
| overcharge        | Next to the overcharge pip tracker in the Active Mode: Combat view                                        |
| ram               | Ram Action modal                                                                                          |
| grapple           | Grapple Action modal                                                                                      |
| tech_attack       | Tech Attack Action modal                                                                                  |
| overcharge        | Overcharge Action modal                                                                                   |
| skill_check       | Skill Check Action modal                                                                                  |
| overwatch         | Overwatch Action modal                                                                                    |
| improvised_attack | Improvised Attack Action modal                                                                            |
| disengage         | Disengage Action modal                                                                                    |
| dismount          | Dismount Action modal                                                                                     |
| stabilize         | Stabilize Action modal                                                                                    |
| tech              | Quick and Full Tech Attack modals                                                                         |
| lock_on           | Lock On Action modal                                                                                      |
| hull              | mouseover tooltip for HULL stat                                                                           |
| agility           | mouseover tooltip for AGILITY stat                                                                        |
| systems           | mouseover tooltip for SYSTEMS stat                                                                        |
| engineering       | mouseover tooltip for ENGINEERING stat                                                                    |
| pilot_weapon      | Pilot Weapon panel and action modal                                                                       |
| cascade           | Cascade warning panel                                                                                     |

# Counters (ICounterData)

Counters are tick/clock/track managers available on the Pilot Active mode under the COUNTERS heading. Pilots can create, edit, and delete custom counters, but adding one to an item will generate an automatic, permanent counter that will always be available if the prerequisites are met (item is equipped, talent is unlocked, etc.)

Counter value **will** persist in Pilot Save Data, so giving these counters a unique ID is necessary.

```ts
{
  "id": string,
  "name": string,
  "default_value"?: number,
  "min"?: number,
  "max"?: number
}
```

All numbers must be integers. If you do not provide a `default_value`, the counter will start at `0`. If you do not provide a `min` or a `max` they will be set to `-MAX_INT` and `MAX_INT`, respectively

# Integrated Items

Certain equipment, talents, etc can add equipment to mechs. These are collected as an array of item IDs:

```ts
{
  "integrated": string[]
}
```

COMP/CON will determine if the item is a Weapon or System. Weapons will be added to a unique and item-bound Integrated Mount. Integrated items are not removable (but destroyable, cascadable, etc.).

It is possible to "chain" equipment through `integrated` arrays, and is therefore possible to loop infinitely, which will cause the app to crash. Keep this in mind when building LCPs.

## Special Equipment

Similar to integrated items, Special Equipment adds an entry to the pilot's special/exotic equipment list, making the item available in mech or pilot equipment selectors, but -- unlike Integrated items -- allowing these items to be removed. An example is the Technophile talent's AI system, which becomes available through the talent, but is not automatically added like an Integrated item and can be omitted from a Mech loadout.

Like Integrated items, these are collected as an array of item IDs:

```ts
{
  "special_equipment": string[]
}
```

Special Equipment attached to other pieces of equipment are available only when the items are equipped, making it possible to set up linked or prerequisite systems in this way, although C/C will make consistency removals if eg. the prerequisite system is removed from the loadout.

# Bonuses

```ts
{
  "id": string,
  "val": string | number
  "damage_types"?: DamageType[]
  "range_types"?: RangeType[]
  "weapon_types"?: WeaponType[]
  "weapon_sizes"?: WeaponSize[]
  "overwrite"?: boolean
  "replace"?: boolean
}
```

Bonuses are collected and added **to the pilot**, meaning that they will persist as long as the item granting the bonus is equipped or active. The definition of "active" can change based on item type:

| Item                                               | Active State Condition                                                   |
| -------------------------------------------------- | ------------------------------------------------------------------------ |
| Talent                                             | Always active                                                            |
| Frame, Frame Trait, Passive CORE Power, CORE Bonus | Mech is marked as Active in Mech Sheet or Active Mode: Combat            |
| Active CORE Power                                  | CORE Power has been activated, bonus removed when CORE Power deactivates |
| Mod                                                | Mod is equipped to equipment that is not destroyed                       |
| Pilot Gear                                         | Always active                                                            |
| Reserve                                            | Always active until reserve is used or deleted                           |
| System                                             | Always active unless system is destroyed or in cascade                   |
| Weapon                                             | Always active unless weapon is destroyed                                 |
| Weapon Profile                                     | Active only when the profile is selected and the weapon is not destroyed |
| Deployable                                         | Deployable has been deployed                                             |

The optional type and size parameters will restrict any weapon-related bonus to those values. If no values are supplied, it will be treated as `all`. These filters are **exclusive** meaning that an item must satisfy all conditions to receive the bonus. For example, a Bonus that included an `Explosive` damage type and a `Launcher` weapon type would only apply to Launchers that dealt Explosive damage. To create eg. a system that increases the damage of all explosive weapons _and_ all ranged weapons, two Bonus objects should be used.

| ID                        | Detail                                       | Values    |
| ------------------------- | -------------------------------------------- | --------- |
| `skill_point`             | Add Pilot Skill Trigger point                | integer   |
| `mech_skill_point`        | Add Mech Skill (HASE) point                  | integer   |
| `talent_point`            | Add Pilot Talent point                       | integer   |
| `license_point`           | Add Pilot License point                      | integer   |
| `cb_point`                | Add Pilot CORE Bonus point                   | integer   |
| `range`                   | Add Range (including Threat) to weapons      | integer   |
| `damage`                  | Add Damage to weapons                        | integer   |
| `hp`                      | Add Mech HP                                  | integer   |
| `armor`                   | Add Mech Armor                               | integer   |
| `structure`               | Add Mech Structure                           | integer   |
| `stress`                  | Add Mech Reactor Stress                      | integer   |
| `heatcap`                 | Add Mech Heat Capacity                       | integer   |
| `repcap`                  | Add Mech Repair Capacity                     | integer   |
| `speed`                   | Add Mech Speed                               | integer   |
| `evasion`                 | Add Mech Evasion                             | integer   |
| `edef`                    | Add Mech E-Defense                           | integer   |
| `sensor`                  | Add Mech Sensor Range                        | integer   |
| `attack`                  | Add Mech Attack Bonus                        | integer   |
| `tech_attack`             | Add Mech Tech Attack                         | integer   |
| `grapple`                 | Add Mech Grapple Value                       | integer   |
| `ram`                     | Add Mech Ram Value                           | integer   |
| `save`                    | Add Mech Save                                | integer   |
| `sp`                      | Add Mech SP                                  | integer   |
| `size`                    | Add Mech Size                                | integer   |
| `ai_cap`                  | Add AI Capacity                              | integer   |
| `cheap_struct`            | Half cost for Structure repairs              | boolean   |
| `cheap_stress`            | Half cost for Reactor Stress repairs         | boolean   |
| `overcharge`              | Overcharge Track                             | DieRoll[] |
| `limited_bonus`           | Add Limited equipment uses                   | integer   |
| `pilot_hp`                | Add Pilot HP                                 | integer   |
| `pilot_armor`             | Add Pilot Armor                              | integer   |
| `pilot_evasion`           | Add Pilot Evasion                            | integer   |
| `pilot_edef`              | Add Pilot E-Defense                          | integer   |
| `pilot_speed`             | Add Pilot Speed                              | integer   |
| `deployable_hp`           | Add HP to all deployed Deployables           | integer   |
| `deployable_size`         | Add size to all deployed Deployables         | integer   |
| `deployable_charges`      | Add charges to all deployed Deployables      | integer   |
| `deployable_armor`        | Add armor to all deployed Deployables        | integer   |
| `deployable_evasion`      | Add evasion to all deployed Deployables      | integer   |
| `deployable_edef`         | Add edef to all deployed Deployables         | integer   |
| `deployable_heatcap`      | Add heatcap to all deployed Deployables      | integer   |
| `deployable_repcap`       | Add repcap to all deployed Deployables       | integer   |
| `deployable_sensor_range` | Add sensor range to all deployed Deployables | integer   |
| `deployable_tech_attack`  | Add tech attack to all deployed Deployables  | integer   |
| `deployable_save`         | Add save to all deployed Deployables         | integer   |
| `deployable_speed`        | Add speed to all deployed Deployables        | integer   |
| `drone_hp`                | Add HP to all deployed Drones                | integer   |
| `drone_size`              | Add size to all deployed Drones              | integer   |
| `drone_charges`           | Add charges to all deployed Drones           | integer   |
| `drone_armor`             | Add armor to all deployed Drones             | integer   |
| `drone_evasion`           | Add evasion to all deployed Drones           | integer   |
| `drone_edef`              | Add edef to all deployed Drones              | integer   |
| `drone_heatcap`           | Add heatcap to all deployed Drones           | integer   |
| `drone_repcap`            | Add repcap to all deployed Drones            | integer   |
| `drone_sensor_range`      | Add sensor range to all deployed Drones      | integer   |
| `drone_tech_attack`       | Add tech attack to all deployed Drones       | integer   |
| `drone_save`              | Add save to all deployed Drones              | integer   |
| `drone_speed`             | Add speed to all deployed Drones             | integer   |
| `pilot_gear_slots`        | Increase Pilot Gear capacity                 | integer   |
| `pilot_weapon_slots`      | Increase Pilot Weapon capacity               | integer   |

The `overwrite` flag will _overwrite_ any integer value bonus with the highest bonus of the same type from any source that has an `overwrite` flag. Which is to say: all applicable bonuses of that bonus ID will be collected and everything will be discarded _except for_ the bonus of the highest value _that has an `overwrite` flag_.
Eg: a mech with items that give +4, +2, +3 (overwrite) and +2 (overwrite) AI Cap will result in a +3 AI Cap bonus.
This flag is not necessary for non-integer values.

The `replace` flag will _replace_ **any integer value** in the target item, pilot, or mech with the total collected `replace` bonus value. Eg. a mech with a base HP of 8 and the following bonuses: +1, +1 and 3 (replace) will result in a mech with a final HP of **5** (5 replaced by 3, +1 +1). A mech with a base HP of 8 and the following bonuses: +1, 3 (replace), and 3 (replace) will result in a mech with a final HP of **7** (5 replaced by 3 + 3, then +1).

The `overwrite` and `replace` flags can be used together to create equipment that overrides the final computed bonus value with a flat value.

## Special Values

Any `integer` type bonus can be replaced with one of the following special value strings surrounded in brackets (eg. `"{ll}"`):

| ID     | Value               |
| ------ | ------------------- |
| `ll`   | Pilot License Level |
| `grit` | Pilot Grit          |

additionally, strings will be evaluated as an expression, then rounded up to the nearest integer, so `"2 + {ll}"` or `({grit}/2) + 1` are both valid expressions.

# Ammo

Currently used only for Walking Armory in the LANCER Core Book, it's genericised for use in homebrew LCPs. Ammo arrays populate a list of ammunition selections on every equipped weapon of the specified type

```ts
"ammo": IAmmoData[]
```

## IAmmoData

```ts
  "name": string,
  "description": string, // v-html
  "cost"?: number,
  "allowed_types"?: WeaponType[], // weapon types the ammo CAN be applied to
  "allowed_sizes"?: WeaponSize[], // weapon sizes the ammo CAN be applied to
  "restricted_types"?: WeaponType[], // weapon types the ammo CAN NOT be applied to
  "restricted_sizes"?: WeaponSize[], // weapon sizes the ammo CAN NOT be applied to
```

Like mods, omitting an allowed value will apply the ammo element to all weapons of that type/size. Restrictions overrule allowances.

if `cost` is omitted the value is automatically set to `1`.

## DieRoll

Overcharge takes a `DieRoll` array. This is currently not evaluated, but may be in the future. This array must include one or more strings of either an integer or a die roll:

```
XdY+N
```

Where X is number of dice, Y is number of die sides, and N (optional) is a flat bonus or new die roll. Examples:

```
1d6   2d20-2    3d6+1d20-1d8+2
```

---

# Enums

**NB:** Strings here are case-sensitive

### SystemType

| String          | Description                                                                                                                                 |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `AI`            | AI Systems (like OSIRIS-CLASS NHP)                                                                                                          |
| `Deployable`    | Systems that are or contain non-drone Deployable equipment, or Charges (like PATTERN-A SMOKE CHARGES or PATTERN-A JERICHO DEPLOYABLE COVER) |
| `Drone`         | Systems that are or contain one ore more Drone-type Deployables (like TURRET DRONES)                                                        |
| `Flight System` | Systems that add or allow flying movement (like EVA MODULE)                                                                                 |
| `Shield`        | Systems that add Overshield or another shielding mechanic (like ACESO STABILIZER)                                                           |
| `System`        | Non-typed/passive/generic activation Systems (like CUSTOM PAINT JOB or REINFORCED CABLING)                                                  |
| `Tech`          | Systems that include a Tech Activation or expand Invasion options (like BLACK ICE MODULE or NEUROSPIKE)                                     |

## MountType

| String       | Description      |
| ------------ | ---------------- |
| `Main`       | Main Mount       |
| `Heavy`      | Heavy Mount      |
| `Aux/Aux`    | Aux/Aux Mount    |
| `Aux`        | Aux Mount        |
| `Main/Aux`   | Main/Aux Mount   |
| `Flex`       | Flex Mount       |
| `Integrated` | Integrated Mount |

## ActivationType

| String       | Description                                    |
| ------------ | ---------------------------------------------- |
| `Free`       | Free Action                                    |
| `Protocol`   | Protocol                                       |
| `Quick`      | Quick Action                                   |
| `Full`       | Full Action                                    |
| `Invade`     | Invasion Option                                |
| `Full Tech`  | Full Tech Action                               |
| `Quick Tech` | Quick Tech Action                              |
| `Reaction`   | Reaction                                       |
| `Other`      | Other/Unsorted Action (Counted as Free Action) |

## WeaponType

| String     | Description |
| ---------- | ----------- |
| `Rifle`    | Rifle       |
| `Cannon`   | Cannon      |
| `Launcher` | Launcher    |
| `CQB`      | CQB         |
| `Nexus`    | Nexus       |
| `Melee`    | Melee       |

## WeaponSize

| String       | Description |
| ------------ | ----------- |
| `Aux`        | Auxiliary'  |
| `Main`       | Main'       |
| `Heavy`      | Heavy'      |
| `Superheavy` | Superheavy  |
