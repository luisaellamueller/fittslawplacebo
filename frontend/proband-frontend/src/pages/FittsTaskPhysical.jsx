import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import FlowHelper from "../utility/FlowHelper";
import MouseInfoPopup from "./MouseInfoPopup";

const CENTER_X = 400;
const CENTER_Y = 300;
const TARGET_HEIGHT = 300;
const NUM_CLICKS_PER_TRIAL = 15; // Each difficulty has 15 valid clicks
const NUM_DIFFICULTIES = 15; // We use 15 different difficulty levels in total
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

const FittsTaskPhysical = () => {
  // Use all difficulty levels rather than randomly selecting a subset
  const [difficultyOrder, setDifficultyOrder] = useState(() => {
    // This ensures all difficulties are included since NUM_DIFFICULTIES equals DIFFICULTY_LEVELS.length
    return shuffleArray([...DIFFICULTY_LEVELS]); // Shuffle the entire array of difficulties
  });
  
  const [currentDifficultyIndex, setCurrentDifficultyIndex] = useState(0);
  const [validClickCount, setValidClickCount] = useState(0); // Track successful trial clicks
  const [startTime, setStartTime] = useState(0);
  const [trials, setTrials] = useState([]);
  const [userId, setUserId] = useState(null);
  const [experimentComplete, setExperimentComplete] = useState(false);
  const [activeTargetId, setActiveTargetId] = useState(null);
  const [isFirstClick, setIsFirstClick] = useState(true);
  const [showLevelComplete, setShowLevelComplete] = useState(false);
  const [showMouseInfo, setShowMouseInfo] = useState(true); // State for showing mouse info popup
  const [trialData, setTrialData] = useState(null); // Store current trial data for error tracking
  
  const containerRef = useRef(null);
  const savedRef = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:5001/api/probands/currentuserid")
      .then(response => setUserId(response.data.id))
      .catch(error => console.error("Error fetching user ID:", error));
  }, []);

  useEffect(() => {
    if (currentDifficultyIndex >= NUM_DIFFICULTIES && !savedRef.current) {
      savedRef.current = true;
      sendResults();
      setExperimentComplete(true);
    }
  }, [currentDifficultyIndex]);

  useEffect(() => {
    // Initialize the first trial
    if (!experimentComplete && currentDifficultyIndex < NUM_DIFFICULTIES) {
      setActiveTargetId(1); 
      setIsFirstClick(true); // Reset first click flag when starting a new difficulty
      setValidClickCount(0); // Reset valid click counter
      setTrialData(null); // Reset trial data
    }
  }, [currentDifficultyIndex, experimentComplete]);

  useEffect(() => {
    if (experimentComplete) {
      const completeExperiment = async () => {
        alert("Experiment complete! Results have been saved.");
        try {
          await FlowHelper.setVisited("FittsTaskPhysical"); 
          const flowPage = await FlowHelper.getFlowPage();
          navigate(`/${flowPage}`, { replace: true });
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
    if (experimentComplete || showLevelComplete || showMouseInfo) return; // Don't handle clicks when mouse info is showing
    
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

    // Get the current target
    const currentTarget = targets.find(t => t.id === activeTargetId);
    const targetX = currentTarget.x; // Store the X position of the target

    // Handle the start click - this doesn't count as a trial
    if (isFirstClick) {
      setIsFirstClick(false);
      setStartTime(endTime);
      setActiveTargetId(2); // Switch to target 2 after the start click
      return;
    }

    // Check if click is on target
    const onTarget = isClickOnTarget(activeTargetId, clickX, clickY, targets);
    const movementTime = endTime - startTime;

    // If we don't have trial data yet, create it
    if (!trialData) {
      setTrialData({
        UserID: userId,
        MausTyp: "Physical", // Keep Physical-specific
        TargetID: activeTargetId,
        DifficultyIndex: Math.log2(currentDifficulty.distance / currentDifficulty.width + 1),
        MT: movementTime,
        ClickX: clickX,
        ClickY: clickY,
        TargetX: targetX, // Add target X position
        Width: currentDifficulty.width,
        Distance: currentDifficulty.distance,
        Error: onTarget ? 0 : 1, // Set error to 1 if not on target
        Level: String(currentDifficultyIndex + 1).padStart(2, '0')
      });
    }

    if (onTarget) {
      // Success case - store the trial and move to next target
      const finalTrialData = trialData || {
        UserID: userId,
        MausTyp: "Physical", // Keep Physical-specific
        TargetID: activeTargetId,
        DifficultyIndex: Math.log2(currentDifficulty.distance / currentDifficulty.width + 1),
        MT: movementTime,
        ClickX: clickX,
        ClickY: clickY,
        TargetX: targetX, // Add target X position
        Width: currentDifficulty.width,
        Distance: currentDifficulty.distance,
        Error: 0, // No error for direct hit
        Level: String(currentDifficultyIndex + 1).padStart(2, '0')
      };

      // Add this trial to our trials array
      setTrials(prevTrials => [...prevTrials, finalTrialData]);
      
      // Reset trial data for next target
      setTrialData(null);
      
      // Set new start time
      setStartTime(endTime);
      
      // Toggle target
      setActiveTargetId(prevId => prevId === 1 ? 2 : 1);
      
      // Increment valid click count
      const updatedClickCount = validClickCount + 1;
      setValidClickCount(updatedClickCount);
      
      if (updatedClickCount >= NUM_CLICKS_PER_TRIAL) {
        setShowLevelComplete(true);
      }
    } else {
      setTrialData(prevData => {
        if (prevData) {
          return {
            ...prevData,
            MT: movementTime,
            ClickX: clickX,
            ClickY: clickY,
            Error: 1
          };
        } else {
          return {
            UserID: userId,
            MausTyp: "Physical", 
            TargetID: activeTargetId,
            DifficultyIndex: Math.log2(currentDifficulty.distance / currentDifficulty.width + 1),
            MT: movementTime,
            ClickX: clickX,
            ClickY: clickY,
            TargetX: targetX, 
            Width: currentDifficulty.width,
            Distance: currentDifficulty.distance,
            Error: 1, 
            Level: String(currentDifficultyIndex + 1).padStart(2, '0')
          };
        }
      });
      
      // Set new start time for the retry
      setStartTime(endTime);
    }
  };

  const handleContinue = () => {
    setShowLevelComplete(false);
    setValidClickCount(0);
    setCurrentDifficultyIndex(prevIndex => prevIndex + 1);
    setActiveTargetId(1);
    setIsFirstClick(true);
    setTrialData(null); // Reset trial data for new difficulty
  };

  const sendResults = async () => {
    try {
      // Ensure we only have exactly 225 entries (15 per difficulty × 15 difficulties)
      // This is important since we might have collected more trials due to error tracking
      const formattedTrials = trials.slice(0, NUM_DIFFICULTIES * NUM_CLICKS_PER_TRIAL).map(trial => ({
        UserID: trial.UserID,
        MausTyp: trial.MausTyp,
        TargetID: trial.TargetID,
        DifficultyIndex: trial.DifficultyIndex,
        MT: trial.MT,
        ClickX: trial.ClickX,
        ClickY: trial.ClickY,
        TargetX: trial.TargetX, 
        Width: trial.Width,
        Distance: trial.Distance,
        Error: trial.Error,
        Level: trial.Level
      }));
      
      console.log(`Saving ${formattedTrials.length} trials to database`);
      await axios.post("http://localhost:5001/api/fitts-task", formattedTrials);
      console.log("Results successfully saved!");
    } catch (error) {
      console.error("Error saving results:", error);
    }
  };

  // Handler for closing the mouse info popup
  const handleMouseInfoClose = () => {
    setShowMouseInfo(false);
  };

  if (currentDifficultyIndex >= NUM_DIFFICULTIES) {
    return <h2>Experiment Completed!</h2>;
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
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
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
      {/* Display the mouse info popup when the component loads */}
      {showMouseInfo && (
        <MouseInfoPopup mouseType="Physical" onClose={handleMouseInfoClose} />
      )}
      <h2>Klick-Task: Adaptiv-unterstützte Maussteuerung</h2>
      <p>Klicken Sie so schnell und genau wie möglich auf das blaue Ziel.</p>
      <p>
        {isFirstClick
          ? "Klicken Sie auf das blaue Ziel, um zu beginnen"
          : `Schwierigkeit ${currentDifficultyIndex + 1} von ${NUM_DIFFICULTIES}, Klick ${validClickCount} von ${NUM_CLICKS_PER_TRIAL}`
        }
      </p>
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
              pointerEvents: "none" 
            }}
          />
        ))}
      </div>
      {/* Render the level complete popup */}
      <LevelCompleteModal />
    </div>
  );
};

export default FittsTaskPhysical;