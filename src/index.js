import Notiflix from 'notiflix';
const boxInputDOM = document.querySelector('.boxInput');
const inputDOM = document.querySelector('input');
const formDOM = document.querySelector('.search-form');
const inputMoreDOM = document.querySelector('.load-more');

let wordKey;
const limit = 40;

const fetchImages = async () => {
  const response = await fetch(
    `https://pixabay.com/api/?key=34775826-8245aeb15fb52e6c04f01aeda&q=${wordKey}&image_type=photo&orientation=horizontal&safesearch=true&page=2&per_page=40`
  );
  const images = await response.json();

  return images;
};
const viewImages = async () => {
  try {
    const images = await fetchImages();
    console.log('images', images);
    //todo create image for users
    let imageListHtml = '';
    const totalPages = images.total / limit;
    console.log(totalPages);

    if (images.total == 0) {
      Notiflix.Notify.info(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      images.hits.forEach(e => {
        imageListHtml += `<div class="photo-card">
              <img src="${e.webformatURL}" alt="${e.tags}" loading="lazy" />
              <div class="info">
                <p class="info-item">
                  <b>Likes</b>
                </p>
                <p class="info-item">
                  <b>Views</b>
                </p>
                <p class="info-item">
                  <b>Comments</b>
                </p>
                <p class="info-item">
                  <b>Downloads</b>
                </p>
              </div>
            </div>`;
      });
    }
    const galery = document.querySelector('.gallery');
    galery.innerHTML = imageListHtml;
  } catch (error) {
    console.log(error.message);
  }
};

const searchImages = e => {
  e.preventDefault();
  let imageListHtml = '';
  wordKey = inputDOM.value.trim().split(' ').join('+');
  let page = 1;

  fetchImages(wordKey);

  viewImages();
  inputMoreDOM.style.display = 'block';
  // inputMoreDOM.addEventListener('click',);  todo let page pętla
};

formDOM.addEventListener('submit', searchImages);

const fetchJsonToJs = response => {
  if (!response.ok) {
    throw new Error(response.status);
  }
  return response.json();
};
