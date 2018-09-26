function remove_loader() {
  let body = document.querySelector('body');
  body.classList.remove('is__loading');
}

window.addEventListener('load', remove_loader );
