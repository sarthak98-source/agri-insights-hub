import { Leaf, Github, Mail, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-foreground text-primary-foreground mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary">
                <Leaf className="h-5 w-5" />
              </div>
              <span className="font-display font-bold text-lg">Smart Agri</span>
            </div>
            <p className="text-sm opacity-80">
              AI-powered inventory management and demand forecasting for sustainable agriculture.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li><Link to="/" className="hover:opacity-100 transition-opacity">Home</Link></li>
              <li><Link to="/dashboard" className="hover:opacity-100 transition-opacity">Dashboard</Link></li>
              <li><Link to="/about" className="hover:opacity-100 transition-opacity">About System</Link></li>
              <li><Link to="/technology" className="hover:opacity-100 transition-opacity">Technology</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li><Link to="/impact" className="hover:opacity-100 transition-opacity">Impact & Benefits</Link></li>
              <li><Link to="/future" className="hover:opacity-100 transition-opacity">Future Scope</Link></li>
              <li><Link to="/login" className="hover:opacity-100 transition-opacity">Retailer Login</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <div className="flex gap-3">
              <a href="#" className="p-2 rounded-lg bg-primary/20 hover:bg-primary/30 transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-primary/20 hover:bg-primary/30 transition-colors">
                <Mail className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-primary/20 hover:bg-primary/30 transition-colors">
                <ExternalLink className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-primary-foreground/20 text-center text-sm opacity-60">
          <p>© 2024 Smart Agri-Input Inventory System. Built for Hackathon Demo.</p>
          <p className="mt-1">Powered by XGBoost • Industry 5.0 • AI-Assisted Decision Making</p>
        </div>
      </div>
    </footer>
  );
};
