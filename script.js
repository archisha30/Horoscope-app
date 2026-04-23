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
    const response = await fetch(
      `https://horoscope-app-api.vercel.app/api/v1/get-horoscope/daily?sign=${sign}&day=today`
    );
    const data = await response.json();
    const info = data.data;

    result.innerHTML = `
      <p class="meta">📅 Date: ${info.date}</p>
      <p class="meta">🔮 Sign: ${sign.charAt(0).toUpperCase() + sign.slice(1)}</p>
      <hr style="border-color: rgba(255,255,255,0.1); margin: 10px 0"/>
      <p class="horoscope-text">${info.horoscope_data}</p>
    `;
  } catch (error) {
    result.innerHTML = '<p>Something went wrong. Try again!</p>';
  }
});