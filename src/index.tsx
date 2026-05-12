import React from "react";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import ModernUIParityAudit from './examples/ModernUIParityAudit'
// To test the Modern UI, uncomment the following line and comment out the App import above:
// import App from './AppModern'
import './index.css'

const searchParams = typeof window !== 'undefined'
  ? new URLSearchParams(window.location.search)
  : new URLSearchParams()

const RootApp = searchParams.get('audit') === '1'
  ? ModernUIParityAudit
  : App

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RootApp />
  </StrictMode>,
)
