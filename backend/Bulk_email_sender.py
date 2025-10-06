from fastapi import FastAPI, Form, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from typing import List

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders

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

