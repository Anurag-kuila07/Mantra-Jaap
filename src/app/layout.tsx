import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Mantra Jaap',
  description: 'A modern app for your chanting practice.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Alegreya:wght@400;500;700&display=swap" rel="stylesheet" />
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
              atOptions = {
                'key' : '5fcf7f7e2d5dc6ecbc46881c2e9a4b19',
                'format' : 'iframe',
                'height' : 90,
                'width' : 728,
                'params' : {}
              };
            `,
          }}
        />
        <Script
          type="text/javascript"
          src="//recitalfinancially.com/5fcf7f7e2d5dc6ecbc46881c2e9a4b19/invoke.js"
        />
      </head>
      <body className="font-body antialiased">
        {children}
        <Toaster />
        <Script async={true} data-cfasync="false" src="//recitalfinancially.com/09085eba4ac2c36a79196531362c2bdf/invoke.js" />
        <div id="container-09085eba4ac2c36a79196531362c2bdf"></div>
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
              atOptions = {
                'key' : 'a535242ea5600ce922772ab7e7c9a02b',
                'format' : 'iframe',
                'height' : 600,
                'width' : 160,
                'params' : {}
              };
            `,
          }}
        />
        <Script
          type="text/javascript"
          src="//recitalfinancially.com/a535242ea5600ce922772ab7e7c9a02b/invoke.js"
        />
      </body>
    </html>
  );
}

    