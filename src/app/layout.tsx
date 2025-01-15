// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import { ColorSchemeScript, MantineProvider, mantineHtmlProps } from '@mantine/core';
import '@mantine/core/styles.css';
import { Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';
import 'react-simple-toasts/dist/style.css';

export const metadata = {
  title: 'My Mantine app',
  description: 'I have followed setup instructions carefully',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript defaultColorScheme='dark' />
      </head>
      <body>
        <MantineProvider defaultColorScheme='dark'><Notifications />{children}</MantineProvider>
      </body>
    </html>
  );
}