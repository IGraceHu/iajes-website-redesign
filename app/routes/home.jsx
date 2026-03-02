import { Landing } from "./landing.jsx";

export function meta() {
  return [
    { title: "IAJES" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return <Landing />;
}
