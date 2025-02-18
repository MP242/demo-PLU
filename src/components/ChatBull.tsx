'use client'


import { FiEdit } from "react-icons/fi";
import { useState } from 'react';


interface ChatBullProps {
    texte: string;
    header: string;
    side: "left" | "right";
    onEdit: (editedSentence: string) => void;
}

const ChatBull = ({ texte, header, side, onEdit }: ChatBullProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedSentence, setEditedSentence] = useState(texte);

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
        <div className={`chat ${side === "left" ? "chat-start" : "chat-end"}`} >
            <div className="chat-header">
                {header}
            </div>
            {isEditing ? (
                <div className="chat-bubble w-full h-32">
                    <textarea
                        className='w-full max-h-full text-black p-2'
                        value={editedSentence}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        autoFocus
                    />
                </div>
            ) : (
                <div className="relative chat-bubble">
                    <div
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        onDoubleClick={handleDoubleClick}
                        className="hover:cursor-pointer">{texte}</div>
                    {isHovered && (
                        <div
                            className="absolute -top-3 -right-3 bg-blue-500 text-white px-2 py-1 rounded transition-opacity"
                        >
                            <FiEdit />
                        </div>
                    )}
                </div>
            )}
        </div >
    )
}

export default ChatBull;
