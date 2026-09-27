export const metadata = {
  title: 'Rogue Store',
  description: 'E-commerce store powered by Supabase and Vercel',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className="bg-gray-950 text-white m-0 font-sans">{children}</body>
    </html>
  );
}
