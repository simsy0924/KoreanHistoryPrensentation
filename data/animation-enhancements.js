// 발표 애니메이션 강화: 카드 등장, 버튼 반응성, 효과음
(function(){
  const VERSION = '2026-05-26-animation-enhancements-v1';
  if (window.__ANIMATION_ENHANCEMENTS__ === VERSION) return;
  window.__ANIMATION_ENHANCEMENTS__ = VERSION;

  // ============================================
  // 1. SoundManager 클래스
  // ============================================
  class SoundManager {
    constructor() {
      this.sounds = {};
      this.isLowEndDevice = this.detectLowEnd();
      this.enabled = !this.isLowEndDevice;
      this.volume = 0.5;
    }

    detectLowEnd() {
      const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent);
      const lowMemory = navigator.deviceMemory && navigator.deviceMemory < 4;
      const lowCores = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
      return isMobile || lowMemory || lowCores;
    }

    load(name, path) {
      if (!this.enabled) return;
      try {
        const audio = new Audio(path);
        audio.volume = this.volume;
        audio.preload = 'auto';
        this.sounds[name] = audio;
      } catch (e) {
        console.debug('Sound load error:', e);
      }
    }

    play(name) {
      if (!this.enabled || !this.sounds[name]) return;
      try {
        const sound = this.sounds[name].cloneNode();
        sound.currentTime = 0;
        sound.play().catch(() => {});
      } catch (e) {
        console.debug('Sound play error:', e);
      }
    }

    setVolume(vol) {
      this.volume = Math.max(0, Math.min(1, vol));
      Object.values(this.sounds).forEach(s => {
        if (s && typeof s.volume === 'number') s.volume = this.volume;
      });
    }

    toggle() {
      this.enabled = !this.enabled;
      return this.enabled;
    }
  }

  window.soundManager = new SoundManager();

  // 초기 사운드 로드 (시도)
  // 실제 파일이 없으면 에러 없음 - 단지 재생만 안됨
  window.soundManager.load('button-click', './assets/sounds/button-click.mp3');
  window.soundManager.load('slide-enter', './assets/sounds/slide-enter.mp3');
  window.soundManager.load('choice-complete', './assets/sounds/choice-complete.mp3');

  // ============================================
  // 2. 슬라이드 진입 후 카드 애니메이션 훅
  // ============================================
  function hookSlideRender() {
    const originalRender = window.render;
    if (typeof originalRender !== 'function') return;

    window.render = function() {
      originalRender.call(this);

      // 슬라이드 진입 후 이전 선택지 상태 초기화
      setTimeout(() => {
        const oldChoices = document.querySelectorAll('.choice, [data-choice]');
        oldChoices.forEach(btn => {
          btn.style.animation = '';
          btn.style.pointerEvents = 'auto';
          btn.classList.remove('selected');
        });

        // 카드 애니메이션 시작
        const cards = document.querySelectorAll(
          '.diary-card, .source-doc, .source-summary article'
        );

        // nth-child 기반 delay가 이미 CSS에 있으므로
        // 여기서는 애니메이션 시작만 보장
        if (cards.length > 0) {
          window.soundManager.play('slide-enter');
        }
      }, 50);
    };
  }

  hookSlideRender();

  // ============================================
  // 3. 버튼 호버/클릭 애니메이션
  // ============================================
  function hookButtonAnimations() {
    document.addEventListener('mouseover', (e) => {
      const btn = e.target.closest('button.main, button.sub');
      if (!btn) return;
      // :hover CSS가 이미 적용되므로 추가 로직 불필요
      // 선택사항: 호버 사운드 재생
      // window.soundManager.play('button-hover');
    });

    document.addEventListener('click', (e) => {
      const btn = e.target.closest('button.main, button.sub');
      if (!btn) return;
      // 클릭 사운드 (선택 버튼이 아닌 경우)
      if (!btn.classList.contains('choice')) {
        window.soundManager.play('button-click');
      }
    });
  }

  hookButtonAnimations();

  // ============================================
  // 4. 선택지 응답 애니메이션
  // ============================================
  function attachChoiceAnimations() {
    document.addEventListener('click', (e) => {
      const choiceBtn = e.target.closest('.choice, [data-choice]');
      if (!choiceBtn) return;

      // 클릭 버튼 애니메이션 (이미 존재하는 동작이므로 추가 코드)
      choiceBtn.style.animation = 'clickBounce 0.4s cubic-bezier(0.34,1.56,0.64,1)';
      choiceBtn.classList.add('selected');

      // 다른 버튼들 fade out
      const allChoices = document.querySelectorAll('.choice, [data-choice]');
      allChoices.forEach(btn => {
        if (btn !== choiceBtn) {
          btn.style.animation = 'fadeOut 0.5s ease-out forwards';
          btn.style.pointerEvents = 'none';
        }
      });

      // 효과음
      window.soundManager.play('button-click');
      setTimeout(() => {
        window.soundManager.play('choice-complete');
      }, 150);
    });
  }

  attachChoiceAnimations();

  // ============================================
  // 5. 슬라이드 전환 시 애니메이션 훅 (선택사항)
  // ============================================
  function hookNextSlideSound() {
    const originalNextSlide = window.nextSlide;
    if (typeof originalNextSlide !== 'function') return;

    window.nextSlide = function() {
      window.soundManager.play('button-click');
      originalNextSlide.call(this);
    };
  }

  // 슬라이드 전환 사운드는 필요 시에만 활성화
  // hookNextSlideSound();

  // ============================================
  // 6. 초기화 완료
  // ============================================
  console.debug('Animation enhancements loaded:', VERSION);
})();
