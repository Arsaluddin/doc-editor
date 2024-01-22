import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001'); // Change the URL if your server runs on a different address

function App() {
  const [text, setText] = useState('');

  useEffect(() => {
    // Listen for text changes from the server
    socket.on('text-change', (data) => {
      setText(data);
    });

    // Cleanup on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  const handleTextChange = (e) => {
    const newText = e.target.value;
    setText(newText);

    // Emit text changes to the server
    socket.emit('text-change', newText);
  };

  return (
    <div>
      <textarea value={text} onChange={handleTextChange} />
    </div>
  );
}

export default App;
