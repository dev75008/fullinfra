import { dependencyServices, dependencyLinks, dependencyGroups, dependencyKinds } from './data/microsoft365Dependencies.js';

const xml=value => String(value).replace(/[&<>"']/g,char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[char]));
const wrap=(text,length=25) => {
  const lines=[''];
  for (const word of text.split(' ')) {
    if ((lines.at(-1)+' '+word).trim().length > length) lines.push(word);
    else lines[lines.length-1]=(lines.at(-1)+' '+word).trim();
  }
  return lines;
};
export function renderDependencySvg(selected='',exportLegend=false) {
  const nodes=dependencyServices.map((service,index) => {
    const angle=(-90+index*360/dependencyServices.length)*Math.PI/180;
    return {...service,x:1000+800*Math.cos(angle),y:850+680*Math.sin(angle)};
  });
  const byId=Object.fromEntries(nodes.map(node => [node.id,node]));
  const relevant=dependencyLinks.filter(link => !selected || link.from === selected || link.to === selected);
  const active=new Set(relevant.flatMap(link => [link.from,link.to]));
  const paths=dependencyLinks.map((link,index) => {
    const a=byId[link.from],b=byId[link.to],dx=b.x-a.x,dy=b.y-a.y;
    const distance=Math.hypot(dx,dy);
    const cx=(a.x+b.x)/2-dy/distance*(120+index%5*25),cy=(a.y+b.y)/2+dx/distance*(120+index%5*25);
    function boundary(node,x,y) {const dx=x-node.x,dy=y-node.y,t=Math.min(110/Math.max(Math.abs(dx),.01),53/Math.max(Math.abs(dy),.01));return [node.x+dx*t,node.y+dy*t];}
    const start=boundary(a,cx,cy),end=boundary(b,cx,cy);
    return {...link,index,start,end,cx,cy};
  });
  const edgeMarkup=paths.sort((a,b) => Number(relevant.includes(dependencyLinks[a.index]))-Number(relevant.includes(dependencyLinks[b.index]))).map(link => {
    const visible=!selected || link.from === selected || link.to === selected;
    const color=dependencyKinds[link.kind].color;
    const x=(link.start[0]+2*link.cx+link.end[0])/4,y=(link.start[1]+2*link.cy+link.end[1])/4;
    return `<g opacity="${visible ? selected ? 1 : .42 : .045}"><title>${xml(byId[link.from].name+' → '+byId[link.to].name+' : '+link.label)}</title><path d="M${link.start} Q${link.cx},${link.cy} ${link.end}" fill="none" stroke="${color}" stroke-width="${visible && selected ? 4 : 2}" ${link.kind === 'network' ? '' : 'stroke-dasharray="9 7"'} marker-end="url(#dep-${link.kind})"/></g>`;
  }).join('');
  const boxes=[];
  const labelMarkup=selected ? paths.filter(link => link.from === selected || link.to === selected).map(link => {
    let chosen;
    for (const offset of [0,45,-45,90,-90,145,-145,210,-210,300,-300,450,-450,600,-600,900,-900]) {
      for (const t of [.5,.35,.65,.25,.75]) {
        const px=(1-t)**2*link.start[0]+2*(1-t)*t*link.cx+t*t*link.end[0];
        const py=(1-t)**2*link.start[1]+2*(1-t)*t*link.cy+t*t*link.end[1];
        const x=Math.max(150,Math.min(1850,px+offset)),y=Math.max(145,Math.min(1560,py+offset*.5));
        const box={left:x-130,right:x+130,top:y-20,bottom:y+20};
        const overlaps=b => box.left<b.right+12 && box.right>b.left-12 && box.top<b.bottom+12 && box.bottom>b.top-12;
        const occupied=[...nodes.map(n => ({left:n.x-110,right:n.x+110,top:n.y-53,bottom:n.y+53})),{left:845,right:1155,top:695,bottom:1005},...boxes];
        if (!occupied.some(overlaps)) {chosen={x,y,px,py,box};break;}
      }
      if (chosen) break;
    }
    if (!chosen) return '';
    boxes.push(chosen.box);
    const {x,y,px,py}=chosen,color=dependencyKinds[link.kind].color;
    return `<g><path d="M${px},${py}L${x},${y}" stroke="${color}" stroke-width="1" fill="none"/><rect x="${x-130}" y="${y-20}" width="260" height="40" rx="5" fill="white" stroke="${color}"/><text x="${x}" y="${y+6}" text-anchor="middle" font-size="18" fill="${color}">${xml(link.label)}</text></g>`;
  }).join('') : '';
  const nodeMarkup=nodes.map(node => {
    const color=dependencyGroups[node.group].color;
    const names=wrap(node.name,20),roles=wrap(node.role,26);
    return `<g data-service="${node.id}" opacity="${!selected || active.has(node.id) ? 1 : .8}" style="cursor:pointer"><title>${xml(node.name+' : '+node.role)}</title><rect x="${node.x-110}" y="${node.y-53}" width="220" height="106" rx="8" fill="${node.id === selected ? '#e7f2fc' : '#fff'}" stroke="${node.id === selected ? '#005a9e' : '#c5d3de'}" stroke-width="${node.id === selected ? 4 : 1.5}"/><rect x="${node.x-110}" y="${node.y-53}" width="220" height="5" fill="${color}"/><text x="${node.x-94}" y="${node.y-26}" font-size="16" font-weight="700" fill="${color}">${xml(node.short)}</text>${names.map((line,i) => `<text x="${node.x-94}" y="${node.y-3+i*24}" font-size="21" font-weight="600" fill="#242424">${xml(line)}</text>`).join('')}${roles.slice(0,1).map(line => `<text x="${node.x-94}" y="${node.y+40}" font-size="14" fill="#535b62">${xml(line)}</text>`).join('')}</g>`;
  }).join('');
  const height=exportLegend ? 2700 : 1800;
  const legendMarkup=exportLegend ? `<text x="65" y="1825" font-size="28" font-weight="600" fill="#242424">Relations documentées</text>${dependencyLinks.map((link,index) => {
    const x=index<18 ? 65 : 1050,y=1870+(index%18)*43;
    return `<text x="${x}" y="${y}" font-size="18" fill="#242424">${xml(byId[link.from].name+' → '+byId[link.to].name)}</text><text x="${x}" y="${y+20}" font-size="16" fill="${dependencyKinds[link.kind].color}">${xml(link.label)}</text>`;
  }).join('')}<text x="65" y="2680" font-size="18" fill="#535b62">Détails et références Microsoft Learn : fullinfra.duckdns.org/microsoft-365 • FullInfra, octobre 2026</text>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2000 ${height}" width="2000" height="${height}" style="font-family:Segoe UI,Arial,sans-serif;background:#f7fafc"><rect width="2000" height="${height}" fill="#f7fafc"/><title>Microsoft 365 : services, communications et dépendances</title><desc>Vingt composants et trente-six relations documentées. Une flèche A vers B signifie que A utilise B ou agit sur B pour la fonction indiquée. Les traits discontinus sont des relations fonctionnelles, pas des transports internes.</desc><defs>${Object.entries(dependencyKinds).map(([kind,meta]) => `<marker id="dep-${kind}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10Z" fill="${meta.color}"/></marker>`).join('')}</defs><text x="65" y="58" font-size="35" font-weight="600" fill="#242424">Microsoft 365 : qui utilise quoi ?</text><text x="65" y="94" font-size="21" fill="#535b62">Identité, collaboration, contenus, applications et protection • FullInfra</text>${edgeMarkup}<circle cx="1000" cy="850" r="146" fill="white" stroke="#83b8dd" stroke-width="3"/><text x="1000" y="825" text-anchor="middle" font-size="37" font-weight="600" fill="#0067b8">Microsoft 365</text><text x="1000" y="867" text-anchor="middle" font-size="22" fill="#242424">20 composants • 36 relations</text><text x="1000" y="902" text-anchor="middle" font-size="18" fill="#535b62">${exportLegend ? 'Identité · Données · Accès' : 'Sélectionnez un service'}</text>${nodeMarkup}${labelMarkup}<text x="65" y="1660" font-size="22" font-weight="600" fill="#242424">Sens des flèches : A utilise B, accède à B ou agit sur B selon la fonction indiquée.</text>${Object.entries(dependencyKinds).map(([kind,meta],i) => `<g transform="translate(${65+i*380},1710)"><path d="M0 0H45" stroke="${meta.color}" stroke-width="4" ${kind === 'network' ? '' : 'stroke-dasharray="8 5"'}/><text x="56" y="6" font-size="18" fill="#242424">${xml(meta.label)}</text></g>`).join('')}<text x="65" y="1762" font-size="18" fill="#535b62">Périmètre représentatif documenté ; les dépendances varient selon les fonctions, licences et configurations.</text>${legendMarkup}</svg>`;
}
