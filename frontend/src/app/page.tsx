export default function Home() {
  return (
    <html>
      <head>
        <title>Todo App</title>
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          padding: '20px'
        }}>
          <div style={{
            textAlign: 'center',
            maxWidth: '600px',
            background: 'white',
            padding: '60px 40px',
            borderRadius: '20px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }}>
            <h1 style={{
              fontSize: '3rem',
              fontWeight: '700',
              marginBottom: '20px',
              color: '#1a202c'
            }}>
              📝 Todo App
            </h1>
            <p style={{
              fontSize: '1.2rem',
              color: '#4a5568',
              marginBottom: '40px',
              lineHeight: '1.6'
            }}>
              Organize your tasks efficiently and boost your productivity
            </p>

            <div style={{
              display: 'flex',
              gap: '20px',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <a
                href="/login"
                style={{
                  background: '#667eea',
                  color: 'white',
                  padding: '15px 40px',
                  borderRadius: '10px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  textDecoration: 'none',
                  display: 'inline-block'
                }}
              >
                Login
              </a>
              <a
                href="/register"
                style={{
                  background: '#764ba2',
                  color: 'white',
                  padding: '15px 40px',
                  borderRadius: '10px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  textDecoration: 'none',
                  display: 'inline-block'
                }}
              >
                Register
              </a>
            </div>

            <div style={{ marginTop: '50px', color: '#718096', fontSize: '0.9rem' }}>
              <p style={{ marginBottom: '10px' }}>✓ Create tasks easily</p>
              <p style={{ marginBottom: '10px' }}>✓ Track your progress</p>
              <p style={{ marginBottom: '10px' }}>✓ Stay organized</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}