export const styles = {
  section: {
    background: 'var(--color-bg-gradient-start)',
    padding: '100px 0 120px 0', // Following section padding guidelines
    minHeight: '70vh', // Following container proportions
    width: '100%',
  },
  container: {
    maxWidth: '1440px', // Following container proportions
    margin: '0 auto',
    padding: '0 60px', // Following container proportions
    width: '100%',
  },
  tag: {
    fontSize: '0.75rem',
    fontWeight: '600',
    color: 'var(--color-text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '20px',
    fontFamily: 'var(--ifm-font-family-base)',
  },
  heading: {
    fontSize: '3rem',
    fontWeight: '600',
    color: 'var(--color-text-primary)',
    marginBottom: '24px',
    lineHeight: '1.2',
    fontFamily: 'var(--ifm-font-family-heading)',
  },
  description: {
    fontSize: '1.25rem',
    color: 'var(--color-text-secondary)',
    lineHeight: '1.6',
    marginBottom: '40px',
    fontFamily: 'var(--ifm-font-family-base)',
  },
  expandableSection: {
    background: 'var(--color-bg-card-light)',
    border: '1px solid var(--color-border-light)',
    borderRadius: '8px',
    marginBottom: '16px',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    boxShadow: 'var(--color-shadow-light)',
  },
  sectionHeader: {
    padding: '20px 24px',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid transparent',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: 'var(--color-bg-gradient-end)',
    },
  },
  sectionTitle: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: 'var(--color-text-primary)',
    margin: '0',
    fontFamily: 'var(--ifm-font-family-heading)',
  },
  chevron: {
    fontSize: '1.25rem',
    color: 'var(--color-text-secondary)',
    transition: 'transform 0.3s ease',
  },
  sectionContent: {
    padding: '0 24px 20px 24px',
    fontSize: '1rem',
    color: 'var(--color-text-secondary)',
    fontWeight: '500',
    lineHeight: '1.6',
    fontFamily: 'var(--ifm-font-family-base)',
  },
  // Video container styles moved from component
  videoContainer: {
    position: 'relative',
    width: '100%',
    paddingBottom: '56.25%', // 16:9 aspect ratio (9/16 = 0.5625)
    height: 0,
    overflow: 'hidden',
    borderRadius: '12px',
    boxShadow: 'var(--color-shadow-medium)',
    backgroundColor: 'var(--color-bg-card-light)',
    border: '1px solid var(--color-border-light)',
  },
  videoIframe: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    borderRadius: '12px',
    border: 'none',
  },
  placeholderVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--color-bg-card-light)',
    borderRadius: '12px',
    border: '2px dashed var(--color-border-light)',
  },
  placeholderContent: {
    textAlign: 'center',
    fontFamily: 'var(--ifm-font-family-base)',
  },
  placeholderIcon: {
    fontSize: '3rem',
    marginBottom: '12px',
    display: 'block',
  },
  placeholderText: {
    fontSize: '1rem',
    fontWeight: '500',
    color: 'var(--color-text-secondary)',
  },
  placeholderSubtext: {
    fontSize: '0.9rem',
    fontWeight: '500',
    opacity: 0.7,
    marginTop: '8px',
    color: 'var(--color-text-secondary)',
  },
}
