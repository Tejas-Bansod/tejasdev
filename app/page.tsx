
import Header from "./components/header/header";
import Hero from "./components/hero/hero";

// ...

export default function Home() {
  return (
    <div className="position-relative">
      <main>
        <Header />
        <Hero />
      </main>
    </div>
  );
}
