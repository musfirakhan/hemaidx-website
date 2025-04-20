import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const Contact = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-light to-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-secondary mb-8 text-center">Contact Us</h1>
          
          <div className="bg-white rounded-lg shadow-xl p-12">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                    <textarea
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="bg-secondary text-white px-8 py-3 rounded-lg hover:bg-secondary-dark transition-colors"
                  >
                    Send Message
                  </button>
                </form>
              </div>
              
              <div>
                <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <Mail className="w-6 h-6 text-secondary mt-1" />
                    <div>
                      <h3 className="font-medium">Email</h3>
                      <p className="text-gray-600">hemaidx.portablelab@gmail.com</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <Phone className="w-6 h-6 text-secondary mt-1" />
                    <div>
                      <h3 className="font-medium">Phone</h3>
                      <p className="text-gray-600">+92 (303) </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <MapPin className="w-6 h-6 text-secondary mt-1" />
                    <div>
                      <h3 className="font-medium">Address</h3>
                      <p className="text-gray-600">
                        College of E&ME<br />
                        NUST<br />
                        Rawalpindi, Pakistan
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;