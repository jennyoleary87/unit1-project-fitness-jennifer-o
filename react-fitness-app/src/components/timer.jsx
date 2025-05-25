import Button from './button';
import { useState, useEffect } from 'react';


const IntervalTimer = () => {


    return (
        <div>
            <h2>Interval Timer</h2>
            <form className="form" method="post">
                <label>active:</label>
                <input className="form-label" type="number" />
                <span>seconds</span>

                <label>rest:</label>
                <input className="form-label" type="number" />
                <span>seconds</span>

                <label>number of sets:</label>
                <input className="form-label" type="number" />
            </form>
            <Button color="red" label="Start Timer">Begin</Button>
        </div>
    );
};

export default IntervalTimer;