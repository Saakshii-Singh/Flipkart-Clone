import { Link } from 'react-router-dom';

const footerLinks = {
  about: [
    { label: 'Contact Us', href: '#' },
    { label: 'About Us', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Flipkart Stories', href: '#' },
    { label: 'Press', href: '#' },
    { label: 'Corporate Information', href: '#' },
  ],
  group: [
    { label: 'Myntra', href: '#' },
    { label: 'Cleartrip', href: '#' },
    { label: 'Shopsy', href: '#' },
  ],
  help: [
    { label: 'Payments', href: '#' },
    { label: 'Shipping', href: '#' },
    { label: 'Cancellation & Returns', href: '#' },
    { label: 'FAQ', href: '#' },
  ],
  consumer: [
    { label: 'Cancellation & Returns', href: '#' },
    { label: 'Terms Of Use', href: '#' },
    { label: 'Security', href: '#' },
    { label: 'Privacy', href: '#' },
    { label: 'Sitemap', href: '#' },
    { label: 'Grievance Redressal', href: '#' },
    { label: 'EPR Compliance', href: '#' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[#172337] text-[#878787] text-xs">
      {/* Top section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 border-b border-[#ffffff1a] pb-8">
          <div>
            <h3 className="text-[#f2f2f2] text-sm font-medium mb-2 uppercase tracking-wide">About</h3>
            <ul className="space-y-1.5">
              {footerLinks.about.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="hover:underline">{l.label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-[#f2f2f2] text-sm font-medium mb-2 uppercase tracking-wide">Group Companies</h3>
            <ul className="space-y-1.5">
              {footerLinks.group.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="hover:underline">{l.label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-[#f2f2f2] text-sm font-medium mb-2 uppercase tracking-wide">Help</h3>
            <ul className="space-y-1.5">
              {footerLinks.help.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="hover:underline">{l.label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-[#f2f2f2] text-sm font-medium mb-2 uppercase tracking-wide">Consumer Policy</h3>
            <ul className="space-y-1.5">
              {footerLinks.consumer.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="hover:underline">{l.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-6 gap-4">
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-flipkart-yellow" fill="currentColor" viewBox="0 0 24 24"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
              Become a Seller
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-flipkart-yellow" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
              Advertise
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-flipkart-yellow" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
              Gift Cards
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-flipkart-yellow" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
              Help Center
            </span>
          </div>
          <p className="text-[#878787]">© 2007-2024 Flipkart.com</p>
        </div>

        {/* Payment icons row */}
        <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-[#ffffff1a] flex-wrap">
          {['Visa', 'Mastercard', 'UPI', 'Net Banking', 'COD'].map((m) => (
            <span key={m} className="bg-[#ffffff0d] text-[#f2f2f2] px-3 py-1 rounded text-[10px] font-medium">{m}</span>
          ))}
        </div>
      </div>
    </footer>
  );
}
