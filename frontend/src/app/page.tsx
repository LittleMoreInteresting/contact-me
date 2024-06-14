import AppHeader from '@/app/components/AppHeader'

import Footer from '@/app/components/Footer'
export default function Home() {
  return (
    <div className="flex flex-col items-center justify-between p-15 h-screen">
      <AppHeader />
       
      <Footer />
    </div>
  );
}
