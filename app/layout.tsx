import AuthProvider from "../components/providers/authprovider";
import NavigationBarWrapper from "../components/layout/NavigationBarWrapper";
import { SwipeProvider } from "../utils/SwipeContext";
import Image from "next/image";
import "../styles/globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <div className="app-container">
          <div
            className="status-bar"
            style={{
              width: "100%",
              height: "44px",
              position: "relative",
            }}
          >
            <Image
              src="/status_bar.svg"
              alt="status bar"
              fill={true}
              style={{ objectFit: "cover" }}
            />
          </div>
          <AuthProvider>
            <SwipeProvider>
              <main className="main-content">{children}</main>
              <NavigationBarWrapper />
            </SwipeProvider>
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}
