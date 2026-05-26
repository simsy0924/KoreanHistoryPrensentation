# 효과음 파일 (Sound Effects)

이 디렉토리에는 발표 사이트의 애니메이션에 따른 효과음을 저장합니다.

## 필요한 파일

| 파일명 | 용도 | 길이 | 권장 사항 |
|--------|------|------|----------|
| `button-click.mp3` | 버튼 클릭 시 | 150ms | 짧고 명확한 "톡" 또는 "핑" 음 |
| `slide-enter.mp3` | 슬라이드 진입 시 | 200ms | 부드럽고 따뜻한 "시작" 음 |
| `choice-complete.mp3` | 선택 완료 시 | 500ms | 긍정적인 "완료" 음향 |
| `button-hover.mp3` (선택) | 버튼 호버 시 | 100ms | 매우 작은 "삐" 음 |

## 파일 형식

- **Format**: MP3
- **Sample Rate**: 44100 Hz 이상
- **Bitrate**: 128 kbps 이상
- **Mono/Stereo**: 둘 다 가능

## 파일 소스

다음 사이트에서 효과음을 다운로드할 수 있습니다:

1. **Freesound.org** (https://freesound.org/)
   - 무료 음향 효과음 커뮤니티
   - 검색: "click sound", "interface feedback", "positive chime"

2. **Zapsplat** (https://www.zapsplat.com/)
   - 무료 효과음 라이브러리
   - 검색: "button click", "UI sound", "completion"

3. **OpenGameArt.org** (https://opengameart.org/)
   - 게임 개발 관련 무료 음향
   - 음량 및 길이 조절 필요

4. **생성 AI** (Suno AI, 기타)
   - AI로 맞춤 효과음 생성 가능

## 설정 방법

`animation-enhancements.js`의 `boot()` 함수에서 파일들이 자동으로 로드됩니다:

```javascript
window.soundManager.load('button-click', './assets/sounds/button-click.mp3');
window.soundManager.load('slide-enter', './assets/sounds/slide-enter.mp3');
window.soundManager.load('choice-complete', './assets/sounds/choice-complete.mp3');
```

파일이 없으면 자동으로 무시되며, 에러 없이 작동합니다.

## 음량 조절

JavaScript 콘솔에서:
```javascript
window.soundManager.setVolume(0.6); // 0~1 사이의 값
```

## 모바일 비활성화

모바일 기기나 저사양 기기에서는 자동으로 사운드가 비활성화됩니다.
사용자가 수동으로 활성화하려면:
```javascript
window.soundManager.toggle(); // true = 활성화, false = 비활성화
```
