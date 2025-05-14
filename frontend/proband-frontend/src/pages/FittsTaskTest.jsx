import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import FlowHelper from "../utility/FlowHelper";
import TestSessionPopup from "./TestSessionPopup";

const CENTER_X = 400; // Center of the container
const CENTER_Y = 300;
const TARGET_HEIGHT = 300;
const NUM_TRIALS_PER_DIFFICULTY = 5; // Each difficulty has 5 trials for the test.
const NUM_DIFFICULTIES = 3; // We use 3 different difficulty levels in total

const DIFFICULTY_LEVELS = [
  // Einfache Aufgaben
  { width: 140, distance: 300 },     // ID ≈ 1,5 bits
  { width: 120, distance: 350 },     // ID ≈ 1,7 bits
  { width: 90, distance: 400 },      // ID ≈ 2,3 bits
  
  // Mittlere Aufgaben
  { width: 50, distance: 450 },      // ID ≈ 3,3 bits
  { width: 40, distance: 450 },      // ID ≈ 3,6 bits
  { width: 30, distance: 450 },      // ID ≈ 4,0 bits
  { width: 25, distance: 500 },      // ID ≈ 4,4 bits
  
  // Schwierigere Aufgaben
  { width: 20, distance: 550 },      // ID ≈ 4,9 bits
  { width: 15, distance: 550 },      // ID ≈ 5,3 bits
  { width: 12, distance: 600 },      // ID ≈ 5,7 bits
  
  // Sehr schwierige Aufgaben (hohe IDs)
  { width: 10, distance: 650 },      // ID ≈ 6,1 bits
  { width: 8, distance: 700 },       // ID ≈ 6,5 bits
  { width: 6, distance: 750 },       // ID ≈ 7,0 bits
  { width: 5, distance: 750 },       // ID ≈ 7,3 bits
  { width: 4, distance: 780 }        // ID ≈ 7,6 bits
];

const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

const FittsTaskTest = () => {
  const [showPopup, setShowPopup] = useState(true);
  const [step, setStep] = useState(1);
  const totalSteps = 3;
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState(null);
  
  // Randomly select 5 difficulties from the array of possible difficulty levels
  const [difficultyOrder, setDifficultyOrder] = useState(() => {
    const shuffled = shuffleArray([...DIFFICULTY_LEVELS]);
    return shuffled.slice(0, NUM_DIFFICULTIES); // Take only NUM_DIFFICULTIES items
  });
  const [currentDifficultyIndex, setCurrentDifficultyIndex] = useState(0);
  const [trialCount, setTrialCount] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [trials, setTrials] = useState([]);
  const [experimentComplete, setExperimentComplete] = useState(false);
  const [activeTargetId, setActiveTargetId] = useState(null);
  const [consecutiveErrors, setConsecutiveErrors] = useState(0);
  const [isFirstClick, setIsFirstClick] = useState(true);
  const [showLevelComplete, setShowLevelComplete] = useState(false);
  const containerRef = useRef(null);
  
  // Handle popup close
  const handlePopupClose = () => {
    setShowPopup(false);
  };
  
  // Added from StudyInformation component
  const handleNextClick = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Navigate to the appropriate flow based on the order ID
      if (orderId && flowMappings[orderId]) {
        navigate(flowMappings[orderId]);
      } else {
        alert("Fehler: Reihenfolge konnte nicht geladen werden.");
      }
    }
  };

  useEffect(() => {
    // Initialize the first trial
    if (!experimentComplete && currentDifficultyIndex < NUM_DIFFICULTIES) {
      setActiveTargetId(1); // Always start with target 1 for consistency
      setIsFirstClick(true); // Reset first click flag when starting a new difficulty
    }
  }, [currentDifficultyIndex, experimentComplete]);

  useEffect(() => {
    if (experimentComplete) {
      const completeExperiment = async () => {
        alert("Test abgeschlossen. Sie beginnen jetzt mit dem weiteren Ablauf.");
        try {
          const flowPage = await FlowHelper.getFlowPage();
          navigate(flowPage, { replace: true }); 
        } catch (error) {
          console.error("Error navigating back to flow page:", error);
        }
      };
      completeExperiment();
    }
  }, [experimentComplete, navigate]);

  const isClickOnTarget = (targetId, x, y, targets) => {
    const target = targets.find(t => t.id === targetId);
    return (
      x >= target.x &&
      x <= target.x + target.width &&
      y >= target.y &&
      y <= target.y + target.height
    );
  };

  const handleContainerClick = (e) => {
    if (experimentComplete || showLevelComplete) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const currentDifficulty = difficultyOrder[currentDifficultyIndex];
    const endTime = performance.now();
    
    // Calculate target positions
    const targets = [
      {
        id: 1,
        x: CENTER_X - (currentDifficulty.distance / 2),
        y: CENTER_Y - (TARGET_HEIGHT / 2),
        width: currentDifficulty.width,
        height: TARGET_HEIGHT
      },
      {
        id: 2,
        x: CENTER_X + (currentDifficulty.distance / 2) - currentDifficulty.width,
        y: CENTER_Y - (TARGET_HEIGHT / 2),
        width: currentDifficulty.width,
        height: TARGET_HEIGHT
      }
    ];

    // Handle the start click
    if (isFirstClick) {
      // This is the start click, just set the start time and toggle targets
      setIsFirstClick(false);
      setStartTime(endTime);
      setActiveTargetId(2); // Switch to target 2 after the start click
      return;
    }

    // This is a real trial
    const movementTime = endTime - startTime;
    const onTarget = isClickOnTarget(activeTargetId, clickX, clickY, targets);
    
    const newTrial = {
      TargetID: activeTargetId,
      DifficultyIndex: Math.log2(currentDifficulty.distance / currentDifficulty.width + 1),
      MT: movementTime,
      ClickX: clickX,
      ClickY: clickY,
      Width: currentDifficulty.width,
      Distance: currentDifficulty.distance,
      Error: onTarget ? 0 : 1,
      Level: String(currentDifficultyIndex + 1).padStart(2, '0')
    };

    setTrials(prevTrials => [...prevTrials, newTrial]);

    if (onTarget) {
      // Success case - reset error counter
      setConsecutiveErrors(0);
      setTrialCount(prevCount => prevCount + 1);
      setStartTime(endTime);
      setActiveTargetId(prevId => prevId === 1 ? 2 : 1);
      
      if (trialCount + 1 >= NUM_TRIALS_PER_DIFFICULTY) {
        // Completed all trials for this difficulty
        setShowLevelComplete(true);
      }
    } else {
      // Error case - increment error counter and check threshold
      setConsecutiveErrors(prevErrors => prevErrors + 1);
      
      if (consecutiveErrors + 1 >= 2) {
        // Two consecutive errors - show error message
        alert("Sie haben zwei aufeinanderfolgende Fehler gemacht. Dieses Level wird wiederholt.");
        
        // Restart the SAME difficulty level
        setConsecutiveErrors(0); // Reset consecutive errors
        setTrialCount(0); // Reset trial count
        
        // Reset to first target and set first click flag
        setActiveTargetId(1);
        setIsFirstClick(true);
      } else {
        // Less than threshold errors - prepare for retry
        setStartTime(endTime);
      }
    }
  };

  const handleContinue = () => {
    setShowLevelComplete(false);
    setTrialCount(0);
    setCurrentDifficultyIndex(prevIndex => prevIndex + 1);
    setActiveTargetId(1);
    setIsFirstClick(true);
    setConsecutiveErrors(0); // Reset consecutive errors when moving to next difficulty
    
    // Check if we've completed all difficulties
    if (currentDifficultyIndex + 1 >= NUM_DIFFICULTIES) {
      setExperimentComplete(true);
    }
  };

  if (currentDifficultyIndex >= NUM_DIFFICULTIES) {
    return <h2>Test beenedet. Sie können jetzt mit dem weiteren Ablauf fortfahren.</h2>;
  }

  // Simple level complete popup
  const LevelCompleteModal = () => {
    if (!showLevelComplete) return null;
    
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
      }}>
        <div style={{
          backgroundColor: 'rgb(102, 106, 158)',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(254, 254, 254, 0.2)',
          width: '300px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 15px' }}>Level {currentDifficultyIndex + 1}/{NUM_DIFFICULTIES} fertig!</h3>
          <button 
            onClick={handleContinue} 
            style={{
              padding: '8px 20px',
              fontSize: '16px',
              cursor: 'default',
              backgroundColor: 'rgba(25, 45, 95, 0.7)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
              transition: 'all 0.3s ease',
            }}
          >
            OK
          </button>
        </div>
      </div>
    );
  };

  const currentDifficulty = difficultyOrder[currentDifficultyIndex];
  
  // Calculate positions that ensure the targets are always centered
  const targets = [
    { 
      id: 1, 
      x: CENTER_X - (currentDifficulty.distance / 2), 
      y: CENTER_Y - (TARGET_HEIGHT / 2),
      width: currentDifficulty.width,
      height: TARGET_HEIGHT
    },
    { 
      id: 2, 
      x: CENTER_X + (currentDifficulty.distance / 2) - currentDifficulty.width, 
      y: CENTER_Y - (TARGET_HEIGHT / 2),
      width: currentDifficulty.width,
      height: TARGET_HEIGHT
    }
  ];

  return (
    <div>
      {showPopup && <TestSessionPopup onClose={handlePopupClose} />}
      
      <h2>Klick-Task: Test Session</h2>
      <p>Klicken Sie so schnell und genau wie möglich auf das blaue Ziel.</p>
      <p>Die Levels sind zufällig generiert und bauen nicht aufeinander auf.</p>
      <p>Wenn Sie zweimal hintereinander daneben klicken oder zu lange benötigen, wird das Level wiederholt.</p>
      <div style={{ marginBottom: '20px' }}>
      <p>
        {isFirstClick 
          ? "Click the blue target to begin" 
          : `Difficulty ${currentDifficultyIndex + 1} of ${NUM_DIFFICULTIES}, Trial ${trialCount + 1} of ${NUM_TRIALS_PER_DIFFICULTY}`
        }
      </p>
      </div>
      <div
        ref={containerRef}
        onClick={handleContainerClick}
        style={{
          position: "relative",
          width: "800px",
          height: "600px",
          border: "1px solid black",
          backgroundColor: "#f5f5f5",
          margin: "0 auto",
          cursor: "default"
        }}
      >
        {targets.map((target) => (
          <div
            key={target.id}
            style={{
              position: "absolute",
              left: `${target.x}px`,
              top: `${target.y}px`,
              width: `${target.width}px`,
              height: `${target.height}px`,
              backgroundColor: target.id === activeTargetId ? "blue" : "gray",
              border: "none",
              pointerEvents: "none" // Make targets not intercept clicks
            }}
          />
        ))}
      </div>
      
      {/* Render the level complete popup */}
      <LevelCompleteModal />
    </div>
  );
};

export default FittsTaskTest;