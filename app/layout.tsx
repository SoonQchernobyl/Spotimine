import AuthProvider from "./authprovider";
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="app-container">
          <AuthProvider>{children}</AuthProvider>
        </div>
      </body>
    </html>
  );
}