'use client'

import React from 'react'

interface DrAnaAnalysisProps {
  analysis: string
  userName: string
}

export default function DrAnaAnalysis({ analysis, userName }: DrAnaAnalysisProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
      {/* Header */}
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mr-4">
          <span className="text-white text-xl font-bold">AS</span>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Dra. Ana Slim</h2>
          <p className="text-sm text-gray-600">Nutricionista & Wellness Expert</p>
        </div>
      </div>

      {/* Analysis Content */}
      <div className="prose prose-lg max-w-none">
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-8 mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <span className="text-2xl mr-2">👋</span>
            Resumo da Sua Análise, {userName}
          </h3>
          <div className="text-gray-700 leading-loose text-base space-y-6">
            {analysis.split('\n\n').map((paragraph, index) => {
              // Processar parágrafos que começam com emojis ou títulos
              const isTitle = paragraph.match(/^[🌙✨💧🌿]/);
              const isList = paragraph.includes('- ');
              
              if (isTitle) {
                return (
                  <div key={index} className="mb-6">
                    <p className="font-semibold text-gray-800 text-lg mb-3">
                      {paragraph}
                    </p>
                  </div>
                );
              }
              
              if (isList) {
                return (
                  <div key={index} className="mb-6">
                    {paragraph.split('\n').map((line, lineIndex) => {
                      if (line.trim().startsWith('- ')) {
                        return (
                          <div key={lineIndex} className="flex items-start mb-3">
                            <span className="text-emerald-600 mr-3 mt-1">•</span>
                            <span className="flex-1">{line.replace('- ', '')}</span>
                          </div>
                        );
                      }
                      return line.trim() && (
                        <p key={lineIndex} className="font-medium text-gray-800 mb-3">
                          {line}
                        </p>
                      );
                    })}
                  </div>
                );
              }
              
              return (
                <p key={index} className="mb-6 last:mb-0 text-justify">
                  {paragraph}
                </p>
              );
            })}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-6 text-center">
          <h4 className="text-lg font-semibold text-gray-800 mb-3">
            💬 Quer uma consulta mais detalhada?
          </h4>
          <p className="text-gray-600 mb-4">
            Agende uma consulta personalizada com a Dra. Ana Slim para um plano de wellness completo!
          </p>
          <button className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-full font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl">
            Agendar Consulta
          </button>
        </div>
      </div>
    </div>
  )
}
