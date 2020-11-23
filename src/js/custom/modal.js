let btn = document.querySelectorAll('.offer-btn'),
    overlay = document.querySelector('.overlay'),
    modal = document.querySelector('.modal'),
    close = document.querySelector('.close');

btn.forEach(elem => {
    elem.addEventListener('click', openModal);
});

overlay.addEventListener('click', closeModal);

function openModal() {
    overlay.classList.add('show');
    modal.classList.add('show-modal') //анимация
}

function closeModal(e) {
    if (e.target == close || e.target == overlay) {
        overlay.classList.remove('show');
        modal.classList.remove('show-modal') //анимация
    }
}