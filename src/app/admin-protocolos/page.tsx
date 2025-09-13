'use client'

import { useState } from 'react'
import Link from 'next/link'
import Logo from '@/components/Logo'

export default function AdminProtocolos() {
  const [protocols, setProtocols] = useState([
    {
      id: 1,
      name: '7 Dias Detox',
      description: 'Protocolo de desintoxicação e energia',
      duration: 7,
      price: 0,
      pdfLink: 'https://drive.google.com/file/d/1detox123/view',
      status: 'active',
      accessLink: 'https://app.meuportalfit.com/protocolo/1'
    },
    {
      id: 2,
      name: '14 Dias Energia',
      description: 'Protocolo para aumentar energia e vitalidade',
      duration: 14,
      price: 47,
      pdfLink: 'https://drive.google.com/file/d/1energia456/view',
      status: 'active',
      accessLink: 'https://app.meuportalfit.com/protocolo/2'
    },
    {
      id: 3,
      name: '30 Dias Emagrecimento',
      description: 'Protocolo completo para emagrecimento saudável',
      duration: 30,
      price: 97,
      pdfLink: 'https://drive.google.com/file/d/1emagrecer789/view',
      status: 'active',
      accessLink: 'https://app.meuportalfit.com/protocolo/3'
    }
  ])

  const [newProtocol, setNewProtocol] = useState({
    name: '',
    description: '',
    duration: 7,
    price: 0,
    pdfLink: '',
    status: 'active'
  })

  const [showForm, setShowForm] = useState(false)

  const handleAddProtocol = () => {
    if (newProtocol.name && newProtocol.description && newProtocol.pdfLink) {
      const id = Math.max(...protocols.map(p => p.id)) + 1
      const accessLink = `https://app.meuportalfit.com/protocolo/${id}`
      
      const protocol = {
        id,
        ...newProtocol,
        accessLink
      }
      
      setProtocols([...protocols, protocol])
      setNewProtocol({
        name: '',
        description: '',
        duration: 7,
        price: 0,
        pdfLink: '',
        status: 'active'
      })
      setShowForm(false)
    }
  }

  const toggleProtocolStatus = (id: number) => {
    setProtocols(protocols.map(protocol => 
      protocol.id === id 
        ? { ...protocol, status: protocol.status === 'active' ? 'inactive' : 'active' }
        : protocol
    ))
  }

  const copyAccessLink = (link: string) => {
    navigator.clipboard.writeText(link)
    alert('Link copiado para a área de transferência!')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Logo variant="horizontal" size="md" />
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-sm text-gray-600 hover:text-brand-green transition-colors">
                ← Voltar ao App
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">📋 Admin Protocolos</h1>
          <p className="text-gray-600">Gerencie protocolos nutricionais e gere links únicos de acesso</p>
        </div>

        {/* Add Protocol Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-brand-blue text-white px-6 py-3 rounded-lg font-medium hover:bg-brand-blueDark transition-colors"
          >
            {showForm ? 'Cancelar' : '+ Adicionar Novo Protocolo'}
          </button>
        </div>

        {/* Add Protocol Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Novo Protocolo</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Protocolo</label>
                <input
                  type="text"
                  value={newProtocol.name}
                  onChange={(e) => setNewProtocol({...newProtocol, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-brand-blue focus:outline-none"
                  placeholder="Ex: 14 Dias Energia"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duração (dias)</label>
                <input
                  type="number"
                  value={newProtocol.duration}
                  onChange={(e) => setNewProtocol({...newProtocol, duration: Number(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-brand-blue focus:outline-none"
                  placeholder="7, 14, 30..."
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                <textarea
                  value={newProtocol.description}
                  onChange={(e) => setNewProtocol({...newProtocol, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-brand-blue focus:outline-none"
                  rows={3}
                  placeholder="Descrição do protocolo..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preço (R$)</label>
                <input
                  type="number"
                  value={newProtocol.price}
                  onChange={(e) => setNewProtocol({...newProtocol, price: Number(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-brand-blue focus:outline-none"
                  placeholder="0 para gratuito"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={newProtocol.status}
                  onChange={(e) => setNewProtocol({...newProtocol, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-brand-blue focus:outline-none"
                >
                  <option value="active">Ativo</option>
                  <option value="inactive">Inativo</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Link do PDF (Google Drive)</label>
                <input
                  type="url"
                  value={newProtocol.pdfLink}
                  onChange={(e) => setNewProtocol({...newProtocol, pdfLink: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-brand-blue focus:outline-none"
                  placeholder="https://drive.google.com/file/d/..."
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleAddProtocol}
                className="bg-brand-blue text-white px-6 py-3 rounded-lg font-medium hover:bg-brand-blueDark transition-colors"
              >
                Salvar Protocolo
              </button>
            </div>
          </div>
        )}

        {/* Protocols List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Protocolos Cadastrados</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Protocolo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duração</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preço</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {protocols.map(protocol => (
                  <tr key={protocol.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{protocol.name}</div>
                        <div className="text-sm text-gray-500">{protocol.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{protocol.duration} dias</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${
                        protocol.price === 0 ? 'text-green-600' : 'text-blue-600'
                      }`}>
                        {protocol.price === 0 ? 'GRATUITO' : `R$ ${protocol.price}`}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        protocol.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {protocol.status === 'active' ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => toggleProtocolStatus(protocol.id)}
                          className={`px-3 py-1 rounded text-xs ${
                            protocol.status === 'active'
                              ? 'bg-red-100 text-red-700 hover:bg-red-200'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          {protocol.status === 'active' ? 'Desativar' : 'Ativar'}
                        </button>
                        <button
                          onClick={() => copyAccessLink(protocol.accessLink)}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200"
                        >
                          Copiar Link
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-blue-800 mb-3">📋 Instruções</h3>
          <div className="text-blue-700 space-y-2">
            <p>• <strong>PDFs:</strong> Armazene os PDFs no Google Drive e cole o link aqui</p>
            <p>• <strong>Links Únicos:</strong> Cada protocolo gera automaticamente um link único</p>
            <p>• <strong>Status:</strong> Use &quot;Inativo&quot; para pausar vendas temporariamente</p>
            <p>• <strong>Preços:</strong> R$ 0 = protocolo gratuito</p>
            <p>• <strong>Duração:</strong> Especifique quantos dias dura o protocolo</p>
          </div>
        </div>
      </main>
    </div>
  )
}
