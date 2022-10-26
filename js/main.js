const burger = document.querySelector('.header__burger');
const navMenu = document.querySelector('.nav');
const header = document.querySelector(".header");
const accordion = document.getElementById('accordion');
const imagesList = document.querySelector('.product__images');
const images = imagesList.querySelectorAll('.accordion-image');
const modal = document.querySelector('dialog');
const btnOrder = modal.querySelector('.popup__button a');
const formPopup = modal.querySelector('.form__popup');
const offerSlider = document.querySelector('.offers');
const btnLoadMore = document.querySelector('.load-more');
const detailsCards = document.querySelectorAll('.details__card');
const offerCards = document.querySelectorAll('.offers__card ');

const templateFragment = document.querySelector('#modal-success').content;
const template = templateFragment.querySelector('.modal-success');


const DEFAULT_VISIBLE_CARDS = 6;
const COUNT_SHOW_CARDS = 3;

const tab = document.querySelector('#tabs-1');
const height = tab.scrollHeight;
tab.style.height = `${height}px`;

function toggleMobileMenu() {
  navMenu.classList.toggle('active');
  document.body.classList.toggle('lock');
  burger.classList.toggle('active');
};

function scroll(e) {
  e.preventDefault();
  const href = this.getAttribute('href').substring(1);
  const scrollTarget = document.getElementById(href);
  const elementPosition = scrollTarget.getBoundingClientRect().top;

  if (window.innerWidth >= 1024) {
    let topOffset = document.querySelector('.header').offsetHeight;
    let offsetPosition = elementPosition - topOffset;
    window.scrollBy({ top: offsetPosition, behavior: 'smooth' });
    return;
  }

    const offsetPosition = elementPosition - 80;
    window.scrollBy({ top: offsetPosition, behavior: 'smooth' });
    toggleMobileMenu();
}

function getNavActiveClass() {
  const scrollDistance = window.scrollY;

  if (scrollDistance > header.scrollHeight) {
    header.classList.add("active");
    return;
  }

  header.classList.remove("active");
}

function change(event) {
  const targ = event.target;
  if (targ.tagName !== 'H3') return;
  if (targ.classList.contains('select')) {
    hideAll();
  } else {
    const value = targ.dataset.value;
    hideAll(value);
    targ.classList.add('select');
    showText(targ.nextElementSibling);
  }
}

function hideAll(value) {
  const h3El = accordion.querySelectorAll('h3');
  const divEl = accordion.querySelectorAll('div');

  for (let i = 0; i < h3El.length; i++) {
    h3El[i].classList.remove('select');
    images[i].classList.remove('active');
    divEl[i].style.height = '0';

    if (images[i].dataset.value === value) {
      images[i].classList.add('active');
    }
  }

}

function showText(textEl) {
  textEl.style.height = textEl.scrollHeight + 'px';
}

const sertificatesSwiper = new Swiper(".sertificates-swiper", {
  spaceBetween: 0,
  slidesPerView: 1,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  breakpoints: {
    768: {
      slidesPerView: 2,
      spaceBetweenSlides: 30
    },
    1200: {
      slidesPerView: 3,
    }
  },
  navigation: {
    nextEl: ".sertificates-next",
    prevEl: ".sertificates-prev",
  },
});



const swiper = new Swiper(".mySwiper", {
  spaceBetween: 0,
  slidesPerView: 1,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  breakpoints: {
    768: {
      slidesPerView: 2,
      spaceBetweenSlides: 30
    },
    1200: {
      slidesPerView: 3,
    },
    1600: {
      slidesPerView: 4,
    },
    1900: {
      slidesPerView: 5,
    }
  },
  navigation: {
    nextEl: ".offer-next",
    prevEl: ".offer-prev",
  },
});

accordion.addEventListener('click', change);
burger.addEventListener('click', toggleMobileMenu);

document.querySelectorAll('a[href^="#"').forEach(link => {
  link.addEventListener('click', scroll);
});

document.addEventListener("scroll", getNavActiveClass);
offerSlider.addEventListener('click', createCard);

function createCard(evt) {
  let data = {
    title: null,
    handling: null,
    size: null,
    previewImage: null,
    price: null,
    oldPrice: null,
    amount: null,
    stock: false,
    features: [],
  };

  if (evt.target.classList.contains('btn-detail')) {
    evt.preventDefault();
    const card = evt.target.parentNode;
    const title = card.querySelector('.card__title').textContent;
    const handling = card.querySelector('.card__subtitle').textContent;
    const size = card.querySelector('.card__offer-sizes').textContent;
    const previewImage = card.querySelector('.card__image').src;
    const price = card.querySelector('.price').textContent;
    const oldPrice = card.querySelector('.old-price').textContent;
    const amount = card.querySelector('.amount').textContent;
    const features = card.querySelector('.card__features');

    for(let child of features.children) {
      data.features.push(child.textContent);
    }

    data = {
      ...data, 
      title, 
      handling, 
      size, 
      previewImage, 
      price, 
      oldPrice,
      amount, 
      stock: oldPrice ? true : false
    };

    openModal(data);
  }
} 

function toggleContent(item, itemNode, tag) {
  if (item) {
    itemNode[tag] = item;
    return;
  }

  itemNode[tag] = '';
};

function openModal(data) {
  const {title, handling, size, previewImage, price, oldPrice, amount, stock, features} = data; 
  const tag = 'textContent';
  const modal = document.querySelector('dialog');
  const titleNode = modal.querySelector('.popup__title');
  const handlingNode = modal.querySelector('.popup__subtitle');
  const sizeNode = modal.querySelector('.popup__text--size');
  const imageNode = modal.querySelector('.popup__card--image');
  const priceNode = modal.querySelector('.popup__text--price');
  const oldPriceNode = modal.querySelector('.popup__text--old-price');
  const amountNode = modal.querySelector('.popup__text--amount');
  const stockNode = modal.querySelector('.popup__text--stock');
  const featuresNode = modal.querySelectorAll('.popup__feature');

  toggleContent(title, titleNode, tag);
  toggleContent(handling, handlingNode, tag);
  toggleContent(size, sizeNode, tag);
  toggleContent(previewImage, imageNode, 'src');
  toggleContent(price, priceNode, tag);
  toggleContent(oldPrice, oldPriceNode, tag);
  toggleContent(amount, amountNode, tag);
  getStockPrice(stock, stockNode, oldPriceNode);

  const filterFeature = [...featuresNode].filter((item, index) => index % 2 !== 0);
  filterFeature.forEach((feature, index) => {
    feature.textContent = features[index];
  });

  modal.addEventListener('click', closeModal);
  document.addEventListener('keydown', keyPressCloseModalHandler);
  modal.showModal();
}

function getStockPrice(value, textNode, pricePriceNOde) {
  if (value) {
    textNode.classList.remove('d-none');
    pricePriceNOde.classList.add('active');
    return;
  }

    textNode.classList.add('d-none');
    pricePriceNOde.classList.remove('active');
}

function closeModal(evt) {
  if (evt.target === modal) {
    formPopup.classList.remove('show');
    btnOrder.textContent = 'Заказать'
    document.removeEventListener('keydown', keyPressCloseModalHandler);
    modal.removeEventListener('click', closeModal);
    modal.close();
  }
}

function keyPressCloseModalHandler(evt) {
  if (evt.key === 'Escape') {
      document.removeEventListener('keydown', closeModal);
      modal.close();
      modal.removeEventListener('click', closeModal);
      formPopup.classList.remove('show');
      btnOrder.textContent = 'Заказать'
  };
}

function showFormModal(evt) {
  evt.preventDefault();

  if (formPopup.classList.contains('show')) {
    btnOrder.textContent = 'Заказать'
    formPopup.classList.remove('show');
    return;
  }

  btnOrder.textContent = 'Скрыть'
  formPopup.classList.add('show');
}

btnOrder.addEventListener('click', showFormModal);
[...document.forms].forEach((form) => form.addEventListener('submit', submitFormHandler)); 

function getCountCards(count = 1) {
  let value = DEFAULT_VISIBLE_CARDS;
  return function() {
    value = value + count;
    return value;
  }
}

const counter = getCountCards(COUNT_SHOW_CARDS);

function showCards(cards, counter) {
  const renderCardsCount = cards.length - counter;

  if (!renderCardsCount) {
    btnLoadMore.parentNode.remove();
  }

  if (renderCardsCount >= 0) {
    [...cards].slice(0, counter).forEach((card) => {
      card.classList.remove('hide');
      card.querySelector('img').src = card.dataset.src;
    });
  }
}

btnLoadMore.addEventListener('click', (evt) => {
  evt.preventDefault();
  showCards(detailsCards, counter())
});

  // Маска для  телефона!!!!!!!!
  function maskPhone(selector, masked = '+7 (___) ___-__-__') {
    const elems = document.querySelectorAll(selector);

    function mask(event) {
      const keyCode = event.keyCode;
      const template = masked,
        def = template.replace(/\D/g, ""),
        val = this.value.replace(/\D/g, "");
      let i = 0,
        newValue = template.replace(/[_\d]/g, function (a) {
          return i < val.length ? val.charAt(i++) || def.charAt(i) : a;
        });
      i = newValue.indexOf("_");
      if (i !== -1) {
        newValue = newValue.slice(0, i);
      }
      let reg = template.substr(0, this.value.length).replace(/_+/g,
        function (a) {
          return "\\d{1," + a.length + "}";
        }).replace(/[+()]/g, "\\$&");
      reg = new RegExp("^" + reg + "$");
      if (!reg.test(this.value) || this.value.length < 5 || keyCode > 47 && keyCode < 58) {
        this.value = newValue;
      }
      if (event.type === "blur" && this.value.length <= 4) {
        this.value = "";
      }
      if (event.type === "blur" && this.value.length < 5) {
        this.value = "";
      }

    }
    for (const elem of elems) {
      elem.addEventListener("input", mask);
      elem.addEventListener("focus", mask);
      elem.addEventListener("blur", mask);

    }
  }

  maskPhone('.telefone-field');

[...offerCards].forEach(card => {
  const stock = card.querySelector('.card__stock');
  const oldPrice = card.querySelector('.old-price');

  if (oldPrice.textContent !== '') {
    stock.classList.add('active');
    return;
  } 

  oldPrice.classList.remove('active');
});

function onFail(target) {
  target.classList.add('invalid');
  setTimeout(() => {
    target.classList.remove('disabled');
    target.classList.remove('invalid');
;  }, 1000);
}

function resetForms(nodeEl, target) {
  target.appendChild(nodeEl);

  setTimeout(() => {
    if (modal.open) {
      formPopup.classList.remove('show');
      btnOrder.textContent = 'Заказать'
      document.removeEventListener('keydown', keyPressCloseModalHandler);
      modal.removeEventListener('click', closeModal);
      modal.close();
    }

    target.classList.remove('disabled');
    nodeEl.remove()
    target.reset();

  }, 2000);
}

  //Функция отправки форм
async function submitFormHandler(evt) {
  evt.preventDefault();
  const target = evt.target;
  const formData =  new FormData(target);
  const body = Object.fromEntries(formData.entries());


  const element = template.cloneNode(true);
  target.classList.add('disabled');

  fetch('http://127.0.0.1:5500', { method: 'POST', body })
  .then((response) => {
    if (response.ok) {
      return resetForms(element, target);
    } else {
      throw new Error();
    }
  }).catch(() => onFail(target));
}

