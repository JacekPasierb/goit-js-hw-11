import Notiflix from 'notiflix';
const boxInput = document.querySelector('.boxInput');
const input = document.querySelector('input');
const form = document.querySelector('.search-form');

const searchImages = e => {
    e.preventDefault();
     let imageListHtml = '';
  let wordKey = input.value.trim().split(' ').join('+');

  fetch(
    `https://pixabay.com/api/?key=34775826-8245aeb15fb52e6c04f01aeda&q=${wordKey}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40`
  )
    .then(fetchJsonToJs)
    .then(data => {
      console.log('data', data); // data handling
        
      if (data.total == 0) {
        Notiflix.Notify.info(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        // console.log('1', data);
       
        data.hits.forEach(e => {
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
        //   console.log('2', imageListHtml);
         
        //   console.log('3', galery);
          
        }
         const galery = document.querySelector('.gallery');
      galery.innerHTML = imageListHtml;
    })
    .catch(error => {
      console.log(error); // Error handling
    });
};

form.addEventListener('submit', searchImages);

const fetchJsonToJs = response => {
  if (!response.ok) {
    throw new Error(response.status);
  }
  return response.json();
};
