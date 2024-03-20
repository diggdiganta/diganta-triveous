import MainLayout from "@/components/MainLayout";
import { PaneProvider } from "../../PaneContext"; // Import the provider

export default function Home() {
  return (
    <main className='flex flex-col items-center justify-between '>
      <PaneProvider>
        <MainLayout />
      </PaneProvider>
    </main>
  );
}
