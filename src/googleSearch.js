import axios from 'axios';


const API_KEY = import.meta.env.VITE_GOOGLE_SEARCH_API_KEY;
const CX = import.meta.env.VITE_GOOGLE_CX_API_KEY;

export async function googleSearch(query) {
  const url = 'https://www.googleapis.com/customsearch/v1';
  const params = {
    key: API_KEY,
    cx: CX,
    q: query,
    gl: 'cl',
    lr: 'lang_es',
    // dateRestrict: 'm1',
    // sort: 'relevance',
    // num: 10,
  };
  try {
    const res = await axios.get(url, { params });
    return res.data.items.map(item => ({
      title: item.title,
      link: item.link,
      snippet: item.snippet
    }));
  } catch (err) {
    console.error('Error en búsqueda:', err.response?.data || err.message);
    return [];
  }
}
