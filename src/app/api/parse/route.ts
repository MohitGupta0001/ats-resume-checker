// Polyfill standard browser elements for pdfjs-dist / pdf-parse when running on server-side Node.js
if (typeof global !== 'undefined') {
  if (!(global as any).DOMMatrix) {
    (global as any).DOMMatrix = class DOMMatrix {};
  }
  if (!(global as any).ImageData) {
    (global as any).ImageData = class ImageData {};
  }
  if (!(global as any).Path2D) {
    (global as any).Path2D = class Path2D {};
  }
}

import { NextRequest, NextResponse } from 'next/server';
import mammoth from 'mammoth';
const pdfParse = require('pdf-parse');

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    let text = '';

    if (file.name.toLowerCase().endsWith('.pdf')) {
      try {
        const parsed = await pdfParse(buffer);
        text = parsed.text || '';
      } catch (pdfError: any) {
        console.error('PDF parsing error:', pdfError);
        return NextResponse.json({ 
          error: `Failed to parse PDF file. Ensure the PDF contains readable text (not scanned images). Technical: ${pdfError.message || pdfError}` 
        }, { status: 422 });
      }
    } else if (file.name.toLowerCase().endsWith('.docx')) {
      try {
        const parsed = await mammoth.extractRawText({ buffer });
        text = parsed.value || '';
      } catch (docxError: any) {
        console.error('DOCX parsing error:', docxError);
        return NextResponse.json({ 
          error: `Failed to parse DOCX file. Technical: ${docxError.message || docxError}` 
        }, { status: 422 });
      }
    } else {
      return NextResponse.json({ error: 'Unsupported file type. Please upload a PDF or DOCX file.' }, { status: 400 });
    }

    // Clean up basic text issues (e.g. excessive spaces, empty lines)
    const cleanedText = text
      .replace(/\r\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    if (!cleanedText) {
      return NextResponse.json({ 
        error: 'The uploaded file appears to be empty or contains only scanned image pages. Please upload a text-based PDF or DOCX file.' 
      }, { status: 422 });
    }

    return NextResponse.json({ text: cleanedText, filename: file.name });
  } catch (error: any) {
    console.error('File processing error:', error);
    return NextResponse.json({ error: `Internal server error: ${error.message || error}` }, { status: 500 });
  }
}
