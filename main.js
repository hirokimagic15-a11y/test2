/**
 * main.js
 * PSY's VISION 採用LP – インタラクション v3.0
 * vanilla JS only / 最小限の実装
 * =========================================================
 * 1. Fade-in (IntersectionObserver)
 * 2. Hamburger menu toggle
 * 3. FAQ accordion
 * 4. Form: 基本バリデーション
 * 5. Header: スクロール検出（Glassmorphism → Solid 切り替え）
 * =========================================================
 */

(function () {
  'use strict';

  /* ----------------------------------------------------------
    1. Fade-in: .fade-in 要素をスクロールで表示
  ---------------------------------------------------------- */
  const fadeEls = document.querySelectorAll('.fade-in');

  if ('IntersectionObserver' in window && fadeEls.length > 0) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    fadeEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    /* IntersectionObserver 非対応環境では即表示 */
    fadeEls.forEach(function (el) {
      el.classList.add('visible');
    });
  }


  /* ----------------------------------------------------------
    2. Hamburger Menu
  ---------------------------------------------------------- */
  var hamburger = document.getElementById('hamburger');
  var nav = document.getElementById('header-nav');

  if (hamburger && nav) {
    hamburger.addEventListener('click', function () {
      var isOpen = hamburger.classList.toggle('active');
      nav.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      hamburger.setAttribute(
        'aria-label',
        isOpen ? 'メニューを閉じる' : 'メニューを開く'
      );
    });

    /* ナビリンクをクリックしたらメニューを閉じる */
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('active');
        nav.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-label', 'メニューを開く');
      });
    });
  }


  /* ----------------------------------------------------------
    3. FAQ Accordion
  ---------------------------------------------------------- */
  var faqButtons = document.querySelectorAll('.faq-question');

  faqButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var answerId = btn.getAttribute('aria-controls');
      var answer = document.getElementById(answerId);

      if (!answer) return;

      var isExpanded = btn.getAttribute('aria-expanded') === 'true';

      /* 他の開いている項目を閉じる（accordion動作） */
      faqButtons.forEach(function (other) {
        if (other !== btn) {
          var otherId = other.getAttribute('aria-controls');
          var otherAnswer = document.getElementById(otherId);
          if (otherAnswer) {
            otherAnswer.hidden = true;
            other.setAttribute('aria-expanded', 'false');
          }
        }
      });

      /* 対象の開閉切り替え */
      answer.hidden = isExpanded;
      btn.setAttribute('aria-expanded', String(!isExpanded));
    });
  });


  /* ----------------------------------------------------------
    4. Form: 基本バリデーション（submit時）
  ---------------------------------------------------------- */
  var form = document.querySelector('.entry-form');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = form.querySelector('#name');
      var position = form.querySelector('#position');
      var email = form.querySelector('#email');
      var isValid = true;

      /* 必須チェック */
      [name, position, email].forEach(function (field) {
        if (!field || !field.value.trim()) {
          field.style.borderColor = '#E53E3E';
          isValid = false;
        } else {
          field.style.borderColor = '';
        }
      });

      /* メール形式チェック */
      if (email && email.value.trim()) {
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email.value.trim())) {
          email.style.borderColor = '#E53E3E';
          isValid = false;
        }
      }

      if (isValid) {
        /* 実際の送信処理に差し替えてください */
        var submitBtn = form.querySelector('.form-submit');
        if (submitBtn) {
          submitBtn.textContent = '送信しました。ありがとうございます。';
          submitBtn.disabled = true;
          submitBtn.style.opacity = '0.7';
          submitBtn.style.cursor = 'default';
        }
      }
    });

    /* フォーカス時にエラー色をリセット */
    form.querySelectorAll('.form-input').forEach(function (input) {
      input.addEventListener('focus', function () {
        input.style.borderColor = '';
      });
    });
  }


  /* ----------------------------------------------------------
    5. Header: スクロール検出
       Hero セクションを抜けたら .scrolled を付与
       → Dark Glassmorphism から Light Solid へ切り替え
  ---------------------------------------------------------- */
  var header = document.querySelector('.site-header');
  var hero   = document.getElementById('hero');

  if (header && hero && 'IntersectionObserver' in window) {
    var heroObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          /* Hero が画面外に出たら scrolled、戻ったら解除 */
          header.classList.toggle('scrolled', !entry.isIntersecting);
        });
      },
      { threshold: 0.05 }
    );
    heroObserver.observe(hero);
  }

})();
