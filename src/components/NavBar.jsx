import logo from "../assets/chef-claude.png";

export default function NavBar() {
  return (
    <header>
      <nav className="nav-bar">
        <img src={logo} alt="Chef Claude logo" />
        <span className="logo-name">Chef Claude</span>
      </nav>
    </header>
  );
}