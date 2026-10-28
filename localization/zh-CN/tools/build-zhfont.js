const __REPO = require("path").resolve(__dirname, "../../..").split(require("path").sep).join("/");
const __ZH = __REPO + "/localization/zh-CN/translations";
const __WORK = require("path").join(require("os").tmpdir(), "hoa-zh").split(require("path").sep).join("/");
const fs = require('fs');
const path = require('path');
const subsetFont = require('subset-font');

const ZHDIR = __ZH;
const SRC = (__WORK + '/font/LXGWWenKai-Regular.ttf');
const OUTS = [
  (__REPO + '/Interface/AddOns/HordesOfAzeroth/Fonts/ZhFont.ttf'),
];

const COMMON = '的一是了我不人在他有这上们来到时大地为子中你说生国年着就那和要她出也得里后自以会家可下而过天去能对小多然于心学么之都好看起发当没成只如事把还用第样道想作种开美总从无情己面最女但现前些所同日手又行意动方期它头经长儿回位分爱老因很给名法间斯知世什两次使身者被高已亲其进此话常与活正感见明问力理尔点文几定本公特做外孩相西果走将月十实向声车全信重三机工物气每并别真打太新比才便夫再书部水像眼等体却加电主界门利海受听表德少克代员许稜先口由死安写性马光白或住难望教命花结乐色更拉东神记处让母父应直字场平报友关放至张认接告入笑内英军候民岁往何度山觉路带万男边风解叫任金快原吃妈变通师立象数四失满战远格士音轻目条呢病始达深完今提求清王化空业思切怎非找片罗钱语元喜曾离飞科言干流欢约各即指合反题必该论交终林请医晚制球决传画保读运及则房早院量苦火布字占兴办团队女木校级针阿守毛示复兴散板难位术视米李跟穿祖击半办信级件康黑战宁排树破价德餐确底游号刃刚微精示厂床苏虽送场剑吧蒙素鱼整措甚忽架势哥狂构乾免滑蛋康料害析烟盾曾弹普玛塔毒玩圣稳欢暗丰埃械梦梅私兰半极级赢巅胖瘦饿倦凉暖暗劳冠军';
const PUNCT = '，。！？：；（）【】“”‘’…—·、％℃《》〈〉「」『』〔〕｛｝～￥';

async function main() {
  const chars = new Set();
  for (const c of COMMON) chars.add(c);
  for (const c of PUNCT) chars.add(c);
  for (let code = 32; code < 127; code++) chars.add(String.fromCharCode(code));
  chars.add('\n');
  chars.add('\t');
  chars.add('\u00b7');
  let count = 0;
  for (const f of fs.readdirSync(ZHDIR).filter(f => f.endsWith('.json'))) {
    const data = JSON.parse(fs.readFileSync(path.join(ZHDIR, f), 'utf8'));
    for (const zh of Object.values(data)) {
      for (const c of zh) {
        if (c === '{' || c === '}' || c === 'E' || c === 'M' || (c >= '1' && c <= '9')) continue;
        chars.add(c);
      }
      count++;
    }
  }
  const text = Array.from(chars).join('');
  console.log('source strings:', count, 'unique chars:', chars.size);
  const fontBuffer = fs.readFileSync(SRC);
  const subset = await subsetFont(fontBuffer, text, { type: 'sfnt' });
  for (const OUT of OUTS) {
    fs.writeFileSync(OUT, subset);
    console.log('wrote', OUT, Math.round(subset.length / 1024), 'KB');
  }
  const licenseSrc = (__WORK + '/font/OFL.txt');
  const licenseDst = path.join(path.dirname(OUTS[0]), 'ZhFont-OFL.txt');
  fs.copyFileSync(licenseSrc, licenseDst);
  console.log('license copied to', licenseDst);
}

main().catch(e => { console.error(e); process.exit(1); });
