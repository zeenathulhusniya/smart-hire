const MAX_PDF_BYTES = 5 * 1024 * 1024; // 5 MB

export interface PdfValidationResult {
  valid: boolean;
  error?: string;
}

export function validatePdfFile(file: File | null): PdfValidationResult {
  if (!file) {
    return { valid: false, error: 'Please select a PDF resume file.' };
  }
  const isPdfMime = file.type === 'application/pdf';
  const isPdfExtension = file.name.toLowerCase().endsWith('.pdf');
  if (!isPdfMime && !isPdfExtension) {
    return {
      valid: false,
      error: 'Invalid file format. Only PDF (.pdf) resume files are accepted.',
    };
  }
  if (file.size === 0) {
    return { valid: false, error: 'The selected PDF file is empty.' };
  }
  if (file.size > MAX_PDF_BYTES) {
    return {
      valid: false,
      error: 'File exceeds the 5 MB maximum upload size limit.',
    };
  }
  return { valid: true };
}

/**
 * Lightweight browser PDF text extractor for previewing readable text before
 * sending the multipart PDF binary to the Java Spring Boot backend (Apache PDFBox).
 */
export async function extractPdfTextPreview(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);

  // Verify %PDF- magic header
  const header = new TextDecoder('latin1').decode(bytes.slice(0, 8));
  if (!header.startsWith('%PDF-')) {
    throw new Error('File header is not a valid PDF document.');
  }

  const rawLatin1 = new TextDecoder('latin1').decode(bytes);
  const extractedChunks: string[] = [];

  // Extract parenthesized literal text strings from uncompressed PDF text operators
  const textOperatorMatches = rawLatin1.matchAll(/\(([^()\\]{2,180})\)\s*(?:Tj|TJ|'|")/g);
  for (const match of textOperatorMatches) {
    const cleaned = match[1]
      .replace(/\\n/g, ' ')
      .replace(/\\r/g, ' ')
      .replace(/\\t/g, ' ')
      .replace(/[^\x20-\x7E]/g, ' ')
      .trim();
    if (cleaned.length >= 2 && /[a-zA-Z0-9]/.test(cleaned)) {
      extractedChunks.push(cleaned);
    }
  }

  // Also attempt inflating FlateDecode streams when supported by browser DecompressionStream
  if (extractedChunks.length < 10 && typeof DecompressionStream !== 'undefined') {
    const streamRegex = /stream[\r\n]+([\s\S]*?)[\r\n]+endstream/g;
    let streamMatch: RegExpExecArray | null;
    let inspected = 0;
    while ((streamMatch = streamRegex.exec(rawLatin1)) !== null && inspected < 15) {
      inspected++;
      const streamBody = streamMatch[1];
      const streamBytes = new Uint8Array(streamBody.length);
      for (let i = 0; i < streamBody.length; i++) {
        streamBytes[i] = streamBody.charCodeAt(i) & 0xff;
      }
      try {
        const ds = new DecompressionStream('deflate');
        const writer = ds.writable.getWriter();
        writer.write(streamBytes);
        writer.close();
        const inflatedBuf = await new Response(ds.readable).arrayBuffer();
        const inflatedText = new TextDecoder('latin1').decode(inflatedBuf);
        const innerMatches = inflatedText.matchAll(/\(([^()\\]{2,180})\)/g);
        for (const m of innerMatches) {
          const clean = m[1].replace(/[^\x20-\x7E]/g, ' ').trim();
          if (clean.length >= 2 && /[a-zA-Z0-9]/.test(clean)) {
            extractedChunks.push(clean);
          }
        }
      } catch {
        // Ignore non-deflate streams such as embedded fonts/images
      }
    }
  }

  const combined = extractedChunks.join(' ').replace(/\s+/g, ' ').trim();
  if (combined.length > 30) {
    return combined.slice(0, 6000);
  }

  return `PDF verified (${file.name}, ${(file.size / 1024).toFixed(1)} KB). Full multi-layer text extraction runs on the Java Spring Boot server via Apache PDFBox when connected, or you may paste/edit your resume text below for immediate preview.`;
}
