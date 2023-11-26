import { getPhoto } from './pixabay.js';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const formEl = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

const perPage = 40;
let page = 1;
let searchPhoto = '';

let lightbox = new SimpleLightbox('.img-container a', { captionDelay: 250 });

loadMoreBtn.style.visibility = 'hidden';
formEl.addEventListener('submit', handlerFormSubmit);

function handlerFormSubmit(evt) {
  evt.preventDefault();

  galleryEl.innerHTML = '';
  page = 1;

  const { searchQuery } = evt.currentTarget.elements;
  searchPhoto = searchQuery.value.trim().toLowerCase().split(' ').join('+');
  getPhoto(searchPhoto, page, perPage)
    .then(data => {
      const results = data.hits;
      if (data.totalHits === 0) {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        Notify.info(`Hooray! We found ${data.totalHits} images.`);
        createMarkup(results);
        lightbox.refresh();
      }
      if (data.totalHits > perPage) {
        loadMoreBtn.style.visibility = 'visible';
      }
      smoothScroll();
    })
    .catch(err => console.log(err));
  loadMoreBtn.addEventListener('click', onLoadMore);
  evt.currentTarget.reset();
}

function onLoadMore() {
  page += 1;
  getPhoto(searchPhoto, page, perPage)
    .then(data => {
      const results = data.hits;
      const numberPage = Math.ceil(data.totalHits / perPage);
      createMarkup(results);

      if (page === numberPage) {
        loadMoreBtn.style.visibility = 'hidden';
        Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
        loadMoreBtn.removeEventListener('click', onLoadMore);
      }
      lightbox.refresh();
      smoothScroll();
    })
    .catch(err => console.log(err));
}

function createMarkup(searchAnswer) {
  const createGallery = searchAnswer.map(
    ({
      webformatURL,
      largeImageURL,
      tags,
      likes,
      views,
      comments,
      downloads,
    }) => {
      return `<div class="photo-card">
    <div class = "img-container"><a class="img_link" href="${largeImageURL}">
    <img src="${webformatURL}" alt="${tags}" loading="lazy"  width="300"/></a></div>
    <div class="info">
      <p class="info-item">
        <b>Likes: </b>${likes}
      </p>
      <p class="info-item">
        <b>Views: </b>${views}
      </p>
      <p class="info-item">
        <b>Comments: </b>${comments}
      </p>
      <p class="info-item">
        <b>Downloads: </b>${downloads}
      </p>
    </div>
  </div>`;
    }
  );
  galleryEl.insertAdjacentHTML('beforeend', createGallery.join(''));
}

function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
