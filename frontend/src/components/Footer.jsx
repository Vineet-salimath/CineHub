import '../styles/footer.css'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-divider" />
        <p className="footer-text">
          Built by{' '}
          <span className="footer-name">Vineet-salimath</span>
          {' '}—{' '}
          <span className="footer-copy">All Rights Reserved 2026</span>
        </p>
        <p className="footer-brand">
          <span className="footer-cine">Cine</span>
          <span className="footer-hub">Hub</span>
          {' '}· Premium Streaming
        </p>
      </div>
    </footer>
  )
}
