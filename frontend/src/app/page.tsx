"use client";

export default function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative background circles */}
      <div style={{
        position: 'fixed',
        top: '10%',
        left: '5%',
        width: '300px',
        height: '300px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        pointerEvents: 'none'
      }}></div>
      <div style={{
        position: 'fixed',
        bottom: '10%',
        right: '5%',
        width: '400px',
        height: '400px',
        background: 'rgba(255, 255, 255, 0.08)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        pointerEvents: 'none'
      }}></div>

      {/* Main content */}
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        position: 'relative'
      }}>
        <div style={{
          maxWidth: '500px',
          width: '100%',
          textAlign: 'center',
          animation: 'fadeIn 0.8s ease-out forwards'
        }}>

          {/* Logo Icon */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '80px',
            height: '80px',
            background: 'white',
            borderRadius: '20px',
            marginBottom: '30px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
          }}>
            <svg width="45" height="45" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{stopColor: '#667eea'}} />
                  <stop offset="100%" style={{stopColor: '#764ba2'}} />
                </linearGradient>
              </defs>
              <path
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                stroke="url(#gradient)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Main heading */}
          <h1 style={{
            fontSize: '3rem',
            fontWeight: '800',
            color: 'white',
            marginBottom: '15px',
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            letterSpacing: '-0.02em'
          }}>
            Welcome to Todo App
          </h1>

          {/* Subheading */}
          <p style={{
            fontSize: '1.15rem',
            color: 'rgba(255, 255, 255, 0.9)',
            marginBottom: '40px',
            lineHeight: '1.6',
            maxWidth: '450px',
            margin: '0 auto 40px'
          }}>
            Organize your tasks, set deadlines, and boost your productivity with our elegant todo management system
          </p>

          {/* Buttons */}
          <div style={{
            display: 'flex',
            gap: '15px',
            justifyContent: 'center',
            marginBottom: '50px',
            flexWrap: 'wrap'
          }}>
            <a
              href="/login"
              style={{
                background: 'white',
                color: '#667eea',
                padding: '15px 35px',
                borderRadius: '12px',
                fontSize: '1.05rem',
                fontWeight: '700',
                textDecoration: 'none',
                display: 'inline-block',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)',
                minWidth: '140px',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.4)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.15)';
              }}
            >
              Sign In
            </a>
            <a
              href="/register"
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                color: 'white',
                padding: '15px 35px',
                borderRadius: '12px',
                fontSize: '1.05rem',
                fontWeight: '700',
                textDecoration: 'none',
                display: 'inline-block',
                minWidth: '140px',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.4)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Sign Up
            </a>
          </div>

          {/* Feature highlights */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '15px',
            marginTop: '40px'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              padding: '20px 15px',
              borderRadius: '15px',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <div style={{
                fontSize: '1.8rem',
                marginBottom: '8px'
              }}>✓</div>
              <div style={{
                color: 'white',
                fontSize: '0.95rem',
                fontWeight: '600'
              }}>Easy to Use</div>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              padding: '20px 15px',
              borderRadius: '15px',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <div style={{
                fontSize: '1.8rem',
                marginBottom: '8px'
              }}>📅</div>
              <div style={{
                color: 'white',
                fontSize: '0.95rem',
                fontWeight: '600'
              }}>Set Deadlines</div>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              padding: '20px 15px',
              borderRadius: '15px',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <div style={{
                fontSize: '1.8rem',
                marginBottom: '8px'
              }}>📎</div>
              <div style={{
                color: 'white',
                fontSize: '0.95rem',
                fontWeight: '600'
              }}>Attach Files</div>
            </div>
          </div>

          {/* Footer text */}
          <div style={{
            marginTop: '50px',
            color: 'rgba(255, 255, 255, 0.75)',
            fontSize: '0.85rem'
          }}>
            <p style={{ margin: 0 }}>© 2024 Todo App. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}