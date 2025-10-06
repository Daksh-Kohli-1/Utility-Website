"use client"
import { useState } from 'react';
import { Mail, Users, Upload, Send, X, Lock, CheckCircle, Loader2 } from 'lucide-react';

export default function BulkEmailSend() {
  const [sender, setSender] = useState('');
  const [pass, setPass] = useState('');
  const [receivers, setReceivers] = useState([]);
  const [emailInput, setEmailInput] = useState('');
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [progress, setProgress] = useState(0);
  const [sentCount, setSentCount] = useState(0);

  const handleAddEmail = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const email = emailInput.trim();
      if (email && !receivers.includes(email)) {
        setReceivers([...receivers, email]);
        setEmailInput('');
      }
    }
  };

  const handleRemoveEmail = (emailToRemove) => {
    setReceivers(receivers.filter(email => email !== emailToRemove));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 10 * 1024 * 1024) {
      setAttachment(file);
    } else {
      alert('File size must be less than 10MB');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.size <= 10 * 1024 * 1024) {
      setAttachment(file);
    } else {
      alert('File size must be less than 10MB');
    }
  };

  const resetForm = () => {
    setSender('');
    setPass('');
    setReceivers([]);
    setEmailInput('');
    setMessage('');
    setSubject('');
    setAttachment(null);
    setProgress(0);
    setSentCount(0);
  };

  const handleSendEmail = async () => {
    if (!sender || !pass || receivers.length === 0 || !subject || !message) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSending(true);
    setProgress(0);
    setSentCount(0);

    try {
      const formData = new FormData();
      formData.append("Sender", sender);
      formData.append("Password", pass);
      formData.append("Subject", subject);
      formData.append("Message", message);
      receivers.forEach((email) => { formData.append("receivers", email) });
      if (attachment) {
        formData.append("attachment", attachment);
      }

      // Simulate progress animation
      const totalReceivers = receivers.length;
      const progressInterval = setInterval(() => {
        setSentCount(prev => {
          if (prev < totalReceivers) {
            setProgress(((prev + 1) / totalReceivers) * 100);
            return prev + 1;
          }
          return prev;
        });
      }, 1000);

      const response = await fetch("http://localhost:8000/send-email", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      clearInterval(progressInterval);
      setProgress(100);
      setSentCount(totalReceivers);

      setTimeout(() => {
        alert(data.message || "Email sent successfully!");
        setIsSending(false);
        resetForm();
      }, 1000);

    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send email.");
      setIsSending(false);
      setProgress(0);
      setSentCount(0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Mail className="w-8 h-8 text-cyan-500" />
            <h1 className="text-3xl font-bold text-gray-800">Bulk Email Sender</h1>
          </div>
        </div>

        {/* Progress Bar Overlay */}
        {isSending && (
          <div className="mb-6 bg-cyan-50 border-2 border-cyan-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 text-cyan-500 animate-spin" />
                <span className="text-gray-700 font-semibold">Sending Emails...</span>
              </div>
              <span className="text-cyan-600 font-bold">{sentCount} / {receivers.length}</span>
            </div>
            
            <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-400 to-cyan-600 transition-all duration-500 ease-out flex items-center justify-end pr-2"
                style={{ width: `${progress}%` }}
              >
                {progress > 10 && (
                  <Mail className="w-3 h-3 text-white animate-pulse" />
                )}
              </div>
            </div>
            
            {progress === 100 && (
              <div className="flex items-center justify-center gap-2 mt-3 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">All emails sent successfully!</span>
              </div>
            )}
          </div>
        )}

        {/* Email Sender */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Email Sender</label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              placeholder="you@example.com"
              disabled={isSending}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-700 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        {/* Password of APP */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">App Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="XXXX XXXX XXXX"
              disabled={isSending}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-700 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        {/* Email Receiver */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Email Receiver</label>
          <div className="relative">
            <Users className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <div className={`w-full min-h-[48px] pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-cyan-500 focus-within:border-transparent flex flex-wrap gap-2 items-center ${isSending ? 'bg-gray-100 cursor-not-allowed' : ''}`}>
              {receivers.map((email, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 bg-cyan-100 text-cyan-700 px-3 py-1 rounded-full text-sm"
                >
                  {email}
                  {!isSending && (
                    <button
                      onClick={() => handleRemoveEmail(email)}
                      className="hover:bg-cyan-200 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </span>
              ))}
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                onKeyDown={handleAddEmail}
                placeholder={receivers.length === 0 ? "recipient@example.com" : ""}
                disabled={isSending}
                className="flex-1 min-w-[200px] outline-none text-gray-700 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">Press Enter or comma to add multiple emails</p>
        </div>

        {/* Attachment */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Attachment</label>
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-cyan-500 transition-colors ${isSending ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
          >
            <input
              type="file"
              id="file-upload"
              onChange={handleFileChange}
              accept=".png,.jpg,.jpeg,.gif,.pdf,.docx,.xlsx"
              disabled={isSending}
              className="hidden"
            />
            <label htmlFor="file-upload" className={isSending ? 'cursor-not-allowed' : 'cursor-pointer'}>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-gray-400 rounded-full flex items-center justify-center mb-3">
                  <Upload className="w-8 h-8 text-white" />
                </div>
                {attachment ? (
                  <p className="text-gray-700 font-medium">{attachment.name}</p>
                ) : (
                  <>
                    <p className="text-cyan-500 font-medium mb-1">Upload a file</p>
                    <p className="text-gray-500 text-sm">or drag and drop</p>
                  </>
                )}
                <p className="text-gray-400 text-xs mt-2">PNG, JPG, GIF, DOC, PDF, XLSX up to 10MB</p>
              </div>
            </label>
          </div>
        </div>

        {/* Subject */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Subject</label>
          <textarea
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Write your subject here..."
            rows="2"
            disabled={isSending}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none text-gray-700 disabled:bg-gray-100 disabled:cursor-not-allowed"
          ></textarea>
        </div>

        {/* Message */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your message here..."
            rows="5"
            disabled={isSending}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none text-gray-700 disabled:bg-gray-100 disabled:cursor-not-allowed"
          ></textarea>
        </div>

        {/* Send Button */}
        <button
          onClick={handleSendEmail}
          disabled={isSending}
          className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSending ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Send Email
            </>
          )}
        </button>
      </div>
    </div>
  );
}