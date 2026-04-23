const btn = document.getElementById('btn');
const result = document.getElementById('result');

btn.addEventListener('click', async () => {
  const sign = document.getElementById('sign').value;

  if (!sign) {
    alert('Please select your zodiac sign!');
    return;
  }

  result.classList.remove('hidden');
  result.innerHTML = '<p>Loading your horoscope... ✨</p>';

  try {
    const proxy = 'https://corsproxy.io/?';
    const apiUrl = `https://horoscope-app-api.vercel.app/api/v1/get-horoscope/daily?sign=${sign}&day=TODAY`;

    const response = await fetch(proxy + encodeURIComponent(apiUrl));
    const data = await response.json();

    console.log(data);

    const horoscopeText = data?.data?.horoscope_data 

      || data?.data?.horoscope
      || data?.data?.description
      || data?.horoscope 
      || data?.description
      || JSON.stringify(data?.data || data);

    const today = new Date().toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    result.innerHTML = `
      <p class="meta">📅 ${today}</p>
      <p class="meta">🔮 Sign: ${sign.charAt(0).toUpperCase() + sign.slice(1)}</p>
      <hr style="border-color: rgba(255,255,255,0.1); margin: 10px 0"/>
      <p class="horoscope-text">${horoscopeText}</p>
    `;
  } catch (error) {
    result.innerHTML = `<p>⚠️ Error: ${error.message}</p>`;
  }
});
