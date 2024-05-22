import React from 'react'
import ReactDOM from 'react-dom/client'
// import App from './App.tsx'
import './index.css'
import G6VersionApp from "./G6VersionApp.tsx";

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <G6VersionApp/>
        {/*<App/>*/}
    </React.StrictMode>,
)
