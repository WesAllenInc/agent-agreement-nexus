import React, { useState } from 'react';

// Simple demo page to showcase our performance optimizations
export default function Demo() {
  const [count, setCount] = useState(0);
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Agent Agreement Nexus - Performance Demo
      </h1>
      
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Performance Optimizations</h2>
        
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-md">
            <h3 className="font-medium">Bundle Optimization</h3>
            <ul className="list-disc pl-5 mt-2">
              <li>Enhanced code splitting</li>
              <li>Terser minification</li>
              <li>Optimized dependencies</li>
            </ul>
          </div>
          
          <div className="p-4 bg-green-50 rounded-md">
            <h3 className="font-medium">Component Optimization</h3>
            <ul className="list-disc pl-5 mt-2">
              <li>React.memo for pure components</li>
              <li>useCallback for event handlers</li>
              <li>Proper cleanup in useEffect</li>
            </ul>
          </div>
          
          <div className="p-4 bg-purple-50 rounded-md">
            <h3 className="font-medium">Data Fetching & Caching</h3>
            <ul className="list-disc pl-5 mt-2">
              <li>Intelligent data caching</li>
              <li>Request debouncing</li>
              <li>Optimized error handling</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-gray-50 rounded-md">
          <h3 className="font-medium mb-2">Interactive Counter Demo</h3>
          <p className="text-sm text-gray-600 mb-4">
            This simple counter uses optimized React patterns
          </p>
          
          <div className="flex items-center justify-center space-x-4">
            <button 
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              onClick={() => setCount(c => c - 1)}
            >
              Decrement
            </button>
            
            <span className="text-2xl font-bold">{count}</span>
            
            <button 
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              onClick={() => setCount(c => c + 1)}
            >
              Increment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
