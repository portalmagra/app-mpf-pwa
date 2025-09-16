'use client'

import { useState, useEffect } from 'react'

export interface SavedItem {
  id: number
  nome: string
  descricao: string
  categoria: string
  link_pdf: string
  data_salvamento: string
  emoji: string
}

export const useSavedRecipes = () => {
  const [receitasSalvas, setReceitasSalvas] = useState<SavedItem[]>([])

  useEffect(() => {
    const savedRecipes = localStorage.getItem('minhasReceitas')
    if (savedRecipes) {
      setReceitasSalvas(JSON.parse(savedRecipes))
    }
  }, [])

  const salvarReceita = (receita: Omit<SavedItem, 'id' | 'data_salvamento'>) => {
    const novaReceita: SavedItem = {
      ...receita,
      id: Date.now(),
      data_salvamento: new Date().toLocaleDateString('pt-BR')
    }

    const novasReceitas = [...receitasSalvas, novaReceita]
    setReceitasSalvas(novasReceitas)
    localStorage.setItem('minhasReceitas', JSON.stringify(novasReceitas))
    return novaReceita
  }

  const removerReceita = (id: number) => {
    const novasReceitas = receitasSalvas.filter(receita => receita.id !== id)
    setReceitasSalvas(novasReceitas)
    localStorage.setItem('minhasReceitas', JSON.stringify(novasReceitas))
  }

  const isReceitaSalva = (nome: string) => {
    return receitasSalvas.some(receita => receita.nome === nome)
  }

  return {
    receitasSalvas,
    salvarReceita,
    removerReceita,
    isReceitaSalva
  }
}

export const useSavedProtocols = () => {
  const [protocolosSalvos, setProtocolosSalvos] = useState<SavedItem[]>([])

  useEffect(() => {
    const savedProtocols = localStorage.getItem('meusProtocolos')
    if (savedProtocols) {
      setProtocolosSalvos(JSON.parse(savedProtocols))
    }
  }, [])

  const salvarProtocolo = (protocolo: Omit<SavedItem, 'id' | 'data_salvamento'>) => {
    const novoProtocolo: SavedItem = {
      ...protocolo,
      id: Date.now(),
      data_salvamento: new Date().toLocaleDateString('pt-BR')
    }

    const novosProtocolos = [...protocolosSalvos, novoProtocolo]
    setProtocolosSalvos(novosProtocolos)
    localStorage.setItem('meusProtocolos', JSON.stringify(novosProtocolos))
    return novoProtocolo
  }

  const removerProtocolo = (id: number) => {
    const novosProtocolos = protocolosSalvos.filter(protocolo => protocolo.id !== id)
    setProtocolosSalvos(novosProtocolos)
    localStorage.setItem('meusProtocolos', JSON.stringify(novosProtocolos))
  }

  const isProtocoloSalvo = (nome: string) => {
    return protocolosSalvos.some(protocolo => protocolo.nome === nome)
  }

  return {
    protocolosSalvos,
    salvarProtocolo,
    removerProtocolo,
    isProtocoloSalvo
  }
}
