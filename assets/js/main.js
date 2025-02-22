// main.js v1.0.0

async function loadComponents() {
  // Загрузка и вставка header
  const headerResponse = await fetch('components/header.html');
  if (!headerResponse.ok) throw new Error('Failed to load header');
  const headerHTML = await headerResponse.text();
  document.getElementById('header').innerHTML = headerHTML;

  // Загрузка и вставка footer
  const footerResponse = await fetch('components/footer.html');
  if (!footerResponse.ok) throw new Error('Failed to load footer');
  const footerHTML = await footerResponse.text();
  document.getElementById('footer').innerHTML = footerHTML;

  // Загрузка и вставка формы
  const formResponse = await fetch('components/form.html');
  if (!formResponse.ok) throw new Error('Failed to load form');
  const formHTML = await formResponse.text();
  document.getElementById('form').innerHTML = formHTML;

  // После загрузки и вставки компонентов можно инициализировать элементы
  initializeSmoothScroll();
  initializeMenuToggle();
}

function initializeMenuToggle() {
  const menuToggle = document.getElementById('menu-toggle');
  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      const menu = document.querySelector('.menu');
      menu.classList.toggle('active');
    });
    console.log('menu-toggle найден и инициализирован');
  } else {
    console.error('menu-toggle не найден!');
  }
}

function initializeSmoothScroll() {
  const isHomePage = window.location.pathname === '/'; // Проверьте путь главной страницы
  if (isHomePage) {
    document.querySelectorAll('a.scroll-link').forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
    console.log('Плавный скролл инициализирован для главной страницы');
  } else {
    console.log('Не главная страница, плавный скролл не применяется');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadComponents().catch(console.error);
});

//slider 
$(document).ready(function(){
  $('.slider').slick({
    autoplay: true,        // Автоматическое воспроизведение
    autoplaySpeed: 3000,   // Интервал между слайдами
    arrows: true,          // Стрелки навигации
    dots: true,            // Точки навигации
    fade: true,            // Плавное переключение
    cssEase: 'ease-in-out' // Плавность анимации
  });
});

//slider partner
$(document).ready(function(){
    $('.partners-carousel').slick({
        infinite: true,       // Бесконечный скроллинг
        slidesToShow: 7,      // Количество отображаемых слайдов
        slidesToScroll: 3,    // Количество слайдов за прокрутку
        autoplay: true,       // Автоплей
        autoplaySpeed: 3000,  // Скорость автопрокрутки (3 секунды)
        arrows: true,         // Стрелки для навигации
        dots: true,           // Точки для навигации
        responsive: [         // Адаптивность
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                }
            }
        ]
    });
});

//Преимущества
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.pref').forEach(title => {
    title.addEventListener('click', () => {
      const pref = title.closest('.pref');  // Находим родительский блок
      pref.classList.toggle('open');  // Переключаем класс 'open' для анимации
    });
  });
});

document.addEventListener('scroll', function () {
    const header = document.getElementById('header');
    if (window.scrollY > 50) { // Если прокрутка больше 50px
        header.classList.add('small');
    } else {
        header.classList.remove('small');
    }
});

//Карточки
document.addEventListener('DOMContentLoaded', async () => {
  const cardContainer = document.getElementById('cardContainer');
  const pageId = document.body.id; // Получаем id страницы

  if (!pageId) {
    console.error('ID страницы не найден!');
    return;
  }

  try {
    // Формируем путь к нужному JSON-файлу
    const response = await fetch(`config/${pageId}.json`);
    const cardData = await response.json();

    // Генерация карточек
    cardData.forEach((card) => {
      const cardElement = document.createElement('div');
      cardElement.className = 'card';

      // Проверяем, есть ли ссылка
      const imageContent = card.link ? `<a href="${card.link}"><img src="${card.imgSrc}" alt="${card.title}" class="cardImg"></a>`: `<img src="${card.imgSrc}" alt="${card.title}" class="cardImg">`;
      // Проверяем, есть ли button_link, если да, то выводим кнопку с этим ссылкой
      const buttonContent = `<a href="${card.button_link}" class="orderButton">${card.button_text || 'Перейти'}</a>`;

      cardElement.innerHTML = `
        <div class="imageContainer">${imageContent}</div>
        <p class="cardTitle">${card.title}</p>
        <span class="cardPriceWrapper">
          <p class="cardPrice">${card.price}</p>
          ${buttonContent}
        </span>
      `;

      cardContainer.appendChild(cardElement);
    });
  } catch (error) {
    console.error(`Ошибка загрузки карточек для ${pageId}:`, error);
  }
});


document.addEventListener('DOMContentLoaded', () => {
  const isHomePage = window.location.pathname === '/'; // Проверьте путь главной страницы

  if (isHomePage) {
    // Ищем все ссылки с определённым классом
    document.querySelectorAll('a.scroll-link').forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');

        console.log(`Плавный скролл к: ${targetId}`); // Для отладки

        const targetSection = document.querySelector(targetId);
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }
});