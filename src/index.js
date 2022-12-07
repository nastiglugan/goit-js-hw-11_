import './css/styles.css';
import Notiflix from 'notiflix';
import FetchApiService from './js/fetchPics';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

const fetchApiService = new FetchApiService();

let imgShowed = 0;
loadMoreBtn.style.display = 'none';

form.addEventListener('submit', onSubmit);
loadMoreBtn.addEventListener('click', onLoadMore);

function onSubmit(e) {
  e.preventDefault();

  gallery.innerHTML = '';

  imgShowed = 0;

  fetchApiService.resetPage();

  fetchApiService.query = e.currentTarget.elements.searchQuery.value.trim();

  if (!fetchApiService.query) {
    Notiflix.Notify.info('Empty request, please type not only spaces');
    return;
  }

  fetchImages();
}

async function fetchImages() {
  try {
    const { hits, totalHits } = await fetchApiService.fetchImages();

    if (!hits.length) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    createMarkUpPics(hits);

    imgShowed += hits.length;
    console.log(imgShowed);
    console.log(totalHits);

    if (imgShowed < totalHits) {
      Notiflix.Notify.success(`Hooray! We found ${imgShowed} images.`);
    }

    loadMoreBtn.style.display = 'block';

    if (imgShowed >= totalHits) {
      loadMoreBtn.style.display = 'none';
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }
  } catch (error) {
    Notiflix.Notify.failure(`${error}`);
  }
}

function onLoadMore(e) {
  fetchImages();
}

function createMarkUpPics(arr) {
  const markup = arr
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card"><a href="${largeImageURL}">
  <img src="${webformatURL}" alt="${tags}" loading="lazy"/></a>
  <div class="info">
    <p class="info-item">
      <b>Likes ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads ${downloads}</b>
    </p>
  </div>
</div>`;
      }
    )
    .join(' ');

  gallery.insertAdjacentHTML('beforeend', markup);
}
