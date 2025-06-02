

const About = () => {
    return (
        <div className="about-div">
            <h1>About</h1>
            <p id="about-intro">
                FitFlow is a fitness app that combines all your workout needs into one!
                This app is currently in its MVP stage as a Unit 1 LaunchCode Project.
                This web application showcases what we have learned so far regarding HTML, CSS, JavaScript, the DOM, and React.


                <br /><br />
                FitFlow plans to implement future features including:
            </p>
            <ul id="future-list">
                <li>
                    dashboard that displays earned badges, stats, and a short list of most recent history
                </li>
                <li>
                    workout history list - grid display
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