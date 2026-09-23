export const defaultSystem = () => ({
  colors: {primary:'#345eea',accent:'#c9fe69',canvas:'#f5f7fb',text:'#13203a',muted:'#64748b',surface:'#ffffff'},
  typography: {family:'Arial, sans-serif',heading:32,body:16,small:12},
  spacing: {unit:8},
  corners: {card:16,button:12}
});

export function normalizeProject(input) {
  const p = structuredClone(input);
  p.designSystem = p.designSystem || defaultSystem();
  p.briefFields = p.briefFields || {goal:p.brief || '',audience:'',layout:'',content:''};
  if (!Array.isArray(p.screens)) {
    const screen = {id:crypto.randomUUID(),name:'Home',width:p.width || 390,height:p.height || 844,background:p.background || '#f5f7fb',elements:p.elements || [],comments:[]};
    p.screens = [screen]; p.activeScreenId = screen.id;
  }
  if (!p.activeScreenId || !p.screens.some(s=>s.id===p.activeScreenId)) p.activeScreenId=p.screens[0]?.id;
  for (const s of p.screens) { s.elements ||= []; s.comments ||= []; }
  p.versions ||= [];
  return p;
}

export function captureProject(p) {
  return {designSystem:structuredClone(p.designSystem),briefFields:structuredClone(p.briefFields),screens:structuredClone(p.screens),activeScreenId:p.activeScreenId};
}

export function approvedProject(p, version) {
  const snapshot = version.snapshot;
  if (Array.isArray(snapshot?.screens)) return normalizeProject({...p,...structuredClone(snapshot)});
  const legacy = normalizeProject({...p,screens:undefined,activeScreenId:undefined,width:snapshot.width,height:snapshot.height,background:snapshot.background,elements:snapshot.elements,brief:snapshot.brief});
  return legacy;
}

export function currentScreen(p) { return p.screens.find(s=>s.id===p.activeScreenId) || p.screens[0]; }
export function colorFor(p, item, key) {
  const token = item[key+'Token'];
  return token && p.designSystem.colors[token] ? p.designSystem.colors[token] : item[key];
}
export function sizeFor(p,item){return item.fontSizeToken&&p.designSystem.typography[item.fontSizeToken] ? p.designSystem.typography[item.fontSizeToken] : item.fontSize;}
export function radiusFor(p,item){return item.radiusToken&&p.designSystem.corners[item.radiusToken] ? p.designSystem.corners[item.radiusToken] : item.radius;}
