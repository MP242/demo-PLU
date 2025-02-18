'use server'

import XLSX from "xlsx";


export async function XLSX2JSON(fileBase64: string) {
  const workbook = XLSX.read(fileBase64, { type: "base64" });

  const ParseSheet = Object.keys(workbook.Sheets).map((sheetName) => ({
      sheetName,
      sheetData: XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]),
    }));
  return JSON.stringify(ParseSheet);
}
