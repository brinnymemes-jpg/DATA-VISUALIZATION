import React from 'react';

export const LiquidBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 bg-gradient-to-b from-blue-950 via-blue-900/35 via-25% to-[#f8fafc]">
      {/* Upper royal sapphire liquid ambient glows */}
      <div className="absolute -top-[12%] -left-[5%] w-[60vw] h-[35vw] rounded-full bg-blue-600/35 blur-[120px] pointer-events-none transform-gpu animate-pulse duration-10000" />
      <div className="absolute -top-[10%] -right-[5%] w-[55vw] h-[35vw] rounded-full bg-indigo-600/30 blur-[120px] pointer-events-none transform-gpu animate-pulse duration-8000" />
      <div className="absolute top-[40px] left-[25%] w-[45vw] h-[25vw] rounded-full bg-sky-500/20 blur-[100px] pointer-events-none" />

      {/* Downside pure crisp white reflection and surface */}
      <div className="absolute top-[280px] inset-x-0 bottom-0 bg-gradient-to-b from-slate-100/90 via-[#f8fafc] to-white pointer-events-none" />
      
      {/* Subtle fine glass mesh overlay */}
      <div 
        className="absolute inset-0 opacity-[0.025] mix-blend-multiply"
        style={{
          backgroundImage: `radial-gradient(rgba(15, 23, 42, 0.4) 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}
      />
    </div>
  );
};
