import { defaultSystem, normalizeProject } from './model.js';

export const templates = [
  { id:'blank', name:'Blank', icon:'▣', description:'Start with an empty canvas' },
  { id:'mobile', name:'Mobile app design', icon:'▯', description:'A three screen app flow' },
  { id:'slides', name:'Slides', icon:'▤', description:'A title and content deck' },
  { id:'document', name:'Document', icon:'▧', description:'A readable page layout' },
  { id:'wireframe', name:'Wireframe', icon:'▨', description:'Low fidelity app structure' },
  { id:'animation', name:'Animation', icon:'▶', description:'Storyboard frames and motion notes' },
  { id:'mockups', name:'UI mockups', icon:'▣', description:'Desktop product screens' },
  { id:'resume', name:'Résumé', icon:'▤', description:'A one page professional profile' },
  { id:'object3d', name:'3D object', icon:'⬡', description:'Concept views and material notes' },
  { id:'research', name:'Research', icon:'⌕', description:'Question, evidence, and insights' },
  { id:'email', name:'HTML email', icon:'▥', description:'Responsive email layout concept' },
  { id:'pairing', name:'Color + type pairing', icon:'Aa', description:'Explore a visual identity' }
];

const element = (type,x,y,w,h,text='',options={}) => ({id:crypto.randomUUID(),type,x,y,w,h,text,fontSize:options.size||16,color:options.color||'#17243d',background:options.background||'transparent',weight:options.weight||'400',radius:options.radius||0});
const text = (x,y,w,h,value,size=18,color='#17243d',weight='400') => element('text',x,y,w,h,value,{size,color,weight});
const block = (x,y,w,h,color='#e8edf5',radius=12) => element('box',x,y,w,h,'',{background:color,radius});
const button = (x,y,w,h,value,color='#345eea') => element('button',x,y,w,h,value,{background:color,color:'#ffffff',weight:'700',radius:12});
const screen = (name,width,height,elements,background='#ffffff') => ({id:crypto.randomUUID(),name,width,height,background,elements,comments:[]});
const mobileHeader = title => [text(28,35,330,24,'9:41                                      ●●●',12,'#7d899c','700'),text(28,89,330,42,title,32,'#17243d','700')];
const section = (heading,copy,y) => [text(42,y,680,34,heading,24,'#17243d','700'),text(42,y+45,680,80,copy,17,'#52627a')];

function screensFor(id) {
  switch(id){
    case 'blank': return [screen('Canvas',390,844,[],'#f5f7fb')];
    case 'mobile': return [
      screen('Welcome',390,844,[...mobileHeader('Welcome back'),block(28,164,334,220,'#e8edff',22),text(52,218,286,120,'A calmer way to get things done.',29,'#18345c','700'),text(28,415,334,65,'A short introduction to your app and the value it brings.',17,'#586980'),button(28,707,334,54,'Continue')],'#f8faff'),
      screen('Home',390,844,[...mobileHeader('Good morning'),text(28,149,330,28,'Here is what matters today',16,'#728099'),block(28,209,334,152,'#e8edff',20),text(50,238,284,36,'Featured card',23,'#17243d','700'),text(50,286,284,58,'Use this space for the primary task or offer.',15,'#52627a'),text(28,401,330,30,'Explore',21,'#17243d','700'),block(28,453,334,93,'#ffffff',14),block(28,561,334,93,'#ffffff',14),button(28,707,334,54,'Primary action')],'#f8faff'),
      screen('Details',390,844,[...mobileHeader('Details'),block(28,157,334,252,'#e8edff',20),text(28,441,334,42,'Item title',29,'#17243d','700'),text(28,504,334,98,'A clear description of this item, its benefits, and what happens next.',17,'#52627a'),button(28,707,334,54,'Take action')],'#f8faff')
    ];
    case 'slides': return [screen('Title slide',1280,720,[block(0,0,1280,720,'#101c35',0),text(92,116,900,38,'PRESENTATION',20,'#a9c6ff','700'),text(92,210,1050,190,'The story starts here',76,'#ffffff','700'),text(92,487,970,78,'A clear subtitle that frames your idea and audience.',28,'#c9d6ec')],'#101c35'),screen('Key idea',1280,720,[text(86,70,1100,44,'01 / THE OPPORTUNITY',22,'#345eea','700'),text(86,155,1090,100,'One idea per slide.',60,'#17243d','700'),...section('Evidence','Add the strongest supporting point or data here.',330),block(860,306,300,250,'#e8edff',24)],'#ffffff')];
    case 'document': return [screen('Page 1',794,1123,[text(70,65,654,24,'DOCUMENT TITLE',15,'#345eea','700'),text(70,135,654,110,'A clear title for your document',42,'#17243d','700'),text(70,266,654,60,'Subtitle or summary that gives readers the context they need.',19,'#52627a'),block(70,357,654,2,'#d7e0ee',0),...section('Overview','Write your introduction here. Keep paragraphs short and use clear headings so the document is easy to scan.',417),...section('Main section','Add your key points, findings, or recommendations in this section.',646),text(70,1042,654,30,'Page 1',12,'#8491a5')],'#ffffff')];
    case 'wireframe': return [screen('List wireframe',390,844,[block(0,0,390,78,'#e5e7eb',0),text(24,27,330,28,'LOGO                 MENU',16,'#596170','700'),block(24,112,342,150,'#d5d9df',8),block(24,293,245,22,'#abb3bf',3),block(24,330,342,14,'#d5d9df',3),block(24,354,301,14,'#d5d9df',3),block(24,418,342,105,'#e5e7eb',8),block(24,541,342,105,'#e5e7eb',8),block(24,702,342,54,'#8b96a7',8)],'#f7f7f7'),screen('Detail wireframe',390,844,[block(0,0,390,78,'#e5e7eb',0),text(24,27,330,28,'← BACK',16,'#596170','700'),block(24,112,342,240,'#d5d9df',8),block(24,388,270,28,'#abb3bf',3),block(24,441,342,16,'#d5d9df',3),block(24,469,300,16,'#d5d9df',3),block(24,497,332,16,'#d5d9df',3),block(24,702,342,54,'#8b96a7',8)],'#f7f7f7')];
    case 'animation': return [screen('Frame 01 · Start',1280,720,[block(0,0,1280,720,'#17243d',0),text(80,60,1060,32,'FRAME 01  •  0:00',20,'#9db6ff','700'),block(80,164,350,350,'#345eea',30),text(492,196,680,120,'Your idea in motion',54,'#ffffff','700'),text(492,344,640,100,'Set the opening composition and describe how it moves into the next frame.',24,'#d4def2')],'#17243d'),screen('Frame 02 · Reveal',1280,720,[block(0,0,1280,720,'#17243d',0),text(80,60,1060,32,'FRAME 02  •  0:02',20,'#9db6ff','700'),block(800,164,350,350,'#a7e36a',30),text(92,196,660,120,'Reveal the result',54,'#ffffff','700'),text(92,344,600,100,'Show the end state. Add easing and timing instructions to the brief.',24,'#d4def2')],'#17243d')];
    case 'mockups': return [screen('Dashboard',1280,800,[block(0,0,238,800,'#14213d',0),text(28,35,185,40,'PRODUCT',26,'#ffffff','700'),text(28,128,185,150,'Overview\n\nProjects\n\nSettings',18,'#b9c8e4'),text(285,43,900,45,'Dashboard',35,'#17243d','700'),text(285,108,850,27,'Your workspace at a glance',17,'#61718a'),block(285,190,280,150,'#eef2ff',18),block(585,190,280,150,'#eaf7ec',18),block(885,190,280,150,'#fff2e8',18),text(308,223,220,60,'Metric 01\n24.8k',26,'#17243d','700'),text(608,223,220,60,'Metric 02\n82%',26,'#17243d','700'),text(908,223,220,60,'Metric 03\n1,240',26,'#17243d','700'),block(285,379,880,335,'#f3f6fb',18),text(311,403,810,38,'Activity',24,'#17243d','700')],'#ffffff'),screen('Detail',1280,800,[block(0,0,238,800,'#14213d',0),text(28,35,185,40,'PRODUCT',26,'#ffffff','700'),text(285,43,900,45,'Project detail',35,'#17243d','700'),block(285,150,880,570,'#f3f6fb',18),text(321,187,780,45,'Overview and next steps',28,'#17243d','700'),button(901,645,220,54,'Primary action')],'#ffffff')];
    case 'resume': return [screen('Résumé',794,1123,[block(0,0,794,260,'#192844',0),text(62,69,670,80,'Your Name',50,'#ffffff','700'),text(62,157,670,36,'Role or professional headline',22,'#bfd0f3'),text(62,211,670,26,'City  •  email@example.com  •  portfolio',15,'#d7e2f8'),...section('Profile','Write a focused summary of your work, strengths, and the role you want.',305),...section('Experience','Role title  ·  Company  ·  Dates\nAdd measurable outcomes and relevant work here.',489),...section('Skills','List the tools and strengths most relevant to the opportunity.',736),...section('Education','Qualification  ·  Institution  ·  Year',911)],'#ffffff')];
    case 'object3d': return [screen('Front view',960,720,[block(0,0,960,720,'#e9edf4',0),text(48,37,860,34,'OBJECT STUDY  /  FRONT',19,'#52627a','700'),block(293,153,374,374,'#345eea',45),block(335,192,290,290,'#85a1ff',38),text(48,620,850,60,'Material: matte blue  •  Lighting: soft studio  •  View: front',17,'#52627a')],'#e9edf4'),screen('Side view',960,720,[block(0,0,960,720,'#e9edf4',0),text(48,37,860,34,'OBJECT STUDY  /  SIDE',19,'#52627a','700'),block(380,153,200,374,'#345eea',45),block(410,192,140,290,'#85a1ff',38),text(48,620,850,60,'Describe dimensions, materials, and desired render in the brief.',17,'#52627a')],'#e9edf4')];
    case 'research': return [screen('Research board',1280,800,[text(58,46,1120,40,'RESEARCH BOARD',18,'#345eea','700'),text(58,104,1100,70,'What do we need to learn?',43,'#17243d','700'),block(58,230,350,420,'#e9f0ff',18),block(465,230,350,420,'#eef4e7',18),block(872,230,350,420,'#fff2e8',18),text(83,258,300,45,'Question',26,'#17243d','700'),text(83,323,300,180,'Write the core question and assumptions to test.',18,'#52627a'),text(490,258,300,45,'Evidence',26,'#17243d','700'),text(490,323,300,180,'Capture observations, links, and useful quotes.',18,'#52627a'),text(897,258,300,45,'Insight',26,'#17243d','700'),text(897,323,300,180,'Summarize what the evidence means for the design.',18,'#52627a')],'#ffffff')];
    case 'email': return [screen('Email',600,800,[block(0,0,600,800,'#f2f5fa',0),block(30,30,540,710,'#ffffff',0),text(62,61,470,28,'YOUR BRAND',18,'#345eea','700'),block(62,124,476,206,'#e8edff',16),text(88,172,424,114,'A message worth opening',36,'#17243d','700'),text(62,367,476,90,'Write a concise opening that explains the offer and why it matters.',18,'#52627a'),button(62,491,476,55,'Call to action'),text(62,625,476,60,'Contact details  •  Unsubscribe',13,'#8491a5')],'#f2f5fa')];
    case 'pairing': return [screen('Style board',1000,760,[block(0,0,1000,760,'#f7f6f2',0),text(58,43,884,30,'COLOR + TYPE PAIRING',18,'#6e6a61','700'),text(58,115,884,118,'Design with character.',62,'#17243d','700'),text(58,259,884,56,'Heading specimen  /  Body text specimen',24,'#52627a'),block(58,373,206,165,'#17243d',14),block(283,373,206,165,'#345eea',14),block(508,373,206,165,'#a7e36a',14),block(733,373,206,165,'#e6d4b8',14),text(58,558,884,45,'Ink                 Primary             Accent              Neutral',16,'#52627a'),button(58,650,250,54,'Button sample')],'#f7f6f2')];
    default: throw Error('Unknown template');
  }
}

export function createTemplateProject(id){
  const template=templates.find(item=>item.id===id);
  if(!template)throw Error('Unknown template');
  const screens=screensFor(id);
  const briefFields={goal:'',audience:'',layout:'',content:''};
  if(id==='animation')briefFields.layout='Describe each frame, duration, transition, and easing before implementation.';
  if(id==='object3d')briefFields.layout='Describe object dimensions, materials, lighting, and required views before 3D implementation.';
  if(id==='email')briefFields.content='Replace sample copy, links, sender details, and unsubscribe information before sending.';
  return normalizeProject({id:crypto.randomUUID(),name:template.name,templateId:id,designSystem:defaultSystem(),briefFields,screens,activeScreenId:screens[0].id,versions:[],updatedAt:new Date().toISOString()});
}
