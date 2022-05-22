

//fixed header

$(window).on('scroll', () => {
  if (this.scrollY > 0){
    $('.header')[0].className = 'header fixed';
  } else{
    $('.header')[0].className = 'header';
  }
});


// scroll to anchors

$('a[href^="#"]').on('click', function (event) {
    event.preventDefault();
    var sc = $(this).attr("href"),
        dn = $(sc).offset().top - 110;
        console.log(dn);
    $('html').animate({
        scrollTop: dn
    }, 1000);
});


//burger menu

$('.burger__btn').on('click', () => {
  $('.burger').toggleClass('active');
  $('.burger').hasClass('active') ? $('.burger__nav').fadeIn() : $('.burger__nav').fadeOut();
});

$('.burger__nav a').on('click', () => {
  $('.burger').removeClass('active');
  $('.burger__nav').fadeOut();
});

//slick

$('.teams__slider').slick({
  slidesToScroll: 1,
  slidesToShow: 1,
  draggable: false,
  speed: 600,
  swipe:false
});

$('.teams__mob__slider').slick({
  slidesToScroll: 2,
  slidesToShow: 2,
  dots: true,
  arrows: true,
  responsive: [
    {
      breakpoint: 576,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      }
    }
  ]
});

$('.intro__slider__item').slick({
  slidesToShow: 10,
  arrows: false,
  draggable: false,
  infinite: true,
  speed: 5000,
  cssEase: 'linear',
  autoplay: true,
  autoplaySpeed: 0,
  swipe:false,
  pauseOnHover: false,
  responsive: [
    {
      breakpoint: 620,
      settings: {
        slidesToShow: 17
      }
    }
  ]
});


// slider

let slideNum = 1;
let sliderFlag = true

$('.teams__slider-btns-arrow').on('click', function() {
  if(sliderFlag){
    this.className.includes('next') ? $('.slick-next').trigger('click') && slideNum++ : $('.slick-prev').trigger('click') && slideNum--;
    if(slideNum > 4){
      slideNum = 1;
    } else if(slideNum < 1){
      slideNum = 4;
    }
    $('.teams__slider-counter span').text(slideNum);
    sliderFlag = false
    setTimeout(() => {
      sliderFlag = true
    }, 600)
  }
});


// chanding modal form send btn text

$(document).on('ready.FormJS', function() {
  $('#activate_form .send-form span').text('Request Contact')
});


// modal events

const openModal = e => {
  e.preventDefault()
  $('.modal-main').first().fadeIn(400);
}
const closeModal = () => {
  $('.modal-main').fadeOut(400);
}

$('.modal-main').on('click', e => {
  if(e.target.className === "modal-main__wrapper" || e.target.className === "modal-main__close"){
    closeModal();
  }
});
$('.main-btn:not(.send-form)').on('click', openModal);

// aos

AOS.init();