import axios from 'axios';

const API_KEY = import.meta.env.VITE_GOOGLE_SEARCH_API_KEY;
const CX = import.meta.env.VITE_GOOGLE_CX_API_KEY;

export async function googleSearch(query, options = {}) {
  const url = 'https://www.googleapis.com/customsearch/v1';
  
  // Parámetros por defecto optimizados para relevancia
  const defaultParams = {
    key: API_KEY,
    cx: CX,
    q: query,
    gl: 'cl', // País Chile
    //num: 10, // Número de resultados
    safe: 'active', // Filtro de contenido seguro
    dateRestrict: 'm1', // Restringir a último mes para mayor relevancia
    // sort: 'relevance', // Ordenar por relevancia
    // Configuración geográfica menos restrictiva


   // rights: 'cc_publicdomain|cc_attribute|cc_sharealike|cc_noncommercial|cc_nonderived', // Contenido con licencias abiertas
  };

  // Combinar parámetros por defecto con opciones personalizadas
  const params = { ...defaultParams, ...options };

  try {
    const res = await axios.get(url, { params });
    
    // Validar que la respuesta tenga datos
    if (!res.data || !res.data.items) {
      console.warn('No se encontraron resultados para:', query);
      return [];
    }

    // Mapear resultados con información adicional
    return res.data.items.map(item => ({
      title: item.title,
      link: item.link,
      snippet: item.snippet,
      displayLink: item.displayLink,
      // Agregar metadatos útiles si están disponibles
      ...(item.pagemap && {
        metatags: item.pagemap.metatags?.[0],
        cse_image: item.pagemap.cse_image?.[0],
      })
    }));

  } catch (err) {
    console.error('Error en búsqueda de Google:', {
      query,
      error: err.response?.data || err.message,
      status: err.response?.status
    });
    
    // Manejo específico de errores comunes
    if (err.response?.status === 403) {
      console.error('Error de API: Verifica tu API_KEY y CX');
    } else if (err.response?.status === 429) {
      console.error('Error: Límite de cuota excedido');
    }
    
    return [];
  }
}
// Función auxiliar para búsquedas más específicas
export async function googleSearchWithFilters(query, filters = {}) {
  const searchOptions = {
    // Filtros adicionales para mayor relevancia
    ...filters,
    // Si no se especifica dateRestrict, usar el último mes
    dateRestrict: filters.dateRestrict || 'm1',
    // Aumentar número de resultados si se necesita
    num: filters.num || 10,
  };

  return googleSearch(query, searchOptions);
}

// Función para búsquedas de noticias recientes
export async function googleNewsSearch(query) {
  return googleSearch(query, {
    dateRestrict: 'd7', // Últimos 7 días
    sort: 'date', // Ordenar por fecha
    num: 20, // Más resultados para noticias
  });
}

