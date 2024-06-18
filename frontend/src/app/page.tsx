import NFTBox from '@/app/components/NFTBox'
import FoundBox from '@/app/components/FoundBox'
export default function Home() {
  return (
    <div className="flex flex-wrap justify-between items-center gap-4 bg-[url('/image/expectrum-1191724_640.png')] bg-center bg-no-repeat" >
    <NFTBox />
    <FoundBox  />
  </div>
  );
}
