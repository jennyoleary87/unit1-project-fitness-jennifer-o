import { Link } from 'react-router';

const Home = () => {

    // const { home } = useParams();

    return (
        // <main>
        <div>
            <h1>Welcome to FitTimer</h1>
            <p>Your personal workout companion for effective interval training</p>
            <div>
                <Link to="/timer">
                    {/* <Button>Start Workout</Button> */}
                </Link>
                <Link to="/dashboard">
                    {/* <Button>View Dashboard</Button> */}
                </Link>
            </div>
        </div>
        // </main>
    );
};

export default Home;