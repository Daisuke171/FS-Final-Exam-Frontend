// app/page.tsx

"use client";
import MainLayout from './components/layout/MainLayout'; 
import MainContent from './components/ui/MainContent';   


const MOCK_NAV_PROPS = {
  username: "Nombre", 
  avatar: "/default-pfp.jpg", 
  users: 124 
};

export default function HomePage() {
  return (
    <MainLayout navbarProps={MOCK_NAV_PROPS}>
      <MainContent />
    </MainLayout>
  );
}
