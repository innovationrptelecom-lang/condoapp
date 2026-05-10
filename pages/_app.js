import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";

export default function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const isProtected = Component.auth ?? false;     // se você usa rota protegida

 const Page = isProtected ? (
-  <AuthGuard>
-    <Component {...pageProps} />
-  </AuthGuard>
+  <Component {...pageProps} />
) : (
  <Component {...pageProps} />
);

  return (
    <SessionProvider session={session}>
      <Toaster position="top-right" />
      {Page}
    </SessionProvider>
  );
}