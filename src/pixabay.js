const axios = require('axios').default;

export async function getPhoto(q, page, perPage) {
  const BASE_URL = 'https://pixabay.com/api/';
  const params = new URLSearchParams({
    key: '40796330-ab77dcaa57b018c8ff827eca1',
    q: q,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: page,
    per_page: perPage,
  });

  const resp = await axios.get(`${BASE_URL}?${params}`);
  console.log(resp);
  return resp.data;
}
