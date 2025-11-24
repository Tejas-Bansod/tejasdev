
import Header from "./components/header/header";
import HelloPreloader from "./components/HelloPreloader/HelloPreloader";
import Hero from "./components/hero/hero";



export default function Home() {
  return (
    <div className="position-relative">
      <main>
        <HelloPreloader />
        <Header />
        <Hero />
      </main>
    </div>
  );
}
