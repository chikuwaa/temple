"use strict";

$(function () {
  var is_animated = false;
  var current_posi = "top";
  var position = $(window).height() / 3 * 2; // 発火させたい位置

  var ani_position = $(window).height() / 2; // 発火させたい位置

  var top = $('.light').offset().top - ani_position;
  var l_top;
  var l_skills;
  var l_price;
  var l_contact; //スムーススクロール

  $('a[href^="#"]').click(function () {
    var speed = 500;
    var href = $(this).attr("href");
    var target = $(href == "#" || href == "" ? 'html' : href);
    var s_position = target.offset().top;
    $("html, body").animate({
      scrollTop: s_position
    }, speed, "swing");
    return false;
  }); //SPメニュー

  if (matchMedia('(max-width: 768px)').matches) {
    // ウィンドウサイズが768px以下のとき
    $(".sp_menu").on('click', function () {
      var menu_item = $(this).prev('ul');
      menu_item.slideToggle('slow');
      $(this).toggleClass("opened");
    });
    $(".sp_contact,.sp_contact_link").on('click', function () {
      $(".contactsLst").toggleClass("opened");
    });
    $("nav a").on('click', function () {
      $("nav ul").slideToggle('slow');
      $(".sp_menu").removeClass("opened");
    });
  }

  $(window).scroll(function () {
    //スクロールアニメーション
    if ($(window).scrollTop() > top) {
      // console.log("a");
      if (is_animated != true) {
        $('body').css("overflow", "hidden");
        setTimeout(function () {
          is_animated = true;
          $('body').addClass("on");
        }, 1000);
        setTimeout(function () {
          $('body').css("overflow", "");
          $('.light .off').css("display", "none");
          $('.light .on').css("display", "block");
          $('.light h1').css("display", "inherit");
          $(window).scrollTop(0);
        }, 2000);
      }
    } else {} // console.log("b");
    //current移動


    if (matchMedia('(max-width: 768px)').matches) {// ウィンドウサイズが768px以下のとき
    } else {
      if (is_animated == true) {
        // console.log("a");
        l_top = $('#top').offset().top - position;
        l_skills = $('#skills').offset().top - position;
        l_price = $('#price').offset().top - position;
        l_contact = $('#contact').offset().top - position;

        if ($(window).scrollTop() > l_top && $(window).scrollTop() < l_skills) {
          $('header .current').removeClass("skl price con");
        } else if ($(window).scrollTop() > l_skills && $(window).scrollTop() < l_price) {
          $('header .current').removeClass("skl price con");
          $('header .current').addClass("skl");
        } else if ($(window).scrollTop() > l_price && $(window).scrollTop() < l_contact) {
          $('header .current').removeClass("skl price con");
          $('header .current').addClass("price");
        } else if ($(window).scrollTop() > l_contact) {
          $('header .current').removeClass("skl price con");
          $('header .current').addClass("con");
        }
      }
    }
  });
  $('.skipBtn').on('click', function () {
    // console.log("a");
    var speed = 500;
    var scroll_posi = top + 10;
    $("html, body").animate({
      scrollTop: scroll_posi
    }, speed, "swing");
    return false;
  });
  $('.scrollBtn').on('click', function () {
    console.log("a");
    var speed = 1500;
    var scroll_posi = top + 10;
    $("html, body").animate({
      scrollTop: scroll_posi
    }, speed, "swing");
    return false;
  });
});