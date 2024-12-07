import React from "react";

const Navbar = () => {
    return (
        <nav
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#007BFF",
                padding: "10px 20px",
                color: "white",
            }}
        >
            {/* Logo Section */}
            <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                MyWebsite
            </div>

            {/* Navigation Links */}
            <ul
                style={{
                    display: "flex",
                    listStyle: "none",
                    margin: 0,
                    padding: 0,
                }}
            >
                {["Home", "About", "Services", "Contact"].map((item, index) => (
                    <li key={index} style={{ margin: "0 15px" }}>
                        <a
                            href={`#${item.toLowerCase()}`}
                            style={{
                                color: "white",
                                textDecoration: "none",
                                fontSize: "1rem",
                                fontWeight: "500",
                            }}
                        >
                            {item}
                        </a>
                    </li>
                ))}
            </ul>

            {/* Button/Call-to-Action */}
            <button
                style={{
                    backgroundColor: "white",
                    color: "#007BFF",
                    border: "none",
                    borderRadius: "5px",
                    padding: "8px 15px",
                    fontSize: "1rem",
                    fontWeight: "bold",
                    cursor: "pointer",
                }}
                onClick={() => alert("Login clicked!")}
            >
                Login
            </button>
        </nav>
    );
};

export default Navbar;
