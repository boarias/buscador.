const express = require('express');
const path = require('path');
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

function formatDateDMY(d) {
  const [yyyy, mm, dd] = d.split("-");
  return `${dd}-${mm}-${yyyy}`;
}

function formatDateAzul(d) {
  const [yyyy, mm, dd] = d.split("-");
  return `${dd}/${mm}/${yyyy}`;
}

app.post('/generate-links', (req, res) => {
  const { origin, destination, departDate, returnDate, adults, children, infants, type } = req.body;

  const links = [];

  if (type === 'money') {
    const googleDate = formatDateDMY(departDate);
    const azulDate = formatDateAzul(departDate);
    const smilesTimestamp = new Date(`${departDate}T00:00:00`).getTime();

    links.push({ label: 'Google Flights', url: `https://www.google.com/travel/flights?q=Voos+de+${origin}+para+${destination}+em+${googleDate}` });
    links.push({ label: 'GOL', url: `https://b2c.voegol.com.br/compra/busca-parceiros?pv=br&tipo=DF&de=${origin}&para=${destination}&ida=${googleDate}&ADT=${adults}&CHD=${children}&INF=${infants}` });
    links.push({ label: 'TudoAzul', url: `https://www.voeazul.com.br/br/pt/home/selecao-voo?c[0].ds=${origin}&c[0].std=${azulDate}&c[0].as=${destination}&p[0].t=ADT&p[0].c=${adults}` });
    links.push({ label: 'Decolar', url: `https://www.decolar.com/shop/flights/results/oneway/${origin}/${destination}/${departDate}/${adults}/${children}/${infants}` });
  }

  if (type === 'miles') {
    const smilesTimestamp = new Date(`${departDate}T00:00:00`).getTime();
    const outboundISO = `${departDate}T15:00:00.000Z`;
    const tripType = returnDate ? 'RT' : 'OW';
    const inbound = returnDate ? `${returnDate}T15:00:00.000Z` : 'null';

    links.push({ label: 'LATAM Pass', url: `https://www.latamairlines.com/br/pt/oferta-voos?origin=${origin}&inbound=${inbound}&outbound=${outboundISO}&destination=${destination}&adt=${adults}&chd=${children}&inf=${infants}&trip=${tripType}&cabin=Economy&redemption=true&sort=PRICE%2Casc` });
    links.push({ label: 'Smiles', url: `https://www.smiles.com.br/mfe/emissao-passagem/?adults=${adults}&children=${children}&infants=${infants}&departureDate=${smilesTimestamp}&returnDate=000&originAirport=${origin}&destinationAirport=${destination}&tripType=2&novo-resultado-voos=true` });
    links.push({ label: 'Livelo', url: `https://www.livelo.com.br/busca?termo=${origin}%20${destination}` });
    links.push({ label: 'Seats.aero', url: `https://seats.aero` });
  }

  res.json({ links });
});

app.listen(3000, () => console.log('Backend rodando em http://localhost:3000'));