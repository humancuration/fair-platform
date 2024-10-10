import axios from 'axios';

export const exportAsStatic = async () => {
  try {
    const response = await axios.post('/api/export-static');
    const { html, css, js } = response.data;

    // Create downloadable files
    downloadFile('index.html', html);
    downloadFile('styles.css', css);
    downloadFile('scripts.js', js);

    alert('Static files exported successfully!');
  } catch (error) {
    console.error('Error exporting static files:', error);
    alert('Failed to export static files.');
  }
};

const downloadFile = (filename: string, content: string) => {
  const blob = new Blob([content], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = filename;
  link.click();
};