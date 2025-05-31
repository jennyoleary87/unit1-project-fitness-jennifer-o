import { useEffect, useState } from "react";

const History = () => {

    const [workoutHistory, setWorkoutHistory] = useState([]);

    useEffect(() => {
        // when component starts, read localStorage
        const savedHistory = localStorage.getItem('workoutHistory');
        if (savedHistory) {
            setWorkoutHistory(JSON.parse(savedHistory));
        }
    }, []);


    return (
        <div>
            <h2>Workout History</h2>
            <div>
                {workoutHistory.length > 0 ? (
                    <div id="history-block">
                        {workoutHistory.map((workout) => (
                            <div key={workout.id}>
                                <div>
                                    <div>
                                        {/* display name */}
                                        <h3>{workout.name}</h3>
                                        <p>
                                            {/* display date and time of workout */}
                                            {workout.date} at {workout.time}
                                        </p>
                                        <p>
                                            {workout.sets} sets with {workout.bursts.length} bursts per set
                                        </p>
                                    </div>
                                    <span>
                                        {workout.completed ? 'Completed' : 'Ended Early'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No workout history yet. Get a move on!</p>

                )}

            </div>
        </div>
    );
};

export default History;