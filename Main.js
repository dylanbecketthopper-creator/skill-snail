{\rtf1\ansi\ansicpg1252\cocoartf2822
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 let xp = 0;\
let streak = 0;\
let step = 0;\
let steps = [];\
\
const homePage = document.getElementById("home");\
const lessonPage = document.getElementById("lesson");\
const stepContent = document.getElementById("stepContent");\
const progressBar = document.getElementById("progress");\
const xpDisplay = document.getElementById("xp");\
const streakDisplay = document.getElementById("streak");\
const lessonWindow = document.querySelector(".lesson-window");\
\
// Feedback text\
const feedbackEl = document.createElement("p");\
feedbackEl.style.marginTop = "0.5rem";\
feedbackEl.style.fontWeight = "bold";\
stepContent.appendChild(feedbackEl);\
\
// ------------------- PAGES -------------------\
function goHome() \{\
  homePage.classList.remove("hidden");\
  lessonPage.classList.add("hidden");\
\}\
\
// Start lesson: fetch AI-generated steps from Netlify function\
async function startLesson() \{\
  homePage.classList.add("hidden");\
  lessonPage.classList.remove("hidden");\
  step = 0;\
  stepContent.innerHTML = "<p>Loading AI lesson...</p>";\
\
  try \{\
    const res = await fetch("/.netlify/functions/getLesson");\
    steps = await res.json();\
    renderStep();\
  \} catch (err) \{\
    console.error(err);\
    alert("Failed to load AI lesson. Make sure the Netlify function is working.");\
    steps = [\
      \{ title:"Error", content:"AI lesson could not be loaded." \}\
    ];\
    renderStep();\
  \}\
\}\
\
// ------------------- RENDER STEP -------------------\
function renderStep() \{\
  const s = steps[step];\
  stepContent.innerHTML = `<h2>$\{s.title\}</h2><p>$\{s.content\}</p>`;\
  lessonWindow.classList.remove("correct");\
\
  // Re-attach feedback element\
  stepContent.appendChild(feedbackEl);\
  feedbackEl.textContent = "";\
\
  // Multiple choice\
  if (s.choices) \{\
    s.choices.forEach(choice => \{\
      const btn = document.createElement("button");\
      btn.textContent = choice;\
      btn.style.display = "block";\
      btn.style.margin = "0.5rem 0";\
      btn.onclick = () => \{\
        let correct = false;\
        // Step 2: key terms quiz\
        if (step === 1 && choice === s.correct) correct = true;\
        // Step 3: categorize expenses\
        if (step === 2 && (s.need?.includes(choice) || s.want?.includes(choice))) correct = true;\
\
        if (correct) \{\
          feedbackEl.textContent = "\uc0\u55356 \u57225  Correct!";\
          lessonWindow.classList.add("correct");\
          xp += 5;\
          streak += 1;\
        \} else \{\
          feedbackEl.textContent = "\uc0\u10060  Wrong, try again!";\
        \}\
        updateStats();\
      \};\
      stepContent.appendChild(btn);\
    \});\
  \}\
\
  // Input challenge\
  if (s.input) \{\
    const input = document.createElement("input");\
    input.type = "number";\
    input.placeholder = "Enter amount";\
    input.style.display = "block";\
    input.style.marginTop = "0.5rem";\
    stepContent.appendChild(input);\
\
    const btn = document.createElement("button");\
    btn.textContent = "Check";\
    btn.style.display = "block";\
    btn.style.marginTop = "0.5rem";\
    btn.onclick = () => \{\
      if (Number(input.value) === s.answer) \{\
        feedbackEl.textContent = "\uc0\u55356 \u57225  Correct!";\
        lessonWindow.classList.add("correct");\
        xp += 5;\
        streak += 1;\
      \} else \{\
        feedbackEl.textContent = "\uc0\u10060  Wrong, try again!";\
      \}\
      updateStats();\
    \};\
    stepContent.appendChild(btn);\
  \}\
\
  // Update progress bar\
  progressBar.style.width = `$\{((step + 1) / steps.length) * 100\}%`;\
\}\
\
// ------------------- NAVIGATION -------------------\
function nextStep() \{\
  if (step < steps.length - 1) \{\
    step++;\
    renderStep();\
  \} else \{\
    goHome();\
  \}\
\}\
\
function prevStep() \{\
  if (step > 0) \{\
    step--;\
    renderStep();\
  \}\
\}\
\
// ------------------- XP/STREAK UPDATE -------------------\
function updateStats() \{\
  xpDisplay.textContent = `XP: $\{xp\}`;\
  streakDisplay.textContent = `Streak: $\{streak\} \uc0\u55357 \u56613 `;\
  xpDisplay.classList.add("bounce");\
  setTimeout(() => xpDisplay.classList.remove("bounce"), 600);\
\}}