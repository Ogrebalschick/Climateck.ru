
$('.header__catalog-button').click(function () {
    $(this).toggleClass('active');
    $(this).find('.burger').toggleClass('active');
    $('.header__catalog-list').toggleClass('active')
});

if (window.innerWidth < 620) {
    $('.menu__list').slideToggle()
    $('.menu__item-parent').click(function () {
        $(this).siblings('.menu__list').slideToggle()
    })
}



document.querySelectorAll('.image-slider').forEach(slider => {

    const images = slider.querySelectorAll('img');
    const bars = slider.querySelectorAll('.slider-bars span');
    const count = images.length;

    slider.addEventListener('mousemove', e => {

        const rect = slider.getBoundingClientRect();
        const x = e.clientX - rect.left;

        const part = Math.floor((x / rect.width) * count);

        images.forEach(img => img.classList.remove('active'));
        bars.forEach(bar => bar.classList.remove('active'));

        if (images[part]) {
            images[part].classList.add('active');
            bars[part].classList.add('active');
        }

    });

    slider.addEventListener('mouseleave', () => {

        images.forEach(img => img.classList.remove('active'));
        bars.forEach(bar => bar.classList.remove('active'));

        images[0].classList.add('active');
        bars[0].classList.add('active');

    });

});