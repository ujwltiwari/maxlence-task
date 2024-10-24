import Header from "@/components/layout/Header.jsx";

const Layout = ({ children, className }) => {
  return (
    <>
      <Header />
      <div className={className ?? ""}>{children}</div>
    </>
  );
};

export default Layout;
