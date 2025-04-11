
import { Toaster } from "sonner";
import Header from "./Header";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-foodcam-dark to-foodcam-darker">
      <main className="flex-1 container max-w-md mx-auto px-4 pb-24 pt-8">
        {children}
      </main>
      <Header />
      <Toaster 
        position="top-center" 
        toastOptions={{
          style: {
            background: 'rgba(10, 10, 15, 0.9)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }
        }}
      />
    </div>
  );
};

export default Layout;
