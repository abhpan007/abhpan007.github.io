(function(){
<h3>${r.name}</h3>
<p>${desc}</p>
<div class="meta">
${lang}
<span>${stars}</span>
<span>Updated ${relTime(r.updated_at)}</span>
</div>
<div style="margin-top:10px; display:flex; gap:6px; flex-wrap:wrap">${topics}</div>
</a>
`);
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
