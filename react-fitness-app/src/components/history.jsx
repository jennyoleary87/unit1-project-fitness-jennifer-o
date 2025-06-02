import { useEffect, useState } from "react";
import List from "./list";

const History = () => {

    const [workoutHistory, setWorkoutHistory] = useState([]);
    const [error, setError] = useState(null);


    // Load workout history when component starts
    useEffect(() => {
        try {
            const savedHistory = localStorage.getItem('workoutHistory');
            if (savedHistory) {
                const parsedHistory = JSON.parse(savedHistory);
                setWorkoutHistory(parsedHistory);
            }
        } catch (error) {
            console.error('Error loading workout history', error);
            setError('Failed to load workout history');
        }
    }, []);

    // render each workout item
    const renderWorkoutItem = (workout) => {
        try {
            return (
                <div className="workout-item">
                    <h3>
                        {workout.name || 'Unnamed Workout'}
                    </h3>
                    <p className="workout-date">
                        {workout.date} at {workout.time}
                    </p>
                    <p className="workout-sets">
                        {workout.sets} sets with {workout.bursts?.length || 0} bursts per set
                    </p>
                    <span>
                        {workout.completed ? 'Completed' : 'Ended Early'}
                    </span>
                </div>
            );
        } catch (error) {
            console.error('Error rendering workout item', error);
            return <div>Error displaying workout</div>;
        }
    };

    if (error) {
        return (
            <div>
                <h1>Workout History</h1>
                <div>{error}</div>
            </div>
        );
    }

    return (
        <div className="history-container">
            <h1>Workout History</h1>
            <div className="grid-list">
                <List
                    items={workoutHistory}
                    renderItem={renderWorkoutItem}
                />
            </div>
        </div>
    );
};

export default History;