'use client'

import { useState } from 'react';
import { useCSVReader, lightenDarkenColor, formatFileSize } from 'react-papaparse';
import * as XLSX from 'xlsx';
import path from 'path';

const DEFAULT_REMOVE_HOVER_COLOR = '#A01919';
const REMOVE_HOVER_COLOR_LIGHT = lightenDarkenColor(DEFAULT_REMOVE_HOVER_COLOR, 40);

interface CSVReaderProps {
  getRootProps: () => Record<string, any>;
  acceptedFile: any;
  ProgressBar: React.ComponentType;
  getRemoveFileProps: () => Record<string, any>;
  Remove: React.ComponentType<{ color: string }>;
}

interface FileUploadProps {
  setData: (data: { data: Record<string, any>[], name: string }) => void;
}

const FileUpload = ({ setData }: FileUploadProps) => {
  const { CSVReader } = useCSVReader();
  const [zoneHover, setZoneHover] = useState<boolean>(false);
  const [removeHoverColor, setRemoveHoverColor] = useState(DEFAULT_REMOVE_HOVER_COLOR);

  return (
    <CSVReader
      config={{
        header: true,
        skipEmptyLines: true,
      }}
      onUploadAccepted={(results: any, file: any) => {
        const extension = path.extname(file.name.toString());
        if (extension === '.xls') {
          const reader = new FileReader();
          reader.onload = (e) => {
            const binary = e.target?.result;
            const workbook = XLSX.read(binary, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const headerRange = XLSX.utils.decode_range(sheet['!ref'] ?? '');
            const header = [];
            for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
              const cellAddress = { c: C, r: headerRange.s.r };
              const headerCell = XLSX.utils.encode_cell(cellAddress);
              header.push(sheet[headerCell]?.v);
            }

            const data: Record<string, any>[] = XLSX.utils.sheet_to_json(sheet, {
              header: header,
              range: 1,
            });
            setData({ data: data, name: file?.name || '' });
          };
          reader.readAsArrayBuffer(file);
        } else {
          setData({ data: results.data, name: file?.name });
        }
        setZoneHover(false);
      }}
      onDragOver={(event: { preventDefault: () => void; }) => {
        event.preventDefault();
        setZoneHover(true);
      }}
      onDragLeave={(event: { preventDefault: () => void; }) => {
        event.preventDefault();
        setZoneHover(false);
      }}
      noClick
    >
      {({
        getRootProps,
        acceptedFile,
        ProgressBar,
        getRemoveFileProps,
        Remove,
      }: CSVReaderProps) => (
        <>
          <div
            {...getRootProps()}
            className={`${zoneHover ? 'border-gray-600' : 'border-2'
              } border-dashed rounded-2xl p-10 flex flex-col items-center ${zoneHover ? 'border-gray-600' : 'border-gray-300'
              }`}
          >
            {acceptedFile ? (
              <>
                <div className="relative flex flex-col items-center bg-gradient-to-b from-gray-200 to-gray-300 rounded-2xl h-120 w-120">
                  <div className="flex flex-col pl-10 pr-10">
                    <span className="bg-opacity-40 bg-gray-200 rounded-3 mb-0.5em flex justify-center">
                      {formatFileSize(acceptedFile.size)}
                    </span>
                    <span className="bg-opacity-40 bg-gray-200 rounded-3 text-xs mb-0.5em">
                      {acceptedFile.name}
                    </span>
                  </div>
                  <div className="absolute bottom-14 w-full pl-10 pr-10">
                    <ProgressBar />
                  </div>
                  <div
                    {...getRemoveFileProps()}
                    className="absolute top-6 right-6 h-23 w-23"
                    onMouseOver={() => setRemoveHoverColor(REMOVE_HOVER_COLOR_LIGHT)}
                    onMouseOut={() => setRemoveHoverColor(DEFAULT_REMOVE_HOVER_COLOR)}
                  >
                    <Remove color={removeHoverColor} />
                  </div>
                </div>
              </>
            ) : (
              'Glissez-déposez le fichier ici'
            )}
          </div>
        </>
      )}
    </CSVReader>
  );
}

export default FileUpload;
