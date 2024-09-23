import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import { useCallback } from 'react';

interface WYSIWYGEditorProps {
  content: string;
  setContent: (content: string) => void;
  onInsertComponent: (index: number) => void;
}

const WYSIWYGEditor: React.FC<WYSIWYGEditorProps> = ({ content, setContent, onInsertComponent }) => {
  const modules = {
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
        ['link', 'image', 'video'],
        ['clean'],
        ['insertComponent'],
      ],
      handlers: {
        image: imageHandler,
        video: videoHandler,
        insertComponent: function() {
          const range = this.quill.getSelection();
          if (range) {
            onInsertComponent(range.index);
          }
        },
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
        try {
          const url = await handleUpload(input.files[0], 'image');
          const quill = (this as any).quill;
          const range = quill.getSelection();
          quill.insertEmbed(range.index, 'image', url);
        } catch (error) {
          // Error already handled in handleUpload
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
        try {
          const url = await handleUpload(input.files[0], 'video');
          const quill = (this as any).quill;
          const range = quill.getSelection();
          quill.insertEmbed(range.index, 'video', url);
        } catch (error) {
          // Error already handled in handleUpload
        }
      }
    };
  }

  const handleUpload = async (file: File, type: 'image' | 'video') => {
    const formData = new FormData();
    formData.append(type, file);

    try {
      const res = await axios.post(`/api/upload/${type}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return res.data.url;
    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
      alert(`Failed to upload ${type}.`);
      throw error; // Rethrow to handle in the calling function
    }
  };

  const handleInsertComponent = useCallback((index: number) => {
    const quill = (this as any).quill;
    quill.insertText(index, 'Insert Component Here', 'bold', true);
    onInsertComponent(index);
  }, [onInsertComponent]);

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
