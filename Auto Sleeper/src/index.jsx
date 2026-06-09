import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';
import LenisProvider from './components/wrapper/LenisProvider';
import { TooltipProvider } from '@/components/ui/tooltip';

const root = createRoot(document.getElementById('root'));
root.render(
    <LenisProvider>
        <TooltipProvider>
            <App />
        </TooltipProvider>
    </LenisProvider>
);
