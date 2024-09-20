import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';

interface WYSIWYGEditorProps {
  content: string;
  setContent: (content: string) => void;
}

const WYSIWYGEditor: React.FC<WYSIWYGEditorProps> = ({ content, setContent }) => {
  const modules = {
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
        ['link', 'image', 'video'],
        ['clean']
      ],
      handlers: {
        image: imageHandler,
        video: videoHandler,
      },
    },
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video'
  ];

  // Custom Image Handler
  async function imageHandler() {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      if (input.files && input.files[0]) {
        const formData = new FormData();
        formData.append('image', input.files[0]);

        try {
          const res = await axios.post('/api/upload/image', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${localStorage.getItem('token')}`, // Adjust based on your auth implementation
            },
          });
          const url = res.data.url;
          const quill = (this as any).quill;
          const range = quill.getSelection();
          quill.insertEmbed(range.index, 'image', url);
        } catch (error) {
          console.error('Error uploading image:', error);
          alert('Failed to upload image.');
        }
      }
    };
  }

  // Custom Video Handler
  async function videoHandler() {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'video/*');
    input.click();

    input.onchange = async () => {
      if (input.files && input.files[0]) {
        const formData = new FormData();
        formData.append('video', input.files[0]);

        try {
          const res = await axios.post('/api/upload/video', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${localStorage.getItem('token')}`, // Adjust based on your auth implementation
            },
          });
          const url = res.data.url;
          const quill = (this as any).quill;
          const range = quill.getSelection();
          quill.insertEmbed(range.index, 'video', url);
        } catch (error) {
          console.error('Error uploading video:', error);
          alert('Failed to upload video.');
        }
      }
    };
  }

  return (
    <div className="editor-container">
      <ReactQuill
        theme="snow"
        value={content}
        onChange={setContent}
        modules={modules}
        formats={formats}
        placeholder="Start creating your minisite content..."
      />
    </div>
  );
};

export default WYSIWYGEditor;
