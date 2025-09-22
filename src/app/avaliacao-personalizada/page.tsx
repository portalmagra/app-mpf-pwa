'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import Logo from '@/components/Logo'
import BottomNavigation from '@/components/BottomNavigation'
import { openWhatsApp } from '@/utils/whatsapp'

export default function AvaliacaoPersonalizada() {
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleWhatsApp = (message: string) => {
    openWhatsApp('17862535032', message)
  }

  const handlePlayVideo = () => {
    setIsPlaying(true)
    if (videoRef.current) {
      videoRef.current.play()
    }
  }

  return (
    <div className="min-h-screen bg-brand-neutralLight pb-16">
      {/* Header */}
      <header className="bg-brand-greenSoft shadow-soft sticky top-0 z-50 border-b border-brand-border">
        <div className="max-w-sm mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <Logo variant="horizontal" size="md" />
            <button 
              onClick={() => handleWhatsApp('Olá! Gostaria de falar com vocês via WhatsApp.')}
              className="text-xs text-gray-500 hover:text-brand-green transition-colors"
            >
              💬 Fale Conosco
            </button>
          </div>
        </div>
      </header>

      {/* Video Section - PRIMEIRA SEÇÃO */}
      <section className="px-4 py-8 bg-white">
        <div className="max-w-sm mx-auto text-center">
          <h2 className="text-xl font-bold text-brand-text mb-6">
            🎥 Veja Como Funciona
          </h2>
          
          <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[9/16] bg-gradient-to-br from-gray-100 to-gray-200">
            {/* Vídeo Player */}
            <video
              ref={videoRef}
              controls
              className="w-full h-full object-cover"
              preload="metadata"
              style={{ display: isPlaying ? 'block' : 'none' }}
            >
              <source src="/videos/Avaliacao.mp4" type="video/mp4" />
              Seu navegador não suporta vídeos HTML5.
            </video>
            
            {/* Thumbnail com Play Button quando não está tocando */}
            {!isPlaying && (
              <div 
                className="absolute inset-0 w-full h-full cursor-pointer"
                onClick={handlePlayVideo}
              >
                {/* Imagem de fundo do vídeo */}
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{
                    backgroundImage: 'url(/images/video-thumbnail.jpg)'
                  }}
                >
                  {/* Overlay escuro para melhorar contraste */}
                  <div className="absolute inset-0 bg-black/30"></div>
                  
                  {/* Botão de Play centralizado */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 bg-white/95 rounded-full flex items-center justify-center shadow-2xl hover:bg-white transition-all transform hover:scale-110 border-4 border-white">
                      <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition-all shadow-lg">
                        <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Overlay de informações */}
                <div className="absolute top-4 left-4 right-4 bg-black/80 rounded-lg p-3 text-white text-sm text-center">
                  <p className="font-semibold">
                    🎯 Aperte o play assista vídeo de 40 segundos e entenda como funciona
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Botão CTA após vídeo */}
      <section className="px-4 py-6 bg-white">
        <div className="max-w-sm mx-auto text-center">
              <button
            onClick={() => handleWhatsApp('Olá! Quero agendar minha avaliação personalizada de 30 minutos com a coach brasileira por $10.')}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            📅 QUERO AGENDAR MINHA AVALIAÇÃO
              </button>
        </div>
      </section>

      {/* Seção Motivacional */}
      <section className="px-4 py-8 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-sm mx-auto text-center space-y-6">
          {/* Banner de Atenção */}
          <div className="bg-blue-100 border border-blue-300 rounded-xl p-4">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-red-500 text-xl">⚠️</span>
              <p className="text-brand-text font-semibold">ATENÇÃO: Oferta Limitada</p>
            </div>
          </div>

          {/* Título Principal */}
          <h1 className="text-2xl font-bold text-brand-text leading-tight">
            Descubra Por Que Você Não Está<br/>Alcançando Seus Objetivos
          </h1>

          {/* Subtítulo */}
          <p className="text-lg text-brand-text2">
            30 minutos que podem mudar sua vida para sempre
          </p>

          {/* Preço */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-yellow-300 text-xl">💰</span>
              <span className="text-2xl font-bold">APENAS $10</span>
            </div>
          </div>

          {/* Urgência */}
          <div className="bg-green-100 border border-green-300 rounded-xl p-4">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-yellow-500 text-xl">⚠️</span>
              <p className="text-green-800 font-semibold">
                Apenas 5 vagas disponíveis esta semana para avaliação
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Conteúdo Principal */}
      <section className="px-4 py-6">
        <div className="max-w-sm mx-auto space-y-6">
          
          {/* O que é a Avaliação */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-brand-border">
            <h2 className="text-xl font-bold text-brand-text mb-4 flex items-center">
              <span className="text-2xl mr-3">🎯</span>
              O que é a Avaliação Personalizada?
            </h2>
            <p className="text-brand-text2 leading-relaxed mb-4">
              Uma consultoria completa e personalizada com uma coach brasileira especializada em bem-estar, 
              desenvolvida especificamente para brasileiros que vivem nos Estados Unidos.
            </p>
            <p className="text-brand-text2 leading-relaxed">
              Através de uma análise detalhada do seu estilo de vida, hábitos alimentares e objetivos, 
              criamos um plano personalizado para sua jornada de bem-estar.
            </p>
          </div>

          {/* Como Funciona */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-brand-border">
            <h2 className="text-xl font-bold text-brand-text mb-4 flex items-center">
              <span className="text-2xl mr-3">⚙️</span>
              Como Funciona?
            </h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-brand-green text-white rounded-full font-bold">1</span>
                <div>
                  <h3 className="font-bold text-brand-text">Agendamento</h3>
                  <p className="text-sm text-brand-text2">Escolha o melhor horário para sua sessão via WhatsApp.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-brand-green text-white rounded-full font-bold">2</span>
                <div>
                  <h3 className="font-bold text-brand-text">Questionário Pré-Avaliação</h3>
                  <p className="text-sm text-brand-text2">Preencha um breve formulário para a Coach entender seu perfil.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-brand-green text-white rounded-full font-bold">3</span>
                <div>
                  <h3 className="font-bold text-brand-text">Sessão Online</h3>
                  <p className="text-sm text-brand-text2">Converse com a Coach por videochamada (Zoom, Google Meet, etc.).</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-brand-green text-white rounded-full font-bold">4</span>
                <div>
                  <h3 className="font-bold text-brand-text">Plano de Ação</h3>
                  <p className="text-sm text-brand-text2">Receba um resumo e os próximos passos para sua transformação.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Benefícios */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-brand-border">
            <h2 className="text-xl font-bold text-brand-text mb-4 flex items-center">
              <span className="text-2xl mr-3">✨</span>
              Benefícios para Você
            </h2>
            <ul className="list-disc list-inside text-brand-text2 space-y-2">
              <li>Clareza sobre seus objetivos de saúde</li>
              <li>Motivação e suporte de uma especialista</li>
              <li>Estratégias adaptadas à sua realidade nos EUA</li>
              <li>Melhora na alimentação, energia e bem-estar geral</li>
              <li>Conexão com uma profissional que entende sua cultura</li>
            </ul>
          </div>

          {/* Oferta Principal */}
          <div className="bg-gradient-to-r from-green-100 to-green-200 rounded-xl p-6 shadow-lg border border-green-300 text-center">
            <h2 className="text-2xl font-bold text-brand-text mb-4 flex items-center justify-center">
              <span className="text-3xl mr-3">👩‍⚕️</span>
              Coach Brasileira de Bem-estar
            </h2>
            <p className="text-brand-text2 mb-4">
              Avaliação personalizada de 30 minutos por vídeo com coach brasileira especializada em qualidade de vida
            </p>
            <div className="bg-white rounded-lg p-4 mb-4">
              <p className="text-brand-green font-bold text-lg">
                <span className="line-through text-gray-500 mr-2">$37</span>
                <strong>por apenas $10</strong><br/>
                <span className="text-sm">Oferta exclusiva por 24h</span>
              </p>
            </div>
            <button 
              onClick={() => handleWhatsApp('Olá! Quero agendar minha avaliação personalizada de 30 minutos com a coach brasileira por $10.')}
              className="w-full bg-brand-green text-white px-6 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              💬 Agendar com Coach
            </button>
          </div>


          {/* Informações Importantes */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-brand-border text-center">
            <h3 className="text-lg font-bold text-brand-text mb-4">Informações Importantes</h3>
            <div className="space-y-2 text-brand-text2 text-sm">
              <p>⏱️ Duração: 30 minutos</p>
              <p>💻 Formato: Online (videochamada)</p>
              <p>🇧🇷 Idioma: Português</p>
              <p>👩‍⚕️ Coach: Brasileira especializada</p>
            </div>
            <p className="mt-4 text-brand-text font-medium">
              Invista em você e na sua saúde!
            </p>
          </div>

          {/* CTA Final */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-brand-text mb-4">Pronta para Transformar sua Saúde?</h2>
            <button 
              onClick={() => handleWhatsApp('Olá! Quero agendar minha avaliação personalizada de 30 minutos com a coach brasileira por $10.')}
              className="inline-block bg-brand-green text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              💬 AGENDAR MINHA AVALIAÇÃO
            </button>
          </div>
        </div>
      </section>

      {/* Bottom Navigation */}
      <BottomNavigation currentPage="/avaliacao-personalizada" />
    </div>
  )
}