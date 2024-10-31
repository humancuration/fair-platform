import React from 'react';
import { Link } from '@remix-run/react';
import { FaGithub, FaTwitter, FaDiscord } from 'react-icons/fa';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <img src="/logo.svg" alt="Logo" className="h-8 w-auto mb-4" />
            <p className="text-gray-500 text-sm">
              Building a more equitable future through collaboration and shared resources.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {['About', 'Blog', 'Careers', 'Contact'].map(link => (
                <li key={link}>
                  <Link
                    to={`/${link.toLowerCase()}`}
                    className="text-gray-500 hover:text-gray-900 transition-colors duration-200"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">
              Connect
            </h3>
            <div className="flex space-x-4">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <FaGithub className="h-6 w-6 text-gray-400 hover:text-gray-900" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <FaTwitter className="h-6 w-6 text-gray-400 hover:text-blue-400" />
              </a>
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer">
                <FaDiscord className="h-6 w-6 text-gray-400 hover:text-indigo-500" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-400 text-sm">
            &copy; {currentYear} Your Platform Name. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;