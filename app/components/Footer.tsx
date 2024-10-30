// components/Footer.tsx
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#151515] border-t border-[#00000020] mt-12">
        <div className="w-full px-10 py-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">About Us</h3>
              <ul className="space-y-2 text-sm text-[#EEEEEE80]">
                <li><Link href="#" className="hover:text-[#0092CA] transition-all">Who We Are</Link></li>
                <li><Link href="#" className="hover:text-[#0092CA] transition-all">Contact</Link></li>
                <li><Link href="#" className="hover:text-[#0092CA] transition-all">Terms & Conditions</Link></li>
                <li><Link href="#" className="hover:text-[#0092CA] transition-all">Privacy Policy</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Customer Support</h3>
              <ul className="space-y-2 text-sm text-[#EEEEEE80]">
                <li><Link href="#" className="hover:text-[#0092CA] transition-all">FAQ</Link></li>
                <li><Link href="#" className="hover:text-[#0092CA] transition-all">Responsible Gaming</Link></li>
                <li><Link href="#" className="hover:text-[#0092CA] transition-all">Betting Rules</Link></li>
                <li><Link href="#" className="hover:text-[#0092CA] transition-all">Live Chat</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Payment Methods</h3>
              <ul className="space-y-2 text-sm text-[#EEEEEE80]">
                <li>Bank Transfer</li>
                <li>Mobile Payment</li>
                <li>Visa/Mastercard</li>
                <li>PayPal</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Follow Us</h3>
              <div className="flex gap-4">
                <Link href="#" className="text-[#EEEEEE80] hover:text-[#0092CA] transition-all transform hover:scale-110">
                  <span className="sr-only">Facebook</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path></svg>
                </Link>
                <Link href="#" className="text-[#EEEEEE80] hover:text-[#0092CA] transition-all transform hover:scale-110">
                  <span className="sr-only">Twitter</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path></svg>
                </Link>
                <Link href="#" className="text-[#EEEEEE80] hover:text-[#0092CA] transition-all transform hover:scale-110">
                  <span className="sr-only">Instagram</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 011.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 01-1.153 1.772 4.915 4.915 0 01-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 01-1.772-1.153 4.904 4.904 0 01-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 011.153-1.772A4.897 4.897 0 015.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 100 10 5 5 0 000-10zm6.5-.25a1.25 1.25 0 10-2.5 0 1.25 1.25 0 002.5 0zM12 9a3 3 0 110 6 3 3 0 010-6z"></path></svg>
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-400">
            <p>&copy; 2024 WiseBet. All rights reserved.</p>
            <p className="mt-2">Play responsibly. 18+</p>
          </div>
        </div>
      </footer>
  );
};

export default Footer;
