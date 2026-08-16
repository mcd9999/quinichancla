import "./globals.css"; import Nav from "@/components/Nav";
export const metadata={title:"Quinichancla",description:"Quinielas entre amigos sin dramas contables"};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="es"><body><main className="shell"><Nav/>{children}</main></body></html>}
