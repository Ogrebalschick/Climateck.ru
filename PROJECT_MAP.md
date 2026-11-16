# PROJECT_MAP — Cimateck (OpenCart 3)

Справочник кастомной части витрины. Стандартные файлы движка здесь не перечисляются: если шаблона нет в теме `SplitPlus`, OpenCart берёт его из `public/catalog/view/theme/default/`.

Документ-корень сайта: `public/`. Локальный адрес: `http://climateck.local/`. База `climateck`, префикс таблиц `oc_`.

Целевая структура страниц — `SITE_ARCHITECTURE.md`. Стандарт оформления — `DESIGN_SYSTEM.md`. Текущая вёрстка SplitPlus этим документам ещё не приведена.

Статический макет главной, шапки, подвала и карточки товара: `_mockup/` (`index.html`, `css/tokens.css`, `css/components.css`, `css/home.css`, `js/mockup.js`). Папка в `.gitignore`, в тему OpenCart не подключена. Открывать как файл или через локальный сервер из корня проекта: `/_mockup/index.html`.

## Общая информация

| | |
| --- | --- |
| Движок | OpenCart **3.0.3.8** (`public/index.php`, константа `VERSION`). Русская сборка: `tweak.ocmod.xml`, `tweak-54fz.ocmod.xml` |
| Магазин | **Cimateck**, язык витрины `ru-ru` |
| Активная тема | **SplitPlus** (`oc_setting.config_theme`). Каталог темы включён: `theme_SplitPlus_status = 1`, `theme_SplitPlus_directory = SplitPlus` |
| Запасная тема | `default` — полный набор шаблонов движка (~131 `.twig`). В `SplitPlus` переопределены только файлы из списка ниже |

### Пути темы SplitPlus

Корень: `public/catalog/view/theme/SplitPlus/`

| Что | Путь | Как подключается |
| --- | --- | --- |
| Шаблоны | `template/**/*.twig` | Контроллеры через `$this->load->view(...)`. При отсутствии файла — fallback в `default` |
| Стили (исходники) | `stylesheet/style.scss`, `stylesheet/product.scss` | Правки вносить в `.scss`, затем компилировать в соседний `.css` |
| Стили (на сайте) | `stylesheet/style.css`, `stylesheet/product.css` | Жёстко в `<head>` шапки: `template/common/header.twig` |
| Стили, не используемые шапкой | `stylesheet/style.min.css` (старый минифицированный снимок), `stylesheet/stylesheet.css` (пустой файл) | На витрину не подключены |
| Скрипты темы | `javascript/script.js`, `javascript/product.js` | Подключаются в конце `template/common/footer.twig` |
| Общие скрипты движка | `public/catalog/view/javascript/jquery/jquery-2.1.1.min.js`, `bootstrap`, `common.js` | Тоже из `header.twig` |
| Шрифт | `fonts/` (Suisse Intl) | `@font-face` в `style.scss` |
| Картинки темы | `image/` (иконки соцсетей, корзины, сравнения, избранного) | Прямые пути в шаблонах шапки и корзины |

Кэш модификаторов (то, что реально исполняется после «Обновить модификаторы»): `public/system/storage/modification/`. Исходники править в `public/catalog` и `public/system/*.ocmod.xml`, не в кэше.

## Карта ключевых разделов сайта

Главная (`common/home`) сама почти пустая: `template/common/home.twig` выводит шапку, `{{ content_top }}`, `{{ content_bottom }}` и подвал. Блоки главной задаются макетом **«Главная / Home»** (`oc_layout.layout_id = 1`, маршрут `common/home`), позиция `content_top`, порядок сверху вниз.

| Элемент интерфейса | Шаблон (.twig) | Контроллер (.php) | Модель / стили / данные |
| --- | --- | --- | --- |
| Каркас страницы, `<head>`, логотип CLIMATECK, телефон, соцсети, сравнение, избранное | `SplitPlus/template/common/header.twig` | `catalog/controller/common/header.php` | Счётчики корзины / избранного / сравнения считаются в контроллере. Стили: `style.css` |
| Верхнее меню (О компании, Услуги, Доставка и оплата, Акции, Вопрос-ответ, Контакты) | HTML собирает `catalog/controller/extension/ctmenu_tpl/list.php` | `catalog/controller/extension/ctmenu.php` → `header.php` вызывает `ctmenu` с `id = 1` | Модель `catalog/model/extension/ctmenu.php`. Пункты в `oc_ctmenu` / `oc_ctmenu_link` / `oc_ctmenu_link_description`, меню «Меню в шапке» |
| Кнопка «Каталог» и мегаменю категорий (3 уровня) | `SplitPlus/template/common/menu.twig` (варианты `menu-v1.twig`, `menu--old.twig` на сайт не выводятся) | `catalog/controller/common/menu.php` | Модель `catalog/model/catalog/category.php`. Берутся корневые категории с `top = 1`. Мобильная копия верхнего меню: `ctmenu` `id = 1`, шаблон `ctmenu_tpl/header__menu--mobile.php`. Логика открытия: inline-script в `menu.twig` и `javascript/script.js` |
| Поиск в шапке | `SplitPlus/template/common/search.twig` | `catalog/controller/common/search.php` | Модуль `live_search` установлен в `oc_extension`, но в шаблон поиска темы не подключён |
| Мини-корзина (попап) | `SplitPlus/template/common/cart.twig` | `catalog/controller/common/cart.php` | Иконка `image/site/svg/cart.svg` |
| Попап «Обратный звонок» и попап «Заявка оставлена» | Разметка и JS в `SplitPlus/template/common/footer.twig` | Отправка: `catalog/controller/common/header.php` → `send_form()` (`index.php?route=common/header/send_form`) | Письмо на `config_email`, тема «Заявка с сайта climateck.ru». Кнопка в шапке: `.btn--popup` / `data-popup="popup--callback"` |
| Подвал: колонка «Каталог», колонки меню, контакты | `SplitPlus/template/common/footer.twig` | `catalog/controller/common/footer.php` | Каталог — корневые категории (`model catalog/category`). Колонки «Услуги» и «Информация» — `ctmenu` `id = 2`, шаблон `ctmenu_tpl/footer__item.php`. Телефон, email, адрес — настройки магазина. Меню `oc_ctmenu.id = 3` («Информация») в шаблоны не подключено |
| **Главная.** Слайдер + форма «Подобрать кондиционер» | `SplitPlus/template/extension/module/slideshow.twig` | `catalog/controller/extension/module/slideshow.php` | Макет: модуль `slideshow.27` «Home Page». Картинки — баннер модуля. Форма захардкожена в twig (имя, телефон) и уходит в тот же `header/send_form`, класс `.form-callback`. Стили: `.banner-callback` в `style.scss` |
| **Главная.** Карусель брендов | `SplitPlus/template/extension/module/carousel.twig` | `catalog/controller/extension/module/carousel.php` | Модуль `carousel.29` «Бренды на главной - Карусель». Стили: `.carousel` |
| **Главная.** Плитки категорий | `SplitPlus/template/extension/module/category.twig` | `catalog/controller/extension/module/category.php` | Модуль макета `category` (без id). Контроллер отдаёт корневые категории и картинку 650×650. Сейчас на витрине: Кондиционирование, Вентиляция, Отопление, Услуги. Стили: `.categories` |
| **Главная.** Баннер | `SplitPlus/template/extension/module/banner.twig` | `catalog/controller/extension/module/banner.php` | Модуль `banner.32` «Баннер на главной». Стили: `.banner` |
| **Главная.** Блок товаров «Хит продаж» | `SplitPlus/template/extension/module/bestseller.twig` | `catalog/controller/extension/module/bestseller.php` | Модуль `bestseller.33` «Хиты продаж на главной». Заголовок на витрине из языка: `catalog/language/ru-ru/extension/module/bestseller.php` → «Хит продаж». Товары — `model catalog/product`, `getBestSellerProducts` |
| **Главная.** «Услуги», «Как заказать», статья о компании, «Напишите нам» | Обёртка `SplitPlus/template/extension/module/html.twig` (`.block.block--custom`) | `catalog/controller/extension/module/html.php` | HTML хранится в `oc_module.setting`, не в файлах. Модули: `html.34` Услуги (`.services`), `html.35` Как заказать (`.how-order`), `html.37` статья о компании, `html.36` Напишите нам (`.write`). Стили этих секций — в `style.scss` |
| Страница категории: хлебные крошки, подкатегории, сортировка, сетка карточек со сменой фото | `SplitPlus/template/product/category.twig` | `catalog/controller/product/category.php` | Доп. изображения товара для ховера собираются в контроллере (`images`, ресайз 300×300). Слайдер ховера: `javascript/script.js`. Фильтр слева — модуль OCFilter на макете «Категории» (`column_left`). OCMOD OCFilter дописывает разметку фильтра в этот twig (копия в `storage/modification/.../SplitPlus/template/product/category.twig`) |
| Карточка товара: галерея, опции, характеристики, цена, доставка, вкладки, формы | `SplitPlus/template/product/product.twig` | `catalog/controller/product/product.php` | Стили `product.scss` / `product.css`, поведение вкладок, зума и превью — `javascript/product.js`. Вкладка «Доставка и оплата» — статья `information_id = 10` (`delivery_info`). Отзывы подключаются из темы default: `default/template/product/review.twig`. Блок «Возникли вопросы?» вызывает `handleSubmit` — функции в `script.js` / `product.js` нет. Кнопки «Консультация инженера» и «Быстрый заказ» в шаблоне есть, отдельных обработчиков в JS темы нет |
| Контакты, покупатель, оформление заказа, поиск, производители | Шаблоны **default**, своих twig в SplitPlus нет | Стандартные контроллеры `information/contact`, `checkout/*`, `product/search`, `product/manufacturer` | Оформление заказа переопределено модулем `custom` (простое оформление). Согласие с политикой на контактах и регистрации — OCMOD `tweak-54fz` |

## Модификаторы и модули

### Файлы OCMOD в `public/system/`

Они подхватываются при обновлении модификаторов вместе с записями из `oc_modification`.

| Файл | Что делает на витрине |
| --- | --- |
| `modification.xml` | Системный модификатор OpenCart: подмена `require/include` и чтение twig из кэша модификаций. Не трогать |
| `ocfilter.ocmod.xml` | **OCFilter 4.8.2.** Фильтр в категориях, поиске, производителях и акциях; SEO-страницы фильтра; правки `product/category`, `product/product`, `seo_url`, `catalog/product`. На макете категории модуль висит в `column_left` |
| `tweak.ocmod.xml` | Русская сборка 3.0.3.8. Почти целиком админка: меню, файловый менеджер, форма товара, маркетплейс. На витрину влияет точечно (`catalog/controller/tool/upload.php`, `catalog/controller/mail/affiliate.php`) |
| `tweak-54fz.ocmod.xml` | 152-ФЗ: чекбокс согласия на контактах, регистрации и в письмах. Правит `catalog/controller/information/contact.php`, регистрацию и `default/template/information/contact.twig` |
| `simplepars.ocmod.xml` | Только пункт «SimplePars» в левом меню админки. Парсер товаров, на вёрстку витрины не влияет |

### Модификаторы из админки (`oc_modification`, статус включён)

Их XML лежит в базе, результат уже в `storage/modification/`.

| Имя | Код | Зачем |
| --- | --- | --- |
| Admin Quick Edit PRO 6.2.4 | `admin_quick_edit` | Быстрое редактирование в списках админки. Витрину не рисует |
| Закладки без регистрации | `dev_opencart_com_wishlist_without_register` | Избранное для гостя. Поэтому шапка считает wishlist из сессии |
| Простое оформление заказа | `dev_opencart_com_just_oform_zakaz` | Модуль `custom`: контроллеры `catalog/controller/extension/module/custom/` и `catalog/controller/extension/module/custom.php`. Подменяет стандартный checkout |
| SVG-support 0.2 | `SVG-support` | Загрузка SVG в менеджере файлов |

### Кастомные модули и сущности

| Модуль | Где код | Состояние |
| --- | --- | --- |
| **ctmenu** | `catalog/controller/extension/ctmenu.php`, `ctmenu_tpl/*.php`, `catalog/model/extension/ctmenu.php` | Своё меню магазина. Таблицы `oc_ctmenu`, `oc_ctmenu_link`, `oc_ctmenu_link_description`. В `oc_extension` записи нет — вызывается напрямую из шапки, меню и подвала |
| **OCFilter** | `catalog/controller/extension/module/ocfilter.php`, `catalog/model/extension/module/ocfilter.php`, `system/library/ocfilter/`, шаблон модуля в теме default: `default/template/extension/module/ocfilter48/` | Установлен, фильтр на категориях. Таблицы `oc_ocfilter_*` |
| **HTML / Banner / Carousel / Slideshow / Bestseller / Category** | Стандартные контроллеры модулей + переопределённые twig в SplitPlus | Включены на главной, см. таблицу разделов |
| **custom** (простое оформление) | `catalog/controller/extension/module/custom.php` и подпапка `custom/` | В `oc_extension` (`module.custom`), включается модификатором «Простое оформление заказа» |
| **live_search** | `catalog/controller/extension/module/live_search.php`, `catalog/view/javascript/live_search/` | В `oc_extension` есть, в шапке SplitPlus не подключён |
| **sms_alert** | `catalog/controller/extension/module/sms_alert.php`, админ-контроллер рядом | Файлы на месте, в `oc_extension` записи нет |
| **SimplePars** | `admin/controller/catalog/simplepars.php` | Админский парсер, пункт меню через `simplepars.ocmod.xml` |
| **service** | `admin/controller/catalog/service.php` | Админский контроллер по образцу категорий. На витрину SplitPlus не выведен |

Установленные в `oc_extension` модули витрины: `account`, `banner`, `bestseller`, `carousel`, `category`, `custom`, `featured`, `html`, `live_search`, `ocfilter`, `slideshow`. Тема `SplitPlus` и `default` тоже зарегистрированы как расширения `theme`.

### Кастомные контроллеры, которые правим чаще всего

- `public/catalog/controller/common/header.php` — меню ctmenu, счётчики, `send_form()`
- `public/catalog/controller/common/footer.php` — категории подвала, ctmenu `id = 2`, контакты
- `public/catalog/controller/common/menu.php` — дерево каталога на 3 уровня
- `public/catalog/controller/extension/module/category.php` — картинки плиток на главной
- `public/catalog/controller/product/category.php` — дополнительные фото карточки в списке
- `public/catalog/controller/product/product.php` — проверка категории в URL, вкладка доставки из статьи 10

## Журнал изменений

Сюда дописывается запись после каждой сессии правок: дата, суть, список файлов.

| Дата | Суть | Файлы |
| --- | --- | --- |
| 2026-11-15 | Создан справочник проекта. Код витрины не менялся | `PROJECT_MAP.md` |
| 2026-11-15 | Подготовка к GitHub: `.gitignore`, шаблоны конфигов без доступов к БД. Рабочие `config.php` и кэш в репозиторий не входят | `.gitignore`, `public/config-dist.php`, `public/admin/config-dist.php`, `PROJECT_MAP.md` |
| 2026-11-16 | Задана целевая структура страниц и дизайн-система витрины. Код темы не менялся | `SITE_ARCHITECTURE.md`, `DESIGN_SYSTEM.md`, `.cursorrules`, `PROJECT_MAP.md` |
| 2026-11-16 | Собран изолированный макет главной, шапки, подвала и карточки товара. Тема SplitPlus не менялась | `_mockup/index.html`, `_mockup/css/tokens.css`, `_mockup/css/components.css`, `_mockup/css/home.css`, `_mockup/js/mockup.js`, `.gitignore`, `PROJECT_MAP.md` |
