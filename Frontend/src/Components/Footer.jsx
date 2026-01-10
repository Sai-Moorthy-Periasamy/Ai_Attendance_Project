import React from "react";

const Footer = () => (
  <footer className="ultimate-footer">
    <div className="footer-content">
      <div className="footer-top">
        <div className="footer-logo-section">
          <p className="footer-tagline">
            Transforming Education with AI Excellence
          </p>
        </div>
        
        <div className="footer-bottom">
          <p className="copyright-text">
            © {new Date().getFullYear()} KCET AI ERP. All rights reserved.
          </p>
          <p className="dev-credit">
            Developed with ❤️ by <span className="team-name">Team Innovators</span>
          </p>
        </div>
      </div>
    </div>

    <style jsx>{`
      .ultimate-footer {
        background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #0ea5e9 100%);
        color: rgba(255, 255, 255, 0.95);
        position: relative;
        overflow: hidden;
        font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif;
        margin-top: auto;
      }

      .ultimate-footer::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
      }

      .footer-content {
        max-width: 1200px;
        margin: 0 auto;
        padding: 40px 20px 30px;
        position: relative;
        z-index: 2;
      }

      .footer-top {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 24px;
        text-align: center;
      }

      .footer-logo-section {
        animation: fadeInUp 1s ease-out;
      }

      .footer-logo {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-bottom: 12px;
        font-size: clamp(24px, 3vw, 32px);
        font-weight: 800;
        background: linear-gradient(135deg, #ffffff 0%, #e0e7ff 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        letter-spacing: -0.02em;
      }

      .logo-circle {
        width: 48px;
        height: 48px;
        background: linear-gradient(135deg, #10b981, #34d399);
        border-radius: 50%;
        box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
        position: relative;
        animation: pulse 2s infinite;
      }

      .logo-circle::after {
        content: 'AI';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 12px;
        font-weight: 700;
        color: white;
        text-shadow: 0 1px 2px rgba(0,0,0,0.3);
      }

      .footer-tagline {
        font-size: clamp(14px, 2vw, 16px);
        color: rgba(255, 255, 255, 0.85);
        font-weight: 300;
        margin: 0;
        max-width: 300px;
        line-height: 1.6;
        backdrop-filter: blur(10px);
      }

      .footer-divider {
        width: 80px;
        height: 3px;
        background: linear-gradient(90deg, #10b981, #34d399);
        border-radius: 2px;
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        align-self: center;
        animation: expandWidth 1.5s ease-out;
      }

      .footer-bottom {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        animation: fadeInUp 1s ease-out 0.3s both;
      }

      .copyright-text {
        margin: 0;
        font-size: 14px;
        color: rgba(255, 255, 255, 0.9);
        font-weight: 400;
      }

      .dev-credit {
        margin: 0;
        font-size: 13px;
        color: rgba(255, 255, 255, 0.8);
        font-weight: 500;
      }

      .team-name {
        color: #10b981;
        font-weight: 700;
        text-shadow: 0 0 8px rgba(16, 185, 129, 0.5);
      }

      /* FLOATING ELEMENTS */
      .ultimate-footer::after {
        content: '';
        position: absolute;
        bottom: -100px;
        right: -100px;
        width: 200px;
        height: 200px;
        background: rgba(16, 185, 129, 0.1);
        border-radius: 50%;
        filter: blur(40px);
        animation: float 6s ease-in-out infinite reverse;
      }

      /* ANIMATIONS */
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes pulse {
        0%, 100% {
          transform: scale(1);
          box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
        }
        50% {
          transform: scale(1.05);
          box-shadow: 0 12px 35px rgba(16, 185, 129, 0.6);
        }
      }

      @keyframes expandWidth {
        from {
          width: 0;
        }
        to {
          width: 80px;
        }
      }

      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }

      /* RESPONSIVE */
      @media (max-width: 576px) {
        .footer-content {
          padding: 30px 15px 25px;
        }
        
        .footer-logo {
          font-size: 22px;
        }
        
        .logo-circle {
          width: 40px;
          height: 40px;
        }
        
        .logo-circle::after {
          font-size: 10px;
        }
      }

      /* SCROLL EFFECT */
      .ultimate-footer.scrolled {
        background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 70%, #0ea5e9 100%);
        box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.2);
      }
    `}</style>
  </footer>
);

export default Footer;
