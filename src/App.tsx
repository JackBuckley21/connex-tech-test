import React, { useEffect, useState, useCallback } from 'react';
import './App.css';
import moment from "moment";

function App() {
  const [message, setMessage] = useState('');
  const [currTime, setCurrTime] = useState(new Date());
  const [html, setHtml] = useState('');

  const now = new Date();
  const currDate = now.toLocaleDateString();

  const updateCurrTime = useCallback(() => {
    const now = new Date();
    setCurrTime(now);
  }, []);

  useEffect(() => {
    const headers = new Headers();
    headers.append('Authorization', 'mysecrettoken');

    fetch('http://localhost:8000/time', {
    })
        .then((res) => res.json())
        .then((data) => setMessage(data.epoch));


    const interval = setInterval(() => {

      fetch('http://localhost:8000/time', {
      })
          .then((res) => res.json())
          .then((data) => setMessage(data.epoch));
    }, 30000);

    return () => clearInterval(interval);
  }, []);


    useEffect(() => {
      const timer = setInterval(updateCurrTime, 1000);
      return () => clearInterval(timer);
    }, [updateCurrTime]);

  const renderStopwatch = () => {
    if (message === null) {
      return <p>Stopwatch is not started yet.</p>;
    }

    const currentTime = new Date(message).getTime();
    const elapsedTime = new Date().getTime() - currentTime;


    const formattedElapsedTime = moment(elapsedTime ).local().format('00:mm:ss')

    return (
        <p>
          Time Since Last Request: {formattedElapsedTime} seconds
        </p>
    );
  };


  useEffect(() => {
    const url = 'http://localhost:8000/metrics';

    const fetchData = async () => {
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.text();

        console.log(data);
        setHtml(data);
      } else {
        console.log('Error fetching data:', response.status);
      }
    };

    const interval = setInterval(fetchData, 30000);

    return () => {
      clearInterval(interval);
    };
  }, []);





    return (
        <>
          <div className="time">
            <h1>Server Time during last request: {message}</h1>
            <h1>Local Machine Time {currTime.toLocaleTimeString()} and Date {currDate}</h1>
            <h1>{renderStopwatch()}</h1>
          </div>
          <div className="split">
          <hr />
            </div>
          <div className='metrics'>
            <h1>Metrics</h1>
            {html
                .split('#')
                .map((line) => (
                    line.includes('nodejs_') || line.includes('process_')
                        ? <p key={line}>{'\n' + line}</p>
                        : <p key={line}>{line}</p>
                ))}
          </div>
        </>
    );
}

export default App;
