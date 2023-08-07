import React, { useEffect, useState, useCallback } from 'react';
import './App.css';

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

    fetchData();
  }, []);




    return (
        <>
          <div className="time">
            <h1>{message}</h1>
            <h1>Current Date and Time</h1>
            <p>Date: {currDate}</p>
            <p>Time: {currTime.toLocaleTimeString()}</p>
          </div>
          <hr/>
          <div className='metrics'>
            <h1>Metrics</h1>
            {html}
          </div>
        </>
    );
}

export default App;
