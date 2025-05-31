import Button from './button';
import { useEffect, useState, useRef } from 'react';

const IntervalTimer = () => {

    // configure workout before start
    const [workoutStarted, setWorkoutStarted] = useState(false);
    const [workoutName, setWorkoutName] = useState("");
    const [bursts, setBursts] = useState([ // start timer with  two given bursts to edit
        { id: 1, minutes: 0, seconds: 20 },
        { id: 2, minutes: 0, seconds: 10 }
    ]);
    const [sets, setSets] = useState(3); // begin with a certain number of sets to edit
    const [setBetweenRest, setSetBetweenRest] = useState(30);
    const [workoutHistory, setWorkoutHistory] = useState([]);

    // Timer state
    const [isRunning, setIsRunning] = useState(false);
    const [currentSet, setCurrentSet] = useState(1);
    const [currentBurst, setCurrentBurst] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [totalTime, setTotalTime] = useState(0);
    const [isResting, setIsResting] = useState(false);
    const intervalRef = useRef(null); // 

    // load history upon opening
    useEffect(() => {
        const savedHistory = localStorage.getItem('workoutHistory');
        if (savedHistory) {
            setWorkoutHistory(JSON.parse(savedHistory));
        }
    }, []); // runs once when opened

    // save changes to history list
    useEffect(() => {
        localStorage.setItem('workoutHistory', JSON.stringify(workoutHistory));
    }, [workoutHistory]); // runs when workoutHistory changes

    // This useEffect handles the timer countdown
    useEffect(() => {
        if (isRunning && timeLeft > 0) { // if timer is active, setInterval runs a function every 1000ms (1 second)
            intervalRef.current = setInterval(() => {
                setTimeLeft(previous => previous - 1);
            }, 1000);
        } else if (timeLeft === 0 && workoutStarted) { // When timer reaches 0, move to next phase by calling handleTimerComplete
            handleTimerComplete();
        }

        // Cleanup function - clears the interval when effect re-runs
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isRunning, timeLeft, workoutStarted]); // dependencies - effect re-runs when these change

    // add bursts to workout
    const addBurst = () => {
        const newBurst = {
            id: Date.now(), // ID is current date and time
            name: '',
            minutes: 0,
            seconds: 20
        };
        setBursts([...bursts, newBurst]); // create new array
    };

    // remove bursts from workout
    const removeBurst = (id) => {
        setBursts(bursts.filter(burst => burst.id !== id)); // filter for remove
    };

    // change bursts
    const updateBurst = (id, field, value) => {
        setBursts(bursts.map(burst => // map (to transform burst array) for update
            burst.id === id ? { ...burst, [field]: field === 'name' ? value : (parseInt(value) || 0) } : burst // update fields of new object
        ));
    };

    // rearrange bursts within workout
    const moveBurst = (index, direction) => {
        const newBursts = [...bursts];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        if (targetIndex >= 0 && targetIndex < bursts.length) {
            [newBursts[index], newBursts[targetIndex]] = [newBursts[targetIndex], newBursts[index]];
            setBursts(newBursts);
        }
    };


    // COUNTDOWN TIMER COMPONENTS

    const calculateTotalWorkoutTime = () => {
        const burstTime = bursts.reduce((total, burst) =>
            total + (burst.minutes * 60) + burst.seconds, 0
        );
        return (burstTime * sets) + (setBetweenRest * (sets - 1));
    };

    // Start the workout
    const startWorkout = () => {
        if (bursts.length >= 1) {
            const firstBurst = bursts[0];
            const time = (firstBurst.minutes * 60) + firstBurst.seconds;

            setTimeLeft(time);
            setTotalTime(calculateTotalWorkoutTime());
            setCurrentSet(1);
            setCurrentBurst(0);
            setIsResting(false);
            setWorkoutStarted(true);
            setIsRunning(true);
        } else {
            return;
        }
    };

    // Pause/Resume workout
    const togglePause = () => {
        setIsRunning(!isRunning);
    };

    // End workout early
    const endWorkout = () => {
        completeWorkout();
    };

    // Reset timer
    const resetTimer = () => {
        setIsRunning(false);
        setWorkoutStarted(false);
        setCurrentSet(1);
        setCurrentBurst(0);
        setTimeLeft(0);
        setTotalTime(0);
        setIsResting(false);
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
    };

    // complete and save to history list
    const completeWorkout = () => {
        const completedWorkout = {
            id: Date.now(),
            name: workoutName || 'Untitled Workout',
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString(),
            bursts: [...bursts],
            sets: sets,
            setBetweenRest: setBetweenRest,
            completed: currentSet === sets && currentBurst === bursts.length - 1 && timeLeft === 0
        };

        setWorkoutHistory(prev => [completedWorkout, ...prev]);
        resetTimer();
    };

    // Format time for display (convert seconds to MM:SS)
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60; // remaining seconds
        // padStart() converts to a string and adds a leading zero if necessary
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };


    // Handle what happens when timer completes a phase
    const handleTimerComplete = () => {
        if (isResting) {
            // Rest between sets is complete, start next set
            setIsResting(false);
            setCurrentBurst(0);
            setCurrentSet(prev => prev + 1);
            const firstBurst = bursts[0];
            setTimeLeft((firstBurst.minutes * 60) + firstBurst.seconds);
        } else { // Complete burst
            if (currentBurst < bursts.length - 1) {
                const nextBurst = bursts[currentBurst + 1];
                setCurrentBurst(prev => prev + 1);
                setTimeLeft((nextBurst.minutes * 60) + nextBurst.seconds);
            } else { // completed set
                if (currentSet < sets) {// rest between sets
                    setIsResting(true);
                    setTimeLeft(setBetweenRest);
                } else { // all sets completed
                    completeWorkout();
                }
            }
        }
    };

    return (
        <div>

            {workoutStarted ? ( // conditional rendering
                <div>
                    <h2>{workoutName || "Workout in progress"}</h2>
                    <p>
                        Set {currentSet} of {sets}
                    </p>
                    <p>
                        {formatTime(timeLeft)}
                    </p>
                    <div>
                        <Button onClick={togglePause} label={isRunning ? 'Pause' : 'Resume'} />
                        <Button onClick={endWorkout} label="End Workout" />
                    </div>

                </div>
            ) : (
                <div>
                    <h2>Interval Timer</h2>

                    <label>Workout Name: </label>
                    <input className="form-label" value={workoutName} type="text" onChange={(e) => setWorkoutName(e.target.value)} placeholder="Enter workout name" required />
                    <br /> <br />

                    <div id="bursts">
                        <h3>Bursts</h3>

                        {bursts.map((burst, index) => (
                            <div>

                                <table>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <div>
                                                    <label>Burst {index + 1}: </label>
                                                    <input type="text" value={burst.name}
                                                        onChange={(e) => updateBurst(burst.id, 'name', e.target.value)}
                                                        placeholder="Enter burst name" />
                                                </div>
                                            </td>
                                            <td>
                                                <div>
                                                    <label>Minutes</label>
                                                    <input type="number" min="0" max="30" value={burst.minutes}
                                                        onChange={(e) => updateBurst(burst.id, 'minutes', e.target.value)} />
                                                </div>
                                            </td>
                                            <td>
                                                <div>
                                                    <label>Seconds</label>
                                                    <input type="number" min="0" max="60" value={burst.seconds}
                                                        onChange={(e) => updateBurst(burst.id, 'seconds', e.target.value)} />
                                                </div>
                                            </td>
                                            <td>
                                                <div>

                                                    <Button
                                                        onClick={() => moveBurst(index, 'up')}
                                                        disabled={index === 0} label="Up" />
                                                    <Button
                                                        onClick={() => moveBurst(index, 'down')}
                                                        disabled={index === bursts.length - 1} label="Down" />
                                                    <Button
                                                        onClick={() => removeBurst(burst.id)} label="Remove" />
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        ))}

                        <div>
                            <Button onClick={() => addBurst()} label="Add Burst" />
                        </div>
                    </div>

                    <div id="preview">
                        <div>
                            <div>
                                <label>Number of Sets: </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={sets}
                                    onChange={(e) => setSets(parseInt(e.target.value) || 1)}
                                />
                            </div>
                            <div>
                                <label>Rest Between Sets (seconds): </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={setBetweenRest}
                                    onChange={(e) => setSetBetweenRest(parseInt(e.target.value) || 0)}
                                />
                            </div>
                        </div>
                        <Button onClick={startWorkout} disabled={bursts.length === 0} label="Start Workout" />
                    </div>
                </div>
            )
            }

        </div >
    );
};

export default IntervalTimer;