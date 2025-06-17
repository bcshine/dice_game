class DiceGame {
    constructor() {
        this.selectedNumbers = [];
        this.diceResult = 0;
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateSelectedDisplay();
    }

    bindEvents() {
        // 숫자 버튼 클릭 이벤트
        const numberButtons = document.querySelectorAll('.number-btn');
        numberButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.selectNumber(e));
        });

        // 주사위 굴리기 버튼 클릭 이벤트
        const rollButton = document.getElementById('rollDiceBtn');
        rollButton.addEventListener('click', () => this.rollDice());
    }

    selectNumber(event) {
        const number = parseInt(event.target.dataset.number);
        const button = event.target;

        if (this.selectedNumbers.includes(number)) {
            // 이미 선택된 숫자라면 제거
            this.selectedNumbers = this.selectedNumbers.filter(n => n !== number);
            button.classList.remove('selected');
        } else {
            // 새로운 숫자 선택
            if (this.selectedNumbers.length < 3) {
                this.selectedNumbers.push(number);
                button.classList.add('selected');
            }
        }

        this.updateSelectedDisplay();
        this.updateRollButton();
    }

    updateSelectedDisplay() {
        const countElement = document.getElementById('selectedCount');
        const numbersElement = document.getElementById('selectedNumbers');
        
        countElement.textContent = this.selectedNumbers.length;
        
        if (this.selectedNumbers.length === 0) {
            numbersElement.textContent = '없음';
        } else {
            numbersElement.textContent = this.selectedNumbers.sort((a, b) => a - b).join(', ');
        }
    }

    updateRollButton() {
        const rollButton = document.getElementById('rollDiceBtn');
        rollButton.disabled = this.selectedNumbers.length !== 3;
        
        // 크롬 호환성을 위해 버튼을 강제로 표시
        rollButton.style.display = 'block';
        rollButton.style.visibility = 'visible';
        rollButton.style.opacity = '1';
        rollButton.style.position = 'static';
        rollButton.style.width = '100%';
        rollButton.style.height = '45px';
        rollButton.style.marginTop = '15px';
        rollButton.style.marginBottom = '20px';
        
        // 브라우저별 처리
        if (navigator.userAgent.includes('Chrome')) {
            rollButton.style.transform = 'translateZ(0)'; // 하드웨어 가속
            rollButton.style.backfaceVisibility = 'hidden';
        }
        
        console.log('버튼 상태:', rollButton.disabled ? '비활성화' : '활성화');
        console.log('선택된 숫자:', this.selectedNumbers);
    }

    rollDice() {
        // 장면 전환 (숫자 선택 → 주사위 굴리기)
        this.switchScene('scene1', 'scene2');
        
        // 4초 후 주사위 애니메이션 정지 및 결과 표시 (2초간)
        setTimeout(() => {
            this.diceResult = Math.floor(Math.random() * 6) + 1;
            this.showDiceResult();
            
            // 2초 후 최종 결과 화면으로 전환
            setTimeout(() => {
                this.showResult();
            }, 2000);
        }, 4000);
    }

    showResult() {
        const isWin = this.selectedNumbers.includes(this.diceResult);
        
        // 장면 전환 (주사위 굴리기 → 결과)
        this.switchScene('scene2', 'scene3');
        
        // 결과 내용 생성
        this.createResultContent(isWin);
    }

    createResultContent(isWin) {
        const resultContent = document.getElementById('resultContent');
        
        if (isWin) {
            // 성공 효과 실행
            this.playSuccessEffects();
            
            resultContent.innerHTML = `
                <div class="result-success">
                    <div>
                        <div class="result-message">🎉 정답! 주사위 결과가 선택한 숫자와 일치해요!</div>
                        
                        <div class="result-details">
                            <p><strong>선택한 숫자:</strong> ${this.selectedNumbers.sort((a, b) => a - b).join(', ')}</p>
                            <p><strong>주사위 결과:</strong> 🎲 ${this.diceResult}번!</p>
                        </div>
                        
                        <div class="coupon-box" id="couponBox">
                            <div class="coupon-title">🥤 음료수 1잔 무료 쿠폰</div>
                            <div class="coupon-details">
                                <p><strong>상품내용:</strong> 음료수 1잔 (아메리카노, 라떼 등)</p>
                                <p><strong>쿠폰코드:</strong> <span class="coupon-code">DC${Math.floor(Math.random() * 900000 + 100000)}</span></p>
                                <p><strong>유효기간:</strong> ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('ko-KR')} 까지</p>
                                <p class="usage-info"><strong>사용법:</strong> 이 쿠폰을 제시해주세요</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="result-buttons">
                        <button class="result-btn btn-primary" onclick="game.saveCoupon()">
                            📱 쿠폰 저장하기
                        </button>
                        <button class="result-btn btn-secondary" onclick="game.restartGame()">
                            🔄 다시 하기
                        </button>
                    </div>
                </div>
            `;
        } else {
            // 실패 효과 실행
            this.playFailEffects();
            
            resultContent.innerHTML = `
                <div class="result-fail">
                    <div>
                        <div class="result-message">😢 아쉽지만 선택한 숫자와<br>일치하지 않았어요</div>
                        
                        <div class="result-details">
                            <p><strong>선택한 숫자:</strong> ${this.selectedNumbers.sort((a, b) => a - b).join(', ')}</p>
                            <p><strong>주사위 결과:</strong> 🎲 ${this.diceResult}번</p>
                            <p style="color: #666; font-size: 14px; margin-top: 15px;">
                                다시 도전해보세요! 성공 확률은 50%입니다.
                            </p>
                        </div>
                    </div>
                    
                    <div class="result-buttons">
                        <button class="result-btn btn-primary" onclick="game.goHome()">
                            🏠 홈으로
                        </button>
                    </div>
                </div>
            `;
        }
    }

    saveCoupon() {
        // 사실적인 쿠폰 이미지 생성
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = 500;
        canvas.height = 350;
        
        // 사실적인 배경 (그라디언트 + 패턴)
        const gradient = ctx.createLinearGradient(0, 0, 500, 350);
        gradient.addColorStop(0, '#f8f9ff');
        gradient.addColorStop(0.5, '#ffffff');
        gradient.addColorStop(1, '#f0f3ff');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 500, 350);
        
        // 테두리 (사실적인 쿠폰 느낌)
        ctx.strokeStyle = '#667eea';
        ctx.lineWidth = 3;
        ctx.setLineDash([10, 5]);
        ctx.strokeRect(15, 15, 470, 320);
        ctx.setLineDash([]);
        
        // 내부 테두리
        ctx.strokeStyle = '#667eea';
        ctx.lineWidth = 1;
        ctx.strokeRect(25, 25, 450, 300);
        
        // 제목 영역 배경
        const titleGradient = ctx.createLinearGradient(0, 40, 0, 100);
        titleGradient.addColorStop(0, '#667eea');
        titleGradient.addColorStop(1, '#764ba2');
        ctx.fillStyle = titleGradient;
        ctx.fillRect(25, 40, 450, 60);
        
        // 제목 텍스트
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 28px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🥤 음료수 1잔 무료 쿠폰', 250, 80);
        
        // 부제목
        ctx.fillStyle = '#333333';
        ctx.font = 'bold 20px Arial, sans-serif';
        ctx.fillText('주사위 게임 승리 기념!', 250, 140);
        
        // 정보 영역을 두 개로 분할 (좌측: 텍스트, 우측: QR코드)
        
        // 좌측 정보 박스
        ctx.fillStyle = '#f8f9ff';
        ctx.fillRect(50, 160, 280, 100);
        ctx.strokeStyle = '#667eea';
        ctx.lineWidth = 1;
        ctx.strokeRect(50, 160, 280, 100);
        
        // 우측 QR 코드 박스
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(340, 160, 110, 100);
        ctx.strokeStyle = '#667eea';
        ctx.lineWidth = 1;
        ctx.strokeRect(340, 160, 110, 100);
        
        // 상품 내용
        ctx.fillStyle = '#333333';
        ctx.font = 'bold 16px Arial, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('🥤 상품내용:', 70, 185);
        ctx.font = '14px Arial, sans-serif';
        ctx.fillText('음료수 1잔 (아메리카노, 라떼 등)', 70, 205);
        
        // 쿠폰코드
        const couponCode = `DC${Math.floor(Math.random() * 900000 + 100000)}`;
        ctx.font = 'bold 14px Arial, sans-serif';
        ctx.fillText('🎟️ 쿠폰코드:', 70, 225);
        ctx.font = 'bold 16px Arial, sans-serif';
        ctx.fillStyle = '#667eea';
        ctx.fillText(couponCode, 170, 225);
        
        // 유효기간
        ctx.fillStyle = '#333333';
        ctx.font = 'bold 14px Arial, sans-serif';
        ctx.fillText('⏰ 유효기간:', 70, 245);
        const expireDate = new Date();
        expireDate.setDate(expireDate.getDate() + 30);
        ctx.font = '13px Arial, sans-serif';
        ctx.fillText(`${expireDate.toLocaleDateString('ko-KR')} 까지`, 170, 245);
        
        // 사실적인 QR코드 생성 (우측 박스 중앙)
        this.drawRealisticQRCode(ctx, 355, 175, 80);
        
        // 사용법 안내
        ctx.fillStyle = '#d32f2f';
        ctx.font = 'bold 14px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('📍 사용법: 이 쿠폰을 제시해주세요', 250, 290);
        
        // 하단 안내
        ctx.fillStyle = '#666666';
        ctx.font = '12px Arial, sans-serif';
        ctx.fillText('본 쿠폰은 주사위 게임 승리자에게 발급되는 특별 혜택입니다', 250, 310);
        
        // 게임 정보 (작게)
        ctx.fillStyle = '#999999';
        ctx.font = '10px Arial, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(`게임 결과: ${this.diceResult}번 (선택: ${this.selectedNumbers.sort((a, b) => a - b).join(', ')})`, 30, 325);
        
        // 일련번호와 쿠폰코드 연동
        ctx.fillStyle = '#999999';
        ctx.font = '10px Arial, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(`일련번호: ${couponCode}`, 480, 325);
        ctx.fillText(`발급일: ${new Date().toLocaleDateString('ko-KR')}`, 480, 340);
        
        // 이미지 다운로드
        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `음료수쿠폰_${couponCode}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            // 성공 메시지 표시
            this.showSaveSuccess();
        });
    }

    showSaveSuccess() {
        const originalText = document.querySelector('.btn-primary').textContent;
        const button = document.querySelector('.btn-primary');
        
        button.textContent = '✅ 저장 완료!';
        button.style.background = '#4CAF50';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
        }, 2000);
    }

    restartGame() {
        // 게임 상태 초기화
        this.selectedNumbers = [];
        this.diceResult = 0;
        
        // UI 초기화
        const numberButtons = document.querySelectorAll('.number-btn');
        numberButtons.forEach(btn => btn.classList.remove('selected'));
        
        this.updateSelectedDisplay();
        this.updateRollButton();
        
        // 장면 2 요소들 초기화
        const loadingText = document.querySelector('.loading-text');
        const resultDisplay = document.getElementById('diceResultDisplay');
        const dice = document.getElementById('animatedDice');
        
        if (loadingText) loadingText.style.display = 'block';
        if (resultDisplay) resultDisplay.classList.remove('show');
        if (dice) {
            dice.style.animation = 'rollDice 4s ease-out infinite';
            dice.style.transform = '';
        }
        
        // 첫 번째 장면으로 돌아가기
        this.switchScene('scene3', 'scene1');
    }

    goHome() {
        this.restartGame();
    }

    switchScene(fromScene, toScene) {
        const from = document.getElementById(fromScene);
        const to = document.getElementById(toScene);
        
        from.classList.remove('active');
        to.classList.add('active');
    }

    // 주사위 결과 표시 (2초간)
    showDiceResult() {
        // 주사위 애니메이션 정지
        const dice = document.getElementById('animatedDice'); 
        dice.style.animation = 'none';
        
        // 결과에 따른 주사위 면 회전
        const rotations = {
            1: 'rotateX(0deg) rotateY(0deg)',      // 앞면
            2: 'rotateX(0deg) rotateY(90deg)',     // 오른쪽
            3: 'rotateX(-90deg) rotateY(0deg)',    // 위쪽
            4: 'rotateX(90deg) rotateY(0deg)',     // 아래쪽
            5: 'rotateX(0deg) rotateY(-90deg)',    // 왼쪽
            6: 'rotateX(0deg) rotateY(180deg)'     // 뒷면
        };
        
        dice.style.transform = rotations[this.diceResult];
        
        // 로딩 텍스트 숨기기
        const loadingText = document.querySelector('.loading-text');
        loadingText.style.display = 'none';
        
        // 결과 표시
        const resultDisplay = document.getElementById('diceResultDisplay');
        const resultNumber = document.getElementById('resultNumber');
        
        resultNumber.textContent = this.diceResult;
        resultDisplay.classList.add('show');
        
        // 결과 주사위 복사해서 중앙에 크게 표시
        const resultDice = document.getElementById('resultDice');
        resultDice.innerHTML = dice.outerHTML;
        const resultDiceElement = resultDice.querySelector('.dice');
        resultDiceElement.style.animation = 'none';
        resultDiceElement.style.transform = rotations[this.diceResult];
        resultDiceElement.style.width = '100px';
        resultDiceElement.style.height = '100px';
        resultDiceElement.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
        
        // 결과 주사위 면 크기 조정
        const resultFaces = resultDice.querySelectorAll('.dice-face');
        resultFaces.forEach(face => {
            face.style.width = '100px';
            face.style.height = '100px';
        });
        
        // 결과 주사위 면 위치 조정 (크게)
        const resultFacesPositions = resultDice.querySelectorAll('.dice-face');
        resultFacesPositions[0].style.transform = 'translateZ(50px)'; // front
        resultFacesPositions[1].style.transform = 'rotateY(180deg) translateZ(50px)'; // back
        resultFacesPositions[2].style.transform = 'rotateY(90deg) translateZ(50px)'; // right
        resultFacesPositions[3].style.transform = 'rotateY(-90deg) translateZ(50px)'; // left
        resultFacesPositions[4].style.transform = 'rotateX(90deg) translateZ(50px)'; // top
        resultFacesPositions[5].style.transform = 'rotateX(-90deg) translateZ(50px)'; // bottom
    }

    // 주사위 애니메이션 정지 및 결과 표시 (구버전)
    stopDiceAnimation() {
        const dice = document.getElementById('animatedDice');
        dice.style.animation = 'none';
        
        // 결과에 따른 주사위 면 회전
        const rotations = {
            1: 'rotateX(0deg) rotateY(0deg)',      // 앞면
            2: 'rotateX(0deg) rotateY(90deg)',     // 오른쪽
            3: 'rotateX(-90deg) rotateY(0deg)',    // 위쪽
            4: 'rotateX(90deg) rotateY(0deg)',     // 아래쪽
            5: 'rotateX(0deg) rotateY(-90deg)',    // 왼쪽
            6: 'rotateX(0deg) rotateY(180deg)'     // 뒷면
        };
        
        dice.style.transform = rotations[this.diceResult];
    }

    // 성공 효과 (축포 + 음향)
    playSuccessEffects() {
        this.createConfetti();
        this.playSound('suc_01.mp3', 4000);
    }

    // 실패 효과 (이미지 + 음향)
    playFailEffects() {
        this.flyFailImage();
        this.playSound('fail_02.mp3', 4000);
    }

    // 축포 효과 생성
    createConfetti() {
        const container = document.getElementById('confettiContainer');
        container.innerHTML = '';
        
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti-piece';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.animationDelay = Math.random() * 3 + 's';
            confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
            container.appendChild(confetti);
        }
        
        // 4초 후 정리
        setTimeout(() => {
            container.innerHTML = '';
        }, 4000);
    }

    // 실패 이미지 날리기
    flyFailImage() {
        const failEffect = document.getElementById('failEffect');
        failEffect.style.opacity = '1';
        failEffect.classList.add('fail-fly');
        
        // 4초 후 정리
        setTimeout(() => {
            failEffect.style.opacity = '0';
            failEffect.classList.remove('fail-fly');
        }, 4000);
    }

    // 음향 재생
    playSound(filename, duration) {
        try {
            const audio = new Audio(filename);
            audio.volume = 0.7;
            audio.play();
            
            // 지정된 시간 후 음향 정지
            setTimeout(() => {
                audio.pause();
                audio.currentTime = 0;
            }, duration);
        } catch (error) {
            console.log('음향 파일을 찾을 수 없습니다:', filename);
        }
    }

    // 사실적인 QR 코드 그리기
    drawRealisticQRCode(ctx, x, y, size) {
        // QR 코드용 작은 사이즈로 조정
        const qrSize = 70;
        const qrX = x + (size - qrSize) / 2;
        const qrY = y + 5;
        
        // QR 코드 배경 (흰색)
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(qrX, qrY, qrSize, qrSize);
        
        // QR 코드 테두리
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        ctx.strokeRect(qrX, qrY, qrSize, qrSize);
        
        // 실제 QR 코드 패턴 생성 (25x25 그리드)
        const cellSize = qrSize / 25;
        ctx.fillStyle = '#000000';
        
        // 모서리 마커 (3개의 큰 사각형) - 실제 QR 코드 위치
        this.drawQRMarker(ctx, qrX + cellSize, qrY + cellSize, cellSize * 7);
        this.drawQRMarker(ctx, qrX + qrSize - cellSize * 8, qrY + cellSize, cellSize * 7);
        this.drawQRMarker(ctx, qrX + cellSize, qrY + qrSize - cellSize * 8, cellSize * 7);
        
        // 타이밍 패턴 (수직/수평 줄무늬) - 6행/6열
        for (let i = 8; i < 17; i++) {
            if (i % 2 === 0) {
                ctx.fillRect(qrX + i * cellSize, qrY + 6 * cellSize, cellSize, cellSize);
                ctx.fillRect(qrX + 6 * cellSize, qrY + i * cellSize, cellSize, cellSize);
            }
        }
        
        // 정렬 패턴 (우하단)
        this.drawAlignmentPattern(ctx, qrX + 16 * cellSize, qrY + 16 * cellSize, cellSize * 5);
        
        // 실제 QR 코드 데이터 패턴 (더 조밀하고 사실적으로)
        const qrPattern = [
            [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1,0,0,0,0],
            [1,0,0,0,0,0,1,0,0,1,0,1,0,1,0,1,0,0,0,0,1,0,1,0,1],
            [1,0,1,1,1,0,1,0,1,1,1,0,1,0,1,1,0,1,1,1,1,0,0,1,0],
            [1,0,1,1,1,0,1,0,0,0,1,1,0,1,0,1,0,1,1,1,1,0,1,1,1],
            [1,0,1,1,1,0,1,0,1,0,0,1,1,0,1,1,0,1,1,1,1,0,0,0,1],
            [1,0,0,0,0,0,1,0,1,1,0,0,1,1,0,1,0,0,0,0,1,0,1,0,0],
            [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1,0,0,1,1],
            [0,0,0,0,0,0,0,0,0,1,1,0,0,1,0,0,0,0,0,0,0,0,1,1,0],
            [1,0,1,1,0,1,1,1,0,0,1,1,1,0,1,0,1,0,1,1,0,1,0,0,1],
            [0,1,0,0,1,0,0,0,1,1,0,0,0,1,0,1,0,1,0,0,1,0,1,1,0],
            [1,1,1,0,0,1,1,1,0,0,1,1,1,0,1,0,1,0,1,1,0,1,0,0,1],
            [0,0,0,1,1,0,0,0,1,1,0,0,0,1,0,1,0,1,0,0,1,0,1,1,0],
            [1,0,1,0,1,1,1,1,0,0,1,1,1,0,1,0,1,0,1,1,0,1,0,0,1],
            [0,1,0,1,0,0,0,0,1,1,0,0,0,1,0,1,0,1,0,0,1,0,1,1,0],
            [1,1,1,0,1,1,1,1,0,0,1,1,1,0,1,0,1,0,1,1,0,1,0,0,1],
            [0,0,0,1,0,0,0,0,1,1,0,0,0,1,0,1,0,1,0,0,1,0,1,1,0],
            [1,0,1,0,1,1,1,1,0,0,1,1,1,0,1,0,1,0,1,1,0,1,0,0,1],
            [0,0,0,0,0,0,0,0,1,0,1,0,1,0,1,1,1,1,1,1,1,0,0,1,1],
            [1,1,1,1,1,1,1,0,0,1,0,1,0,1,0,1,0,0,0,0,1,0,1,0,1],
            [1,0,0,0,0,0,1,0,1,1,1,0,1,0,1,1,0,1,1,1,1,0,0,1,0],
            [1,0,1,1,1,0,1,0,0,0,1,1,0,1,0,1,0,1,1,1,1,0,1,1,1],
            [1,0,1,1,1,0,1,0,1,0,0,1,1,0,1,1,0,1,1,1,1,0,0,0,1],
            [1,0,0,0,0,0,1,0,1,1,0,0,1,1,0,1,0,0,0,0,1,0,1,0,0],
            [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1,0,0,1,1],
            [0,0,0,0,0,0,0,0,0,1,1,0,0,1,0,0,0,0,0,0,0,0,1,1,0]
        ];
        
        // 패턴 그리기
        for (let row = 0; row < 25; row++) {
            for (let col = 0; col < 25; col++) {
                if (qrPattern[row] && qrPattern[row][col] === 1) {
                    ctx.fillRect(
                        qrX + col * cellSize,
                        qrY + row * cellSize,
                        cellSize,
                        cellSize
                    );
                }
            }
        }
        
        // QR 라벨
        ctx.fillStyle = '#666666';
        ctx.font = '9px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('QR CODE', qrX + qrSize/2, qrY + qrSize + 12);
    }
    
    // QR 코드 모서리 마커 그리기
    drawQRMarker(ctx, x, y, size) {
        // 외곽 사각형
        ctx.fillStyle = '#000000';
        ctx.fillRect(x, y, size, size);
        
        // 내부 흰색 사각형
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x + size/3, y + size/3, size/3, size/3);
        
        // 중앙 검은 사각형
        ctx.fillStyle = '#000000';
        const centerSize = size/5;
        const centerOffset = (size - centerSize) / 2;
        ctx.fillRect(x + centerOffset, y + centerOffset, centerSize, centerSize);
    }
    
    // 정렬 패턴 그리기 (작은 마커)
    drawAlignmentPattern(ctx, x, y, size) {
        // 외곽 검은 테두리
        ctx.fillStyle = '#000000';
        ctx.fillRect(x, y, size, size);
        
        // 내부 흰색
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x + size/5, y + size/5, size * 3/5, size * 3/5);
        
        // 중앙 검은 점
        ctx.fillStyle = '#000000';
        const centerSize = size/5;
        ctx.fillRect(
            x + (size - centerSize) / 2,
            y + (size - centerSize) / 2,
            centerSize,
            centerSize
        );
    }
    
    // QR 기능 영역 확인 헬퍼 (마커, 타이밍, 정렬 패턴 영역)
    isQRFunctionArea(row, col) {
        // 상단 좌측 마커 (0-8, 0-8)
        if (row <= 8 && col <= 8) return true;
        // 상단 우측 마커 (0-8, 13-20)
        if (row <= 8 && col >= 13) return true;
        // 하단 좌측 마커 (13-20, 0-8)
        if (row >= 13 && col <= 8) return true;
        
        // 타이밍 패턴 (6행/6열)
        if (row === 6 || col === 6) return true;
        
        // 정렬 패턴 영역 (12-18, 12-18)
        if (row >= 12 && row <= 18 && col >= 12 && col <= 18) return true;
        
        return false;
    }
}

// 게임 시작
const game = new DiceGame();

// 페이지 로드 완료 후 추가 설정
document.addEventListener('DOMContentLoaded', function() {
    // 주사위 각 면의 점 패턴 설정
    setupDiceFaces();
});

function setupDiceFaces() {
    const faces = document.querySelectorAll('.dice-face');
    
    // 각 면의 점 패턴 설정
    const patterns = {
        front: [1], // 1
        right: [1, 1], // 2  
        top: [1, 1, 1], // 3
        bottom: [1, 1, 1, 1], // 4
        left: [1, 1, 1, 1, 1], // 5
        back: [1, 1, 1, 1, 1, 1] // 6
    };
    
    faces.forEach(face => {
        const className = Array.from(face.classList).find(cls => cls !== 'dice-face');
        if (patterns[className]) {
            const dotsCount = patterns[className].length;
            const dots = face.querySelectorAll('.dot');
            
            // 해당하는 개수만큼만 표시
            dots.forEach((dot, index) => {
                if (index < dotsCount) {
                    dot.style.display = 'block';
                } else {
                    dot.style.display = 'none';
                }
            });
            
            // 점 배치 조정
            adjustDotLayout(face, dotsCount);
        }
    });
}

function adjustDotLayout(face, count) {
    const dots = face.querySelectorAll('.dot');
    face.style.display = 'grid';
    
    switch(count) {
        case 1:
            face.style.gridTemplate = '1fr / 1fr';
            face.style.placeItems = 'center';
            break;
        case 2:
            face.style.gridTemplate = '1fr 1fr / 1fr';
            face.style.placeItems = 'center';
            break;
        case 3:
            face.style.gridTemplate = '1fr 1fr 1fr / 1fr';
            face.style.placeItems = 'center';
            break;
        case 4:
            face.style.gridTemplate = '1fr 1fr / 1fr 1fr';
            face.style.placeItems = 'center';
            break;
        case 5:
            face.style.gridTemplate = '1fr 1fr 1fr / 1fr 1fr';
            face.style.placeItems = 'center';
            dots[2].style.gridColumn = '1 / 3';
            break;
        case 6:
            face.style.gridTemplate = '1fr 1fr 1fr / 1fr 1fr';
            face.style.placeItems = 'center';
            break;
    }
} 