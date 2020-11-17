/* global $ MobileDetect */

/**
 * ---------------------------------------
 * ページの読み込みが完了したタイミングで行うDOM操作
 * ---------------------------------------
 */

// モバイルブラウザかどうか判定
const isMobile = !!new MobileDetect(window.navigator.userAgent).mobile();

// モバイルブラウザでは静止画を表示し、それ以外では動画を表示
if (isMobile) {
  $('.top__img').show();
  $('.top__video').hide();
} else {
  $('.top__img').hide();
  $('.top__video').show();
}

/**
 * ---------------------------------------
 * ローディング画面をフェードアウト
 * ---------------------------------------
 */
$(window).on('load', function(){
  $('#loading').fadeOut(1000);
  setTimeout(function(){
    $("body").fadeIn();
  }
  , 10000);
});

/**
 * ---------------------------------------
 * スクロールに応じて、トップに戻るボタンを表示切り替え
 * ---------------------------------------
 */

$(window).scroll(function () {
  var now = $(window).scrollTop();
  if (now > 100) {
    $('#page_top').fadeIn("slow");
  } else {
    $('#page_top').fadeOut('slow');
  }
});

/**
 * ---------------------------------------
 * Slickによるスライダー
 * ---------------------------------------
 */

$(function() {
  $('.slider').slick({
  centerMode: true,
  centerPadding: '100px',
  slidesToShow: 1,
  dots: true,
  responsive: [
    {
      breakpoint: 768,
      settings: {
        // arrows: false,
        centerMode: true,
        centerPadding: '40px',
        slidesToShow: 1,
        dots: true,
      }
    },
    {
      breakpoint: 480,
      settings: {
        // arrows: false,
        centerMode: true,
        centerPadding: '20px',
        slidesToShow: 1,
        dots: true,
      }
    }
  ]
  });
});

/**
 * ---------------------------------------
 * Vue
 * ---------------------------------------
 */

// ナビゲーションバーのリンクをクリックしたら、
// スムーズにスクロールしながら対象位置に移動
const smoothScroll = (e) => {
  // hrefの値を取得する
  let destination = $(e.currentTarget).attr('href');

  // 本来のクリックイベントは処理しない
  e.preventDefault();

　// スムーズにスクロール
  $('html, body').animate(
    {
      scrollTop: $(destination).offset().top,
    },
    1000,
  );

  // ハンバーガーメニューが開いている場合は閉じる
  $('.navbar-collapse').collapse('hide');
  // $('.navbar-toggler').hide;
}

// コンポーネント化(ナビゲーションメニュー)
const navbarMenu = {
  props: ['hrefVal','initialMenu','hoverMenu'],
  methods: {
    smoothScroll,
  },
  template: `
    <li class="nav-item">
      <a v-bind:href="hrefVal" class="nav-link" v-on:click="smoothScroll">
          <!--Hover時に文字の切り替え-->
          <div class="c--anim-btn">
            <!--Hoverしていない時の表示文字-->
            <span class="c-anim-btn">{{ initialMenu }}</span>
            <!--Hover中の表示文字-->
            <span>{{ hoverMenu }}</span>
          </div>
        </a>
    </li>
  `,
};

// コンポーネント化(about)
const introduction = {
  props: ['introTitle','iconType','iconAnimation','introDescription'],
  template: `
    <div class="about__introduction__background animated">
      <!--タイトル-->
      <p class="about__introduction__background__title">{{ introTitle }}</p>
      <div class="d-flex flex-row mb-2">
        <!--アイコン-->
        <div class="about__introduction__background__icon faa-parent animated-hover mr-3">
          <i class="fas fa-2x fa-fw" :class="[iconType, iconAnimation]"></i>
        </div>
        <!--文章-->
        <p class="about__introduction__background__description" v-html="introDescription"></p>
      </div>
    </div>
  `,
};

// コンポーネント化(service)
const myService = {
  props: ['serviceIcon','serviceMenu','serviceDescription'],
  template: `
    <div class="col-lg-6 mb-3 animated">
      <div class="services__service">
        <p class="services__service__menu text-center"><i class="fas fa-lg fa-fw mr-2" :class="serviceIcon" ></i>{{ serviceMenu }}</p>
        <hr>
        <p v-html="serviceDescription"></p>
      </div>
    </div>
  `,
};


// コンポーネント化(modal)
const portfolioModal = {
  props: ['modalId','modalTitle','portfolioImg','portfolioDescription','portfolioTech','portfolioUrl','portfolioGithub'],
  template: `
    <div :id="modalId" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="gridModalLabel" style="display: none;" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <!--ヘッダー-->
          <div class="modal-header">
            <h5 class="modal-title" id="gridModalLabel">{{ modalTitle }}</h5>
            <!--閉じるボタン(上)-->
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
          </div>
          <!--ボディ-->
          <div class="modal-body">
            <div class="container-fluid text-center">
              <img class="modal__body__img" :src="portfolioImg" loading="lazy">
            </div>
            <div class="container-fluid mt-3">
              <p class="font-weight-bold">作品概要</p>
              <p class="portfolio__description" v-html="portfolioDescription"></p>
              <!--使用技術-->
              <small class="font-size-small text-secondary">{{ portfolioTech }}</small>
              <div class="text-center mt-2">
                <!--作品URL-->
                <a class="btn btn-info font-weight-bold mr-2" :href="portfolioUrl" target="_blank" rel="noopener" role="button">作品URL</a>
                <!--Github-->
                <a class="btn btn-info font-weight-bold" :href="portfolioGithub" target="_blank" rel="noopener" role="button">Github</a>
              </div>
            </div>
          </div>
          <!--ヘッダー-->
          <div class="modal-footer">
            <!--閉じるボタン(下)-->
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  `,
};

let app = new Vue({
  el: '#app',
  components: {
    'navbar-menu' : navbarMenu,
    'about-introduction-background': introduction,
    'my-service': myService,
    'portfolio-modal': portfolioModal,
  },
  mounted () {
    this.waypoint()
  },

  methods: {
    smoothScroll,
    waypoint () {
      let elem = this.$el.querySelectorAll('.animated')

      elem.forEach(x => {
        this.waypoint = new window.Waypoint({
          element: x,
          handler: () => {
            x.classList.add('fadeInUp')
          },
          offset: '75%',
         })
      })
    },
  },
});
