import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link href="/">
            Home
          </Link>
        </li>
        <li>
          <Link href="#">
            About
          </Link>
        </li>
        <li>
          <Link href="/create">
            Create
          </Link>
        </li>
        <li>
          <Link href="/watch">
            Watch
          </Link>
        </li>
      </ul>
    </nav>
  );
}