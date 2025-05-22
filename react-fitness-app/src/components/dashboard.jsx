const allBadges = [
    { id: 1, name: "Consistency", description: "Complete 10 workouts total." },
    { id: 2, name: "Streak", description: "Complete one workout a day for 7 days in a row." },
    { id: 3, name: "third", description: "third description" }
];

const Dashboard = () => {

    return (
        <div id="dash-all">
            <h1>Dashboard</h1>
            <div id="badges-div">
                {allBadges.map(badge => (
                    <div id="badge-individual">
                        <p>{badge.name}</p>
                        <p>{badge.description}</p>
                    </div>
                ))}
            </div>
            <div id="stats-div">

            </div>
        </div>
    );
};

export default Dashboard;