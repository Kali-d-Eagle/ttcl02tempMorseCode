// if (localStorage.getItem("auth") !== "true") {
//   window.location.href = "login.html";
// }

document.getElementById("logoutBtn").onclick = () => {
  localStorage.removeItem("auth");
  window.location.href = "login.html";
};

document.addEventListener("DOMContentLoaded", () => {

    // ===== Morse Dictionary =====
    const morseCode = {
      A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.", G: "--.", H: "....", I: "..",
      J: ".---", K: "-.-", L: ".-..", M: "--", N: "-.", O: "---", P: ".--.", Q: "--.-", R: ".-.",
      S: "...", T: "-", U: "..-", V: "...-", W: ".--", X: "-..-", Y: "-.--", Z: "--..",
      0: "-----", 1: ".----", 2: "..---", 3: "...--", 4: "....-", 5: ".....",
      6: "-....", 7: "--...", 8: "---..", 9: "----.", " ": "/"
    };
  
    const reverseMorse = {};
    for (let key in morseCode) reverseMorse[morseCode[key]] = key;
  
    // ===== DOM =====
    const input = document.getElementById("input");
    const textOutput = document.getElementById("textOutput");
    const morseOutput = document.getElementById("morseOutput");
    const translateBtn = document.getElementById("translateBtn");
    const voiceBtn = document.getElementById("voiceBtn");
  
    // ===== AUDIO =====
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const unit = 0.2;
  
    function beep(duration, startTime) {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
  
      osc.type = "sine";
      osc.frequency.setValueAtTime(600, startTime);
  
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.2, startTime + 0.01);
      gain.gain.linearRampToValueAtTime(0, startTime + duration);
  
      osc.connect(gain);
      gain.connect(audioCtx.destination);
  
      osc.start(startTime);
      osc.stop(startTime + duration);
    }
  
    function render(text) {
      textOutput.innerHTML = "";
      morseOutput.innerHTML = "";
  
      let morseList = [];
  
      text.split("").forEach(char => {
        const span = document.createElement("span");
        span.textContent = char;
        textOutput.appendChild(span);
  
        const morse = morseCode[char] || "";
        morseList.push(morse);
  
        const mSpan = document.createElement("span");
        mSpan.textContent = morse + " ";
        morseOutput.appendChild(mSpan);
      });
  
      return morseList;
    }
  
    async function play(morseList) {
      let time = audioCtx.currentTime;
  
      const textSpans = textOutput.querySelectorAll("span");
      const morseSpans = morseOutput.querySelectorAll("span");
  
      for (let i = 0; i < morseList.length; i++) {
  
        textSpans[i].classList.add("active");
        morseSpans[i].classList.add("active");
  
        for (let symbol of morseList[i]) {
          if (symbol === ".") {
            beep(unit, time);
            time += unit;
          } else if (symbol === "-") {
            beep(unit * 3, time);
            time += unit * 3;
          }
          time += unit;
        }
  
        await new Promise(r => setTimeout(r, (time - audioCtx.currentTime) * 1000));
  
        textSpans[i].classList.remove("active");
        morseSpans[i].classList.remove("active");
  
        time += unit * 2;
      }
    }
  
    
    function translate(text) {
      if (!text) return;
  
      text = text.toUpperCase();
  
      if (text.includes(".") || text.includes("-")) {
        let words = text.split(" / ");
        let result = words.map(w =>
          w.split(" ").map(c => reverseMorse[c] || "").join("")
        ).join(" ");
  
        textOutput.textContent = result;
        morseOutput.textContent = text;
      } else {
        const morseList = render(text);
        play(morseList);
      }
    }
  
    translateBtn.addEventListener("click", () => {
      audioCtx.resume();
      translate(input.value.trim());
    });
  
    // ===== 🎤 BROWSER SPEECH API =====
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
  
    if (SpeechRecognition) {
  
      const recognition = new SpeechRecognition();
  
      recognition.lang = "en-US";
      recognition.continuous = false;
      recognition.interimResults = false;
  
      voiceBtn.addEventListener("click", () => {
        audioCtx.resume();
  
        try {
          recognition.start();
          voiceBtn.textContent = "🎙️ Listening...";
        } catch (e) {
          console.log("Already started");
        }
      });
  
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        input.value = transcript;
        voiceBtn.textContent = "🎤 Speak";
      };
  
      recognition.onerror = (event) => {
        console.error("Speech Error:", event.error);
  
        if (event.error === "network") {
          alert("Network issue ⚠️ Try again or switch network.");
        } else if (event.error === "not-allowed") {
          alert("Allow microphone access.");
        } else if (event.error === "no-speech") {
          alert("Didn't catch that. Speak clearly.");
        }
  
        voiceBtn.textContent = "🎤 Speak";
      };
  
      recognition.onend = () => {
        voiceBtn.textContent = "🎤 Speak";
      };
  
    } else {
      voiceBtn.disabled = true;
      voiceBtn.textContent = "Not Supported";
    }
  
  });


  // ===== PROFILE DROPDOWN =====
const profile = document.getElementById("profile");

profile.addEventListener("click", () => {
  profile.classList.toggle("active");
});

// CLOSE DROPDOWN WHEN CLICK OUTSIDE
document.addEventListener("click", (e) => {
  if (!profile.contains(e.target)) {
    profile.classList.remove("active");
  }
});

// ===== LOGOUT =====
document.getElementById("logoutBtn").onclick = () => {
  localStorage.removeItem("auth");
  window.location.href = "login.html";
};

// ===== USERNAME DISPLAY =====
document.getElementById("userNameDisplay").textContent = "userXYZ";

// ===== THEME TOGGLE =====
const themeBtn = document.getElementById("themeToggle");

themeBtn.onclick = () => {
  document.body.classList.toggle("light");

  themeBtn.textContent =
    document.body.classList.contains("light") ? "🌞" : "🌙";
};




