

const About = () => {
    return (
        <div className="about-div">
            <h1>About</h1>
            <p>
                FitFlow is a fitness app that combines all your workout needs into one!
                This app is currently in its first stage.
                <br /><br />
                FitFlow plans to implement and include:
            </p>
            <ul id="future-list">
                <li>
                    dashboard that displays earned badges, stats, and a short list of most recent history
                </li>
                <li>
                    workout history list
                </li>
                <li>
                    workout randomizer - in case you are indecisive about what to do next
                </li>
                <li>
                    community features where users can interact and earn badges together
                </li>
            </ul>
        </div>
    );
};

export default About;