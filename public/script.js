const form = document.querySelector('#searchForm');
const linksSection = document.querySelector('#linksSection');

document.getElementById('moneyBtn').addEventListener('click', () => doSearch('money'));
document.getElementById('milesBtn').addEventListener('click', () => doSearch('miles'));

const iconMap = {
  'Google Flights': '🟢✈️',
  'GOL': '🟠',
  'TudoAzul': '🔵',
  'LATAM Pass': '🟣',
  'LATAM Pass (milhas)': '🟣',
  'Smiles': '🟡',
  'Decolar': '🔶',
  'Livelo': '🔷',
  'Seats.aero': '🟤'
};

function getBlockTitle(label) {
  if (['LATAM Pass', 'Smiles', 'Livelo', 'Seats.aero', 'LATAM Pass (milhas)'].includes(label)) return 'Com milhas';
  return 'Em dinheiro';
}

async function doSearch(type) {
  const formData = new FormData(form);
  const params = {};
  formData.forEach((v, k) => params[k] = v);
  params.type = type;

  const response = await fetch('/generate-links', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(params)
  });
  const data = await response.json();
  renderLinks(data.links);
}

function renderLinks(links) {
  linksSection.innerHTML = '';
  const groups = {};

  links.forEach(link => {
    const group = getBlockTitle(link.label);
    if (!groups[group]) groups[group] = [];
    groups[group].push(link);
  });

  Object.entries(groups).forEach(([title, groupLinks]) => {
    const block = document.createElement('div');
    block.className = 'link-block';
    block.innerHTML = `<h3>${title}</h3>`;
    groupLinks.forEach(l => {
      const a = document.createElement('a');
      a.href = l.url;
      a.target = '_blank';
      const icon = iconMap[l.label] || '🔗';
      a.textContent = `${icon} ${l.label}`;
      block.appendChild(a);
    });
    linksSection.appendChild(block);
  });
}