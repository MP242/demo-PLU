'use client'

import { useEffect, useState } from "react";
import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { AiOutlineCloseCircle } from "react-icons/ai";

interface MyDropzoneProps {
    handleValidataion: (file: any) => void;
}

const MyDropzone = ({ handleValidataion }: MyDropzoneProps) => {
    const [isloading, setIsloading] = useState<boolean>(false)
    const [file, setFile] = useState<any | null>(null)
    const onDrop = useCallback((acceptedFiles: any) => {
        setFile(acceptedFiles[0])
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })
    const handle = async () => {
        setIsloading(true)
        await handleValidataion(file);
        setIsloading(false)
    }

    return (
        <div className="space-y-5 w-full h-full">
            <div {...getRootProps({
                onClick: event => event.stopPropagation()
            })} className={`w-full h-full rounded border-2 border-dashed ${isDragActive ? " border-blue-700" : "border-gray-600"}`}>
                <input {...getInputProps()} />
                <div className='flex flex-col items-center justify-center h-full'>
                    {file !== null ? (
                        <p className="flex flex-col">{file.name}
                            <AiOutlineCloseCircle className="w-6 h-6 ml-auto text-red-500 cursor-pointer" onClick={() => setFile(null)} />
                        </p>
                    ) : (
                        <p>Drag & drop files here, or click to select files</p>
                    )}
                </div>
            </div>
            <button
                disabled={isloading}
                onClick={() => handle()}
                className="btn btn-primary w-full">Valider
            </button>
        </div>
    )
}

export default MyDropzone
