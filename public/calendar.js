// 기존 경고 메시지 처리
function checkForAlert() {
    const urlParams = new URLSearchParams(window.location.search);
    const alertMessage = urlParams.get('alert'); // 'alert' 키 값 확인

    if (alertMessage) {
        alert(decodeURIComponent(alertMessage));
        history.replaceState({}, document.title, window.location.pathname);
    }
}
window.onload = checkForAlert;

// 특정 날짜의 경기를 select로 표시
async function showGameOptions(date, event) {
    try {
        // schedule.json 데이터 로드
        const response = await fetch("schedule.json");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const schedule = await response.json();

        // 날짜를 "09.19(목)" 형식으로 변환
        const dateObj = new Date(date);
        const formattedDate = `${String(dateObj.getMonth() + 1).padStart(2, '0')}.${String(dateObj.getDate()).padStart(2, '0')}(${['일', '월', '화', '수', '목', '금', '토'][dateObj.getDay()]})`;

        // 해당 날짜의 경기 필터링
        const gamesOnDate = schedule.filter(game => game.day === formattedDate);

        if (gamesOnDate.length === 0) {
            alert("해당 날짜에 경기가 없습니다.");
            return;
        }

        // 기존 select 제거
        const existingSelect = document.getElementById("dynamicGameSelect");
        if (existingSelect) existingSelect.remove();

        // select 엘리먼트 생성
        const select = document.createElement("select");
        select.id = "dynamicGameSelect"; // id 추가
        select.classList.add("form-select", "form-select-sm");
        select.setAttribute("aria-label", "Small select example");

        const defaultOption = document.createElement("option");
        defaultOption.selected = true;
        defaultOption.textContent = "경기 선택";
        select.appendChild(defaultOption);

        // 경기 옵션 추가 (점수 제거)
        gamesOnDate.forEach((game, index) => {
            const option = document.createElement("option");

            // 점수 제거하고 팀명만 추출 (정규식 사용)
            const gameContentRegex = /([가-힣a-zA-Z]+)\d*vs\d*([가-힣a-zA-Z]+)/;
            const match = gameContentRegex.exec(game.gameContent);

            if (match) {
                option.value = index;
                option.textContent = `${match[1]} vs ${match[2]}`;
            } else {
                option.value = index;
                option.textContent = game.gameContent; // 기본 텍스트
            }

            select.appendChild(option);
        });

        // 선택 시 diary.html로 이동
        select.addEventListener("change", () => {
            const selectedIndex = select.value;
            if (selectedIndex) {
                const selectedGame = gamesOnDate[selectedIndex];
                window.location.href = `diary.html?date=${date}&game=${encodeURIComponent(selectedGame.gameContent)}`;
            }
        });

        // 동적으로 select 위치 설정
        select.style.position = "absolute";
        select.style.left = `${event.pageX}px`;
        select.style.top = `${event.pageY}px`;
        select.style.zIndex = "1000";

        document.body.appendChild(select);

        // select가 포커스를 잃으면 제거
        select.addEventListener("blur", () => {
            select.remove();
        });

        // select 표시 후 포커스
        select.focus();
    } catch (error) {
        console.error("Error loading game data:", error);
    }
}

// 캔버스에 월 숫자 표시
function drawMonth() {
    const canvas = document.getElementById("monthCanvas");
    const ctx = canvas.getContext("2d");

    // 캔버스 초기화
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 현재 월 가져오기
    const currentMonth = new Date().getMonth() + 1;

    // 텍스트 스타일 설정
    ctx.font = "bold 40px Arial"; // 글꼴 크기와 스타일
    ctx.fillStyle = "black"; // 텍스트 색상
    ctx.textAlign = "center"; // 텍스트 정렬
    ctx.textBaseline = "middle"; // 텍스트 기준선

    // 텍스트를 캔버스 중앙에 그리기
    ctx.fillText(`${currentMonth}`, canvas.width / 2, canvas.height / 2);
}

// 캘린더를 렌더링하는 함수
function renderCalendar() {
    const calendarGrid = document.getElementById("calendarGrid");
    calendarGrid.innerHTML = `
        <div class="day-header">SUN</div>
        <div class="day-header">MON</div>
        <div class="day-header">TUE</div>
        <div class="day-header">WED</div>
        <div class="day-header">THU</div>
        <div class="day-header">FRI</div>
        <div class="day-header">SAT</div>
    `;

    const savedImages = JSON.parse(localStorage.getItem("calendarImages")) || {};

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // 빈 칸 추가
    for (let i = 0; i < firstDay.getDay(); i++) {
        const emptyDiv = document.createElement("div");
        calendarGrid.appendChild(emptyDiv);
    }

    // 날짜 렌더링
    for (let day = 1; day <= lastDay.getDate(); day++) {
        const dateDiv = document.createElement("div");
        dateDiv.classList.add("calendar-day");
        dateDiv.textContent = day;

        const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        // 저장된 이미지가 있으면 날짜에 표시
        if (savedImages[formattedDate]) {
            const img = document.createElement("img");
            img.src = savedImages[formattedDate];
            img.classList.add("day-image");
            dateDiv.appendChild(img);
        }

        calendarGrid.appendChild(dateDiv);
    }
}

// 페이지 초기화 및 캘린더 렌더링
window.onload = () => {
    checkForAlert();
    drawMonth();
    renderCalendar();
};
