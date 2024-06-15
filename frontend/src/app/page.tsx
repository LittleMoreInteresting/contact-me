import AppHeader from '@/app/components/AppHeader'
import NFTBox from '@/app/components/NFTBox'
import Footer from '@/app/components/Footer'
export default function Home() {
  return (
    <div className="flex flex-col items-center justify-between p-15 h-screen">
      <AppHeader />
      <div className="container">
        <div className="flex flex-wrap gap-4" >
            <NFTBox />
        </div>
      </div>
      <Footer />
    </div>
  );
}
