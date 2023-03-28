const boxInput = document.querySelector('.boxInput');
const input = document.querySelector('input');
const form = document.querySelector('.search-form');

const searchImages = e => {
  e.preventDefault();
  let wordKey = input.value.trim().split(' ').join('+');

  fetch(
    `https://pixabay.com/api/?key=34775826-8245aeb15fb52e6c04f01aeda&q=${wordKey}&image_type=photo&orientation=horizontal&safesearch=true`
  )
    .then(fetchJsonToJs)
    .then(data => {
      console.log('data', data); // data handling
    })
    .catch(error => {
      // Error handling
    });
};

form.addEventListener('submit', searchImages);

const fetchJsonToJs = response => {
  if (!response.ok) {
    throw new Error(response.status);
  }
  return response.json();
};
