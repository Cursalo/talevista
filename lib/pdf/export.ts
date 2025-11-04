import jsPDF from 'jspdf';

export interface StoryExportData {
  title: string;
  description?: string;
  author: string;
  chapters: {
    title: string;
    content: string;
    image?: string;
  }[];
  coverImage?: string;
}

export async function exportStoryToPDF(story: StoryExportData): Promise<Blob> {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  // Cover Page
  pdf.setFontSize(32);
  pdf.setFont('helvetica', 'bold');
  const titleLines = pdf.splitTextToSize(story.title, contentWidth);
  pdf.text(titleLines, pageWidth / 2, 80, { align: 'center' });

  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`by ${story.author}`, pageWidth / 2, 100, { align: 'center' });

  if (story.description) {
    pdf.setFontSize(12);
    const descLines = pdf.splitTextToSize(story.description, contentWidth - 40);
    pdf.text(descLines, pageWidth / 2, 120, { align: 'center' });
  }

  // Add cover image if available
  if (story.coverImage) {
    try {
      // In a real implementation, you'd fetch and convert the image
      // pdf.addImage(story.coverImage, 'JPEG', margin, 140, contentWidth, 100);
    } catch (error) {
      console.error('Error adding cover image:', error);
    }
  }

  // Table of Contents
  pdf.addPage();
  yPosition = margin;
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Table of Contents', margin, yPosition);

  yPosition += 15;
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');

  story.chapters.forEach((chapter, index) => {
    if (yPosition > pageHeight - margin) {
      pdf.addPage();
      yPosition = margin;
    }
    pdf.text(`Chapter ${index + 1}: ${chapter.title}`, margin + 5, yPosition);
    pdf.text(`${index + 3}`, pageWidth - margin - 10, yPosition, { align: 'right' });
    yPosition += 8;
  });

  // Chapters
  story.chapters.forEach((chapter, index) => {
    pdf.addPage();
    yPosition = margin;

    // Chapter number
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Chapter ${index + 1}`, margin, yPosition);
    yPosition += 10;

    // Chapter title
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    const chapterTitleLines = pdf.splitTextToSize(chapter.title, contentWidth);
    pdf.text(chapterTitleLines, margin, yPosition);
    yPosition += chapterTitleLines.length * 8 + 5;

    // Chapter image
    if (chapter.image) {
      try {
        // In a real implementation, you'd fetch and convert the image
        // pdf.addImage(chapter.image, 'JPEG', margin, yPosition, contentWidth, 80);
        // yPosition += 90;
      } catch (error) {
        console.error('Error adding chapter image:', error);
      }
    }

    // Chapter content
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');

    const paragraphs = chapter.content.split('\n\n');

    paragraphs.forEach(paragraph => {
      if (paragraph.trim()) {
        const lines = pdf.splitTextToSize(paragraph, contentWidth);

        lines.forEach(line => {
          if (yPosition > pageHeight - margin - 10) {
            pdf.addPage();
            yPosition = margin;
          }
          pdf.text(line, margin, yPosition);
          yPosition += 6;
        });

        yPosition += 4; // Extra space between paragraphs
      }
    });
  });

  // Footer on all pages
  const pageCount = pdf.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(
      `${i} / ${pageCount}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
    pdf.text(
      story.title,
      margin,
      pageHeight - 10
    );
  }

  return pdf.output('blob');
}

export function downloadPDF(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
