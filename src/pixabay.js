import axios from 'axios';
axios.defaults.baseURL = 'https://pixabay.com/api/';

export async function getPhoto(q, page, perPage) {
  try {
    const params = {
      key: '40796330-ab77dcaa57b018c8ff827eca1',
      q: q,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: page,
      per_page: perPage,
    };

    const resp = await axios.get('', { params: params });
    return resp.data;
  } catch (error) {
    console.error('Error fetching data from Pixabay API:', error);
    throw error;
  }
}
