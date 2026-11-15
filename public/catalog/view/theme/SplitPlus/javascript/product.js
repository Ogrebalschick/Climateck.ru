$('.product-order__delivery-item-text').hide()
$('.product-order__delivery-item-title').click(function () {
    $(this).siblings('.product-order__delivery-item-text').slideToggle(2000);
})
setTimeout(() => {
    $('.product__tabs-all .product__tab-name:first-child()').click()
}, 1000)
$('.product__tab-content').hide()
$('.product__tab-content.active').show()
$('.product__tab-name').click(function () {
    let dataProductTabClicked = $(this).data('product-tab');
    $('.product__tab-name').removeClass('active')
    $(this).addClass('active')
    $('.product__tab-content').removeClass('active')
    $('.product__tab-content').slideUp(500)
    $(`.product__tab-content[data-product-tab='${dataProductTabClicked}']`).addClass('active')
    $(`.product__tab-content[data-product-tab='${dataProductTabClicked}']`).slideDown(500)
})

if (window.innerWidth < 768) {
    $(document).ready(function () {
        $('.product__tab-name').each(function () {
            const tabId = $(this).data('product-tab');

            const content = $('.product__tab-content[data-product-tab="' + tabId + '"]');

            // Перемещаем контент сразу после вкладки
            $(this).after(content);
        });
    });
} else {
    // Выполняем код для больших экранов
    console.log('Экран больше или равен 768px');
}

 const mainImageContainer = document.getElementById('product-images-main');
    const mainImage = mainImageContainer.querySelector('img');
    
    mainImageContainer.addEventListener('mousemove', function(e) {
        if (!mainImageContainer.classList.contains('zoomed')) return;
        
        const rect = mainImageContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const percentX = (x / rect.width) * 100;
        const percentY = (y / rect.height) * 100;
        
        mainImage.style.transformOrigin = percentX + '% ' + percentY + '%';
    });
    
    mainImageContainer.addEventListener('mouseenter', function() {
        mainImageContainer.classList.add('zoomed');
    });
    
    mainImageContainer.addEventListener('mouseleave', function() {
        mainImageContainer.classList.remove('zoomed');
        mainImage.style.transformOrigin = 'center';
    });

    document.querySelectorAll('.product-images__subitem').forEach(item => {
        item.addEventListener('mouseover', function() {
            const subImage = this.querySelector('img');
            mainImage.src = subImage.src;
            mainImage.alt = subImage.alt;
            mainImageContainer.classList.remove('zoomed');
        });
    });