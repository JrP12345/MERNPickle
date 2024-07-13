import React,{useState} from 'react';
import '../styles/ContactUs.css'; // Import CSS file for styling


const ContactUs = () => {
  const [message, setMessage] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      const response = await fetch('http://localhost:4000/contact/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
        credentials: "include",
      });

      const result = await response.json();
      if (result.success) {
        setResponseMessage('Message added successfully');
        setMessage('');
      } else {
        setResponseMessage('Failed to add message');
      }
    } catch (error) {
      console.error('Add Message Error:', error);
      setResponseMessage('Internal Server Error');
    }
  };
  return (
    <div className="contact-us-container">
      <div className="contact-us">
        <h2 className="title">Contact Us</h2>
        <div className="content">
          <p className="description">Have a question, comment, or suggestion? We'd love to hear from you! Please use the form below to get in touch with our team.</p>
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
            <label className="label" htmlFor="message">Message:</label>
              <textarea
                className="input"
                id="message"
                name="message"
                placeholder="Your Message"
                rows="4"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              ></textarea>
            </div>
            <button className="submit-button" type="submit">Send Message</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;
