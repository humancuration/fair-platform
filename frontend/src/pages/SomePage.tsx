import React, { useState } from 'react';
import Modal from '../components/Modal';
import Button from '../components/Button';

const SomePage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        title="Sample Modal"
        footer={
          <div className="flex justify-end space-x-2">
            <Button onClick={() => setIsModalOpen(false)}>Close</Button>
            <Button variant="primary">Confirm</Button>
          </div>
        }
      >
        <p>This is a reusable modal component.</p>
      </Modal>
    </div>
  );
};

export default SomePage;