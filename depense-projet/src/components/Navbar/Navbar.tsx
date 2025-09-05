import "./Navbar.css";  // ✅ connexion avec CSS

interface NavbarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

function Navbar({ activeView, onViewChange }: NavbarProps) {
  return (
    <nav className="navbar">
      <button
        className={activeView === "transactions" ? "active" : ""}
        onClick={() => onViewChange("transactions")}
      >
        Transactions
      </button>
      <button
        className={activeView === "budget" ? "active" : ""}
        onClick={() => onViewChange("budget")}
      >
        Budget
      </button>
      <button
        className={activeView === "rapport" ? "active" : ""}
        onClick={() => onViewChange("rapport")}
      >
        Rapports
      </button>
    </nav>
  );
}

export default Navbar;
