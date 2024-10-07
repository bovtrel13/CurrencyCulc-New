import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="page__footer">
      <div className="footer__content">
        <p>© {new Date().getFullYear()}. Currency Calculator.</p>
        <a href="https://t.me/bovtrel13" className="footer-link">
          <img className="footer__link-image" src={`${process.env.PUBLIC_URL}/telegram.png`}/>
        </a>
        <a href="https://github.com/bovtrel13" className="footer-link">
          <img className="footer__link-image" src={`${process.env.PUBLIC_URL}/github-mark.png`}/>
        </a>
      </div>
    </footer>
  );
}

export { Footer };
