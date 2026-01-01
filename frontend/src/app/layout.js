import '../styles/globals.css';
import ClientLayout from '../components/ClientLayout';

export const metadata = {
    title: 'Vulnerable App',
    description: 'A deliberately vulnerable web application',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <ClientLayout>
                    {children}
                </ClientLayout>
            </body>
        </html>
    );
}
