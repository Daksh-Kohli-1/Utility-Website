from fastapi import FastAPI, Form, UploadFile, File, Response
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

#For image compressor
from PIL import Image
import io


#File converter
from pdf2docx import Converter
from docx2pdf import convert as docx_to_pdf
import os
import tempfile

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

@app.post("/compress-image")
async def compress_image(image: UploadFile = File(...)):
    try:
        # Read file into memory
        contents = await image.read()
        img = Image.open(io.BytesIO(contents))

        # Remove metadata to save space
        data = list(img.getdata())
        img_no_exif = Image.new(img.mode, img.size)
        img_no_exif.putdata(data)

        # Detect original format
        original_format = img.format or "JPEG"

        # Prepare in-memory buffer
        compressed_io = io.BytesIO()

        # Apply optimized compression depending on format
        if original_format.upper() in ["JPEG", "JPG"]:
            img_no_exif.save(compressed_io, format="JPEG", optimize=True, quality=50)
        elif original_format.upper() == "PNG":
            img_no_exif.save(compressed_io, format="PNG", optimize=True)
        else:
            # Convert unsupported formats to JPEG
            img_no_exif = img_no_exif.convert("RGB")
            img_no_exif.save(compressed_io, format="JPEG", optimize=True, quality=50)

        compressed_io.seek(0)

        return Response(
            content=compressed_io.getvalue(),
            media_type=f"image/{original_format.lower()}",
            headers={
                "Content-Disposition": f"attachment; filename=compressed_{image.filename}"
            },
        )
    except Exception as e:
        return {"error": str(e)}



@app.post("/pdf-to-word")
async def pdf_to_word(file: UploadFile = File(...)):
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_pdf:
            temp_pdf.write(await file.read())
            temp_pdf_path = temp_pdf.name

        output_path = temp_pdf_path.replace(".pdf", ".docx")

        cv = Converter(temp_pdf_path)
        cv.convert(output_path, start=0, end=None)
        cv.close()

        with open(output_path, "rb") as f:
            converted_data = f.read()

        os.remove(temp_pdf_path)
        os.remove(output_path)

        return Response(
            content=converted_data,
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            headers={"Content-Disposition": f"attachment; filename=converted_{file.filename}.docx"},
        )

    except Exception as e:
        return {"error": str(e)}


@app.post("/word-to-pdf")
async def word_to_pdf(file: UploadFile = File(...)):
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".docx") as temp_docx:
            temp_docx.write(await file.read())
            temp_docx_path = temp_docx.name

        output_path = temp_docx_path.replace(".docx", ".pdf")


        docx_to_pdf(temp_docx_path, output_path)


        with open(output_path, "rb") as f:
            converted_data = f.read()

        os.remove(temp_docx_path)
        os.remove(output_path)

        return Response(
            content=converted_data,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename=converted_{file.filename}.pdf"},
        )

    except Exception as e:
        return {"error": str(e)}

