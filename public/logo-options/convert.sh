#!/bin/bash

# Script para converter SVGs para PDF e JPEG
# Requer: brew install librsvg imagemagick

echo "🎨 Convertendo logos SVG para PDF e JPEG..."

# Função para converter SVG para PDF
convert_to_pdf() {
    local svg_file=$1
    local pdf_file=${svg_file%.svg}.pdf
    
    echo "Convertendo $svg_file para PDF..."
    
    # Usar rsvg-convert se disponível
    if command -v rsvg-convert &> /dev/null; then
        rsvg-convert -f pdf -o "$pdf_file" "$svg_file"
        echo "✅ PDF criado: $pdf_file"
    else
        echo "❌ rsvg-convert não encontrado. Instale com: brew install librsvg"
    fi
}

# Função para converter SVG para JPEG
convert_to_jpeg() {
    local svg_file=$1
    local jpeg_file=${svg_file%.svg}.jpg
    
    echo "Convertendo $svg_file para JPEG..."
    
    # Usar rsvg-convert + imagemagick se disponível
    if command -v rsvg-convert &> /dev/null && command -v convert &> /dev/null; then
        # Converter SVG para PNG primeiro
        local png_file=${svg_file%.svg}.png
        rsvg-convert -f png -o "$png_file" "$svg_file"
        
        # Converter PNG para JPEG
        convert "$png_file" -quality 95 -background white -flatten "$jpeg_file"
        
        # Remover arquivo PNG temporário
        rm "$png_file"
        
        echo "✅ JPEG criado: $jpeg_file"
    else
        echo "❌ Ferramentas não encontradas. Instale com: brew install librsvg imagemagick"
    fi
}

# Converter todos os arquivos SVG
for svg_file in *.svg; do
    if [ -f "$svg_file" ]; then
        echo ""
        echo "🔄 Processando: $svg_file"
        convert_to_pdf "$svg_file"
        convert_to_jpeg "$svg_file"
    fi
done

echo ""
echo "🎉 Conversão concluída!"
echo "📁 Arquivos criados:"
ls -la *.pdf *.jpg 2>/dev/null || echo "Nenhum arquivo PDF/JPEG encontrado"
