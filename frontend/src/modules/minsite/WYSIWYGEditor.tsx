import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import { useCallback } from 'react';
import ProductSelector from './components/ProductSelector';

interface WYSIWYGEditorProps {
  content: string;
  setContent: (content: string) => void;
  onInsertComponent: (index: number) => void;
}

const WYSIWYGEditor: React.FC<WYSIWYGEditorProps> = ({ 
  content, 
  setContent, 
  onInsertComponent 
}) => {
  const [showProductSelector, setShowProductSelector] = useState(false);
  const [insertIndex, setInsertIndex] = useState<number | null>(null);

  const modules = {
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
        ['link', 'image', 'video'],
        ['clean'],
        ['insertComponent'],
        ['insertProduct'],
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
        insertProduct: function() {
          const range = this.quill.getSelection();
          if (range) {
            setInsertIndex(range.index);
            setShowProductSelector(true);
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

  const handleProductSelect = (products: Product[]) => {
    if (insertIndex !== null) {
      const productEmbed = products.map(product => ({
        type: 'productEmbed',
        product
      }));
      
      // Insert custom blot for products
      const quill = (this as any).quill;
      quill.insertEmbed(insertIndex, 'productEmbed', productEmbed);
    }
    setShowProductSelector(false);
    setInsertIndex(null);
  };

  return (
    <div className="relative">
      <ReactQuill
        theme="snow"
        value={content}
        onChange={setContent}
        modules={modules}
        formats={formats}
      />

      {showProductSelector && (
        <div className="absolute top-0 left-0 w-full h-full bg-white z-50">
          <ProductSelector
            onSelect={handleProductSelect}
            maxProducts={4}
          />
        </div>
      )}
    </div>
  );
};

export default WYSIWYGEditor;
