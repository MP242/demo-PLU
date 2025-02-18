'use client'

import { useState } from 'react';
import { FiEdit } from "react-icons/fi";


interface SentenceProps {
    sentence: string;
    onEdit: (editedSentence: string) => void;
}

const Sentence = ({ sentence, onEdit }: SentenceProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedSentence, setEditedSentence] = useState(sentence);

    const handleDoubleClick = () => {
        setIsEditing(true);
    };

    const handleBlur = () => {
        setIsEditing(false);
        onEdit(editedSentence)
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setEditedSentence(e.target.value);
    };

    return (
        <div>
            {isEditing ? (
                <textarea
                    className='w-full'
                    value={editedSentence}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoFocus
                />
            ) : (
                <div className="relative">
                    <p
                        className="text-md hover:cursor-pointer relative"
                        onDoubleClick={handleDoubleClick}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        <span>
                            {sentence}
                        </span>
                        {isHovered && (
                            <div
                                className="absolute top-0 right-0 bg-blue-500 text-white px-2 py-1 rounded transition-opacity"
                            >
                                <FiEdit/>
                            </div>
                        )}
                    </p>
                </div>
            )}
        </div>
    );
};

export default Sentence;
