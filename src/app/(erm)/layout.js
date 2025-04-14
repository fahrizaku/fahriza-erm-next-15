import Navigation from "@/components/Navigation";
import MainContent from "@/components/MainContent";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const metadata = {
  title: "ERM - Medicare",
  description: "Smart Medical Platform",
};

export default function ERMLayout({ children }) {
  return (
    <>
      <Navigation />
      <MainContent>{children}</MainContent>
      <ToastContainer
        position="bottom-right"
        autoClose={1000}
        hideProgressBar={true}
        theme="colored"
        toastClassName="font-geist-sans"
      />
    </>
  );
}
