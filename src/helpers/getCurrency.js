import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://api.monobank.ua/bank/currency',
});

const FALLBACK_CURRENCY_DATA = {
  date: Date.now(),
  usd: { buy: '36.65', sell: '37.44' },
  eur: { buy: '39.40', sell: '40.40' },
};

const fetchCurrency = async () => {
  try {
    const { data } = await instance.get();
    return data;
  } catch (error) {
    if (error.response?.status === 429) {
      console.log('Rate limit exceeded, using cached or fallback data');
      return null;
    }
    throw error;
  }
};

export const getCurrency = async () => {
  const cachedCurrency = JSON.parse(localStorage.getItem('currency'));
  const now = Date.now();

  // Folosește cache-ul dacă există și are mai puțin de o oră
  if (cachedCurrency && now - cachedCurrency.date < 3600000) {
    return cachedCurrency;
  }

  try {
    const data = await fetchCurrency();

    // Dacă avem rate limiting, folosim cache-ul vechi sau fallback data
    if (!data) {
      return cachedCurrency || FALLBACK_CURRENCY_DATA;
    }

    const usd = data.find(
      item => item.currencyCodeA === 840 && item.currencyCodeB === 980
    );
    const eur = data.find(
      item => item.currencyCodeA === 978 && item.currencyCodeB === 980
    );

    // Verificăm dacă am găsit ratele pentru ambele valute
    if (!usd || !eur) {
      return cachedCurrency || FALLBACK_CURRENCY_DATA;
    }

    const currencyData = {
      date: now,
      usd: { buy: usd.rateBuy.toFixed(2), sell: usd.rateSell.toFixed(2) },
      eur: { buy: eur.rateBuy.toFixed(2), sell: eur.rateSell.toFixed(2) },
    };

    localStorage.setItem('currency', JSON.stringify(currencyData));
    return currencyData;
  } catch (err) {
    console.error('Currency fetch error:', err);
    // În caz de eroare, returnăm datele din cache sau fallback
    return cachedCurrency || FALLBACK_CURRENCY_DATA;
  }
};
