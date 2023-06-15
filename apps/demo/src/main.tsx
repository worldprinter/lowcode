import * as ReactDOM from 'react-dom/client'

import { MantineProvider } from '@worldprinter/wdesign-core'

import App from './app/App'


const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
    <MantineProvider
        withCSSVariables
        withGlobalStyles
        withNormalizeCSS
    >
        <App />
    </MantineProvider>,
)
// root.render(<App />)
