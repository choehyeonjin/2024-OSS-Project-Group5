async function loadDiaryData() {
    // URL에서 날짜 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    const selectedDate = urlParams.get('date');
    const selectedGameContent = urlParams.get('game');

    if (!selectedDate) {
        window.location.href = "calendar.html?alert=날짜가 선택되지 않았습니다.";
        return;
    }

    if (!selectedGameContent) {
        window.location.href = "calendar.html?alert=경기가 선택되지 않았습니다.";
        return;
    }

    // 날짜 형식을 schedule.json에 맞게 변환
    const dateObj = new Date(selectedDate);
    const formattedDate = `${String(dateObj.getMonth() + 1).padStart(2, '0')}.${String(dateObj.getDate()).padStart(2, '0')}(${['일', '월', '화', '수', '목', '금', '토'][dateObj.getDay()]})`;

    try {
        // schedule.json 데이터 로드
        const response = await fetch("schedule.json");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const schedule = await response.json();

        // 해당 날짜 데이터 필터링
        const gamesOnSelectedDate = schedule.filter(game => game.day === formattedDate);

        if (gamesOnSelectedDate.length === 0) {
            window.location.href = "calendar.html?alert=해당 날짜에 경기가 없습니다.";
            return;
        }

        // URL에서 전달된 게임 내용과 일치하는 경기 찾기
        const game = gamesOnSelectedDate.find(game => game.gameContent === selectedGameContent);

        if (!game) {
            window.location.href = "calendar.html?alert=선택한 경기를 찾을 수 없습니다.";
            return;
        }

        // html 요소 가져오기
        const gameDateInput = document.getElementById("game-date");
        const gameTimeInput = document.getElementById("game-time");
        const stadiumSelect = document.getElementById("stadium");
        const weatherSelect = document.getElementById("game-weather");
        const resultSelect = document.getElementById('result');
        const homeTeamLogo = document.querySelector('.scoreboard img[alt="홈 팀 로고"]');
        const awayTeamLogo = document.querySelector('.scoreboard img[alt="어웨이 팀 로고"]');
        const homeTeamName = document.querySelector('.scoreboard p[aria-label="Home Team Name"]');
        const awayTeamName = document.querySelector('.scoreboard p[aria-label="Away Team Name"]');
        const homeTeamScore = document.querySelector(".scoreboard input[aria-label='Home Team Score']");
        const awayTeamScore = document.querySelector(".scoreboard input[aria-label='Away Team Score']");

        // 팀 로고 매핑 
        const logoMapping = {
            "키움": "logos/kiwoom.png",
            "두산": "logos/doosan.png",
            "LG": "logos/lg.png",
            "KT": "logos/kt.png",
            "SSG": "logos/ssg.png",
            "KIA": "logos/kia.png",
            "삼성": "logos/samsung.png",
            "한화": "logos/hanhwa.png",
            "NC": "logos/nc.png",
            "롯데": "logos/lotte.png"
        };
        // 팀명 매핑
        const nameMapping = {
            "키움": "키움 히어로즈",
            "두산": "두산 베어스",
            "LG": "LG 트윈스",
            "KT": "kt wiz",
            "SSG": "SSG 랜더스",
            "KIA": "KIA 타이거즈",
            "삼성": "삼성 라이온즈",
            "한화": "한화 이글스",
            "NC": "NC 다이노스",
            "롯데": "롯데 자이언츠",
        };
        // 구장 매핑
        const stadiumMapping = {
            "창원": "NC 파크",
            "수원": "케이티 위즈 파크",
            "잠실": "잠실",
            "문학": "랜더스 필드",
            "사직": "사직",
            "대구": "삼성 라이온즈 파크",
            "광주": "챔피언스 필드",
            "대전": "이글스 파크",
            "고척": "고척"
        };

        // 경기 날짜 설정
        if (gameDateInput) gameDateInput.value = selectedDate.replace(/\./g, '-');

        // 경기 시간 설정
        if (gameTimeInput) gameTimeInput.value = game.time;

        // 날씨 설정 (rain 값에 따라 변경)
        if (weatherSelect) {
            if (game.rain === 1) {
                weatherSelect.value = "비";
                resultSelect.value = "rain";
            } else {
                weatherSelect.value = "맑음"; // 기본값을 맑음으로 설정
            }
        }

        // 구장 설정
        if (stadiumSelect)  stadiumSelect.value = stadiumMapping[game.stadium];

        // 경기 내용 파싱
        const gameContentRegex = /([가-힣a-zA-Z]+)(\d*)vs(\d*)([가-힣a-zA-Z]+)/;
        const match = gameContentRegex.exec(game.gameContent);

        if (!match) {
            console.error(`Invalid game content format: ${game.gameContent}`);
            window.location.href = "calendar.html?alert=경기 데이터를 분석할 수 없습니다.";
            return;
        }

        const [, homeTeam, homeScore = "0", awayScore = "0", awayTeam] = match;

        // 홈 팀 정보 설정
        if (homeTeamLogo) {
            homeTeamLogo.src = logoMapping[homeTeam];
            homeTeamLogo.alt = homeTeam;
        }
        if (homeTeamName) homeTeamName.textContent = nameMapping[homeTeam];
        if (homeTeamScore) homeTeamScore.value = homeScore;

        // 어웨이 팀 정보 설정
        if (awayTeamLogo) {
            awayTeamLogo.src = logoMapping[awayTeam];
            awayTeamLogo.alt = awayTeam;
        }
        if (awayTeamName) awayTeamName.textContent = nameMapping[awayTeam];
        if (awayTeamScore) awayTeamScore.value = awayScore;

    } catch (error) {
        console.error("Error loading game data:", error);
        window.location.href = "calendar.html?alert=경기 데이터를 불러오는 데 실패했습니다.";
        return;
    }
}

loadDiaryData(); // 페이지 로드 시 실행

//다이어리 내용-DB연동부분
const firebaseConfig = {
    apiKey: "AIzaSyAx3iFpiJFVA_UTyHSKw0m1Ke2GEns1TJA",
    authDomain: "yyjdb-1e121.firebaseapp.com",
    projectId: "yyjdb-1e121",
    storageBucket: "yyjdb-1e121.appspot.com",
    messagingSenderId: "455353963754",
    appId: "1:455353963754:web:2a64f5411a4061e9143393"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();



let isSaving = false; // 저장 중인지 확인하는 변수

async function saveDiary() {
    if (isSaving) return; // 이미 저장 중이면 함수 종료
    isSaving = true; // 저장 중 상태로 변경

    try {
        // 라인업 데이터 수집
        const homeTeamLineup = Array.from(document.querySelectorAll('.home-team .lineup-input input'))
            .map(input => input.value.trim());
        const awayTeamLineup = Array.from(document.querySelectorAll('.away-team .lineup-input input'))
            .map(input => input.value.trim());

        // 기타 데이터 수집
        const diaryData = {
            gameDate: document.getElementById("game-date").value,
            gameTime: document.getElementById("game-time").value,
            weather: document.getElementById("game-weather").value,
            stadium: document.getElementById("stadium").value,
            result: document.getElementById("result").value,
            homeTeamScore: parseInt(document.querySelector("[data-score='home']").value) || 0,
            awayTeamScore: parseInt(document.querySelector("[data-score='away']").value) || 0,
            mvp: document.getElementById("mvp").value,
            diary: document.getElementById("diary-entry").value,
            homeTeamLineup,
            awayTeamLineup,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        // 이미지 업로드
        const fileInput = document.getElementById("fieldImage");
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const storageRef = storage.ref(`diaryImages/${Date.now()}_${file.name}`);
            const snapshot = await storageRef.put(file);
            diaryData.imageURL = await snapshot.ref.getDownloadURL();
        }

        // Firestore 저장
        await db.collection("Diaries").add(diaryData);
        alert("일기가 저장되었습니다!");
        window.location.href = "calendar.html";
    } catch (error) {
        console.error("Error saving diary:", error);
        alert("저장 중 문제가 발생했습니다.");
    } finally {
        isSaving = false; // 저장 완료 후 상태 초기화
    }
}

// Save 버튼 이벤트 리스너
document.querySelector(".save-button").addEventListener("click", saveDiary);
