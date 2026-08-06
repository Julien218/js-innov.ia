import { motion } from 'framer-motion';
import SectionHeader from '../components/shared/SectionHeader';
import PowerWord from '../components/shared/PowerWord';
import { Handshake, ExternalLink } from 'lucide-react';

export default function Partners() {
  const partners = [
    {
      name: 'Make',
      description: 'Automatisation puissante sans code',
      url: 'https://www.make.com/en/register?pc=jsinnovia',
      logo: 'https://www.make.com/en/hc/theming_assets/01HZP1YEYM15JW5NHQMSHAYHS8',
      gradient: 'from-purple-600 to-blue-600'
    },
    {
      name: 'Notion',
      description: 'Workspace tout-en-un collaboratif',
      url: 'https://notion.so',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e9/Notion-logo.svg',
      gradient: 'from-gray-800 to-gray-600'
    },
    {
      name: 'Airtable',
      description: 'Base de données collaborative',
      url: 'https://airtable.com',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Airtable_Logo.svg',
      gradient: 'from-yellow-600 to-orange-600'
    },
    {
      name: 'ChatGPT',
      description: 'IA conversationnelle avancée',
      url: 'https://chat.openai.com',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg',
      gradient: 'from-green-600 to-teal-600'
    }
  ];

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <SectionHeader
          icon={Handshake}
          title="Nos Partenaires"
          subtitle={<span>Des <PowerWord>outils puissants</PowerWord> pour <PowerWord>amplifier</PowerWord> vos projets IA</span>}
        />

        {/* Partners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {partners.map((partner, index) => (
            <motion.a
              key={index}
              href={partner.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group block"
            >
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-purple-500/20 p-8 hover:border-pink-500/50 transition-all duration-300 h-full">
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${partner.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>

                <div className="relative flex flex-col items-center text-center h-full">
                  <div className="w-20 h-20 mb-6 flex items-center justify-center bg-white rounded-2xl group-hover:scale-110 transition-transform">
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className="w-16 h-16 object-contain"
                    />
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-pink-400 transition-colors">
                    {partner.name}
                  </h3>

                  <p className="text-gray-400 text-sm mb-4 flex-grow">
                    {partner.description}
                  </p>

                  <div className="flex items-center gap-2 text-pink-400 font-medium text-sm group-hover:gap-3 transition-all">
                    <span>Découvrir</span>
                    <ExternalLink className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-600/20 via-purple-600/20 to-cyan-600/20 border border-purple-500/30 p-12 text-center"
        >
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>

          <div className="relative">
            <h2 className="text-3xl font-bold text-white mb-4">
              <PowerWord>Intégrations</PowerWord> & <PowerWord>Collaborations</PowerWord>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Nous travaillons avec les meilleurs <PowerWord>outils</PowerWord> du marché pour vous offrir des <PowerWord>solutions complètes</PowerWord> et <PowerWord>performantes</PowerWord>.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}