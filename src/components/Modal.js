// src/components/Modal.js with animations
import React from 'react';

const Modal = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
            onClick={onClose}
            style={{
                animation: 'fadeIn 0.2s ease-in-out'
            }}
        >
            <div 
                className="bg-white rounded-lg p-6 w-96 shadow-xl"
                onClick={e => e.stopPropagation()}
                style={{
                    animation: 'slideIn 0.2s ease-in-out'
                }}
            >
                <h2 className="text-xl font-semibold mb-4">{title}</h2>
                <p className="text-gray-600 mb-6">{message}</p>
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

// Add these styles to your global CSS file (src/index.css or App.css)
const styles = `
@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

@keyframes slideIn {
    from {
        transform: translateY(-20px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}
`;

// Create a style element and append it to the document head
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default Modal;