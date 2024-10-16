// Assuming you have a button component somewhere in your Next.js app
"use client"
import { useState } from 'react';

const DeleteAllDataButton = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleDelete = async () => {
    setLoading(true);
    setMessage('');
    try {
      const response = await fetch('/api/deleteAllData', {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
      } else {
        setMessage(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Failed to delete data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleDelete} disabled={loading}>
        {loading ? 'Deleting...' : 'Delete All Data'}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default DeleteAllDataButton;
