import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import "./tailwind.css";

import PropTypes from "prop-types";

export const links = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Syne+Mono&family=Victor+Mono:ital,wght@0,100..700;1,100..700&display=swap",
  },
];

export function Layout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-black font-victor">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default function App() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}
