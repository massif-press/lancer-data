"use strict"

const data = {
  backgrounds: require('lib/backgrounds.json'),
  core_bonuses: require('lib/core_bonuses.json'),
  frames: require('lib/frames.json'),
  info: require('lib/info.json'),
  manufacturers: require('lib/manufacturers.json'),
  mods: require('lib/mods.json'),
  pilot_gear: require('lib/pilot_gear.json'),
  quirks: require('lib/quirks.json'),
  statuses: require('lib/statuses.json'),
  systems: require('lib/systems.json'),
  tags: require('lib/tags.json'),
  talents: require('lib/talents.json'),
  translation_table: require('lib/translation_table.json'),
  weapons: require('lib/weapons.json'),
}

let licenses = []
state.Frames.filter((x) => x.source.toUpperCase() !== 'GMS').forEach((frame) => {
  licenses.push({
    source: frame.source.toUpperCase(),
    license: frame.name.toUpperCase(),
    unlocks: [
      [],         // level 1
      [frame],    // level 2
      [],         // level 3
    ]
  })
})
let items = JSON.parse(JSON.stringify(data.weapons))
items = items.concat(data.WeaponMods, data.MechSystems)
items.filter((x) => x.source && x.source.toUpperCase() !== 'GMS' 
  && x.source.toUpperCase() !== '').forEach((item) => {
    const idx = licenses.findIndex((x) => x.license === item.license.toUpperCase())
    licenses[idx].unlocks[item.license_level - 1].push(item)
  })
data.licenses = licenses

module.exports = data