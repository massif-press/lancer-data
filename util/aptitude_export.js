const fs = require('fs');

const weapons = require('../lib/weapons.json')
const systems = require('../lib/systems.json')
const mods = require('../lib/mods.json')
const frames = require('../lib/frames.json')

// const items = [weapons, systems, mods, frames]
const items = [weapons]

function row(x) {
  if (x.data_type === 'weapon') return weaponRow(x)
  return `${x.source},${x.name},0,0,0,0,0,0\n`
  // return `${x.data_type},${x.id},${x.source},${x.name},0,0,0,0,0,0\n`
}

function weaponRow(x) {
  // return `${x.data_type},${x.id},${x.source},${x.name},0,${rangedAp(x)},0,0,0,0\n`
  return `${x.source},${x.name},${closeAp(x)},${rangedAp(x)},0,0,0,0\n`
}

function getDamage(d, tags) {
    let dscore = 0
    let guaranteed = 0
    let possible = 0
    if (typeof d.val === "string")  {
    const dmgArr = d.val.split(/d|\+/g)
    if (dmgArr.length === 1) guaranteed = parseInt(dmgArr[0]) // straight value, no dice
    else {
    if (dmgArr.length === 3) guaranteed = parseInt(dmgArr[2]) // bonus val
    // handle dice
      guaranteed += parseInt(dmgArr[0])  // min number we can get on the dice
      possible = (parseInt(dmgArr[0]) * parseInt(dmgArr[1])) - parseInt(dmgArr[0])
    }
    // guaranteed = 1pt, possible = 0.5
    dscore += guaranteed * (possible / 2)
    } else {
      guaranteed = d.val
    }

    if (tags.find(x => x.id === 'tg_accurate')) dscore += (possible * 0.25)
    if (tags.find(x => x.id === 'tg_inaccurate')) dscore -= (possible * 0.25)
    if (tags.find(x => x.id === 'tg_reliable')) dscore += (tags.find(x => x.id === 'tg_reliable').val * 3)

    return dscore
}

function closeAp(x) {
  let score = 0
  const tags = x.tags || []
  if (x.type.toLowerCase() !== 'melee' || !x.damage || !x.damage.length) return score.toString()

    x.damage.forEach(d => {
      score += getDamage(d, tags)
  });

  const threat = x.range.find(y => y.type.toLowerCase() === 'threat')
  // console.log(threat)
  if (threat) score *= ((threat.val + 1) / 2)

  if (tags.find(x => x.id === 'tg_ap')) score = (score * 1.35)
  if (tags.find(x => x.id === 'tg_arcing')) score = (score * 1.15)
  if (tags.find(x => x.id === 'tg_smart')) score = (score * 1.15)
  if (tags.find(x => x.id === 'tg_overkill')) score = (score * 1.15)
  if (tags.find(x => x.id === 'tg_loading')) score = (score * 0.85)

  return Math.ceil(score).toString()

}

function rangedAp(x) {
  let score = 0
  const tags = x.tags || []
  if (x.type.toLowerCase() === 'melee' || !x.range || !x.range.length || !x.damage || !x.damage.length) return score.toString()
    x.damage.forEach(d => {
      score += getDamage(d, tags)
  });
  //collect range pts
  x.range.forEach(r => {
    let rscore = 0
    if (typeof r.val === 'string') return 'XXXX'
    if (r.type.toLowerCase() === 'range') {
      if (r.val <= 10) score += (r.val / 2)
      else {
        rscore += 5 + (r.val - 10)
      }
    }
    if (r.type.toLowerCase() === 'blast') {
      rscore += Math.pow(r.val * 3, 2) / 2
    }
    if (r.type.toLowerCase() === 'burst') {
      rscore += Math.pow(r.val * 3, 2) / 3
    }
    if (r.type.toLowerCase() === 'cone') {
      rscore += Math.pow(r.val, 2) / 2
    }
    if (r.type.toLowerCase() === 'line') {
      rscore += (r.val * 2)
    }
    if (r.type.toLowerCase() === 'thrown') {
      rscore = (score / 3)
    }
    score += rscore 
  })

    if (tags.find(x => x.id === 'tg_ap')) score = (score * 1.35)
    if (tags.find(x => x.id === 'tg_arcing')) score = (score * 1.15)
    if (tags.find(x => x.id === 'tg_smart')) score = (score * 1.15)
    if (tags.find(x => x.id === 'tg_overkill')) score = (score * 1.15)
    if (tags.find(x => x.id === 'tg_loading')) score = (score * 0.85)

    return Math.ceil(score).toString()
}


// let output = 'TYPE,ID,SOURCE,NAME,CQB,RANGED,SURVIVABILITY,MANUVERABILITY,SUPPORT,CONTROL\n'
let output = 'SOURCE,NAME,MELEE,RANGED,SURVIVABILITY,MANUVERABILITY,SUPPORT,CONTROL\n'

items.forEach(e => {
  e.forEach(x => {
    output += row(x)
  });
});


fs.writeFile('./util/output/equipment.csv', output, function (err) {
  if (err) return console.log(err);
  console.log('Export Complete');
});