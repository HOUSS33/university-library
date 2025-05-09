import html2canvas from "html2canvas"
import jsPDF from "jspdf"

interface Book {
  id: string
  title: string
  author: string
  genre?: string
}

interface ReceiptData {
  receiptId: string
  book: Book | null
  borrowedDate: Date
  dueDate: Date
  userName: string | undefined
}

export const generateReceipt = async (data: ReceiptData) => {
  // Create a temporary div to render the receipt
  const receiptContainer = document.createElement("div")
  receiptContainer.style.position = "absolute"
  receiptContainer.style.left = "-9999px"
  receiptContainer.style.top = "-9999px"
  receiptContainer.style.width = "595px" // A4 width in pixels at 72 DPI

  // Calculate duration in days
  const borrowDate = new Date(data.borrowedDate)
  const dueDate = new Date(data.dueDate)
  const durationDays = Math.ceil((dueDate.getTime() - borrowDate.getTime()) / (1000 * 60 * 60 * 24))

  // Format dates
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  // Create receipt HTML
  receiptContainer.innerHTML = `
    <div style="
      background-color: #1a2234; 
      color: white; 
      font-family: Arial, sans-serif;
      padding: 30px;
      border-radius: 10px;
      position: relative;
      width: 100%;
      box-sizing: border-box;
    ">
      <div style="display: flex; align-items: center; margin-bottom: 20px;">
        <div style="
          background-color: white;
          color: #1a2234;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 5px;
          margin-right: 10px;
          font-weight: bold;
          font-size: 24px;
        ">📚</div>
        <h1 style="margin: 0; font-size: 24px;">BookWise</h1>
      </div>
      
      <h2 style="margin-top: 0; margin-bottom: 20px; font-size: 20px;">Borrow Receipt</h2>
      
      <div style="margin-bottom: 10px;">Receipt ID: ${data.receiptId}</div>
      <div style="margin-bottom: 20px;">Date Issued: ${formatDate(new Date())}</div>
      
      <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.2); margin: 20px 0;">
      
      <h3 style="margin-top: 0; margin-bottom: 15px;">Book Details:</h3>
      <ul style="list-style-type: none; padding-left: 0; margin-top: 0;">
        <li style="margin-bottom: 8px;">• Title: ${data.book?.title}</li>
        <li style="margin-bottom: 8px;">• Author: ${data.book?.author}</li>
        ${data.book?.genre ? `<li style="margin-bottom: 8px;">• Genre: ${data.book?.genre}</li>` : ""}
        <li style="margin-bottom: 8px;">• Borrowed On: ${formatDate(borrowDate)}</li>
        <li style="margin-bottom: 8px;">• Due Date: ${formatDate(dueDate)}</li>
        <li style="margin-bottom: 8px;">• Duration: ${durationDays} Days</li>
      </ul>
      
      <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.2); margin: 20px 0;">
      
      <h3 style="margin-top: 0; margin-bottom: 15px;">Terms</h3>
      <ul style="list-style-type: none; padding-left: 0; margin-top: 0;">
        <li style="margin-bottom: 8px;">• Please return the book by the due date.</li>
        <li style="margin-bottom: 8px;">• Lost or damaged books may incur replacement costs.</li>
      </ul>
      
      <div style="margin-top: 30px;">
        <p>Thank you for using <strong>BookWise</strong>!</p>
        <p style="margin-bottom: 5px;">Website: <a href="https://university-library-mu-five.vercel.app/" style="color: #a3c9ff;">https://university-library-mu-five.vercel.app/</a></p>
        <p style="margin-top: 0;">Email: <a href="mailto:houssametach@gmail.com" style="color: #a3c9ff;">houssametach@gmail.com</a></p>
      </div>
      
      <div style="
        position: absolute;
        bottom: -10px;
        left: 0;
        right: 0;
        height: 20px;
        background-image: radial-gradient(circle at 10px 0, transparent 10px, #1a2234 10px);
        background-size: 20px 20px;
        background-position: bottom;
        background-repeat: repeat-x;
      "></div>
    </div>
  `

  document.body.appendChild(receiptContainer)

  try {
    // Convert the HTML to canvas
    const canvas = await html2canvas(receiptContainer, {
      scale: 2, // Higher scale for better quality
      backgroundColor: null,
      logging: false,
    })

    // Create PDF
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    })

    // Add the canvas as an image to the PDF
    const imgData = canvas.toDataURL("image/png")
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight)

    // Save the PDF
    pdf.save(`BookWise_Receipt_${data.receiptId}.pdf`)
  } finally {
    // Clean up
    document.body.removeChild(receiptContainer)
  }
}
