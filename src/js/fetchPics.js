import Notiflix from 'notiflix';
import axios from 'axios';

export default class FetchApiService {
  constructor() {
    this.seachQuery = '';
    this.page = 1;
    this.perPage = 40;
  }
  async fetchImages() {
    const BASE_URL = `https://pixabay.com/api/`;
    const API_KEY = `31809670-31bfe80d896ec33e492140936`;

    const params = new URLSearchParams({
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
    });

    const response = await axios.get(
      `${BASE_URL}?key=${API_KEY}&${params}&q=${this.seachQuery}&per_page=${this.perPage}&page=${this.page}`
    );
    this.incrementPage();
    return response.data;
  }
  catch(err) {
    Notiflix.Notify.failure('err');
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.seachQuery;
  }

  set query(newQuery) {
    this.seachQuery = newQuery;
  }
}
