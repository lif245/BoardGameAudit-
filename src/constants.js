export const CHARS = [
  {id:'cio',name:'Dr. วิชัย',title:'Chief Information Officer',avatar:'👔', bonus:'EDM',bonusDesc:'EDM +1 อัตโนมัติ',ability:'Executive Override',abilityDesc:'เพิ่ม Trust +15 (1 ครั้ง)',passive:'Trust เริ่ม 60',startBonus:{trust:10},abilityUsed:false},
  {id:'risk',name:'นางสาว สุภา',title:'Risk Manager',avatar:'🛡️', bonus:'APO',bonusDesc:'APO +1 อัตโนมัติ',ability:'Crisis Shield',abilityDesc:'เพิ่ม Risk +25 (1 ครั้ง)',passive:'Risk เริ่ม 65',startBonus:{risk:15},abilityUsed:false},
  {id:'dev',name:'นาย ธนกร',title:'Lead Developer',avatar:'💻', bonus:'BAI',bonusDesc:'BAI +1 อัตโนมัติ',ability:'Rapid Deploy',abilityDesc:'ลด Budget ลบ (Passive)',passive:'Budget เริ่ม 120',startBonus:{budget:20},abilityUsed:false},
  {id:'auditor',name:'นาง มาลี',title:'Internal Auditor',avatar:'📋', bonus:'MEA',bonusDesc:'MEA +1 อัตโนมัติ',ability:'Emergency Fund',abilityDesc:'เพิ่ม Budget 20 (1 ครั้ง)',passive:'Maturity เริ่ม Lv.2',startBonus:{maturity:1},abilityUsed:false}
];

export const DOMAINS_DEF = [
  {id:'EDM',name:'EDM',icon:'🏛️',color:'#eab308'}, 
  {id:'APO',name:'APO',icon:'📐',color:'#a855f7'},
  {id:'BAI',name:'BAI',icon:'🔧',color:'#14b8a6'}, 
  {id:'DSS',name:'DSS',icon:'⚙️',color:'#3b82f6'},
  {id:'MEA',name:'MEA',icon:'📊',color:'#f43f5e'}
];

export const ITEMS = [
  {id:'budget_pack',name:'กองทุนด่วน',desc:'Budget +20',uses:1,effect:{budget:20}, icon:'💰'},
  {id:'trust_boost',name:'PR Event',desc:'Trust +15',uses:1,effect:{trust:15}, icon:'🤝'},
  {id:'risk_barrier',name:'Firewall',desc:'Risk Buffer +20',uses:1,effect:{risk:20}, icon:'🛡️'},
  {id:'mat_boost',name:'System Upgrade',desc:'Maturity +1 ทุกโดเมน',uses:1,effect:{maturity:{EDM:1,APO:1,BAI:1,DSS:1,MEA:1}}, icon:'✨'}
];

export const EVENTS = {
  risk: [
    {title:'ระบบ ERP ขัดข้อง',desc:'ระบบหลักขององค์กรไม่สามารถทำงานได้ กระทบ 40 แผนก',domain:'DSS', choices:[{text:'เปิด War Room แก้ปัญหาส่วนกลาง',effect:{budget:-10,risk:-15,maturity:{DSS:1}},label:'(+DSS Maturity)'},{text:'ให้ IT ซ่อมเงียบๆ ไม่รายงานทันที',effect:{trust:-15,risk:-10},label:'เสีย Trust หนัก'}]},
    {title:'Data Breach Alert!',desc:'พบการรั่วไหลของข้อมูลลูกค้า',domain:'DSS', choices:[{text:'แจ้ง Regulator และเร่งดำเนินการแก้ไข',effect:{trust:-5,budget:-20,risk:-20,maturity:{MEA:1}},label:'โปร่งใส (+MEA)'},{text:'ปิดข่าวไว้ก่อน',effect:{trust:-25,budget:-10,risk:-10},label:'ผิด Compliance'}]},
    {title:'Ransomware Attack',desc:'พบการพยายามเข้ารหัสไฟล์เซิร์ฟเวอร์',domain:'APO', choices:[{text:'ใช้แผน DRP ตัดการเชื่อมต่อและกู้คืน',effect:{budget:-25,risk:-20,maturity:{APO:1}},label:'ปลอดภัย (+APO)'},{text:'ยอมจ่ายค่าไถ่เพื่อประหยัดเวลา',effect:{trust:-20,budget:-40,risk:-10},label:'ไม่แนะนำ'}]}
  ],
  opp: [
    {title:'Cloud Migration Project',desc:'พิจารณาย้ายข้อมูลขึ้นระบบคลาวด์',domain:'BAI', choices:[{text:'ทำขั้นตอน ROI และ Assess ก่อน',effect:{trust:+5,budget:+5,risk:+5,maturity:{BAI:1}},label:'รอบคอบ (+BAI)'},{text:'อนุมัติย้ายด่วนเพื่อลดต้นทุน Server',effect:{trust:-5,budget:+15,risk:-15},label:'เสี่ยงด้าน Security'}]},
    {title:'ฝึกอบรมด้าน COBIT',desc:'พนักงานเสนอให้มีการประเมินภายใน',domain:'EDM', choices:[{text:'อัดฉีดงบจัดเทรนนิ่งให้พนักงาน',effect:{trust:+10,budget:-15,risk:+10,maturity:{EDM:1}},label:'ผลดีระยะยาว (+EDM)'},{text:'ปฏิเสธโครงการ',effect:{budget:0,risk:-5},label:'ประหยัด Budget'}]},
    {title:'จ้าง External Audit ล่วงหน้า',desc:'เตรียมความพร้อมก่อนของจริงจะมา',domain:'MEA', choices:[{text:'ให้เข้ามาตรวจสอบระบบเต็มพิกัด',effect:{trust:+15,budget:-15,risk:+10,maturity:{MEA:1}},label:'ยกระดับ (+MEA)'},{text:'ประวิงเวลาไปก่อน',effect:{trust:-10,budget:0,risk:-10},label:'เก็บ Budget ไว้รบบอส'}]}
  ]
};

export const BOARD_TRACK = [
  {type:'start', icon:'🏁'},
  {type:'safe', icon:'✅'}, {type:'risk', icon:'⚠️'}, {type:'opp', icon:'💡'}, {type:'safe', icon:'✅'},
  {type:'bonus', icon:'➕'}, {type:'risk', icon:'⚠️'}, {type:'safe', icon:'✅'}, {type:'opp', icon:'💡'},
  {type:'safe', icon:'✅'}, {type:'risk', icon:'⚠️'}, {type:'bonus', icon:'➕'}, {type:'opp', icon:'💡'},
  {type:'risk', icon:'⚠️'}, {type:'safe', icon:'✅'}, {type:'opp', icon:'💡'}, {type:'risk', icon:'⚠️'},
  {type:'safe', icon:'✅'}, {type:'bonus', icon:'➕'}, {type:'opp', icon:'💡'}, {type:'risk', icon:'⚠️'},
  {type:'safe', icon:'✅'}, {type:'opp', icon:'💡'}, {type:'boss', icon:'📊'}
];
