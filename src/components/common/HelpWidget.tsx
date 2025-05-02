import React, { useState } from 'react';
import { HelpCircle, X, Search, ExternalLink } from 'lucide-react';
import { t } from '../../utils/i18n';

interface HelpWidgetProps {
  position?: 'bottom-right' | 'bottom-left';
}

export const HelpWidget: React.FC<HelpWidgetProps> = ({
  position = 'bottom-right',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'faq' | 'contact'>('faq');
  
  const positionClasses = position === 'bottom-right' 
    ? 'bottom-6 right-6' 
    : 'bottom-6 left-6';
  
  const faqItems = [
    {
      question: 'How do I sign an agreement?',
      answer: 'Navigate to the Agreements page, select the agreement you want to sign, and click the "Sign" button. Follow the prompts to complete the signature process.'
    },
    {
      question: 'How can I reset my password?',
      answer: 'Go to the Settings > Security page and click "Change Password". You will need to enter your current password first.'
    },
    {
      question: 'Can I export my agreements?',
      answer: 'Yes, on the Agreements page, select the agreements you want to export and use the "Export" button to download them as PDF or CSV.'
    },
    {
      question: 'How do I enable two-factor authentication?',
      answer: 'Go to Settings > Security and click "Enable Two-Factor Authentication". Follow the steps to set it up with your authenticator app.'
    },
  ];
  
  const filteredFaqs = searchQuery
    ? faqItems.filter(item => 
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqItems;
  
  return (
    <>
      {/* Help Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed ${positionClasses} bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg z-40 transition-all`}
        aria-label="Open Help"
      >
        <HelpCircle size={24} />
      </button>
      
      {/* Help Panel */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
          <div className="bg-white dark:bg-gray-800 w-full max-w-md h-full flex flex-col shadow-xl animate-slide-in-right">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">{t('help.title')}</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                aria-label="Close help panel"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button
                className={`flex-1 py-3 text-sm font-medium ${
                  activeTab === 'faq'
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
                onClick={() => setActiveTab('faq')}
              >
                {t('help.faqs')}
              </button>
              <button
                className={`flex-1 py-3 text-sm font-medium ${
                  activeTab === 'contact'
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
                onClick={() => setActiveTab('contact')}
              >
                {t('help.contact')}
              </button>
            </div>
            
            <div className="p-4 flex-grow overflow-auto">
              {activeTab === 'faq' ? (
                <>
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search help topics..."
                      className="w-full py-2 pl-10 pr-4 text-sm bg-gray-100 dark:bg-gray-700 border border-transparent rounded-lg focus:outline-none focus:bg-white focus:border-blue-500 dark:focus:bg-gray-600 transition-colors"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      aria-label="Search help topics"
                    />
                  </div>
                  
                  {filteredFaqs.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <p>No results found for "{searchQuery}"</p>
                      <p className="mt-2 text-sm">Try a different search term or contact support.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredFaqs.map((item, index) => (
                        <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                          <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                            {item.question}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {item.answer}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="mt-6 text-center">
                    <a
                      href="/help"
                      className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    >
                      Visit help center
                      <ExternalLink size={14} className="ml-1" />
                    </a>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-400">
                    Need help with something specific? Our support team is ready to assist you.
                  </p>
                  
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="support-subject">
                        Subject
                      </label>
                      <input
                        id="support-subject"
                        type="text"
                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 bg-white dark:bg-gray-700 text-sm"
                        placeholder="What do you need help with?"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="support-message">
                        Message
                      </label>
                      <textarea
                        id="support-message"
                        rows={4}
                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 bg-white dark:bg-gray-700 text-sm"
                        placeholder="Please describe your issue in detail..."
                      />
                    </div>
                    
                    <button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
                    >
                      Submit Request
                    </button>
                  </form>
                  
                  <div className="text-center mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Urgent issue? Contact us directly:
                    </p>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1">
                      support@agentagreement.nexus
                    </p>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      (555) 123-4567
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
