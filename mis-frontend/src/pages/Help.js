import React from 'react';
import Card, { CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Mail, Phone, LifeBuoy } from 'lucide-react';
import Button from '../components/ui/Button';

const Help = () => {
  const faqs = [
    { question: "How do I submit my daily activity?", answer: "Navigate to the 'Daily Activity Submission' section in the sidebar, fill out the form, and click submit." },
    { question: "Where can I view my past submissions?", answer: "Your historical activity records are available under 'My Submissions' in the sidebar." },
    { question: "I forgot my password, what should I do?", answer: "Please contact your administrator or use the 'Forgot Password' link on the sign-in page." },
    { question: "How do I report a system bug?", answer: "You can use the support request form below or contact us via email." },
  ];

  const handleSupportRequest = (e) => {
    e.preventDefault();
    alert("Support request submitted! We will get back to you shortly.");
    // In a real application, you would send this to a backend API
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-900 mb-8">Help & Support</h1>

        {/* FAQs Section */}
        <Card className="shadow-lg border-0 mb-8">
          <CardHeader className="bg-blue-800 text-white">
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b pb-4 last:border-b-0">
                  <h3 className="font-semibold text-lg text-gray-800 mb-1">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="shadow-lg border-0 mb-8">
          <CardHeader className="bg-blue-800 text-white">
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-4">
              <Mail className="w-6 h-6 text-blue-600" />
              <div>
                <h3 className="font-semibold text-gray-800">Email Support</h3>
                <p className="text-blue-600">support@mevricksolution.com</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Phone className="w-6 h-6 text-blue-600" />
              <div>
                <h3 className="font-semibold text-gray-800">Phone Support</h3>
                <p className="text-blue-600">+91-1234567890</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support Request Form */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-blue-800 text-white">
            <CardTitle>Submit a Support Request</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSupportRequest} className="space-y-4">
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
                <input 
                  type="text" 
                  id="subject" 
                  name="subject" 
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  placeholder="Briefly describe your issue"
                  required
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea 
                  id="description" 
                  name="description" 
                  rows="4" 
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  placeholder="Provide detailed information about your issue"
                  required
                ></textarea>
              </div>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
                <LifeBuoy className="w-4 h-4" />
                Submit Request
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Help;