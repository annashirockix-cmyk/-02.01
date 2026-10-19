/* ============================================================
   extra.js — Единый банк данных и логика переключения
   ============================================================ */
"use strict";

// 1. ДАННЫЕ КУРСОВ (Сокращенные примеры, вставьте свои полные версии)
window.MDK_DATA = {
  "04.01": {
    title: "МДК 04.01. Диагностика, планирование, организация работ и контроль качества...",
    module: "ПМ.04 Организация контроля, наладки и технического обслуживания...",
    // ... Остальные данные 04.01 (sections, passports, safety, final) ...
    sections: [
      {
        code: "Раздел 1", title: "Диагностика металлообрабатывающего оборудования",
        topics: [
          {
            id: "t11", code: "Тема 1.1", title: "Принципы, виды и методы диагностирования оборудования",
            lectures: [{ code: "1.1.1", title: "Диагностирование как часть ТО", content: "<p>Текст лекции 04.01...</p>" }],
            practicals: [], selfChecks: [], test: [{ q: "Вопрос по диагностике?", options: ["А","Б","В","Г"], correct: 0 }]
          }
        ]
      }
    ]
  },
  "07.01": {
    title: "МДК 07.01. Технология обработки деталей на станках с программным управлением",
    module: "ПМ.07 Выполнение работ по профессии 16045 «Оператор станков с программным управлением»",
    // ... Остальные данные 07.01 (sections, passports, safety, final) ...
    sections: [
      {
        code: "Раздел 1", title: "Изучение последовательности технологии обработки на токарных станках",
        topics: [
          {
            id: "t11", code: "Тема 1.1", title: "Общие основы работы на токарных станках",
            lectures: [{ code: "1.1.1", title: "Техника безопасности", content: "<p>Текст лекции 07.01...</p>" }],
            practicals: [], selfChecks: [], test: [{ q: "Вопрос по ЧПУ?", options: ["А","Б","В","Г"], correct: 1 }]
          }
        ]
      }
    ]
  }
};

// 2. ИНИЦИАЛИЗАЦИЯ КУРСА
window.initCourseData = function() {
    var savedMdk = localStorage.getItem("mdk.active") || "04.01";
    var selector = document.getElementById("mdkSelector");
    
    if (selector) {
        selector.value = savedMdk;
        selector.onchange = function(e) {
            localStorage.setItem("mdk.active", e.target.value);
            // Перезагружаем страницу, чтобы применить новые данные и очистить кэш
            location.reload(); 
        };
    }

    // Устанавливаем глобальный COURSE
    window.COURSE = window.MDK_DATA[savedMdk];
    
    // Обновляем бейдж в шапке
    var badge = document.getElementById("brandBadge");
    if (badge) badge.textContent = "МДК " + savedMdk;
};

// Вызываем инициализацию до того, как отработает роутинг
window.initCourseData();

// 3. СМЕРТЕЛЬНАЯ ВЕЧЕРИНКА (Адаптированная под оба курса)
window.renderDeadlyPartyPage = function(){
  var app = document.getElementById("app"); app.innerHTML = "";
  document.getElementById("crumbs").textContent = "Смертельная вечеринка";
  app.appendChild(el('<a class="backlink" href="#/">← На главную</a>'));

  var activeMdk = localStorage.getItem("mdk.active") || "04.01";
  
  var allQuestions = [];
  if (activeMdk === "04.01") {
      allQuestions = [
          { q: "Что такое техническое диагностирование?", options: ["Определение техсостояния", "Ремонт", "Наладка", "Сборка"], correct: 0 },
          { q: "Какой метод основан на вибрации?", options: ["Тепловой", "Виброакустический", "Электрический", "Лабораторный"], correct: 1 },
          { q: "Норма вибрации шпинделя", options: ["≤2,8 мм/с", "≤10 мм/с", "≤5 мм/с", "≤0,1 мм/с"], correct: 0 }
          // ... добавьте остальные вопросы для 04.01
      ];
  } else {
      allQuestions = [
          { q: "Что означает G00?", options: ["Быстрое позиционирование", "Линейная интерполяция", "Пауза", "Резьба"], correct: 0 },
          { q: "Что означает M03?", options: ["Стоп шпинделя", "Шпиндель по часовой", "Смена инструмента", "Конец"], correct: 1 },
          { q: "Угол профиля метрической резьбы", options: ["55°", "60°", "30°", "33°"], correct: 1 }
          // ... добавьте остальные вопросы для 07.01
      ];
  }

  var questions = allQuestions.sort(() => 0.5 - Math.random()).slice(0, 5);
  var currentQ = 0, lives = 3;

  function renderQ(){
    app.innerHTML = "";
    app.appendChild(el('<a class="backlink" href="#/">← На главную</a>'));
    app.appendChild(el('<section class="module" style="background:#1a0a0a;border:2px solid #ff003c;color:#fff; padding:20px;"><div style="display:flex;justify-content:space-between;margin-bottom:16px;font-size:14px;"><span>Вопрос ' + (currentQ + 1) + ' / ' + questions.length + '</span><span>❤️ '.repeat(lives) + '🤍 '.repeat(3 - lives) + '</span></div><h2 style="margin:0 0 20px 0;color:#ff003c; font-size:20px; line-height:1.4;">' + escapeHtml(questions[currentQ].q) + '</h2><div id="qOptions"></div></section>'));
    var qo = document.getElementById("qOptions");
    questions[currentQ].options.forEach(function(opt, idx){
      var b = el('<button class="btn" style="width:100%;margin-bottom:8px;text-align:left;background:#2a0a0a;border:1px solid #ff003c;color:#fff;font-size:14px; padding:12px;">' + escapeHtml(opt) + '</button>');
      b.onclick = function(){
        if (idx === questions[currentQ].correct) {
          currentQ++;
          if (currentQ >= questions.length) {
            app.innerHTML = ""; app.appendChild(el('<a class="backlink" href="#/">← На главную</a>'));
            app.appendChild(el('<section class="module" style="text-align:center;background:#0a1a0a;border:2px solid #00ff00;color:#fff;padding:50px;"><h1 style="color:#00ff00;">Вы выжили!</h1><button class="btn" style="margin-top:20px;" onclick="if(window.addXP) window.addXP(100);location.hash=\'#/\'">+100 XP и на главную</button></section>'));
          } else renderQ();
        } else {
          lives--;
          if (lives <= 0) {
            app.innerHTML = ""; app.appendChild(el('<a class="backlink" href="#/">← На главную</a>'));
            app.appendChild(el('<section class="module" style="text-align:center;background:#1a0000;border:2px solid #ff003c;color:#fff;padding:50px;"><h1 style="color:#ff003c;">Проигрыш</h1><button class="btn" style="margin-top:20px;" onclick="window.renderDeadlyPartyPage()">Заново</button></section>'));
          } else {
             window.showToast("❌ Неверно! Осталось жизней: " + lives, "err");
          }
        }
      };
      qo.appendChild(b);
    });
  }
  renderQ();
};