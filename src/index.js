import axios, { isCancel, AxiosError } from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
//-------------------------------DOM----------------------------------------
const searchFormDOM = document.querySelector('.search-form');
const inputSearchDOM = document.querySelector("[name='searchQuery']");
const galleryDOM = document.querySelector(".gallery");
const btnMoreDOM = document.querySelector(".load-more")
//--------------------------------GLOBAL VARIABLES--------------------------
const PIXABAY_URL = 'https://pixabay.com/api/';
const PIXABAY_KEY = '34775826-8245aeb15fb52e6c04f01aeda';
const IMG_PER_PAGE = 40;

let wordKey;
let page;
let lightbox = new SimpleLightbox('.gallery a');

//-------------------------------FUNCTIONS----------------------------------
const searchImages = e => {
  e.preventDefault();
  wordKey = inputSearchDOM.value.trim().split(' ').join('+');
  if (wordKey === null || wordKey === '') {
    Notiflix.Notify.info('Please type something in the search input.');
    return;
  }
  page = 1;
  fetchImages(wordKey, page);
  viewImages();
};

const fetchImages = async () => {
  let params = new URLSearchParams({
    key: PIXABAY_KEY,
    q: wordKey,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: IMG_PER_PAGE,
  });

  const response = await axios.get(`${PIXABAY_URL}?${params}&page=${page}`);
  const images = response.data;
  return images;
};

const viewImages = async () => {
  let imageListHtml = "";
  try {
    const images = await fetchImages();
    console.log(images);
    if (images.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    Notiflix.Notify.success(`Hooray! We found ${images.totalHits} images.`);
    // Here end...
    
    console.log(images.hits);
    imageListHtml = images.hits
      .map(image => {
        return `
        <div class="photo-card">
          <a href="${image.largeImageURL}">
            <img class="img" src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
          </a>
          <div class="info">
            <p class="info-item">
              <b>Likes</b>
              ${image.likes}
            </p>
            <p class="info-item">
              <b>Views</b>
              ${image.views}
            </p>
            <p class="info-item">
              <b>Comments</b>
              ${image.comments}
            </p>
            <p class="info-item">
              <b>Downloads</b>
              ${image.downloads}
            </p>
          </div>
        </div>
      `;
      })
      .join('');
      galleryDOM.innerHTML = imageListHtml;
      lightbox.refresh();
    btnMoreOn();
  } catch (error) {
    console.log(error.message);
  }
};

const viewNextImages = async () => {
  let imageListHtml = '';
  try {
    const nextImages = await fetchImages();
    console.log(nextImages);
    if (nextImages.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    
    

    console.log(nextImages.hits);
    imageListHtml = nextImages.hits
      .map(image => {
        return `
        <div class="photo-card">
          <a href="${image.largeImageURL}">
            <img class="img" src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
          </a>
          <div class="info">
            <p class="info-item">
              <b>Likes</b>
              ${image.likes}
            </p>
            <p class="info-item">
              <b>Views</b>
              ${image.views}
            </p>
            <p class="info-item">
              <b>Comments</b>
              ${image.comments}
            </p>
            <p class="info-item">
              <b>Downloads</b>
              ${image.downloads}
            </p>
          </div>
        </div>
      `;
      })
      .join('');
      galleryDOM.insertAdjacentHTML('beforeend', imageListHtml);
      lightbox.refresh();
    
  } catch (error) {
    console.log(error.message);
  }
};
const loadMoreImages = async () => {
 console.log(page);
  try {
    
    const images = await fetchImages();

  
    const totalImages = images.totalHits;
    console.log("Wszystkich obrazów:", totalImages);
    const totalPages = Math.ceil(totalImages / IMG_PER_PAGE);
    console.log("Wszystkich stron", totalPages);
    if (page === totalPages) {
      btnMoreOf();
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
      return;
    }
    page++;
    console.log(page);
    const nextImage = await fetchImages();
    console.log("ret", nextImage);
    viewNextImages();
    // fetchImages(wordKey, page);
    // viewImages();
  } catch (error) {
    console.log(error.message);
  }
}
const btnMoreOn = () => (btnMoreDOM.style.display = 'block');
const btnMoreOf = () => (btnMoreDOM.style.display = 'none');
//--------------------------------LISTNER ON SUBMIT---------------------------
btnMoreDOM.addEventListener("click", loadMoreImages)
searchFormDOM.addEventListener('submit', searchImages);
