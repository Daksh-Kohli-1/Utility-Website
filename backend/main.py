from fastapi import FastAPI, Form, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from typing import List

#Email automater
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders

#QR Code
from pydantic import BaseModel
import qrcode 
import io
import base64

#pdf to text
import PyPDF2
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)




@app.post("/send-email")
async def send_email(
    Sender: str = Form(...), 
    Password: str = Form(...),
    Subject: str = Form(...),
    Message: str = Form(...),
    receivers: List[str] = Form(...),
    attachment: UploadFile = File(None),
):
    for rec in receivers:
        msg = MIMEMultipart()
        msg["Subject"] = Subject
        msg["From"] = Sender
        msg["To"] = rec
        msg.attach(MIMEText(Message, "plain"))
        if attachment is not None:
            file_data = await attachment.read()
            part = MIMEBase("application", "octet-stream")
            part.set_payload(file_data)
            encoders.encode_base64(part)
            part.add_header(
                "Content-Disposition",
                f'attachment; filename="{attachment.filename}"'
            )
            msg.attach(part)
        try:
            with smtplib.SMTP("smtp.gmail.com",587) as server:
                server.starttls()
                server.login(Sender,Password)
                server.sendmail(Sender,rec,msg.as_string())
        except Exception as e:
            return {"error": f"Failed to send email to {rec}: {str(e)}"}
    return {"message": "Email sent successfully!"}

@app.post("/generate-qr")
async def generate_qr(URL: str = Form(...)):
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(URL)
    qr.make(fit=True)

    img = qr.make_image(fill="black", back_color="white")
    
    # Convert image to base64
    buffered = io.BytesIO()
    img.save(buffered, format="PNG")
    img_str = base64.b64encode(buffered.getvalue()).decode()
    
    return {
        "message": "QR code generated successfully",
        "qr_code": f"data:image/png;base64,{img_str}"
    }

@app.post("/extract-text")
async def extract_text(pdf: UploadFile = File(...)):
    try:
        # Read the PDF file from the uploaded content
        pdf_reader = PyPDF2.PdfReader(pdf.file)
        text = ""

        for page_num in range(len(pdf_reader.pages)):
            page = pdf_reader.pages[page_num]
            text += page.extract_text() + "\n"

        # Return the extracted text to the frontend
        return {"extracted_text": text.strip()}

    except Exception as e:
        return {"error": str(e)}
