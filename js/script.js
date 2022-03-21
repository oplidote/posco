$(document).ready(function () {

    // 모달창
    let $modal = $('.modal');
    let $modal_close = $('.modal-close');
    $modal_close.click(function(){
        $modal.fadeOut(300);
    });
    // 페이징 바

    // 페이징바 포커싱
    var $header = $('header'); //헤더를 변수에 넣기
    var $gnb = $('.gnb');
    var $gnb_a = $('.gnb-a');
    let $close_bt = $('.close-bt'); // gnb-menu
    var $header_on = $('.header-point'); //색상이 변할 부분
    var $window = $(window);
    let $lang_change = $('.lang-change');
    let $eng = $('.eng');

    var pageOffsetTop = $header_on.offset().top; //색상 변할 부분의 top값 구하기
    $window.resize(function () { //반응형을 대비하여 리사이즈시 top값을 다시 계산
        pageOffsetTop = $header_on.offset().top;
    });
    // 스와이퍼
    let header_search_btn = $('.header-search-btn');
    let search_wrap = $('.search-wrap');
    let search_close = $('.search-close')

    // 서치 버튼
    header_search_btn.click(function () {
        $gnb_a.removeClass('gnb-a-focus');
        search_wrap.addClass('search-wrap-on');
        $header.addClass('down');
    });
    search_close.click(function () {
        search_wrap.removeClass('search-wrap-on');
        var scrolled = $window.scrollTop() >= pageOffsetTop; //스크롤된 상태; true or false
        $header.toggleClass('down', scrolled); //클래스 토글
    });

    // gnb 
    $gnb_a.click(function (e) {
        search_wrap.removeClass('search-wrap-on');
        $gnb_a.removeClass('gnb-a-focus');
        $header.addClass('down');
        $(this).addClass('gnb-a-focus');
        e.preventDefault();
    });
    $close_bt.click(function () {
        $gnb_a.removeClass('gnb-a-focus');
        var scrolled = $window.scrollTop() >= pageOffsetTop; //스크롤된 상태; true or false
        $header.toggleClass('down', scrolled); //클래스 토글
    });

    // lang-change
    $lang_change.click(function () {
        $(this).toggleClass('lang-change-on');
    });

    // 헤더 스크롤
    $window.on('scroll', function () { //스크롤시
        var scrolled = $window.scrollTop() >= pageOffsetTop; //스크롤된 상태; true or false
        let search_true = search_wrap.hasClass('search-wrap-on');
        let gnb_a_true = $gnb_a.hasClass('gnb-a-focus');
        if (search_true == false && gnb_a_true == false) {
            $header.toggleClass('down', scrolled); //클래스 토글
        }
        page_bar_on();
    });


    let visual_menu_list = [
        'park1538',
        '기업시민 함께 미래가 되다',
        '수소 탐구생활'
    ];
    var visual_swiper = new Swiper(".sw-visual-slide", {
        spaceBetween: 30,
        effect: "fade",
        loop: true,
        navigation: {
            nextEl: ".sw-visual-next",
            prevEl: ".sw-visual-prev",
        },
        pagination: {
            el: ".visual-pagination",
            clickable: true,
            renderBullet: function (index, className) {
                return '<span class="' + className + ' visual-menu-item' + '">' + visual_menu_list[index] + "</span>";
            },
        },
        autoplay: {
            delay: 5000,
        },
    });
    // 비주얼 슬라이드 오토플레이 on / off
    let visual_pause = $('.visual-pause');
    let visual_play = $('.visual-play');
    visual_pause.click(function () {
        $(this).toggleClass('visual-play');
        if ($(this).hasClass('visual-play')) {
            visual_swiper.autoplay.stop();
        } else {
            visual_swiper.autoplay.start();
        }
    });
    var swiper = new Swiper(".sw-bar-slide", {
        direction: "vertical",
        slidesPerView: 1,
        loop: true,
        spaceBetween: 30,
        speed: 700,
        autoplay: {
            delay: 3000,
        },
        navigation: {
            nextEl: ".sw-bar-down",
            prevEl: ".sw-bar-up",
        },
    });
    var swiper = new Swiper(".sw-product-slide", {
        navigation: {
            nextEl: ".product-slide-next",
            prevEl: ".product-slide-prev",
        },
        pagination: {
            el: ".product-pagination",
            type: "fraction",
            formatFractionCurrent: function (number) {
                return ('0' + number).slice(-2);
            },
            formatFractionTotal: function (number) {
                return ('0' + number).slice(-2);
            },
        },
        on: {
            slideChange: function () {
                $('.product-box').removeClass('product-box-active');
                $('.product-box').eq(this.realIndex).addClass('product-box-active');
            }
        },

        speed: 700,
        slidesPerView: 1,
    });
    var swiper = new Swiper(".sw-esg-slide", {
        navigation: {
            nextEl: ".sw-esg-next",
            prevEl: ".sw-esg-prev",
        },
        pagination: {
            el: ".esg-pagination",
            type: "fraction",
            formatFractionCurrent: function (number) {
                return ('0' + number).slice(-2);
            },
            formatFractionTotal: function (number) {
                return ('0' + number).slice(-2);
            },
        },
        loop: true,
        slidesPerView: 1,
        speed: 500,
    });


    // darkmode
    let $modechanger = $('#modechanger');
    $modechanger.click(function () {
        var body = $("#main");
        body.toggleClass("darkmode");
    })


    // 내용별 section 을 저장한다.
    let section = $('.content > div');
    // 화면 이동속도 (1000은 1초)
    let section_speed = 1000;

    // 일정 너비 이하는 일반 스크롤 
    let section_min_w = 760; // 값 결정은 개인적

    // 스크롤 바를 보여줄지 말지 결정( 1  스크롤바 보기  0 은 안보이기)
    let section_scrollbar = 0;

    // 현재 보여질 section 의 번호
    let section_index = 0;

    // 전체 section의 개수
    let section_total = section.length;

    // 스크롤을 화면 이동에 적용 할지 말지 여부 ( 0  적용함   1 적용안함)   
    let section_scroll = 0;

    // 스크롤 할때 마다 이동할 좌표 모음
    let section_pos = [];

    // 각 section 위치 저장
    $.each(section, function (index, item) {
        let temp = $(this).offset().top;
        section_pos[index] = temp;
    });
    // 페이징 바 클릭 이벤트
    let $page_bar = $('.page-bar');
    $.each($page_bar, function (index, item) {
        $(this).click(function () {
            $.each(section, function (index, item) {
                let temp = $(this).offset().top;
                section_pos[index] = temp;
            });
            $('html, body').animate({
                scrollTop: section_pos[index]
            }, 500);
        })
    });
    // 좌표에 따라 페이지 바 컬러 변경 함수
    function page_bar_on() {
        $.each(section, function (index, item) {
            let temp = $(this).offset().top;
            section_pos[index] = temp;
        });
        for (let i = 0; i < section_pos.length; i++) {

            if ($window.scrollTop() >= section_pos[i] &&
                $window.scrollTop() < section_pos[i + 1]) {
                $page_bar.removeClass('page-focus');
                $page_bar.eq(i).addClass('page-focus');
            } else if ($window.scrollTop() >= section_pos[section_pos.length - 1]) {
                $page_bar.removeClass('page-focus');
                $page_bar.last().addClass('page-focus');
            }
        }
    }
    page_bar_on();


    // 최초 화면의 너비를 비교한다.
    let window_w = $(window).width();

    // 화면 너비 체크 기능
    function windowWidthFn() {
        // 화면 너비 파악
        window_w = $(window).width();

        // 최초 화면 너비가 760 보다 작다면
        if (window_w < section_min_w) {
            // 스크롤바를 보여줌.
            section_scroll = 1;
        } else {
            // 스크롤바를 안보여줌.
            section_scroll = 0;

            $.each(section, function (index, item) {
                let temp = $(this).offset().top;
                section_pos[index] = temp;
            });

            // 모션없이 강제로 스크롤바 위치를 맞춘다.
            $(window).scrollTop(section_pos[section_index]);
        }

    }


    // 윈도우 리사이즈 처리
    $(window).resize(function () {
        windowWidthFn();
    });


    $(window).bind('mousewheel DOMMouseScroll', function (event) {
        var distance = event.originalEvent.wheelDelta;
        console.log(distance);
        if (distance == null) {
            distance = event.originalEvent.detail * -1;
        }

        // 무조건 휠에 의한 작동을 하게 하면 안된다.
        if (section_scroll == 1) {
            return;
        }

        // 모션이 완료될때까지는 휠에 의한 위치 변화 안함.
        section_scroll = 1;

        if (distance < 0) {
            // console.log('화면 위');
            section_index = section_index + 1;

            if (section_index >= section_total) {
                section_index = section_total - 1;
                section_scroll = 0;
                return;
            }

        } else {
            // console.log('화면 아래');
            section_index = section_index - 1;

            if (section_index < 0) {
                section_index = 0;
                section_scroll = 0;
                return;
            }
        }

        sectionFn();

    });

    function sectionFn() {

        $('html,body').animate({
            // 위치로 이동
            scrollTop: section_pos[section_index]

        }, section_speed, function () {
            // 원하는 작업을 마무리 했으므로, 
            // 다시 스크롤 이벤트를 받아서 적용하겠다.
            section_scroll = 0;
        });
    }
    let link_bt = $('.link-bt');
    let close_bt = $('.close-bt');
    let link_wrap = $('.link-wrap');
    link_bt.click(function () {
        link_wrap.css('display', 'block');
    });
    close_bt.click(function () {
        link_wrap.css('display', 'none');
    });

    // 최초에 한번 실행
    windowWidthFn();

});