import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

// --- Animations CSS ---
const styles = `
@keyframes pulseCorrect {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}
.pulse-correct {
  animation: pulseCorrect 0.4s ease;
}

@keyframes flashCorrect {
  0% { background-color: rgba(255,255,255,0.3); border-color: rgba(255,255,255,0.4); }
  50% { background-color: rgba(255,255,255,0.8); border-color: white; }
  100% { background-color: rgba(255,255,255,0.3); border-color: rgba(255,255,255,0.4); }
}
.flash-correct {
  animation: flashCorrect 0.6s ease;
}

@keyframes bounceXP {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.3); }
}
.bounce-xp {
  animation: bounceXP 0.6s ease;
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
.animate-gradient {
  background: linear-gradient(135deg, #ffe5b4, #4169e1); /* royal blue */
  background-size: 400% 400%;
  animation: gradientShift 20s ease infinite;
}

@keyframes slideSnail {
  0% { transform: translateX(-50%); }
  50% { transform: translateX(50%); }
  100% { transform: translateX(-50%); }
}
.snail-slide {
  animation: slideSnail 20s linear infinite;
}
`;

// Inject styles into document
if (typeof document !== 'undefined' && !document.getElementById('lesson-animations')) {
  const styleEl = document.createElement('style');
  styleEl.id = 'lesson-animations';
  styleEl.innerHTML = styles;
  document.head.appendChild(styleEl);
}

// --- UI Components ---
const Navbar = ({ setPage }) => (
  <nav className="flex justify-between items-center px-6 py-4 m-4 rounded-2xl backdrop-blur-lg bg-white/20 border border-white/30 shadow-lg text-white">
    <h1 className="text-2xl font-bold cursor-pointer hover:scale-105 transition" onClick={() => setPage('home')}>Skill Snail 🐌</h1>
    <div className="flex gap-4">
      <button onClick={() => setPage('home')} className="px-4 py-2 rounded-xl backdrop-blur-md bg-white/30 border border-white/40 hover:bg-white hover:text-black transition transform hover:scale-105">Home</button>
      <button onClick={() => setPage('lesson')} className="px-4 py-2 rounded-xl backdrop-blur-md bg-white/30 border border-white/40 hover:bg-white hover:text-black transition transform hover:scale-105">Lesson</button>
    </div>
  </nav>
);

const HomePage = ({ setPage, xp, streak }) => {
  const [xpBounce, setXpBounce] = useState(false);

  useEffect(() => {
    if (xp > 0) {
      setXpBounce(true);
      const timer = setTimeout(() => setXpBounce(false), 600);
      return () => clearTimeout(timer);
    }
  }, [xp]);

  return (
    <div className="flex flex-col justify-between items-center text-center text-black min-h-screen p-6 relative overflow-hidden">
      <div className="flex flex-col justify-center items-center flex-grow">
        <h2 className="text-4xl font-bold mb-4 text-black">Learn Real-Life Skills</h2>
        <p className="mb-6 max-w-2xl text-lg text-black">Forget boring school subjects you’ll never use. Skill Snail 🐌 helps you master the things that really matter — from finances to communication, with lessons guided by AI.</p>
        <button
          onClick={() => setPage('lesson')}
          className="bg-[#4169e1] text-white px-8 py-4 rounded-xl font-semibold backdrop-blur-md border border-white/40 hover:bg-white hover:text-black transition transform hover:scale-105"
        >
          Start Learning
        </button>
        <div className="mt-6 text-black">
          <p className={xpBounce ? 'bounce-xp inline-block' : ''}><strong>XP:</strong> {xp}</p>
          <p><strong>Streak:</strong> {streak} 🔥</p>
        </div>
      </div>
      <div className="absolute bottom-4 text-6xl snail-slide">🐌</div>
    </div>
  );
};

const LessonPage = ({ setXp, setStreak, setPage }) => {
  const [step, setStep] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [animateCorrect, setAnimateCorrect] = useState(false);
  const [flashButton, setFlashButton] = useState(null);

  const triggerCorrectEffects = (btnKey) => {
    setFeedback('🎉 Correct!');
    setAnimateCorrect(true);
    setFlashButton(btnKey);
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    setTimeout(() => setAnimateCorrect(false), 400);
    setTimeout(() => setFlashButton(null), 600);
  };

  const handleNext = () => {
    setFeedback('');
    if (step < 4) {
      setStep(step + 1);
    } else {
      setXp(prev => prev + 10);
      setStreak(prev => prev + 1);
      confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 } });
      setPage('home');
    }
  };

  const handleBack = () => {
    setFeedback('');
    setStep(prev => Math.max(prev - 1, 0));
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <>
            <h2 className="text-2xl font-bold mb-4">1. Why Budgeting Matters</h2>
            <p>Budgeting helps you control your money, reduce stress, and achieve goals like saving for a trip or paying off debt.</p>
          </>
        );
      case 1:
        return (
          <>
            <h2 className="text-2xl font-bold mb-4">2. Key Terms Quiz</h2>
            <p className="mb-4">Which of these is a <strong>Want</strong>?</p>
            {['Rent', 'Groceries', 'Coffee'].map(choice => (
              <button
                key={choice}
                onClick={() => {
                  if (choice === 'Coffee') {
                    triggerCorrectEffects(choice);
                    setFeedback('🎉 Correct! Coffee is a Want.');
                  } else setFeedback('❌ Not quite. Needs are essentials like Rent and Groceries.');
                }}
                className={`block w-full my-2 px-4 py-2 rounded-xl backdrop-blur-md bg-white/30 border border-white/40 hover:bg-white hover:text-black transition ${flashButton === choice ? 'flash-correct' : ''}`}
              >
                {choice}
              </button>
            ))}
            {feedback && <p className="mt-4">{feedback}</p>}
          </>
        );
      case 2:
        const expenses = ['Rent', 'Coffee', 'Groceries', 'Netflix'];
        return (
          <>
            <h2 className="text-2xl font-bold mb-4">3. Categorize Expenses</h2>
            <p className="mb-4">Click if it’s a Need or a Want.</p>
            {expenses.map(item => (
              <div key={item} className="my-2 flex justify-between items-center">
                <span>{item}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      if (['Rent', 'Groceries'].includes(item)) triggerCorrectEffects(item);
                      else setFeedback(`❌ ${item} is actually a Want.`);
                    }}
                    className={`px-3 py-1 rounded-xl backdrop-blur-md bg-white/30 border border-white/40 hover:bg-white hover:text-black ${flashButton === item ? 'flash-correct' : ''}`}
                  >Need</button>
                  <button
                    onClick={() => {
                      if (['Coffee', 'Netflix'].includes(item)) triggerCorrectEffects(item);
                      else setFeedback(`❌ ${item} is actually a Need.`);
                    }}
                    className={`px-3 py-1 rounded-xl backdrop-blur-md bg-white/30 border border-white/40 hover:bg-white hover:text-black ${flashButton === item ? 'flash-correct' : ''}`}
                  >Want</button>
                </div>
              </div>
            ))}
            {feedback && <p className="mt-4">{feedback}</p>}
          </>
        );
      case 3:
        return (
          <>
            <h2 className="text-2xl font-bold mb-4">4. Mini Scenario</h2>
            <p className="mb-4">You earn $200, spend $120 on rent, $50 on food, and $20 on games. How much can you save?</p>
            <input
              type="number"
              placeholder="Enter amount"
              className="w-full p-2 rounded-xl backdrop-blur-md bg-white/40 border border-white/50 mb-2"
              onChange={(e) => setSelectedAnswers({ ...selectedAnswers, scenario: e.target.value })}
            />
            <button
              onClick={() => {
                if (Number(selectedAnswers.scenario) === 10) triggerCorrectEffects('scenario');
                else setFeedback('❌ Check again. Try subtracting expenses from income.');
              }}
              className={`px-4 py-2 rounded-xl backdrop-blur-md bg-white/30 border border-white/40 hover:bg-white hover:text-black ${flashButton === 'scenario' ? 'flash-correct' : ''}`}
            >
              Check
            </button>
            {feedback && <p className="mt-4">{feedback}</p>}
          </>
        );
      case 4:
        return (
          <>
            <h2 className="text-2xl font-bold mb-4">5. Wrap-Up</h2>
            <p className="mb-4">Great work! You’ve learned budgeting basics. 🎉</p>
            <p>+10 XP 🔥</p>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-black p-6 h-full w-full">
      <div className={`backdrop-blur-lg bg-white/30 border border-white/40 rounded-3xl p-10 w-full max-w-4xl min-h-[70vh] shadow-2xl transition ${animateCorrect ? 'pulse-correct' : ''}`}>
        {/* Progress Bar */}
        <div className="w-full bg-white/30 rounded-full h-3 mb-6">
          <div
            className="bg-black h-3 rounded-full transition-all"
            style={{ width: `${((step + 1) / 5) * 100}%` }}
          ></div>
        </div>

        {renderStep()}

        <div className="flex justify-between mt-6">
          <button
            onClick={handleBack}
            disabled={step === 0}
            className="px-4 py-2 rounded-xl backdrop-blur-md bg-white/30 border border-white/40 hover:bg-white hover:text-black transition disabled:opacity-50"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            className="px-4 py-2 rounded-xl backdrop-blur-md bg-white/30 border border-white/40 hover:bg-white hover:text-black"
          >
            {step === 4 ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---
export default function App() {
  const [page, setPage] = useState('home');
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);

  return (
    <div className="min-h-screen font-sans animate-gradient">
      <Navbar setPage={setPage} />
      {page === 'home' ? <HomePage setPage={setPage} xp={xp} streak={streak} /> : <LessonPage setXp={setXp} setStreak={setStreak} setPage={setPage} />}
    </div>
  );
}
