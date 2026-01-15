import { Layout } from '@/components/Layout';
import { 
  Code, 
  Database, 
  Brain, 
  Globe,
  Server,
  Cpu,
  Layers,
  Zap,
  Users
} from 'lucide-react';

const Technology = () => {
  const techStack = [
    {
      category: 'Frontend',
      icon: Globe,
      color: 'bg-blue-500',
      technologies: [
        { name: 'HTML5', description: 'Semantic markup structure' },
        { name: 'Tailwind CSS', description: 'Utility-first styling framework' },
        { name: 'JavaScript', description: 'Dynamic client-side functionality' },
        { name: 'React', description: 'Component-based UI library' },
      ],
    },
    {
      category: 'Backend',
      icon: Server,
      color: 'bg-green-500',
      technologies: [
        { name: 'Python', description: 'Core backend programming language' },
        { name: 'Flask/FastAPI', description: 'RESTful API framework' },
        { name: 'REST APIs', description: 'Standard HTTP communication' },
      ],
    },
    {
      category: 'Database',
      icon: Database,
      color: 'bg-amber-500',
      technologies: [
        { name: 'MongoDB', description: 'NoSQL document database' },
        { name: 'Flexible Schema', description: 'Adaptable data structure' },
        { name: 'High Performance', description: 'Optimized for quick reads' },
      ],
    },
    {
      category: 'AI/ML Model',
      icon: Brain,
      color: 'bg-purple-500',
      technologies: [
        { name: 'XGBoost', description: 'Gradient boosting algorithm' },
        { name: 'Scikit-learn', description: 'ML preprocessing & utilities' },
        { name: 'Pandas', description: 'Data manipulation library' },
        { name: 'NumPy', description: 'Numerical computing foundation' },
      ],
    },
  ];

  const apiEndpoints = [
    { method: 'GET', endpoint: '/api/stock', description: 'Fetch current inventory levels' },
    { method: 'POST', endpoint: '/api/stock', description: 'Add new stock entry' },
    { method: 'GET', endpoint: '/api/forecast', description: 'Get demand predictions' },
    { method: 'GET', endpoint: '/api/alerts', description: 'Retrieve stock alerts' },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 bg-gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/20 mb-6">
              <Cpu className="h-4 w-4" />
              <span className="text-sm font-medium">Technology Stack</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-6">
              Built with Modern Technology
            </h1>
            <p className="text-lg md:text-xl opacity-90">
              A robust architecture combining cutting-edge web technologies 
              with advanced machine learning for intelligent inventory management.
            </p>
          </div>
        </div>
      </section>

      {/* Tech Stack Grid */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {techStack.map((stack, index) => {
              const Icon = stack.icon;
              return (
                <div 
                  key={index}
                  className="bg-card rounded-2xl border border-border p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`p-3 rounded-xl ${stack.color} text-white`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-display font-bold text-foreground">
                      {stack.category}
                    </h3>
                  </div>
                  
                  <div className="space-y-3">
                    {stack.technologies.map((tech, techIndex) => (
                      <div 
                        key={techIndex}
                        className="flex items-center justify-between p-3 rounded-lg bg-secondary"
                      >
                        <span className="font-medium text-foreground">{tech.name}</span>
                        <span className="text-sm text-muted-foreground">{tech.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* XGBoost Section */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-700 mb-4">
                <Brain className="h-4 w-4" />
                <span className="text-sm font-medium">Machine Learning</span>
              </div>
              <h2 className="text-3xl font-display font-bold text-foreground mb-6">
                XGBoost for Demand Forecasting
              </h2>
              <p className="text-muted-foreground mb-6">
                XGBoost (Extreme Gradient Boosting) is a powerful ensemble learning algorithm 
                that builds multiple decision trees sequentially, with each tree correcting 
                the errors of previous ones.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary mt-0.5">
                    <Zap className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">High Accuracy</h4>
                    <p className="text-sm text-muted-foreground">
                      Achieves 94.5% prediction accuracy on agricultural demand data.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary mt-0.5">
                    <Layers className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Feature Engineering</h4>
                    <p className="text-sm text-muted-foreground">
                      Considers seasonal patterns, historical sales, and market trends.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary mt-0.5">
                    <Cpu className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Fast Inference</h4>
                    <p className="text-sm text-muted-foreground">
                      Real-time predictions enabling quick decision making.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-card rounded-2xl border border-border p-6">
              <h4 className="font-semibold text-foreground mb-4">Model Features</h4>
              <div className="space-y-2 font-mono text-sm">
                <div className="p-3 rounded-lg bg-secondary">
                  <span className="text-muted-foreground">// Input Features</span>
                  <br />
                  <span className="text-primary">historical_sales</span>
                  <br />
                  <span className="text-primary">seasonal_index</span>
                  <br />
                  <span className="text-primary">weather_impact</span>
                  <br />
                  <span className="text-primary">market_trends</span>
                  <br />
                  <span className="text-primary">crop_cycle_stage</span>
                </div>
                <div className="p-3 rounded-lg bg-secondary">
                  <span className="text-muted-foreground">// Output</span>
                  <br />
                  <span className="text-success">predicted_demand_7days</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Industry 5.0 Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
              <Users className="h-4 w-4" />
              <span className="text-sm font-medium">Industry 5.0</span>
            </div>
            <h2 className="text-3xl font-display font-bold text-foreground mb-6">
              AI-Assisted Human Decision Making
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Industry 5.0 represents the next evolution in manufacturing and supply chain 
              management, where AI systems work alongside humans to enhance decision-making 
              rather than replace it.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="p-6 rounded-2xl bg-card border border-border">
                <Brain className="h-8 w-8 text-primary mb-4" />
                <h4 className="font-semibold text-foreground mb-2">AI Insights</h4>
                <p className="text-sm text-muted-foreground">
                  Machine learning provides data-driven recommendations and predictions.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-card border border-border">
                <Users className="h-8 w-8 text-primary mb-4" />
                <h4 className="font-semibold text-foreground mb-2">Human Expertise</h4>
                <p className="text-sm text-muted-foreground">
                  Retailers apply domain knowledge and contextual understanding.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-primary text-primary-foreground">
                <Zap className="h-8 w-8 mb-4" />
                <h4 className="font-semibold mb-2">Better Outcomes</h4>
                <p className="text-sm opacity-90">
                  Combined AI + human intelligence leads to optimal inventory decisions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* API Architecture */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
              <Code className="h-4 w-4" />
              <span className="text-sm font-medium">REST API</span>
            </div>
            <h2 className="text-3xl font-display font-bold text-foreground mb-4">
              API Architecture
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Clean RESTful API design for seamless frontend-backend communication.
            </p>
          </div>

          <div className="max-w-2xl mx-auto bg-card rounded-2xl border border-border overflow-hidden">
            <div className="p-4 bg-foreground text-primary-foreground font-mono text-sm">
              API Base URL: <span className="text-primary">http://localhost:5000/api</span>
            </div>
            <div className="p-6">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 text-sm font-semibold text-muted-foreground">Method</th>
                    <th className="text-left py-3 text-sm font-semibold text-muted-foreground">Endpoint</th>
                    <th className="text-left py-3 text-sm font-semibold text-muted-foreground">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {apiEndpoints.map((api, index) => (
                    <tr key={index} className="border-b border-border/50">
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          api.method === 'GET' ? 'bg-success/10 text-success' : 'bg-primary/10 text-primary'
                        }`}>
                          {api.method}
                        </span>
                      </td>
                      <td className="py-3 font-mono text-sm text-foreground">{api.endpoint}</td>
                      <td className="py-3 text-sm text-muted-foreground">{api.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Technology;
