import React, { useState } from 'react';

function App() {
  const [file, setFile] = useState(null);
  const [pages, setPages] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handlePagesChange = (e) => {
    setPages(e.target.value);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('pages', pages);

    try {
      const response = await fetch('http://localhost:3001/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = 'extracted.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        console.error('Failed to upload file');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>PDF Page Extractor</h1>
      <input type="file" accept=".pdf" onChange={handleFileChange} />
      <br />
      <label>Select Pages (comma-separated):</label>
      <input type="text" value={pages} onChange={handlePagesChange} />
      <br />
      <button onClick={handleUpload}>Extract Pages</button>
    </div>
  );
}

export default App;
