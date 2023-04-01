import Notiflix from 'notiflix';
const boxInputDOM = document.querySelector('.boxInput');
const inputDOM = document.querySelector('input');
const formDOM = document.querySelector('.search-form');
const btnMoreDOM = document.querySelector('.load-more');
const galeryDOM = document.querySelector('.gallery');
let wordKey;
let page;
let imageListHtml;
const limit = 4;

//-------------------------FUNCTION  fetchImages-----------------------------------

const fetchImages = async page => {
  const response = await fetch(
    `https://pixabay.com/api/?key=34775826-8245aeb15fb52e6c04f01aeda&q=${wordKey}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${limit}`
  );
  const images = await response.json();

  return images;
};

//---------------------------FUNCTION clearGallery------------------------------------------------------

const clearGallery = () => {
  imageListHtml = '';
  galeryDOM.innerHTML = imageListHtml;
};

//------------------------------FUNCTION button ON/OF----------------------------------------------------

const btnMoreOF = () => (btnMoreDOM.style.display = 'none');
const btnMoreOn = () => (btnMoreDOM.style.display = 'block');

//-----------------------------FUNCTION createMarkup-----------------------------------------------------------
const createMarkup = a => {
  imageListHtml = '';
  a.hits.forEach(a => {
    imageListHtml += `<div class="photo-card">
              <img src="${a.webformatURL}" alt="${a.tags}" loading="lazy" />
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
  return imageListHtml;
};

///------------------------------FUNCTION loadMoreViewImages-------------------------------------

const loadMoreViewImages = async () => {
  page += 1;

  const a = await fetchImages(page);
  imageListHtml = await createMarkup(a);
  galeryDOM.innerHTML += imageListHtml;
};

//------------------------------------FUNCTION viewImages------------------------------------------------------
const viewImages = async () => {
  try {
    const images = await fetchImages();

    let imageListHtml = ''; /// ???????
    const totalPages = await Math.ceil(images.total / limit);
    console.log('Obiekt obrazów', images);
    console.log('L.stron', totalPages);
    if (images.total == 0) {
      clearGallery();
      Notiflix.Notify.info(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      btnMoreOF();
      return;
    } else {
      Notiflix.Notify.success(`Hooray! We found ${images.totalHits} images.`);
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

      btnMoreOn();
    }

    galeryDOM.innerHTML = imageListHtml;
    btnMoreDOM.addEventListener('click', () => {
      page += 1;

      console.log('musze znac ilosc stron', totalPages);
      console.log('Strona', page);
      console.log('images', images);
      console.log('wszystkich stron', totalPages);
      console.log('rowne', totalPages == page);
      // -----------------Its problem

      if (page >= totalPages) {
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
        btnMoreOF();
        return;
      }

      loadMoreViewImages();
    });
  } catch (error) {
    console.log(error.message);
  }
};
//------------------------------------FUNCTION searchImages----------------------------------------------------
const searchImages = e => {
  e.preventDefault();
  wordKey = inputDOM.value.trim().split(' ').join('+');
  fetchImages(wordKey, (page = 1));
  viewImages();

  // inputMoreDOM.addEventListener('click',);  todo let page pętla
};
//-------------------------------------EVENT on input search-----------------------------------------------
formDOM.addEventListener('submit', searchImages);

const fetchJsonToJs = response => {
  if (!response.ok) {
    throw new Error(response.status);
  }
  return response.json();
};
