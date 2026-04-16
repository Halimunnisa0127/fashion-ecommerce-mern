import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ZoomedImageModal = ({ isOpen, onClose, imageSrc, altText }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.8 }}
                        className="max-w-4xl max-h-full"
                    >
                        <img
                            src={imageSrc}
                            alt={altText}
                            className="w-full h-full object-contain"
                        />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ZoomedImageModal;