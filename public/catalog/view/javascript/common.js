function getURLVar(key) {
	var value = [];

	var query = String(document.location).split('?');

	if (query[1]) {
		var part = query[1].split('&');

		for (i = 0; i < part.length; i++) {
			var data = part[i].split('=');

			if (data[0] && data[1]) {
				value[data[0]] = data[1];
			}
		}

		if (value[key]) {
			return value[key];
		} else {
			return '';
		}
	} else { 			// Изменения для seo_url от Русской сборки OpenCart 3x
		var query = String(document.location.pathname).split('/');
		if (query[query.length - 1] == 'cart') value['route'] = 'checkout/cart';
		if (query[query.length - 1] == 'checkout') value['route'] = 'checkout/checkout';

		if (value[key]) {
			return value[key];
		} else {
			return '';
		}
	}
}
$(document).ready(function () {
	// Highlight any found errors
	$('.text-danger').each(function () {
		var element = $(this).parent().parent();

		if (element.hasClass('form-group')) {
			element.addClass('has-error');
		}
	});

	// Currency
	$('#form-currency .currency-select').on('click', function (e) {
		e.preventDefault();

		$('#form-currency input[name=\'code\']').val($(this).attr('name'));

		$('#form-currency').submit();
	});

	// Language
	$('#form-language .language-select').on('click', function (e) {
		e.preventDefault();

		$('#form-language input[name=\'code\']').val($(this).attr('name'));

		$('#form-language').submit();
	});

	/* Search */
	$('#search input[name=\'search\']').parent().find('button').on('click', function () {
		var url = $('base').attr('href') + 'index.php?route=product/search';

		var value = $('header #search input[name=\'search\']').val();

		if (value) {
			url += '&search=' + encodeURIComponent(value);
		}

		location = url;
	});

	$('#search input[name=\'search\']').on('keydown', function (e) {
		if (e.keyCode == 13) {
			$('header #search input[name=\'search\']').parent().find('button').trigger('click');
		}
	});

	// Menu
	$('#menu .dropdown-menu').each(function () {
		var menu = $('#menu').offset();
		var dropdown = $(this).parent().offset();

		var i = (dropdown.left + $(this).outerWidth()) - (menu.left + $('#menu').outerWidth());

		if (i > 0) {
			$(this).css('margin-left', '-' + (i + 10) + 'px');
		}
	});

	// Универсальная функция переключения
	function toggleProductView(view) {
		var $productsContainer = $('#content .products');

		if (view === 'list') {
			$productsContainer.removeClass('product-grid').addClass('product-list');
			$('#list-view').addClass('active');
			$('#grid-view').removeClass('active');
			localStorage.setItem('display', 'list');
		} else {
			$productsContainer.removeClass('product-list').addClass('product-grid');
			$('#grid-view').addClass('active');
			$('#list-view').removeClass('active');
			localStorage.setItem('display', 'grid');
		}
	}

	// Product List
	$('#list-view').click(function () {
		toggleProductView('list');
	});

	// Product Grid
	$('#grid-view').click(function () {
		toggleProductView('grid');
	});

	// При загрузке страницы
	$(document).ready(function () {
		var savedDisplay = localStorage.getItem('display');
		if (savedDisplay === 'list') {
			toggleProductView('list');
		} else {
			toggleProductView('grid'); // по умолчанию сетка
		}
	});


	if (localStorage.getItem('display') == 'list') {
		$('#list-view').trigger('click');
		$('#list-view').addClass('active');
	} else {
		$('#grid-view').trigger('click');
		$('#grid-view').addClass('active');
	}

	// Checkout
	$(document).on('keydown', '#collapse-checkout-option input[name=\'email\'], #collapse-checkout-option input[name=\'password\']', function (e) {
		if (e.keyCode == 13) {
			$('#collapse-checkout-option #button-login').trigger('click');
		}
	});

	// tooltips on hover
	// $('[data-toggle=\'tooltip\']').tooltip({container: 'body'});

	// Makes tooltips work on ajax generated content
	// $(document).ajaxStop(function() {
	// $('[data-toggle=\'tooltip\']').tooltip({container: 'body'});
	// });
});

// Cart add remove functions
var cart = {
	'add': function (product_id, quantity) {
		$.ajax({
			url: 'index.php?route=checkout/cart/add',
			type: 'post',
			data: 'product_id=' + product_id + '&quantity=' + (typeof (quantity) != 'undefined' ? quantity : 1),
			dataType: 'json',
			beforeSend: function () {
				// Можно добавить индикатор загрузки на кнопку
				$('button[onclick*="cart.add(' + product_id + ')"]').prop('disabled', true).addClass('loading');
			},
			complete: function () {
				$('button[onclick*="cart.add(' + product_id + ')"]').prop('disabled', false).removeClass('loading');
			},
			success: function (json) {
				if (json['redirect']) {
					location = json['redirect'];
					return;
				}

				if (json['success']) {
					NotificationManager.show('success', json['success']);
				}

				if (json['error']) {
					NotificationManager.show('warning', json['error']);
				}

				// Обновляем корзину
				setTimeout(function () {
					$('#cart > .cart__button').html('<img src="catalog/view/theme/SplitPlus/image/site/svg/cart.svg" alt="cart"><span id="cart-total">' + json['total'] + '</span>');
				}, 100);

				// Открываем попап корзины если нужно
				if (json['success']) {
					$('#popup--cart').addClass('active');
				}

				// Обновляем мини-корзину
				$('#minicart').load('index.php?route=common/cart/info ul li');
			},
			error: function (xhr, ajaxOptions, thrownError) {
				NotificationManager.show('danger', 'Ошибка при добавлении в корзину: ' + thrownError);
				$('button[onclick*="cart.add(' + product_id + ')"]').prop('disabled', false).removeClass('loading');
			}
		});
	},

	'update': function (key, quantity) {
		$.ajax({
			url: 'index.php?route=checkout/cart/edit',
			type: 'post',
			data: 'key=' + key + '&quantity=' + (typeof (quantity) != 'undefined' ? quantity : 1),
			dataType: 'json',
			beforeSend: function () {
				// Блокируем кнопку обновления
				$('button[onclick*="cart.update(\'' + key + '\')"]').prop('disabled', true).addClass('loading');
			},
			complete: function () {
				$('button[onclick*="cart.update(\'' + key + '\')"]').prop('disabled', false).removeClass('loading');
			},
			success: function (json) {
				if (json['success']) {
					NotificationManager.show('success', json['success']);
				}

				if (json['error']) {
					NotificationManager.show('warning', json['error']);
				}

				// Обновляем корзину
				setTimeout(function () {
					$('#cart > .cart__button').html('<img src="catalog/view/theme/SplitPlus/image/site/svg/cart.svg" alt="cart"><span id="cart-total">' + json['total'] + '</span>');
				}, 100);

				// Перенаправляем или обновляем мини-корзину
				if (getURLVar('route') == 'checkout/cart' || getURLVar('route') == 'checkout/checkout') {
					location = 'index.php?route=checkout/cart';
				} else {
					$('#minicart').load('index.php?route=common/cart/info ul li');
				}
			},
			error: function (xhr, ajaxOptions, thrownError) {
				NotificationManager.show('danger', 'Ошибка при обновлении корзины: ' + thrownError);
				$('button[onclick*="cart.update(\'' + key + '\')"]').prop('disabled', false).removeClass('loading');
			}
		});
	},

	'remove': function (key) {
		$.ajax({
			url: 'index.php?route=checkout/cart/remove',
			type: 'post',
			data: 'key=' + key,
			dataType: 'json',
			beforeSend: function () {
				// Блокируем кнопку удаления
				$('button[onclick*="cart.remove(\'' + key + '\')"]').prop('disabled', true).addClass('loading');
				// Добавляем полупрозрачность удаляемому элементу
				$('tr').has('button[onclick*="cart.remove(\'' + key + '\')"]').addClass('removing');
			},
			complete: function () {
				$('button[onclick*="cart.remove(\'' + key + '\')"]').prop('disabled', false).removeClass('loading');
			},
			success: function (json) {
				if (json['success']) {
					NotificationManager.show('success', json['success']);
				}

				// Обновляем корзину
				setTimeout(function () {
					$('#cart > .cart__button').html('<img src="catalog/view/theme/SplitPlus/image/site/svg/cart.svg" alt="cart"><span id="cart-total">' + json['total'] + '</span>');
				}, 100);

				// Если на странице корзины - удаляем строку с анимацией
				if (getURLVar('route') == 'checkout/cart' || getURLVar('route') == 'checkout/checkout') {
					$('tr').has('button[onclick*="cart.remove(\'' + key + '\')"]').fadeOut(300, function () {
						$(this).remove();
						// Если корзина пуста, перезагружаем страницу
						if ($('#content table').find('tr').length <= 1) {
							location.reload();
						}
					});
				} else {
					$('#minicart').load('index.php?route=common/cart/info ul li');
				}
			},
			error: function (xhr, ajaxOptions, thrownError) {
				NotificationManager.show('danger', 'Ошибка при удалении из корзины: ' + thrownError);
				$('button[onclick*="cart.remove(\'' + key + '\')"]').prop('disabled', false).removeClass('loading');
				$('tr').has('button[onclick*="cart.remove(\'' + key + '\')"]').removeClass('removing');
			}
		});
	}
}

var voucher = {
	'add': function () {

	},
	'remove': function (key) {
		$.ajax({
			url: 'index.php?route=checkout/cart/remove',
			type: 'post',
			data: 'key=' + key,
			dataType: 'json',
			beforeSend: function () {
				$('#cart > .cart__button').button('loading');
			},
			complete: function () {
				$('#cart > .cart__button').button('reset');
			},
			success: function (json) {
				// Need to set timeout otherwise it wont update the total
				setTimeout(function () {
					$('#cart > .cart__button').html('<img src="catalog/view/theme/SplitPlus/image/site/svg/cart.svg" alt="cart"><span id="cart-total">' + json['total'] + '</span>');
				}, 100);

				if (getURLVar('route') == 'checkout/cart' || getURLVar('route') == 'checkout/checkout') {
					location = 'index.php?route=checkout/cart';
				} else {
					$('#minicart').load('index.php?route=common/cart/info ul li');
				}
			},
			error: function (xhr, ajaxOptions, thrownError) {
				alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
			}
		});
	}
}

// Менеджер уведомлений
const NotificationManager = {
	maxNotifications: 5, // Максимальное количество одновременно отображаемых уведомлений

	show: function (type, message, timeout = 5000) {
		// Проверяем количество уведомлений
		const currentCount = $('#notifications .notification-item').length;
		if (currentCount >= this.maxNotifications) {
			// Удаляем самое старое уведомление
			$('#notifications .notification-item:first-child').addClass('fade-out');
			setTimeout(() => {
				$('#notifications .notification-item:first-child').remove();
			}, 300);
		}

		// Показываем новое уведомление
		this._createNotification(type, message, timeout);
	},

	_createNotification: function (type, message, timeout) {
		// Создаем уникальный ID для уведомления
		const notificationId = 'notification-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);

		// Формируем HTML уведомления
		const notificationHtml = `
            <div id="${notificationId}" class="notification-item alert alert-${type}">
                <button type="button" class="close" onclick="NotificationManager._removeNotification('${notificationId}')">&times;</button>
                <i class="fa fa-${this._getIcon(type)}"></i> ${message}
            </div>
        `;

		// Добавляем уведомление в контейнер
		$('#notifications').append(notificationHtml);

		// Автоматически скрываем через указанное время
		if (timeout > 0) {
			setTimeout(() => {
				this._removeNotification(notificationId);
			}, timeout);
		}
	},

	_removeNotification: function (notificationId) {
		const $notification = $('#' + notificationId);

		if ($notification.length) {
			// Добавляем класс для анимации исчезновения
			$notification.addClass('fade-out');

			// Удаляем элемент после завершения анимации
			setTimeout(() => {
				$notification.remove();
			}, 300);
		}
	},

	_getIcon: function (type) {
		switch (type) {
			case 'success':
				return 'check-circle';
			case 'danger':
				return 'exclamation-circle';
			case 'warning':
				return 'exclamation-triangle';
			case 'info':
				return 'info-circle';
			default:
				return 'info-circle';
		}
	},

	clear: function () {
		$('#notifications .notification-item').each((index, element) => {
			$(element).addClass('fade-out');
			setTimeout(() => {
				$(element).remove();
			}, 300);
		});
	}
}

// Обновленный wishlist объект с использованием NotificationManager
var wishlist = {
	'add': function (product_id) {
		$.ajax({
			url: 'index.php?route=account/wishlist/add',
			type: 'post',
			data: 'product_id=' + product_id,
			dataType: 'json',
			success: function (json) {
				if (json['redirect']) {
					location = json['redirect'];
					return;
				}

				if (json['success']) {
					// Используем NotificationManager для показа уведомления
					NotificationManager.show('success', json['success']);
				}

				// Обновляем счетчик в избранном
				if (json['total']) {
					$('#wishlist-total span').html(json['total']);
					$('#wishlist-total').attr('title', json['total']);
				}
			},
			error: function (xhr, ajaxOptions, thrownError) {
				NotificationManager.show('danger', 'Ошибка: ' + thrownError);
			}
		});
	},

	'remove': function (product_id) {
		$.ajax({
			url: 'index.php?route=account/wishlist/remove',
			type: 'post',
			data: 'product_id=' + product_id,
			dataType: 'json',
			success: function (json) {
				if (json['success']) {
					NotificationManager.show('success', json['success']);
				}

				if (json['total']) {
					$('#wishlist-total span').html(json['total']);
					$('#wishlist-total').attr('title', json['total']);
				}

				// Если мы на странице списка желаний, обновляем её
				if (window.location.href.indexOf('wishlist') > -1) {
					// Можно либо перезагрузить страницу
					// location.reload();

					// Либо удалить элемент из списка (более элегантно)
					$('tr').has('a[onclick*="wishlist.remove(' + product_id + ')"]').fadeOut(300, function () {
						$(this).remove();
					});
				}
			},
			error: function (xhr, ajaxOptions, thrownError) {
				NotificationManager.show('danger', 'Ошибка: ' + thrownError);
			}
		});
	}
}

var compare = {
	'add': function (product_id) {
		$.ajax({
			url: 'index.php?route=product/compare/add',
			type: 'post',
			data: 'product_id=' + product_id,
			dataType: 'json',
			success: function (json) {
				if (json['success']) {
					NotificationManager.show('success', json['success']);
					$('#compare-total').html(json['total']);
				}

				if (json['error']) {
					NotificationManager.show('warning', json['error']);
				}
			},
			error: function (xhr, ajaxOptions, thrownError) {
				NotificationManager.show('danger', 'Ошибка: ' + thrownError);
			}
		});
	},

	'remove': function (product_id) {
		$.ajax({
			url: 'index.php?route=product/compare/remove',
			type: 'post',
			data: 'product_id=' + product_id,
			dataType: 'json',
			success: function (json) {
				if (json['success']) {
					NotificationManager.show('success', json['success']);
					$('#compare-total').html(json['total']);
				}

				// Если мы на странице сравнения, обновляем её
				if (window.location.href.indexOf('compare') > -1) {
					location.reload();
				}
			},
			error: function (xhr, ajaxOptions, thrownError) {
				NotificationManager.show('danger', 'Ошибка: ' + thrownError);
			}
		});
	}
}

/* Agree to Terms */
$(document).delegate('.agree', 'click', function (e) {
	e.preventDefault();

	$('#modal-agree').remove();

	var element = this;

	$.ajax({
		url: $(element).attr('href'),
		type: 'get',
		dataType: 'html',
		success: function (data) {
			html = '<div id="modal-agree" class="modal">';
			html += '  <div class="modal-dialog">';
			html += '    <div class="modal-content">';
			html += '      <div class="modal-header">';
			html += '        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>';
			html += '        <h4 class="modal-title">' + $(element).text() + '</h4>';
			html += '      </div>';
			html += '      <div class="modal-body">' + data + '</div>';
			html += '    </div>';
			html += '  </div>';
			html += '</div>';

			$('body').append(html);

			$('#modal-agree').modal('show');
		}
	});
});

// Autocomplete */
(function ($) {
	$.fn.autocomplete = function (option) {
		return this.each(function () {
			this.timer = null;
			this.items = new Array();

			$.extend(this, option);

			$(this).attr('autocomplete', 'off');

			// Focus
			$(this).on('focus', function () {
				this.request();
			});

			// Blur
			$(this).on('blur', function () {
				setTimeout(function (object) {
					object.hide();
				}, 200, this);
			});

			// Keydown
			$(this).on('keydown', function (event) {
				switch (event.keyCode) {
					case 27: // escape
						this.hide();
						break;
					default:
						this.request();
						break;
				}
			});

			// Click
			this.click = function (event) {
				event.preventDefault();

				value = $(event.target).parent().attr('data-value');

				if (value && this.items[value]) {
					this.select(this.items[value]);
				}
			}

			// Show
			this.show = function () {
				var pos = $(this).position();

				$(this).siblings('ul.dropdown-menu').css({
					top: pos.top + $(this).outerHeight(),
					left: pos.left
				});

				$(this).siblings('ul.dropdown-menu').show();
			}

			// Hide
			this.hide = function () {
				$(this).siblings('ul.dropdown-menu').hide();
			}

			// Request
			this.request = function () {
				clearTimeout(this.timer);

				this.timer = setTimeout(function (object) {
					object.source($(object).val(), $.proxy(object.response, object));
				}, 200, this);
			}

			// Response
			this.response = function (json) {
				html = '';

				if (json.length) {
					for (i = 0; i < json.length; i++) {
						this.items[json[i]['value']] = json[i];
					}

					for (i = 0; i < json.length; i++) {
						if (!json[i]['category']) {
							html += '<li data-value="' + json[i]['value'] + '"><a href="#">' + json[i]['label'] + '</a></li>';
						}
					}

					// Get all the ones with a categories
					var category = new Array();

					for (i = 0; i < json.length; i++) {
						if (json[i]['category']) {
							if (!category[json[i]['category']]) {
								category[json[i]['category']] = new Array();
								category[json[i]['category']]['name'] = json[i]['category'];
								category[json[i]['category']]['item'] = new Array();
							}

							category[json[i]['category']]['item'].push(json[i]);
						}
					}

					for (i in category) {
						html += '<li class="dropdown-header">' + category[i]['name'] + '</li>';

						for (j = 0; j < category[i]['item'].length; j++) {
							html += '<li data-value="' + category[i]['item'][j]['value'] + '"><a href="#">&nbsp;&nbsp;&nbsp;' + category[i]['item'][j]['label'] + '</a></li>';
						}
					}
				}

				if (html) {
					this.show();
				} else {
					this.hide();
				}

				$(this).siblings('ul.dropdown-menu').html(html);
			}

			$(this).after('<ul class="dropdown-menu"></ul>');
			$(this).siblings('ul.dropdown-menu').delegate('a', 'click', $.proxy(this.click, this));

		});
	}
})(window.jQuery);
