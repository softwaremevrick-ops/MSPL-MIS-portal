import React, { createContext, useContext } from "react";

const SidebarContext = createContext();

export function SidebarProvider({ children }) {
  return <SidebarContext.Provider value={{}}>{children}</SidebarContext.Provider>;
}

export function Sidebar({ children, className }) {
  return <aside className={className}>{children}</aside>;
}

export function SidebarHeader({ children, className }) {
  return <div className={className}>{children}</div>;
}

export function SidebarContent({ children, className }) {
  return <div className={className}>{children}</div>;
}

export function SidebarGroup({ children, className }) {
  return <div className={className}>{children}</div>;
}

export function SidebarGroupContent({ children, className }) {
  return <div className={className}>{children}</div>;
}

export function SidebarGroupLabel({ children, className }) {
  return <div className={className}>{children}</div>;
}

export function SidebarMenu({ children, className }) {
  return <nav className={className}>{children}</nav>;
}

export function SidebarMenuItem({ children, className }) {
  return <div className={className}>{children}</div>;
}

export function SidebarMenuButton({ children, className, asChild, ...props }) {
  if (asChild) {
    return React.cloneElement(children, { className, ...props });
  }
  return (
    <button className={className} {...props}>
      {children}
    </button>
  );
}

export function SidebarFooter({ children, className }) {
  return <div className={className}>{children}</div>;
}

export function SidebarTrigger({ className, ...props }) {
return (
    <button className={className} {...props}>
      <span>☰</span>
    </button>
  );
}