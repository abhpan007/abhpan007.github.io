(function(){
var CFG = window.SITE_CFG || {};
var USER = CFG.username || 'abhpan007';

function el(html){
  var wrap = document.createElement('div');
  wrap.innerHTML = html.trim();
  return wrap.firstChild;
}

function relTime(str){
  if(!str) return '';
  var d = new Date(str);
  var now = new Date();
  var months = (now.getFullYear()-d.getFullYear())*12 + (now.getMonth()-d.getMonth());
  if(months < 1) return 'Recently';
  if(months < 12) return months + ' mo ago';
  var y = Math.floor(months/12);
  return y + ' year' + (y>1?'s':'') + ' ago';
}

function repoCard(r){
  var desc = (r.description || '').slice(0, 120);
  if((r.description||'').length > 120) desc += '…';
  var lang = r.language ? '<span class="lang">' + r.language + '</span>' : '';
  var stars = r.stargazers_count ? '★ ' + r.stargazers_count : '';
  var topics = (r.topics || []).slice(0, 5).map(function(t){ return '<span class="badge">' + t + '</span>'; }).join('');
  return el('<a class="card" href="' + (r.html_url || '#') + '" target="_blank" rel="noopener">' +
'<h3>'+ (r.name||'') +'</h3>' +
'<p>'+ (desc||'') +'</p>' +
'<div class="meta">' + lang + '<span>'+ stars +'</span><span>Updated '+ relTime(r.updated_at) +'</span></div>' +
'<div style="margin-top:10px; display:flex; gap:6px; flex-wrap:wrap">'+ topics +'</div></a>');
}


async function fetchRepos(){
const url = `https://api.github.com/users/${USER}/repos?per_page=100&sort=updated`;
const res = await fetch(url, { headers: { 'Accept': 'application/vnd.github+json' }});
if(!res.ok) throw new Error('GitHub API error');
return await res.json();
}


function filterRepos(repos, opts){
const pagesRepo = `${USER}.github.io`;
return repos.filter(r=>{
if(opts?.hide?.forks && r.fork) return false;
if(opts?.hide?.archived && r.archived) return false;
if(opts?.hide?.pagesRepo && r.name === pagesRepo) return false;
return true;
});
}


function attachSearch(inputId, list, render){
const input = document.getElementById(inputId);
if(!input) return;
input.addEventListener('input', ()=>{
const q = input.value.toLowerCase().trim();
const filtered = q ? list.filter(r=>
(r.name && r.name.toLowerCase().includes(q)) ||
(r.description && r.description.toLowerCase().includes(q)) ||
(r.topics||[]).some(t=>t.toLowerCase().includes(q))
) : list;
render(filtered);
});
}


async function renderFeatured(gridId){
const grid = document.getElementById(gridId);
if(!grid) return;
try{
const repos = await fetchRepos();
const featured = (CFG.featured||[]).map(name=>repos.find(r=>r.name===name)).filter(Boolean);
const list = featured.length ? featured : repos.slice(0,6);
list.forEach(r=>grid.appendChild(repoCard(r)));
}catch(e){ grid.appendChild(el(`<div class="empty">Couldn't load projects right now.</div>`)); }
}


async function loadAndRenderRepos(opts){
const grid = document.getElementById(opts.gridId);
const empty = document.getElementById(opts.emptyId);
try{
let repos = await fetchRepos();
repos = filterRepos(repos, opts);
const render = (list)=>{
grid.innerHTML='';
empty.hidden = list.length>0;
list.forEach(r=>grid.appendChild(repoCard(r)));
};
render(repos);
attachSearch(opts.searchId, repos, render);
}catch(e){
grid.innerHTML = `<div class="empty">Error loading repositories.</div>`;
}
}


// expose minimal API
window.renderFeatured = renderFeatured;
window.loadAndRenderRepos = loadAndRenderRepos;
})();
