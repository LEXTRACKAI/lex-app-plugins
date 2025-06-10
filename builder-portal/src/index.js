import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

function App() {
  const [deployments, setDeployments] = useState([]);
  const [appId, setAppId] = useState('');
  const [image, setImage] = useState('');

  const loadDeployments = async () => {
    const res = await fetch('http://localhost:3001/deployments');
    const data = await res.json();
    setDeployments(data);
  };

  const deploy = async () => {
    await fetch('http://localhost:3001/deploy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ appId, image })
    });
    loadDeployments();
  };

  useEffect(() => {
    loadDeployments();
  }, []);

  return (
    <div>
      <h1>Builder Portal</h1>
      <div>
        <input placeholder="app id" value={appId} onChange={e => setAppId(e.target.value)} />
        <input placeholder="image" value={image} onChange={e => setImage(e.target.value)} />
        <button onClick={deploy}>Deploy</button>
      </div>
      <h2>Deployments</h2>
      <ul>
        {deployments.map(d => <li key={d}>{d}</li>)}
      </ul>
    </div>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<App />);
