import { useState, useEffect, useRef } from 'react';
import Button from './Button';
import List from './list';

const IntervalTimer = () => {

    // ===== STATES ===== (configure workout before start)
    const [workoutStarted, setWorkoutStarted] = useState(false);
    const [workoutName, setWorkoutName] = useState("");
    const [bursts, setBursts] = useState([ // start timer with  two given bursts to edit
        { id: 1, name: '', minutes: 0, seconds: 20 },
        { id: 2, name: '', minutes: 0, seconds: 10 }
    ]);
    const [sets, setSets] = useState(3); // begin with a certain number of sets to edit
    const [restBetweenSets, setRestBetweenSets] = useState(30);
    const [workoutHistory, setWorkoutHistory] = useState([]);
    const [error, setError] = useState(null);

    // during workout states
    const [isRunning, setIsRunning] = useState(false);
    const [currentSet, setCurrentSet] = useState(1);
    const [currentBurst, setCurrentBurst] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isResting, setIsResting] = useState(false);
    const intervalRef = useRef(null); // ref to store the timer interval

    // handle errors
    const handleError = (errorMessage, shouldReset = false) => {
        console.error('Timer Error:', errorMessage);
        setError(errorMessage);

        if (shouldReset) {
            resetTimer();
        }

        // clear error after 10 seconds
        setTimeout(() => setError(null), 10000);
    };

    // load workout history when app starts
    useEffect(() => {
        try {
            const savedHistory = localStorage.getItem('workoutHistory');
            if (savedHistory) {
                setWorkoutHistory(JSON.parse(savedHistory));
            }
        } catch (error) {
            handleError('Failed to load workout history');
        }
    }, []);

    // save workout history whenever it changes
    useEffect(() => {
        try {
            if (workoutHistory.length > 0) {
                localStorage.setItem('workoutHistory', JSON.stringify(workoutHistory));
            }
        } catch (error) {
            handleError('Failed to save workout history');
        }
    }, [workoutHistory]); // runs when workoutHistory changes

    // countdown effect
    useEffect(() => {
        if (isRunning && timeLeft > 0) { // if timer is active, start, setInterval runs a function every 1000ms (1 second)
            intervalRef.current = setInterval(() => {
                setTimeLeft(previous => {
                    if (previous <= 0) {
                        clearInterval(intervalRef.current);
                        return 0;
                    }
                    return previous - 1;
                });
            }, 1000);
        } else if (timeLeft === 0 && workoutStarted && !error) { // when timer reaches 0, move to next phase by calling handleTimerComplete
            handleTimerComplete();
        }

        // cleanup function - clears the interval when effect re-runs - stop timer when effect runs again
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isRunning, timeLeft, workoutStarted, error]); // dependencies - effect re-runs when these change

    // ===== BURSTS =====

    // add bursts to workout
    const addBurst = () => {
        try {
            const newBurst = {
                id: Date.now(), // ID is current date and time
                name: '',
                minutes: 0,
                seconds: 20
            };
            setBursts(prevBursts => [...prevBursts, newBurst]); // create new array
        } catch (error) {
            handleError('Failed to add burst');
        }
    };

    // remove bursts from workout
    const removeBurst = (burstId) => {
        try {
            setBursts(prevBursts => prevBursts.filter(burst => burst.id !== burstId)); // filter for remove
        } catch (error) {
            handleError('Failed to remove burst');
        }
    };

    // change bursts properties (name, minutes, seconds)
    const updateBurst = (burstId, property, value) => {
        try {
            setBursts(prevBursts =>
                prevBursts.map(burst => {
                    if (burst.id === burstId) {
                        return {
                            ...burst,
                            [property]: property === 'name' ? value : (parseInt(value) || 0) // return updated properties
                        };
                    }
                    return burst; // for unchanged bursts
                })
            );
        } catch (error) {
            handleError('Failed to update burst');
        }
    };

    // rearrange bursts within workout - up or down in the list
    const moveBurst = (index, direction) => {
        try {
            const newBursts = [...bursts];
            const targetIndex = direction === 'up' ? index - 1 : index + 1;

            if (targetIndex >= 0 && targetIndex < bursts.length) { // swap positions
                [newBursts[index], newBursts[targetIndex]] =
                    [newBursts[targetIndex], newBursts[index]];
                setBursts(newBursts);
            }
        } catch (error) {
            handleError('Failed to move burst');
        }
    };

    // ===== TIMER =====

    const calculateTotalTime = () => {
        try {
            const burstTime = bursts.reduce((total, burst) => {
                return total + (burst.minutes * 60) + burst.seconds;
            }, 0);
            return (burstTime * sets) + (restBetweenSets * (sets - 1));
        } catch (error) {
            handleError('Failed to calculate workout time');
            return 0;
        }
    };

    // start the workout
    const startWorkout = () => {
        try {
            if (bursts.length >= 1) {
                const firstBurst = bursts[0];
                const firstBurstTime = (firstBurst.minutes * 60) + firstBurst.seconds;
                setTimeLeft(firstBurstTime);
                setCurrentSet(1);
                setCurrentBurst(0);
                setIsResting(false);
                setWorkoutStarted(true);
                setIsRunning(true);
            } else if (bursts.length === 0) {
                handleError('Please add at least one burst to start workout');
                return;
            } else if (firstBurstTime === 0) {
                handleError('First burst must have a duration greater than 0');
                return;
            }

        } catch (error) {
            handleError('Failed to start workout');
        }
    };

    // pause/resume workout
    const togglePause = () => {
        setIsRunning(prevRunning => !prevRunning);
    };

    // End workout early
    const endWorkout = () => {
        completeWorkout();
    };

    // Reset timer to initial state
    const resetTimer = () => {
        setIsRunning(false);
        setWorkoutStarted(false);
        setCurrentSet(1);
        setCurrentBurst(0);
        setTimeLeft(0);
        setIsResting(false);

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
    };

    // complete and save to history list
    const completeWorkout = (wasCompleted = true) => {
        try {
            const completedWorkout = {
                id: Date.now(),
                name: workoutName || 'Untitled Workout',
                date: new Date().toLocaleDateString(),
                time: new Date().toLocaleTimeString(),
                bursts: [...bursts],
                sets: sets,
                restBetweenSets: restBetweenSets,
                completed: wasCompleted
            };

            setWorkoutHistory(prevHistory => [completedWorkout, ...prevHistory]);
            resetTimer();
        } catch (error) {
            handleError('Failed to save workout');
        }
    };

    // Format time for display (convert seconds to MM:SS)
    const formatTime = (seconds) => {
        try {
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;  // remaining seconds
            // padStart() converts to a string and adds a leading zero if necessary
            return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        } catch (error) {
            return '00:00';
        }
    };

    // handle what happens when timer completes a phase
    const handleTimerComplete = () => {
        try {
            if (isResting) {
                // Rest period is over, start next set
                setIsResting(false);
                setCurrentBurst(0);
                setCurrentSet(prevSet => prevSet + 1);

                const firstBurst = bursts[0];
                setTimeLeft((firstBurst.minutes * 60) + firstBurst.seconds);
            } else { // completed current burst
                if (currentBurst < bursts.length - 1) { // next burst in current set
                    const nextBurst = bursts[currentBurst + 1];
                    setCurrentBurst(prevBurst => prevBurst + 1);
                    setTimeLeft((nextBurst.minutes * 60) + nextBurst.seconds);
                } else { // completed current set
                    if (currentSet < sets) { // rest between sets
                        setIsResting(true);
                        setTimeLeft(restBetweenSets);
                    } else { // all sets completed
                        completeWorkout(true);
                    }
                }
            }
        } catch (error) {
            handleError('Timer completion failed', true);
        }
    };

    // render each burst item in list
    const renderBurstItem = (burst, index) => {
        return (
            <div>

                <table>
                    <tbody>
                        <tr>
                            <td>
                                <div>
                                    <label>Burst {index + 1}: </label>
                                    <input
                                        type="text"
                                        value={burst.name}
                                        onChange={(e) => updateBurst(burst.id, 'name', e.target.value)}
                                        placeholder="Enter burst name"
                                    />
                                </div>
                            </td>

                            <td>
                                <div>
                                    <label>Minutes: </label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="30"
                                        value={burst.minutes}
                                        onChange={(e) => updateBurst(burst.id, 'minutes', e.target.value)}
                                    />
                                </div>
                            </td>

                            <td>
                                <div>
                                    <label>Seconds: </label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="59"
                                        value={burst.seconds}
                                        onChange={(e) => updateBurst(burst.id, 'seconds', e.target.value)}
                                    />
                                </div>
                            </td>

                            <td>
                                <div>
                                    <Button
                                        onClick={() => moveBurst(index, 'up')}
                                        disabled={index === 0}
                                        className="move-btn" label="up" />
                                    <Button
                                        onClick={() => moveBurst(index, 'down')}
                                        disabled={index === bursts.length - 1}
                                        className="move-btn" label="down" />
                                    <Button
                                        onClick={() => removeBurst(burst.id)}
                                        className="remove-btn" label="remove" />
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    };

    // possible error message
    if (error) {
        return (
            <div>
                <div>
                    <h2>Error</h2>
                    <p>{error}</p>
                    <Button onClick={() => setError(null)} label="Dismiss" />
                </div>
            </div>
        );
    }

    return (
        <div>
            {workoutStarted ? ( // conditional rendering
                <div>
                    <h1>{workoutName || "Workout in Progress"}</h1>

                    <div>
                        <p>
                            Set {currentSet} of {sets}
                        </p>
                        <p>
                            {formatTime(timeLeft)}
                        </p>
                        <p>
                            {isResting ? 'Rest Time' : `Burst ${currentBurst + 1}: ${bursts[currentBurst]?.name || 'Unnamed'}`}
                        </p>
                    </div>

                    <div>
                        <Button onClick={togglePause} label={isRunning ? 'Pause' : 'Resume'} />
                        <Button onClick={endWorkout} label="End Workout" />
                    </div>
                </div>
            ) : (
                <div>
                    <h1>Interval Timer</h1>

                    <div>
                        <label>Workout Name:  </label>
                        <input
                            type="text"
                            value={workoutName}
                            onChange={(e) => setWorkoutName(e.target.value)}
                            placeholder="Enter workout name" required
                        />
                        <br /> <br />
                    </div>

                    <div>
                        <h3>Bursts: </h3>
                        <List
                            items={bursts}
                            renderItem={renderBurstItem}
                            emptyMessage="No bursts added yet"
                        />
                        <Button onClick={addBurst} label="Add Burst" />
                    </div>

                    <div>
                        <div>
                            <label>Number of Sets: </label>
                            <input
                                type="number"
                                min="1"
                                max="20"
                                value={sets}
                                onChange={(e) => setSets(parseInt(e.target.value) || 1)}
                            />
                        </div>

                        <div>
                            <label>Rest Between Sets (seconds): </label>
                            <input
                                type="number"
                                min="0"
                                max="180"
                                value={restBetweenSets}
                                onChange={(e) => setRestBetweenSets(parseInt(e.target.value) || 0)}
                            />
                        </div>
                    </div>

                    <div>
                        <p>
                            Total estimated time: {formatTime(calculateTotalTime())}
                        </p>
                    </div>

                    <Button
                        onClick={startWorkout}
                        disabled={bursts.length === 0} label="Start Workout" />
                </div>
            )}
        </div>
    );
};

export default IntervalTimer;